"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_usePage = require("../../hooks/usePage.js");
const hooks_useUpload = require("../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      pageData: [],
      shopList: [],
      // 用于存储摊位列表数据
      // marketList: [], // 用于存储市场列表数据
      imageUploaded: false,
      showEditPopup: false,
      currentShopTitle: "",
      currentShopLogo: "",
      isloaded: false
    };
  },
  mixins: [hooks_usePage.usePage],
  onLoad() {
    this.isloaded = true;
  },
  created() {
    this.reloadData();
  },
  methods: {
    async deleteShop(item) {
      let res = await api_index.api.editshop({
        id: item.id,
        isshow: 2
      });
      if (res.code == 200) {
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
        this.reloadData();
      }
    },
    // 获取摊位列表
    async fetchData(params) {
      try {
        const response = await api_index.api.getMyShops({
          ...params
        });
        return response.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/stalllist/stalllist.vue:110", "获取摊位列表失败", error);
        common_vendor.index.showToast({
          title: "获取摊位列表失败",
          icon: "none"
        });
      }
    },
    // 编辑
    editShop(item) {
      this.currentShopId = item.id;
      this.currentShopTitle = item.title;
      this.currentShopLogo = item.logo;
      this.showEditPopup = true;
    },
    closePopup() {
      this.showEditPopup = false;
    },
    //确认事件
    async confirmEdit(data) {
      if (!this.currentShopTitle) {
        common_vendor.index.showToast({
          title: "请输入摊位名称",
          icon: "none"
        });
        return;
      }
      if (!this.imageUploaded && !this.currentShopLogo) {
        common_vendor.index.showToast({
          title: "请上传图片",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.__f__("log", "at pages/stalllist/stalllist.vue:152", "Calling editshop API");
        const response = await api_index.api.editshop({
          id: this.currentShopId,
          title: this.currentShopTitle,
          logo: this.currentShopLogo
        });
        if (response.code === 200) {
          common_vendor.index.showToast({
            title: "摊位信息修改成功",
            icon: "success"
          });
          this.reloadData();
          this.closePopup();
        } else {
          common_vendor.index.showToast({
            title: response.msg || "摊位信息修改失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "修改失败，请稍后重试",
          icon: "none"
        });
      }
    },
    // 上传图片
    uploadcuisine() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 0) {
            const {
              upload,
              request
            } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              file: res.tempFiles[0],
              tempFilePaths: tempFilePaths[0]
            });
            upload().then((res2) => {
              res2 = JSON.parse(res2);
              this.currentShopLogo = res2.data.url;
              common_vendor.index.__f__("log", "at pages/stalllist/stalllist.vue:203", "更新后的图片路径:", this.currentShopLogo);
              this.isImageSelected = true;
              this.imageUploaded = true;
            });
          }
        }
      });
    },
    gotostaldis(itemId) {
      common_vendor.index.navigateTo({
        url: `/pages/Stalls-dishes/Stalls-dishes?id=${itemId}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.pageData, (item, k0, i0) => {
      return common_vendor.e($data.isloaded ? {
        a: item.logo
      } : {}, {
        b: common_vendor.o(($event) => $options.gotostaldis(item.id), item.id),
        c: common_vendor.t(item.market_name),
        d: common_vendor.t(item.title),
        e: common_vendor.t(item.id),
        f: common_vendor.o(($event) => $options.gotostaldis(item.id), item.id),
        g: common_vendor.o(($event) => $options.editShop(item), item.id),
        h: common_vendor.o(($event) => $options.deleteShop(item), item.id),
        i: item.id
      });
    }),
    b: $data.isloaded,
    c: _ctx.pageLoading
  }, _ctx.pageLoading ? {} : {}, {
    d: !_ctx.hasMore
  }, !_ctx.hasMore ? {} : {}, {
    e: common_vendor.o((...args) => _ctx.handleScrollToLower && _ctx.handleScrollToLower(...args)),
    f: $data.showEditPopup
  }, $data.showEditPopup ? {
    g: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    h: $data.currentShopTitle,
    i: common_vendor.o(($event) => $data.currentShopTitle = $event.detail.value),
    j: $data.currentShopLogo,
    k: common_vendor.o((...args) => $options.uploadcuisine && $options.uploadcuisine(...args)),
    l: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    m: common_vendor.o((...args) => $options.confirmEdit && $options.confirmEdit(...args)),
    n: common_vendor.o(() => {
    }),
    o: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/stalllist/stalllist.js.map
