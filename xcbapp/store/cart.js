import {
	defineStore
} from 'pinia'
import Decimal from 'decimal'

export const useCartStore = defineStore('cart', {
	// 状态：相当于 Vuex 的 state
	state: () => ({
		carts: [],
	}),

	getters: {
		// 计算指定店铺的总价
		cartTotalByShopId: (state) => (shopId) => {
			let tempcount = 0;
			state.carts.filter((item) => {
				if (item.shop_id == shopId) {
					tempcount += item.price * item.tempCount
				}
			})
			return tempcount
		},

	// 获取指定商品的数量
	getTempCount: (state) => (id) => {
		const item = state.carts.find(i => i.id === id);
		return item ? item.tempCount : 0;
	},

	// 计算指定店铺的商品数量
	cartsLengthByShopId: (state) => (shopId) => {
		return shopId ? state.carts.filter(i => i.shop_id == shopId).length : state.carts.length || 0;
	},

	// 获取指定店铺的所有商品
	getCartsByShopId: (state) => (shopId) => {
		return shopId ? state.carts.filter(i => i.shop_id == shopId) : state.carts;
	}
},
actions: {
	// 数量加1
	addItem(item) {
		const index = this.carts.findIndex(i => i.id === item.id);

		if (index !== -1) {
			// 用原生 Number 替代 Decimal，避免库内部的 constructor 判断
			const currentCount = Number(this.carts[index].tempCount) || 0; // 强制转数字，兜底 0
			this.carts[index].tempCount = currentCount + 1; // 原生加法，无报错风险
			// console.log("新增后数量：", this.carts[index].tempCount);
		} else {
			this.carts.push({
				...item,
				tempCount: 1 // 首次添加确保是有效数字
			});
		}
	},

	// 数量减一
	subItem(item) {
		const index = this.carts.findIndex(i => i.id === item.id);

		if (index !== -1) {
			// 大于1就减掉1
			if (this.carts[index].tempCount > 1) {
				const currentCount = Number(this.carts[index].tempCount) || 0; // 强制转数字，兜底 0
				this.carts[index].tempCount = currentCount - 1; // 原生加法，无报错风险
				// console.log("新增后数量：", this.carts[index].tempCount);
			} else {
				// 删除数组项
				this.carts.splice(index, 1);
			}


		}


	},

	// 清空购物车
	clearCart() {
		console.log('clearCart action triggered');
		this.carts = [];
	},

	// 任意输入数量
	anyNumber(item) {
		const index = this.carts.findIndex(i => i.id === item.id);
		// 不等于-1就相当于存在，就商品数量就修改数量
		if (index !== -1) {
			// 如果输入数量小于0.1就删除数组
			if (item.count < 0.1) {
				this.carts.splice(index, 1);
			} else {
				this.carts[index].tempCount = item.count;
			}
		} else {
			// 数量要大于0.1才能push进去
			if (item.count >= 0.1) {
				// 反之不存在就新增
				this.carts.push({
					...item,
					tempCount: item.count
				});
			}
		}
	}
}
});