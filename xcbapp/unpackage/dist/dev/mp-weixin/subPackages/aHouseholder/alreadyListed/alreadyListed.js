"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      activeCategory: 1,
      categories: [
        {
          label: "自销",
          value: 1
        },
        {
          label: "代提",
          value: 2
        },
        {
          label: "批发",
          value: 3
        }
      ],
      dishes: [],
      scrollHeight: 600,
      scrollLeft: 0,
      loading: true,
      queryData: {
        ispresale: 2,
        page: 1,
        limit: 10,
        sellstatus: 1
        // 默认加载自销数据
      },
      isNoMore: false
      // 是否允许加载数据
    };
  },
  mounted() {
    this.loadData();
    this.calcScrollHeight();
  },
  watch: {
    activeCategory(newValue, oldValue) {
      this.isNoMore = false;
      this.dishes = [];
      this.queryData.sellstatus = newValue;
      this.queryData.page = 1;
      this.loadData();
    }
  },
  methods: {
    initQueryData(sellstatus = 1) {
      this.queryData = {
        page: 1,
        limit: 10,
        sellstatus
      }, this.isNoMore = false;
      this.dishes = [];
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/alreadyListed/alreadyListed.vue:96", this.queryData);
    },
    changePage() {
      this.queryData.page++;
      this.loadData();
    },
    async loadData() {
      try {
        if (!this.isNoMore) {
          const res = await api_index.api.presaleList(this.queryData);
          if (res.code == 200) {
            this.dishes = [...this.dishes, ...res.data.listdata];
            this.isNoMore = res.data.listdata.length <= this.queryData.limit ? true : false;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/aHouseholder/alreadyListed/alreadyListed.vue:112", error);
      } finally {
        this.loading = false;
      }
    },
    calcScrollHeight() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".category-tabs").boundingClientRect();
      query.exec((res) => {
        var _a;
        const tabHeight = ((_a = res[0]) == null ? void 0 : _a.height) || 60;
        this.scrollHeight = systemInfo.windowHeight - tabHeight - 10;
      });
    },
    switchCategory(value, index) {
      this.activeCategory = value;
      this.$nextTick(() => {
        const query = common_vendor.index.createSelectorQuery().in(this);
        query.select(`.tab-item:nth-child(${index + 1})`).boundingClientRect();
        query.exec((res) => {
          if (res[0]) {
            this.scrollLeft = res[0].left - 50;
          }
        });
      });
    },
    // 下架菜品
    async handleOffShelf(id) {
      try {
        let res = await api_index.api.XiaShiCity({
          id,
          isshow: 1,
          ispresale: 1
        });
        common_vendor.index.__f__("log", "at subPackages/aHouseholder/alreadyListed/alreadyListed.vue:151", res);
        if (res.code == 200) {
          common_vendor.index.showToast({
            title: "下架成功",
            icon: "success"
          });
          this.initQueryData(this.activeCategory);
          this.loadData();
        } else {
          common_vendor.index.showToast({
            title: "下架失败",
            icon: "error"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    },
    handleImageError(dish) {
      dish.image = "/static/default-dish.png";
    },
    onRefresh() {
      this.loadData();
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.categories, (category, index, i0) => {
      return {
        a: common_vendor.t(category.label),
        b: index,
        c: common_vendor.n($data.activeCategory === category.value ? "active" : ""),
        d: common_vendor.o(($event) => $options.switchCategory(category.value, index), index)
      };
    }),
    b: $data.scrollLeft,
    c: common_vendor.f($data.dishes, (dish, index, i0) => {
      return {
        a: dish.imglogo,
        b: common_vendor.t(dish.goodsname),
        c: common_vendor.t(dish.price),
        d: common_vendor.t(dish.goodstotal),
        e: common_vendor.t(dish.unit),
        f: common_vendor.o(($event) => $options.handleOffShelf(dish.id), dish.id),
        g: dish.id
      };
    }),
    d: !$data.loading && $data.dishes.length === 0
  }, !$data.loading && $data.dishes.length === 0 ? {
    e: common_assets._imports_0
  } : {}, {
    f: $data.scrollHeight + "px",
    g: common_vendor.o((...args) => $options.changePage && $options.changePage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8bd8dfff"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/alreadyListed/alreadyListed.js.map
