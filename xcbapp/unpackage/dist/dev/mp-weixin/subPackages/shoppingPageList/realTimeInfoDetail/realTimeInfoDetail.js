"use strict";
const utils_public = require("../../../utils/public.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      createtime: "",
      detailData: "正在加载中...."
    };
  },
  onLoad({
    content,
    createtime
  }) {
    this.createtime = createtime;
    this.detailData = decodeURIComponent(content);
  }
};
if (!Array) {
  const _easycom_uv_parse2 = common_vendor.resolveComponent("uv-parse");
  _easycom_uv_parse2();
}
const _easycom_uv_parse = () => "../../../uni_modules/uv-parse/components/uv-parse/uv-parse.js";
if (!Math) {
  _easycom_uv_parse();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.initTime($data.createtime)),
    b: common_vendor.p({
      content: $data.detailData
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/realTimeInfoDetail/realTimeInfoDetail.js.map
