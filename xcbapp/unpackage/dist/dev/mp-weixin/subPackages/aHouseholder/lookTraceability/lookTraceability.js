"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_public = require("../../../utils/public.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      productInfo: {},
      dataIsNull: false
    };
  },
  mixins: [utils_public.myMixin],
  onLoad(prop) {
    api_index.api.lookTraceability({
      commodity_id: parseInt(prop.commodity_id)
    }).then((data) => {
      if (data.code == 200) {
        this.productInfo = data.data;
      } else {
        this.dataIsNull = true;
      }
    });
  },
  methods: {
    /**
     * 提交反馈
     */
    submitFeedback() {
      common_vendor.index.showLoading({
        title: "正在提交....",
        success: () => {
          setTimeout(() => {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              icon: "success",
              title: "提交成功",
              success: () => {
                setTimeout(() => this.customizeBack(), 1e3);
              }
            });
          }, 1e3);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.dataIsNull
  }, !$data.dataIsNull ? {
    b: common_vendor.t($data.productInfo.commodity_name),
    c: common_vendor.t($data.productInfo.baddress),
    d: common_vendor.t(_ctx.initDate($data.productInfo.btime)),
    e: common_vendor.t($data.productInfo.fodder),
    f: common_vendor.t($data.productInfo.fodderfrom),
    g: common_vendor.t($data.productInfo.fodderaddress),
    h: common_vendor.t($data.productInfo.fodderphone),
    i: common_vendor.t($data.productInfo.pesticide),
    j: common_vendor.t($data.productInfo.pesticidefrom),
    k: common_vendor.t($data.productInfo.pesticideaddress),
    l: common_vendor.t($data.productInfo.pesticidephone)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/lookTraceability/lookTraceability.js.map
