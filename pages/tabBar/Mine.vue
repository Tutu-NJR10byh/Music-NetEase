<template>
	<view class="container">
		<view class="MyInfo">
			<view class="touxiang">
				<image :src="avatarUrl" mode="aspectFit"></image>
			</view>
			<view class="right">
				<view class="user">
					<view class="username">
						{{nickname}}
					</view>
					<view class="vip_level">
						<view class="level">
							Lv.6
						</view>
						<view class="vip">
							SVIP
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="today" v-if="logined">
			<view class="logined">
				<image src="../../static/assets/icon/Logined.png" mode="aspectFit"></image>
				<text>当且设备已登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import currentDate from "./gettime.js";

	export default {
		created: function() {
			let that = this;
			that.date = currentDate.getDate();
		},
		onShow: function() {
			let that = this;
			console.log(getApp().globalData.iflogin);
			if (getApp().globalData.iflogin == false) {
				// 自动检测是否登录，如果没有，自动跳转
				uni.navigateTo({
					url: "../Login/Login"
				})
			} else if (getApp().globalData.qq.logined == true) {
				that.logined = true;
				that.avatarUrl = getApp().globalData.qq.avatarUrl;
				that.nickname = getApp().globalData.qq.nickName;
			} else if (getApp().globalData.wechat.logined == true) {
				that.logined = true;
				that.avatarUrl = getApp().globalData.wechat.avatarUrl;
				that.nickname = getApp().globalData.wechat.nickName;
			} else if (getApp().globalData.weibo.logined == true) {
				that.logined = true;
				that.avatarUrl = getApp().globalData.weibo.avatarUrl;
				that.nickname = getApp().globalData.weibo.nickName;
			}
		},
		onPullDownRefresh: function() {
			let that = this;
			setTimeout(function() {
				console.log(currentDate.getDate());
				that.date = currentDate.getDate();
				console.log(that.avatarUrl);
				if (getApp().globalData.iflogin == false) {
					uni.navigateTo({
						url: "../Login/Login"
					})
				} else if (getApp().globalData.qq.logined == true) {
					that.avatarUrl = getApp().globalData.qq.avatarUrl;
					that.nickname = getApp().globalData.qq.nickName;
				}
			}, 1000);
			uni.stopPullDownRefresh();
		},
		data() {
			return {
				//是否登录
				logined: false,
				/* 用户信息 */
				avatarUrl: "", // 用户头像
				nickname: "", // 用户昵称
			}
		},
		methods: {
			// 跳转登录界面
			login() {
				uni.navigateTo({
					url: "../Login/Login"
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #f5f5f5;
	}

	.container {
		// border: 1px solid red;
		width: 750rpx;
		background-color: #f5f5f5;
		// iOS安全区域设置
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.MyInfo {
			width: 700rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.touxiang {
				// border: 1px solid red;
				width: 120rpx;
				height: 120rpx;

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}
			}

			.right {
				width: 500rpx;
				// border: 1px solid red;
				margin: 0 0 10rpx 20rpx;

				.user {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.username {
						display: flex;
						align-items: flex-start;
						padding-bottom: 15rpx;
						font-size: 20px;
						font-weight: bold;
					}

					.vip_level {
						display: flex;
						align-items: flex-end;

						.level,
						.vip {
							background-color: $theme-color;
							border-radius: 5rpx;
							padding: 0 10rpx;
							font-size: 11px;
							font-weight: bold;
							color: #FFFFFF;
							display: flex;
							align-items: center;
						}

						.vip {
							margin-left: 10rpx;
							background-color: #ffdd00;
							color: red;
						}
					}
				}
			}
		}

		.today {
			width: 700rpx;
			height: 500rpx;
			border-radius: 20rpx;
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.logined {
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
				}

				text {
					color: #aaa;
					font-weight: bold;
					margin-top: 15rpx;
				}
			}
		}
	}
</style>
