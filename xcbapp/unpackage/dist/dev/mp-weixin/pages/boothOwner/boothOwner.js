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
    c: common_vendor.o(($event) => $options.goToRouter("/pages/Apply/Apply")),
    d: common_vendor.t(""),
    e: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    f: common_vendor.o(($event) => $options.goToRouter("/pages/stalllist/stalllist")),
    g: common_vendor.t(""),
    h: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightblue"
    }),
    i: common_vendor.o(($event) => $options.goToRouter("/pages/editshop/editshop")),
    j: common_vendor.t(""),
    k: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightblue"
    }),
    l: common_vendor.o(($event) => $options.goToRouter("/subPackages/boothOwner/salesApplication/salesApplication")),
    m: common_vendor.t(""),
    n: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    o: common_vendor.o(($event) => $options.goToRouter("/subPackages/boothOwner/storeSettings/storeSettings")),
    p: common_vendor.t(""),
    q: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightblue"
    }),
    r: common_vendor.o(($event) => $options.goToRouter("/pages/release/release")),
    s: common_vendor.t(""),
    t: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    v: common_vendor.o(($event) => $options.goToRouter("/pages/publish/publish")),
    w: common_vendor.t(""),
    x: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    y: common_vendor.o(($event) => $options.goToRouter("/pages/Listed-Dishes/Listed-Dishes")),
    z: common_vendor.o(($event) => $options.gotoOwneroders(0)),
    A: common_vendor.t(""),
    B: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "red"
    }),
    C: common_vendor.o(($event) => $options.gotoOwneroders(1)),
    D: common_vendor.t(""),
    E: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "red"
    }),
    F: common_vendor.o(($event) => $options.gotoOwneroders(3)),
    G: common_vendor.t(""),
    H: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "red"
    }),
    I: common_vendor.o(($event) => $options.gotoOwneroders(5)),
    J: common_vendor.t(""),
    K: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightgreen"
    }),
    L: common_vendor.o(($event) => $options.gotoOwneroders(6)),
    M: common_vendor.t(""),
    N: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    O: common_vendor.o(($event) => $options.goToRouter("/pages/wallet/wallet")),
    P: common_vendor.t(""),
    Q: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    R: common_vendor.o(($event) => $options.goToRouter("/pages/Points/Points")),
    S: common_vendor.t(""),
    T: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    U: common_vendor.o(($event) => $options.goToRouter("/pages/pointspayouts/pointspayouts")),
    V: common_vendor.t(""),
    W: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    X: common_vendor.o(($event) => $options.goToRouter("/pages/bankCard/bankCard"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/boothOwner/boothOwner.js.map
