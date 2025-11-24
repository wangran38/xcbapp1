"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_public = require("../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      showStatus: null
    };
  },
  onShow() {
  },
  async onLoad() {
    this.showStatus = await this.checkApplyStatus();
    common_vendor.index.__f__("log", "at pages/agent/agent.vue:82", this.showStatus, "申请状态");
    if (this.showStatus == 1) {
      common_vendor.index.showModal({
        showCancel: false,
        content: "申请审核中,请耐心等待"
      }).then(() => {
      });
    }
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
  return common_vendor.e({
    a: $data.showStatus == 0
  }, $data.showStatus == 0 ? {
    b: common_vendor.t(""),
    c: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightblue"
    }),
    d: common_vendor.o(($event) => $options.goToRouter("/subPackages/agent/cooperation/cooperation"))
  } : {}, {
    e: $data.showStatus == 2
  }, $data.showStatus == 2 ? {
    f: common_vendor.t(""),
    g: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "lightblue"
    }),
    h: common_vendor.o(($event) => $options.goToRouter("/subPackages/agent/datacenter/datacenter"))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/agent/agent.js.map
