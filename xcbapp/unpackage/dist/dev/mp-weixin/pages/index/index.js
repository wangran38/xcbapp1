"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const floatBall = () => "../../components/float-ball/float-ball.js";
const mButtonVue = () => "../../components/public/mButton/mButton.js";
const _sfc_main = {
  components: { floatBall, mButtonVue },
  mixins: [hooks_usePage.usePage],
  data() {
    return {
      prompt: true,
      tabs: [
        { id: 0, title: "附近农户", path: "/subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers" },
        { id: 1, title: "预卖菜品", path: "/subPackages/shoppingPageList/villageZone/villageZone" },
        { id: 4, title: "种养来历", path: "/pages/dynamics/dynamics" },
        { id: 6, title: "资讯信息", path: "/subPackages/shoppingPageList/realTimeInfo/realTimeInfo" },
        { id: 7, title: "免费买菜", path: "/pages/jackpot/jackpot" }
      ],
      selectedCategoryId: 0,
      categories: [],
      marketName: "",
      searchParams: { title: "", category_id: "", market_id: "" }
    };
  },
  onLoad() {
    this.initPage();
    common_vendor.index.getLocation({
      type: "gcj02",
      success: (res) => {
        common_vendor.index.setStorageSync("userlocation", JSON.stringify(res));
      }
    });
  },
  async onShow() {
    let res = common_vendor.index.getStorageSync("userSelection");
    if (this.marketName != res.marketName) {
      this.initPage();
    }
    if (!common_vendor.index.getStorageSync("prompt")) {
      this.showNotice = true;
    }
  },
  methods: {
    settingValue(value) {
      this.searchParams.title = value;
      this.reloadData();
    },
    changePrompt() {
      this.prompt = !this.prompt;
    },
    handleClose() {
      this.showNotice = false;
      common_vendor.index.setStorageSync("prompt", this.prompt);
    },
    goToshoppingPageList(item) {
      if (item.path) {
        common_vendor.index.navigateTo({ url: item.path });
      } else {
        common_vendor.index.showToast({ icon: "none", title: `未开发` });
      }
    },
    async fetchData(params) {
      const response = await api_index.api.marketShopList(params);
      return response.data;
    },
    initPage() {
      this.selectedCategoryId = 0;
      this.fetchMarketName();
      this.fetchCategories();
      this.setDefaultMarketId();
      this.reloadData();
      let res = common_vendor.index.getStorageSync("userSelection");
      this.marketName = res.marketName;
    },
    setDefaultMarketId() {
      const { market_id } = common_vendor.index.getStorageSync("userSelection");
      this.searchParams.market_id = market_id;
    },
    async fetchCategories() {
      const response = await api_index.api.cglist();
      this.categories = [{ id: 0, title: "全选" }, ...response.data.listdata || []];
    },
    async filterByCategory(id) {
      this.searchParams.category_id = id === 0 ? "" : id;
      this.selectedCategoryId = id;
      this.reloadData();
    },
    async fetchMarketName() {
      const userSelection = common_vendor.index.getStorageSync("userSelection");
      if (!userSelection)
        return;
      const { market_id, area_id } = userSelection;
      try {
        const response = await api_index.api.marketlist(parseInt(area_id));
        const marketData = response.data.listdata.find((item) => item.id === parseInt(market_id));
        if (marketData)
          this.marketName = marketData.marketname;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:364", error);
      }
    },
    navigateToShopDetails(id) {
      common_vendor.index.navigateTo({ url: `/pages/ShopDetails/ShopDetails?id=${id}` });
    },
    toindex1() {
      common_vendor.index.switchTab({ url: "/pages/index1/index1" });
    },
    scan() {
      common_vendor.index.scanCode({
        success: async (res) => {
          if (res.result) {
            let data = await api_index.api.receiving({ out_trade_no: res.result });
            common_vendor.index.showToast({ icon: data.code == 200 ? "success" : "error", title: data.code == 200 ? "核销成功" : "核销失败" });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_mButtonVue = common_vendor.resolveComponent("mButtonVue");
  const _component_floatBall = common_vendor.resolveComponent("floatBall");
  (_easycom_uni_icons2 + _component_mButtonVue + _component_floatBall)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "location-filled",
      size: "24",
      color: "#ff4d4f"
    }),
    b: common_vendor.t($data.marketName || "正在定位菜市场..."),
    c: common_vendor.p({
      type: "right",
      size: "14",
      color: "#999"
    }),
    d: common_vendor.o((...args) => $options.toindex1 && $options.toindex1(...args)),
    e: common_vendor.p({
      type: "scan",
      size: "32",
      color: "#fff"
    }),
    f: common_vendor.o((...args) => $options.scan && $options.scan(...args)),
    g: common_vendor.o($options.settingValue),
    h: common_vendor.p({
      placeholder: "输入摊位名称查询"
    }),
    i: common_vendor.f($data.tabs, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: item.id,
        c: common_vendor.n("theme-" + index % 4),
        d: common_vendor.o(($event) => $options.goToshoppingPageList(item), item.id)
      };
    }),
    j: common_vendor.f($data.categories, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: item.id,
        c: item.id === $data.selectedCategoryId ? 1 : "",
        d: common_vendor.o(($event) => $options.filterByCategory(item.id), item.id)
      };
    }),
    k: common_vendor.f(_ctx.pageData, (item, k0, i0) => {
      return {
        a: item.logo,
        b: common_vendor.t(item.category_name || "优质"),
        c: common_vendor.t(item.title),
        d: "1cf27b2a-4-" + i0,
        e: common_vendor.t(item.area_name),
        f: item.id,
        g: common_vendor.o(($event) => $options.navigateToShopDetails(item.id), item.id)
      };
    }),
    l: common_vendor.p({
      type: "map",
      size: "12",
      color: "#bbb"
    }),
    m: _ctx.pageLoading
  }, _ctx.pageLoading ? {} : {}, {
    n: !_ctx.hasMore
  }, !_ctx.hasMore ? {} : {}, {
    o: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
