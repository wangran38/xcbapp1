"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_public = require("../../utils/public.js");
const _sfc_main = {
  data() {
    return {
      selectedProduct: null,
      products: [],
      timelineData: [],
      activeIndex: -1,
      tempImage: "",
      tempText: "",
      currentDate: "",
      formData: {
        page: 1,
        limit: 30
      },
      fileList: [],
      viewImgAndVideo: null,
      openId: null
    };
  },
  mixins: [utils_public.myMixin],
  watch: {
    selectedProduct(newValue, oldValue) {
      this.lifeCycleData();
    }
  },
  async onLoad() {
    let data = await api_index.api.goodslist(this.formData);
    if (data.code == 200) {
      let items = data.data.listdata.map((item, index) => {
        let beginTime = item.sellbegintime;
        let endTime = item.sellendtime;
        let initBeginTime = `${common_vendor.dayjs(beginTime).$y}-${common_vendor.dayjs(beginTime).month() + 1}-${common_vendor.dayjs(beginTime).date()}`;
        let initEndTime = `${common_vendor.dayjs(endTime).$y}-${common_vendor.dayjs(endTime).month() + 1}-${common_vendor.dayjs(endTime).date()}`;
        const date1 = common_vendor.dayjs(initBeginTime);
        const date2 = common_vendor.dayjs(initEndTime);
        date2.diff(date1, "day");
        return {
          value: item.id,
          text: item.goodsname
        };
      });
      this.products = items;
      if (this.products) {
        this.selectedProduct = this.products[0].value;
        this.lifeCycleData();
      }
    }
  },
  methods: {
    viewImage(url) {
      common_vendor.index.__f__("log", "at pages/additionalinformation/additionalinformation.vue:179", url);
      common_vendor.index.previewImage({
        showmenu: false,
        urls: [url]
      });
    },
    // 删除预卖菜品的生命周期内容
    async removeItem() {
      let res = await api_index.api.delMoments({ id: this.openId });
      if (res.code == 200) {
        common_vendor.index.showToast({
          icon: "success",
          title: res.message || res.msg
        }).then((data) => {
          this.initPorp();
          this.lifeCycleData();
        });
      }
    },
    editPanelClosePopup() {
      this.initPorp();
    },
    viewPanelClosePopup() {
      this.initPorp();
    },
    // 获取生命周期数据 
    async lifeCycleData() {
      let data = await api_index.api.goodsinfoList({
        page: 1,
        limit: 100,
        farmersgoods_id: this.selectedProduct
      });
      data.data.listdata.forEach((item) => {
      });
      this.timelineData = data.data.listdata;
    },
    // 删除图片或视频
    handleDelete(index) {
      this.fileList.splice(index, 1);
    },
    addRecord() {
      this.$refs.editPanel.open();
    },
    generateTimeline() {
      if (!this.selectedProduct) {
        this.timelineData = [];
        return;
      }
      const product = this.products.find((p) => p.value === this.selectedProduct);
      this.timelineData = Array.from({
        length: product.days
      }, (_, i) => ({
        day: i + 1,
        date: common_vendor.dayjs(product.endDate).subtract(product.days - i - 1, "day").format("MM/DD"),
        fullDate: common_vendor.dayjs(product.endDate).subtract(product.days - i - 1, "day").format(
          "YYYY-MM-DD"
        ),
        image: "",
        text: "",
        status: "pending"
      }));
    },
    handleDayClick(item) {
      this.$refs.viewPanel.open();
      this.tempText = item.content;
      if (item.imgs) {
        let i = [];
        i = item.imgs.split(",");
        let initData = i.map((anlien) => {
          if (anlien.slice(anlien.length - 3) == "mp4") {
            return {
              fileType: "video",
              path: anlien
            };
          } else {
            return {
              fileType: "image",
              path: anlien
            };
          }
        });
        this.viewImgAndVideo = initData;
      }
      this.openId = item.id;
    },
    saveImage(path) {
      return new Promise((res, rej) => {
        common_vendor.index.uploadFile({
          url: "https://image.xcbdsc.com/group1/upload",
          name: "file",
          filePath: path,
          formData: {
            output: "json2"
          },
          success: (reponse) => {
            res(JSON.parse(reponse.data));
          },
          fail: (err) => {
            rej(err);
            common_vendor.index.showToast({
              title: "上传失败",
              icon: "error"
            });
          }
        });
      });
    },
    initPorp() {
      common_vendor.index.hideLoading();
      this.$refs.editPanel.close();
      this.$refs.viewPanel.close();
      this.tempText = "";
      this.fileList = [];
    },
    async selectImage() {
      common_vendor.index.chooseImage({
        count: 9,
        mediaType: "mix",
        sourceType: ["album", "camera"],
        maxDuration: 30,
        camera: "back",
        mediaType: ["image"],
        success: (res) => {
          let newImageArray = res.tempFiles.map((item) => {
            return {
              ...item,
              fileType: "image"
            };
          });
          this.fileList = [...this.fileList, ...newImageArray];
        }
      });
    },
    saveContent() {
      if (this.selectedProduct == null) {
        common_vendor.index.showToast({
          title: "请选择菜品",
          icon: "error"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "正在上传中....."
      });
      const imgUploadPromises = this.fileList.map((item) => {
        return this.saveImage(item.tempFilePath);
      });
      Promise.all(imgUploadPromises).then((urlList) => {
        let imgs = [];
        urlList.forEach((item) => {
          if (item) {
            imgs.push(item.data.url);
          }
        });
        let data = {
          "farmersgoods_id": this.selectedProduct,
          "imgs": imgs.join(","),
          "type": 1,
          "content": this.tempText
        };
        api_index.api.addinfos(data).then((res) => {
          this.initPorp();
          this.lifeCycleData();
        });
      }).catch((err) => {
        common_vendor.index.showToast({
          title: "部分文件上传失败",
          icon: "none"
        });
      });
    },
    getStatusClass(day) {
      return {
        completed: day.status === "completed",
        pending: day.status === "pending"
      };
    },
    closeEditor() {
      this.$refs.editPanel.close();
      this.tempImage = "";
      this.tempText = "";
    }
  }
};
if (!Array) {
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_data_select2 + _easycom_uni_forms_item2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_data_select + _easycom_uni_forms_item + _easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.selectedProduct = $event),
    b: common_vendor.p({
      localdata: $data.products,
      placeholder: "请选择菜品",
      modelValue: $data.selectedProduct
    }),
    c: common_vendor.p({
      label: "选择菜品",
      ["label-width"]: "80",
      ["label-align"]: "right"
    }),
    d: common_vendor.f($data.timelineData, (item, index, i0) => {
      return {
        a: "7e7c2362-2-" + i0,
        b: common_vendor.t(_ctx.initTime(item.created)),
        c: common_vendor.o(($event) => $options.handleDayClick(item), index),
        d: index
      };
    }),
    e: common_vendor.p({
      type: "calendar",
      size: "28",
      color: "#fff"
    }),
    f: common_vendor.n("completed"),
    g: $data.timelineData.length ? "visible" : "hidden",
    h: common_vendor.t($data.currentDate),
    i: common_vendor.p({
      type: "camera",
      size: "20",
      color: "#fff"
    }),
    j: common_vendor.o((...args) => $options.selectImage && $options.selectImage(...args)),
    k: common_vendor.o((...args) => $options.editPanelClosePopup && $options.editPanelClosePopup(...args)),
    l: common_vendor.f($data.fileList, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType === "image"
      }, item.fileType === "image" ? {
        b: item.tempFilePath,
        c: common_vendor.o(($event) => $options.viewImage(item.tempFilePath), index)
      } : {
        d: item.tempFilePath
      }, {
        e: common_vendor.o(($event) => $options.handleDelete(index), index),
        f: index
      });
    }),
    m: $data.tempImage
  }, $data.tempImage ? {
    n: $data.tempImage
  } : {}, {
    o: $data.tempText,
    p: common_vendor.o(($event) => $data.tempText = $event.detail.value),
    q: common_vendor.o((...args) => $options.saveContent && $options.saveContent(...args)),
    r: common_vendor.sr("editPanel", "7e7c2362-3"),
    s: common_vendor.p({
      type: "bottom"
    }),
    t: !$data.timelineData.length
  }, !$data.timelineData.length ? {} : {}, {
    v: common_vendor.t($data.currentDate),
    w: common_vendor.o((...args) => $options.viewPanelClosePopup && $options.viewPanelClosePopup(...args)),
    x: common_vendor.f($data.viewImgAndVideo, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType === "image"
      }, item.fileType === "image" ? {
        b: item.path,
        c: common_vendor.o(($event) => $options.viewImage(item.path), index)
      } : {
        d: item.path
      }, {
        e: index
      });
    }),
    y: $data.tempImage
  }, $data.tempImage ? {
    z: $data.tempImage
  } : {}, {
    A: $data.tempText,
    B: common_vendor.o(($event) => $data.tempText = $event.detail.value),
    C: common_vendor.o((...args) => $options.removeItem && $options.removeItem(...args)),
    D: common_vendor.sr("viewPanel", "7e7c2362-5"),
    E: common_vendor.p({
      type: "bottom"
    }),
    F: common_vendor.p({
      type: "plusempty",
      size: "30",
      color: "#fff"
    }),
    G: common_vendor.o((...args) => $options.addRecord && $options.addRecord(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7e7c2362"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/additionalinformation/additionalinformation.js.map
