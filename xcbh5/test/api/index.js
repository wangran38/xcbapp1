// 导入uni.request和其他需要的模块
import {
	request
} from '@dcloudio/uni-app'

// 定义基础URL
// const BASE_URL = 'http://api.988cj.com'
const BASE_URL = 'https://api.xcbdsc.com'
// const UPLOAD_URL = 'http://121.196.234.102:8080'
export const UPLOAD_URL = 'https://image.xcbdsc.com'

// 创建白名单，默认所有接口都需要传token，白名单中的接口不需要传token
const whiteList = [
	// '/api/cglist',
	// '/api/citytree',
	// '/api/citylist',
	// '/api/marketlist',
	// '/group1/upload',
	// '/api/countrylist',
	// '/api/user/rs',
	// '/api/user/login',
	// '/api/user/sign',
	// '/api/market/commodity/list',
	// '/api/shop/list',
	// '/api/shop/lottery'
] // 白名单

/**
 * 检查是否需要token，如果需要就从本地获取返回，不需要则返回空
*/
const checkToken = (url)=>{
	let status = whiteList.includes(url)
	if (!status){
		// 需要传token
		const token = uni.getStorageSync('token');
		return {'Content-Type': 'application/json','Authorization': token}
	}else{
		return {'Content-Type': 'application/json'}
	}
}

// 通用的请求函数
const fetch = (url, method, data = {}, headers = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${BASE_URL}${url}`,
			method: method,
			data: data,
			header: checkToken(url),
			success: (res) => {
				const {
					code,
					message
				} = res.data
				if (res.statusCode === 200 || code === 200) {
					resolve(res.data)
				} else if (res.statusCode === 201 || code === 201 || message === '你没有登录！') {
					uni.showModal({
						title: '提示',
						content: '登录状态失效',
						confirmText: '前往登录',
						success: ({
							confirm
						}) => {
							if (confirm) {
								uni.navigateTo({
									url: '/pages/login/login',
								});
							}
						},
					})
				} else {
					if (message) {
						//已知的异常，有返回
						console.log('bad reqest:', message);
						uni.showToast({
							title: message,
							icon: 'none'
						})
					} else {
						//未知的异常
						console.log('bad reqest:', res.data.error);
						uni.showModal({
							title: '提示',
							content: '服务维护中，请稍后重试', //+res.data.error,
							showCancel: false
						})
					}
				}
			},
			fail: (err) => {
				reject(err)
				console.log('error', err);
			}
		})
	})
}


// 定义API方法
export const api = {
	// 获取菜品分类列表
	cglist() {
		return fetch('/api/cglist', 'POST')
	},
	// 获取一级城市列表
	citylist(data) {
		return fetch('/api/citylist', 'POST', data)
	},
	// 获取子类城市列表
	citytree(pid) {
		return fetch('/api/citytree', 'POST', {pid})
	},
	// 获取菜市场列表
	marketlist(areaId, limit) {
		return fetch('/api/marketlist', 'POST', {area_id: areaId,limit: limit})
	},
	// 用户注册接口
	register(phone, psw, psw1) {
		return fetch('/api/user/rs', 'POST', {phone,psw,psw1});
	},
	//用户登录接口
	login(phone, psw) {
		return fetch('/api/user/login', 'POST', {phone,psw});
	},
	//用户修改我的资料接口
	editUserProfile(data) {
		return fetch('/api/user/myedit', 'POST', data)
	},
	//用户我的资料接口
	getUserProfile() {
		return fetch('/api/user/my', 'POST')
	},
	// 用户申请摊主接口
	addshop({contactpeople,contactphone,area_id,title,logo,phone,market_id,category_id,content}) {
		return fetch('/api/shop/addshop', 'POST', {area_id,title,market_id,category_id,contactpeople,contactphone,logo,phone,content});
	},
	
	
	// 获取菜市场摊主列表接口
	marketShopList(data) {
		return fetch('/api/shop/list', 'POST', data)
	},
	// 我的菜品列表接口
	getCommdityList(data) {
		return fetch('/api/user/mygoods', 'POST', data)
	},
	
	
	
	// 获取摊位列表接口
	getMyShops(data) {
		return fetch('/api/shop/myshop', 'POST', data)
	},
	// 摊主菜品列表接口
	getmarketCommdityList(data) {
		return fetch('/api/market/commodity/list', 'POST', data)
	},
	// 添加菜品接口
	addgoods({category_id,goodsname,imglogo,price}) {
		return fetch('/api/user/addgoods', 'POST', {category_id,goodsname,imglogo,price});
	},
	// 获取海外地区列表接口
	countrylist(pid, limit, page) {
		return fetch('/api/countrylist', 'POST', {pid,limit,page});
	},
	// 获取菜市场摊主详情接口
	shopDetail(id) {
		return fetch('/api/shop/list', 'POST', {id});
	},
	// 摊主菜品详情接口
	getCommodityDetails(id) {
		return fetch('/api/user/mygoods', 'POST', {id});
	},
	// 摊主修改菜品接口
	editGoods({id,category_id,goodsname,imglogo}) {
		return fetch('/api/user/editgoods', 'POST', {id,category_id,goodsname,imglogo});
	},
	// 添加菜品上架接口
	addCommodityToShop(data) {
	    return fetch('/api/shop/addcommodity', 'POST', data);
	},
	// 上架我的菜品列表接口
	myShoplist(data) {
	    return fetch('/api/shop/mycommodity', 'POST', data);
	},
	// 下架我的菜品列表接口
	xiajiashop(data) {
	    return fetch('/api/shop/editcommodity', 'POST', data);
	},
	// 编辑我的摊位接口
	editshop(data) {
	    return fetch('/api/shop/editshop', 'POST', data);
	},
	// 我的优惠卷接口
	mycoupon(data) {
	    return fetch('/api/user/mycoupon', 'POST', data);
	},
	// 提交订单接口
	addorder(data) {
	    return fetch('/api/user/addorder', 'POST', data);
	},
	// 打卡接口
	sign(data) {
	    return fetch('/api/user/sign', 'POST', data);
	},
	// 打卡记录接口
	signlist(data) {
	    return fetch('/api/user/signlist', 'POST', data);
	},
	// 开奖明细接口
	lottery(data) {
	    return fetch('/api/shop/lottery', 'POST', data);
	},
	// 我的积分明细接口
	scorelist(data) {
	    return fetch('/api/user/scorelist', 'POST', data);
	},
	// 我的订单接口
	myorders(data) {
	    return fetch('/api/user/myorders', 'POST', data);
	},
	// 摊主订单接口
	shopoder(data) {
	    return fetch('/api/shop/order/list', 'POST', data);
	},
	// 摊主我的积分接口
	mysorce(data) {
	    return fetch('/api/shop/mysorce', 'POST', data);
	},
	// 摊主申请积分结算接口
	settlement(data) {
	    return fetch('/api/shop/settlement', 'POST', data);
	},
	// 积分结算申请记录接口
	shopsorcelist(data) {
	    return fetch('/api/shop/shopsorcelist', 'POST', data);
	},
	// 摊位资料补充
	editshop(data) {
	    return fetch('/api/shop/editshop', 'POST', data);
	}
}
export default {fetch,BASE_URL,UPLOAD_URL};