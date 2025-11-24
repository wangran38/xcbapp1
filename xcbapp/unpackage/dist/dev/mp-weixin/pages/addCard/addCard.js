"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      // 银行卡信息
      info: {
        bankusername: "",
        // 开户人 
        banknumber: "",
        // 卡号
        bankname: "",
        // 开户行
        bankaddress: "",
        // 开户行地址
        isuse: 1
      }
    };
  },
  onShow() {
    if (this.checkToken()) {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  methods: {
    // 检查是否token存在，存在则已登陆
    checkToken() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        return true;
      }
      return false;
    },
    copyObj(obj) {
      let newObj = {};
      for (let key in obj) {
        if (typeof obj[key] == "object") {
          newObj[key] = copyObj(obj[key]);
        } else {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
    isNumber(str) {
      return !isNaN(str) && !isNaN(parseFloat(str));
    },
    settleCardChange(val) {
    },
    changeValue(val) {
      this.info.isuse = parseInt(val.detail.value);
    },
    // 返回上一页
    async customizeBack() {
      let canNavBack = await getCurrentPages();
      if (canNavBack && canNavBack.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        history.back();
      }
    },
    async submit() {
      if (this.info.bankname && this.info.bankusername && this.info.bankaddress && (this.info.banknumber.toString().length == 19 && this.isNumber(this.info.banknumber))) {
        let copyObj2 = this.copyObj(this.info);
        copyObj2.banknumber = String(BigInt(copyObj2.banknumber));
        let data = await api_index.api.addbank(copyObj2);
        if (data.code == 200) {
          common_vendor.index.showToast({
            title: "添加成功",
            icon: "success"
          });
          this.customizeBack();
        } else {
          common_vendor.index.showToast({
            title: data.msg,
            icon: "error"
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "填写信息有误",
          icon: "error"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.info.bankusername,
    b: common_vendor.o(($event) => $data.info.bankusername = $event.detail.value),
    c: $data.info.bankname,
    d: common_vendor.o(($event) => $data.info.bankname = $event.detail.value),
    e: $data.info.bankaddress,
    f: common_vendor.o(($event) => $data.info.bankaddress = $event.detail.value),
    g: common_vendor.o([($event) => $data.info.banknumber = $event.detail.value, (...args) => $options.settleCardChange && $options.settleCardChange(...args)]),
    h: $data.info.banknumber,
    i: $data.info.isuse,
    j: common_vendor.o((...args) => $options.changeValue && $options.changeValue(...args)),
    k: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/addCard/addCard.js.map
