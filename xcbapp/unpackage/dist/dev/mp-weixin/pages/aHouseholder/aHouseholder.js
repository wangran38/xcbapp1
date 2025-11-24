"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  onShow() {
  },
  methods: {
    /**
     * @description 路由跳转
     */
    goToRouter(url) {
      try {
        common_vendor.index.navigateTo({
          url
        });
      } catch {
        common_vendor.index.switchTab({
          url
        });
      }
    },
    gotoOwneroders(orderStatus) {
      common_vendor.index.navigateTo({
        url: `/pages/Ownerorders/Ownerorders?orderStatus=${orderStatus}`
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
  return {
    a: common_vendor.t(""),
    b: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightblue"
    }),
    c: common_vendor.o(($event) => $options.goToRouter("/pages/onlineBooth/onlineBooth")),
    d: common_vendor.t(""),
    e: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightblue"
    }),
    f: common_vendor.o(($event) => $options.goToRouter("/subPackages/aHouseholder/additionalInformation/additionalInformation")),
    g: common_vendor.t(""),
    h: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    i: common_vendor.o(($event) => $options.goToRouter("/subPackages/boothOwner/storeSettings/storeSettings")),
    j: common_vendor.t(""),
    k: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    l: common_vendor.o(($event) => $options.goToRouter("/pages/preSale/preSale")),
    m: common_vendor.t(""),
    n: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    o: common_vendor.o(($event) => $options.goToRouter("/subPackages/aHouseholder/PreSoldDishesList/PreSoldDishesList")),
    p: common_vendor.t(""),
    q: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    r: common_vendor.o(($event) => $options.goToRouter("/subPackages/aHouseholder/alreadyListed/alreadyListed")),
    s: common_vendor.o(($event) => $options.gotoOwneroders(0)),
    t: common_vendor.t(""),
    v: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "red"
    }),
    w: common_vendor.o(($event) => $options.gotoOwneroders(1)),
    x: common_vendor.t(""),
    y: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "red"
    }),
    z: common_vendor.o(($event) => $options.gotoOwneroders(3)),
    A: common_vendor.t(""),
    B: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "red"
    }),
    C: common_vendor.o(($event) => $options.gotoOwneroders(5)),
    D: common_vendor.t(""),
    E: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    F: common_vendor.o(($event) => $options.gotoOwneroders(6)),
    G: common_vendor.t(""),
    H: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    I: common_vendor.o(($event) => $options.goToRouter("/pages/wallet/wallet")),
    J: common_vendor.t(""),
    K: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    L: common_vendor.o(($event) => $options.goToRouter("/pages/bankCard/bankCard"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/aHouseholder/aHouseholder.js.map
