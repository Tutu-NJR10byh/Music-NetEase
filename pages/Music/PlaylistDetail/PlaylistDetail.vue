<template>
	<view class="PlaylistDetail_Container">
		<view class="PlaylistIntro">
			<view class="PlaylistImg">
				<image :src="PlaylistImg" mode="aspectFit"></image>
			</view>
			<view class="PlaylistInfo">
				<view class="Playlistname">
					{{Playlistname}}
				</view>
				<view class="updateTime">
					更新于：{{updateTime}}
				</view>
			</view>
		</view>
		<view class="Songs">
			<view class="song" v-for="(items,index) in songs" @click="Playsong(index)">
				<view class="songimg">
					<image :src="items.songimg" mode="aspectFit"></image>
				</view>
				<view class="songinfo">
					<view class="songinfo_left">
						<view class="songname">
							{{items.songname}}
						</view>
						<view class="songextra">
							<view class="vip">
								VIP
							</view>
							<view class="SQ">
								SQ
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
	import request from "@/pages/API/musicAPI.js";
	export default {
		onLoad: async function(query) {
			// 获取歌单详情
			// console.log(JSON.parse(query.playlist));
			let that = this;
			let playlist = JSON.parse(query.playlist);
			let url = "/playlist/detail?id=" + playlist.playlist_id;
			let res = await request(url, {}, "GET");
			console.log(res.data.playlist.tracks);
			that.PlaylistImg = res.data.playlist.coverImgUrl;
			that.Playlistname = res.data.playlist.name;
			that.updateTime = that.renderTime(res.data.playlist.updateTime);
			for (let i = 0; i < res.data.playlist.tracks.length; i++) {
				let obj = {};
				obj.songimg = res.data.playlist.tracks[i].al.picUrl;
				obj.songid = res.data.playlist.tracks[i].id;
				obj.songname = res.data.playlist.tracks[i].name;
				obj.songauthor = res.data.playlist.tracks[i].ar[0].name;
				obj.songsrc = "https://music.163.com/song/media/outer/url?id=" + res.data.playlist.tracks[i].id +
					".mp3";
				that.songs.push(obj)
			}
		},
		data() {
			return {
				PlaylistImg: "",
				Playlistname: "",
				updateTime: "",

				songs: [],
			};
		},
		methods: {
			// 处理时间格式
			renderTime(date) {
				console.log(new Date(date).getMonth() + 1 + "月" + new Date(date).getDate() + "日");
				return new Date(date).getMonth() + 1 + "月" + new Date(date).getDate() + "日";
			},
			// 播放歌曲
			Playsong(index) {
				let songs = JSON.stringify(this.songs);
				let thisSong = index;
				uni.navigateTo({
					url: "../../../components/MusicPlayer/MusicPlayer?song=" + songs + "&thisSong=" + thisSong,
				})
			}
		}
	}
</script>

<style lang="scss">
	.PlaylistDetail_Container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.PlaylistIntro {
			// border: 1px solid red;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 25rpx;

			.PlaylistImg {
				width: 480rpx;
				height: 480rpx;

				image {
					width: 480rpx;
					height: 480rpx;
					border-radius: 15rpx;
					box-shadow: 5rpx 5rpx 25rpx #ccc, -5rpx 5rpx 25rpx #ccc;
				}
			}

			.PlaylistInfo {
				// border: 1px solid red;
				width: 450rpx;
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
				align-items: center;
				margin-top: 30rpx;

				.Playlistname {
					font-size: 15px;
					font-weight: bold;
				}

				.updateTime {
					font-size: 12px;
					font-weight: bold;
					color: #999;
					margin-top: 10rpx;
				}
			}
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

					image {
						width: 80rpx;
						height: 80rpx;
						// border: 1px solid red;
						border-radius: 10rpx;
					}
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
