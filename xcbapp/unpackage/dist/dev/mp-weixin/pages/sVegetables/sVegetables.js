"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    // 跳转至我的摊主
    goToBoothOwner() {
      if (this.checkToken()) {
        common_vendor.index.showModal({
          showCancel: false,
          content: "暂未登录,请前往登录"
        }).then(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/boothOwner/boothOwner"
        });
      }
    },
    // 跳转至我的代理商
    goToAgent() {
      if (this.checkToken()) {
        common_vendor.index.showModal({
          showCancel: false,
          content: "暂未登录,请前往登录"
        }).then(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/agent/agent"
        });
      }
    },
    // 跳转至我的户主
    goToAhouseholder() {
      if (this.checkToken()) {
        common_vendor.index.showModal({
          showCancel: false,
          content: "暂未登录,请前往登录"
        }).then(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/aHouseholder/aHouseholder"
        });
      }
    },
    // 检查是否token存在，存在则已登陆
    checkToken() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        return true;
      }
      return false;
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
      type: "staff-filled",
      size: "58",
      color: "#fff"
    }),
    b: common_vendor.p({
      type: "right",
      size: "24",
      color: "#ccc"
    }),
    c: common_vendor.o((...args) => $options.goToBoothOwner && $options.goToBoothOwner(...args)),
    d: common_vendor.p({
      type: "person-filled",
      size: "58",
      color: "#fff"
    }),
    e: common_vendor.p({
      type: "right",
      size: "24",
      color: "#ccc"
    }),
    f: common_vendor.o((...args) => $options.goToAhouseholder && $options.goToAhouseholder(...args)),
    g: common_vendor.p({
      type: "auth",
      size: "58",
      color: "#fff"
    }),
    h: common_vendor.p({
      type: "right",
      size: "24",
      color: "#ccc"
    }),
    i: common_vendor.o((...args) => $options.goToAgent && $options.goToAgent(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9c8f2f2f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/sVegetables/sVegetables.js.map
