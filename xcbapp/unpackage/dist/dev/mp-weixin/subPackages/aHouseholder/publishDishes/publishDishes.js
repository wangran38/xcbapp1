"use strict";
const common_vendor = require("../../../common/vendor.js");
const hooks_useUpload = require("../../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      dish: {
        name: "",
        price: 0,
        imagesList: []
      }
    };
  },
  methods: {
    deleteItem(index) {
      common_vendor.index.showModal({
        content: "是否删除照片",
        complete: (res) => {
          common_vendor.index.__f__("log", "at subPackages/aHouseholder/publishDishes/publishDishes.vue:44", res);
          if (res.confirm) {
            this.dish.imagesList.splice(index, 1);
          }
        }
      });
    },
    handleSubmit() {
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/publishDishes/publishDishes.vue:53", "提交的菜品信息：", this.dish);
    },
    commitAvater() {
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
              this.dish.imagesList.push(obj.data.url);
            });
          }
        }
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
  return {
    a: $data.dish.name,
    b: common_vendor.o(($event) => $data.dish.name = $event.detail.value),
    c: common_vendor.f($data.dish.imagesList, (item, index, i0) => {
      return {
        a: item,
        b: item + index,
        c: common_vendor.o(($event) => $options.deleteItem(index), item + index)
      };
    }),
    d: common_vendor.o($options.commitAvater),
    e: common_vendor.p({
      type: "plusempty",
      size: "50"
    }),
    f: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fa7cfa4d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/publishDishes/publishDishes.js.map
