<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
.container{
	width: 100%;
	height: calc(100vh - 60px);
	overflow: hidden;
	box-sizing: border-box;
}
.container scroll-view{
	height: 100%;
	box-sizing: border-box;
}
.container scroll-view .scrollContainer{
	padding: 0rpx 32rpx;
	box-sizing: border-box;
}
.fixbg{
	position: fixed;
	width: 100%;
	height: 100vh;
	left: 0;
	top: 0;
	/* https://z3.ax1x.com/2021/07/14/WZ6D8P.png */
	/* https://z3.ax1x.com/2021/07/14/WZ6Oa9.png */
	/* background-image:url('https://z3.ax1x.com/2021/07/14/WZ6Oa9.png'); */
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	filter: blur(12px);
	
}
</style>
