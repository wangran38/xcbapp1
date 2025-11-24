"use strict";
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      pageData: [],
      isLoading: false
    };
  },
  onShow() {
    this.reloadData();
  },
  mixins: [hooks_usePage.usePage],
  methods: {
    async fetchData(params) {
      const response = await api_index.api.shopsorcelist(params);
      return response.data;
    },
    formatDate(dateString) {
      return dateString.replace(/T/, " ").replace(/(\+\d{2}:\d{2})/, "");
    },
    getStatusLabel(status) {
      switch (status) {
        case 1:
          return "申请中";
        case 2:
          return "已结算";
        default:
          return "";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    b: !$data.isLoading && $data.pageData.length === 0
  }, !$data.isLoading && $data.pageData.length === 0 ? {
    c: common_assets._imports_0
  } : {}, {
    d: common_vendor.f($data.pageData, (item, index, i0) => {
      return {
        a: common_vendor.t($options.formatDate(item.Created).split(" ")[0]),
        b: common_vendor.t($options.formatDate(item.Created).split(" ")[1]),
        c: common_vendor.t(item.shopscore / 10),
        d: common_vendor.t($options.getStatusLabel(item.status)),
        e: common_vendor.n(item.status === 1 ? "pending" : "completed"),
        f: item.id
      };
    }),
    e: _ctx.hasMore
  }, _ctx.hasMore ? {} : {}, {
    f: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Settrecords/Settrecords.js.map
