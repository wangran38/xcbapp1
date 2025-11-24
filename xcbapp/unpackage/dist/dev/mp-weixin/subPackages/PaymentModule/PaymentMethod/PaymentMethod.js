"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      playmenthodList: [
        { title: "积分支付", code: 0 },
        { title: "微信支付", code: 1 },
        { title: "数字人名币", code: 2 }
      ],
      selectCode: 0,
      remainingAmount: "",
      OrderNo: ""
    };
  },
  onLoad(value) {
    let { OrderNo, remainingAmount } = value;
    this.OrderNo = OrderNo;
    this.remainingAmount = remainingAmount;
  },
  methods: {
    // 选择支付方式
    select(code) {
      this.selectCode = code;
      common_vendor.index.__f__("log", "at subPackages/PaymentModule/PaymentMethod/PaymentMethod.vue:66", this.playmenthodList[code]);
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
    a: common_vendor.t($data.remainingAmount),
    b: common_vendor.t($data.remainingAmount),
    c: common_vendor.t($data.OrderNo),
    d: common_vendor.f($data.playmenthodList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.title == "积分支付"
      }, item.title == "积分支付" ? {
        b: "be4a4744-0-" + i0,
        c: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26,
          color: "#ee6770;"
        })
      } : {}, {
        d: item.title == "微信支付"
      }, item.title == "微信支付" ? {
        e: "be4a4744-1-" + i0,
        f: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26,
          color: "#09bb07;"
        })
      } : {}, {
        g: item.title == "数字人名币"
      }, item.title == "数字人名币" ? {
        h: "be4a4744-2-" + i0,
        i: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26,
          color: "#ffd345;"
        })
      } : {}, {
        j: common_vendor.t(item.title),
        k: common_vendor.o(($event) => $options.select(item.code), item.code),
        l: common_vendor.n($data.selectCode == item.code ? "select" : ""),
        m: item.code
      });
    }),
    e: common_vendor.t($data.remainingAmount)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/PaymentModule/PaymentMethod/PaymentMethod.js.map
