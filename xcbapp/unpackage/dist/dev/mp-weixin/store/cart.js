"use strict";
const common_vendor = require("../common/vendor.js");
const useCartStore = common_vendor.defineStore("cart", {
  // 状态：相当于 Vuex 的 state
  state: () => ({
    carts: []
  }),
  getters: {
    // 计算指定店铺的总价（用 Decimal 累加，避免精度偏差）
    cartTotalByShopId: (state) => (shopId) => {
      let total = new common_vendor.Decimal(0);
      state.carts.forEach((item) => {
        if (item.shop_id == shopId) {
          const price = new common_vendor.Decimal(item.price || 0);
          const tempCount = new common_vendor.Decimal(item.tempCount || 0);
          total = total.plus(price.mul(tempCount));
        }
      });
      return total.toFixed(2);
    },
    // 获取指定商品的数量（返回 Decimal 处理后的数值，避免精度偏差）
    getTempCount: (state) => (id) => {
      const item = state.carts.find((i) => i.id === id);
      if (!item)
        return 0;
      return new common_vendor.Decimal(item.tempCount || 0).toNumber();
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
  actions: {
    // 数量加1（用 Decimal 精确计算）
    addItem(item) {
      const index = this.carts.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        const currentCount = new common_vendor.Decimal(this.carts[index].tempCount || 0);
        this.carts[index].tempCount = currentCount.plus(1).toFixed(2);
      } else {
        this.carts.push({
          ...item,
          tempCount: 1
          // 首次添加为整数，无精度问题
        });
      }
    },
    // 数量减一（用 Decimal 精确计算）
    subItem(item) {
      const index = this.carts.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        const currentCount = new common_vendor.Decimal(this.carts[index].tempCount || 0);
        const newCount = currentCount.minus(1);
        if (newCount.greaterThan(1)) {
          this.carts[index].tempCount = newCount.toFixed(2);
        } else {
          this.carts.splice(index, 1);
        }
      }
    },
    // 清空购物车
    clearCart() {
      common_vendor.index.__f__("log", "at store/cart.js:85", "clearCart action triggered");
      this.carts = [];
    },
    // 任意输入数量（用 Decimal 处理赋值和比较）
    anyNumber(item) {
      const index = this.carts.findIndex((i) => i.id === item.id);
      const inputCount = new common_vendor.Decimal(item.count || 0);
      if (index !== -1) {
        if (inputCount.lessThan(0.1)) {
          this.carts.splice(index, 1);
        } else {
          this.carts[index].tempCount = inputCount.toFixed(2);
        }
      } else {
        if (inputCount.greaterThanOrEqualTo(0.1)) {
          this.carts.push({
            ...item,
            tempCount: inputCount.toFixed(2)
          });
        }
      }
    }
  }
});
exports.useCartStore = useCartStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/cart.js.map
