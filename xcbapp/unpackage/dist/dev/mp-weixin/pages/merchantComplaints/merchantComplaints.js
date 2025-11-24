"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_public = require("../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      formData: {
        title: "",
        content: "",
        phone: ""
      },
      fileList: [],
      query: null
      // 上个页面传来的数据
    };
  },
  computed: {},
  onLoad(query) {
    common_vendor.index.__f__("log", "at pages/merchantComplaints/merchantComplaints.vue:100", query);
    this.query = query;
  },
  methods: {
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
    async selectImage() {
      common_vendor.index.chooseMedia({
        count: 6,
        mediaType: "mix",
        sourceType: ["album", "camera"],
        maxDuration: 30,
        camera: "back",
        success: (res) => {
          const imgUploadPromises = res.tempFiles.map((item) => {
            return this.saveImage(item.tempFilePath);
          });
          Promise.all(imgUploadPromises).then((urlList) => {
            this.fileList = [...this.fileList, ...urlList];
          });
        }
      });
    },
    removeFile(index) {
      this.fileList.splice(index, 1);
    },
    async handleSubmit() {
      this.formData.shop_id = parseInt(this.query.id);
      let ImgList = this.fileList.map((item) => {
        return item.data.url;
      });
      this.formData.complaint_img = ImgList.join(",");
      common_vendor.index.showToast({
        icon: "loading",
        title: "正在提交"
      });
      api_index.api.submitComplaint(this.formData).then((data) => {
        if (data.code == 200) {
          common_vendor.index.showToast({
            icon: "success",
            title: "投诉成功"
          });
        } else {
          common_vendor.index.showToast({
            icon: "error",
            title: data.msg
          });
          return;
        }
        setTimeout(() => {
          this.customizeBack();
        }, 2e3);
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
    a: common_vendor.t($data.query.title),
    b: $data.formData.title,
    c: common_vendor.o(($event) => $data.formData.title = $event.detail.value),
    d: $data.formData.content,
    e: common_vendor.o(($event) => $data.formData.content = $event.detail.value),
    f: common_vendor.t($data.formData.content.length),
    g: common_vendor.p({
      type: "plusempty",
      size: "36",
      color: "#7A9D7E"
    }),
    h: common_vendor.o((...args) => $options.selectImage && $options.selectImage(...args)),
    i: $data.fileList.length > 0
  }, $data.fileList.length > 0 ? {
    j: common_vendor.f($data.fileList, (file, index, i0) => {
      return {
        a: file.data.url,
        b: common_vendor.o(($event) => $options.removeFile(index), index),
        c: "241a3734-1-" + i0,
        d: index
      };
    }),
    k: common_vendor.p({
      type: "close",
      size: "18"
    })
  } : {}, {
    l: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#7A9D7E"
    }),
    m: $data.formData.phone,
    n: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    o: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-241a3734"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchantComplaints/merchantComplaints.js.map
