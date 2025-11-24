"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const _sfc_main = {
  data() {
    return {
      tabs1: ["全部", "待支付", "待收货", "已完成"],
      stastatus: [0, 1, 3, 4],
      tabs1Current: 0,
      pageData: [],
      searData: [],
      out_trade_no: "",
      searchOrderNumber: null
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
  computed: {
    buyButtonText() {
      let strtemp = "";
      switch (this.tabs1Current) {
        case 0:
          strtemp = "再买一单";
          break;
        case 1:
          strtemp = "去支付";
          break;
        case 2:
          strtemp = "确认收货";
          break;
        case 3:
          strtemp = "已完成";
          break;
      }
      return strtemp;
    }
  },
  methods: {
    clearSearch() {
      this.searData = [];
      this.searchOrderNumber = null;
      this.reloadData();
    },
    async sendSearch() {
      let query = {
        isshow: 1,
        limit: 100,
        page: 1,
        status: 1,
        out_trade_no: this.searchOrderNumber
      };
      const { data } = await api_index.api.myorders(query);
      common_vendor.index.__f__("log", "at pages/orders/orders.vue:171", "开始搜索", data.listdata);
      this.searData = data.listdata;
    },
    goPay(item) {
      this.out_trade_no = item.out_trade_no;
      switch (item.status) {
        case 1:
          if (this.buyButtonText == "再买一单") {
            return "";
          } else {
            common_vendor.index.navigateTo({
              url: `/subPackages/PaymentModule/collectOnDelivery/collectOnDelivery?out_trade_no=${item.out_trade_no}`
            });
          }
          break;
        case 2:
        case 3:
          this.$refs.popup.open("center");
          break;
      }
    },
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
      const response = await api_index.api.myorders(requestParams);
      return response.data;
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uv_qrcode2 = common_vendor.resolveComponent("uv-qrcode");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_easyinput2 + _easycom_uni_section2 + _easycom_uni_icons2 + _easycom_uv_qrcode2 + _easycom_uni_popup2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uv_qrcode = () => "../../uni_modules/uv-qrcode/components/uv-qrcode/uv-qrcode.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_section + _easycom_uni_icons + _easycom_uv_qrcode + _easycom_uni_popup)();
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
    b: common_vendor.o(_ctx.iconClick),
    c: common_vendor.o($options.sendSearch),
    d: common_vendor.o($options.clearSearch),
    e: common_vendor.o(($event) => $data.searchOrderNumber = $event),
    f: common_vendor.p({
      prefixIcon: "search",
      placeholder: "请输入订单号",
      modelValue: $data.searchOrderNumber
    }),
    g: common_vendor.p({
      title: "查询",
      type: "line",
      padding: true
    }),
    h: common_vendor.f($data.pageData, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.out_trade_no),
        b: common_vendor.t(item.shop_name),
        c: "7277b242-2-" + i0,
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
        h: common_vendor.o(($event) => $options.goPay(item), item.id),
        i: item.id
      });
    }),
    i: common_vendor.p({
      type: "right",
      size: "20"
    }),
    j: common_vendor.t($options.buyButtonText),
    k: $data.searData.length == 0,
    l: common_vendor.f($data.searData, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.out_trade_no),
        b: common_vendor.t(item.shop_name),
        c: "7277b242-3-" + i0,
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
        h: common_vendor.o(($event) => $options.goPay(item))
      });
    }),
    m: common_vendor.p({
      type: "right",
      size: "20"
    }),
    n: common_vendor.t($options.buyButtonText),
    o: $data.searData.length != 0,
    p: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    q: common_vendor.p({
      value: $data.out_trade_no
    }),
    r: common_vendor.sr("popup", "7277b242-4")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/orders/orders.js.map
