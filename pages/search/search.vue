<template>
	<view class="searchPage">
		<WHeader title="搜索" :isIcon="isIcon" :iconColor='true'></WHeader>
		<view class="container">
			<scroll-view scroll-y="true" :scroll-top='scrollTop' @scroll="scroll">
				<view class="search">
					<uni-search-bar v-model="searchValue" @input="inputWord" @confirm="tapConfirmWord(searchValue)" @clear='clearSearch'
						placeholder="搜索歌曲" cancelButton='none' radius="50" bgColor="#f7f7f7">
					</uni-search-bar>
				</view>
				<view class="scrollContainer">
					<block v-if="blockType ===1">
						<view class="search-history">
							<view class="search-history-header">
								<text class="title">历史记录</text>
								<text class="iconfont icon-icon--" @tap='clearsearchHistory'></text>
							</view>
							<view class="search-history-list">
								<view class="list-item" v-for="(item,index) in searchHistory" :key="index"
									@tap='tapHotSearch(item)'>{{item}}</view>
							</view>
						</view>
						<view class="search-hot">
							<view class="search-hot-header">
								<text>热搜榜</text>
							</view>
							<view class="search-hot-list" v-if="hotList">
								<view class="search-hot-item" v-for="(item,index) in hotList" :key='index'
									@tap='tapHotSearch(item.searchWord)'>
									<view class="item-index">
										<text class='active' v-if="index<3">{{index+1}}</text>
										<text v-else>{{index+1}}</text>

									</view>
									<view class="item-container">
										<view class="item-name">
											<text class="name">{{item.searchWord}}</text>

											<view class="iconTip">
												<image :src="item.iconUrl" mode="aspectFit"></image>
											</view>

										</view>
										<view class="item-des">
											<view class="des">{{item.content}}</view>
										</view>
									</view>
									<view class="item-count">
										<text class="countAmount">{{item.score}}</text>
									</view>
								</view>
							</view>
						</view>
					</block>
					<block v-if="blockType ===2">
						<view class="result-container">
							<view class="result-item" v-for="(item,index) in songResult" :key='item.id'
								@tap='navToSong(item.id)'>
								<view class="result-right">
									<view class="song-name">{{item.name}}</view>
									<view class="song-des">
										<image v-if="item.mark>60 && item.mark<70"
											src="https://z3.ax1x.com/2021/07/14/WZb7M4.png"></image>
										<image v-if="item.copyrightId !==0"
											src="https://z3.ax1x.com/2021/07/14/WewJU0.png"></image>
										<text>{{item.artists[0].name}} - {{item.album.name}}</text>
									</view>
								</view>
								<view class="result-left">
									<text class="iconfont icon-ziyuan"></text>
								</view>
							</view>


						</view>
					</block>
					<block v-if="blockType ===3">
						<view class="search-container">
							<view class="search-header">
								<text>搜索“{{searchValue}}”</text>
							</view>
							<view class="search-reuslt">
								<view class="search-reuslt-item" v-for="(item,index) in songSuggest" :key='index' @tap='tapConfirmWord(item.keyword)'>
									<text class="iconfont icon-fangdajing"></text>
									<text>{{item.keyword}}</text>
								</view>
							</view>
						</view>
					</block>
				</view>

			</scroll-view>
		</view>
	</view>
</template>

