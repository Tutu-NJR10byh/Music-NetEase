<template>
	<view>
		<mckou-weather :weatherData="weatherData" :cityname="cityname" ref="mckouWeather"></mckou-weather>
	</view>
</template>
<script>
	import mckouWeather from '@/components/Weather/mckouWeather.vue';
	export default {
		onLoad: function() {
			let that = this;
			uni.request({
				url: "http://api.map.baidu.com/reverse_geocoding/v3/?output=json&coordtype=wgs84ll&location=" + getApp().globalData
					.latitude + "," + getApp().globalData.longitude + "&ak=4DXL5GtYfjanZxjheF4EkuhBejrydkG6",
				method: "GET",
				success: (res) => {
					console.log(res);
					getApp().globalData.adcode = res.data.result.addressComponent.adcode;
					getApp().globalData.cityname = res.data.result.addressComponent.city.substring(0,2);
					that.cityname = res.data.result.addressComponent.city.substring(0,2);
					uni.request({
						url: "http://api.map.baidu.com/weather/v1/?district_id=" + getApp().globalData.adcode +
							"&data_type=all&ak=4DXL5GtYfjanZxjheF4EkuhBejrydkG6",
						method: "GET",
						success: (res) => {
							console.log(res);
							for (let i = 0; i < res.data.result.forecasts.length; i++) {
								let arr = {};
								arr.dayWeek = res.data.result.forecasts[i].week;
								arr.dayLabel = res.data.result.forecasts[i].date.split("-")[1] + "/" + res.data.result.forecasts[
									i].date.split("-")[2];
								arr.weatherLabel = res.data.result.forecasts[i].text_day;
								switch (arr.weatherLabel) {
									case "晴":
										arr.weatherIcon = "../../static/weather/qing.png";
										break;
									case "多云":
										arr.weatherIcon = "../../static/weather/duoyun.png";
										break;
									case "小雨":
										arr.weatherIcon = "../../static/weather/xiaoyu.png";
										break;
									case "中雨":
										arr.weatherIcon = "../../static/weather/zhongyu.png";
										break;
									case "大雨":
										arr.weatherIcon = "../../static/weather/dayu.png";
										break;
									default:
										arr.weatherIcon = "../../static/weather/yin.png";
										break;
								};
								arr.max = res.data.result.forecasts[i].high;
								arr.min = res.data.result.forecasts[i].low;
								arr.wind = res.data.result.forecasts[i].wd_day;
								arr.air = res.data.result.forecasts[i].wc_day;
								that.weatherData.push(arr);
								that.$nextTick(() => {
									that.$refs.mckouWeather.init();
								});
							}
						}
					})
				}
			})
		},
		onPullDownRefresh: function() {
			let that = this;
			setTimeout(function() {
				uni.request({
					url: "http://api.map.baidu.com/reverse_geocoding/v3/?output=json&coordtype=wgs84ll&location=" + getApp().globalData
						.latitude + "," + getApp().globalData.longitude + "&ak=4DXL5GtYfjanZxjheF4EkuhBejrydkG6",
					method: "GET",
					success: (res) => {
						console.log(res);
						getApp().globalData.adcode = res.data.result.addressComponent.adcode;
						console.log(getApp().globalData.adcode);
						uni.request({
							url: "http://api.map.baidu.com/weather/v1/?district_id=" + getApp().globalData.adcode +
								"&data_type=all&ak=4DXL5GtYfjanZxjheF4EkuhBejrydkG6",
							method: "GET",
							success: (res) => {
								console.log(res);
								that.weatherData = [];
								for (let i = 0; i < res.data.result.forecasts.length; i++) {
									let arr = {};
									arr.dayWeek = res.data.result.forecasts[i].week;
									arr.dayLabel = res.data.result.forecasts[i].date.split("-")[1] + "/" + res.data.result.forecasts[
										i].date.split("-")[2];
									arr.weatherLabel = res.data.result.forecasts[i].text_day;
									switch (arr.weatherLabel) {
										case "晴":
											arr.weatherIcon = "../../static/weather/qing.png";
											break;
										case "多云":
											arr.weatherIcon = "../../static/weather/duoyun.png";
											break;
										case "小雨":
											arr.weatherIcon = "../../static/weather/xiaoyu.png";
											break;
										case "中雨":
											arr.weatherIcon = "../../static/weather/zhongyu.png";
											break;
										case "大雨":
											arr.weatherIcon = "../../static/weather/dayu.png";
											break;
										default:
											arr.weatherIcon = "../../static/weather/yin.png";
											break;
									};
									arr.max = res.data.result.forecasts[i].high;
									arr.min = res.data.result.forecasts[i].low;
									arr.wind = res.data.result.forecasts[i].wd_day;
									arr.air = res.data.result.forecasts[i].wc_day;
									that.weatherData.push(arr);
									that.$nextTick(() => {
										that.$refs.mckouWeather.init();
									});
									uni.stopPullDownRefresh();
								}
							}
						})
					}
				})
			}, 1500);
		},
		data() {
			return {
				weatherData: [],
				cityname: ""
			}
		},
		methods: {

		},
		components: {
			mckouWeather
		}
	}
</script>

<style lang="scss">

</style>
