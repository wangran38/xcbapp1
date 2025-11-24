"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const floatBall = () => "../../components/float-ball/float-ball.js";
const _sfc_main = {
  components: {
    floatBall
  },
  data() {
    return {
      prompt: true,
      showNotice: false,
      menuItems: [],
      tabs: [
        {
          id: 0,
          title: "附近农户",
          path: "/subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers"
        },
        {
          id: 1,
          title: "预卖菜品",
          // 扶贫预卖
          path: "/subPackages/shoppingPageList/villageZone/villageZone"
        },
        // {
        // 	id: 2,
        // 	title: '官方直营',
        // 	path: '/subPackages/shoppingPageList/official/official'
        // },
        // {
        // 	id: 3,
        // 	title: '扶贫专区',
        // 	path: '/subPackages/shoppingPageList/agriculturalAssistanceZone/agriculturalAssistanceZone'
        // },
        {
          id: 4,
          title: "种养来历",
          path: "/pages/dynamics/dynamics"
        },
        // {
        // 	id: 5,
        // 	title: '铺面出租',
        // 	path: '/subPackages/shoppingPageList/rentalStorefrontList/rentalStorefrontList'
        // },
        {
          id: 6,
          title: "资讯信息",
          path: "/subPackages/shoppingPageList/realTimeInfo/realTimeInfo"
        },
        {
          id: 7,
          title: "免费买菜",
          path: "/pages/jackpot/jackpot"
        }
      ],
      selectedCategoryId: "",
      categories: [],
      pageData: [],
      // 
      currentMarketName: "",
      // 当前菜市场名称
      searchParams: {
        title: "",
        category_id: "",
        market_id: ""
      },
      isloaded: false,
      marketName: "",
      // 市场名
      initReques: false
    };
  },
  onLoad() {
    this.initPage();
    common_vendor.index.getLocation({
      altitude: true,
      isHighAccuracy: true,
      highAccuracy: true,
      type: "gcj02",
      success: (res) => {
        common_vendor.index.setStorageSync("userlocation", JSON.stringify(res));
        common_vendor.index.__f__("log", "at pages/index/index.vue:175", res);
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
  mixins: [hooks_usePage.usePage],
  methods: {
    changePrompt(e) {
      this.prompt = !this.prompt;
    },
    handleClose() {
      this.showNotice = false;
      common_vendor.index.setStorageSync("prompt", this.prompt);
    },
    goToshoppingPageList(item) {
      if (item.path) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:201", item.path);
        common_vendor.index.navigateTo({
          url: item.path
        });
      } else {
        common_vendor.index.showToast({
          icon: "error",
          title: `"${item.title}" 暂未开发`
        });
      }
    },
    async fetchData(params) {
      const response = await api_index.api.marketShopList(params);
      return response.data;
    },
    initPage() {
      this.isloaded = true;
      this.selectedCategoryId = 0;
      this.fetchMarketName();
      this.fetchCategories();
      this.setDefaultMarketId();
      this.reloadData();
      let res = common_vendor.index.getStorageSync("userSelection");
      this.marketName = res.marketName;
    },
    setDefaultMarketId() {
      const {
        market_id
      } = common_vendor.index.getStorageSync("userSelection");
      this.searchParams.market_id = market_id;
    },
    async fetchCategories() {
      const response = await api_index.api.cglist();
      this.categories = [{
        id: 0,
        // 特殊值表示全选
        title: "全选"
      }, ...response.data.listdata || []];
    },
    async filterByCategory(categoryId) {
      this.searchParams.category_id = categoryId;
      this.selectedCategoryId = categoryId;
      this.reloadData();
    },
    async fetchMarketName() {
      try {
        const userSelection = common_vendor.index.getStorageSync("userSelection");
        if (!userSelection) {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:258", "未找到 userSelection");
          return;
        }
        const {
          market_id,
          area_id
        } = userSelection;
        if (!market_id || !area_id) {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:269", "未找到市场 ID 或区域 ID");
          return;
        }
        const response = await api_index.api.marketlist(parseInt(area_id));
        const marketData = response.data.listdata.find((item) => item.id === parseInt(market_id));
        if (marketData) {
          this.currentMarketName = marketData.marketname || "未知市场";
        } else {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:280", "未找到对应的市场");
          this.currentMarketName = "未知市场";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:284", "获取市场名称失败:", error);
      }
    },
    navigateToShopDetails(id) {
      common_vendor.index.navigateTo({
        url: `/pages/ShopDetails/ShopDetails?id=${id}`
      });
    },
    toindex1() {
      common_vendor.index.switchTab({
        url: "/pages/index1/index1"
      });
    },
    scan() {
      common_vendor.index.scanCode({
        onlyFromCamera: false,
        success: async (res) => {
          if (res.result) {
            let data = await api_index.api.receiving({
              out_trade_no: res.result
            });
            if (data.code == 200) {
              common_vendor.index.showToast({
                icon: "success",
                title: "核销成功"
              });
            } else {
              common_vendor.index.showToast({
                icon: "error",
                title: "核销失败"
              });
            }
          } else {
            common_vendor.index.__f__("log", "at pages/index/index.vue:319", res.path);
            common_vendor.index.navigateTo({
              url: "/" + res.path
            });
          }
        },
        fail: function(error) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:327", "扫码失败:", error);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _component_floatBall = common_vendor.resolveComponent("floatBall");
  (_easycom_uni_icons2 + _easycom_uni_load_more2 + _component_floatBall)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showNotice
  }, $data.showNotice ? {
    b: common_vendor.o((...args) => $options.handleClose && $options.handleClose(...args)),
    c: $data.prompt,
    d: common_vendor.o((...args) => $options.changePrompt && $options.changePrompt(...args)),
    e: common_vendor.o((...args) => $options.handleClose && $options.handleClose(...args))
  } : {}, {
    f: common_vendor.p({
      type: "location-filled",
      size: "22",
      color: "#4a90e2"
    }),
    g: common_vendor.t($data.marketName || "暂未选中市场"),
    h: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    i: common_vendor.o((...args) => $options.toindex1 && $options.toindex1(...args)),
    j: common_vendor.o($options.scan),
    k: common_vendor.p({
      type: "scan",
      size: "32"
    }),
    l: common_vendor.p({
      type: "search",
      size: "18",
      color: "#b2b2b2"
    }),
    m: $data.searchParams.title,
    n: common_vendor.o(($event) => $data.searchParams.title = $event.detail.value),
    o: common_vendor.o((...args) => _ctx.reloadData && _ctx.reloadData(...args)),
    p: common_vendor.f($data.tabs, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.title),
        b: $data.selectedCategoryId === item.id
      }, $data.selectedCategoryId === item.id ? {} : {}, {
        c: item.id,
        d: common_vendor.o(($event) => $options.goToshoppingPageList(item), item.id)
      });
    }),
    q: common_vendor.f($data.categories, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: item.id,
        c: item.id === $data.selectedCategoryId ? 1 : "",
        d: common_vendor.o(($event) => $options.filterByCategory(item.id), item.id)
      };
    }),
    r: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: item.logo || "/static/default-logo.png",
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.area_name),
        d: common_vendor.t(item.category_name || "未知类目"),
        e: item.id,
        f: common_vendor.o(($event) => $options.navigateToShopDetails(item.id), item.id)
      };
    }),
    s: _ctx.pageLoading
  }, _ctx.pageLoading ? {
    t: common_vendor.p({
      status: "loading"
    })
  } : {}, {
    v: !_ctx.hasMore
  }, !_ctx.hasMore ? {} : {}, {
    w: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
