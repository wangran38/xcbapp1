"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const mButtonVue = () => "../../../components/public/mButton/mButton.js";
const _sfc_main = {
  mixins: [utils_public.myMixin],
  components: {
    mButtonVue
  },
  data() {
    return {
      distances: [
        {
          label: "离我最近",
          value: ""
        },
        {
          label: "离我最远",
          value: ""
        }
      ],
      pricesort: [
        {
          label: "价格最高",
          value: ""
        },
        {
          label: "价格最少",
          value: ""
        }
      ],
      selectedCategoryIndex: 0,
      selectedCategoryId: 0,
      activeCategory: 0,
      categories: [],
      goodsData: [],
      cartCount: 0,
      queryData: {
        category_id: null,
        goodsname: null,
        page: 1,
        limit: 5
      },
      isLoading: false,
      isRefreshing: false,
      noMore: false,
      isRefresh: null
    };
  },
  onLoad() {
    this.getGoodsData();
    this.fetchCategories();
  },
  methods: {
    intiQuery() {
      this.queryData = {
        category_id: null,
        goodsname: null,
        page: 1,
        limit: 5
      };
    },
    // 开始搜索
    startSearch(value) {
      this.queryData.goodsname = value;
      this.queryData.category_id = null;
      this.noMore = false;
      this.goodsData = [];
      this.getGoodsData();
    },
    // 结束搜索
    stopSearch() {
      this.noMore = false;
      this.goodsData = [];
      this.intiQuery();
      this.getGoodsData();
    },
    goToDynamics(item) {
      common_vendor.index.__f__("log", "at subPackages/shoppingPageList/villageZone/villageZone.vue:204", item);
      common_vendor.index.navigateTo({
        url: `/pages/dynamics/dynamics?id=${item.id}`
      });
    },
    switchClass(index) {
      common_vendor.index.__f__("log", "at subPackages/shoppingPageList/villageZone/villageZone.vue:210", index);
      this.selectedCategoryId = index;
      this.goodsData = [];
      this.noMore = false;
      this.intiQuery();
      this.queryData.category_id = this.categories[index].id;
      this.getGoodsData();
    },
    async fetchCategories() {
      const response = await api_index.api.cglist();
      common_vendor.index.__f__("log", "at subPackages/shoppingPageList/villageZone/villageZone.vue:220", response);
      this.categories = [{ title: "全部" }, ...response.data.listdata];
    },
    async getGoodsData(isRefresh = false) {
      if (this.isLoading || !isRefresh && this.noMore)
        return;
      this.isLoading = true;
      try {
        const {
          code,
          data
        } = await api_index.api.presaleList(this.queryData);
        if (code === 200) {
          const list = data.listdata.map((item) => ({
            ...item,
            goodsname: item.goodsname || "新品预售",
            imglogo: item.imglogo || "/static/default-goods.png",
            presaleprice: item.presaleprice || 10,
            price: item.price || 0,
            sold: item.sold || 1,
            // 进度
            // stock: item.stock || 100, // 库存
            unit: item.unit || "件",
            organic: !!item.organic
          }));
          this.goodsData = [...this.goodsData, ...list];
          this.noMore = list.length < this.queryData.limit;
        }
      } finally {
        this.isLoading = false;
        this.isRefreshing = false;
      }
    },
    particleStyle(i) {
      return 1;
    },
    calcDiscount(item) {
      return (item.price / item.presaleprice * 10).toFixed(1);
    },
    addToCart(item) {
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit?query=${JSON.stringify(item)}`
      });
    },
    loadMore() {
      if (!this.noMore) {
        this.queryData.page++;
        this.getGoodsData();
      }
    },
    gotoCart() {
      common_vendor.index.navigateTo({
        url: "/pages/cart/index"
      });
    }
  }
};
if (!Array) {
  const _component_mButtonVue = common_vendor.resolveComponent("mButtonVue");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_component_mButtonVue + _easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.startSearch),
    b: common_vendor.o($options.stopSearch),
    c: common_vendor.p({
      isShowbutton2: true,
      placeholder: "搜索菜品"
    }),
    d: common_vendor.p({
      type: "tags",
      size: "16",
      color: "#3a7afe"
    }),
    e: common_vendor.t($data.pricesort[$data.selectedCategoryIndex].label),
    f: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#3a7afe"
    }),
    g: common_vendor.o((...args) => _ctx.categoryChange && _ctx.categoryChange(...args)),
    h: $data.pricesort,
    i: common_vendor.p({
      type: "tags",
      size: "16",
      color: "#3a7afe"
    }),
    j: common_vendor.t($data.distances[$data.selectedCategoryIndex].label),
    k: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#3a7afe"
    }),
    l: $data.distances,
    m: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.n({
          "selected": item.id === $data.selectedCategoryId
        }),
        c: common_vendor.o(($event) => $options.switchClass(index), item.id),
        d: item.id,
        e: common_vendor.n($data.selectedCategoryId === index ? "active" : "")
      };
    }),
    n: common_vendor.f($data.goodsData, (item, index, i0) => {
      return common_vendor.e({
        a: item.imglogo,
        b: item.tag
      }, item.tag ? {
        c: common_vendor.t(item.tag)
      } : {}, {
        d: item.goodstotal > 0 ? Math.min(item.selltotal / item.goodstotal * 100, 100) : 0,
        e: common_vendor.t(item.selltotal),
        f: common_vendor.t(item.goodstotal),
        g: common_vendor.t(item.unit),
        h: common_vendor.o(($event) => $options.goToDynamics(item), index),
        i: common_vendor.t(item.goodsname),
        j: item.organic
      }, item.organic ? {
        k: "8ec1e1a2-5-" + i0,
        l: common_vendor.p({
          type: "star-filled",
          color: "#ffd700",
          size: "18"
        })
      } : {}, {
        m: common_vendor.t(item.price),
        n: common_vendor.t(item.presaleprice),
        o: common_vendor.t($options.calcDiscount(item)),
        p: common_vendor.t(_ctx.initDate(item.sellbegintime)),
        q: common_vendor.o(($event) => $options.addToCart(item), index),
        r: index,
        s: index % 10 * 0.1 + "s"
      });
    }),
    o: common_vendor.p({
      status: $data.isLoading ? "loading" : $data.noMore ? "noMore" : "more",
      contentText: {
        contentdown: "上拉显示更多",
        contentrefresh: "正在加载",
        contentnomore: "没有更多了"
      }
    }),
    p: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8ec1e1a2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/villageZone/villageZone.js.map
