"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 20,
      typeOptions: ["全部", "收入", "支出"],
      typeIndex: 0,
      currentDate: this.formatDate(/* @__PURE__ */ new Date()),
      bills: [],
      pageSize: 10,
      currentPage: 1,
      loading: false,
      hasMore: true,
      themeColor: {
        primary: "#409EFF",
        // 轻蓝主色
        danger: "#F56C6C"
        // 警示色
      }
    };
  },
  computed: {
    rightTextStyle() {
      return {
        income: { color: this.themeColor.primary },
        expense: { color: this.themeColor.danger }
      };
    },
    filteredBills() {
      const filtered = this.bills.filter((item) => {
        const typeMatch = this.typeIndex === 0 || this.typeIndex === 1 && item.type === "income" || this.typeIndex === 2 && item.type === "expense";
        const dateMatch = new Date(item.date).getMonth() === new Date(this.currentDate).getMonth();
        return typeMatch && dateMatch;
      });
      return filtered.slice(0, this.currentPage * this.pageSize);
    },
    totalIncome() {
      return this.bills.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
    },
    totalExpense() {
      return this.bills.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
    },
    navBarStyle() {
      return {
        paddingTop: `${this.statusBarHeight}px`,
        height: "44px",
        background: this.themeColor.primary
      };
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    },
    typeChange(e) {
      this.typeIndex = e.detail.value;
      this.resetPagination();
    },
    dateChange(e) {
      this.currentDate = e.detail.value;
      this.resetPagination();
    },
    resetPagination() {
      this.currentPage = 1;
      this.hasMore = true;
      this.bills = [];
      this.loadMore();
    },
    handleItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/bill/detail?id=${item.id}`
      });
    },
    getSystemInfo() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 20;
    },
    async loadMore() {
      if (this.loading || !this.hasMore)
        return;
      this.loading = true;
      try {
        const newData = await this.mockFetchData();
        this.bills = [...this.bills, ...newData];
        this.hasMore = newData.length >= this.pageSize;
        this.currentPage++;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/billRecord/billRecord.vue:177", error);
      } finally {
        this.loading = false;
      }
    },
    mockFetchData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = Array.from({ length: this.pageSize }, (_, i) => ({
            id: Date.now() + i,
            type: Math.random() > 0.5 ? "income" : "expense",
            category: ["工资", "餐饮", "交通", "购物"][Math.floor(Math.random() * 4)],
            amount: (Math.random() * 2e3 + 100).toFixed(2),
            date: new Date((/* @__PURE__ */ new Date()).setDate(Math.floor(Math.random() * 30 + 1))).toISOString().split("T")[0],
            remark: Math.random() > 0.7 ? "测试备注" : ""
          }));
          resolve(data);
        }, 800);
      });
    }
  },
  onLoad() {
    this.getSystemInfo();
    this.loadMore();
  },
  onReachBottom() {
    this.loadMore();
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  (_easycom_uni_icons2 + _easycom_uni_list_item2 + _easycom_uni_list2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_list_item + _easycom_uni_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.s($options.navBarStyle),
    b: common_vendor.p({
      type: "bars",
      size: "16",
      color: "#666"
    }),
    c: common_vendor.t($data.typeOptions[$data.typeIndex]),
    d: $data.typeOptions,
    e: common_vendor.o((...args) => $options.typeChange && $options.typeChange(...args)),
    f: common_vendor.p({
      type: "calendar",
      size: "16",
      color: "#666"
    }),
    g: common_vendor.t($data.currentDate),
    h: common_vendor.o((...args) => $options.dateChange && $options.dateChange(...args)),
    i: common_vendor.t($options.totalIncome),
    j: common_vendor.t($options.totalExpense),
    k: $options.filteredBills.length
  }, $options.filteredBills.length ? {
    l: common_vendor.f($options.filteredBills, (item, index, i0) => {
      return {
        a: common_vendor.t(item.remark || "暂无备注"),
        b: "131b1f3c-4-" + i0 + "," + ("131b1f3c-3-" + i0),
        c: common_vendor.p({
          type: item.type === "income" ? "arrowthindown" : "arrowthinup",
          color: item.type === "income" ? $data.themeColor.primary : $data.themeColor.danger,
          size: "20"
        }),
        d: index,
        e: common_vendor.o(($event) => $options.handleItemClick(item), index),
        f: "131b1f3c-3-" + i0 + ",131b1f3c-2",
        g: common_vendor.p({
          title: item.category,
          note: $options.formatDate(item.date),
          rightText: item.type === "income" ? "+" + item.amount : "-" + item.amount,
          rightTextStyle: item.type === "income" ? $options.rightTextStyle.income : $options.rightTextStyle.expense,
          ["hover-class"]: "none"
        })
      };
    })
  } : {}, {
    m: $data.loading
  }, $data.loading ? {} : {}, {
    n: !$data.hasMore && $options.filteredBills.length
  }, !$data.hasMore && $options.filteredBills.length ? {} : {}, {
    o: !$data.loading && !$options.filteredBills.length
  }, !$data.loading && !$options.filteredBills.length ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/billRecord/billRecord.js.map
