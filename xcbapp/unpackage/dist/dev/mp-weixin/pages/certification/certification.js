"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    // 返回处理
    handleBack() {
      common_vendor.index.showModal({
        title: "提示",
        content: "未完成实名认证将无法使用店铺入驻、商品发布等功能，确定要离开吗？",
        confirmText: "暂不认证",
        cancelText: "继续认证",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateBack();
          }
        }
      });
    },
    // 显示帮助
    showHelp() {
      this.showHelpModal = true;
    },
    // 选择经营意向
    onIntentChange(e) {
      this.selectedIntent = this.businessIntents[e.detail.value];
    },
    // 选择图片
    chooseImage(type) {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.idImages[type] = res.tempFilePaths[0];
        }
      });
    },
    // 删除图片
    deleteImage(type) {
      this.idImages[type] = "";
    },
    // 上一步
    prevStep() {
      this.currentStep--;
      common_vendor.index.pageScrollTo({ scrollTop: 0, duration: 300 });
    },
    // 下一步
    nextStep() {
      if (this.currentStep === 0) {
        if (!this.baseInfo.accountName) {
          this.showToast("请设置账号名称");
          return;
        }
        if (!this.baseInfo.phone || this.baseInfo.phone.length !== 11) {
          this.showToast("请输入正确的手机号");
          return;
        }
        if (!this.selectedIntent) {
          this.showToast("请选择经营意向");
          return;
        }
      } else if (this.currentStep === 1) {
        if (!this.idInfo.realName) {
          this.showToast("请输入真实姓名");
          return;
        }
        if (!this.idInfo.idNumber || this.idInfo.idNumber.length !== 18) {
          this.showToast("请输入正确的身份证号");
          return;
        }
        if (!this.idImages.front) {
          this.showToast("请上传身份证正面");
          return;
        }
        if (!this.idImages.back) {
          this.showToast("请上传身份证反面");
          return;
        }
      }
      this.currentStep++;
      common_vendor.index.pageScrollTo({ scrollTop: 0, duration: 300 });
    },
    // 提交认证
    submitAuth() {
      if (!this.agreeAgreement) {
        this.showToast("请阅读并同意信息使用授权");
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "认证提交成功",
          content: "您的实名认证申请已提交，1-2个工作日内完成审核。审核通过后，可直接使用店铺入驻和商品发布功能",
          showCancel: false,
          confirmText: "前往首页",
          success: () => {
            common_vendor.index.switchTab({ url: "/pages/index" });
          }
        });
      }, 1500);
    },
    // 显示提示
    showToast(title) {
      common_vendor.index.showToast({ title, icon: "none", duration: 2e3 });
    },
    // 手机号脱敏
    maskPhone(phone) {
      if (!phone)
        return "";
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
    },
    // 身份证脱敏
    maskIdCard(id) {
      if (!id)
        return "";
      return id.replace(/(\d{6})(\d{8})(\d{4})/, "$1********$3");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1ee499d8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/certification/certification.js.map
