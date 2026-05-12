"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      password: "",
      isAgree: false
    };
  },
  computed: {
    canSubmit() {
      return this.isAgree && this.password.trim() !== "";
    }
  },
  methods: {
    agreeChange(e) {
      this.isAgree = e.detail.value.length > 0;
    },
    goPrivacy() {
      common_vendor.index.navigateTo({
        url: "/pages/logoutAgreement/logoutAgreement"
      });
    },
    showConfirm() {
      common_vendor.index.showModal({
        title: "确认注销账号",
        content: "注销后数据无法恢复，确定继续吗？",
        confirmText: "确认注销",
        confirmColor: "#ff4444",
        success: (res) => {
          if (res.confirm)
            this.submitCancel();
        }
      });
    },
    submitCancel() {
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "注销申请已提交",
          content: "审核完成后将自动注销账号",
          showCancel: false,
          success: () => {
            common_vendor.index.clearStorageSync();
            common_vendor.index.reLaunch({
              url: "/pages/login/login"
            });
          }
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.password,
    b: common_vendor.o(($event) => $data.password = $event.detail.value),
    c: $data.isAgree,
    d: common_vendor.o((...args) => $options.goPrivacy && $options.goPrivacy(...args)),
    e: common_vendor.o((...args) => $options.agreeChange && $options.agreeChange(...args)),
    f: common_vendor.n($options.canSubmit ? "active" : "disabled"),
    g: !$options.canSubmit,
    h: common_vendor.o((...args) => $options.showConfirm && $options.showConfirm(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-695c4a7b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/loGout/loGout.js.map
