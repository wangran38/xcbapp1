"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      dataTotal: null,
      listData: [],
      statusConfig: {
        1: {
          text: "报价中",
          color: "#007AFF"
        },
        2: {
          text: "已截单",
          color: "#4cd964"
        },
        3: {
          text: "已完成",
          color: "#909399"
        }
      },
      noMore: false,
      queryData: {
        page: 1,
        limit: 10
      }
    };
  },
  methods: {
    async getData() {
      let data = await api_index.api.myProcurementData(this.queryData);
      common_vendor.index.__f__("log", "at subPackages/Wholesale/myProcurement/myProcurement.vue:98", data);
      if (data.code == 200) {
        this.dataTotal = data.data.totalnum;
        this.listData = [...this.listData, ...data.data.listdata];
      }
    }
  },
  async onLoad() {
    this.getData();
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
    a: common_vendor.t($data.dataTotal),
    b: common_vendor.p({
      type: "filter",
      size: "20",
      color: "#fff"
    }),
    c: common_vendor.f($data.listData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.infotitle),
        b: "2a80d913-1-" + i0,
        c: common_vendor.t(item.infonumber),
        d: common_vendor.t(item.unit),
        e: "2a80d913-2-" + i0,
        f: common_vendor.t(_ctx.initDate(item.stoptime)),
        g: "2a80d913-3-" + i0,
        h: common_vendor.t(item.buyaddress),
        i: common_vendor.t(item.content),
        j: item.id,
        k: common_vendor.n("status-" + item.status)
      };
    }),
    d: $data.statusConfig[1].color,
    e: common_vendor.t($data.statusConfig[1].text),
    f: common_vendor.p({
      type: "shop",
      size: "16",
      color: "#666"
    }),
    g: common_vendor.p({
      type: "calendar",
      size: "16",
      color: "#666"
    }),
    h: common_vendor.p({
      type: "location",
      size: "16",
      color: "#666"
    }),
    i: common_vendor.t(1)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2a80d913"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/myProcurement/myProcurement.js.map
