"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      merchantInfo: {},
      presaleList: [],
      queryData: { page: 1, limit: 10 },
      isLogin: true,
      showDetail: false
    };
  },
  onLoad({ query }) {
    try {
      this.merchantInfo = JSON.parse(query);
      this.merchantInfo.lat = this.merchantInfo.lat - 0.1;
      this.merchantInfo.markers = [{
        id: 1,
        longitude: this.merchantInfo.lng,
        latitude: this.merchantInfo.lat,
        iconPath: "../../../static/selectlocation.png",
        width: 30,
        height: 30
      }];
      this.queryData.farmers_id = parseInt(this.merchantInfo.id);
      this.getPresaleData();
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        this.isLogin = false;
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at subPackages/shoppingPageList/merchantDetails/merchantDetails.vue:129", e);
    }
  },
  methods: {
    // 进入菜园监控页面
    goToMonitor() {
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/gardenMonitor/gardenMonitor?query=${JSON.stringify(this.merchantInfo)}`
      });
    },
    toggleDetail() {
      this.showDetail = !this.showDetail;
    },
    gotoGoods(id) {
      common_vendor.index.navigateTo({
        url: `/pages/dynamics/dynamics?id=${id}`
      });
    },
    async getPresaleData() {
      let data = await api_index.api.presaleList(this.queryData);
      if (data.code == 200) {
        this.presaleList = [...this.presaleList, ...data.data.listdata];
      }
    },
    goToBuy(data) {
      const copyData = JSON.parse(JSON.stringify(data));
      copyData.cover = null;
      let query = JSON.stringify(copyData);
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit?query=${query}`
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
    a: common_vendor.p({
      type: "info",
      size: "20",
      color: "#3A7AFE"
    }),
    b: common_vendor.p({
      type: "person",
      size: "18",
      color: "#3A7AFE"
    }),
    c: common_vendor.t($data.merchantInfo.farmersname),
    d: common_vendor.p({
      type: "phone",
      size: "18",
      color: "#3A7AFE"
    }),
    e: common_vendor.t($data.isLogin ? $data.merchantInfo.phone : _ctx.hidePhone($data.merchantInfo.phone)),
    f: common_vendor.p({
      type: "location",
      size: "18",
      color: "#3A7AFE"
    }),
    g: common_vendor.t($data.merchantInfo.address),
    h: $data.merchantInfo.lat,
    i: $data.merchantInfo.lng,
    j: $data.merchantInfo.markers,
    k: common_vendor.p({
      type: "video",
      size: "24",
      color: "#00C26E"
    }),
    l: common_vendor.p({
      type: "arrowright",
      size: "20",
      color: "#999"
    }),
    m: common_vendor.o((...args) => $options.goToMonitor && $options.goToMonitor(...args)),
    n: common_vendor.t($data.presaleList.length),
    o: common_vendor.f($data.presaleList, (item, index, i0) => {
      return {
        a: item.imglogo,
        b: common_vendor.t(item.goodsname),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.presaleprice),
        e: item.goodstotal > 0 ? Math.min(item.selltotal / item.goodstotal * 100, 100) : 0,
        f: common_vendor.t(item.selltotal),
        g: common_vendor.t(item.goodstotal),
        h: "1390a306-6-" + i0,
        i: common_vendor.t(_ctx.getChineseTimeDiff(Date.now(), item.sellendtime)),
        j: common_vendor.o(($event) => $options.goToBuy(item), item.id),
        k: item.id,
        l: common_vendor.o(($event) => $options.gotoGoods(item.id), item.id)
      };
    }),
    p: common_vendor.p({
      type: "calendar",
      size: "14",
      color: "#999"
    }),
    q: $data.presaleList.length == 0
  }, $data.presaleList.length == 0 ? {
    r: common_vendor.p({
      type: "folder",
      size: "60",
      color: "#ddd"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1390a306"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/merchantDetails/merchantDetails.js.map
