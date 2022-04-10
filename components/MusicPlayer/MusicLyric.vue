<template>
	<view class="MusicLyric_container">
		<view class="lyric" v-for="item in songlyric">
			{{item.text}}
		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function(query) {
			let that = this;
			that.song = JSON.parse(query.thisSong);
			that.songid = that.song.songid;
		},
		created: async function() {
			let that = this;
			let url = "http://music.163.com/api/song/media?id=" + that.songid;
			uni.request({
				url: url,
				method: "GET",
				success: (res) => {
					// console.log(res.data.lyric);
					that.formatLyric(res.data.lyric);
				}
			})
		},
		data() {
			return {
				songid: 0,
				songlyric: [],
			};
		},
		methods: {
			//传入初始歌词文本text
			formatLyric(text) {
				let that = this;
				// console.log(text);
				let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
				let row = arr.length; //获取歌词行数
				for (let i = 0; i < row; i++) {
					let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
					let temp_arr = temp_row.split("]"); //我们可以通过“]”对时间和文本进行分离
					let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
					//再对剩下的歌词时间进行处理
					temp_arr.forEach(element => {
						let obj = {};
						let time_arr = element.substr(1, element.length - 1).split(":"); //先把多余的“[”去掉，再分离出分、秒
						let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[
							1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
						obj.time = s;
						obj.text = text;
						that.songlyric.push(obj); //每一行歌词对象存到组件的songlyric歌词属性里
					});
				}
				that.songlyric.sort(that.sortRule); //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
				console.log(that.songlyric);
			},
			sortRule(a, b) { //设置一下排序规则
				return a.time - b.time;
			}
		}
	}
</script>

<style lang="scss">
	.MusicLyric_container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.lyric {
			width: 720rpx;
			// border: 1px solid red;
			margin-top: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
