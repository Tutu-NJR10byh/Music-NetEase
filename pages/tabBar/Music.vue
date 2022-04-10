<template>
	<view class="Music_Container">
		<view class="Search_Music">
			<text>搜索</text>
			<input type="text" :value="musicname" placeholder="艺人、歌曲等更多内容 (不对此App开放)" />
		</view>
		<view class="Music_PlayList">
			<text>精品歌单（鸣谢API提供方：网易云音乐）</text>
			<view class="PlayList_Info">
				<view class="Info" v-for="(items,index) in playlists" @click="Playlist_detail(index)">
					<image :src="items.coverImgUrl" mode="aspectFit"></image>
					<view class="intro_info">
						<text>{{items.name}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../API/musicAPI.js";
	export default {
		created: async function() {
			this.getPlaylists();
		},
		onPullDownRefresh: function() {
			let that = this;
			console.log("aaa");
			setTimeout(function() {
				that.getPlaylists();
			}, 2000);
			uni.stopPullDownRefresh();
		},
		data() {
			return {
				musicname: "",

				playlists: [],
			};
		},
		methods: {
			// 获取精品歌单
			async getPlaylists() {
				let that = this;
				let res = await request('/top/playlist/highquality', {
						limit: 8
					},
					"GET");
				for (let i = 0; i < res.data.playlists.length; i++) {
					let obj = {};
					obj.playlist_id = res.data.playlists[i].id;
					obj.coverImgUrl = res.data.playlists[i].coverImgUrl;
					obj.name = res.data.playlists[i].name;
					that.playlists.push(obj);
					console.log(obj);
				}
			},
			Playlist_detail(index) {
				console.log(this.playlists[index]);
				let arr = JSON.stringify(this.playlists[index]);
				uni.navigateTo({
					url: "../Music/PlaylistDetail/PlaylistDetail?playlist=" + arr,
				})
			}
		}
	}
</script>

<style lang="scss">
	.Music_Container {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.Search_Music {
			// border: 1px solid red;
			border-bottom: 1px solid #eee;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-bottom: 25rpx;
			width: 680rpx;

			text {
				font-size: 33px;
				font-weight: bold;
				align-self: flex-start;
			}

			input {
				font-size: 16px;
				// border: 1px solid red;
				width: 660rpx;
				padding: 6px;
				background-color: #efefef;
				border-radius: 8px;
				margin-top: 15rpx;
			}
		}

		.Music_PlayList {
			margin-top: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 680rpx;

			text {
				font-size: 20px;
				font-weight: bold;
				align-self: flex-start;
			}

			.PlayList_Info {
				width: 680rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				margin-top: 20rpx;

				.Info {
					// border: 1px solid red;
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 10rpx 0 20rpx 0;

					image {
						width: 320rpx;
						height: 320rpx;
						border-radius: 15px;
					}

					.intro_info {
						width: 310rpx;
						overflow: auto;
						margin-top: 5rpx;

						// border: 1px solid red;
						text {
							font-size: 14px;
						}
					}
				}
			}
		}
	}
</style>
