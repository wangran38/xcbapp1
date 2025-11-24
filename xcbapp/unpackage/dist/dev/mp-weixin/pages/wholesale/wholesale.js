"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      cardHeight: "380rpx"
      // 默认卡片高度
    };
  },
  onLoad() {
    this.calculateLayout();
  },
  methods: {
    goToAddPurchase() {
      common_vendor.index.navigateTo({
        url: "/subPackages/Wholesale/addPurchase/addPurchase"
      });
    },
    goToAddSupply() {
      common_vendor.index.navigateTo({
        url: "/subPackages/Wholesale/addSupply/addSupply"
      });
    },
    toggle(type) {
      this.type = type;
      this.$refs.popup.open(type);
    },
    goToPurchase() {
      common_vendor.index.navigateTo({
        url: "/subPackages/Wholesale/purchase/purchase"
      });
    },
    goToSupply() {
      common_vendor.index.navigateTo({
        url: "/subPackages/Wholesale/supply/supply"
      });
    },
    // 计算布局尺寸
    calculateLayout() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.cardHeight = `${systemInfo.windowHeight * 0.3}px`;
    },
    // 页面跳转
    navigateTo(type) {
      const routes = {
        supply: "/pages/supply/supply",
        purchase: "/pages/purchase/purchase"
      };
      common_vendor.index.navigateTo({
        url: routes[type]
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "shop-filled",
      size: "48",
      color: "#fff"
    }),
    b: $data.cardHeight,
    c: common_vendor.o((...args) => $options.goToSupply && $options.goToSupply(...args)),
    d: common_vendor.p({
      type: "cart-filled",
      size: "48",
      color: "#fff"
    }),
    e: $data.cardHeight,
    f: common_vendor.o((...args) => $options.goToPurchase && $options.goToPurchase(...args)),
    g: common_vendor.p({
      type: "plusempty",
      size: "40"
    }),
    h: common_vendor.o(($event) => $options.toggle("bottom")),
    i: common_vendor.o($options.goToAddPurchase),
    j: common_vendor.p({
      type: "plusempty",
      size: "40"
    }),
    k: common_vendor.o($options.goToAddSupply),
    l: common_vendor.p({
      type: "plusempty",
      size: "40"
    }),
    m: common_vendor.sr("popup", "e0b2961b-3")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e0b2961b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wholesale/wholesale.js.map
