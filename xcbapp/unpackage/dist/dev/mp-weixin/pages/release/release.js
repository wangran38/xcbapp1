"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_useUpload = require("../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      Image: "",
      goodsname: "",
      category_id: "",
      // price: '',
      imageUploaded: false,
      // 图片上传状态
      imglogo: "",
      // 存储图片地址
      categories: [],
      pickerRange: [],
      selectedCategoryIndex: 0
    };
  },
  onLoad() {
    this.fetchCategories();
  },
  methods: {
    // 返回上一页
    async customizeBack() {
      let canNavBack = await getCurrentPages();
      if (canNavBack && canNavBack.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        history.back();
      }
    },
    // 请求菜品分类数据
    fetchCategories() {
      api_index.api.cglist().then((res) => {
        if (res.code === 200) {
          const categories = res.data.listdata.map((item) => ({
            id: item.id,
            content: item.content
          }));
          this.categories = categories;
          this.pickerRange = ["请选择分类", ...categories.map((category) => category.content)];
          if (categories.length > 0) {
            this.category_id = categories[0].id;
          }
        } else {
          common_vendor.index.showToast({
            title: res.message || "获取分类失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/release/release.vue:110", err);
        common_vendor.index.showToast({
          title: "获取分类失败",
          icon: "none"
        });
      });
    },
    // 上传菜品图片
    uploadcuisine() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed", "original"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePaths = res.tempFilePaths;
          common_vendor.index.__f__("log", "at pages/release/release.vue:126", res);
          if (tempFilePaths.length > 0) {
            const {
              upload,
              request
            } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              file: res.tempFiles[0],
              // 传输文件对象
              tempFilePaths: tempFilePaths[0]
              // 传输文件路径
            });
            upload().then((res2) => {
              var obj = JSON.parse(res2);
              this.imglogo = api_index.UPLOAD_URL + obj.data.path;
              this.isImageSelected = true;
              this.imageUploaded = true;
            });
          }
        }
      });
    },
    onCategoryChange(e) {
      const selectedIndex = e.detail.value;
      this.selectedCategoryIndex = selectedIndex;
      if (selectedIndex > 0) {
        this.category_id = this.categories[selectedIndex - 1].id;
      } else {
        this.category_id = "";
      }
    },
    submit() {
      common_vendor.index.__f__("log", "at pages/release/release.vue:174", this.goodsname, this.category_id);
      if (!this.goodsname || !this.category_id || !this.imglogo) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      api_index.api.addgoods({
        category_id: this.category_id,
        goodsname: this.goodsname,
        imglogo: this.imglogo
        // 直接传递图片地址
        // price: parseFloat(this.price)
      }).then((res) => {
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "菜品添加成功",
            icon: "success",
            duration: 1e3
          }).then(() => {
            setTimeout(() => {
              common_vendor.index.showModal({
                title: "是否继续添加菜品",
                cancelText: "否",
                confirmText: "是",
                success: (res2) => {
                  if (res2.confirm) {
                    common_vendor.index.__f__("log", "at pages/release/release.vue:203", "继续添加");
                  } else {
                    this.customizeBack();
                  }
                }
              });
            }, 1e3);
          });
          this.goodsname = "";
          this.imglogo = "";
          this.imageUploaded = false;
        } else {
          common_vendor.index.showToast({
            title: res.msg || "添加失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/release/release.vue:223", err);
        common_vendor.index.showToast({
          title: "添加失败",
          icon: "none"
        });
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
    a: $data.goodsname,
    b: common_vendor.o(($event) => $data.goodsname = $event.detail.value),
    c: common_vendor.p({
      type: "right",
      size: "14",
      color: "rgb(229, 229, 229)"
    }),
    d: common_vendor.t($data.pickerRange[$data.selectedCategoryIndex]),
    e: $data.pickerRange,
    f: $data.selectedCategoryIndex,
    g: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    h: common_vendor.p({
      type: "right",
      size: "14",
      color: "rgb(229, 229, 229)"
    }),
    i: !$data.imglogo
  }, !$data.imglogo ? {} : {
    j: $data.imglogo
  }, {
    k: common_vendor.p({
      type: "right",
      size: "14",
      color: "rgb(229, 229, 229)"
    }),
    l: common_vendor.o((...args) => $options.uploadcuisine && $options.uploadcuisine(...args)),
    m: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/release/release.js.map
