"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_useUpload = require("../../hooks/useUpload.js");
const utils_public = require("../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      selectedCategoryIndex: 0,
      pickerRange: [],
      isImageSelected: false,
      imglogo: null,
      setp: 1,
      isPaid: false,
      // formData: {
      // 	goodsname: null, // 菜品名称
      // 	goodstotal: null, // 菜品库存数量
      // 	ispresale: 1, //是否预卖
      // 	unit: null, // 菜品单位
      // 	imglogo: null, // 图片地址
      // 	sellbegintime: null, // 预卖开始时间戳
      // 	sellendtime: null, //  预卖结束时间戳
      // 	presaleprice: null, // 预卖价格
      // 	price: null // 市场价
      // },
      formData: {
        goodsname: null,
        // 菜品名称
        imglogo: null,
        // 图片地址
        category_id: null
      }
    };
  },
  computed: {
    BtnText() {
      return this.setp == 1 ? "下一步" : "提交";
    }
  },
  onLoad() {
    this.fetchCategories();
  },
  methods: {
    onCategoryChange(e) {
      const selectedIndex = e.detail.value;
      this.selectedCategoryIndex = selectedIndex;
      if (selectedIndex > 0) {
        this.formData.category_id = this.categories[selectedIndex - 1].id;
      } else {
        this.formData.category_id = "";
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
        common_vendor.index.__f__("error", "at pages/preSale/preSale.vue:330", err);
        common_vendor.index.showToast({
          title: "获取分类失败",
          icon: "none"
        });
      });
    },
    handleConfirm() {
      api_index.api.addPreSale(this.formData).then((data) => {
        common_vendor.index.__f__("log", "at pages/preSale/preSale.vue:340", data);
        if (data.code == 200) {
          common_vendor.index.showToast({
            icon: "success",
            title: "添加成功"
          });
          setTimeout(() => {
            this.customizeBack();
          }, 2e3);
        } else {
          common_vendor.index.showToast({
            icon: "error",
            title: data.msg
          });
        }
      });
    },
    // 图片上传
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
              this.formData.imglogo = api_index.UPLOAD_URL + obj.data.path;
              this.isImageSelected = true;
            });
          }
        }
      });
    },
    formatWeek(week) {
      const start = /* @__PURE__ */ new Date();
      start.setDate(start.getDate() + (week - 1) * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${this.formatDate(start)} 至 ${this.formatDate(end)}`;
    },
    formatDate(date) {
      return `${date.getMonth() + 1}-${date.getDate()}`;
    },
    async gotoSupplement() {
      this.setp++;
      if (this.setp > 2) {
        this.handleConfirm();
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_icons2 + _easycom_uni_easyinput2 + _easycom_uni_forms2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_easyinput + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.setp >= 1 ? 1 : "",
    b: $data.setp >= 2 ? 1 : "",
    c: common_vendor.p({
      type: "info",
      size: "20",
      color: "#2979FF"
    }),
    d: common_vendor.o(($event) => $data.formData.goodsname = $event),
    e: common_vendor.p({
      type: "text",
      placeholder: "请输入菜品名称",
      modelValue: $data.formData.goodsname
    }),
    f: common_vendor.t($data.pickerRange[$data.selectedCategoryIndex]),
    g: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#666"
    }),
    h: $data.pickerRange,
    i: $data.selectedCategoryIndex,
    j: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    k: common_vendor.p({
      type: "image",
      size: "18",
      color: "#2979FF"
    }),
    l: common_vendor.p({
      type: $data.isImageSelected ? "checkmarkempty" : "plusempty",
      size: "32",
      color: $data.isImageSelected ? "#67C23A" : "#C0C4CC"
    }),
    m: common_vendor.t($data.isImageSelected ? "上传成功" : "点击上传"),
    n: $data.isImageSelected ? 1 : "",
    o: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    p: common_vendor.sr("form", "fafd3590-1"),
    q: common_vendor.p({
      modelValue: $data.formData,
      ["label-position"]: "top"
    }),
    r: $data.setp == 1,
    s: $data.setp == 2,
    t: common_vendor.t($options.BtnText),
    v: common_vendor.o((...args) => $options.gotoSupplement && $options.gotoSupplement(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/preSale/preSale.js.map
