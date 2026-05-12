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
      tempText: "",
      currentDate: "",
      formData: {
        page: 1,
        limit: 30
      },
      fileList: [],
      // 编辑页：存储媒体完整对象（含tempFilePath/fileType/thumbTempFilePath）
      viewImgAndVideo: [],
      // 查看页：按后端顺序存储{fileType, path}，确保一一关联
      openId: null
    };
  },
  mixins: [utils_public.myMixin],
  watch: {
    selectedProduct(newValue) {
      newValue && this.lifeCycleData();
    }
  },
  async onLoad() {
    this.currentDate = common_vendor.dayjs().format("YYYY-MM-DD");
    try {
      const data = await api_index.api.goodslist(this.formData);
      if (data.code === 200) {
        this.products = data.data.listdata.map((item) => ({
          value: item.id,
          text: item.goodsname
        }));
        this.products.length && (this.selectedProduct = this.products[0].value) && this.lifeCycleData();
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at pages/additionalinformation/additionalinformation.vue:155", "获取菜品列表失败", err);
      common_vendor.index.showToast({
        title: "获取菜品失败",
        icon: "none"
      });
    }
  },
  methods: {
    // 统一预览：图片/视频 自动关联对应路径（核心：item携带当前媒体的完整信息）
    previewMedia(item) {
      if (!item)
        return;
      const {
        fileType,
        tempFilePath,
        path
      } = item;
      const realUrl = tempFilePath || path;
      if (fileType === "image") {
        common_vendor.index.previewImage({
          showmenu: false,
          urls: [realUrl]
        });
      } else if (fileType === "video") {
        common_vendor.index.navigateTo({
          url: `/pages/videoPreview/videoPreview?videoUrl=${encodeURIComponent(realUrl)}`
        });
      }
    },
    // 删除记录
    async removeItem() {
      if (!this.openId)
        return;
      try {
        const res = await api_index.api.delMoments({
          id: this.openId
        });
        if (res.code === 200) {
          common_vendor.index.showToast({
            icon: "success",
            title: res.message || res.msg
          });
          this.initPorp();
          this.lifeCycleData();
        } else {
          common_vendor.index.showToast({
            title: res.message || "删除失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/additionalinformation/additionalinformation.vue:206", "删除记录失败", err);
        common_vendor.index.showToast({
          title: "删除记录失败",
          icon: "none"
        });
      }
    },
    // 关闭弹窗初始化
    initPorp() {
      var _a, _b;
      common_vendor.index.hideLoading();
      (_a = this.$refs.editPanel) == null ? void 0 : _a.close();
      (_b = this.$refs.viewPanel) == null ? void 0 : _b.close();
      this.tempText = "";
      this.fileList = [];
    },
    editPanelClosePopup() {
      this.initPorp();
    },
    viewPanelClosePopup() {
      this.initPorp();
    },
    // 获取生长记录数据
    async lifeCycleData() {
      var _a;
      if (!this.selectedProduct)
        return;
      try {
        const data = await api_index.api.goodsinfoList({
          page: 1,
          limit: 100,
          farmersgoods_id: this.selectedProduct
        });
        this.timelineData = ((_a = data.data) == null ? void 0 : _a.listdata) || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/additionalinformation/additionalinformation.vue:238", "获取生长记录失败", err);
        common_vendor.index.showToast({
          title: "获取记录失败",
          icon: "none"
        });
      }
    },
    // 删除编辑页的媒体项（保持数组顺序）
    handleDelete(index) {
      index >= 0 && index < this.fileList.length && this.fileList.splice(index, 1);
    },
    // 打开新增记录弹窗
    addRecord() {
      this.$refs.editPanel.open();
    },
    // 日期格式化
    initTime(dateStr) {
      return dateStr ? common_vendor.dayjs(dateStr).format("YYYY-MM-DD HH:mm") : "未知日期";
    },
    handleDayClick(item) {
      if (!item)
        return;
      this.$refs.viewPanel.open();
      this.tempText = item.content || "";
      this.openId = item.id;
      this.currentDate = item.created ? this.initTime(item.created).split(" ")[0] : this.currentDate;
      this.viewImgAndVideo = [];
      if (item.imgs && item.imgs.trim()) {
        const mediaUrlArr = item.imgs.split(",").filter((url) => url.trim());
        this.viewImgAndVideo = mediaUrlArr.map((url) => {
          const lowerUrl = url.toLowerCase();
          const isVideo = lowerUrl.endsWith("mp4");
          lowerUrl.endsWith("jpg") || lowerUrl.endsWith("png");
          return {
            fileType: isVideo ? "video" : "image",
            path: url
            // 强关联对应媒体路径，确保播放准确
            // 移除缩略图字段，无需异步赋值
          };
        });
      }
    },
    // 统一上传媒体
    saveMedia(path) {
      return new Promise((res, rej) => {
        if (!path)
          return rej("文件路径为空");
        common_vendor.index.uploadFile({
          url: "https://image.xcbdsc.com/group1/upload",
          name: "file",
          filePath: path,
          formData: {
            output: "json2"
          },
          success: (response) => {
            common_vendor.index.__f__("log", "at pages/additionalinformation/additionalinformation.vue:295", "上传接口后端真实返回：", response.data);
            common_vendor.index.__f__("log", "at pages/additionalinformation/additionalinformation.vue:296", "上传接口状态码：", response.statusCode);
            if (response.statusCode >= 200 && response.statusCode < 300) {
              try {
                const result = JSON.parse(response.data);
                res(result);
              } catch (err) {
                common_vendor.index.__f__("warn", "at pages/additionalinformation/additionalinformation.vue:306", "JSON 解析失败，后端返回非 JSON 格式：", err);
                const nonJsonResult = {
                  data: {
                    url: response.data,
                    // 直接把返回内容作为 url（若后端直接返回图片/视频路径）
                    msg: "上传成功（非 JSON 格式返回）"
                  },
                  code: 200
                };
                res(nonJsonResult);
              }
            } else {
              rej(`上传接口请求失败，状态码：${response.statusCode}`);
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/additionalinformation/additionalinformation.vue:325", "文件上传请求失败：", err);
            rej(`文件上传失败：${err.errMsg || "未知错误"}`);
          }
        });
      });
    },
    // 选择图片/视频（编辑页，保留临时缩略图）
    selectMedia() {
      common_vendor.index.chooseMedia({
        count: 9,
        sourceType: ["album", "camera"],
        mediaType: ["image", "video"],
        sizeType: ["original", "compressed"],
        maxDuration: 60,
        success: (res) => {
          this.fileList = [...this.fileList, ...res.tempFiles];
          const imgCount = res.tempFiles.filter((i) => i.fileType === "image").length;
          const videoCount = res.tempFiles.filter((i) => i.fileType === "video").length;
          let tip = "";
          if (imgCount && videoCount)
            tip = `选中${imgCount}张图片+${videoCount}个视频`;
          else if (imgCount)
            tip = `选中${imgCount}张图片`;
          else
            tip = `选中${videoCount}个视频`;
          common_vendor.index.showToast({
            title: tip,
            icon: "none"
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/additionalinformation/additionalinformation.vue:354", "选择媒体失败", err);
          common_vendor.index.showToast({
            title: "选择媒体失败",
            icon: "none"
          });
        }
      });
    },
    // 保存记录：仅上传真实媒体路径，按顺序提交，保证后端存储顺序和前端一致
    async saveContent() {
      if (!this.selectedProduct) {
        common_vendor.index.showToast({
          title: "请选择菜品",
          icon: "error"
        });
        return;
      }
      if (this.fileList.length === 0 && !this.tempText.trim()) {
        common_vendor.index.showToast({
          title: "请上传图片/视频或输入记录内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "正在上传中....."
      });
      try {
        const uploadPromises = this.fileList.map((item) => this.saveMedia(item.tempFilePath));
        const uploadRes = await Promise.all(uploadPromises);
        const mediaUrls = uploadRes.filter((item) => {
          var _a;
          return item && ((_a = item.data) == null ? void 0 : _a.url);
        }).map((item) => item.data.url);
        const res = await api_index.api.addinfos({
          farmersgoods_id: this.selectedProduct,
          imgs: mediaUrls.join(","),
          // 顺序和前端展示一致，查看页按此解析
          type: 1,
          content: this.tempText.trim()
        });
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          this.initPorp();
          this.lifeCycleData();
        } else {
          common_vendor.index.showToast({
            title: res.message || "保存失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/additionalinformation/additionalinformation.vue:409", "保存记录失败", err);
        common_vendor.index.showToast({
          title: "保存记录失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
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
        b: common_vendor.t($options.initTime(item.created)),
        c: common_vendor.o(($event) => $options.handleDayClick(item), index),
        d: index
      };
    }),
    e: common_vendor.p({
      type: "calendar",
      size: "28",
      color: "#fff"
    }),
    f: $data.timelineData.length,
    g: common_vendor.t($data.currentDate),
    h: common_vendor.p({
      type: "camera",
      size: "20",
      color: "#fff"
    }),
    i: common_vendor.o((...args) => $options.selectMedia && $options.selectMedia(...args)),
    j: common_vendor.o((...args) => $options.editPanelClosePopup && $options.editPanelClosePopup(...args)),
    k: common_vendor.f($data.fileList, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType === "image"
      }, item.fileType === "image" ? {
        b: item.tempFilePath,
        c: common_vendor.o(($event) => $options.previewMedia(item), index)
      } : {
        d: item.thumbTempFilePath || "/static/images/video-default.png",
        e: "7e7c2362-5-" + i0 + ",7e7c2362-3",
        f: common_vendor.p({
          type: "videocam-filled",
          size: "40",
          color: "#fff"
        }),
        g: item.tempFilePath,
        h: common_vendor.o(($event) => $options.previewMedia(item), index)
      }, {
        i: common_vendor.o(($event) => $options.handleDelete(index), index),
        j: index
      });
    }),
    l: $data.tempText,
    m: common_vendor.o(($event) => $data.tempText = $event.detail.value),
    n: common_vendor.o((...args) => $options.saveContent && $options.saveContent(...args)),
    o: common_vendor.sr("editPanel", "7e7c2362-3"),
    p: common_vendor.o($options.viewPanelClosePopup),
    q: common_vendor.p({
      type: "bottom",
      ["is-mask-click"]: true
    }),
    r: common_vendor.t($data.currentDate),
    s: common_vendor.o((...args) => $options.viewPanelClosePopup && $options.viewPanelClosePopup(...args)),
    t: common_vendor.f($data.viewImgAndVideo, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType === "image"
      }, item.fileType === "image" ? {
        b: item.path,
        c: common_vendor.o(($event) => $options.previewMedia(item), index)
      } : {
        d: item.thumb || "/static/images/video-default.png",
        e: "7e7c2362-7-" + i0 + ",7e7c2362-6",
        f: common_vendor.p({
          type: "videocam-filled",
          size: "40",
          color: "#fff"
        }),
        g: item.path,
        h: common_vendor.o(($event) => $options.previewMedia(item), index)
      }, {
        i: index
      });
    }),
    v: $data.tempText,
    w: common_vendor.o(($event) => $data.tempText = $event.detail.value),
    x: common_vendor.o((...args) => $options.removeItem && $options.removeItem(...args)),
    y: common_vendor.sr("viewPanel", "7e7c2362-6"),
    z: common_vendor.o($options.editPanelClosePopup),
    A: common_vendor.p({
      type: "bottom",
      ["is-mask-click"]: true
    }),
    B: !$data.timelineData.length
  }, !$data.timelineData.length ? {} : {}, {
    C: common_vendor.p({
      type: "plusempty",
      size: "30",
      color: "#fff"
    }),
    D: common_vendor.o((...args) => $options.addRecord && $options.addRecord(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7e7c2362"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/additionalinformation/additionalinformation.js.map
