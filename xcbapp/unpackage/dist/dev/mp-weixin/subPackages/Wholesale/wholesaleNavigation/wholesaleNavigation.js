"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      supplyCount: 15,
      // 当前供应数量
      purchaseCount: 8,
      // 当前采购数量
      totalSupply: 238,
      // 历史供应总量
      totalPurchase: 156
      // 历史采购总量
    };
  },
  methods: {
    navToMySupply() {
      common_vendor.index.navigateTo({ url: "/subPackages/Wholesale/mySupply/mySupply" });
    },
    navToMyPurchase() {
      common_vendor.index.navigateTo({ url: "/subPackages/Wholesale/myProcurement/myProcurement" });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "shop-filled",
      size: "48",
      color: "#fff"
    }),
    b: common_vendor.p({
      type: "right",
      size: "28",
      color: "#fff"
    }),
    c: common_vendor.o((...args) => $options.navToMySupply && $options.navToMySupply(...args)),
    d: common_vendor.p({
      type: "cart-filled",
      size: "48",
      color: "#fff"
    }),
    e: common_vendor.p({
      type: "right",
      size: "28",
      color: "#fff"
    }),
    f: common_vendor.o((...args) => $options.navToMyPurchase && $options.navToMyPurchase(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/wholesaleNavigation/wholesaleNavigation.js.map
