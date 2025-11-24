"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      amount: null,
      // 输入金额
      method: "wechat",
      // 默认选择微信
      disabled: true,
      methods: [
        {
          value: "wechat",
          label: "微信零钱"
        },
        {
          value: "card",
          label: "银行卡"
        }
      ],
      feeRate: 0.1,
      // 手续费率
      minFee: 1,
      // 最低手续费
      shopmoney: null,
      // 需要替换
      mymoney: null
      // 需要替换
    };
  },
  onLoad() {
    this.updateMoney();
  },
  watch: {
    amount(newValue, oldValue) {
      if (newValue <= this.shopmoney && newValue >= 1) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  },
  methods: {
    updateMoney() {
      api_index.api.mymoney({}).then(({
        data
      }) => {
        this.mymoney = data.mymoney;
        this.shopmoney = data.shopmoney;
      });
    },
    // 金额校验
    validateAmount() {
      this.amount = this.amount.replace(/[^\d.]/g, "");
    },
    // 选择提现方式
    selectMethod(e) {
      this.method = e.detail.value;
    },
    // 提交申请
    async submitWithdraw() {
      switch (this.method) {
        case "wechat":
          common_vendor.index.showToast({
            icon: "error",
            title: "提现至微信暂不支持"
          });
          return;
      }
      let data = await api_index.api.amount({ mymoney: parseFloat(this.amount) });
      if (data.code == 200) {
        common_vendor.index.showToast({
          icon: "success",
          title: data.message
        });
        this.updateMoney();
      } else {
        common_vendor.index.showToast({
          icon: "error",
          title: data.message
        });
      }
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
    a: common_vendor.t($data.shopmoney),
    b: common_vendor.o(($event) => $data.amount = $data.shopmoney),
    c: common_vendor.o([($event) => $data.amount = $event.detail.value, (...args) => $options.validateAmount && $options.validateAmount(...args)]),
    d: $data.amount,
    e: common_vendor.f($data.methods, (item, k0, i0) => {
      return common_vendor.e({
        a: item.value == "wechat"
      }, item.value == "wechat" ? {
        b: "4c2d0ccf-0-" + i0,
        c: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26,
          color: "#09bb07;"
        })
      } : {}, {
        d: item.value == "card"
      }, item.value == "card" ? {
        e: "4c2d0ccf-1-" + i0,
        f: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26
        })
      } : {}, {
        g: common_vendor.t(item.label),
        h: item.value,
        i: $data.method === item.value,
        j: item.value
      });
    }),
    f: common_vendor.o((...args) => $options.selectMethod && $options.selectMethod(...args)),
    g: $data.disabled,
    h: common_vendor.o((...args) => $options.submitWithdraw && $options.submitWithdraw(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4c2d0ccf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/weChatCashwWithdrawal/weChatCashwWithdrawal.js.map
