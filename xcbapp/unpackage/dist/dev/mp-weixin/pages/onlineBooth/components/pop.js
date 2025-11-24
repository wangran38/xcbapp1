"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "pop",
  data() {
    return {
      show: false,
      styles: {}
    };
  },
  onShow() {
  },
  methods: {
    receive() {
      this.$emit("receive");
      this.show = false;
    },
    custom() {
      this.$refs.ani.step({
        translateY: "-2000px"
      }, {
        duration: 0
      });
      this.$refs.ani.step(
        {
          translateY: "-100px",
          opacity: 1
        },
        {
          duration: 500
        }
      );
      this.$refs.ani.run();
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  (_easycom_uni_icons2 + _easycom_uni_transition2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_transition = () => "../../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(""),
    b: common_vendor.p({
      fontFamily: "CustomFont",
      size: 26,
      color: "yellow"
    }),
    c: common_vendor.o((...args) => $options.receive && $options.receive(...args)),
    d: common_vendor.sr("ani", "65e0e8e1-0"),
    e: common_vendor.p({
      ["custom-class"]: "transition",
      ["mode-class"]: "fade",
      styles: $data.styles,
      show: true
    }),
    f: $data.show
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/onlineBooth/components/pop.js.map
