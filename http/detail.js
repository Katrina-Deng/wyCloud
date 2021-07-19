import {
	baseURL
} from '@/common/configs.js';

// http://localhost:3000/song/detail?ids=1475596788

// id是详情页传递过去的
export function getSongDetail(songId) {
	return uni.request({
		url: `${baseURL}/song/detail?ids=${songId}`,
		method: 'GET',
	});

}

// http://localhost:3000/simi/song?id=1475596788

// 相关歌曲
export function getSongSimi(songId) {
	return uni.request({
		url: `${baseURL}/simi/song?id=${songId}`,
		method: 'GET',
	});

}

// http://localhost:3000/comment/music?id=1475596788

// 评论
export function getSongComment(songId) {
	return uni.request({
		url: `${baseURL}/comment/music?id=${songId}`,
		method: 'GET',
	});
}

// http://localhost:3000/lyric?id=1475596788

// 歌词
export function getSongLyric(songId) {
	return uni.request({
		url: `${baseURL}/lyric?id=${songId}`,
		method: 'GET',
	});
}

// http://localhost:3000/song/url?id=1475596788

// 歌曲mp3地址
export function getSongURl(songId) {
	return uni.request({
		url: `${baseURL}/song/url?id=${songId}`,
		method: 'GET',
	});
}
