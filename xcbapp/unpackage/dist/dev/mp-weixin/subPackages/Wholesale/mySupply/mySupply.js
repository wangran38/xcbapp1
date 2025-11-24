"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10
      },
      dataTotal: null,
      noMore: false,
      supplyData: [],
      statusConfig: {
        1: {
          text: "供应中",
          color: "#4cd964"
        },
        2: {
          text: "已下架",
          color: "#909399"
        }
      }
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    async getData() {
      let data = await api_index.api.mySupplyData(this.queryData);
      common_vendor.index.__f__("log", "at subPackages/Wholesale/mySupply/mySupply.vue:91", data);
      if (data.code == 200) {
        this.dataTotal = data.data.totalnum;
        this.supplyData = [...this.supplyData, ...data.data.listdata];
      }
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
    a: common_vendor.t($data.dataTotal),
    b: common_vendor.f($data.supplyData, (item, k0, i0) => {
      return {
        a: item.selllogo,
        b: common_vendor.t(item.selltitle),
        c: "4f55645d-0-" + i0,
        d: common_vendor.t(item.price.toFixed(2)),
        e: common_vendor.t(item.unit),
        f: "4f55645d-1-" + i0,
        g: common_vendor.t(item.sellnumber),
        h: common_vendor.t(item.unit),
        i: "4f55645d-2-" + i0,
        j: common_vendor.t(item.selladdress),
        k: item.id,
        l: common_vendor.n("status-" + item.status)
      };
    }),
    c: common_vendor.p({
      type: "wallet",
      size: "16",
      color: "#666"
    }),
    d: common_vendor.p({
      type: "shop",
      size: "16",
      color: "#666"
    }),
    e: common_vendor.p({
      type: "location",
      size: "14",
      color: "#666"
    }),
    f: !$data.supplyData.length
  }, !$data.supplyData.length ? {
    g: common_assets._imports_0$2
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4f55645d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/mySupply/mySupply.js.map
