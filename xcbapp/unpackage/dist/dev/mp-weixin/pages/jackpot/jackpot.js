"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_public = require("../../utils/public.js");
const _sfc_main = {
  data() {
    return {
      pagedData: [],
      totalnum: 0,
      totalPages: 0,
      yideng: [],
      erdeng: [],
      sandeng: [],
      Created: "",
      signTotalData: {}
    };
  },
  mixins: [utils_public.myMixin],
  async onLoad() {
    this.fetchData();
    let res = await api_index.api.signTotal();
    this.signTotalData = res.data;
  },
  methods: {
    goTofreeGroceryShopping() {
      common_vendor.index.navigateTo({
        url: "/subPackages/shoppingPageList/freeGroceryShopping/freeGroceryShopping"
      });
    },
    async fetchData(params) {
      this.totalPages = Math.ceil(this.totalnum / 6);
      this.pagedData = [];
      const querList = [
        { page: 1, limit: 1, type: 1 },
        { page: 1, limit: 3, type: 2 },
        { page: 1, limit: 8, type: 3 }
      ];
      querList.forEach(async (item) => {
        let { data } = await api_index.api.lottery(item);
        let type = data.listdata[0].type;
        this.Created = data.listdata[0].Created;
        switch (type) {
          case 1:
            this.yideng = data.listdata;
            break;
          case 2:
            this.erdeng = data.listdata;
            break;
          case 3:
            this.sandeng = data.listdata;
            break;
        }
      });
    },
    formatPhoneNumber(phone) {
      if (!phone)
        return "";
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.initTime($data.Created)),
    b: common_vendor.f($data.yideng, (item, k0, i0) => {
      return {
        a: common_vendor.t($options.formatPhoneNumber(item.phone))
      };
    }),
    c: common_vendor.f($data.erdeng, (item, k0, i0) => {
      return {
        a: common_vendor.t($options.formatPhoneNumber(item.phone))
      };
    }),
    d: common_vendor.f($data.sandeng, (item, k0, i0) => {
      return {
        a: common_vendor.t($options.formatPhoneNumber(item.phone))
      };
    }),
    e: common_vendor.o((...args) => $options.goTofreeGroceryShopping && $options.goTofreeGroceryShopping(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/jackpot/jackpot.js.map
