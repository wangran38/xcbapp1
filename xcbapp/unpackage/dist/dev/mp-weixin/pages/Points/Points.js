"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      pagedata: {
        truemoney: 0,
        pagedata: 0
      }
    };
  },
  onShow() {
    this.fetchData();
  },
  methods: {
    goTopagesSettrecords() {
      common_vendor.index.navigateTo({
        url: "/pages/Settrecords/Settrecords"
      });
    },
    // 请求摊主积分接口
    async fetchData() {
      try {
        const response = await api_index.api.mysorce();
        this.pagedata = response.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Points/Points.vue:78", "获取积分数据失败：", error);
      }
    },
    gotoPointspayouts() {
      common_vendor.index.navigateTo({
        url: "/pages/pointspayouts/pointspayouts"
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
    a: common_vendor.t($data.pagedata.score.toFixed(1)),
    b: common_vendor.t($data.pagedata.truemoney.toFixed(1)),
    c: common_vendor.t($data.pagedata.paymoney),
    d: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-wodexiaofei",
      size: "30",
      color: "#007aff"
    }),
    e: common_vendor.o((...args) => $options.goTopagesSettrecords && $options.goTopagesSettrecords(...args)),
    f: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-xiaofeijifenmingxi",
      size: "30",
      color: "#007aff"
    }),
    g: common_vendor.o((...args) => $options.gotoPointspayouts && $options.gotoPointspayouts(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Points/Points.js.map
