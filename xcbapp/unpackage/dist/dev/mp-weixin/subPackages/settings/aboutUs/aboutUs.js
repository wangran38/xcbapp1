"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    // 跳转隐私政策
    goPrivacy() {
      common_vendor.index.navigateTo({
        url: "/pages/privacyAgreement/privacyAgreement"
      });
    },
    // 跳转服务协议
    goService() {
      common_vendor.index.navigateTo({
        url: "/pages/userServiceAgreement/userServiceAgreement"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$4,
    b: common_vendor.o((...args) => $options.goPrivacy && $options.goPrivacy(...args)),
    c: common_vendor.o((...args) => $options.goService && $options.goService(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a6e688b6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/aboutUs/aboutUs.js.map
