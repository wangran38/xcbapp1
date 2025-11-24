"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  props: {
    show: Boolean,
    title: {
      type: String,
      default: "说明"
    },
    content: String,
    steps: Array,
    agreement: String,
    cancelText: {
      type: String,
      default: "不同意"
    },
    confirmText: {
      type: String,
      default: "同意"
    },
    cancelColor: {
      type: String,
      default: "#666"
    },
    confirmColor: {
      type: String,
      default: "#2196F3"
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    requireAgreement: Boolean
  },
  data() {
    return {
      isAgreed: false
    };
  },
  methods: {
    handleConfirm() {
      this.$emit("agree");
    },
    handleCancel() {
      this.$emit("disagree");
    },
    // 点击模态框关闭
    handleBackdropClick() {
      this.$emit("disagree");
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($props.title),
    b: common_vendor.p({
      type: "info-filled",
      size: "30"
    }),
    c: $props.content
  }, $props.content ? {
    d: common_vendor.t($props.content)
  } : {}, {
    e: common_vendor.t($props.cancelText),
    f: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    g: common_vendor.t($props.confirmText),
    h: $props.confirmColor,
    i: common_vendor.o((...args) => $options.handleConfirm && $options.handleConfirm(...args)),
    j: $props.show ? 1 : "",
    k: $props.show,
    l: $props.show ? 1 : "",
    m: common_vendor.o((...args) => $options.handleBackdropClick && $options.handleBackdropClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dbac7e05"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/beListed/componment/describe.js.map
