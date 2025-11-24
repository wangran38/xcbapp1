"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      // 核心数据
      coreData: {
        totalSales: 0,
        monthSales: 0,
        totalOrders: 0,
        monthOrders: 0,
        totalCustomers: 0,
        newCustomers: 0,
        totalProfit: 0,
        monthProfit: 0,
        targetRate: 0,
        targetAmount: 0,
        completedAmount: 0
      },
      // 近期订单
      recentOrders: [],
      // 趋势筛选
      trendRange: ["近7天", "近30天", "近90天"],
      selectedTrendRange: 1,
      // 图表数据
      trendData: {},
      // 图表配置
      chartOpts: {
        color: ["#4285F4"],
        padding: [15, 15, 0, 15],
        legend: { show: false },
        xAxis: {
          type: "grid",
          gridType: "dash",
          dashLength: 2,
          axisLine: false,
          labelCount: 5,
          fontSize: 11,
          color: "#999"
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          axisLine: false,
          labelCount: 4,
          fontSize: 11,
          color: "#999"
        },
        extra: {
          line: { width: 2, type: "curve" }
        }
      }
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    // 加载数据
    async loadData() {
      try {
        common_vendor.index.showLoading({ title: "加载中...", mask: true });
        const [coreRes, orderRes, trendRes] = await Promise.all([
          api_index.api.getAgentCoreData(),
          api_index.api.getRecentOrders({ limit: 5 }),
          api_index.api.getSalesTrend({ range: this.trendRange[this.selectedTrendRange] })
        ]);
        if (coreRes.code === 200) {
          this.coreData = coreRes.data;
        }
        if (orderRes.code === 200) {
          this.recentOrders = orderRes.data;
        }
        if (trendRes.code === 200) {
          this.trendData = trendRes.data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/datacenter/datacenter.vue:208", "数据加载失败:", error);
        common_vendor.index.showToast({ title: "数据加载失败", icon: "none", duration: 2e3 });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 切换趋势时间范围
    changeTrendRange(e) {
      this.selectedTrendRange = e.detail.value;
      this.loadData();
    },
    // 格式化日期
    formatDate(dateStr) {
      return formatDate(dateStr, "YYYY-MM-DD HH:mm");
    },
    // 订单状态文本
    getStatusText(status) {
      const statusMap = {
        "PENDING": "待支付",
        "PAID": "已支付",
        "SHIPPED": "已发货",
        "COMPLETED": "已完成",
        "CANCELLED": "已取消"
      };
      return statusMap[status] || status;
    },
    // 查看全部订单
    viewAllOrders() {
      common_vendor.index.navigateTo({ url: "/pages/agent/all-orders" });
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
  return {
    a: common_vendor.p({
      type: "chart",
      size: "20",
      color: "#4285F4"
    }),
    b: common_vendor.t($data.coreData.totalSales.toLocaleString()),
    c: common_vendor.t($data.coreData.monthSales.toLocaleString()),
    d: common_vendor.t($data.coreData.totalOrders.toLocaleString()),
    e: common_vendor.t($data.coreData.monthOrders.toLocaleString()),
    f: common_vendor.t($data.coreData.totalCustomers.toLocaleString()),
    g: common_vendor.t($data.coreData.newCustomers.toLocaleString()),
    h: common_vendor.t($data.coreData.totalProfit.toLocaleString()),
    i: common_vendor.t($data.coreData.monthProfit.toLocaleString()),
    j: common_vendor.t($data.coreData.targetRate),
    k: $data.coreData.targetRate + "%",
    l: common_vendor.t($data.coreData.targetAmount.toLocaleString()),
    m: common_vendor.t($data.coreData.completedAmount.toLocaleString()),
    n: common_vendor.p({
      type: "orders-o",
      size: "20",
      color: "#34A853"
    }),
    o: common_vendor.f($data.recentOrders, (order, k0, i0) => {
      return {
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t($options.formatDate(order.createTime)),
        c: common_vendor.t(order.amount.toFixed(2)),
        d: common_vendor.t($options.getStatusText(order.status)),
        e: common_vendor.n("status-" + order.status),
        f: order.id
      };
    }),
    p: common_vendor.o((...args) => $options.viewAllOrders && $options.viewAllOrders(...args)),
    q: common_vendor.p({
      type: "calendar",
      size: "20",
      color: "#EA4335"
    }),
    r: common_vendor.t($data.trendRange[$data.selectedTrendRange]),
    s: common_vendor.p({
      type: "down",
      size: "14"
    }),
    t: $data.trendRange,
    v: $data.selectedTrendRange,
    w: common_vendor.o((...args) => $options.changeTrendRange && $options.changeTrendRange(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7170c164"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/datacenter/datacenter.js.map
