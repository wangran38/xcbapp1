"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      distances: [
        {
          label: "离我最近",
          value: ""
        },
        {
          label: "离我最远",
          value: ""
        }
      ],
      categories: [
        {
          label: "菜品最多",
          value: ""
        },
        {
          label: "菜品最少",
          value: ""
        }
      ],
      selectedCategoryIndex: 0,
      searchKey: "",
      isRefreshing: false,
      farmers: [],
      formdata: {
        page: 1,
        limit: 100,
        farmersname: null
        // 农户名称模糊查询
      },
      isSearch: false
      // 是否在搜索状态
    };
  },
  async onLoad() {
    let res = common_vendor.index.getStorageSync("userlocation");
    if (res) {
      let {
        longitude,
        latitude
      } = JSON.parse(res);
      this.formdata.lat = latitude;
      this.formdata.lng = longitude;
    }
    this.getData();
  },
  computed: {},
  methods: {
    goToRouter(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    intiQuery() {
      this.formdata = {
        page: 1,
        limit: 100,
        farmersname: null
        // 农户名称模糊查询
      };
    },
    // 开始搜索
    startSearch() {
      this.farmers = [];
      this.getData();
    },
    // 结束搜索
    stopSearch() {
      this.farmers = [];
      this.intiQuery();
      this.getData();
    },
    async getData() {
      let data = await api_index.api.farmersList(this.formdata);
      if (data.code = 200) {
        this.farmers = [...this.farmers, ...data.data.listdata];
      }
      common_vendor.index.__f__("log", "at subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers.vue:203", this.farmers);
    },
    handleContact(farmer) {
      common_vendor.index.makePhoneCall({
        phoneNumber: farmer.phone
      });
    },
    navigateToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/merchantDetails/merchantDetails?query=${JSON.stringify(item)}`
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
      color: "#999999",
      size: "20",
      type: "search"
    }),
    b: $data.formdata.farmersname,
    c: common_vendor.o(($event) => $data.formdata.farmersname = $event.detail.value),
    d: common_vendor.o((...args) => $options.startSearch && $options.startSearch(...args)),
    e: common_vendor.o((...args) => $options.stopSearch && $options.stopSearch(...args)),
    f: common_vendor.p({
      type: "tags",
      size: "16",
      color: "#3a7afe"
    }),
    g: common_vendor.t($data.categories[$data.selectedCategoryIndex].label),
    h: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#3a7afe"
    }),
    i: common_vendor.o((...args) => _ctx.categoryChange && _ctx.categoryChange(...args)),
    j: $data.categories,
    k: common_vendor.p({
      type: "tags",
      size: "16",
      color: "#3a7afe"
    }),
    l: common_vendor.t($data.distances[$data.selectedCategoryIndex].label),
    m: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#3a7afe"
    }),
    n: $data.distances,
    o: common_vendor.o(($event) => $options.goToRouter("/subPackages/shoppingPageList/statisticsMap/statisticsMap")),
    p: common_vendor.f($data.farmers, (farmer, index, i0) => {
      return {
        a: common_vendor.t(farmer.name),
        b: "5bacca68-5-" + i0,
        c: common_vendor.t(farmer.address),
        d: common_vendor.t(farmer.farmersname),
        e: common_vendor.t(farmer.area_name),
        f: common_vendor.t(_ctx.initDate(farmer.createtime)),
        g: common_vendor.t(farmer.category_name),
        h: common_vendor.t(farmer.distance.toFixed(1) || ""),
        i: farmer.logo ? farmer.logo : "https://b0.bdstatic.com/0df6c8c7f109aa7b67e7cb15e6f8d025.jpg@h_1280",
        j: common_vendor.o(($event) => $options.navigateToDetail(farmer), farmer.id),
        k: farmer.id
      };
    }),
    q: common_vendor.p({
      type: "location",
      size: "16",
      color: "#666"
    }),
    r: common_vendor.t("5个"),
    s: $data.farmers.length === 0
  }, $data.farmers.length === 0 ? {} : {}, {
    t: $data.isRefreshing
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5bacca68"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers.js.map
