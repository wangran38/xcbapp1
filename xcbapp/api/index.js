// 定义基础URL
const BASE_URL = 'https://api.xcbdsc.com'
// const BASE_URL = 'http://192.168.0.111:8088'

// const UPLOAD_URL = 'http://121.196.234.102:8080'
export const UPLOAD_URL = 'https://image.xcbdsc.com'

const WEBSOCKET_URL = "192.168.0.111:8088"

export const  locationsKey = '9d721b642fb8ef1921e8986da474f65e'
/**
 * 
 * @@param {url,parmas} 连接的路由地址，连接参数
 * @description websocket封装，调用之后返回实例，继而在实例上绑定事件
*/
const getSocket  = (url,parmas)=>{
	let socketTask =  uni.connectSocket({
		url:`ws://${WEBSOCKET_URL}${url}?${parmas}`,
		 success(data) {
			console.log("websocket连接成功"+url);
		},
	})
	return socketTask
} 

export {getSocket}

// 创建白名单，默认所有接口都需要传token，白名单中的接口不需要传token
const whiteList = [
	// '/api/goods/get/info',   // 查看溯源信息
	'/api/cglist',
	'/api/citytree',
	'/api/citylist',
	'/api/marketlist',
	'/group1/upload',
	'/api/countrylist',
	'/api/user/rs',
	'/api/user/login',
	// '/api/user/sign',
	'/api/market/commodity/list',
	// '/api/shop/list', // 首页数据
	'/api/shop/lottery'
] // 白名单

/**
 * 检查是否需要token，如果需要就从本地获取返回，不需要则返回空
 */
const checkToken = (url) => {
	let status = whiteList.includes(url)
	if (!status) {
		// 需要传token
		const token = uni.getStorageSync('token');
		return {
			'Content-Type': 'application/json',
			'Authorization': token
		}
	} else {
		return {
			'Content-Type': 'application/json'
		}
	}
}

