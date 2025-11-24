"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      pagedata: {
        hasmoney: 0
        // 给 truemoney 设置一个默认值
      },
      displayValue: ""
      // 需要提现的积分
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    displayValueConvert: function() {
      return (this.displayValue / 10).toFixed(1) || 0;
    }
  },
  methods: {
    // 提取全部
    handleWithdrawAll() {
      this.displayValue = this.pagedata.hasmoney.toFixed(1);
    },
    async fetchData() {
      try {
        const response = await api_index.api.mysorce();
        this.pagedata = response.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/pointspayouts/pointspayouts.vue:165", "获取积分数据失败：", error);
      }
    },
    async submitSettlement() {
      if (!this.displayValue || isNaN(this.displayValue) || Number(this.displayValue) <= 0) {
        common_vendor.index.showToast({
          title: "请输入有效的积分数",
          icon: "none"
        });
        return;
      }
      const shopscore = Number(this.displayValue);
      if (shopscore < 100) {
        common_vendor.index.showToast({
          title: "积分必须大于100",
          icon: "none"
        });
        return;
      }
      try {
        const response = await api_index.api.settlement({
          shopscore
        });
        if (response.code === 200) {
          common_vendor.index.showToast({
            title: "积分结算申请成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: response.message || "积分结算失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/pointspayouts/pointspayouts.vue:205", "提交请求失败", error);
        common_vendor.index.showToast({
          title: "提交请求失败，请稍后重试",
          icon: "none"
        });
      }
    },
    gotoSettrecords() {
      common_vendor.index.navigateTo({
        url: "/pages/Settrecords/Settrecords"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: "可提现总积分为 " + ($data.pagedata.hasmoney.toFixed(1) || "0"),
    b: $data.displayValue,
    c: common_vendor.o(common_vendor.m(($event) => $data.displayValue = $event.detail.value, {
      number: true
    })),
    d: common_vendor.o((...args) => $options.handleWithdrawAll && $options.handleWithdrawAll(...args)),
    e: common_vendor.t($options.displayValueConvert),
    f: common_vendor.o((...args) => $options.submitSettlement && $options.submitSettlement(...args)),
    g: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#666"
    }),
    h: common_vendor.o((...args) => $options.gotoSettrecords && $options.gotoSettrecords(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pointspayouts/pointspayouts.js.map
