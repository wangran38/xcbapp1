"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        password: "",
        confirm: "",
        fromid: ""
        // 邀请码
      },
      phoneError: "",
      passwordError: "",
      confirmPasswordError: "",
      passwordValid: false,
      confirmPasswordValid: false,
      agreements: {
        service: false,
        privacy: false
      },
      showPassword: true,
      showConfirmPassword: true
    };
  },
  // watch: {
  // 	'form.username': 'validatePhoneNumber',
  // 	'form.password': 'validatePassword'
  // },
  onLoad(query) {
    try {
      let scene = decodeURIComponent(query.scene);
      if (scene) {
        this.form.fromid = scene;
      } else {
        this.form.fromid = 0;
      }
    } catch (e) {
      common_vendor.index.__f__("log", "at pages/register/register.vue:112", e);
    }
  },
  methods: {
    goTouserServiceAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/userServiceAgreement/userServiceAgreement"
      });
    },
    goToprivacyAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/privacyAgreement/privacyAgreement"
      });
    },
    async register() {
      let reg = /^1[3-9]\d{9}$/;
      if (!reg.test(this.form.username)) {
        common_vendor.index.showToast({
          title: "请输入正确的11位手机号",
          icon: "error"
        });
        return;
      }
      if (this.form.password === "") {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "error"
        });
        return;
      }
      common_vendor.index.__f__("log", "at pages/register/register.vue:150", this.form.password);
      if (this.form.password.length < 6) {
        common_vendor.index.showToast({
          icon: "error",
          title: "密码必须为6位或者大于6位"
        });
        return;
      }
      if (this.form.password !== this.form.confirm) {
        common_vendor.index.showToast({
          icon: "none",
          title: "两次密码输入不一致"
        });
        return;
      }
      if (!this.agreements.service || !this.agreements.privacy) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请勾选服务协议和隐私协议"
        });
        return;
      }
      try {
        const response = await api_index.api.register(
          this.form.username,
          this.form.password,
          this.form.confirm,
          Number(this.form.fromid)
        );
        if (response.code === 200) {
          const token = response.data;
          common_vendor.index.setStorageSync("token", token);
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success",
            duration: 2e3
          });
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }, 2e3);
        } else {
          common_vendor.index.showToast({
            icon: "none",
            title: response.msg || "注册失败，请重试"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          icon: "none",
          title: "网络错误，请稍后重试"
        });
        common_vendor.index.__f__("error", "at pages/register/register.vue:202", "Registration Error:", error);
      }
    },
    checkBox(value) {
      switch (value) {
        case 0:
          this.agreeServiceAgreement = !this.agreeServiceAgreement;
          break;
        case 1:
          this.agreePrivacyPolicy = !this.agreePrivacyPolicy;
          break;
      }
    },
    navigateToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
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
  return {
    a: common_vendor.p({
      type: "phone",
      size: "24",
      color: "#409EFF"
    }),
    b: $data.form.username,
    c: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    d: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#409EFF"
    }),
    e: $data.showPassword,
    f: common_vendor.o([($event) => $data.form.password = $event.detail.value, (e) => $data.form.password = e.detail.value]),
    g: $data.form.password,
    h: !$data.showPassword,
    i: common_vendor.o([($event) => $data.form.password = $event.detail.value, (e) => $data.form.password = e.detail.value]),
    j: $data.form.password,
    k: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
    l: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    m: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#409EFF"
    }),
    n: $data.showConfirmPassword,
    o: $data.form.confirm,
    p: common_vendor.o((e) => $data.form.confirm = e.detail.value),
    q: !$data.showConfirmPassword,
    r: $data.form.confirm,
    s: common_vendor.o((e) => $data.form.confirm = e.detail.value),
    t: common_vendor.o(($event) => $data.showConfirmPassword = !$data.showConfirmPassword),
    v: common_vendor.p({
      type: $data.showConfirmPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    w: common_vendor.p({
      type: "medal-filled",
      size: "24",
      color: "#409EFF"
    }),
    x: $data.form.fromid,
    y: common_vendor.o((e) => $data.form.fromid = e.detail.value),
    z: common_vendor.o(($event) => $data.agreements.service = !$data.agreements.service),
    A: common_vendor.p({
      type: $data.agreements.service ? "checkbox-filled" : "circle",
      size: "24",
      color: $data.agreements.service ? "#409EFF" : "#999"
    }),
    B: common_vendor.o((...args) => $options.goTouserServiceAgreement && $options.goTouserServiceAgreement(...args)),
    C: common_vendor.o(($event) => $data.agreements.privacy = !$data.agreements.privacy),
    D: common_vendor.p({
      type: $data.agreements.privacy ? "checkbox-filled" : "circle",
      size: "24",
      color: $data.agreements.privacy ? "#409EFF" : "#999"
    }),
    E: common_vendor.o((...args) => $options.goToprivacyAgreement && $options.goToprivacyAgreement(...args)),
    F: common_vendor.o((...args) => $options.register && $options.register(...args)),
    G: common_vendor.o((...args) => $options.navigateToLogin && $options.navigateToLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
