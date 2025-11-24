"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      showList: [],
      currentFilter: "全部",
      filterOptions: ["全部", "申请中", "已完成"],
      page: 1,
      pageSize: 10,
      total: 0,
      loadStatus: "loading",
      query: {
        page: 1,
        limit: 10,
        status: 0
        // 默认0加载全部
      }
    };
  },
  methods: {
    // 初始化模拟数据
    initMockData() {
      this.loadData();
    },
    // 状态筛选
    statusChange(e) {
      this.showList = [];
      this.currentFilter = this.filterOptions[e.detail.value];
      common_vendor.index.__f__("log", "at subPackages/boothOwner/billRecord/billRecord.vue:73", e.detail.value);
      switch (e.detail.value) {
        case 0:
          this.query.status = 0;
          break;
        case 1:
          this.query.status = 1;
          break;
        case 2:
          this.query.status = 2;
          break;
      }
      this.query.page = 1;
      this.loadData();
    },
    // 加载数据
    async loadData() {
      let res = await api_index.api.shopmoneylist(this.query);
      if (res.code == 200) {
        this.total = res.data.totalnum;
        this.showList = [...this.showList, ...res.data.listdata];
        this.loadStatus = res.data.listdata.length < this.query.limit ? "more" : "loading";
      }
    },
    // 加载更多
    loadMore() {
      if (this.loadStatus !== "more")
        return;
      this.query.page += 1;
      this.loadData();
    }
  },
  mounted() {
    this.initMockData();
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
  return {
    a: common_vendor.t($data.total),
    b: common_vendor.t($data.currentFilter),
    c: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#666"
    }),
    d: common_vendor.o((...args) => $options.statusChange && $options.statusChange(...args)),
    e: $data.filterOptions,
    f: common_vendor.f($data.showList, (item, index, i0) => {
      return {
        a: common_vendor.t(_ctx.initTime(item.createtime)),
        b: common_vendor.t(item.shopmoney.toFixed(2)),
        c: common_vendor.t(item.status === 1 ? "申请中" : "已完成"),
        d: common_vendor.s(item.status == 1 ? "background: #FFF3E0;color: #FFA726;" : "background: #E8F5E9;color: #4CAF50;"),
        e: item.id
      };
    }),
    g: common_vendor.t($data.loadStatus === "loading" ? "正在加载..." : "没有更多数据了"),
    h: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/boothOwner/billRecord/billRecord.js.map
