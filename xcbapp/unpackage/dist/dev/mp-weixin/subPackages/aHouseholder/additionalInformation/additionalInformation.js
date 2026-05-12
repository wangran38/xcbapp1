"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const hooks_useUpload = require("../../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      userinfo: {
        farmersname: "",
        cardnumber: "",
        avatar: "",
        address: ""
      },
      oldDataInfo: null,
      // 存储原始用户数据，用于取ID和判断模式
      isEditMode: false,
      // 核心模式标识：true=编辑模式，false=补充模式
      loading: false
      // 全局加载状态：头像上传+提交共用
    };
  },
  /**
   * 页面加载核心：获取用户资料 → 判断模式 → 数据回显
   */
  async onLoad() {
    try {
      const res = await api_index.api.myInfo({});
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/additionalInformation/additionalInformation.vue:200", "个人信息回显", res.data);
      if (res.code === 200 && res.data) {
        this.oldDataInfo = res.data;
        const hasUserInfo = res.data.farmersname || res.data.cardnumber || res.data.address;
        this.isEditMode = hasUserInfo;
        if (this.isEditMode) {
          this.userinfo = {
            farmersname: res.data.farmersname || "",
            cardnumber: res.data.cardnumber || "",
            avatar: res.data.avatar || "",
            address: res.data.address || ""
          };
        }
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at subPackages/aHouseholder/additionalInformation/additionalInformation.vue:217", "获取用户资料异常：", err);
      this.isEditMode = false;
    }
  },
  methods: {
    /**
     * 头像上传：补充/编辑模式共用，上传后自动更新表单
     */
    async commitAvater() {
      if (this.loading)
        return;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          var _a;
          const tempFilePath = res.tempFilePaths[0];
          if (!tempFilePath)
            return;
          this.loading = true;
          try {
            const { upload } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              tempFilePaths: tempFilePath,
              file: res.tempFiles[0]
            });
            const uploadRes = await upload();
            const obj = JSON.parse(uploadRes);
            if ((_a = obj == null ? void 0 : obj.data) == null ? void 0 : _a.url) {
              this.userinfo.avatar = obj.data.url;
              common_vendor.index.showToast({
                icon: "success",
                title: this.isEditMode ? "头像更新成功" : "头像上传成功"
              });
            } else {
              throw new Error("上传结果无效");
            }
          } catch (err) {
            common_vendor.index.__f__("error", "at subPackages/aHouseholder/additionalInformation/additionalInformation.vue:256", "头像操作失败：", err);
            common_vendor.index.showToast({
              icon: "none",
              title: this.isEditMode ? "头像更新失败" : "头像上传失败"
            });
          } finally {
            this.loading = false;
          }
        },
        fail: (err) => {
          if (err.errMsg !== "chooseImage:cancel") {
            common_vendor.index.showToast({ icon: "none", title: "选择图片失败" });
          }
        }
      });
    },
    /**
     * 表单校验：补充/编辑模式共用，规则一致
     */
    validateForm() {
      const { farmersname, cardnumber, avatar, address } = this.userinfo;
      if (!farmersname.trim()) {
        common_vendor.index.showToast({ icon: "none", title: "请输入真实姓名" });
        return false;
      }
      const cardReg = /^\d{17}[\dXx]$/;
      if (!cardnumber.trim() || !cardReg.test(cardnumber.trim())) {
        common_vendor.index.showToast({ icon: "none", title: "请输入有效18位身份证" });
        return false;
      }
      if (!avatar) {
        common_vendor.index.showToast({ icon: "none", title: "请上传头像" });
        return false;
      }
      if (!address.trim()) {
        common_vendor.index.showToast({ icon: "none", title: "请输入详细地址" });
        return false;
      }
      return true;
    },
    async submitForm() {
      var _a;
      if (!this.validateForm())
        return;
      if (this.loading)
        return;
      this.loading = true;
      try {
        let submitData = { ...this.userinfo };
        if (this.isEditMode && ((_a = this.oldDataInfo) == null ? void 0 : _a.id)) {
          submitData.id = this.oldDataInfo.id;
        }
        common_vendor.index.__f__("log", "at subPackages/aHouseholder/additionalInformation/additionalInformation.vue:318", "个人数据提交", submitData);
        const res = await api_index.api.upFarmers(submitData);
        if (res.code === 200) {
          common_vendor.index.showToast({
            icon: "success",
            title: this.isEditMode ? "资料修改成功" : "资料补充成功"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack({ delta: 1 });
          }, 1200);
        } else {
          common_vendor.index.showToast({
            icon: "none",
            title: res.msg || (this.isEditMode ? "资料修改失败" : "资料补充失败")
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at subPackages/aHouseholder/additionalInformation/additionalInformation.vue:339", "提交失败：", err);
        common_vendor.index.showToast({
          icon: "none",
          title: "网络异常，请稍后重试"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.isEditMode ? "户主资料编辑" : "户主资料补充"),
    b: $data.userinfo.farmersname,
    c: common_vendor.o(($event) => $data.userinfo.farmersname = $event.detail.value),
    d: $data.userinfo.cardnumber,
    e: common_vendor.o(($event) => $data.userinfo.cardnumber = $event.detail.value),
    f: common_vendor.t($data.isEditMode ? "当前头像" : "上传头像"),
    g: $data.userinfo.avatar,
    h: $data.userinfo.avatar,
    i: common_vendor.p({
      type: "camera",
      size: "40",
      color: "#86909c"
    }),
    j: !$data.userinfo.avatar,
    k: common_vendor.o((...args) => $options.commitAvater && $options.commitAvater(...args)),
    l: $data.userinfo.address,
    m: common_vendor.o(($event) => $data.userinfo.address = $event.detail.value),
    n: $data.loading,
    o: common_vendor.p({
      type: "loading",
      size: "mini"
    }),
    p: common_vendor.t($data.isEditMode ? "保存修改" : "提交资料"),
    q: !$data.loading,
    r: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    s: $data.loading
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f8b86b55"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/additionalInformation/additionalInformation.js.map
