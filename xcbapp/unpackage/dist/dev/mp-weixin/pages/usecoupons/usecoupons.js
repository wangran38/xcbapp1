"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const _sfc_main = {
  data() {
    return {
      pageData: [],
      selectedCoupon: null
      // 当前选中的优惠券的索引
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
    toggleSelection(item) {
      if (this.selectedCoupon === item.id) {
        this.selectedCoupon = null;
        common_vendor.index.removeStorageSync("coupon");
      } else {
        this.selectedCoupon = item.id;
        common_vendor.index.setStorageSync("coupon", [item]);
      }
    },
    gotobuy() {
      if (this.selectedCoupon !== null) {
        common_vendor.index.redirectTo({
          url: `/pages/Buy/Buy?id=${this.selectedCoupon}`
        });
      } else {
        common_vendor.index.showToast({
          title: "请选择优惠券",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.price),
        b: common_vendor.t(item.coupon_name),
        c: $data.selectedCoupon === item.id,
        d: common_vendor.o(($event) => $options.toggleSelection(item), item.id),
        e: common_vendor.n(item.isUse ? "use" : ""),
        f: item.id,
        g: common_vendor.o(($event) => $options.toggleSelection(item), item.id)
      };
    }),
    b: _ctx.pageLoading
  }, _ctx.pageLoading ? {} : {}, {
    c: !_ctx.hasMore
  }, !_ctx.hasMore ? {} : {}, {
    d: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    e: common_vendor.o((...args) => $options.gotobuy && $options.gotobuy(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/usecoupons/usecoupons.js.map
