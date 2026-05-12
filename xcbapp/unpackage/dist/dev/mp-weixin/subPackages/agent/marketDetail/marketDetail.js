"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      detailList: [],
      totalOrderCount: 0,
      hasMore: true,
      query: {
        page: 1,
        limit: 10,
        marketid: null
      }
    };
  },
  onLoad(options) {
    this.query.marketid = Number(options.marketId);
    this.loadDetailData();
  },
  methods: {
    // 加载消费明细
    async loadDetailData() {
      try {
        let data = await api_index.api.getMoneyalllist(this.query);
        common_vendor.index.__f__("log", "at subPackages/agent/marketDetail/marketDetail.vue:91", "订单数据:", data.data.listdasta);
        common_vendor.index.showLoading({
          title: "加载明细...",
          mask: true
        });
        this.detailList = [...this.detailList, ...data.data.listdata];
        this.totalOrderCount = data.data.totalnum;
        this.hasMore = data.data.listdata.length < this.query.limit ? false : true;
        common_vendor.index.hideLoading();
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/marketDetail/marketDetail.vue:103", "加载明细数据失败：", error);
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none"
        });
      }
    },
    // 加载更多
    loadMore() {
      this.pageNum++;
      this.loadDetailData();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(0),
    b: common_vendor.t($data.totalOrderCount),
    c: common_vendor.t(0),
    d: !$data.detailList.length && !$data.hasMore
  }, !$data.detailList.length && !$data.hasMore ? {} : {}, {
    e: $data.detailList.length
  }, $data.detailList.length ? {
    f: common_vendor.f($data.detailList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.out_trade_no),
        b: common_vendor.t(item.level2money.toFixed(1)),
        c: common_vendor.t(item.level4money.toFixed(1)),
        d: item.id
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-79a9e5c4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/marketDetail/marketDetail.js.map
