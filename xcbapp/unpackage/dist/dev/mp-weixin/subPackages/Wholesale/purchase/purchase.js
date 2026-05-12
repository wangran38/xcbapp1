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
      categories: [
        {
          label: "全部采购",
          value: "all"
        },
        {
          label: "肉类",
          value: "material"
        },
        {
          label: "蔬菜",
          value: "equipment"
        },
        {
          label: "蛋类",
          value: "service"
        }
      ],
      sortOptions: [
        {
          label: "智能排序",
          value: "default"
        },
        {
          label: "预算最高",
          value: "budget_desc"
        },
        {
          label: "最新发布",
          value: "newest"
        }
      ],
      selectedCategory: {
        label: "全部采购",
        value: "all"
      },
      selectedSort: {
        label: "智能排序",
        value: "default"
      },
      purchaseList: [],
      page: 1,
      loading: false,
      noMore: false,
      query: {
        infotitle: null,
        area_id: null,
        stoptime: null,
        page: 1,
        limit: 20
      },
      selectedCategoryIndex: 0,
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
      ]
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    handleSearch(value) {
      this.resetList();
      this.query.infotitle = value;
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
    // 加载数据
    async loadData() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        let data = await api_index.api.buyinfoList(this.query);
        this.purchaseList = [...this.purchaseList, ...data.data.listdata];
        this.page++;
        this.noMore = this.page > 2;
      } finally {
        this.loading = false;
      }
    },
    // 生成截止日期
    generateDeadline() {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 7 + 3));
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    // 分类改变
    categoryChange(e) {
      this.selectedCategory = this.categories[e.detail.value];
      this.resetList();
    },
    // 排序改变
    sortChange(e) {
      this.selectedSort = this.sortOptions[e.detail.value];
      this.resetList();
    },
    // 重置列表
    resetList() {
      this.page = 1;
      this.purchaseList = [];
      this.noMore = false;
      this.query.infotitle = null;
    },
    // 查看详情
    viewDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/purchase/detail?id=${id}`
      });
    },
    // 联系供应商
    contactSupplier(id) {
      common_vendor.index.showActionSheet({
        items: ["在线沟通", "电话联系", "邮件联系"],
        success: (res) => common_vendor.index.__f__("log", "at subPackages/Wholesale/purchase/purchase.vue:258", "联系方式:", res.tapIndex)
      });
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
    d: common_vendor.p({
      type: "tags",
      size: "16",
      color: "#3a7afe"
    }),
    e: common_vendor.t($data.categories[$data.selectedCategoryIndex].label),
    f: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#3a7afe"
    }),
    g: common_vendor.o((...args) => $options.categoryChange && $options.categoryChange(...args)),
    h: $data.categories,
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
    m: common_vendor.f($data.purchaseList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.infotitle),
        b: "e4b2d046-5-" + i0,
        c: common_vendor.t(item.infonumber),
        d: common_vendor.t(item.unit),
        e: common_vendor.t(item.buyaddress),
        f: "e4b2d046-6-" + i0,
        g: common_vendor.t(_ctx.initDate(item.stoptime)),
        h: "e4b2d046-7-" + i0,
        i: common_vendor.o(($event) => $options.contactSupplier(item.id), index),
        j: index,
        k: common_vendor.o(($event) => $options.viewDetail(item.id), index)
      };
    }),
    n: common_vendor.p({
      type: "balance",
      size: "18",
      color: "#999"
    }),
    o: common_vendor.p({
      type: "calendar",
      size: "16",
      color: "#666"
    }),
    p: common_vendor.p({
      type: "arrow-right",
      size: "14",
      color: "#fff"
    }),
    q: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : {}, {
    r: $data.noMore,
    s: common_vendor.o((...args) => _ctx.loadMore && _ctx.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4b2d046"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/purchase/purchase.js.map
