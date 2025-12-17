"use strict";
const common_vendor = require("../common/vendor.js");
const useCartStore = common_vendor.defineStore("cart", {
  // 状态：相当于 Vuex 的 state
  state: () => ({
    carts: []
  }),
  // Getters：相当于 Vuex 的 getters
  getters: {
    // 计算指定店铺的总价
    cartTotalByShopId: (state) => (shopId) => {
      const shopItems = shopId ? state.carts.filter((i) => i.shop_id == shopId) : state.carts;
      return shopItems.reduce((sum, item) => {
        return new common_vendor.Decimal(item.price).mul(item.tempCount).add(sum).toNumber();
      }, 0);
    },
    // 获取指定商品的数量
    getTempCount: (state) => (id) => {
      const item = state.carts.find((i) => i.id === id);
      return item ? item.tempCount : 0;
    },
    // 计算指定店铺的商品数量
    cartsLengthByShopId: (state) => (shopId) => {
      return shopId ? state.carts.filter((i) => i.shop_id == shopId).length : state.carts.length || 0;
    },
    // 获取指定店铺的所有商品
    getCartsByShopId: (state) => (shopId) => {
      return shopId ? state.carts.filter((i) => i.shop_id == shopId) : state.carts;
    }
  },
  // Actions：相当于 Vuex 的 mutations 和 actions 的结合
  actions: {
    // 数量加1
    addItem(item) {
      const index = this.carts.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.carts[index].tempCount = new common_vendor.Decimal(this.carts[index].tempCount).add(new common_vendor.Decimal(1)).toNumber();
      } else {
        this.carts.push({
          ...item,
          tempCount: 1
        });
      }
    },
    // 数量减一
    subItem(item) {
      const index = this.carts.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        if (this.carts[index].tempCount > 1) {
          this.carts[index].tempCount = new common_vendor.Decimal(this.carts[index].tempCount).sub(new common_vendor.Decimal(1)).toNumber();
        } else {
          this.carts.splice(index, 1);
        }
      }
    },
    // 清空购物车
    clearCart() {
      common_vendor.index.__f__("log", "at store/cart.js:76", "clearCart action triggered");
      this.carts = [];
    },
    // 任意输入数量
    anyNumber(item) {
      const index = this.carts.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        if (item.count < 0.1) {
          this.carts.splice(index, 1);
        } else {
          this.carts[index].tempCount = item.count;
        }
      } else {
        if (item.count >= 0.1) {
          this.carts.push({
            ...item,
            tempCount: item.count
          });
        }
      }
    }
  }
});
exports.useCartStore = useCartStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/cart.js.map
