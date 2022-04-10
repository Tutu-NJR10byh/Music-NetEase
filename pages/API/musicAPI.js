export default (url, data = {}, method = '') => {
	const baseURL = "https://netease-cloud-music-api-ivory.vercel.app";
	return new Promise((resolve, reject) => {
		console.log(baseURL + url + "&timestamp=" + new Date().getTime());
		uni.request({
			url: baseURL + url + "&timestamp=" + new Date().getTime(), //vercel
			data,
			method,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			},
		})
	}).catch(e => {});
}
