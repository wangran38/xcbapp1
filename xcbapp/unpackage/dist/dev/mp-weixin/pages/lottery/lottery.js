"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    rules() {
      common_vendor.index.navigateTo({
        url: "/pages/rules/rules"
      });
    },
    jackpot(prize) {
      common_vendor.index.navigateTo({
        // url: '/pages/jackpot/jackpot'
        url: `/pages/jackpot/jackpot?title=${prize.title}&image=${prize.image}&price=${prize.price}&type=${prize.type}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.jackpot({
      title: "一等奖 ",
      image: "http://h5.xcbdsc.com/static/one.jpg",
      price: "3000 积分",
      type: 1
    })),
    b: common_vendor.o(($event) => $options.jackpot({
      title: "二等奖 ",
      image: "http://h5.xcbdsc.com/static/two.jpg",
      price: "1000 积分",
      type: 2
    })),
    c: common_vendor.o(($event) => $options.jackpot({
      title: "三等奖 ",
      image: "http://h5.xcbdsc.com/static/three.jpg",
      price: "500 积分",
      type: 3
    })),
    d: common_vendor.o((...args) => $options.rules && $options.rules(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/lottery/lottery.js.map
