<template>
	<view class="demo">
		<ss-select-city :hotCitys="hotCitys" v-model="value" @on-select="onSelect"></ss-select-city>
	</view>
</template>

<script>
	import ssSelectCity from '@/components/ss-select-city/ss-select-city.vue'
	export default {
		onShow: function() {
			console.log(getApp().globalData.cityname.substring(0,2))
			this.value = getApp().globalData.cityname.substring(0, 2);
		},
		data() {
			return {
				hotCitys: ['北京', '上海', '深圳', '广州', '杭州', '南京', '成都', '西安', '苏州'],
				value: ""
			}
		},
		components: {
			ssSelectCity
		},
		methods: {
			onSelect(city) {
				console.log(city);
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
