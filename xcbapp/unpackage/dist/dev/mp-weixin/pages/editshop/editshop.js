"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_useUpload = require("../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      marketList: [],
      pickerRange1: [],
      selectedCategoryIndex1: 0,
      isImageSelected: false,
      // 用于标记是否选择了摊主图片
      isImageSelected2: false,
      // 用于标记是否选择了营业执照图片
      facelogo: "",
      // 摊主图片
      isSubmitting: false,
      businesslogo: ""
      // 营业执照
    };
  },
  mounted() {
    this.fetchMarketList();
  },
  methods: {
    // 返回上一页
    async customizeBack() {
      let canNavBack = await getCurrentPages();
      common_vendor.index.__f__("log", "at pages/editshop/editshop.vue:56", canNavBack);
      if (canNavBack && canNavBack.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        history.back();
      }
    },
    onMarketChange(e) {
      this.selectedCategoryIndex1 = e.detail.value;
    },
    // 获取摊位列表
    async fetchMarketList() {
      try {
        const params = {
          limit: 100,
          // 设置你需要的 limit
          page: 1
          // 设置你需要的 page
        };
        const res = await api_index.api.getMyShops({
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
          common_vendor.index.__f__("error", "at pages/editshop/editshop.vue:87", "Failed to fetch market list:", res.msg);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/editshop/editshop.vue:90", "Error fetching market list:", error);
      }
    },
    bindCategoryChange(e) {
      const selectedIndex = e.detail.value;
      this.selectedCategory = this.categoryList[selectedIndex];
      this.category_id = this.categoryIdMap[this.selectedCategory];
    },
    // 摊位图片上传
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed", "original"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 0) {
            const {
              upload,
              request
            } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              tempFilePaths: tempFilePaths[0],
              file: res.tempFiles[0]
            });
            upload().then((res2) => {
              var obj = JSON.parse(res2);
              this.facelogo = api_index.UPLOAD_URL + obj.data.path;
              this.isImageSelected = true;
            });
          }
        }
      });
    },
    // 营业执照图片上传
    chooseImage2() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed", "original"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 0) {
            const {
              upload,
              request
            } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              tempFilePaths: tempFilePaths[0],
              file: res.tempFiles[0]
            });
            upload().then((res2) => {
              var obj = JSON.parse(res2);
              this.businesslogo = api_index.UPLOAD_URL + obj.data.path;
              this.isImageSelected2 = true;
            });
          }
        }
      });
    },
    // 提交
    async submitForm() {
      if (this.isSubmitting)
        return;
      if (!this.facelogo || !this.businesslogo || !this.marketList[this.selectedCategoryIndex1]) {
        common_vendor.index.showToast({
          title: "请填写完整的信息",
          icon: "none"
        });
        return;
      }
      this.isSubmitting = true;
      try {
        const formData = {
          facelogo: this.facelogo,
          // 取第一个上传的图片作为logo
          id: this.marketList[this.selectedCategoryIndex1].id,
          businesslogo: this.businesslogo
        };
        const response = await api_index.api.editshop(formData);
        if (response.code === 200) {
          common_vendor.index.showToast({
            title: "补充成功",
            icon: "success",
            duration: 2e3
          });
          setTimeout(() => {
            this.customizeBack();
          }, 2e3);
        } else {
          common_vendor.index.showToast({
            title: response.msg || "提交失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/editshop/editshop.vue:202", "提交失败:", error);
        common_vendor.index.showToast({
          title: "提交失败",
          icon: "none"
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.pickerRange1[$data.selectedCategoryIndex1]),
    b: $data.pickerRange1,
    c: $data.selectedCategoryIndex1,
    d: common_vendor.o((...args) => $options.onMarketChange && $options.onMarketChange(...args)),
    e: common_vendor.t($data.isImageSelected ? "已选择" : "选择图片"),
    f: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    g: common_vendor.t($data.isImageSelected2 ? "已选择" : "选择图片"),
    h: common_vendor.o((...args) => $options.chooseImage2 && $options.chooseImage2(...args)),
    i: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    j: $data.isSubmitting
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/editshop/editshop.js.map
