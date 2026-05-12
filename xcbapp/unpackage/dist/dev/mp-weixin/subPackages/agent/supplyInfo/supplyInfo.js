"use strict";
const api_index = require("../../../api/index.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      districtId: "",
      districtName: "",
      cityName: "",
      // Tab 切换控制
      activeTab: "supply",
      // 供应数据
      supplyList: [],
      totalSupplyCount: 0,
      hasMoreSupply: true,
      // 求购数据
      demandList: [],
      totalDemandCount: 10,
      pageNumDemand: 1,
      pageSizeDemand: 5,
      hasMoreDemand: true,
      query: {
        page: 1,
        limit: 10,
        area_id: null
      }
    };
  },
  onLoad(options) {
    this.query.area_id = Number(JSON.parse(options.data).id);
    this.loadSupplyData();
    this.loadDemandData();
  },
  methods: {
    // 切换 Tab
    switchTab(tabType) {
      this.activeTab = tabType;
      this.query.page = 1;
    },
    async loadSupplyData() {
      let data = await api_index.api.wholesaleList(this.query);
      this.supplyList = [...this.supplyList, ...data.data.listdata];
      this.totalSupplyCount = data.data.totalnum;
      this.hasMoreSupply = data.data.listdata.length < this.query.limit ? true : false;
    },
    async loadDemandData() {
      let data = await api_index.api.buyinfoList(this.query);
      this.totalDemandCount = data.data.totalnum;
      this.demandList = [...this.demandList, ...data.data.listdata];
    },
    // 加载更多
    loadMore(type) {
      if (type === "supply") {
        this.pageNumSupply++;
        this.loadSupplyData();
      } else {
        this.pageNumDemand++;
        this.loadDemandData();
      }
    },
    // 跳转详情
    toDetail(type, data) {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n($data.activeTab === "supply" ? "supply-icon" : "demand-icon"),
    b: common_vendor.t($data.activeTab === "supply" ? "当前区域供应总数" : "当前区域求购总数"),
    c: common_vendor.t($data.activeTab === "supply" ? $data.supplyList.length : $data.totalDemandCount),
    d: $data.activeTab === "supply"
  }, $data.activeTab === "supply" ? {
    e: common_vendor.t($data.supplyList.length)
  } : {}, {
    f: $data.activeTab === "demand"
  }, $data.activeTab === "demand" ? {
    g: common_vendor.t($data.demandList.length)
  } : {}, {
    h: $data.activeTab === "supply" ? 1 : "",
    i: common_vendor.o(($event) => $options.switchTab("supply")),
    j: $data.activeTab === "demand" ? 1 : "",
    k: common_vendor.o(($event) => $options.switchTab("demand")),
    l: $data.activeTab === "supply"
  }, $data.activeTab === "supply" ? common_vendor.e({
    m: !$data.supplyList.length
  }, !$data.supplyList.length ? {
    n: common_vendor.o((...args) => $options.loadSupplyData && $options.loadSupplyData(...args))
  } : {
    o: common_vendor.f($data.supplyList, (supply, index, i0) => {
      return {
        a: supply.selllogo,
        b: common_vendor.t(supply.selltitle),
        c: common_vendor.t(supply.price),
        d: common_vendor.t(supply.price),
        e: common_vendor.t(supply.unit),
        f: common_vendor.t(supply.sellnumber),
        g: common_vendor.t(supply.unit),
        h: supply.sellnumber < 50 ? 1 : "",
        i: supply.id,
        j: common_vendor.o(($event) => $options.toDetail("supply", supply), supply.id)
      };
    })
  }) : {}, {
    p: $data.activeTab === "demand"
  }, $data.activeTab === "demand" ? common_vendor.e({
    q: !$data.demandList.length
  }, !$data.demandList.length ? {
    r: common_vendor.o((...args) => $options.loadDemandData && $options.loadDemandData(...args))
  } : {
    s: common_vendor.f($data.demandList, (demand, index, i0) => {
      return {
        a: common_vendor.t(demand.infotitle),
        b: common_vendor.t(demand.infotitle),
        c: common_vendor.t(demand.buyaddress),
        d: common_vendor.t(demand.infonumber),
        e: common_vendor.t(demand.unit),
        f: demand.id,
        g: common_vendor.o(($event) => $options.toDetail("demand", demand), demand.id)
      };
    })
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cc371561"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/supplyInfo/supplyInfo.js.map
