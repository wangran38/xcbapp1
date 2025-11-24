"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const bCard = () => "../../components/bCard.js";
const _sfc_main = {
  data() {
    return {
      cardList: []
    };
  },
  components: {
    "bCard": bCard
  },
  onShow() {
    this.getCardDataList();
  },
  methods: {
    // 任意点击关闭解除绑定
    handleTouch(event) {
      if (event.type === "touchstart" || event.type === "click" || event.type === "tap") {
        let count = 0;
        let ele = this.$refs[count];
        while (ele) {
          ele[0].moreStatus = false;
          ele = this.$refs[++count];
        }
      }
    },
    // 跳转至添加银行卡页面
    gotoAddCard() {
      common_vendor.index.navigateTo({
        url: "/pages/addCard/addCard"
      });
    },
    // 获取当前账号所有的银行卡信息
    async getCardDataList() {
      let params = {
        status: 2,
        page: 1,
        limit: 100
      };
      let { data } = await api_index.api.mybank(params);
      this.cardList = data.listdata;
    }
  }
};
if (!Array) {
  const _component_bCard = common_vendor.resolveComponent("bCard");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_bCard + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.cardList.length),
    b: common_vendor.f($data.cardList, (item, index, i0) => {
      return {
        a: common_vendor.sr(index, "4e2c5bbc-0-" + i0, {
          "f": 1
        }),
        b: index,
        c: index,
        d: common_vendor.o($options.getCardDataList, index),
        e: "4e2c5bbc-0-" + i0,
        f: common_vendor.p({
          info: item
        })
      };
    }),
    c: common_vendor.p({
      type: "plusempty",
      size: "24",
      color: "#2979FF"
    }),
    d: common_vendor.o((...args) => $options.gotoAddCard && $options.gotoAddCard(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/bankCard/bankCard.js.map
