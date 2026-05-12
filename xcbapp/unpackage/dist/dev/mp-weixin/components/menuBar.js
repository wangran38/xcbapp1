"use strict";
const common_vendor = require("../common/vendor.js");
const store_cart = require("../store/cart.js");
const _sfc_main = {
  name: "menuBarVue",
  props: ["item"],
  // 保留原有 props
  data() {
    return {
      show: false,
      count: "",
      OpenImg: false,
      selectImgUrl: null,
      cartStore: null
      // 2. 初始化 Pinia 实例容器
    };
  },
  created() {
    this.cartStore = store_cart.useCartStore();
  },
  computed: {
    getTempCount() {
      return (itemId) => {
        const targetGoods = this.cartStore.carts.find(
          (goods) => goods.id === itemId && goods.shop_id === this.item.shop_id
        );
        return targetGoods ? targetGoods.tempCount : 0;
      };
    }
  },
  methods: {
    viewDetail() {
      common_vendor.index.navigateTo({
        url: `/pages/commodityDetail/commodityDetail?query=${JSON.stringify(this.item)}`
      });
    },
    // 放大图片（保留原有逻辑）
    openBigImg(url) {
    },
    changeTextarea(e) {
    },
    add() {
      this.cartStore.addItem(this.item);
      this.count = "";
    },
    reduce() {
      common_vendor.index.__f__("log", "at components/menuBar.vue:86", this.item);
      this.cartStore.subItem({
        id: this.item.id,
        shop_id: this.item.shop_id
        // 传递 shop_id 用于精准匹配
      });
      this.count = "";
    },
    // 数值校验（保留原有逻辑）
    isNumeric(str) {
      return /^\d+(\.\d+)?$/.test(str);
    },
    // 结束输入值：替换原 Vuex 的 anyNumber mutation
    overInput(e) {
      if (this.isNumeric(e.detail.value)) {
        let value = Number(Number(e.detail.value).toFixed(1));
        this.cartStore.anyNumber({
          ...this.item,
          quantity: value
          // 传入新数量
        });
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
    showInput() {
      this.$emit("showKeyboard", this.item);
    },
    goToSuyuan(item) {
      common_vendor.index.navigateTo({
        url: `/subPackages/aHouseholder/lookTraceability/lookTraceability?commodity_id=${item.id}`
      });
    }
    // 5. 移除原 Vuex 的 mapMutations 扩展（已替换为 Pinia 直接调用）
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
    k: common_vendor.t($options.getTempCount($props.item.id))
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
