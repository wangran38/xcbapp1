"use strict";
const common_vendor = require("../../common/vendor.js");
const store_cart = require("../../store/cart.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const utils_public = require("../../utils/public.js");
const shopItem = () => "../../components/shop-item/shop-item.js";
const menuBarVue = () => "../../components/menuBar.js";
const inputBoxVue = () => "../../components/inputBox.js";
const mButtonVue = () => "../../components/public/mButton/mButton.js";
const _sfc_main = {
  data() {
    return {
      shopDetails: {},
      shop_id: "",
      urls1: [],
      urls2: [],
      pageData: [],
      isLogin: true,
      commodity_name: ""
    };
  },
  mixins: [hooks_usePage.usePage, utils_public.myMixin],
  components: { shopItem, menuBarVue, inputBoxVue, mButtonVue },
  setup() {
    const cartStore = store_cart.useCartStore();
    return { cartStore };
  },
  onLoad(query) {
    this.shop_id = Number(query.id);
  },
  onShow() {
    this.isLogin = !!common_vendor.index.getStorageSync("token");
    this.loadPageData();
  },
  methods: {
    complaint() {
      common_vendor.index.navigateTo({
        url: `/pages/merchantComplaints/merchantComplaints?id=${this.shopDetails.id}&title=${this.shopDetails.title}`
      });
    },
    Keyboard(item) {
      this.$refs.inputBoxVueRef.show = true;
      this.$refs.inputBoxVueRef.cartItem = item;
    },
    closeTan() {
      var _a;
      if ((_a = this.$refs.shopitem) == null ? void 0 : _a.showCartLayer1)
        this.$refs.shopitem.showCartLayer1 = false;
    },
    openAvater1() {
      if (this.urls1.length) {
        common_vendor.index.previewImage({ urls: this.urls1 });
      } else {
        common_vendor.index.showToast({ title: "暂无摊主照片", icon: "none" });
      }
    },
    openAvater2() {
      if (this.urls2.length) {
        common_vendor.index.previewImage({ urls: this.urls2 });
      } else {
        common_vendor.index.showToast({ title: "暂无营业执照", icon: "none" });
      }
    },
    async loadShopDetails() {
      try {
        const res = await api_index.api.shopDetail(this.shop_id);
        this.shopDetails = res.data.listdata[0] || {};
        this.urls1 = this.shopDetails.facelogo ? [this.shopDetails.facelogo] : [];
        this.urls2 = this.shopDetails.businesslogo ? [this.shopDetails.businesslogo] : [];
      } catch (e) {
        common_vendor.index.showToast({ title: "店铺信息加载失败", icon: "none" });
      }
    },
    async fetchData(params) {
      if (!this.shopDetails.title)
        await this.loadShopDetails();
      const res = await api_index.api.getmarketCommdityList({ ...params, shop_id: this.shop_id });
      const title = this.shopDetails.title || "";
      res.data.listdata = res.data.listdata.map((item) => ({ ...item, shopTitle: title }));
      return res.data;
    },
    async searchCommodity(value) {
      this.commodity_name = value;
      this.pageData = [];
      const res = await this.fetchData({ commodity_name: value, page: 1, limit: 100 });
      this.pageData = res.listdata;
      this.hasMore = false;
    },
    async cancelSearch() {
      this.commodity_name = "";
      this.pageData = [];
      this.hasMore = true;
      const res = await this.fetchData({ page: 1, limit: 10 });
      this.pageData = res.listdata;
    }
  }
};
if (!Array) {
  const _component_inputBoxVue = common_vendor.resolveComponent("inputBoxVue");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_mButtonVue = common_vendor.resolveComponent("mButtonVue");
  const _component_menuBarVue = common_vendor.resolveComponent("menuBarVue");
  const _component_shopItem = common_vendor.resolveComponent("shopItem");
  (_component_inputBoxVue + _easycom_uni_icons2 + _component_mButtonVue + _component_menuBarVue + _component_shopItem)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("inputBoxVueRef", "a7f2603d-0"),
    b: $data.shopDetails.logo || "https://picsum.photos/800/400?random=farm",
    c: $data.shopDetails.logo,
    d: common_vendor.t($data.shopDetails.title || "摊位名称"),
    e: common_vendor.p({
      type: "compose",
      size: "20",
      color: "#fff"
    }),
    f: common_vendor.o((...args) => $options.complaint && $options.complaint(...args)),
    g: common_vendor.p({
      type: "person-filled",
      size: "24",
      color: "#4a90e2"
    }),
    h: common_vendor.t($data.shopDetails.contactpeople),
    i: common_vendor.p({
      type: "phone-filled",
      size: "24",
      color: "#4a90e2"
    }),
    j: common_vendor.t($data.isLogin ? $data.shopDetails.contactphone : _ctx.hidePhone($data.shopDetails.contactphone)),
    k: common_vendor.p({
      type: "calendar-filled",
      size: "24",
      color: "#4a90e2"
    }),
    l: common_vendor.p({
      type: "map-filled",
      size: "24",
      color: "#4a90e2"
    }),
    m: common_vendor.o((...args) => $options.openAvater2 && $options.openAvater2(...args)),
    n: common_vendor.p({
      type: "camera-filled",
      size: "24",
      color: "#4a90e2"
    }),
    o: common_vendor.o((...args) => $options.openAvater1 && $options.openAvater1(...args)),
    p: common_vendor.p({
      type: "location-filled",
      size: "24",
      color: "#4a90e2"
    }),
    q: common_vendor.t($data.shopDetails.market_address || "菜市场内"),
    r: common_vendor.o($options.searchCommodity),
    s: common_vendor.o($options.cancelSearch),
    t: common_vendor.p({
      isShowbutton2: true,
      placeholder: "搜索菜品名称"
    }),
    v: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: common_vendor.o($options.Keyboard, item.id),
        b: "a7f2603d-9-" + i0,
        c: common_vendor.p({
          item
        }),
        d: item.id
      };
    }),
    w: $data.pageData.length === 0
  }, $data.pageData.length === 0 ? {
    x: common_vendor.p({
      type: "empty",
      size: "80",
      color: "#FF9800"
    })
  } : {}, {
    y: common_vendor.sr("shopitem", "a7f2603d-11"),
    z: common_vendor.p({
      shop_id: $data.shop_id
    }),
    A: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    B: common_vendor.o((...args) => $options.closeTan && $options.closeTan(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a7f2603d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ShopDetails/ShopDetails.js.map
