"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const mButtonVue = () => "../../../components/public/mButton/mButton.js";
const _sfc_main = {
  components: {
    mButtonVue
  },
  data() {
    return {
      // 搜索关键字
      searchText: "",
      // 分类数据
      categories: [
        {
          label: "所有分类",
          value: ""
        },
        {
          label: "菜类",
          value: ""
        },
        {
          label: "肉类",
          value: ""
        }
      ],
      selectedCategoryIndex: 0,
      // 距离筛选
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
        common_vendor.index.__f__("log", "at subPackages/Wholesale/supply/supply.vue:150", res);
        this.page++;
      } catch (error) {
        common_vendor.index.__f__("log", "at subPackages/Wholesale/supply/supply.vue:153", error);
      } finally {
        this.loading = false;
      }
    },
    // 处理搜索
    handleSearch(value) {
      this.resetList();
      this.queryData.selltitle = value;
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
      this.queryData.selltitle = null;
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
  const _component_mButtonVue = common_vendor.resolveComponent("mButtonVue");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_mButtonVue + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.handleSearch),
    b: common_vendor.o($options.handleReset),
    c: common_vendor.p({
      isShowbutton2: true,
      placeholder: "输入关键词搜索"
    }),
    d: common_vendor.t($data.categories[$data.selectedCategoryIndex].label),
    e: common_vendor.o((...args) => $options.categoryChange && $options.categoryChange(...args)),
    f: $data.categories,
    g: common_vendor.t($data.distances[$data.selectedDistanceIndex].label),
    h: $data.distances,
    i: common_vendor.f($data.goodsList, (item, index, i0) => {
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
        h: "56fe014c-1-" + i0,
        i: common_vendor.t(item.stoptime),
        j: "56fe014c-2-" + i0,
        k: common_vendor.o((...args) => $options.contactNow && $options.contactNow(...args), index),
        l: "56fe014c-3-" + i0,
        m: common_vendor.t(item.selladdress),
        n: index,
        o: common_vendor.o(($event) => $options.goDetail(item.id), index)
      });
    }),
    j: common_vendor.p({
      type: "shop",
      size: "12",
      color: "#666"
    }),
    k: common_vendor.p({
      type: "arrow-right",
      size: "14",
      color: "#fff"
    }),
    l: common_vendor.p({
      type: "location",
      size: "12",
      color: "#666"
    }),
    m: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : {}, {
    n: $data.noMore,
    o: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/supply/supply.js.map
