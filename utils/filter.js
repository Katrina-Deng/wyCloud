// 播放
export const countFormat = (val)=>{
	val = parseFloat(val)
	if(val>=10000 && val<100000000)
	{
		return (val/10000).toFixed(1) + '万'
	}
	else if(val>=100000000){
		return (val/100000000).toFixed(1) + '亿'
	}
	else{
		return val
	}
}

export const dateFormat = (val)=>{
	let date = new Date(val)
	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}
