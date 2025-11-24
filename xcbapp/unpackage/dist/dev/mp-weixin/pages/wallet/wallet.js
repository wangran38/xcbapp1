"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      shopmoney: null,
      mymoney: null
    };
  },
  onLoad() {
    api_index.api.mymoney({}).then(({ data }) => {
      this.mymoney = data.mymoney;
      this.shopmoney = data.shopmoney;
    });
  },
  methods: {
    goToBillRecord() {
      common_vendor.index.navigateTo({
        url: "/subPackages/boothOwner/billRecord/billRecord"
      });
    },
    goToweChatCashwWithdrawal() {
      common_vendor.index.navigateTo({
        url: "/pages/weChatCashwWithdrawal/weChatCashwWithdrawal"
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
    a: common_vendor.t($data.shopmoney),
    b: common_vendor.t($data.shopmoney),
    c: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-wodexiaofei",
      size: "30",
      color: "#007aff"
    }),
    d: common_vendor.o((...args) => $options.goToBillRecord && $options.goToBillRecord(...args)),
    e: common_vendor.o($options.goToweChatCashwWithdrawal),
    f: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-xiaofeijifenmingxi",
      size: "30",
      color: "#007aff"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wallet/wallet.js.map
