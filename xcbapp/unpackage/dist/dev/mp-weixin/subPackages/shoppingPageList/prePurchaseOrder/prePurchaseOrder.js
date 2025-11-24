"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      activeStatus: "all",
      statusTabs: [
        { label: "全部", value: "all" },
        { label: "待提货", value: "wait_pickup" },
        { label: "已完成", value: "completed" }
      ],
      orders: [],
      loading: false,
      noMore: false,
      statusMap: {
        "wait_pickup": "待提货",
        "completed": "已完成",
        "canceled": "已取消"
      }
    };
  },
  computed: {
    filteredOrders() {
      if (this.activeStatus === "all")
        return this.orders;
      return this.orders.filter((o) => o.status === this.activeStatus);
    },
    processingCount() {
      return this.orders.filter(
        (o) => ["wait_pay", "wait_pickup"].includes(o.status)
      ).length;
    },
    totalAmount() {
      return this.orders.reduce((sum, o) => sum + (o.deposit + o.finalPayment), 0).toFixed(2);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.orders = this.getMockData();
      } finally {
        this.loading = false;
      }
    },
    getMockData() {
      return [
        {
          id: 1,
          orderNo: "xcbdsc20251128001",
          status: "completed",
          goodsImage: "https://img1.baidu.com/it/u=2670186960,2836929917&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
          goodsName: "定安黑猪",
          quantity: 2,
          deposit: 60,
          finalPayment: 196,
          pickupPoint: "猪肉铺小吴",
          pickupTime: "12月5日 14:00-18:00"
        }
      ];
    },
    changeStatus(status) {
      this.activeStatus = status;
    },
    onRefresh() {
      this.loadData();
    },
    loadMore() {
      if (!this.noMore)
        ;
    },
    viewDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/preorder/detail?id=${id}`
      });
    },
    payFinal(id) {
      common_vendor.index.showModal({
        title: "支付尾款",
        content: "确认支付尾款金额？",
        success: (res) => {
          if (res.confirm)
            ;
        }
      });
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
    a: common_vendor.t($options.processingCount),
    b: common_vendor.t($options.totalAmount),
    c: common_vendor.f($data.statusTabs, (tab, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab.label),
        b: $data.activeStatus === tab.value
      }, $data.activeStatus === tab.value ? {} : {}, {
        c: tab.value,
        d: common_vendor.n({
          active: $data.activeStatus === tab.value
        }),
        e: common_vendor.o(($event) => $options.changeStatus(tab.value), tab.value)
      });
    }),
    d: common_vendor.f($options.filteredOrders, (order, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t($data.statusMap[order.status]),
        c: common_vendor.n(order.status),
        d: order.goodsImage,
        e: common_vendor.t(order.goodsName),
        f: common_vendor.t(order.quantity),
        g: common_vendor.t(order.deposit),
        h: common_vendor.t(order.finalPayment),
        i: "70c367a7-0-" + i0,
        j: common_vendor.t(order.pickupPoint),
        k: common_vendor.t(order.pickupTime),
        l: order.status === "wait_pay"
      }, order.status === "wait_pay" ? {
        m: common_vendor.o(($event) => $options.payFinal(order.id), order.id)
      } : {}, {
        n: order.status === "completed"
      }, order.status === "completed" ? {
        o: common_vendor.o(($event) => _ctx.applyAfterSales(order.id), order.id)
      } : {}, {
        p: order.id,
        q: common_vendor.o(($event) => $options.viewDetail(order.id), order.id)
      });
    }),
    e: common_vendor.p({
      type: "shop",
      size: "14"
    }),
    f: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : {}, {
    g: $data.noMore,
    h: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    i: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-70c367a7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/prePurchaseOrder/prePurchaseOrder.js.map
