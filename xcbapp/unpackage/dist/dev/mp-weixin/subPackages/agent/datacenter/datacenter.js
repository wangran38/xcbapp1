"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      agentLevel: "PROVINCIAL",
      // PROVINCIAL(省级) / MUNICIPAL(市级)
      dataList: [],
      countData: {
        farmers_total: 0,
        market_total: 0,
        money_total: 0,
        order_total: 0,
        shop_total: 0
      },
      pageNum: 1,
      pageSize: 5,
      hasMore: true,
      city: null
    };
  },
  async onLoad() {
    this.checkUserInfo();
    this.loadData();
  },
  methods: {
    // 跳转到区县详情页
    toDistrictDetail(district) {
      let data = JSON.stringify(district);
      common_vendor.index.navigateTo({
        url: `/subPackages/agent/districtDetail/districtDetail?data=${data}`
      });
    },
    async checkUserInfo() {
      let data = await api_index.api.viewAgentInfo();
      if (data.code == 200) {
        if (data.data.listdata[0].type == 1) {
          this.agentLevel = "PROVINCIAL";
        } else {
          this.agentLevel = "MUNICIPAL";
        }
      }
    },
    // 切换代理级别
    switchAgentLevel() {
      this.agentLevel = this.agentLevel === "PROVINCIAL" ? "MUNICIPAL" : "PROVINCIAL";
      this.pageNum = 1;
      this.hasMore = true;
      this.loadData();
    },
    // 加载数据
    async loadData() {
      let data = await api_index.api.getprogetsumall();
      try {
        common_vendor.index.showLoading({
          title: "加载数据...",
          mask: true
        });
        if (this.agentLevel === "PROVINCIAL") {
          let cityList = data["data"]["city_list"].map((item, index) => {
            return {
              id: `city_${index}`,
              name: item.name,
              districtCount: 0,
              marketCount: 0,
              totalConsume: 0,
              children: item.children
            };
          });
          this.countData.farmers_total = data.data.farmers_total;
          this.countData.market_total = data.data.market_total;
          this.countData.money_total = data.data.money_total;
          this.countData.order_total = data.data.order_total;
          this.countData.shop_total = data.data.shop_total;
          this.dataList = cityList;
        } else {
          this.dataList = districtList;
        }
        this.totalConsume = data.data.money_total;
        this.orderCount = data.data.order_total;
        this.totalMarketCount = data.data.market_total;
        common_vendor.index.hideLoading();
      } catch (error) {
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none"
        });
      }
    },
    // 加载更多
    loadMore() {
      this.pageNum++;
      this.loadData();
    },
    // 跳转到市详情页（省级代理）
    toCityDetail(city) {
      let children = JSON.stringify(city);
      common_vendor.index.navigateTo({
        url: `/subPackages/agent/cityDetail/cityDetail?children=${children}`
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
    a: common_vendor.t($data.agentLevel === "PROVINCIAL" ? "省级代理" : "市县区级代理"),
    b: common_vendor.n($data.agentLevel === "PROVINCIAL" ? "provincial" : "municipal"),
    c: common_vendor.t($data.countData.money_total.toFixed(2)),
    d: common_vendor.t($data.countData.order_total),
    e: common_vendor.t($data.countData.market_total),
    f: common_vendor.t($data.countData.farmers_total),
    g: common_vendor.t($data.countData.shop_total),
    h: common_vendor.t(0),
    i: common_vendor.t(0),
    j: !$data.dataList.length
  }, !$data.dataList.length ? {} : $data.agentLevel === "PROVINCIAL" ? {
    l: common_vendor.f($data.dataList, (city, k0, i0) => {
      return {
        a: common_vendor.t(city.name),
        b: common_vendor.f(city.children, (item, index, i1) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.market_count),
            c: common_vendor.t(item.farmers_count),
            d: common_vendor.t(item.shop_count),
            e: "7170c164-0-" + i0 + "-" + i1,
            f: index,
            g: common_vendor.o(($event) => $options.toDistrictDetail(item), index)
          };
        }),
        c: city.id
      };
    }),
    m: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    })
  } : {}, {
    k: $data.agentLevel === "PROVINCIAL"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7170c164"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/datacenter/datacenter.js.map
