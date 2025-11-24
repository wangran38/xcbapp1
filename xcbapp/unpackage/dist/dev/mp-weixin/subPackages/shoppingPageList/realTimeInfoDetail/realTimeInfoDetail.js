"use strict";
const utils_public = require("../../../utils/public.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  // components:{
  // 	uParse
  // },
  data() {
    return {
      createtime: "",
      detailData: "正在加载中...."
    };
  },
  onLoad({ content, createtime }) {
    this.createtime = createtime;
    this.detailData = decodeURIComponent(content);
  },
  methods: {
    /**
     * 去除字符串中的所有空白字符
     * @param {string} str - 原始字符串
     * @returns {string} 无空白字符的字符串
     */
    removeAllSpaces(str) {
      return String(str).replace(/\s+/g, "");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.initTime($data.createtime))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/realTimeInfoDetail/realTimeInfoDetail.js.map
