"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const _sfc_main = {
  data() {
    return {
      pageData: []
    };
  },
  onShow() {
    this.reloadData();
  },
  mixins: [hooks_usePage.usePage],
  methods: {
    async fetchData(params) {
      const response = await api_index.api.signlist(params);
      return response.data;
    },
    formatPhoneNumber(phoneNumber) {
      if (!phoneNumber)
        return "";
      return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    },
    formatDate(dateString) {
      return dateString.replace(/T/, " ").replace(/(\+\d{2}:\d{2})/, "");
    },
    gotojackpot() {
      common_vendor.index.navigateTo({
        url: "/pages/jackpot/jackpot"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.marketname),
        b: common_vendor.t($options.formatDate(item.Created)),
        c: item.id
      };
    }),
    b: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    c: common_vendor.o((...args) => $options.gotojackpot && $options.gotojackpot(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clock-records/clock-records.js.map
