"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      isLoggedIn: false,
      userName: "",
      userAvatar: "",
      score: "",
      // 添加你需要的数据属性
      totalnum: 0,
      signTotal: {},
      phone: null
      // 用户手机号
    };
  },
  async onShow() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.fetchUserProfile();
    }
    this.signlist();
  },
  methods: {
    routerPush(path) {
      try {
        common_vendor.index.navigateTo({
          url: path
        });
      } catch {
      }
    },
    GotowholesaleNavigation() {
      common_vendor.index.navigateTo({
        url: "/subPackages/Wholesale/wholesaleNavigation/wholesaleNavigation"
      });
    },
    GoTOsettings() {
      common_vendor.index.navigateTo({
        url: "/pages/settings/settings"
      });
    },
    GoToComplaint() {
      common_vendor.index.navigateTo({
        url: "/pages/myComplaint/myComplaint"
      });
    },
    goToprePurchaseOrder() {
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/prePurchaseOrder/prePurchaseOrder`
      });
    },
    goToUpdatePwd() {
      common_vendor.index.navigateTo({
        url: `/pages/updatePwd/updatePwd?phone=${this.phone}`
      });
    },
    /**
     * 检查登录状态
     */
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },
    /**
     * 获取用户个人信息
     */
    async fetchUserProfile() {
      try {
        const response = await api_index.api.getUserProfile();
        if (response.code === 200) {
          const {
            name,
            Headimgurl,
            score,
            phone
          } = response.data;
          this.userName = name;
          this.userAvatar = Headimgurl;
          this.score = score;
          this.phone = phone;
        } else {
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/user.vue:233", "Error fetching user profile:", error);
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
      }
    },
    async signlist(data) {
      const token = common_vendor.index.getStorageSync("token");
      const response = await api_index.api.signlist(token);
      this.totalnum = response.data.totalnum;
    },
    login() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    lottery() {
      common_vendor.index.navigateTo({
        url: "/pages/clock-records/clock-records"
      });
    },
    toorders(orderStatus) {
      common_vendor.index.navigateTo({
        url: `/pages/orders/orders?orderStatus=${orderStatus}`
      });
    },
    mypoints() {
      common_vendor.index.navigateTo({
        url: "/pages/MyPoints-records/MyPoints-records"
      });
    },
    logout() {
      try {
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.removeStorageSync("nickname");
        common_vendor.index.__f__("log", "at pages/user/user.vue:273", "Token and nickname removed from storage");
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/user.vue:275", "Failed to remove token or nickname from storage", e);
      }
      this.isLoggedIn = false;
      this.nickname = "";
      this.userName = "";
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    },
    // 绑定微信
    async bindingWechat() {
      let systemInfo = await common_vendor.index.getSystemInfo();
      if (systemInfo[1].host && systemInfo[1].host.env == "WeChat") {
        common_vendor.index.login({
          provider: "true",
          success: async (res) => {
            common_vendor.index.__f__("log", "at pages/user/user.vue:294", res.code, "这是用户唯一标识");
            let data = await api_index.api.bindingOpenid({
              code: res.code
            });
            let msg = data.message;
            if (data.code == 200) {
              common_vendor.index.showToast({
                title: msg,
                icon: "success"
              });
            } else {
              common_vendor.index.showToast({
                title: msg,
                icon: "error"
              });
            }
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "浏览器不支持调用api,请前往小程序端进行账号绑定",
          duration: 3e3,
          icon: "error"
        });
      }
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
    a: $data.userAvatar || "http://h5.xcbdsc.com/static/morentouxiang.jpg",
    b: !$data.isLoggedIn
  }, !$data.isLoggedIn ? {
    c: common_vendor.o((...args) => $options.login && $options.login(...args))
  } : {}, {
    d: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    e: common_vendor.t($data.userName || "请到我的信息中填写昵称")
  } : {}, {
    f: common_vendor.o($options.GoTOsettings),
    g: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-shezhi",
      size: "20"
    }),
    h: common_vendor.t($data.score),
    i: common_vendor.p({
      type: "auth",
      size: "30",
      color: "#00C853"
    }),
    j: common_vendor.t($data.totalnum),
    k: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    l: common_vendor.o((...args) => $options.lottery && $options.lottery(...args)),
    m: common_vendor.p({
      type: "vip",
      size: "30",
      color: "#FFD600"
    }),
    n: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    o: common_vendor.o((...args) => $options.mypoints && $options.mypoints(...args)),
    p: common_vendor.p({
      type: "shop-filled",
      size: "30",
      color: "#2979FF"
    }),
    q: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    r: common_vendor.o((...args) => $options.goToprePurchaseOrder && $options.goToprePurchaseOrder(...args)),
    s: common_vendor.p({
      type: "cart",
      size: "30",
      color: "#2979FF"
    }),
    t: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    v: common_vendor.o((...args) => $options.toorders && $options.toorders(...args)),
    w: common_vendor.p({
      type: "list",
      size: "30",
      color: "#2979FF"
    }),
    x: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    y: common_vendor.o((...args) => $options.GotowholesaleNavigation && $options.GotowholesaleNavigation(...args)),
    z: common_vendor.p({
      type: "gear",
      size: "30",
      color: "#2979FF"
    }),
    A: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    B: common_vendor.o((...args) => $options.GoTOsettings && $options.GoTOsettings(...args)),
    C: common_vendor.p({
      type: "medal-filled",
      size: "30",
      color: "#2979FF"
    }),
    D: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    E: common_vendor.o(($event) => $options.routerPush("/pages/invitation/invitation")),
    F: common_vendor.p({
      type: "medal-filled",
      size: "30",
      color: "#2979FF"
    }),
    G: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    H: common_vendor.o(($event) => $options.routerPush("/pages/earningsRecord/earningsRecord")),
    I: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
