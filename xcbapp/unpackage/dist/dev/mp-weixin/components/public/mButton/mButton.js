"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "mButton",
  data() {
    return {
      value: null
    };
  },
  methods: {
    /**
     * 触发父组件事件
     */
    btn1() {
      this.$emit("btn1", this.value);
    },
    btn2() {
      this.value = "";
      this.$emit("btn2", this.value);
    }
  },
  props: {
    placeholder: {
      required: false,
      default: "请输入关键字"
    },
    // 提示词
    buttonText1: {
      required: false,
      default: "搜索"
    },
    // 按钮文字
    buttonText2: {
      required: false,
      default: "清空"
    },
    isShowbutton2: {
      default: false
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "search",
      size: "18",
      color: "#b2b2b2"
    }),
    b: $props.placeholder,
    c: $data.value,
    d: common_vendor.o(($event) => $data.value = $event.detail.value),
    e: common_vendor.t($props.buttonText1),
    f: common_vendor.o((...args) => $options.btn1 && $options.btn1(...args)),
    g: $props.isShowbutton2
  }, $props.isShowbutton2 ? {
    h: common_vendor.t($props.buttonText2),
    i: common_vendor.o((...args) => $options.btn2 && $options.btn2(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e3b8d142"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/public/mButton/mButton.js.map
