"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const hooks_useUpload = require("../../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      user: {
        Headimgurl: "",
        nickname: "",
        phone: "",
        sex: ""
      },
      sexOptions: ["未知", "男", "女"],
      isSubmitting: false
    };
  },
  onShow() {
    if (this.checkToken()) {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  onLoad() {
    const token = common_vendor.index.getStorageSync("token");
    if (!token) {
      common_vendor.index.showToast({
        title: "请先登录",
        icon: "none"
      });
      return;
    }
    api_index.api.getUserProfile(token).then((response) => {
      common_vendor.index.__f__("log", "at subPackages/settings/user-edit/user-edit.vue:85", "用户数据:", response.data);
      this.user = response.data;
      this.user.nickname = response.data.name;
      this.user.sex = this.mapSexFromBackend(response.data.sex);
    }).catch((error) => {
      common_vendor.index.__f__("error", "at subPackages/settings/user-edit/user-edit.vue:91", "获取用户数据失败", error);
      common_vendor.index.showToast({
        title: "获取用户数据失败",
        icon: "none"
      });
    });
  },
  methods: {
    // 检查是否token存在，存在则已登陆
    checkToken() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        return true;
      }
      return false;
    },
    handleSexChange(e) {
      this.user.sex = Number(e.detail.value);
    },
    mapSexFromBackend(sex) {
      return sex === 2 ? 2 : sex === 1 ? 1 : 0;
    },
    mapSexToBackend(sex) {
      return sex === 2 ? 2 : sex === 1 ? 1 : 0;
    },
    //头像						
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed", "original"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 0) {
            common_vendor.index.__f__("log", "at subPackages/settings/user-edit/user-edit.vue:126", tempFilePaths);
            const { upload, request } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              tempFilePaths: tempFilePaths[0],
              file: res.tempFiles[0]
            });
            upload().then((res2) => {
              var obj = JSON.parse(res2);
              this.user.Headimgurl = api_index.UPLOAD_URL + obj.data.path;
            });
          }
        }
      });
    },
    submitForm() {
      this.isSubmitting = true;
      api_index.api.editUserProfile(this.user).then((response) => {
        common_vendor.index.__f__("log", "at subPackages/settings/user-edit/user-edit.vue:158", "修改成功", response);
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "success"
        });
      }).catch((error) => {
        common_vendor.index.__f__("error", "at subPackages/settings/user-edit/user-edit.vue:165", "修改失败", error);
        common_vendor.index.showToast({
          title: "修改失败",
          icon: "none"
        });
      }).finally(() => {
        this.isSubmitting = false;
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
    a: $data.user.Headimgurl || "http://h5.xcbdsc.com/static/morentouxiang.jpg",
    b: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    c: $data.user.nickname,
    d: common_vendor.o(($event) => $data.user.nickname = $event.detail.value),
    e: common_vendor.p({
      type: "right",
      size: "14",
      color: "rgb(229, 229, 229)"
    }),
    f: $data.user.phone,
    g: common_vendor.o(($event) => $data.user.phone = $event.detail.value),
    h: common_vendor.p({
      type: "right",
      size: "14",
      color: "rgb(229, 229, 229)"
    }),
    i: common_vendor.t($data.sexOptions[$data.user.sex]),
    j: $data.sexOptions,
    k: common_vendor.o((...args) => $options.handleSexChange && $options.handleSexChange(...args)),
    l: common_vendor.p({
      type: "right",
      size: "14",
      color: "rgb(229, 229, 229)"
    }),
    m: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    n: $data.isSubmitting
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/user-edit/user-edit.js.map
