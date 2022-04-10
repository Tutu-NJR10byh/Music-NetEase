<template>
	<view class="imt-audio">
		<view class="Songinfo">
			<view class="songname">
				{{songname}}
			</view>
			<view class="songauthor">
				{{songauthor}}
			</view>
		</view>
		<view class="rotateBox rotatebox" :style="{animationPlayState: paused? 'paused':'running'}">
			<image :src="songimg" v-if="nosongimg==false"></image>
			<image src="../../static/assets/music/nosongimg.png" mode="aspectFit" v-else></image>
		</view>
		<view class="audio-wrapper">
			<view class="audio-number">{{ format(current) }}</view>
			<u-slider class="audio-slider" v-model="slideWidth" @moving="moveing" @end="endMove" :disabled="loading"
				:block-size="20" block-color="#409EFF" inactive-color="#c4c4c4" active-color='#409EFF' :height="6">
			</u-slider>
			<view class="audio-number">{{ format(duration) }}</view>
		</view>
		<view class="audio-control-wrapper" :style="{ color }">
			<view class="PlayMode">
				<image src="../../static/assets/music/order.png" mode="aspectFit" v-if="playmode=='order'"
					@click="ordertoloop"></image>
				<image src="../../static/assets/music/loop_once.png" mode="aspectFit" v-if="playmode=='loop_once'"
					@click="looptorandom">
				</image>
				<image src="../../static/assets/music/random.png" mode="aspectFit" v-if="playmode=='random'"
					@click="randomtoorder"></image>
			</view>
			<view class="audio-control audio-control-prev iconfont icon-bofangqi_shangyizhenbeifen" v-if="control"
				:style="{ borderColor: color,fontSize:'61rpx' }" @click="prev"></view>
			<view class="audio-control audio-control-switch" :class="{ audioLoading: loading }"
				@click="audio.paused ? play() : audio.pause()">
				<text class="iconfont"
					:class="loading ? ' icon-jiazai' : paused ? ' icon-bofangqi-bofang_' : ' icon-bofangqi-zanting'"
					style="font-size:146rpx"></text>
			</view>
			<view class="audio-control audio-control-next iconfont icon-bofangqi_xiayizhenbeifen" v-if="control"
				:style="{ borderColor: color,fontSize:'61rpx' }" @click="next">
			</view>
			<view class="PlayMode Lyric" v-if="nosongimg==false">
				<image src="../../static/assets/music/lyric.png" mode="aspectFit" @click="getlyric"></image>
			</view>
			<view class="PlayMode Lyric" v-else>
				<image src="../../static/assets/music/nolyric.png" mode="aspectFit"></image>
			</view>
		</view>
		<view class="tips">
			Tips：u-silder可拖动进度条当前适配iOS端，由于需要适配Android，自行做了组件封装，需要最新的安卓系统以及较好的处理器，如果出现卡顿，则手机不适配，会影响watch监听进度条，导致程序卡死
		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function(query) {
			let that = this;
			that.nosongimg = false;
			that.song = JSON.parse(query.song);
			console.log(that.song[query.thisSong].songimg);
			that.songid = that.song[query.thisSong].songid;
			if (that.song[query.thisSong].songimg == undefined) {
				that.nosongimg = true;
			} else {
				that.songimg = that.song[query.thisSong].songimg;
			}
			that.songauthor = that.song[query.thisSong].songauthor;
			that.songname = that.song[query.thisSong].songname;
			that.songindex = query.thisSong;
			that.songsrc = that.song[query.thisSong].songsrc;
		},
		data() {
			return {
				song: [],
				songimg: "",
				nosongimg: false,
				songname: "",
				songauthor: "",
				songsrc: "",
				songindex: -1,
				audio: uni.createInnerAudioContext(),
				current: 0, //当前进度(s)
				duration: 0, //总时长(s)
				paused: true, //是否处于暂停状态
				loading: false, //是否处于读取状态
				seek: false, //是否处于拖动状态
				slideWidth: 0,

				autoplay: true, //是否自动播放
				continue: true, //播放完成后是否继续播放下一首，需定义@next事件
				control: true,
				color: "#409EFF", //主色调
				playmode: "order", // 播放模式
			}
		},
		methods: {
			songplay(src) {
				if (src) {
					console.log(src);
					this.audio.src = src;
					console.log(this.audio);
					this.autoplay && this.play();
				}
				//音频进度更新事件
				this.audio.onTimeUpdate(() => {
					// console.log('音频进度条发生更新')
					if (!this.seek) {
						// console.log('重新更新')
						this.current = this.audio.currentTime
					}
					this.duration = this.audio.duration
				})
				//音频播放事件
				this.audio.onPlay(() => {
					// console.log('音频播放')
					this.paused = false
					this.loading = false
				})
				//音频暂停事件
				this.audio.onPause(() => {
					this.paused = true
				})
				//音频结束事件
				this.audio.onEnded(() => {
					console.log('音频结束')
					if (this.continue) {
						this.next()
					} else {
						this.paused = true
						this.current = 0
					}
				})
				//音频完成更改进度事件
				this.audio.onSeeked(() => {
					// console.log('音频进度条完成')
					this.seek = false
					this.$forceUpdate()
				})
				//微信基础库不同,必须监听这个,并且输出这个值,上面的 onTimeUpdate才会触发,不知道啥情况
				this.audio.onCanplay(() => {
					this.loading = false
				})

				this.audio.onWaiting(() => {
					// console.log('XXXX')
					this.loading = true
				})
			},
			endMove(e) {
				this.play()
				let pr = (this.slideWidth / 100) * this.duration
				console.log(pr)
				this.audio.seek(pr)
			},
			moveing(e) {
				this.play()
				this.seek = true
				let pr = (this.slideWidth / 100) * this.duration;
				console.log(pr)
				this.current = pr
			},
			//返回prev事件
			prev() {
				let that = this;
				let songindex = -1;
				switch (that.playmode) {
					case "order":
						if (that.songindex * 1 == 0) {
							songindex = that.song.length - 1;
						} else {
							songindex = that.songindex * 1 - 1;
						}
						console.log(that.song[songindex]);
						that.songimg = that.song[songindex].songimg;
						that.songauthor = that.song[songindex].songauthor;
						that.songname = that.song[songindex].songname;
						that.songindex = songindex;
						that.slideWidth = 0;
						that.songplay(that.song[songindex].songsrc);
						break;
					case "loop_once":
						songindex = that.songindex * 1
						that.songimg = that.song[songindex].songimg;
						that.songauthor = that.song[songindex].songauthor;
						that.songname = that.song[songindex].songname;
						that.songindex = songindex;
						that.slideWidth = 0;
						that.songplay(that.song[songindex].songsrc);
						break;
					case "random":
						let min = 0;
						let max = that.song.length - 1;
						songindex = Math.round(Math.random() * (max - min) + min);
						console.log(songindex);
						that.songimg = that.song[songindex].songimg;
						that.songauthor = that.song[songindex].songauthor;
						that.songname = that.song[songindex].songname;
						that.songindex = songindex;
						that.slideWidth = 0;
						that.songplay(that.song[songindex].songsrc);
						break;
					default:
						break;
				}
			},
			//返回next事件
			next() {
				let that = this;
				let songindex = -1;
				switch (that.playmode) {
					case "order":
						if (that.songindex * 1 == that.song.length - 1) {
							songindex = 0;
						} else {
							songindex = that.songindex * 1 + 1;
						}
						that.songimg = that.song[songindex].songimg;
						that.songauthor = that.song[songindex].songauthor;
						that.songname = that.song[songindex].songname;
						that.songindex = songindex;
						that.slideWidth = 0;
						that.songplay(that.song[songindex].songsrc);
						break;
					case "loop_once":
						songindex = that.songindex * 1
						that.songimg = that.song[songindex].songimg;
						that.songauthor = that.song[songindex].songauthor;
						that.songname = that.song[songindex].songname;
						that.songindex = songindex;
						that.slideWidth = 0;
						that.songplay(that.song[songindex].songsrc);
						break;
					case "random":
						let min = 0;
						let max = that.song.length - 1;
						songindex = Math.round(Math.random() * (max - min) + min);
						console.log(songindex);
						that.songimg = that.song[songindex].songimg;
						that.songauthor = that.song[songindex].songauthor;
						that.songname = that.song[songindex].songname;
						that.songindex = songindex;
						that.slideWidth = 0;
						that.songplay(that.song[songindex].songsrc);
						break;
					default:
						break;
				}
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'
					.repeat(2 -
						String(Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//点击播放按钮
			play() {
				this.audio.play()
				// this.loading = true
			},

			// 播放模式切换
			// 单曲循环
			ordertoloop() {
				this.playmode = "loop_once";
			},
			// 随机播放
			looptorandom() {
				this.playmode = "random";
			},
			// 顺序播放
			randomtoorder() {
				this.playmode = "order";
			},
			// 获取歌词
			getlyric() {
				console.log(this.song[this.songindex]);
				let thisSong = JSON.stringify(this.song[this.songindex]);
				uni.navigateTo({
					url: "./MusicLyric?thisSong=" + thisSong,
				})
			},
		},
		created() {
			this.songplay(this.songsrc);
		},
		beforeDestroy() {
			this.audio.destroy()
		},
		watch: {
			// src(src, old) {
			// 	this.audio.src = src
			// 	this.slideWidth = 0
			// 	this.current = 0
			// 	this.duration = 0
			// 	if (old || this.autoplay) {
			// 		this.play()
			// 	}
			// },
			current(value) {
				if (this.duration > 0) {
					if (this.current === this.duration) {
						this.slideWidth = 100
						return
					}
					// this.slideWidth = parseInt(((parseInt(value) / parseInt(this.duration)) * 100).toFixed(2))
					this.slideWidth = Number(((value / this.duration) * 100).toFixed(4))
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	@font-face {
		font-family: "iconfont";
		src: url('//at.alicdn.com/t/font_2279025_ref7yewe9x8.eot?t=1608278021196');
		/* IE9 */
		src: url('//at.alicdn.com/t/font_2279025_ref7yewe9x8.eot?t=1608278021196#iefix') format('embedded-opentype'),
			/* IE6-IE8 */
			url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAARsAAsAAAAACigAAAQdAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDSAqGZIUlATYCJAMYCw4ABCAFhG0HgQ4bkQjIngPu5taspEecucywEpQz+PesecqmabdL6sweoPQo/qoHKAeg/tPaQjyZpB8KGkmmiZPK2pthWJWWTwhyd/W/LLWIgxZgAoFQUgMEfMg+WVNbROHw3LsaXecByQGhaioUKFr8OqGYHZByYz23GWe30K4hUCu/jtcDASh8RSOj9P6Zq+GC3QiA7G5cztVaNnyGTchGaeTYBLkQ5DqFWgDMyt+efCQmA5QIBDeqNw9abv2gHWOqVUWrUKEe5wGgnQQwQDSAAzmjvsGKZSIaozh/oaRSDgYyij9oLlq2dkg7ZrVCSxWECEOow1H/8ChOAGkgnQHx1UkBGmIEGGguCBDQshGgoB1CgIN2zAaBJunAbZwAvyEDAS3YDjKGYlgHlCFmNAYxFn2XmRfp9dMWqPMVZerCEYsa2aaFCwkxL9JXBdT5Q6eienhucWksWDLVtclC8yBSt4wsbk1piercaP7UgbR++xtak5svml5/3vjas+GkaVRImr97Q2vd7ueoJ1t2LKT9BrXj8kvJB6/4ilVX0w5c9ummNI7YeDDYuRNbGplvO3+5h0vnBQcObfMiLSHbTZgb8RYtosa2/4dCXDqzZVHoWbDCXVi0/+BWT9ICs12FuTFv2ZLXURWLckxncbbo0ti9hL6KrtAoTbQy4uo/W5myYJ27bD/F4lbUnXVM48Y1cbrn2DlLmpxSwgYV+vtDGTG7qWOTdrKzU0q4ifTnqRrWMbe5vz+/HYpTSaKqq2zX3TnHbW05qs+xBFW8UThtezqysZgrGkcW60VjTrnhwqOPFmPvjPTxkf1gL1Xfe+QxkPqPvnt8AkPKPfWFxj0xgUElF9PmOAaVHfeIGJbAELCi8idlDAugU70bNui+1a3WOb/TYf4HuWgPwzZsJQfAqnLCVObejUoWwv8XZkbQO65AAASWl6hn29plf5P13J26R80Cldtl/xg9xPK/VkcCsFp5upLtUtr94y1AAJKuahSjACUMAVYMOXpwlOJbk6UBmUsNlA0fYGTBaI6PBkEvGSSyPFBEKTtZz0l/RSR1ACJNACDs7QLK6BQw9s6jOf4+CK7egcQ+BoomxemceqF1U4r6Qw6gUYdh1K2jbbHIGTSK8gd4aMheU5lzvuH5IkwJsfHd9AkWvCMOGDCYLwcOZGTqb5tUCjeDYdjUt7/9hhpMuw4MnFVcnGnshaYd+5i5hiIekAVAQzpIkW5UNgtLJwcavdd/AC5kkHkzfR3hb+DxibWTBLHiBeiTzhL1fcrGA0S4pYECjHcy8dhMpBQ9YIQJG+k7vtUbqAJTXTfEHCtxNMwk1U2vN5jv8goARXBbqVDCCCeCSMQG0uomZ7JodujDZIu7YlIMPDuW4e1fWdDiY/Q8/Ve+dyqyFywFgsEaDo8lQtasuRwAAA==') format('woff2'),
			url('//at.alicdn.com/t/font_2279025_ref7yewe9x8.woff?t=1608278021196') format('woff'),
			url('//at.alicdn.com/t/font_2279025_ref7yewe9x8.ttf?t=1608278021196') format('truetype'),
			/* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
			url('//at.alicdn.com/t/font_2279025_ref7yewe9x8.svg?t=1608278021196#iconfont') format('svg');
		/* iOS 4.1- */
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-jiazai:before {
		content: "\e615";
	}

	.icon-bofangqi-bofang_:before {
		content: "\e63c";
	}

	.icon-bofangqi-zanting:before {
		content: "\e600";
	}

	.icon-bofangqi_shangyizhenbeifen:before {
		content: "\e6b7";
	}

	.icon-bofangqi_xiayizhenbeifen:before {
		content: "\e6bb";
	}

	.imt-audio {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		// border: 1px solid red;

		// filter: blur(10px);
		.Songinfo {
			// width: 400rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// border: 1px solid red;

			.songname {
				font-size: 25px;
				font-weight: bold;
			}

			.songauthor {
				font-size: 13px;
				font-weight: bold;
				color: #aaa;
				margin-top: 10rpx;
			}
		}


		.rotateBox {
			width: 400rpx;
			height: 400rpx;
			border-radius: 50%;
			// background-color: $theme-color;
			margin-top: 20rpx;

			image {
				width: 400rpx;
				height: 400rpx;
				border-radius: 50%;
			}
		}
	}

	.audio-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 660rpx;
		margin-top: 50rpx;
		// border: 1px solid red;

		.audio-number {
			width: 65rpx;
			height: 34rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #409EFF;
			// border: 1px solid red;
		}

		.audio-slider {
			width: 500rpx;
			// border: 1px solid red;
		}
	}

	.audio-control-wrapper {
		margin-top: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		// border: 1px solid red;

		.PlayMode {
			image {
				width: 50rpx;
				height: 50rpx;
			}

			margin-right: 40rpx;
		}

		.Lyric {
			margin-right: 0;
			margin-left: 40rpx;
		}
	}

	.audio-control {
		font-size: 32rpx;
		line-height: 1;
		// border-radius: 50%;
		padding: 0 33rpx;
	}


	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.rotatebox {
		animation-name: rotate;
		animation-duration: 8s; //完成一组动画需要的时间
		animation-timing-function: linear; //动画曲线
		animation-iteration-count: infinite; //播放次数
		animation-direction: normal; //是否逆向播放
		animation-play-state: running; //动画是否暂停
	}
	.tips{
		width: 650rpx;
		margin-top: 100rpx;
		color: #aaa;
	}
</style>
