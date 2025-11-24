"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const hooks_useUpload = require("../../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      formData: {},
      pickerRange: [],
      selectedCategoryIndex: 0,
      currentItem: {}
    };
  },
  mixins: [utils_public.myMixin],
  methods: {
    uploadcuisine() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 0) {
            common_vendor.index.__f__("log", "at subPackages/aHouseholder/modifyPreSoldDishes/modifyPreSoldDishes.vue:69", 66676, res.tempFiles[0]);
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
    onCategoryChange(e) {
      this.selectedCategoryIndex = e.detail.value;
      this.currentItem.category_id = this.categories[this.selectedCategoryIndex].id;
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
          common_vendor.index.__f__("log", "at subPackages/aHouseholder/modifyPreSoldDishes/modifyPreSoldDishes.vue:117", this.pickerRange);
        }
      });
    },
    submit() {
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/modifyPreSoldDishes/modifyPreSoldDishes.vue:122", this.currentItem);
      common_vendor.index.showToast({
        icon: "loading",
        title: "正在修改...."
      });
      setTimeout(() => {
        api_index.api.updateDish({
          id: this.currentItem.id,
          goodsname: this.currentItem.goodsname,
          imglogo: this.currentItem.imglogo,
          category_id: this.currentItem.category_id
        }).then((data) => {
          if (data.code == 200) {
            this.customizeBack();
          }
        });
      }, 2e3);
    }
  },
  onLoad({
    pramas
  }) {
    if (pramas) {
      this.currentItem = JSON.parse(pramas);
    }
    this.fetchCategories();
    this.selectedCategoryIndex = this.currentItem.category_id - 1;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.currentItem.goodsname,
    b: common_vendor.o(($event) => $data.currentItem.goodsname = $event.detail.value),
    c: common_vendor.t($data.pickerRange[$data.selectedCategoryIndex]),
    d: $data.pickerRange,
    e: $data.selectedCategoryIndex,
    f: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    g: $data.currentItem.imglogo,
    h: common_vendor.o((...args) => $options.uploadcuisine && $options.uploadcuisine(...args)),
    i: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/modifyPreSoldDishes/modifyPreSoldDishes.js.map
