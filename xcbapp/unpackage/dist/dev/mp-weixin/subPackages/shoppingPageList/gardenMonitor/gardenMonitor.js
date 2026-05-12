"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      merchantInfo: {},
      // 后期替换成真实直播地址
      videoUrl: ""
    };
  },
  onLoad({ query }) {
    try {
      this.merchantInfo = JSON.parse(query);
    } catch (e) {
      common_vendor.index.__f__("error", "at subPackages/shoppingPageList/gardenMonitor/gardenMonitor.vue:89", "参数解析失败", e);
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
  return common_vendor.e({
    a: common_vendor.p({
      type: "video",
      size: "22",
      color: "#00C26E"
    }),
    b: common_vendor.p({
      type: "person",
      size: "18",
      color: "#3A7AFE"
    }),
    c: common_vendor.t($data.merchantInfo.farmersname),
    d: common_vendor.p({
      type: "location",
      size: "18",
      color: "#3A7AFE"
    }),
    e: common_vendor.t($data.merchantInfo.address),
    f: !$data.videoUrl
  }, !$data.videoUrl ? {
    g: common_vendor.p({
      type: "play",
      size: "50",
      color: "#fff"
    })
  } : {}, {
    h: common_vendor.p({
      type: "refresh",
      size: "16"
    }),
    i: common_vendor.p({
      type: "checkmarkempty",
      size: "18",
      color: "#00C26E"
    }),
    j: common_vendor.p({
      type: "checkmarkempty",
      size: "18",
      color: "#00C26E"
    }),
    k: common_vendor.p({
      type: "checkmarkempty",
      size: "18",
      color: "#00C26E"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a2565446"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/gardenMonitor/gardenMonitor.js.map
