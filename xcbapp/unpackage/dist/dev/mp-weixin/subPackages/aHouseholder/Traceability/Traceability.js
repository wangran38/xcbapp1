"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  onLoad(option) {
    try {
      if (option.type) {
        this.type = Number(option.type);
      }
    } catch {
    }
    this.id = option.id;
    this.goodsname = option.goodsname;
    this.formData.goods_id = Number(option.id);
    this.uploadImageback();
  },
  data() {
    return {
      type: 1,
      // 状态为1是摊主，状态为2是农户
      goodsname: null,
      id: null,
      activeTab: 0,
      // 0:溯源信息 1:图片上传
      selectedSource: "",
      sourceTypes: ["自家种植", "合作社供货", "批发市场进货", "产地直采"],
      // 图片相关
      categories: ["种植/养殖场景", "进货单据", "摊位实拍", "商品细节", "质检报告"],
      activeCategory: 0,
      images: [],
      formData: {
        content: null,
        fromcontent: ""
      }
    };
  },
  methods: {
    // 图片上传之后的回调
    async uploadImageback() {
      let data = await api_index.api.getManyImages({
        goodsid: Number(this.id),
        limit: 100,
        page: 1
      });
      if (data.code == 200) {
        common_vendor.index.__f__("log", "at subPackages/aHouseholder/Traceability/Traceability.vue:174", data.data);
        this.images = [...data.data];
      }
    },
    // 货源类型选择变化
    onSourceChange(e) {
      this.selectedSource = this.sourceTypes[e.detail.value];
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
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.images.length,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const newImages = res.tempFilePaths.map((path) => ({
            url: path
          }));
          const imgUploadPromises = newImages.map((item) => {
            return this.saveImage(item.url);
          });
          Promise.all(imgUploadPromises).then(async (data) => {
            data.forEach((item) => {
              api_index.api.manyImages({
                goodsid: Number(this.id),
                url: item.data.url
              }).then((data2) => {
                this.images.push({
                  url: data2.data.url,
                  id: data2.data.id
                });
                common_vendor.index.__f__("log", "at subPackages/aHouseholder/Traceability/Traceability.vue:231", this.images);
              });
            });
          });
        }
      });
    },
    // 删除图片
    deleteImage(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        success: (res) => {
          if (res.confirm) {
            api_index.api.delManyImages({
              id
            }).then((data) => {
              this.uploadImageback();
            });
          }
        }
      });
    },
    // 提交表单
    async submitForm() {
      let get = null;
      if (this.type == 1) {
        get = api_index.api.addTraceability;
      } else {
        this.formData.id = this.formData.goods_id;
        delete this.formData.goods_id;
        get = api_index.api.updateDish;
      }
      let data = await get(
        this.formData
      );
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/Traceability/Traceability.vue:269", data);
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "提交成功，等待审核",
          icon: "success",
          duration: 2e3
        });
      }, 1500);
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
  return common_vendor.e({
    a: $data.activeTab === 0
  }, $data.activeTab === 0 ? {} : {}, {
    b: $data.activeTab === 0 ? 1 : "",
    c: common_vendor.o(($event) => $data.activeTab = 0),
    d: $data.type == 1
  }, $data.type == 1 ? common_vendor.e({
    e: $data.activeTab === 1
  }, $data.activeTab === 1 ? {} : {}, {
    f: $data.activeTab === 1 ? 1 : "",
    g: common_vendor.o(($event) => $data.activeTab = 1)
  }) : {}, {
    h: $data.activeTab === 0
  }, $data.activeTab === 0 ? {
    i: common_vendor.t($data.goodsname),
    j: $data.formData.content,
    k: common_vendor.o(($event) => $data.formData.content = $event.detail.value),
    l: $data.formData.fromcontent,
    m: common_vendor.o(($event) => $data.formData.fromcontent = $event.detail.value),
    n: common_vendor.t($data.formData.fromcontent.length || 0)
  } : {}, {
    o: $data.activeTab === 1
  }, $data.activeTab === 1 ? common_vendor.e({
    p: $data.images.length < 9
  }, $data.images.length < 9 ? {
    q: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    r: common_vendor.f($data.images, (img, k0, i0) => {
      return {
        a: img.url,
        b: common_vendor.o(($event) => $options.deleteImage(img.id), img.id),
        c: "2be9784b-0-" + i0,
        d: img.id
      };
    }),
    s: common_vendor.p({
      type: "clear",
      size: "20",
      color: "#fff"
    }),
    t: common_vendor.t($data.images.length)
  }) : {}, {
    v: $data.activeTab == 0
  }, $data.activeTab == 0 ? {
    w: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2be9784b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/Traceability/Traceability.js.map