// 通用的请求函数
const fetch = (url, method, data = {}, headers = {}) => {
	return new Promise((resolve, reject) => {
		
		// 校验白名单以外的接口 token是否存在，
		// if (!whiteList.includes(url)){
		// 	const token = uni.getStorageSync('token');
			
		// 	if (!token){
		// 		uni.showModal({
		// 			title: '提示',
		// 			content: '登录状态失效',
		// 			confirmText: '前往登录',
		// 			success: ({
		// 				confirm
		// 			}) => {
		// 				if (confirm) {
		// 					uni.navigateTo({
		// 						url: '/pages/login/login',
		// 					});
		// 				}
		// 			},
		// 		})
		// 		reject("检测不到token",url)
		// 	}
			
		// }
		uni.request({
			url: `${BASE_URL}${url}`,
			method: method,
			data: data,
			header: checkToken(url),
			success: (res) => {
				const {
					code,
					msg
				} = res.data
				if (res.statusCode === 200 || code === 200) {
					resolve(res.data)
				} else if (res.statusCode === 201 || code === 201 || msg === '你没有登录！') {
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
					// if (msg) {
					// 	uni.showModal({
					// 		title: '提示',
					// 		content: res.data.msg || res.data.message || res.data.error, //+res.data.error,
					// 		showCancel: false
					// 	})
					// }
					resolve(res.data)
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
		return fetch('/api/citytree', 'POST', {
			pid
		})
	},
	// 获取菜市场列表
	marketlist(areaId, limit) {
		return fetch('/api/marketlist', 'POST', {
			area_id: areaId,
			limit: limit
		})
	},
	// 用户注册接口
	register(phone, psw, psw1,fromid) {
		return fetch('/api/user/rs', 'POST', {
			phone,
			psw,
			psw1,
			fromid
		});
	},
	//用户登录接口
	login(phone, psw) {
		return fetch('/api/user/login', 'POST', {
			phone,
			psw
		});
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
	addshop({
		contactpeople,
		contactphone,
		area_id,
		title,
		logo,
		phone,
		market_id,
		category_id,
		content
	}) {
		return fetch('/api/shop/addshop', 'POST', {
			area_id,
			title,
			market_id,
			category_id,
			contactpeople,
			contactphone,
			logo,
			phone,
			content
		});
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
	addgoods({
		category_id,
		goodsname,
		imglogo,
		price
	}) {
		return fetch('/api/user/addgoods', 'POST', {
			category_id,
			goodsname,
			imglogo,
			price
		});
	},
	// 获取海外地区列表接口
	countrylist(pid, limit, page) {
		return fetch('/api/countrylist', 'POST', {
			pid,
			limit,
			page
		});
	},
	// 获取菜市场摊主详情接口
	shopDetail(id) {
		return fetch('/api/shop/list', 'POST', {
			id
		});
	},
	// 摊主菜品详情接口
	getCommodityDetails(id) {
		return fetch('/api/user/mygoods', 'POST', {
			id
		});
	},
	// 摊主修改菜品接口
	editGoods({
		id,
		category_id,
		goodsname,
		imglogo
	}) {
		return fetch('/api/user/editgoods', 'POST', {
			id,
			category_id,
			goodsname,
			imglogo
		});
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
	// 编辑|删除 我的摊位接口
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
	},

	// 我的银行卡
	mybank(data) {
		return fetch('/api/shop/mybank', 'POST', data);
	},

	// 添加银行卡
	addbank(data) {
		return fetch('/api/shop/addbank', 'POST', data);
	},
	// 解除银行卡
	editshopbank(data) {
		return fetch('/api/shop/editshopbank', 'POST', data);
	},
	// 删除菜品
	editgoods(data) {
		return fetch('/api/user/editgoods', 'POST', data);
	},
	// 绑定微信
	bindingOpenid(data) {
		return fetch('/api/wx/getopenid', 'GET', data);
	},
	
	// 打卡数据
	signTotal(data) {
		return fetch('/api/sign/total', 'POST', data);
	},
	
	// 创建户主
	addfarmers(data) {
		return fetch('/api/farmers/addfarmers', 'POST', data);
	},
	// 户主补充资料
	upFarmers(data){
		return fetch('/api/farmers/upFarmers', 'POST', data);
	},
	// 户主资料
	myInfo(data){
		return fetch('/api/farmers/info', 'POST', data);
	},
	
	// 积分支付
	payscore(data){
		return fetch('/api/user/payscore', 'POST', data);
	},
	// 微信支付
	wechatpay(data){
		return fetch('/api/pay/orderpay', 'POST', data);
	},
	// 轮询查询微信支付状态
	getorderinfo(data){
		return fetch('/api/user/getorderinfo', 'POST', data);
	},
	

	// 查看溯源信息
	lookTraceability(data){
		return fetch('/api/goods/getinfo', 'POST', data);
	},
	// 扫码收货
	receiving(data){
		return fetch('/api/shop/receiving', 'POST', data);
	},
	
	// 发送短信
	sendText(data){
		return fetch('/api/sendsms', 'POST', data);
	},
	// 修改密码
	editPwd(data){
		return fetch('/api/user/editpsw', 'POST', data);
	},
	// 我的钱包
	mymoney(data){
		return fetch('/api/shop/mymoney', 'POST', data);
	},
	
	// 提现至银行卡
	amount(data){
		return fetch('/api/shop/amount', 'POST', data);
	},
	// 添加预卖菜品
	addPreSale(data){
		return fetch('/api/farmers/addgoods', 'POST', data);
	},
	
	// 卖家端预卖菜品列表
	goodslist(data){
		return fetch('/api/farmers/goodslist', 'POST', data);
	},
	// 菜品朋友圈上传
	addinfos(data){
		return fetch('/api/farmers/goods/addinfos', 'POST', data);
	},
	// 菜品朋友圈数据
	goodsinfoList(data){
		return fetch('/api/farmers/goodsinfo/list', 'POST', data);
	},
	// 买家端和买家端预卖菜品列表
	presaleList(data){
		return fetch('/api/farmers/market/goodslist', 'POST', data);
	},
	
	// 删除预卖菜品
	delDishes(data){
		return fetch('/api/farmers/delgoods', 'POST', data);
	},
	// 删除朋友圈
	delMoments(data){
		return fetch('/api/farmers/goodsinfo/del', 'POST', data);
	},
	// 删除列表
	farmersList(data){
		return fetch('/api/farmers/list', 'POST', data);
	},
	//  朋友圈数据
	dynamicsDataList(data){
		return fetch('/api/farmers/goodsinfo/showlist', 'POST', data);
	},
	// 发布求购信息
	buyinfoAdd(data){
		return fetch('/api/user/buyinfo/add', 'POST', data);
	},
	buyinfoList(data){
		return fetch('/api/buyinfo/list', 'POST', data);
	},
	// 修改预卖菜品信息
	updateDish(data){
		return fetch('/api/farmers/upgoods', 'POST', data);
	},
	// 用户提交投诉
	submitComplaint(data){
		return fetch('/api/user/complaint/add', 'POST', data);
	},
	// 我的投诉
	mylist(data){
		return fetch('/api/user/complaint/mylist', 'POST', data);
	},
	// 资讯信息列表
	informationData(data){
		return fetch('/api/news/list', 'POST', data);
	},
	// 资讯信息分类
	classification(data){
		return fetch('/api/news/category/list', 'POST', data);
	},
	
	// 菜品上市
	foodOnSale(data){
		return fetch('/api/farmers/market/addgoods', 'POST', data);
	},
	
	// 菜品下市
	XiaShiCity(data){
		return fetch('/api/farmers/market/editgoods', 'POST', data);
	},
	
	// 发布批发
	publishWholesale(data){
		return fetch('/api/user/sellinfo/add', 'POST', data);
	},
	// 批发列表
	wholesaleList(data){
		return fetch('/api/sellinfo/list', 'POST', data);
	},
	// 我的求购列表
	myProcurementData(data){
		return fetch('/api/user/buyinfo/mylist', 'POST', data);
	},
	// 我的供应列表
	mySupplyData(data){
		return fetch('/api/user/sellinfo/mylist', 'POST', data);
	},
	// 我的地址列表
	myaddressData(data){
		return fetch('/api/user/myaddress', 'POST', data);
	},
	// 添加我的地址
	addMyAddress(data){
		return fetch('/api/user/addaddress', 'POST', data);
	},
	// 编辑我的地址
	editMyAddress(data){
		return fetch('/api/user/editaddress', 'POST', data);
	},
	delMyAddress(data){
		return fetch('/api/user/deladdress', 'POST', data);
	},
	// 现金账单记录
	shopmoneylist(data){
		return fetch('/api/shop/shopmoneylist', 'POST', data);
	},
	// 根据地址获取经纬度
	searchResolution(data){
		return fetch('/api/get/lnglat', 'POST', data);
	},
	// 预买菜品下单
	prePurchaseOrder(data){
		return fetch('/api/user/addorderfarmer', 'POST', data);
	},
	
	manyImages(data){
		return fetch('/api/shop/add/img', 'POST', data);
	},
	getManyImages(data){
		return fetch('/api/shop/get/img/list', 'POST', data);
	},
	
	delManyImages(data){
		return fetch('/api/shop/del/img', 'POST', data);
	},
	// 添加溯源信息
	addTraceability(data){
		return fetch('/api/goods/addinfo', 'POST', data);
	},
	// 获取溯源信息
	traceabilityInfo(data){
		return fetch('/api/goods/get/info', 'POST', data);
	},
	getqrcode(data){
		return fetch('/wx/getqrcode', 'POST', data);
	},
	fromuserlist(data){
		return fetch('/api/user/fromuserlist', 'POST', data);
	},
	// 代理入驻申请
	agentApply(data){
		return fetch('/api/agentuser/add', 'POST', data);
	},
	// 查看代理商信息
	viewAgentInfo(data){
		return fetch('/api/agentuser/info', 'POST', data);
	},
	
	// 邀请用户收益
	userRevenue(data){
		return fetch('/api/my/getusermoneylist', 'POST', data);
	},
	
	
}
export default {
	fetch,
	BASE_URL,
	UPLOAD_URL
};