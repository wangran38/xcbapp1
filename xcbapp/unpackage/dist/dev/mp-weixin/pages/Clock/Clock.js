"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      isSignedIn: false,
      // statusMessage: '未打卡', // 默认状态
      timestamp: "",
      // 存储时间戳
      time: ""
    };
  },
  onLoad(options) {
    if (options.time) {
      this.time = options.time;
    }
    this.signIn();
  },
  methods: {
    async signIn(data) {
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.showModal({
            // title: '测试测试',
            content: "请登录后再打卡",
            showCancel: false,
            success: () => {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
                // 跳转到登录页面
              });
            }
          });
          return;
        }
        const timestamp = Math.floor(Date.now() / 1e3);
        const currentDate = /* @__PURE__ */ new Date();
        const currentDay = currentDate.toDateString();
        const signInDate = new Date(this.time * 1e3).toDateString();
        if (currentDay !== signInDate) {
          common_vendor.index.showModal({
            title: "提示",
            content: "不能打卡未来日期！",
            showCancel: false
          });
          return;
        }
        if (this.time < timestamp) {
          common_vendor.index.showModal({
            title: "提示",
            content: "无法对过去的时间打卡！",
            showCancel: false
          });
          return;
        }
        const morning = Math.floor(new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), (/* @__PURE__ */ new Date()).getDate(), 5, 0, 0).getTime() / 1e3);
        const noon = Math.floor(new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), (/* @__PURE__ */ new Date()).getDate(), 12, 0, 0).getTime() / 1e3);
        const evening = Math.floor(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 20, 30, 0).getTime() / 1e3);
        const result = await api_index.api.sign(data);
        if (result.code === 200) {
          this.isSignedIn = true;
          if (timestamp >= morning && timestamp < noon) {
            if (timestamp < this.time) {
              common_vendor.index.showModal({
                content: result.msg,
                icon: "success",
                success: () => {
                  setTimeout(() => {
                    common_vendor.index.switchTab({
                      url: "/pages/index/index"
                    });
                  }, 1e3);
                }
              });
            }
          } else if (timestamp >= noon && timestamp < evening) {
            if (timestamp < this.time) {
              common_vendor.index.showModal({
                content: result.msg,
                icon: "success",
                success: () => {
                  setTimeout(() => {
                    common_vendor.index.switchTab({
                      url: "/pages/index/index"
                    });
                  }, 1e3);
                }
              });
            }
          } else {
            common_vendor.index.showModal({
              title: "提示",
              content: result.msg || "打卡超时，请稍后重试",
              showCancel: false
            });
          }
        } else if (result.code === 201) {
          this.isSignedIn = false;
          common_vendor.index.showModal({
            title: "提示",
            content: result.msg || "你今日打卡已经超过限定次数",
            showCancel: false,
            success: () => {
              setTimeout(() => {
                common_vendor.index.switchTab({
                  url: "/pages/index/index"
                });
              }, 1e3);
            }
          });
        } else {
          common_vendor.index.showModal({
            title: "提示",
            content: result.msg || "操作失败，请稍后重试",
            showCancel: false
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Clock/Clock.vue:173", "请求打卡接口出错:", error);
        common_vendor.index.showModal({
          title: "提示",
          content: "打卡失败，请稍后重试。",
          showCancel: false
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.isSignedIn ? "已打卡" : "此次未打卡")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Clock/Clock.js.map
