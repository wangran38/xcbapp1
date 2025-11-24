"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "menuBarVue",
  data() {
    return {
      show: false,
      count: "",
      OpenImg: false,
      selectImgUrl: null
    };
  },
  methods: {
    viewDetail() {
      common_vendor.index.navigateTo({
        url: `/pages/commodityDetail/commodityDetail?query=${JSON.stringify(this.item)}`
      });
    },
    // 放大图片
    openBigImg(url) {
    },
    changeTextarea(e) {
    },
    // 加一
    add() {
      this.addItem(this.item);
      this.count = "";
    },
    // 减一
    reduce() {
      common_vendor.index.__f__("log", "at components/menuBar.vue:77", this.item);
      this.subItem(this.item);
      this.count = "";
    },
    // isNumeric(str) {
    //     return /^\d+$/.test(str);
    // },
    // int float  校验
    isNumeric(str) {
      return /^\d+(\.\d+)?$/.test(str);
    },
    // 结束输入值
    overInput(e) {
      if (this.isNumeric(e.detail.value)) {
        let value = Number(Number(e.detail.value).toFixed(1));
        this.item.count = value;
        this.anyNumber(this.item);
        this.count = value;
      } else {
        common_vendor.index.showToast({
          title: "数值有误",
          icon: "error"
        });
        this.count = "";
      }
      this.show = false;
    },
    // 弹出键盘
    showInput() {
      this.$emit("showKeyboard", this.item);
    },
    goToSuyuan(item) {
      common_vendor.index.navigateTo({
        url: `/subPackages/aHouseholder/lookTraceability/lookTraceability?commodity_id=${item.id}`
      });
    },
    ...common_vendor.mapMutations("cart", ["addItem", "subItem", "anyNumber"])
  },
  props: ["item"],
  computed: {
    // ...mapState('cart', ['carts']),
    // ...mapGetters('cart', ['getTempCount']),
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.item.imglogo,
    b: common_vendor.o(($event) => $options.openBigImg($props.item.imglogo)),
    c: common_vendor.t($props.item.commodity_name),
    d: common_vendor.p({
      type: "right",
      size: "14",
      color: "#ccc"
    }),
    e: common_vendor.o((...args) => $options.viewDetail && $options.viewDetail(...args)),
    f: common_vendor.o(($event) => $options.goToSuyuan($props.item)),
    g: common_vendor.t($props.item.price.toFixed(2)),
    h: common_vendor.t($props.item.weight_name),
    i: common_vendor.o((...args) => $options.reduce && $options.reduce(...args)),
    j: !$data.show
  }, !$data.show ? {
    k: common_vendor.t(_ctx.getTempCount($props.item.id))
  } : {}, {
    l: $data.show
  }, $data.show ? {
    m: common_vendor.o((...args) => $options.overInput && $options.overInput(...args)),
    n: $data.show,
    o: common_vendor.o([($event) => $data.count = $event.detail.value, (...args) => $options.changeTextarea && $options.changeTextarea(...args)]),
    p: $data.count
  } : {}, {
    q: common_vendor.o((...args) => $options.showInput && $options.showInput(...args)),
    r: common_vendor.o((...args) => $options.add && $options.add(...args)),
    s: $data.OpenImg
  }, $data.OpenImg ? {
    t: common_vendor.o(($event) => $data.OpenImg = false),
    v: common_vendor.p({
      mode: "scaleToFill",
      type: "closeempty",
      size: "20px"
    }),
    w: $data.selectImgUrl,
    x: common_vendor.o(($event) => $data.OpenImg = false)
  } : {}, {
    y: common_vendor.o(($event) => $data.show = false)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/menuBar.js.map
