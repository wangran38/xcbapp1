"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      merchantInfo: {
        // license: null,
        // company: null,
        // owner: null,
        // contact: null,
        // phone: null,
        // businessHours: null,
        // address: null,
        // lat:null,
        // lng:null,
        // markers:[]
      },
      presaleList: [],
      queryData: {
        page: 1,
        limit: 10
      },
      isLogin: true,
      showDetail: false
    };
  },
  onLoad({ query }) {
    this.merchantInfo = JSON.parse(query);
    common_vendor.index.__f__("log", "at subPackages/shoppingPageList/merchantDetails/merchantDetails.vue:41", this.merchantInfo.lat);
    this.merchantInfo.lat = this.merchantInfo.lat - 0.1;
    this.merchantInfo.markers = [{ id: 1, longitude: this.merchantInfo.lng, latitude: this.merchantInfo.lat, iconPath: "../../../static/selectlocation.png", width: 30, height: 30 }];
    this.queryData.farmers_id = parseInt(this.merchantInfo.id);
    this.getPresaleData();
    const token = common_vendor.index.getStorageSync("token");
    if (!token) {
      this.isLogin = false;
    }
  },
  methods: {
    // 展开/收起商品详情
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/merchantDetails/merchantDetails.js.map
