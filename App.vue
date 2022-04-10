<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// 锁定屏幕竖直方向
			plus.screen.lockOrientation("portrait-primary");
			// 获取设备信息
			uni.getSystemInfo({
				success: (res) => {
					console.log(res);
					this.globalData.Systeminfo.systemwidth = res.safeArea.width;
					this.globalData.Systeminfo.systemtop = res.safeArea.top;
				}
			})
		},
		onShow: function() {
			console.log('App Show');
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					console.log(res);
					getApp().globalData.latitude = res.latitude;
					getApp().globalData.longitude = res.longitude;
				}
			});
		},
		onHide: function() {
			console.log('App Hide')
		},
		// 全局变量
		globalData: {
			// 当前位置
			latitude: "",
			longitude: "",
			cityname: "",
			// 行政区划代码
			adcode: "",
			// 获取用户设备信息
			Systeminfo: {
				systemwidth: "",
				systemtop: "",
				systemheight: "",
			},
			// 播放列表
			Song: [],
			iflogin: false,
			// qqinfo
			qq: {
				logined: "",
				nickName: "",
				openId: "",
				avatarUrl: ""
			},
			// weiboinfo
			weibo: {
				logined: "",
				nickName: "",
				openId: "",
				avatarUrl: ""
			},
			// wechatinfo
			wechat: {
				logined: "",
				nickName: "",
				openId: "",
				avatarUrl: ""
			},
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
