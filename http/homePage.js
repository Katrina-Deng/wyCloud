import {
	baseURL
} from '@/common/configs.js';


// 获取首页信息
export function topList() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseURL}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				const result = res.data.list;
				result.length = 4
				resolve(result);
			},
			fail: () => {},
			complete: () => {}
		});
	})

}

// export function getUserInfo() {
// 	uni.login({
// 		provider: 'weixin',
// 		success: function(loginRes) {
// 			console.log(loginRes.authResult);
// 		}
// 	});

// }
