"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        notifyEnabled: true,
        wechatPayEnabled: true,
        pointsPayEnabled: false,
        pointsRatio: 10,
        deliveryEnabled: true
      },
      showRatioPicker: false,
      messageStatusText: null,
      messageStatus: ""
    };
  },
  onLoad() {
    this.loadSettings();
    common_vendor.index.getSetting({
      withSubscriptions: true,
      // 同时获取用户的订阅消息状态
      success: (res) => {
        common_vendor.index.__f__("log", "at subPackages/boothOwner/storeSettings/storeSettings.vue:93", res);
        if (!res.subscriptionsSetting.mainSwitch) {
          this.messageStatus = true;
          this.messageStatusText = "订阅";
        } else {
          this.messageStatus = false;
          this.messageStatusText = "已订阅";
          common_vendor.index.__f__("log", "at subPackages/boothOwner/storeSettings/storeSettings.vue:101", "用户已订阅");
        }
      }
    });
  },
  methods: {
    // 打开消息订阅授权
    switchMessage() {
      common_vendor.index.requestSubscribeMessage({
        tmplIds: ["PN8Vc4Z5rWUHi05A6F-J73TkkpF4iHxkEtA6bIoFUPw"],
        success: (res) => {
          if (res["PN8Vc4Z5rWUHi05A6F-J73TkkpF4iHxkEtA6bIoFUPw"] == "accept") {
            this.messageStatus = false;
            this.messageStatusText = "已订阅";
          } else {
            this.messageStatus = true;
            this.messageStatusText = "订阅";
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at subPackages/boothOwner/storeSettings/storeSettings.vue:124", err);
        }
      });
    },
    loadSettings() {
      try {
        const settings = common_vendor.index.getStorageSync("shopSettings");
        if (settings)
          this.form = { ...this.form, ...settings };
      } catch (e) {
        common_vendor.index.__f__("error", "at subPackages/boothOwner/storeSettings/storeSettings.vue:133", "加载设置失败:", e);
      }
    },
    setForm(key, value) {
      this.form[key] = value;
      this.saveSettings();
    },
    saveSettings() {
      try {
        common_vendor.index.setStorageSync("shopSettings", this.form);
        common_vendor.index.showToast({ title: "设置已保存", icon: "none" });
      } catch (e) {
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      }
    },
    saveRatio() {
      this.showRatioPicker = false;
      this.saveSettings();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.wechatPayEnabled,
    b: common_vendor.o((val) => $options.setForm("wechatPayEnabled", val.detail.value)),
    c: $data.form.pointsPayEnabled,
    d: common_vendor.o((val) => $options.setForm("pointsPayEnabled", val.detail.value)),
    e: $data.form.deliveryEnabled,
    f: common_vendor.o((val) => $options.setForm("deliveryEnabled", val.detail.value))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-746e0b01"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/boothOwner/storeSettings/storeSettings.js.map
