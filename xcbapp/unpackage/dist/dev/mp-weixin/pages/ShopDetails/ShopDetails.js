"use strict";
const common_vendor = require("../../common/vendor.js");
const store_cart = require("../../store/cart.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const utils_public = require("../../utils/public.js");
const shopItem = () => "../../components/shop-item/shop-item.js";
const menuBarVue = () => "../../components/menuBar.js";
const inputBoxVue = () => "../../components/inputBox.js";
const _sfc_main = {
  data() {
    return {
      // 修改点 2: 移除 Vuex 映射的状态，直接从 Store 访问
      // cart: [], // 不再需要
      // totalPrice: 0, // 如果需要，可从 Pinia Getter 获取
      showCartLayer: false,
      // cartItems: [], // 不再需要，直接使用 cartStore.carts
      pageData: [],
      shopDetails: {},
      shop_id: "",
      urls1: [],
      // 摊主照片
      urls2: [],
      // 营业执照图片
      cart: false,
      // 购物车初始化弹窗,锁
      show: false,
      isLogin: true,
      showSearch: false,
      commodity_name: "",
      // 模糊查询菜品名称
      showDetail: false,
      detailHeidht: 0,
      animationData: {}
    };
  },
  mixins: [hooks_usePage.usePage, utils_public.myMixin],
  components: {
    shopItem,
    menuBarVue,
    inputBoxVue
  },
  // 修改点 3: 使用 setup() 函数获取 Pinia Store 实例
  setup() {
    const cartStore = store_cart.useCartStore();
    return {
      cartStore
    };
  },
  // 修改点 4: 移除 Vuex 的 computed 映射
  // computed: {
  // 	...mapState('cart', ['carts']),
  // 	...mapGetters('cart', ['getTempCount']),
  // },
  onShow() {
    const token = common_vendor.index.getStorageSync("token");
    if (!token) {
      this.isLogin = false;
    }
    this.loadPageData();
  },
  onLoad(query) {
    this.shop_id = Number(query.id);
  },
  methods: {
    // 展开详情
    expandDetails() {
      this.showDetail = !this.showDetail;
      if (this.showDetail) {
        var animation = common_vendor.index.createAnimation({
          duration: 2e3,
          transformOrigin: "50% 50%",
          timingFunction: "ease"
        });
        this.animation = animation;
        animation.height(230).step();
        this.animationData = animation.export();
      } else {
        var animation = common_vendor.index.createAnimation({
          duration: 2e3,
          transformOrigin: "50% 50%",
          timingFunction: "ease"
        });
        this.animation = animation;
        animation.height(0).step();
        this.animationData = animation.export();
      }
    },
    // 取消搜索
    async cancelSearch() {
      this.commodity_name = null;
      this.pageData = [];
      this.showSearch = false;
      const res = await this.fetchData({
        page: 1,
        limit: 10,
        isshow: 1
      });
      this.pageData = res.listdata;
      this.hasMore = true;
    },
    // 搜索菜品
    async searchCommodity() {
      this.pageData = [];
      let res = await this.fetchData({
        commodity_name: this.commodity_name,
        page: 1,
        limit: 100
      });
      this.pageData = res.listdata;
      this.hasMore = false;
    },
    complaint() {
      common_vendor.index.navigateTo({
        url: `/pages/merchantComplaints/merchantComplaints?id=${this.shopDetails.id}&title=${this.shopDetails.title}`
      });
    },
    // 需要调起数字键盘
    Keyboard(value) {
      this.$refs.inputBoxVueRef.show = true;
      this.$refs.inputBoxVueRef.cartItem = value;
    },
    // 收起购物车
    closeTan() {
      if (this.$refs.shopitem.showCartLayer1) {
        this.$refs.shopitem.showCartLayer1 = false;
      }
    },
    // 查看摊主照片
    openAvater1() {
      if (this.urls1[0] && this.urls1[0].length > 1) {
        common_vendor.index.previewImage({
          count: 1,
          urls: this.urls1,
          sizeType: ["original", "compressed"],
          success: (res) => {
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "暂无图片",
          icon: "error"
        });
      }
    },
    // 查看营业执照
    openAvater2() {
      if (this.urls2[0] && this.urls2[0].length > 1) {
        common_vendor.index.previewImage({
          count: 1,
          urls: this.urls2,
          sizeType: ["original", "compressed"],
          success: (res) => {
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "暂无图片",
          icon: "error"
        });
      }
    },
    // 修改点 6: 移除 Vuex 的 mutations 映射
    // ...mapMutations('cart', ['addItem', 'subItem']),
    // 首次加载，初始化
    async loadShopDetails() {
      try {
        const response = await api_index.api.shopDetail(this.shop_id);
        this.shopDetails = response.data.listdata[0];
        if (this.shopDetails.facelogo)
          this.urls1.push(this.shopDetails.facelogo);
        if (this.shopDetails.businesslogo)
          this.urls2.push(this.shopDetails.businesslogo);
        return response;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ShopDetails/ShopDetails.vue:262", "获取摊主详情失败", error);
        common_vendor.index.showToast({
          title: "获取摊主详情失败",
          icon: "none"
        });
        return { data: { listdata: [{}] } };
      }
    },
    async fetchData(params) {
      const res = await this.loadShopDetails();
      const { title } = res.data.listdata[0] || {};
      params = {
        ...params,
        shop_id: this.shop_id || null
      };
      const response = await api_index.api.getmarketCommdityList({
        ...params
        // isshow: 1,
      });
      response.data.listdata = response.data.listdata.map((e) => {
        return {
          ...e,
          shopTitle: title
        };
      });
      return response.data;
    },
    goTorules() {
      common_vendor.index.navigateTo({
        url: "/pages/rules/rules"
      });
    }
  }
};
if (!Array) {
  const _component_inputBoxVue = common_vendor.resolveComponent("inputBoxVue");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _component_shopItem = common_vendor.resolveComponent("shopItem");
  (_component_inputBoxVue + _easycom_uni_icons2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_collapse_item2 + _easycom_uni_collapse2 + _easycom_uni_easyinput2 + _component_shopItem)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_collapse_item + _easycom_uni_collapse + _easycom_uni_easyinput)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("inputBoxVueRef", "6052e13c-0"),
    b: common_vendor.t($data.shopDetails.title),
    c: $data.shopDetails.logo,
    d: common_vendor.p({
      type: "compose",
      size: "18",
      color: "#fff"
    }),
    e: common_vendor.o((...args) => $options.complaint && $options.complaint(...args)),
    f: common_vendor.p({
      title: "摊主名称",
      ["show-extra-icon"]: true,
      ["extra-icon"]: {
        color: "#007aff",
        size: "24",
        type: "person-filled"
      },
      ["right-text"]: $data.shopDetails.contactpeople
    }),
    g: common_vendor.p({
      title: "电话",
      ["show-extra-icon"]: true,
      ["extra-icon"]: {
        color: "#007aff",
        size: "24",
        type: "phone-filled"
      },
      ["right-text"]: $data.isLogin ? $data.shopDetails.contactphone : _ctx.hidePhone($data.shopDetails.contactphone)
    }),
    h: common_vendor.p({
      title: "营业时间",
      ["show-extra-icon"]: true,
      ["extra-icon"]: {
        color: "#007aff",
        size: "24",
        type: "calendar-filled"
      },
      ["right-text"]: "6:00-21:00"
    }),
    i: common_vendor.o($options.openAvater2),
    j: common_vendor.p({
      title: "营业执照",
      ["show-extra-icon"]: true,
      ["extra-icon"]: {
        color: "#007aff",
        size: "24",
        type: "map-filled"
      },
      ["right-text"]: "点击查看摊位营业执照"
    }),
    k: common_vendor.p({
      title: "地址",
      ["show-extra-icon"]: true,
      ["extra-icon"]: {
        color: "#007aff",
        size: "24",
        type: "location-filled"
      },
      ["right-text"]: $data.shopDetails.market_address ? $data.shopDetails.market_address : ""
    }),
    l: common_vendor.p({
      title: "基本信息",
      ["title-style"]: {
        fontSize: "26rpx",
        color: "#333",
        fontWeight: 600,
        padding: "10rpx 0"
      }
    }),
    m: common_vendor.p({
      border: "true"
    }),
    n: common_vendor.o(($event) => $data.commodity_name = $event),
    o: common_vendor.p({
      type: "text",
      ["adjust-position"]: true,
      placeholder: "请输入菜品名称",
      clearable: false,
      ["placeholder-style"]: "{ color: '#999', fontSize: '24rpx' }",
      modelValue: $data.commodity_name
    }),
    p: common_vendor.o((...args) => $options.searchCommodity && $options.searchCommodity(...args)),
    q: common_vendor.o((...args) => $options.cancelSearch && $options.cancelSearch(...args)),
    r: common_vendor.f($data.pageData, (item, k0, i0) => {
      return {
        a: item.id
      };
    }),
    s: $data.pageData.length === 0
  }, $data.pageData.length === 0 ? {
    t: common_vendor.p({
      type: "empty",
      size: "40",
      color: "#999"
    })
  } : {}, {
    v: common_vendor.sr("shopitem", "6052e13c-12"),
    w: common_vendor.p({
      shop_id: $data.shop_id
    }),
    x: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    y: common_vendor.o((...args) => $options.closeTan && $options.closeTan(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ShopDetails/ShopDetails.js.map
