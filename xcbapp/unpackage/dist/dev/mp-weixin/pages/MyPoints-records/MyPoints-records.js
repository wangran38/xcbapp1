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
  computed: {
    sum() {
      let res = 0;
      this.pageData.forEach((item) => {
        if (item.isadd == 1) {
          res += item.score;
        } else {
          res -= item.score;
        }
      });
      return res;
    }
  },
  onShow() {
    this.reloadData();
  },
  mixins: [hooks_usePage.usePage],
  methods: {
    async fetchData(params) {
      const response = await api_index.api.scorelist(params);
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
  return common_vendor.e({
    a: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.memo),
        b: common_vendor.t(item.isadd === 1 ? "+" : "-"),
        c: common_vendor.t(item.isadd === 1 ? item.after - item.before : item.before - item.after),
        d: common_vendor.n(item.isadd === 1 ? "green-text" : "red-text"),
        e: common_vendor.t($options.formatDate(item.Created)),
        f: item.id
      };
    }),
    b: _ctx.pageLoading
  }, _ctx.pageLoading ? {} : {}, {
    c: !_ctx.hasMore
  }, !_ctx.hasMore ? {
    d: common_vendor.t($options.sum)
  } : {}, {
    e: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    f: common_vendor.o((...args) => $options.gotojackpot && $options.gotojackpot(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/MyPoints-records/MyPoints-records.js.map
