<template>
	<view>
		<WHeader title="网易云音乐" :isIcon="isIcon"></WHeader>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="scrollContainer">
					<view class="avatar">
						<view class="avatar-container">
							<view class="avatar-left" v-if="islogin">
								<image src="../../static/logo.png" mode=""></image>
								<text>测试用户</text>
							</view>
							<view class="avatar-left" v-else>
								<image :src="userInfo.avatar"></image>
								<text>{{userInfo.nickName}}</text>
							</view>
							<view class="avatar-right">
								<button  v-if="isUserInfo"  @tap='logout'>退出登录</button>  
								<button v-else @tap="getuserInfo" open-type="getUserProfile" >点击登录</button>
							</view>
						</view>
					</view>
					<view class="search" @tap='navToSearch'>
						<uni-search-bar placeholder="搜索歌曲" cancelButton='none' radius="50" bgColor="#f7f7f7">
						</uni-search-bar>
					</view>

					<view>
						<view class="banner">
							<image src="../../static/banner.jpg" mode="widthFix"></image>
						</view>
						<view class="index-list">
							<view class="index-list-item" v-for="(item,index) in musicList" :key="item.id"
								@tap="listPage(item.id)">
								<view class="musicimg">
									<image :src="item.coverImgUrl" mode="widthFix"></image>
									<view class="tips">{{item.updateFrequency}}</view>
								</view>
								<view class="index-list-music">
									<view class="music-title" v-for="(songItem,index) in item.tracks" :key='index'>
										{{index+1}}.{{songItem.first}} - {{songItem.second}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import WHeader from "../../components/WHeader/WHeader.vue"
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";

	import {
		topList,
		getUserInfo
	} from "../../http/homePage.js"
	export default {
		data() {
			return {
				isIcon: false,
				musicList: [],
				islogin: false,
				isloading: true,
				isUserInfo:false,
				userInfo:{
					nickName:'未登录',
					avatar:'https://z3.ax1x.com/2021/07/14/WZ6D8P.png'
				}
				
			}
		},
		components: {
			WHeader,
			mForSkeleton

		},
		onLoad() {
			this.isloading = true
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			this.getHomeList();
			uni.login({
			  provider: 'weixin',
			  success:  (authResult)=> {
				console.log('run');
			    console.log(authResult);
			  },
			  fail(e) {
			  	console.log(e);
			  }
			});
			
		},
		methods: {
			async getHomeList() {
				this.musicList = await topList();
				uni.hideLoading();
				this.isloading = false
			},
			listPage(listid) {
				uni.navigateTo({
					url: '/pages/list/list?listid=' + listid,
				});
			},
			navToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
			,getuserInfo(){
				uni.getUserProfile({
					desc:'登录测试',
					success:(res)=> {
						console.log(res.userInfo);
						this.isUserInfo=true;
						this.userInfo.nickName = res.userInfo.nickName;
						this.userInfo.avatar = res.userInfo.avatarUrl
					},
					fail:(e)=> {
						console.log(e);
						this.isUserInfo=false
						uni.showToast({
						    title: '获取失败了',
						    duration: 2000,
							icon:false
						});
					}
				})
			},
			logout(){
				this.isUserInfo=false
				this.userInfo.nickName='未登录'
				this.userInfo.avatar = 'https://z3.ax1x.com/2021/07/14/WZ6D8P.png'
			}
		}
	}
</script>

<style scoped lang="scss">
	.search {
		width: 100%;
		margin-bottom: 30rpx;
	}


	.avatar {
		margin-top: 15rpx;

		.avatar-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 15rpx, 0rpx;

		}

		.avatar-left {
			display: flex;
			align-items: center;

			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
			}

			text {
				padding-left: 20rpx;
				font-size: 24rpx;
				color: #979797;
			}
		}

		.avatar-right {
			button{
				border: 1rpx solid #979797;
				box-sizing: border-box;
				padding: 0rpx 20rpx;
				border-radius: 50rpx;
				font-size: 24rpx;
				color: #191919;
				background-color: white;
			}
		}

	}

	.banner {
		border-radius: 10rpx;
		width: 686rpx;
		height: 264rpx;
		background-color: #DD524D;
		overflow: hidden;

		image {
			width: 100%;
		}
	}

	.index-list {
		margin-top: 30rpx;

		.index-list-item {
			display: flex;
			margin-bottom: 34rpx;

			.musicimg {
				flex: 0 0 212rpx;
				width: 212rpx;
				height: 212rpx;
				position: relative;
				border-radius: 10rpx;
				overflow: hidden;

				.tips {
					position: absolute;
					color: white;
					left: 12rpx;
					bottom: 8rpx;
					font-size: 22rpx;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}

			.index-list-music {
				padding-top: 8rpx;
				box-sizing: border-box;
				margin-left: 24rpx;
				font-size: 24rpx;
				line-height: 68rpx;

				.music-title {
					@include text-overflow;
					color: #595959;
				}

			}
		}
	}

	/deep/ uni-search-bar {
		padding: 16rpx 0rpx;

		.uni-searchbar {
			padding: 16rpx 0rpx
		}

		.uni-searchbar__box {
			border: 0px;
			-webkit-justify-content: flex-start;
			justify-content: flex-start;
			height: 75rpx;

			.uni-searchbar__text-placeholder {
				margin-left: 0rpx;
			}
		}
	}
</style>
