"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      // 搜索关键字
      searchText: "",
      // 分类数据
      categories: [
        { label: "所有分类", value: "" },
        { label: "菜类", value: "" },
        { label: "肉类", value: "" }
      ],
      selectedCategoryIndex: 0,
      // 距离筛选
      distances: [
        { label: "离我最近", value: "" },
        { label: "离我最远", value: "" }
      ],
      selectedDistanceIndex: 0,
      // 商品列表
      goodsList: [],
      page: 1,
      loading: false,
      noMore: false,
      queryData: {
        page: 1,
        limit: 10
      }
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    // 加载数据
    async loadData() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const res = await api_index.api.wholesaleList(this.queryData);
        this.goodsList = res.data.listdata;
        if (res.data.listdata.length === 0) {
          this.noMore = true;
          return;
        }
        this.page++;
      } catch (error) {
        common_vendor.index.__f__("log", "at subPackages/Wholesale/supply/supply.vue:146", error);
      } finally {
        this.loading = false;
      }
    },
    // 处理搜索
    handleSearch() {
      this.resetList();
      this.loadData();
    },
    // 重置筛选
    handleReset() {
      this.searchText = "";
      this.selectedCategoryIndex = 0;
      this.selectedDistanceIndex = 0;
      this.resetList();
      this.loadData();
    },
    // 加载更多
    loadMore() {
      if (!this.noMore)
        this.loadData();
    },
    // 重置列表
    resetList() {
      this.goodsList = [];
      this.page = 1;
      this.noMore = false;
    },
    // 联系商家
    contactNow() {
      common_vendor.index.showToast({
        title: "已发送联系请求",
        icon: "none"
      });
    },
    // 跳转详情
    goDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/goods/detail?id=${id}`
      });
    },
    // 分类改变
    categoryChange(e) {
      this.selectedCategoryIndex = e.detail.value;
      this.resetList();
      this.loadData();
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
    a: $data.searchText,
    b: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    d: common_vendor.o((...args) => $options.handleReset && $options.handleReset(...args)),
    e: common_vendor.t($data.categories[$data.selectedCategoryIndex].label),
    f: common_vendor.o((...args) => $options.categoryChange && $options.categoryChange(...args)),
    g: $data.categories,
    h: common_vendor.t($data.distances[$data.selectedDistanceIndex].label),
    i: $data.distances,
    j: common_vendor.f($data.goodsList, (item, index, i0) => {
      return common_vendor.e({
        a: item.selllogo,
        b: item.tag
      }, item.tag ? {
        c: common_vendor.t(item.tag)
      } : {}, {
        d: common_vendor.t(item.selltitle),
        e: common_vendor.t(item.marketprice),
        f: item.price
      }, item.price ? {
        g: common_vendor.t(item.price)
      } : {}, {
        h: "56fe014c-0-" + i0,
        i: common_vendor.t(item.stoptime),
        j: "56fe014c-1-" + i0,
        k: common_vendor.o((...args) => $options.contactNow && $options.contactNow(...args), index),
        l: "56fe014c-2-" + i0,
        m: common_vendor.t(item.selladdress),
        n: index,
        o: common_vendor.o(($event) => $options.goDetail(item.id), index)
      });
    }),
    k: common_vendor.p({
      type: "shop",
      size: "12",
      color: "#666"
    }),
    l: common_vendor.p({
      type: "arrow-right",
      size: "14",
      color: "#fff"
    }),
    m: common_vendor.p({
      type: "location",
      size: "12",
      color: "#666"
    }),
    n: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : {}, {
    o: $data.noMore,
    p: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/supply/supply.js.map
