<template>
	<view class="detail">
		<view class="fixbg" :style="'background-image:url('+songDetails.al.picUrl+')'"></view>
		<!-- <view class="fixbg" :style="'background-image:url(https://z3.ax1x.com/2021/07/15/WnrBlV.jpg)'"></view> -->
		<WHeader :title="songDetails.name" :isIcon="true" color="white"></WHeader>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="scrollContainer" v-if="!isLoading">
					<image class="logo" src="https://z3.ax1x.com/2021/07/15/WnQFY9.png" mode=""></image>
					<view class="song-play" @tap='handletoPlay'>
						<!-- https://z3.ax1x.com/2021/07/15/WnM7dg.png die -->
						<!-- https://z3.ax1x.com/2021/07/15/WnMxyV.png bofang -->
						<!-- https://z3.ax1x.com/2021/07/15/WnQFY9.png logo -->
						<image :src="songDetails.al.picUrl" :class="{'animation-run': isPlay}"></image>
						<text class="iconfont wicon-pause" :class="iconPlay"></text>
						<view class="song-decoration"></view>
					</view>
					<view class="song-lyrics">
						<view class="song-lyrics-wrap" v-if="!songlyric"> 
							<view class="song-lyrics-item" >暂无歌词</view>
						 </view>
						<view class="song-lyrics-wrap" v-else :style="'transform:translateY('+ - (lyricIndex -1) * 68 +'rpx)'">
							<!-- active -->
							<view class="song-lyrics-item" v-for="(item,index) in songlyric" :key='item.time'
								:class="{active:lyricIndex === index}">{{item.lyric}}</view>

						</view>
					</view>
					<view class="song-share">
						<text class="song-share-desc">在网易云音乐获取更多歌词</text>
						<!-- #ifdef MP-WEIXIN -->
						<button type="default" open-type="share" class="btn-share">
							<text class="iconfont icon-fenxiang"></text>分享给微信好友
						</button>
						<!-- #endif -->
					</view>
					<view class="list-main-song" v-if="songSimi">
						<view class="like-song-title">喜欢这首歌的人也听</view>
						<!-- todo 一键收听 -->
						<view class="list-main-song-item" v-for="(item,index) in songSimi" :key='item.id'
							@tap="navtoSong(item.id)">
							<view class="song-item-img">
								<image :src="item.album.picUrl"></image>
							</view>
							<view class="song-item">
								<view class="song-name">{{item.name}}</view>
								<view class="song-details">
									<image v-if="  item.privilege.maxbr === 999000"
										src="https://z3.ax1x.com/2021/07/14/WZb7M4.png">
									</image>

									<image v-if="item.privilege.flag>=64 && item.privilege.flag <= 70"
										src="https://z3.ax1x.com/2021/07/14/WewJU0.png"></image>
									<text class="song-author">{{item.artists[0].name}} - {{item.name}}</text>
								</view>
							</view>
							<view class="iconfont icon-ziyuan"></view>
						</view>
					</view>
					<view class="song-comment">
						<view class="like-song-title">精彩评论</view>

						<view class="song-comment-item" v-for="(item,index) in songComment" :key="item.commentId">
							<view class="comment-avactor">
								<image v-if=item.user.avatarUrl :src="item.user.avatarUrl">
								</image>
							</view>

							</image>
							<view class="commnet-container">
								<view class="comment-header">
									<view class="comment-name">
										<view class="name">{{item.user.nickname}}</view>
										<view class="time">{{item.time | dateFormat}}</view>
									</view>
									<view class="comment-like">
										<text class="like-count">{{item.likedCount |countFormat}}</text>
										<text class="iconfont icon-dianzan"></text>
									</view>
								</view>
								<view class="comment-content">
									{{item.content}}
								</view>
							</view>
						</view>
					</view>
					<view class="btn-download">
						<button type="default" class="btn-down">下载云音乐查看更多精彩评论</button>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import WHeader from "../../components/WHeader/WHeader.vue"
	import {
		getSongURl,
		getSongComment,
		getSongDetail,
		getSongLyric,
		getSongSimi
	} from "../../http/detail.js"
	export default {
		data() {
			return {
				songDetails: {
					al: {
						picUrl: ''
					}
				},
				songSimi: '',
				songComment: {},
				songlyric: [],
				songURl: {},
				lyricIndex: 0,
				iconPlay: 'icon-zanting',
				isPlay: true,
				bgAudioMannager: '',
				timer: '',
				isLoading:true
			};
		},
		components: {
			WHeader
		},
		onLoad(option) {
			this.getSong(option.songId)

		},
		onHide() {
			this.stopLyric()
		},
		onUnload() {
			this.stopLyric()
			// #ifdef H5
				this.bgAudioMannager.destroy()
			// #endif
		},
		methods: {
			async getSong(songId) {
				 this.$store.commit('getNextListId',songId)
				console.log('nextId',this.$store.state.nextId);
				// console.log('list',this.$store.state.songListId);
				uni.showLoading({
					title: '音乐加载中....',
					mask: false
				});
				this.isLoading = true
				const songDetail = await getSongDetail(songId);
				if (songDetail[1].statusCode === 200) {
					this.songDetails = songDetail[1].data.songs[0]
				} else {
					return
				}
				const songSimi = await getSongSimi(songId);
				if (songSimi[1].statusCode === 200) {
					this.songSimi = songSimi[1].data.songs
				} else {
					return
				}
				const songComment = await getSongComment(songId)
				if (songComment[1].statusCode === 200) {
					this.songComment = songComment[1].data.hotComments

				} else {
					return
				}
				const songlyric = await getSongLyric(songId)
				if (songlyric[1].statusCode === 200) {
					if(songlyric[1].data.lrc.lyric){
						let result = songlyric[1].data.lrc.lyric || '暂无'
						let req = /\[([^\]]+)\]([^\[]+)/g
						result.replace(req, ($0, $1, $2) => {
							this.songlyric.push({
								"time": this.formLyric($1),
								"lyric": $2
							})
						}) 
					}
					else{
						this.songlyric = ''
					}

				} else {
					return
				}
				const songURl = await getSongURl(songId)
				if (songURl[1].statusCode === 200) {
					this.songURl = songURl[1].data.data[0].url || ' '
					// #ifdef MP-WEIXIN
					this.bgAudioMannager = uni.getBackgroundAudioManager();
					this.bgAudioMannager.title = this.songDetails.name;
					this.bgAudioMannager.src = this.songURl;
					// #endif
					// #ifdef H5
					if (!this.bgAudioMannager) {
						this.bgAudioMannager = uni.createInnerAudioContext();
						this.bgAudioMannager.src = this.songURl;
					}
					this.isPlay = false
					this.iconPlay = 'icon-ziyuan'
					// #endif
					this.scrollLyric()
					// 监听歌曲播放与展厅
					this.bgAudioMannager.onPlay(() => {
						this.isPlay = true
						this.iconPlay = 'icon-zanting'
						this.scrollLyric()
					});
					this.bgAudioMannager.onPause(() => {
						this.isPlay = false
						this.iconPlay = 'icon-ziyuan'
						this.stopLyric()
					});
					this.bgAudioMannager.onEnded(()=>{
						if(this.$store.state.nextId){
							this.getSong(this.$store.state.nextId)
						}
						else{
							this.isPlay =false
							this.iconPlay = 'icon-ziyuan'
						}
						
					})
				} else {
					return
				}
				 uni.hideLoading();
				 this.isLoading=false
			},
			formLyric(val) {
				let res = val.split(':')
				return (parseFloat(res[0] * 60) + parseFloat(res[1])).toFixed(1);
			},
			// 点击来调用这个播放暂停放大
			handletoPlay() {

				if (this.bgAudioMannager.paused) {
					this.bgAudioMannager.play()
				} else {
					this.bgAudioMannager.pause()
				}
			},
			navtoSong(songId) {
				//清空歌词索引，歌曲数组，不然会影响
				this.lyricIndex = ''
				this.songlyric = []
				clearInterval(this.timer)
				this.getSong(songId)
			},
			scrollLyric() {
				//节流
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					for (let i = 0; i < this.songlyric.length; i++) {
						// 到歌曲尾声
						if (this.bgAudioMannager.currentTime > this.songlyric[this.songlyric.length - 1].time) {
							this.lyricIndex = this.songlyric.length - 1
							break;
						}
						// 到歌曲尾声正在唱
						if (this.bgAudioMannager.currentTime >= this.songlyric[i].time && this.bgAudioMannager
							.currentTime <= this.songlyric[i + 1].time) {
							this.lyricIndex = i


						}
					}
				}, 500)
			},
			stopLyric() {
				clearInterval(this.timer)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.logo {
		position: absolute;
		width: 194rpx;
		height: 42rpx;
		left: 22rpx;
		top: 44rpx;
	}

	.song-play {
		position: relative;
		width: 582rpx;
		height: 582rpx;
		background: url('https://z3.ax1x.com/2021/07/15/WnM7dg.png');
		background-size: cover;
		margin: 238rpx auto 0 auto;

		image {
			border-radius: 50%;
			width: 350rpx;
			height: 350rpx;
			@include block-center animation: move 8s infinite linear;
			animation-play-state: paused;
		}

		.animation-run {
			animation-play-state: running
		}

		@keyframes move {
			form {
				transform: rotate(0deg);
			}

			to {
				transform: rotate(360deg);
			}
		}

		.wicon-pause {
			width: 100rpx;
			height: 100rpx;
			display: block;
			line-height: 100rpx;
			border-radius: 50%;
			background-color: rgba($color: #999, $alpha: 0.8);
			background-size: cover;
			position: absolute;
			font-size: 100rpx;
			color: white;
			@include block-center
		}

		.song-decoration {
			position: absolute;
			width: 230rpx;
			height: 360rpx;
			background-image: url('https://z3.ax1x.com/2021/07/15/WnMxyV.png');
			background-size: cover;
			@include block-center;
			top: -680rpx;
			left: 76rpx;
		}
	}

	.song-lyrics {
		text-align: center;
		color: white;
		height: 272rpx;
		overflow: hidden;

		.song-lyrics-wrap {
			transition: .5s;
		}

		.song-lyrics-item {
			font-size: 30rpx;
			line-height: 68rpx;
			opacity: 0.6;
		}

		.active {
			opacity: 1;
		}
	}

	.song-share {
		width: 100%;

		.song-share-desc {
			line-height: 74rpx;
			font-size: 30rpx;
			color: white;
			opacity: 0.8;
			text-align: center;
			display: block;
			margin: 0 auto;
			text-decoration: underline;
		}

		.btn-share {
			margin-top: 66rpx;
			background: none;
			border: solid 1rpx white
		}
	}

	.like-song-title {
		line-height: 155rpx;
		font-size: 34rpx;
		color: white;
	}

	.list-main-song {
		margin-top: 40rpx;

		.list-main-song-item {
			display: flex;
			flex-wrap: wrap;
			box-sizing: border-box;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;
		}

		.song-item-img {
			text-align: center;
			width: 82rpx;
			height: 82rpx;
			flex: 0 0 82rpx;
			border-radius: 10rpx;
			overflow: hidden;
			font-size: 32rpx;
			color: #8f8f8f;
			margin-right: 22rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.song-item {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 30rpx;
			line-height: 38rpx;

			.song-name {
				color: white;
				@include text-overflow
			}

			.song-details {
				font-size: 20rpx;
				color: white;
				display: flex;
				flex-wrap: nowrap;
				align-items: center;

				image {
					flex-shrink: 1;
				}

				.song-author {
					opacity: 0.5;
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
			opacity: 0.5;
		}
	}

	.song-comment {
		.commnet-container {
			flex: 1;
		}

		.song-comment-item {
			display: flex;
			margin-bottom: 26rpx;

			.comment-avactor {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
				flex: 0 0 64rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.commnet-container {
				.comment-header {
					display: flex;
					justify-content: space-between;
					color: white;
				}

				.comment-name {}

				.name {
					font-size: 22rpx;
					line-height: 35rpx;
					opacity: 0.8;
				}

				.time {
					font-size: 18rpx;
					opacity: 0.5;
					letter-spacing: 1rpx;
				}

				.comment-like {
					opacity: 0.8;
				}

				.like-count {
					font-size: 18rpx;
					margin-right: 10rpx;
				}

				.icon-dianzan {
					font-size: 32rpx;
				}

				.comment-content {
					margin-top: 10rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					color: white;
					padding-bottom: 26rpx;
					border-bottom: 1rpx solid #595957;
				}
			}
		}
	}

	.btn-down {
		height: 70rpx;
		color: white;
		font-size: 26rpx;
		border-radius: 35rpx;
		background-color: rgba($color: #1c1c1c, $alpha:0.6);
		margin-bottom: 82rpx;

	}
</style>
