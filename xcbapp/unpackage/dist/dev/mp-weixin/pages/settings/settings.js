"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  methods: {
    navTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    logout() {
      try {
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.removeStorageSync("nickname");
        common_vendor.index.__f__("log", "at pages/settings/settings.vue:72", "Token and nickname removed from storage");
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/settings/settings.vue:74", "Failed to remove token or nickname from storage", e);
      }
      this.isLoggedIn = false;
      this.nickname = "";
      this.userName = "";
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    },
    // 绑定微信
    async bindingWechat() {
      let systemInfo = await common_vendor.index.getSystemInfo();
      if (systemInfo[1].host && systemInfo[1].host.env == "WeChat") {
        common_vendor.index.login({
          provider: "true",
          success: async (res) => {
            common_vendor.index.__f__("log", "at pages/settings/settings.vue:93", res.code, "这是用户唯一标识");
            let data = await api_index.api.bindingOpenid({
              code: res.code
            });
            let msg = data.message;
            if (data.code == 200) {
              common_vendor.index.showToast({
                title: msg,
                icon: "success"
              });
            } else {
              common_vendor.index.showToast({
                title: msg,
                icon: "error"
              });
            }
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请前往小程序端进行账号绑定",
          duration: 3e3,
          icon: "error"
        });
      }
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
    a: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    b: common_vendor.o(($event) => $options.navTo("/subPackages/settings/user-edit/user-edit")),
    c: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    d: common_vendor.o(($event) => $options.navTo("/subPackages/settings/myAddress/myAddress")),
    e: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    f: common_vendor.o((...args) => $options.bindingWechat && $options.bindingWechat(...args)),
    g: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    h: common_vendor.o(($event) => $options.navTo("/subPackages/settings/updatePwd/updatePwd")),
    i: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    j: common_vendor.o(($event) => $options.navTo("/subPackages/settings/aboutUs/aboutUs")),
    k: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    l: common_vendor.o(($event) => $options.navTo("/subPackages/settings/version/version")),
    m: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/settings/settings.js.map
