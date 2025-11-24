"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const hooks_useUpload = require("../../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      userinfo: {
        reallyname: "",
        cardnumber: "",
        avatar: "",
        address: ""
      },
      oldDataInfo: null
    };
  },
  async onLoad() {
    let res = await api_index.api.myInfo({});
    this.oldDataInfo = res.data;
  },
  methods: {
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
              this.userinfo.avatar = obj.data.url;
            });
          }
        }
      });
    },
    // 返回上一页
    async customizeBack() {
      let canNavBack = await getCurrentPages();
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/additionalInformation/additionalInformation.vue:216", canNavBack);
      if (canNavBack && canNavBack.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        history.back();
      }
    },
    async submitForm() {
      let res = await api_index.api.upFarmers({
        id: this.oldDataInfo.id,
        ...this.userinfo
      });
      if (res.code == 200) {
        common_vendor.index.showToast({
          icon: "success",
          title: res.msg
        });
        this.customizeBack();
      }
      common_vendor.index.showToast({
        icon: "error",
        title: res.msg
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
    a: $data.userinfo.reallyname,
    b: common_vendor.o(($event) => $data.userinfo.reallyname = $event.detail.value),
    c: $data.userinfo.cardnumber,
    d: common_vendor.o(($event) => $data.userinfo.cardnumber = $event.detail.value),
    e: $data.userinfo.avatar,
    f: $data.userinfo.avatar,
    g: common_vendor.o((...args) => $options.commitAvater && $options.commitAvater(...args)),
    h: common_vendor.o($options.commitAvater),
    i: !$data.userinfo.avatar,
    j: common_vendor.p({
      type: "plusempty",
      size: "50"
    }),
    k: $data.userinfo.address,
    l: common_vendor.o(($event) => $data.userinfo.address = $event.detail.value),
    m: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f8b86b55"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/additionalInformation/additionalInformation.js.map
