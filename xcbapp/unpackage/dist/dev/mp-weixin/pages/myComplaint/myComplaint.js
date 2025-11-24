"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_public = require("../../utils/public.js");
const api_index = require("../../api/index.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      total: null,
      processing: 3,
      records: [],
      query: {
        page: 1,
        limit: 10
      },
      lock: false,
      statusLabels: ["处理中", "已受理", "调解中", "已完结"],
      statusColors: ["#FF9F43", "#2E86DE", "#10AC84", "#8395A7"],
      cardStyle: {}
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    viewDetail(item) {
      let strJsonData = JSON.stringify(item);
      common_vendor.index.navigateTo({
        url: `/pages/complaintDetails/complaintDetails?strJsonData=${strJsonData}`
      });
    },
    changePageAndGetData() {
      if (!this.lock) {
        this.query.page += 1;
        this.getData();
      }
    },
    async getData() {
      let data = await api_index.api.mylist(this.query);
      if (data.code == 200) {
        if (data.data.listdata < this.query.limit) {
          this.lock = true;
        }
        this.total = data.data.totalnum;
        this.records = [...this.records, ...data.data.listdata];
      }
    },
    // 进度条宽度
    progressWidth(status) {
      return ["30%", "60%", "100%", "0%"][status - 1];
    },
    // 标签样式
    tagStyle(status) {
      return {
        background: this.statusColors[status] + "15",
        Color: this.statusColors[status]
      };
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
  return common_vendor.e({
    a: common_vendor.t($data.total),
    b: common_vendor.f($data.records, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: "c28db3eb-0-" + i0,
        c: common_vendor.t(_ctx.initTime(item.created)),
        d: common_vendor.t($data.statusLabels[item.status - 1]),
        e: common_vendor.s($options.tagStyle(item.status - 1)),
        f: $options.progressWidth(item.status),
        g: item.id,
        h: common_vendor.n("status-" + item.status),
        i: common_vendor.s($data.cardStyle[index]),
        j: common_vendor.o(($event) => $options.viewDetail(item), item.id)
      };
    }),
    c: common_vendor.p({
      type: "calendar",
      size: "16",
      color: "#999"
    }),
    d: $data.records.length === 0
  }, $data.records.length === 0 ? {
    e: common_assets._imports_0$1
  } : {}, {
    f: common_vendor.o((...args) => $options.changePageAndGetData && $options.changePageAndGetData(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c28db3eb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/myComplaint/myComplaint.js.map
