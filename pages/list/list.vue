<template>
	<view class="list">
		<!-- background-image:url('https://z3.ax1x.com/2021/07/14/WZ6Oa9.png'); -->
		<view class="fixbg" :style="'background-image:url('+playlist.coverImgUrl+')'"></view>
		<WHeader title="歌单" :isIcon="true" color="white"></WHeader>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="list-header">
					<view class="list-header-left">
						<image :src="playlist.coverImgUrl"></image>
						<text class="iconfont icon-yousanjiao">{{playlist.playCount | countFormat}}</text>
					</view>
					<view class="list-header-right">
						<view class="list-header-right-title">{{playlist.name}}</view>
						<view class="logo-name">
							<image :src="playlist.creator.avatarUrl"></image><text>{{playlist.creator.nickname}}</text>
						</view>
						<view class="list-header-right-desc">{{playlist.description}}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button type="default" open-type="share" class="btn-share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-main">
					<view class="list-main-header">
						<text class="iconfont icon-lianhe11"></text>
						<text class="title">播放全部</text>
						<text class="title-desc">(共{{playlist.trackCount}}首)</text>
					</view>
					<view class="list-main-song">
						<view class="list-main-song-item" v-for="(item,index) in playlist.tracks" :key="item.id"
							@tap="navToSong(item.id)">
							<view class="index-number">{{index + 1}}</view>
							<view class="song-item">
								<view class="song-name">{{item.name}}</view>
								<view class="song-details">
									<image v-if="item.copyright===1" src="https://z3.ax1x.com/2021/07/14/WZb7M4.png">
									</image>

									<image v-if="item.mark>60 && item.mark < 70"
										src="https://z3.ax1x.com/2021/07/14/WewJU0.png"></image>
									<text class="song-author">{{item.ar[0].name}} - {{item.name}}</text>
								</view>

							</view>
							<view class="iconfont icon-ziyuan"></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import WHeader from "../../components/WHeader/WHeader.vue"
	import {
		getListInfo
	} from "../../http/list.js"
	export default {
		data() {
			return {
				playlist: {
					coverImgUrl: '',
					playCount: "",
					description: '',
					trackCount: "",
					name: '',
					creator: {
						avatarUrl: '',
						nickname: ''
					},
					tracks: []
				}
			}
		},
		components: {
			WHeader
		},
		onLoad(options) {
			// console.log('id', options.listid);
			this.getListInfos(options.listid);
			uni.showLoading({
				title: '加载中...',
				mask: true
			});

		},
		methods: {
			async getListInfos(listId) {
				let result = await getListInfo(listId);
				if (result[1].statusCode) {
					this.playlist = result[1].data.playlist
					this.$store.commit("getsongListId",this.playlist.trackIds)
					uni.hideLoading();

				} else {
					uni.hideLoading();
				}

			},
			navToSong(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.list-header {
		display: flex;
		margin: 33rpx;

		.list-header-left {
			flex: 0 0 266rpx;
			width: 266rpx;
			height: 266rpx;
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;
			margin-right: 44rpx;

			image {
				width: 100%;
				height: 100%;
			}

			text {
				font-size: 24rpx;
				position: absolute;
				top: 10rpx;
				right: 12rpx;
				color: white;
			}
		}

		.list-header-right {
			flex: 1;

			.list-header-right-title {
				color: white;
				font-size: 34rpx;
				line-height: 46rpx;
			}

			.logo-name {
				display: flex;
				align-items: center;
				padding: 27rpx 0rpx;

				image {
					width: 55rpx;
					height: 55rpx;
					border-radius: 50%;
					margin-right: 12rpx;
				}

				text {
					font-size: 24rpx;
					color: rgba(255, 255, 255, 0.8);
				}
			}

			.list-header-right-desc {
				color: rgba(255, 255, 255, 0.7);
				line-height: 30rpx;
				font-size: 24rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				position: relative;
			}
		}
	}

	.btn-share {
		width: 330rpx;
		height: 70rpx;
		background: rgba(255, 255, 255, 0.2);
		font-size: 30rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 70rpx;
		border-radius: 35rpx;

		text {
			display: inline-block;
			line-height: 70rpx;
			margin-right: 12rpx;
			transform: translate(0, -3rpx);
		}
	}

	.list-main {
		margin-top: 40rpx;
		background-color: white;
		border-radius: 35rpx;

		box-sizing: border-box;
		padding: 36rpx 32rpx;
	}

	.list-main-header {
		height: 42rpx;

		text:first-child {

			font-size: 42rpx;
			color: #303031;
			margin-right: 30rpx;
			transform: translate(0, -3rpx);
			display: inline-block;
		}

		.title {
			line-height: 42rpx;
			font-size: 32rpx;
			color: #2f2e31;
			margin-right: 10rpx;
		}

		.title-desc {
			line-height: 42rpx;
			font-size: 24rpx;
			color: #bab9be;

		}
	}

	.list-main-song {
		margin-top: 40rpx;

		.list-main-song-item {
			display: flex;
			flex-wrap: wrap;
			box-sizing: border-box;
			justify-content: space-between;
			align-items: center;
		}

		.index-number {
			text-align: center;
			width: 42rpx;
			flex: 0 0 42rpx;
			line-height: 126rpx;
			font-size: 32rpx;
			color: #8f8f8f;
			margin-right: 30rpx;
		}
		.song-item {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 30rpx;
			line-height: 38rpx;

			.song-name {
				@include text-overflow
			}
			.song-details {
				font-size: 20rpx;
				color: #8f8f8f;
				display: flex;
				flex-wrap: nowrap;
				align-items: center;

				image {
					flex-shrink: 1;
				}

				.song-author {
					@include text-overflow
				}
			}
			image {
				width: 34rpx;
				height: 20rpx;
				margin-right: 8rpx;
			}
		}

		.icon-ziyuan {
			flex: 0 0 52rpx;
			font-size: 52rpx;
			color: #8f8f8f;
		}
	}


</style>
