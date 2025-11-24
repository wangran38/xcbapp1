"use strict";
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // tabs1: ["全部", "待支付", "待收货", "待结算", "已结算"],
      tabs1: ["全部", "待支付", "已完成"],
      stastatus: [0, 1, 3, 5, 6],
      tabs1Current: 0,
      pageData: []
    };
  },
  mixins: [hooks_usePage.usePage],
  // onShow() {
  // 	this.reloadData()
  // },
  onLoad(options) {
    this.orderStatus = options.orderStatus;
    if (this.orderStatus) {
      const index = this.stastatus.indexOf(Number(this.orderStatus));
      if (index !== -1) {
        this.tabs1Current = index;
      }
    }
    this.reloadData();
  },
  methods: {
    /**
     * 格式化时间
     */
    initTime(str) {
      let timestamp = new Date(str).getTime();
      var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1e3) : new Date(parseInt(
        timestamp
      ));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      if (m < 10) {
        m = "0" + m;
      }
      var d = time.getDate();
      if (d < 10) {
        d = "0" + d;
      }
      var h = time.getHours();
      if (h < 10) {
        h = "0" + h;
      }
      var mm = time.getMinutes();
      if (mm < 10) {
        mm = "0" + mm;
      }
      var s = time.getSeconds();
      if (s < 10) {
        s = "0" + s;
      }
      var timeStr = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
      return timeStr;
    },
    handleTabChange(index) {
      this.tabs1Current = index;
      this.reloadData();
    },
    async fetchData(params) {
      const requestParams = {
        ...params
      };
      if (this.tabs1Current !== 0) {
        requestParams.status = this.stastatus[this.tabs1Current];
      }
      const response = await api_index.api.shopoder(requestParams);
      return response.data;
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
    a: common_vendor.f($data.tabs1, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: $data.tabs1Current == index ? 1 : "",
        d: common_vendor.o(($event) => $options.handleTabChange(index), index)
      };
    }),
    b: common_vendor.f($data.pageData, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.out_trade_no),
        b: common_vendor.t(item.shop_name),
        c: "0b7ac5d8-0-" + i0,
        d: common_vendor.f(item.list_arr, (goods, k1, i1) => {
          return {
            a: goods.imglogo,
            b: common_vendor.t(goods.goodsname),
            c: common_vendor.t(goods.content),
            d: common_vendor.t(goods.price),
            e: common_vendor.t(goods.goodsnum),
            f: goods.id
          };
        }),
        e: common_vendor.t($options.initTime(item.createtime)),
        f: item.payway === 1
      }, item.payway === 1 ? {} : {}, {
        g: common_vendor.t(item.payprice * 10),
        h: item.id
      });
    }),
    c: common_vendor.p({
      type: "right",
      size: "20"
    }),
    d: common_vendor.t($data.tabs1[$data.tabs1Current]),
    e: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Ownerorders/Ownerorders.js.map
