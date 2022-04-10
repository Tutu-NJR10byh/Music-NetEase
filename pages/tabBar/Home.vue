<template>
	<view class="Home_Container">
		<view class="Top">
			<view class="top_text">
				资料库
			</view>
		</view>
		<view class="Mulu">
			<view class="function" @click="SongLists">
				<view class="left">
					<view class="function_icon">
						<image src="../../static/assets/icon/SongList.png" mode=aspectFit></image>
					</view>
					<view class="function_name">
						播放列表
					</view>
				</view>
				<view class="right">
					<uni-icons type="forward" size="17" color="#999"></uni-icons>
				</view>
			</view>
			<view class="function" @click="chooseFile">
				<view class="left">
					<view class="function_icon">
						<image src="../../static/assets/icon/File.png" mode="aspectFit"></image>
					</view>
					<view class="function_name">
						获取本地文件
					</view>
				</view>
				<view class="right">
					<uni-icons type="forward" size="17" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<view class="Recent_Add">
			<view class="text">
				最近添加
			</view>
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
	</view>
</template>

<script>
	import request from "../API/musicAPI.js";
	import chooseMusic from "../API/choosefile.js"
	export default {
		created: function() {},
		data() {
			return {
				audio: uni.createInnerAudioContext(),
				RecentlyAdd: [],
				song: []
			};
		},
		methods: {
			// 播放列表
			SongLists() {
				uni.navigateTo({
					url: "../Music/MusicList/MusicList"
				})
			},
			// 选择本地文件
			chooseFile() {
				let that = this;
				console.log(plus.os.name);
				if (plus.os.name == "Android");
				chooseMusic((res) => {
					console.log('file://' + res);
					let obj = {};
					obj.songsrc = 'file://' + res;
					obj.songname = obj.songsrc.split('/')[obj.songsrc.split('/').length - 1].split('-')[obj.songsrc
						.split(
							'/')[obj.songsrc.split('/').length - 1].split('-').length - 1].split('[')[0];
					obj.songauthor = obj.songsrc.split('/')[obj.songsrc.split('/').length - 1].split('-')[0];
					getApp().globalData.Song.push(obj);
					that.song = getApp().globalData.Song;
				}, "audio/*");
			},
			// 播放歌曲
			Playsong(index) {
				let songs = JSON.stringify(this.song);
				let thisSong = index;
				console.log(songs);
				uni.navigateTo({
					url: "../../components/MusicPlayer/MusicPlayer?song=" + songs + "&thisSong=" + thisSong,
				})
			}
		}
	}
</script>

<style lang="scss">
	.Home_Container {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		// background: #000000;

		.Top {
			width: 700rpx;

			// border: 1px solid red;
			.top_text {
				font-size: 30px;
				font-weight: bold;
			}
		}

		.Mulu {
			align-self: flex-end;
			width: 720rpx;
			margin-top: 20rpx;
			border-top: 1px solid #ddd;

			.function {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 0;

				&:first-child {
					border-bottom: 1px solid #ddd;
				}

				&:nth-child(2) {
					border-bottom: 1px solid #ddd;
				}

				&:nth-child(3) {
					border-bottom: 1px solid #ddd;
				}

				.left {
					font-size: 20px;
					// border: 1px solid red;
					display: flex;
					align-items: center;

					.function_icon {
						display: flex;
						align-items: center;

						image {
							width: 60rpx;
							height: 60rpx;
						}
					}

					.function_name {
						margin-left: 20rpx;
					}
				}
			}
		}

		.Recent_Add {
			width: 680rpx;
			margin-top: 50rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			// align-items: center;


			.text {
				font-size: 20px;
				font-weight: bold;
			}

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
	}
</style>
