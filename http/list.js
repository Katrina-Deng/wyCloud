import {
	baseURL
} from '@/common/configs.js';


// 获取列表
// http://localhost:3000/top/list?id=19723756
export function getListInfo(listId) {
	return uni.request({
		url: `${baseURL}/top/list?id=${listId}`,
		method: 'GET',
	});

}
