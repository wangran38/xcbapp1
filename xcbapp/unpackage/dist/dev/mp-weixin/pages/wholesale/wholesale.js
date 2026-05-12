"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      cardHeight: "380rpx",
      selltotalnum: 0,
      buytotalnum: 0
    };
  },
  onLoad() {
    this.calculateLayout();
    this.getData();
  },
  methods: {
    async getData() {
      let data = await api_index.api.buysellTotal();
      if (data.code == 200) {
        this.selltotalnum = data.data.selltotalnum;
        this.buytotalnum = data.data.buytotalnum;
      }
    },
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
    calculateLayout() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.cardHeight = `${systemInfo.windowHeight * 0.28}px`;
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
      size: "64",
      color: "#fff"
    }),
    b: $data.cardHeight,
    c: common_vendor.o((...args) => $options.goToSupply && $options.goToSupply(...args)),
    d: common_vendor.p({
      type: "cart-filled",
      size: "64",
      color: "#fff"
    }),
    e: $data.cardHeight,
    f: common_vendor.o((...args) => $options.goToPurchase && $options.goToPurchase(...args)),
    g: common_vendor.p({
      type: "shop-filled",
      size: "36",
      color: "#2d8cf0"
    }),
    h: common_vendor.t($data.selltotalnum),
    i: common_vendor.p({
      type: "cart-filled",
      size: "36",
      color: "#ff6a00"
    }),
    j: common_vendor.t($data.buytotalnum),
    k: common_vendor.p({
      type: "plusempty",
      size: "42",
      color: "#fff"
    }),
    l: common_vendor.o(($event) => $options.toggle("bottom")),
    m: common_vendor.p({
      type: "cart-filled",
      size: "56",
      color: "#ff4d4f"
    }),
    n: common_vendor.o((...args) => $options.goToAddPurchase && $options.goToAddPurchase(...args)),
    o: common_vendor.p({
      type: "shop-filled",
      size: "56",
      color: "#2d8cf0"
    }),
    p: common_vendor.o((...args) => $options.goToAddSupply && $options.goToAddSupply(...args)),
    q: common_vendor.sr("popup", "e0b2961b-5")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e0b2961b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wholesale/wholesale.js.map
