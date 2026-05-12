"use strict";
const common_vendor = require("../../common/vendor.js");
const store_cart = require("../../store/cart.js");
const _sfc_main = {
  name: "shop-item",
  props: {
    shop_id: {
      type: [Number, String],
      default: ""
    }
  },
  data() {
    return {
      showCartLayer1: false,
      // 3. 初始化 cartStore 实例（选项式 API 中挂载到实例）
      cartStore: null
    };
  },
  created() {
    this.cartStore = store_cart.useCartStore();
  },
  computed: {
    // 5. 替换 mapState('cart', ['carts'])：直接访问 Pinia 状态
    carts() {
      return this.cartStore.carts;
    },
    getCartsByShopId() {
      return this.carts.filter((item) => item.shop_id === this.shop_id);
    },
    // 商品总价
    cartTotalByShopId() {
      if (!Array.isArray(this.carts))
        return 0;
      const total = this.getCartsByShopId.reduce((sum, item) => {
        const price = Number(item == null ? void 0 : item.price) || 0;
        const count = Number(item == null ? void 0 : item.tempCount) || 0;
        return sum + price * count;
      }, 0);
      return Number(total.toFixed(2));
    },
    getTempCount() {
      return (itemId) => {
        const item = this.carts.find((i) => i.id === itemId);
        return item ? item.quantity || 1 : 0;
      };
    }
  },
  methods: {
    addItem(item) {
      this.cartStore.addItem(item);
    },
    subItem(item) {
      this.cartStore.subItem(item);
    },
    clearCart() {
      this.cartStore.carts = this.cartStore.carts.filter(
        (item) => item.shop_id !== this.shop_id
      );
      common_vendor.index.__f__("log", "at components/shop-item/shop-item.vue:129", "当前店铺购物车已清空");
    },
    // 原有交互方法不变
    clickCart() {
      common_vendor.index.__f__("log", "at components/shop-item/shop-item.vue:133", this.showCartLayer1);
      this.showCartLayer1 = !this.showCartLayer1;
    },
    goToBuyPage() {
      common_vendor.index.navigateTo({
        url: `/pages/Buy/Buy?id=${this.shop_id}`
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showCartLayer1
  }, $data.showCartLayer1 ? {
    b: common_vendor.p({
      type: "trash",
      size: "40rpx"
    }),
    c: common_vendor.o((...args) => $options.clearCart && $options.clearCart(...args)),
    d: common_vendor.f($options.getCartsByShopId, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.shopTitle),
        b: "a8327be0-1-" + i0,
        c: item.imglogo,
        d: common_vendor.t(item.commodity_name),
        e: common_vendor.t(item.price.toFixed(2)),
        f: common_vendor.o(($event) => $options.subItem(item), item.id),
        g: common_vendor.t($data.cartStore.getTempCount(item.id)),
        h: common_vendor.o(($event) => $options.addItem(item), item.id),
        i: item.id
      };
    }),
    e: common_vendor.p({
      type: "right",
      size: "14",
      color: "#ccc"
    }),
    f: common_vendor.o(() => {
    })
  } : {}, {
    g: common_vendor.p({
      type: "cart",
      size: "40",
      color: "white"
    }),
    h: common_vendor.t($data.cartStore.cartsLengthByShopId($props.shop_id)),
    i: common_vendor.t($options.cartTotalByShopId),
    j: common_vendor.o((...args) => $options.clickCart && $options.clickCart(...args)),
    k: common_vendor.o((...args) => $options.goToBuyPage && $options.goToBuyPage(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a8327be0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shop-item/shop-item.js.map
