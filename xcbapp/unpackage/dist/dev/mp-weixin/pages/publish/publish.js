"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const hooks_useUpload = require("../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      pageData: [],
      showEditPopup: false,
      currentItem: {},
      categories: [],
      pickerRange: [],
      selectedCategoryIndex: 0,
      imageUploaded: false,
      // imglogo: '',
      showEditPopup1: false,
      showEditPopup2: false,
      pickerRange1: [],
      selectedCategoryIndex1: 0,
      itemDescription: "",
      // 上架时的详细说明
      itemPrice: "",
      // 上架时的价格
      marketList: [],
      // 存储摊位列表
      candidates: ["斤", "瓶", "桶", "个"],
      candidate2: ["元"],
      unit: "",
      unit2: "",
      tijiaoPrice: "",
      isloaded: false,
      iconStatus: true,
      isShowItems: false,
      tempItem: null
    };
  },
  mixins: [hooks_usePage.usePage],
  onLoad() {
    this.isloaded = true;
  },
  onShow() {
    this.reloadData();
  },
  methods: {
    operation(item) {
      this.showEditPopup2 = true;
      this.tempItem = item;
    },
    routerPush() {
      common_vendor.index.navigateTo({
        url: `/subPackages/aHouseholder/Traceability/Traceability?id=${this.tempItem.id}&goodsname=${this.tempItem.goodsname}`
      });
    },
    async removeItem() {
      let requestsData = {
        id: this.tempItem.id,
        isshow: 2
      };
      let res = await api_index.api.editgoods(requestsData);
      if (res.code == 200) {
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
        this.reloadData();
        this.closePopup();
      } else {
        common_vendor.index.showToast({
          title: "删除失败",
          icon: "error"
        });
      }
    },
    // 打开选择单位
    clicKexampleBody() {
      this.iconStatus = !this.iconStatus;
      this.isShowItems = !this.isShowItems;
    },
    // 选择单位
    selectItem(val) {
      this.unit = val;
      this.iconStatus = !this.iconStatus;
      this.isShowItems = !this.isShowItems;
    },
    fetchCategories() {
      api_index.api.cglist().then((res) => {
        if (res.code === 200) {
          const categories = res.data.listdata.map((item) => ({
            id: item.id,
            content: item.content
          }));
          this.categories = categories;
          this.pickerRange = [...categories.map((category) => category.content)];
        }
      });
    },
    async fetchMarketList() {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const params = {
          limit: 100,
          // 设置你需要的 limit
          page: 1
          // 设置你需要的 page
        };
        const res = await api_index.api.getMyShops({
          token: this.token,
          ...params
        });
        if (res.code === 200) {
          const marketList = res.data.listdata.map((item) => ({
            id: item.id,
            title: item.title
          }));
          this.marketList = marketList;
          this.pickerRange1 = [...marketList.map((market) => market.title)];
        } else {
          common_vendor.index.__f__("error", "at pages/publish/publish.vue:252", "Failed to fetch market list:", res.msg);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/publish/publish.vue:255", "Error fetching market list:", error);
      }
    },
    onCategoryChange(e) {
      this.selectedCategoryIndex = e.detail.value;
      this.currentItem.category_id = this.categories[this.selectedCategoryIndex].id;
    },
    onMarketChange(e) {
      this.selectedCategoryIndex1 = e.detail.value;
      this.currentItem.market_id = this.marketList[this.selectedCategoryIndex1].id;
    },
    async fetchData(params) {
      const response = await api_index.api.getCommdityList(params);
      return response.data;
    },
    // 你的方法
    goTorelePage() {
      common_vendor.index.navigateTo({
        url: "/pages/release/release"
      });
    },
    edit() {
      this.currentItem = {
        ...this.tempItem
      };
      this.fetchCategories();
      this.showEditPopup = true;
      this.fetchCommodityDetails(this.tempItem.id);
    },
    fetchCommodityDetails(id) {
      api_index.api.getCommodityDetails(id).then((res) => {
        if (res.code === 200) {
          const commodity = res.data.listdata[0];
          this.currentItem.goodsname = commodity.goodsname;
          this.currentItem.imglogo = commodity.imglogo;
          const categoryIndex = this.categories.findIndex((cat) => cat.id === commodity.category_id);
          if (categoryIndex !== -1) {
            this.selectedCategoryIndex = categoryIndex;
          }
        }
      });
    },
    uploadcuisine() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 0) {
            common_vendor.index.__f__("log", "at pages/publish/publish.vue:313", 66676, res.tempFiles[0]);
            const {
              upload,
              request
            } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              tempFilePaths: tempFilePaths[0],
              file: res.tempFiles[0]
            });
            upload().then((res2) => {
              res2 = JSON.parse(res2);
              this.currentItem.imglogo = res2.data.url;
            });
          }
        }
      });
    },
    shelves() {
      this.currentItem = {
        ...this.tempItem
      };
      common_vendor.index.__f__("log", "at pages/publish/publish.vue:349", this.currentItem);
      this.showEditPopup1 = true;
      this.fetchMarketList();
    },
    closePopup() {
      this.showEditPopup = false;
      this.showEditPopup1 = false;
      this.showEditPopup2 = false;
      this.itemPrice = "";
    },
    //确认事件
    confirmEdit() {
      if (!this.currentItem.id) {
        common_vendor.index.showToast({
          title: "商品 ID 不正确",
          icon: "none"
        });
        return;
      }
      if (!this.imageUploaded && !this.currentItem.imglogo) {
        common_vendor.index.showToast({
          title: "请上传图片",
          icon: "none"
        });
        return;
      }
      const {
        id,
        category_id,
        goodsname,
        imglogo
      } = this.currentItem;
      api_index.api.editGoods({
        id,
        category_id,
        goodsname,
        imglogo
      }).then((res) => {
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "商品修改成功",
            icon: "success"
          });
          this.reloadData();
          this.closePopup();
        } else {
          common_vendor.index.showToast({
            title: res.msg || "商品修改失败",
            icon: "none"
          });
        }
      });
    },
    confirmShelves() {
      common_vendor.index.__f__("log", "at pages/publish/publish.vue:411", "Goods ID:", this.currentItem.id);
      if (!this.itemPrice) {
        common_vendor.index.showToast({
          title: "请填写价格",
          icon: "none"
        });
        return;
      }
      if (!this.unit) {
        common_vendor.index.showToast({
          title: "请选择单位",
          icon: "none"
        });
        return;
      }
      api_index.api.addCommodityToShop({
        goods_id: this.currentItem.id,
        shop_id: this.marketList[this.selectedCategoryIndex1].id,
        content: this.itemDescription,
        price: parseFloat(this.itemPrice),
        weight_name: this.unit
      }).then((res) => {
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "上架成功"
          });
          this.closePopup();
          this.reloadData();
        } else {
          common_vendor.index.showToast({
            title: "上架失败",
            icon: "none"
          });
        }
      });
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
    a: common_vendor.f($data.pageData, (item, k0, i0) => {
      return common_vendor.e($data.isloaded ? {
        a: item.imglogo
      } : {}, {
        b: common_vendor.t(item.goodsname),
        c: common_vendor.o(($event) => $options.operation(item), item.id),
        d: item.id
      });
    }),
    b: $data.isloaded,
    c: _ctx.pageLoading
  }, _ctx.pageLoading ? {} : {}, {
    d: !_ctx.hasMore
  }, !_ctx.hasMore ? {} : {}, {
    e: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    f: common_vendor.o((...args) => $options.goTorelePage && $options.goTorelePage(...args)),
    g: $data.showEditPopup2
  }, $data.showEditPopup2 ? {
    h: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    i: common_vendor.o((...args) => $options.edit && $options.edit(...args)),
    j: common_vendor.o((...args) => $options.shelves && $options.shelves(...args)),
    k: common_vendor.o((...args) => $options.removeItem && $options.removeItem(...args)),
    l: common_vendor.o((...args) => $options.routerPush && $options.routerPush(...args)),
    m: common_vendor.o(() => {
    }),
    n: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args))
  } : {}, {
    o: $data.showEditPopup
  }, $data.showEditPopup ? {
    p: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    q: $data.currentItem.goodsname,
    r: common_vendor.o(($event) => $data.currentItem.goodsname = $event.detail.value),
    s: common_vendor.t($data.pickerRange[$data.selectedCategoryIndex]),
    t: $data.pickerRange,
    v: $data.selectedCategoryIndex,
    w: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    x: $data.currentItem.imglogo,
    y: common_vendor.o((...args) => $options.uploadcuisine && $options.uploadcuisine(...args)),
    z: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    A: common_vendor.o((...args) => $options.confirmEdit && $options.confirmEdit(...args)),
    B: common_vendor.o(() => {
    }),
    C: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args))
  } : {}, {
    D: $data.showEditPopup1
  }, $data.showEditPopup1 ? {
    E: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    F: common_vendor.t($data.currentItem.goodsname),
    G: common_vendor.t($data.pickerRange1[$data.selectedCategoryIndex1]),
    H: $data.pickerRange1,
    I: $data.selectedCategoryIndex1,
    J: common_vendor.o((...args) => $options.onMarketChange && $options.onMarketChange(...args)),
    K: $data.itemPrice,
    L: common_vendor.o(($event) => $data.itemPrice = $event.detail.value),
    M: common_vendor.t($data.unit ? $data.unit : "单位"),
    N: common_vendor.p({
      type: $data.iconStatus ? "up" : "down",
      size: "20"
    }),
    O: common_vendor.o((...args) => $options.clicKexampleBody && $options.clicKexampleBody(...args)),
    P: common_vendor.f($data.candidates, (pop, k0, i0) => {
      return {
        a: common_vendor.t(pop),
        b: common_vendor.o(($event) => $options.selectItem(pop))
      };
    }),
    Q: $data.isShowItems,
    R: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    S: common_vendor.o((...args) => $options.confirmShelves && $options.confirmShelves(...args)),
    T: common_vendor.o(() => {
    }),
    U: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
