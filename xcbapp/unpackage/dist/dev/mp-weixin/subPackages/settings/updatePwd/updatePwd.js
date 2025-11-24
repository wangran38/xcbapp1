"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        phone: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: ""
      },
      showPassword: false,
      codeBtnText: "获取验证码",
      canSendCode: true,
      countdown: 0,
      phoneError: "",
      passwordError: "",
      confirmError: "",
      message: "",
      isError: false
    };
  },
  computed: {
    formValid() {
      return !this.phoneError && !this.passwordError && !this.confirmError && this.formData.phone && this.formData.verificationCode && this.formData.newPassword && this.formData.confirmPassword;
    }
  },
  onLoad(va) {
    if (va.phone) {
      this.formData.phone = va.phone;
    }
  },
  methods: {
    validatePhone() {
      const reg = /^1[3-9]\d{9}$/;
      if (!this.formData.phone) {
        this.phoneError = "手机号不能为空";
      } else if (!reg.test(this.formData.phone)) {
        this.phoneError = "手机号格式不正确";
      } else {
        this.phoneError = "";
      }
    },
    validatePassword() {
      const reg = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/;
      if (!this.formData.newPassword) {
        this.passwordError = "密码不能为空";
      } else if (!reg.test(this.formData.newPassword)) {
        this.passwordError = "需包含字母和数字，8-20位";
      } else {
        this.passwordError = "";
      }
      if (this.formData.confirmPassword) {
        if (this.formData.confirmPassword !== this.formData.newPassword) {
          this.passwordError = "两次输入密码不一致";
        } else {
          this.passwordError = "";
        }
      }
    },
    validateConfirm() {
      if (this.formData.confirmPassword !== this.formData.newPassword) {
        this.confirmError = "两次输入密码不一致";
      } else {
        this.confirmError = "";
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async sendVerificationCode() {
      if (this.phoneError || !this.formData.phone)
        return;
      this.startCountdown();
      let res = await api_index.api.sendText({
        "phonenumber": this.formData.phone
      });
      if (res.code == 200) {
        common_vendor.index.showToast({
          icon: "success",
          title: "短信已发送至您的手机,请注意查收"
        });
      } else {
        common_vendor.index.showToast({
          icon: "error",
          title: res.msg
        });
      }
    },
    startCountdown() {
      this.canSendCode = false;
      this.countdown = 60;
      this.codeBtnText = `${this.countdown}秒后重发`;
      const timer = setInterval(() => {
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.canSendCode = true;
          this.codeBtnText = "获取验证码";
          return;
        }
        this.countdown--;
        this.codeBtnText = `${this.countdown}秒后重发`;
      }, 1e3);
    },
    async handleSubmit() {
      await api_index.api.editPwd({
        phone: this.formData.phone,
        codenum: this.formData.verificationCode,
        psw: this.formData.newPassword
      });
      this.showMessage("密码重置成功", false);
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    },
    showMessage(msg, isError = true) {
      this.message = msg;
      this.isError = isError;
      setTimeout(() => {
        this.message = "";
      }, 2e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o([($event) => $data.formData.phone = $event.detail.value, (...args) => $options.validatePhone && $options.validatePhone(...args)]),
    b: $data.formData.phone,
    c: $data.phoneError
  }, $data.phoneError ? {
    d: common_vendor.t($data.phoneError)
  } : {}, {
    e: $data.formData.verificationCode,
    f: common_vendor.o(($event) => $data.formData.verificationCode = $event.detail.value),
    g: common_vendor.t($data.codeBtnText),
    h: !$data.canSendCode ? 1 : "",
    i: !$data.canSendCode,
    j: common_vendor.o((...args) => $options.sendVerificationCode && $options.sendVerificationCode(...args)),
    k: common_vendor.o([($event) => $data.formData.newPassword = $event.detail.value, (...args) => $options.validatePassword && $options.validatePassword(...args)]),
    l: $data.formData.newPassword,
    m: $data.showPassword ? "/static/eye-open.png" : "/static/eye-close.png",
    n: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    o: $data.passwordError
  }, $data.passwordError ? {
    p: common_vendor.t($data.passwordError)
  } : {}, {
    q: common_vendor.o([($event) => $data.formData.confirmPassword = $event.detail.value, (...args) => $options.validateConfirm && $options.validateConfirm(...args)]),
    r: $data.formData.confirmPassword,
    s: $data.confirmError
  }, $data.confirmError ? {
    t: common_vendor.t($data.confirmError)
  } : {}, {
    v: !$options.formValid ? 1 : "",
    w: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    x: $data.message
  }, $data.message ? {
    y: common_vendor.t($data.message),
    z: $data.isError ? 1 : ""
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b2b17cef"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/updatePwd/updatePwd.js.map
