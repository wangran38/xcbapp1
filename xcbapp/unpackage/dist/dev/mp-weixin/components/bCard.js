"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
const _sfc_main = {
  name: "bCard",
  data() {
    return {
      moreStatus: false
      // 控制解除绑定按钮是否显示
    };
  },
  props: ["info"],
  methods: {
    // 打开解除绑定
    onLift() {
      this.moreStatus = !this.moreStatus;
    },
    // 解除绑定
    unbind() {
      common_vendor.index.showModal({
        title: "真的要解除绑定吗??",
        cancelText: "否",
        confirmText: "是",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.__f__("log", "at components/bCard.vue:46", this.info);
            let requestsData = {
              id: this.info.Id,
              status: 1
            };
            let res2 = await api_index.api.editshopbank(requestsData);
            common_vendor.index.__f__("log", "at components/bCard.vue:53", res2);
            this.$emit("remove");
          }
          this.moreStatus = false;
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_transition = common_vendor.resolveComponent("transition");
  (_easycom_uni_tag2 + _easycom_uni_icons2 + _component_transition)();
}
const _easycom_uni_tag = () => "../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_tag + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.info.bankname),
    b: common_vendor.t($props.info.banknumber),
    c: $props.info.isuse == 2,
    d: common_vendor.p({
      text: "默认使用",
      type: "success",
      inverted: "true"
    }),
    e: common_vendor.o($options.onLift),
    f: common_vendor.p({
      type: "more-filled",
      size: "20"
    }),
    g: $data.moreStatus,
    h: common_vendor.o((...args) => $options.unbind && $options.unbind(...args)),
    i: common_vendor.p({
      name: "fade"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/bCard.js.map
