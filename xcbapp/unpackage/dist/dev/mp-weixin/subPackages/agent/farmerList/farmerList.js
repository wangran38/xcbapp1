"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      farmerList: [],
      totalFarmerCount: 0,
      hasMore: true,
      filterType: "all",
      query: {
        page: 1,
        limit: 10,
        area_id: null
      }
    };
  },
  onLoad(options) {
    this.query.area_id = Number(JSON.parse(options.data).id);
    this.loadFarmerData();
  },
  methods: {
    async loadFarmerData() {
      if (!this.hasMore) {
        return;
      }
      let data = await api_index.api.farmersList(this.query);
      this.farmerList = [...this.farmerList, ...data.data.listdata];
      this.hasMore = this.farmerList.length < this.query.limit ? false : true;
      this.totalFarmerCount = data.data.totalnum;
    },
    loadMore() {
      this.query.page++;
      this.loadFarmerData();
    },
    toFarmerDetail(farmer) {
      common_vendor.index.showToast({
        title: `查看${farmer.name}详情`,
        icon: "none"
      });
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
    a: common_vendor.t($data.totalFarmerCount),
    b: !$data.farmerList.length
  }, !$data.farmerList.length ? {
    c: common_vendor.o((...args) => $options.loadFarmerData && $options.loadFarmerData(...args))
  } : {
    d: common_vendor.f($data.farmerList, (farmer, index, i0) => {
      return {
        a: common_vendor.t(farmer.farmersname.charAt(0)),
        b: common_vendor.t(farmer.farmersname),
        c: common_vendor.t(farmer.phone),
        d: common_vendor.t(farmer.category_name),
        e: common_vendor.t(farmer.address),
        f: "3d016291-0-" + i0,
        g: farmer.id,
        h: common_vendor.o(($event) => $options.toFarmerDetail(farmer), farmer.id)
      };
    }),
    e: common_vendor.p({
      type: "arrowright",
      size: "20",
      color: "#ddd"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3d016291"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/farmerList/farmerList.js.map