<script>
	import WHeader from "../../components/WHeader/WHeader.vue"
	import {
		getHotDetails,
		getSongResult,
		getSongTip
	} from "../../http/search.js"
	export default {
		data() {
			return {
				isIcon: true,
				hotList: [],
				searchValue: '',
				searchHistory: [],
				blockType: 1,
				songResult: [],
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				songSuggest:[]
			};
		},
		components: {
			WHeader
		},
		onLoad() {
			this.getHotDetails(),
				this.getsearchHistory()
		},
		methods: {
			async getHotDetails() {
				let result = await getHotDetails()
				if (result[1].statusCode === 200) {
					this.hotList = result[1].data.data
				} else {
					uni.showToast({
						title: '数据崩坏',
						icon: "none",
						duration: 2000

					});
				}
			},
			tapHotSearch(value) {
				this.searchValue = value
				this.tapConfirmWord(value)
			},
			scroll(e) {

				this.old.scrollTop = e.detail.scrollTop
			},
			topScroll() {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			tapConfirmWord(value) {
				if (value.trim() !== '') {
					this.searchHistory.unshift(value)
					this.searchHistory = [...new Set(this.searchHistory)]
					this.searchHistory.length > 10 ? this.searchHistory.length = 10 : this.searchHistory.length
					uni.setStorage({
						key: 'searchHistory',
						data: this.searchHistory,
					})
					this.blockType = 2
					this.topScroll()
					this.getSongResult(value)
				}
			},
			getsearchHistory() {
				uni.getStorage({
					key: "searchHistory",
					success: (res) => {
						this.searchHistory = res.data;
					}
				})
			},
			clearsearchHistory() {
				uni.removeStorage({
					key: 'searchHistory',
					success: () => {
						this.searchHistory = []
					}
				});
			},
			async getSongResult(value) {
				let result = await getSongResult(value)
				if (result[1].statusCode === 200) {
					this.songResult = result[1].data.result.songs
				} else {
					uni.showToast({
						title: '数据崩坏',
						icon: "none",
						duration: 2000

					});
				}
			},
			clearSearch() {
				this.blockType = 1
			},
			navToSong(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			,inputWord(e){
				let value = e
				if(value.trim()===''){
					this.blockType =1
					return
				}
				this.blockType=3
				this.getSongTip(value)
			},
			async getSongTip(word){
				let result = await getSongTip(word)
				if (result[1].statusCode === 200) {
					this.songSuggest = result[1].data.result.allMatch
				} else {
					uni.showToast({
						title: '数据崩坏',
						icon: "none",
						duration: 2000
				
					});
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.search {
		width: 100%;
		// margin-bottom: 20rpx;
		margin-top: 24rpx;
		padding: 0rpx 24rpx;
		box-sizing: border-box;
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

	.search-history {
		.search-history-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;

			.title {
				color: black;
				font-size: 28rpx;
			}

			.icon-icon-- {
				color: #ababab;
			}
		}

		.search-history-list {
			display: flex;
			flex-wrap: wrap;

			.list-item {
				padding: 18rpx 24rpx;
				color: black;
				font-size: 26rpx;
				border-radius: 40rpx;
				background: #f7f7f7;
				margin-right: 20rpx;
				margin-bottom: 22rpx;
			}
		}
	}

	.search-hot {
		.search-hot-header {
			margin-top: 70rpx;

			text {
				font-size: 28rpx;
				color: black;
			}
		}

		.search-hot-list {
			margin-top: 6rpx;
		}

		.search-hot-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 32rpx;
			padding-bottom: 32rpx;
			box-sizing: border-box;

			.item-index {
				width: 70rpx;
				flex: 0 0 70rpx;
				padding-left: 10rpx;
				box-sizing: border-box;

				text {
					color: black;
					font-size: 28rpx;

				}

				.active {
					color: #fe383a;
				}
			}

			.item-container {
				flex: 1;

				.item-name {}

				.name {
					font-size: 32rpx;
					color: black;
					@include text-overflow;
					max-width: 18em;

				}

				.iconTip {
					box-sizing: border-box;
					display: inline-block;
					margin-left: 12rpx;

					image {
						width: 50rpx;
						height: 24rpx;
					}
				}


				.item-des {}

				.des {
					font-size: 22rpx;
					color: #8e8e8e;
					@include text-overflow;
				}
			}

			.item-count {
				.countAmount {
					font-size: 22rpx;
					color: #cccccc
				}
			}
		}
	}

	.result-container {
		.result-item {
			border-bottom: 2rpx solid #e1e1e1;
			padding-top: 36rpx;
			padding-bottom: 22rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;

			.result-right {
				flex: 1;
			}

			.song-name {
				font-size: 30rpx;
				margin-bottom: 14rpx;
				@include text-overflow
			}

			.song-des {
				image {
					width: 32rpx;
					height: 18rpx;
					margin-right: 8rpx;
					transform: translateY(2rpx);
				}

				font-size: 20rpx;
				color: #bababa;
				@include text-overflow
			}

			.result-left {
				flex: 0 0 50rpx;
			}

			.icon-ziyuan {
				font-size: 50rpx;
				color: #bababa;
			}
		}
	}

	.search-container {
		padding: 0rpx 40rpx;

		.search-header {
			height: 96rpx;
			line-height: 96rpx;
			font-size: 28rpx;
			color: #4b77a7;

			text {}
		}

		.search-reuslt {}

		.search-reuslt-item {
			box-sizing: border-box;
			line-height: 108rpx;

			.icon-fangdajing {
				font-size: 48rpx;
				color: #c1c1c1;
				margin-right: 24rpx;
			}

			text:nth-child(2) {
				color: #666666;
				font-size: 28rpx;
			}
		}
	}
</style>
