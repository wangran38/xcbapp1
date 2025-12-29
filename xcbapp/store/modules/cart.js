import { defineStore } from 'pinia'
import Decimal from 'decimal.js'

export const useCartStore = defineStore('cart', {
  // 状态：相当于 Vuex 的 state
  state: () => ({
    carts: [],
  }),

  // Getters：相当于 Vuex 的 getters
  getters: {
    // 计算指定店铺的总价
    cartTotalByShopId: (state) => (shopId) => {
      // 筛选出指定店铺的商品
      const shopItems = shopId ? state.carts.filter(i => i.shop_id == shopId) : state.carts;
      
      // 计算总价
      return shopItems.reduce((sum, item) => {
        return new Decimal(item.price).mul(item.tempCount).add(sum).toNumber();
      }, 0);
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

  // Actions：相当于 Vuex 的 mutations 和 actions 的结合
  actions: {
    // 数量加1
    addItem(item) {
      // 查找购物车中是否存在该商品
      const index = this.carts.findIndex(i => i.id === item.id)
      
      if (index !== -1) { 
        // 不等于-1就相当于存在，就商品数量就自增1
        this.carts[index].tempCount = new Decimal(this.carts[index].tempCount).add(new Decimal(1)).toNumber();
      } else {
        // 不存在就新增
        this.carts.push({
          ...item,
          tempCount: 1
        });
      }
    },
    
    // 数量减一
    subItem(item) {
      const index = this.carts.findIndex(i => i.id === item.id);
      
      if (index !== -1) {  // 检查购物车里是否有订单
        // 大于1就减掉1
        if (this.carts[index].tempCount > 1) {
          this.carts[index].tempCount = new Decimal(this.carts[index].tempCount).sub(new Decimal(1)).toNumber();
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
        if (item.count < 0.1){
          this.carts.splice(index, 1);
        } else {
          this.carts[index].tempCount = item.count;
        }
      } else {
        // 数量要大于0.1才能push进去
        if (item.count >= 0.1){
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