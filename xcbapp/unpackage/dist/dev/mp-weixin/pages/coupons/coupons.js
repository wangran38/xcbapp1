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
      const response = await api_index.api.mycoupon(params);
      return response.data;
    },
    click(item) {
      common_vendor.index.showToast({
        title: "请在购买时使用优惠券",
        icon: "none"
      });
      item.isUse = true;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.price),
        b: common_vendor.t(item.coupon_name),
        c: common_vendor.n(item.isUse ? "use" : ""),
        d: item.id,
        e: common_vendor.o(($event) => $options.click(item), item.id)
      };
    }),
    b: _ctx.pageLoading
  }, _ctx.pageLoading ? {} : {}, {
    c: !_ctx.hasMore
  }, !_ctx.hasMore ? {} : {}, {
    d: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/coupons/coupons.js.map
