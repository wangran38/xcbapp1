"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const mButtonVue = () => "../../../components/public/mButton/mButton.js";
const fegionSelectionVue = () => "../../../components/fegionSelection/fegionSelection.js";
const _sfc_main = {
  components: {
    mButtonVue,
    fegionSelectionVue
  },
  mixins: [utils_public.myMixin],
  data() {
    return {
      distances: [
        { label: "离我最近", value: "" },
        { label: "离我最远", value: "" }
      ],
      categories: [
        { label: "菜品最多", value: "" },
        { label: "菜品最少", value: "" }
      ],
      selectedCategoryIndex: 0,
      searchKey: "",
      isRefreshing: false,
      farmers: [],
      formdata: {
        page: 1,
        limit: 100,
        farmersname: null
      },
      isSearch: false
    };
  },
  onLoad() {
    let res = common_vendor.index.getStorageSync("userlocation");
    if (res) {
      let { longitude, latitude } = JSON.parse(res);
      this.formdata.lat = latitude;
      this.formdata.lng = longitude;
    }
    this.getData();
  },
  methods: {
    goToRouter(url) {
      common_vendor.index.navigateTo({ url });
    },
    intiQuery() {
      this.formdata = {
        page: 1,
        limit: 100,
        farmersname: null
      };
    },
    startSearch(value) {
      this.formdata.farmersname = value;
      this.farmers = [];
      this.getData();
    },
    stopSearch() {
      this.farmers = [];
      this.intiQuery();
      this.getData();
    },
    async getData() {
      let data = await api_index.api.farmersList(this.formdata);
      if (data.code == 200) {
        this.farmers = [...this.farmers, ...data.data.listdata];
      }
    },
    handleContact(farmer) {
      common_vendor.index.makePhoneCall({ phoneNumber: farmer.phone });
    },
    navigateToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/merchantDetails/merchantDetails?query=${JSON.stringify(item)}`
      });
    }
  }
};
if (!Array) {
  const _component_mButtonVue = common_vendor.resolveComponent("mButtonVue");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_fegionSelectionVue = common_vendor.resolveComponent("fegionSelectionVue");
  (_component_mButtonVue + _easycom_uni_icons2 + _component_fegionSelectionVue)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.startSearch),
    b: common_vendor.o($options.stopSearch),
    c: common_vendor.p({
      isShowbutton2: true,
      placeholder: "搜索农户姓名或地址"
    }),
    d: common_vendor.p({
      type: "tags",
      size: "16",
      color: "#3A7AFE"
    }),
    e: common_vendor.t($data.categories[$data.selectedCategoryIndex].label),
    f: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#3A7AFE"
    }),
    g: common_vendor.o((...args) => _ctx.categoryChange && _ctx.categoryChange(...args)),
    h: $data.categories,
    i: common_vendor.p({
      type: "location",
      size: "16",
      color: "#3A7AFE"
    }),
    j: common_vendor.t($data.distances[$data.selectedCategoryIndex].label),
    k: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#3A7AFE"
    }),
    l: $data.distances,
    m: common_vendor.p({
      type: "map",
      size: "16",
      color: "#fff"
    }),
    n: common_vendor.o(($event) => $options.goToRouter("/subPackages/shoppingPageList/statisticsMap/statisticsMap")),
    o: common_vendor.f($data.farmers, (farmer, index, i0) => {
      return {
        a: common_vendor.t(farmer.name),
        b: "5bacca68-7-" + i0,
        c: common_vendor.t(farmer.address),
        d: common_vendor.t(farmer.farmersname),
        e: common_vendor.t(farmer.area_name),
        f: common_vendor.t(_ctx.initDate(farmer.createtime)),
        g: common_vendor.t(farmer.category_name),
        h: common_vendor.t(farmer.distance.toFixed(1) || ""),
        i: farmer.logo || "https://b0.bdstatic.com/0df6c8c7f109aa7b67e7cb15e6f8d025.jpg@h_1280",
        j: "5bacca68-8-" + i0,
        k: common_vendor.o(($event) => $options.navigateToDetail(farmer), farmer.id),
        l: farmer.id
      };
    }),
    p: common_vendor.p({
      type: "location",
      size: "16",
      color: "#888"
    }),
    q: common_vendor.p({
      type: "paperplane",
      size: "17",
      color: "#3A7AFE"
    }),
    r: $data.farmers.length === 0
  }, $data.farmers.length === 0 ? {
    s: common_vendor.p({
      type: "folder",
      size: "80",
      color: "#dcdcdc"
    })
  } : {}, {
    t: $data.isRefreshing
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5bacca68"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers.js.map
