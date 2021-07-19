<template>
	<view class="wheader" :style="'height:'+height+'px'">
		<view class="wheader-icon" v-if="isIcon" :style="'bottom:'+1+'px'"  :class="{'icon-dark':iconColor}">
			<text class="iconfont icon-zuojiantou" @tap="navBack"></text> <text class="sperator">|</text> <text
				class="iconfont icon-home" @tap="navHome"></text>
		</view>
		<!-- v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"-->
		<view class="wheader-title" :style="{ color: color, lineHeight: (height + 25) + 'px' }">{{title}}</view>
	</view>
</template>

<script>
	export default {
		name: "WHeader",
		data() {
			return {
				height: 30,

			};
		},
		computed: {

		},
		props: {
			title: {
				type: String
			},
			isIcon: {
				type: Boolean
			},
			color: {
				type: String
			},
			iconColor:{
				type: Boolean
			}
		},
		created() {

			var _this = this;
			uni.getSystemInfo({
				success: function(e) {
					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect()
					_this.height = custom.bottom + custom.top - e.statusBarHeight
					console.log('height', _this.height);
					uni.setStorageSync('barHeight', _this.height);

					// #endif
				}
			})
		},

		methods: {
			navBack() {
				uni.navigateBack()
			},
			navHome() {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			}
		},
	}
</script>

<style scoped>
	.wheader {
		/* background-color: #007AFF; */
		line-height: 75px;
		text-align: center;
		position: relative;
	}

	.wheader-icon {
		position: absolute;
		left: 12px;
		/* 		top: 26px; */
		line-height: 30px;
		width: 100px;
		height: 32px;
		border-radius: 17px;
		background-color: rgba(0, 0, 0, 0.3);
		color: white;
		display: inline-flex;
		justify-content: space-evenly;
		align-items: center;
		font-size: 0px;
	}

	.wheader-title {
		color: black;
		/* line-height: inherit; */
		font-size: 30rpx;
	}

	.sperator {
		opacity: 0.4;
		font-size: 16px;
		line-height: 30px;
		transform: translate(0px, -2px);
	}

	.icon-dark{
		color: #000000;
		background-color: white;
		border: 1rpx solid #eeeeee;
	}
</style>
