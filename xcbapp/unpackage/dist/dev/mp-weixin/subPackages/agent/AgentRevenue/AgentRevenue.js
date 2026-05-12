"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_public = require("../../../utils/public.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      totalMoney: 0,
      // 发展佣金
      profitRecords: [],
      query: {
        page: 1,
        limit: 10
      },
      loading: false,
      loadStatus: "more",
      // 'more', 'loading', 'noMore'
      hasMore: true
    };
  },
  onLoad() {
    this.fetchProfitData();
  },
  methods: {
    /**
     * 格式化时间
     * @param {String} timeStr - 原始时间字符串
     * @returns {String} 格式化后的时间
     */
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
    /**
     * 获取收益数据
     */
    async fetchProfitData() {
      this.loading = true;
      this.loadStatus = "loading";
      try {
        const response = await api_index.api.cityAgentRevenue(this.query);
        if (response.code === 200) {
          const data = response.data;
          this.totalMoney = data.totalMoney || 0;
          if (this.query.page === 1) {
            this.profitRecords = data.listdata || [];
          } else {
            this.profitRecords = [...this.profitRecords, ...data.listdata];
          }
          this.hasMore = this.query.page * this.query.limit < data.total_count;
          this.loadStatus = this.hasMore ? "more" : "noMore";
        } else {
          common_vendor.index.showToast({
            title: response.message || "获取收益数据失败",
            icon: "none"
          });
          this.loadStatus = "more";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/AgentRevenue/AgentRevenue.vue:118", "获取代理商收益数据失败:", error);
        common_vendor.index.showToast({
          title: "网络请求异常",
          icon: "none"
        });
        this.loadStatus = "more";
      } finally {
        this.loading = false;
      }
    },
    /**
     * 下拉加载更多
     */
    loadMore() {
      if (!this.hasMore || this.loading)
        return;
      this.query.page++;
      this.fetchProfitData();
    }
  }
};
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.totalMoney.toFixed(2)),
    b: common_vendor.f($data.profitRecords, (item, index, i0) => {
      return {
        a: common_vendor.t(item.out_trade_no),
        b: common_vendor.t($options.formatTime(item.createtime)),
        c: common_vendor.t(item.status === "pending" ? "+¥" : "¥"),
        d: common_vendor.t(item.level4money.toFixed(2)),
        e: item.status === "pending" ? 1 : "",
        f: item.status === "settled" ? 1 : "",
        g: index
      };
    }),
    c: $data.profitRecords.length === 0 && !$data.loading
  }, $data.profitRecords.length === 0 && !$data.loading ? {} : {}, {
    d: $data.loading
  }, $data.loading ? {
    e: common_vendor.p({
      status: $data.loadStatus
    })
  } : {}, {
    f: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4acdbbc1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/AgentRevenue/AgentRevenue.js.map
