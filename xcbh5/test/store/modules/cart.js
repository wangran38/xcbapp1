// store/modules/cart.js

import Decimal from 'decimal'

const state = {
	carts: [],
};

const mutations = {
	// 数量加1
	addItem(state, item) {
		// 查找购物车中是否存在该商品
		const index = state.carts.findIndex(i => i.id === item.id)
		
		if (index !== -1) { 
			// 不等于-1就相当于存在，就商品数量就自增1
			state.carts[index].tempCount = new Decimal(state.carts[index].tempCount).add(new Decimal(1)).toNumber()
			// state.carts[index].tempCount += 1;
		} else {
			// 不存在就新增
			state.carts.push({
				...item,
				tempCount: 1
			});
		}
	},
	
	// 数量减一
	subItem(state, item) {
		const index = state.carts.findIndex(i => i.id === item.id);
		
		if (index !== -1) {  // 检查购物车里是否有订单
			
			// 大于1就减掉1
			if (state.carts[index].tempCount > 1) {
				
				state.carts[index].tempCount = new Decimal(state.carts[index].tempCount).sub(new Decimal(1)).toNumber()
				// state.carts[index].tempCount -= 1;
			} else {
				// 删除数组项
				state.carts.splice(index, 1);
			}
		}
	},
	// 清空购物车
	clearCart(state) {
		console.log('clearCart mutation triggered');
		state.carts = [];
	},


	//  任意输入数量
	anyNumber(state, item) {
		const index = state.carts.findIndex(i => i.id === item.id);
		// 不等于-1就相当于存在，就商品数量就修改数量
		if (index !== -1) {
			// 如果输入数量小于0.1就删除数组
			if (item.count < 0.1){
				state.carts.splice(index, 1);
			}else{
				state.carts[index].tempCount = item.count;
			}
		}
		 else {
			 // 数量要大于0.1才能push进去
			 if (item.count>=0.1){
				 // 反之不存在就新增
				 state.carts.push({
				 	...item,
				 	tempCount: item.count
				 });
			 }
		}
	}
};

const getters = {
	cartTotalByShopId: (state) => (shopId) => {
		// return shopId ? state.carts.filter(i => i.shop_id == shopId).reduce((sum, item) => sum + item.tempCount * item.price, 0) :  state.carts.reduce((sum, item) => sum + item.tempCount * item.price, 0);
		return shopId ? state.carts.filter(i => i.shop_id == shopId).reduce((sum, item) => new Decimal(item
			.price).mul(item.tempCount).add(sum).toNumber(), 0).toFixed(1) : state.carts.reduce((sum, item) => sum +
			new Decimal(item.price).mul(item.tempCount).add(sum).toNumber(), 0);
	},
	getTempCount: (state) => (id) => {
		const item = state.carts.find(i => i.id === id);
		return item ? item.tempCount : 0;
	},
	cartsLengthByShopId: (state) => (shopId) => {
		return shopId ? state.carts.filter(i => i.shop_id == shopId).length : state.carts.length || 0;
	},
	getCartsByShopId: (state) => (shopId) => {
		return shopId ? state.carts.filter(i => i.shop_id == shopId) : state.carts;
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	getters
};