"use strict";
const common_vendor = require("../../common/vendor.js");
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
      showCartLayer1: false
    };
  },
  computed: {
    ...common_vendor.mapState("cart", ["carts"]),
    ...common_vendor.mapGetters("cart", ["cartTotalByShopId", "getTempCount", "cartsLengthByShopId", "getCartsByShopId"])
  },
  methods: {
    ...common_vendor.mapMutations("cart", ["addItem", "subItem", "clearCart"]),
    clickCart() {
      common_vendor.index.__f__("log", "at components/shop-item/shop-item.vue:95", this.showCartLayer1);
      this.showCartLayer1 = !this.showCartLayer1;
    },
    goToBuyPage() {
      common_vendor.index.navigateTo({
        url: `/pages/Buy/Buy?id=${this.shop_id}`
      });
    },
    // 清空购物车
    clearCart() {
      this.$store.commit("cart/clearCart");
      common_vendor.index.__f__("log", "at components/shop-item/shop-item.vue:108", "clearCart method called");
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
    d: common_vendor.f(_ctx.getCartsByShopId($props.shop_id), (item, k0, i0) => {
      return {
        a: common_vendor.t(item.shopTitle),
        b: "a8327be0-1-" + i0,
        c: item.imglogo,
        d: common_vendor.t(item.commodity_name),
        e: common_vendor.t(item.price.toFixed(2)),
        f: common_vendor.o(($event) => _ctx.subItem(item), item.id),
        g: common_vendor.t(_ctx.getTempCount(item.id)),
        h: common_vendor.o(($event) => _ctx.addItem(item), item.id),
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
    h: common_vendor.t(_ctx.cartsLengthByShopId($props.shop_id)),
    i: common_vendor.t(_ctx.cartTotalByShopId($props.shop_id)),
    j: common_vendor.o((...args) => $options.clickCart && $options.clickCart(...args)),
    k: common_vendor.o((...args) => $options.goToBuyPage && $options.goToBuyPage(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a8327be0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shop-item/shop-item.js.map
