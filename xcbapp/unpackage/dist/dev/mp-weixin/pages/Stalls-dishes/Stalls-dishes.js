"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const _sfc_main = {
  data() {
    return {
      pageData: [],
      // token: '',
      shopId: 0
    };
  },
  onLoad(options) {
    this.token = common_vendor.index.getStorageSync("token");
    this.shopId = options.id;
    this.reloadData();
  },
  mixins: [hooks_usePage.usePage],
  methods: {
    async fetchData(params) {
      const response = await api_index.api.myShoplist({ ...params, shop_id: Number(this.shopId), isshow: 1 });
      return response.data;
    },
    async off(itemId) {
      try {
        const response = await api_index.api.xiajiashop({
          id: itemId,
          isshow: 2
          // 2 表示下架
        });
        if (response.code === 200) {
          common_vendor.index.showToast({
            title: "下架成功",
            icon: "success"
          });
          const itemIndex = this.pageData.findIndex((item) => item.id === itemId);
          if (itemIndex !== -1) {
            this.pageData[itemIndex].isshow = 0;
          }
          this.reloadData();
        } else {
          common_vendor.index.showToast({
            title: response.msg || "操作失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "请求失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/Stalls-dishes/Stalls-dishes.vue:91", "下架失败", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: item.imglogo,
        b: common_vendor.t(item.commodity_name),
        c: common_vendor.t(item.price.toFixed(2)),
        d: common_vendor.t(item.isshow === 1 ? "下架" : "已下架"),
        e: item.isshow === 0 ? 1 : "",
        f: common_vendor.o(($event) => item.isshow === 1 && $options.off(item.id), item.id),
        g: item.id
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
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Stalls-dishes/Stalls-dishes.js.map
