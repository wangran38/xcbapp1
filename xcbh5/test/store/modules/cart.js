// store/modules/cart.js

import Decimal from 'decimal'

const state = {
	carts: [],
};

const mutations = {
	addItem(state, item) {
		const index = state.carts.findIndex(i => i.id === item.id)
		if (index !== -1) {
			state.carts[index].tempCount += 1;
		} else {
			state.carts.push({
				...item,
				tempCount: 1
			});
		}
	},
	subItem(state, item) {
		const index = state.carts.findIndex(i => i.id === item.id);
		if (index !== -1) {
			if (state.carts[index].tempCount > 1) {
				state.carts[index].tempCount -= 1;
			} else {
				state.carts.splice(index, 1);
			}
		}
	},
	// 清空购物车
	clearCart(state) {
		console.log('clearCart mutation triggered');
		state.carts = [];
	}
};

const getters = {
	cartTotalByShopId: (state) => (shopId) => {
		// return shopId ? state.carts.filter(i => i.shop_id == shopId).reduce((sum, item) => sum + item.tempCount * item.price, 0) :  state.carts.reduce((sum, item) => sum + item.tempCount * item.price, 0);
		return shopId ? state.carts.filter(i => i.shop_id == shopId).reduce((sum, item) => new Decimal(item
			.price).mul(item.tempCount).add(sum).toNumber(), 0) : state.carts.reduce((sum, item) => sum +
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