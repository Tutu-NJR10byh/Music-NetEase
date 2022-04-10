<template>
	<view class="MusicList_Container">
		<view class="Songs">
			<view class="song" v-for="(items,index) in song" @click="Playsong(index)">
				<view class="songimg">
					{{index+1}}
				</view>
				<view class="songinfo">
					<view class="songinfo_left">
						<view class="songname">
							{{items.songname}}
						</view>
						<view class="songextra">
							<view class="vip">
								本地
							</view>
							<view class="SQ">
								标准
							</view>
							<view class="songauthor">
								{{items.songauthor}}
							</view>
						</view>
					</view>
					<!-- <view class="songinfo_right">
						<image src="../../../static/assets/music/mv.png" mode="aspectFit"></image>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function(query) {
			this.song = getApp().globalData.Song;
		},
		data() {
			return {
				song: []
			};
		},
		methods: {
			// 播放歌曲
			Playsong(index) {
				let songs = JSON.stringify(this.song);
				let thisSong = index;
				console.log(songs);
				uni.navigateTo({
					url: "../../../components/MusicPlayer/MusicPlayer?song=" + songs + "&thisSong=" + thisSong,
				})
			}
		}
	}
</script>

<style lang="scss">
	.MusicList_Container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.Songs {
			border-top: 1px solid #ddd;
			width: 720rpx;
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			align-self: flex-end;

			.song {
				display: flex;
				align-items: center;
				margin-top: 10rpx;

				.songimg {
					width: 80rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					// border: 1px solid red;
					color: $theme-color;
					font-size: 18px;
					font-weight: bold;


				}

				.songinfo {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 620rpx;
					margin-left: 20rpx;
					padding: 10rpx 0;
					border-bottom: 1px solid #ddd;

					.songinfo_left {
						display: flex;
						flex-direction: column;
						justify-content: center;
						// border: 1px solid red;

						.songname {
							font-size: 18px;
							font-weight: bold;
						}

						.songextra {
							display: flex;
							justify-content: flex-start;
							align-items: center;

							.vip {
								border: 1px solid #ff7675;
								font-size: 9px;
								padding: 0 6rpx;
								color: #ff7675;
								border-radius: 10rpx;
							}

							.SQ {
								border: 1px solid #ff9f43;
								font-size: 9px;
								padding: 0 6rpx;
								color: #ff9f43;
								border-radius: 10rpx;
								margin-left: 5rpx;
							}

							.songauthor {
								color: #aaa;
								font-size: 13px;
								font-weight: bold;
								margin-left: 8rpx;
							}
						}
					}

					.songinfo_right {
						// border: 1px solid red;
						width: 40rpx;
						height: 40rpx;
						margin-right: 30rpx;

						image {
							width: 40rpx;
							height: 40rpx;
						}
					}
				}
			}
		}
	}
</style>
