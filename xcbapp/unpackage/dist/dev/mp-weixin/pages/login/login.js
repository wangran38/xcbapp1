"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      showPassword: false,
      loading: false
    };
  },
  computed: {
    formValid() {
      return /^1[3-9]\d{9}$/.test(this.form.username) && this.form.password.length >= 6;
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      try {
        const response = await api_index.api.login(this.form.username, this.form.password);
        if (response.code === 200) {
          const token = response.data.token;
          common_vendor.index.setStorageSync("token", token);
          let registerID = common_vendor.index.getStorageSync("registerID");
          if (registerID) {
            let res = await api_index.api.editUserProfile({ "registration_id": registerID });
            common_vendor.index.__f__("log", "at pages/login/login.vue:75", "已覆盖设备id", res);
          }
          let promise = new Promise((res, rej) => {
            if (this.form.password == "123456") {
              common_vendor.index.showToast({
                icon: "error",
                title: "密码过于简单,请用户自行修改以确保账号安全",
                duration: 1e3
              });
              setTimeout(() => {
                res(200);
              }, 2e3);
            } else {
              res(201);
            }
          });
          promise.then((code) => {
            if (code == 200) {
              common_vendor.index.showToast({
                icon: "loading",
                title: "正在登录.....",
                duration: 2e3
              });
              setTimeout(() => {
                return code;
              }, 1500);
            } else {
              common_vendor.index.showToast({
                icon: "loading",
                title: "正在登录.....",
                duration: 1e3
              });
              return code;
            }
          }).then((code) => {
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/index/index"
              });
            }, 1e3);
          });
        } else {
          common_vendor.index.showToast({
            title: response.msg || response.message,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/login/login.vue:128", error);
        common_vendor.index.showToast({
          title: `登录失败`,
          icon: "error"
        });
      }
    },
    gotoRegster() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    },
    gotoUptdatePwd() {
      common_vendor.index.navigateTo({
        url: "/subPackages/settings/updatePwd/updatePwd"
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
    f: $data.form.password,
    g: common_vendor.o((e) => $data.form.password = e.detail.value),
    h: !$data.showPassword,
    i: $data.form.password,
    j: common_vendor.o((e) => $data.form.password = e.detail.value),
    k: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
    l: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    m: !$data.loading
  }, !$data.loading ? {} : {
    n: common_vendor.p({
      type: "spinner-cycle",
      size: "24",
      color: "#fff"
    })
  }, {
    o: $options.formValid ? 1 : "",
    p: common_vendor.o((...args) => $options.login && $options.login(...args)),
    q: common_vendor.o((...args) => $options.gotoRegster && $options.gotoRegster(...args)),
    r: common_vendor.o((...args) => $options.gotoUptdatePwd && $options.gotoUptdatePwd(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
