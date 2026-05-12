"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      districtId: "",
      districtName: "",
      cityName: "",
      marketList: [],
      totalMarketCount: 0,
      totalConsume: 0,
      totalOrderCount: 0,
      pageNum: 1,
      pageSize: 5,
      hasMore: true,
      // 筛选
      startDate: "2024-01-01",
      endDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      selectedDate: "全部时间",
      query: {
        area_id: null,
        limit: 100
      },
      data: null
    };
  },
  onLoad(options) {
    let data = JSON.parse(options.data);
    this.data = data;
    this.query.area_id = Number(this.data.id);
    this.loadMarketData();
  },
  methods: {
    goNavigateTo(url) {
      let data = JSON.stringify(this.data);
      try {
        common_vendor.index.navigateTo({
          url: url + `?data=${data}`
        });
      } catch {
        common_vendor.index.__f__("log", "at subPackages/agent/districtDetail/districtDetail.vue:136", "跳转异常");
      }
    },
    // 加载菜市场数据
    async loadMarketData() {
      try {
        common_vendor.index.showLoading({
          title: "加载中...",
          mask: true
        });
        let data = await api_index.api.marketlist(this.query.area_id, this.query.limit);
        if (data.code == 200) {
          this.marketList = [...data.data.listdata];
        }
        common_vendor.index.hideLoading();
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/districtDetail/districtDetail.vue:160", "加载菜市场数据失败：", error);
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none"
        });
      }
    },
    // 加载更多
    loadMore() {
      this.pageNum++;
      this.loadMarketData();
    },
    // 跳转到菜市场详情页
    toMarketDetail(market) {
      common_vendor.index.navigateTo({
        url: `/subPackages/agent/marketDetail/marketDetail?marketId=${market.id}`
      });
    },
    toFarmerList() {
      common_vendor.index.showToast({
        icon: "error",
        title: "功能正在开发中"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.data.total_money.toFixed(2)),
    b: common_vendor.t($data.data.order_count),
    c: common_vendor.t($data.data.market_count),
    d: common_vendor.t($data.data.farmers_count),
    e: common_vendor.t($data.data.shop_count),
    f: common_vendor.t(0),
    g: common_vendor.o(($event) => $options.goNavigateTo("/subPackages/agent/farmerList/farmerList")),
    h: common_vendor.o(($event) => $options.goNavigateTo("/subPackages/agent/supplyInfo/supplyInfo")),
    i: !$data.marketList.length
  }, !$data.marketList.length ? {} : {
    j: common_vendor.f($data.marketList, (market, index, i0) => {
      return {
        a: common_vendor.t(market.marketname),
        b: "f7f3bbbe-0-" + i0,
        c: market.id,
        d: common_vendor.o(($event) => $options.toMarketDetail(market), market.id)
      };
    }),
    k: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    l: common_vendor.t(0),
    m: common_vendor.t(0)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f7f3bbbe"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/districtDetail/districtDetail.js.map
