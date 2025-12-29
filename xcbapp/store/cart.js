import { defineStore } from 'pinia'
import Decimal from 'decimal.js'

export const useCartStore = defineStore('cart', {
  // 状态：相当于 Vuex 的 state
  state: () => ({
    carts: [],
  }),

  getters: {
    // 计算指定店铺的总价（用 Decimal 累加，避免精度偏差）
    cartTotalByShopId: (state) => (shopId) => {
      // 初始化总价为 0（Decimal 类型）
      let total = new Decimal(0);
      state.carts.forEach((item) => {
        if (item.shop_id == shopId) {
          // 修正2：价格和数量都转为 Decimal 后相乘，再累加
          const price = new Decimal(item.price || 0);
          const tempCount = new Decimal(item.tempCount || 0);
          total = total.plus(price.mul(tempCount));
        }
      });
      // 转为字符串或数字（保留2位小数，适配金额/小数数量场景）
      return total.toFixed(2);
    },

    // 获取指定商品的数量（返回 Decimal 处理后的数值，避免精度偏差）
    getTempCount: (state) => (id) => {
      const item = state.carts.find(i => i.id === id);
      if (!item) return 0;
      // 修正3：返回高精度数值（可保留2位小数）
      return new Decimal(item.tempCount || 0).toNumber();
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
    // 数量加1（用 Decimal 精确计算）
    addItem(item) {
      const index = this.carts.findIndex(i => i.id === item.id);

      if (index !== -1) {
        // 修正4：用 Decimal 处理加法，避免精度丢失
        const currentCount = new Decimal(this.carts[index].tempCount || 0);
        // 加 1 后保留2位小数（可根据你的场景调整小数位数）
        this.carts[index].tempCount = currentCount.plus(1).toFixed(2);
      } else {
        this.carts.push({
          ...item,
          tempCount: 1 // 首次添加为整数，无精度问题
        });
      }
    },

    // 数量减一（用 Decimal 精确计算）
    subItem(item) {
      const index = this.carts.findIndex(i => i.id === item.id);

      if (index !== -1) {
        const currentCount = new Decimal(this.carts[index].tempCount || 0);
        const newCount = currentCount.minus(1);

        // 大于1就更新数量，否则删除数组项
        if (newCount.greaterThan(1)) {
          // 保留2位小数
          this.carts[index].tempCount = newCount.toFixed(2);
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

    // 任意输入数量（用 Decimal 处理赋值和比较）
    anyNumber(item) {
      const index = this.carts.findIndex(i => i.id === item.id);
      // 修正6：用 Decimal 处理输入数量，避免精度偏差
      const inputCount = new Decimal(item.count || 0);

      // 不等于-1就相当于存在，修改商品数量
      if (index !== -1) {
        // 修正7：用 Decimal 比较，避免浮点数偏差导致判断错误
        if (inputCount.lessThan(0.1)) {
          this.carts.splice(index, 1);
        } else {
          // 保留2位小数
          this.carts[index].tempCount = inputCount.toFixed(2);
        }
      } else {
        // 数量大于等于0.1才能push进去
        if (inputCount.greaterThanOrEqualTo(0.1)) {
          // 反之不存在就新增
          this.carts.push({
            ...item,
            tempCount: inputCount.toFixed(2)
          });
        }
      }
    }
  }
});