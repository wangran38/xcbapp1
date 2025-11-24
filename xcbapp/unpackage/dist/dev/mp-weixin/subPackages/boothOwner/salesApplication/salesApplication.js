"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      applicationList: [
        {
          id: 1,
          farmerName: "王启俊",
          farmAddress: "海南省定安县雷鸣镇",
          productName: "黑猪肉粽子",
          yield: 150,
          price: 5.8,
          deliveryType: "农户自配送",
          applyTime: "2023-08-20 09:30",
          status: 0,
          // 0待处理 1已同意 2已拒绝
          avatar: "/static/avatar1.png"
        }
        // 更多模拟数据...
      ]
    };
  },
  filters: {
    statusText(value) {
      const statusMap = { 0: "待处理", 1: "已同意", 2: "已拒绝" };
      return statusMap[value] || "未知状态";
    }
  },
  methods: {
    statusClass(status) {
      return {
        "status-pending": status === 0,
        "status-approved": status === 1,
        "status-rejected": status === 2
      };
    },
    handleAccept(id) {
      common_vendor.index.showModal({
        title: "确认操作",
        content: "确定同意该代销申请吗？",
        success: (res) => {
          if (res.confirm)
            ;
        }
      });
    },
    handleReject(id) {
      common_vendor.index.showModal({
        title: "确认操作",
        content: "确定拒绝该代销申请吗？",
        confirmColor: "red",
        success: (res) => {
          if (res.confirm)
            ;
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.applicationList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.farmerName),
        b: common_vendor.t(item.farmAddress),
        c: common_vendor.t(item.status | _ctx.statusText),
        d: common_vendor.n($options.statusClass(item.status)),
        e: common_vendor.t(item.productName),
        f: common_vendor.t(item.yield),
        g: common_vendor.t(item.price),
        h: common_vendor.t(item.deliveryType),
        i: item.status === 0
      }, item.status === 0 ? {
        j: common_vendor.o(($event) => $options.handleReject(item.id), index),
        k: common_vendor.o(($event) => $options.handleAccept(item.id), index)
      } : {}, {
        l: common_vendor.t(item.applyTime),
        m: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9634f2da"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/boothOwner/salesApplication/salesApplication.js.map
