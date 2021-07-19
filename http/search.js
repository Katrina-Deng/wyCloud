import {
	baseURL
} from '@/common/configs.js';

// 热搜

// http://localhost:3000/search/hot/detail
export function getHotDetails() {
	return uni.request({
		url: `${baseURL}/search/hot/detail`,
		method: 'GET',
	});

}

// 搜素关键词

// http://localhost:3000/search?keywords=星辰大海
export function getSongResult(songKeyword) {
	return uni.request({
		url: `${baseURL}/search?keywords=${songKeyword}`,
		method: 'GET',
	});

}


// 模糊搜索

// http://localhost:3000/search/suggest?keywords=星辰大海&type=mobile

export function getSongTip(suggestWord) {
	return uni.request({
		url: `${baseURL}/search/suggest?keywords=${suggestWord}&type=mobile`,
		method: 'GET',
	});

}
