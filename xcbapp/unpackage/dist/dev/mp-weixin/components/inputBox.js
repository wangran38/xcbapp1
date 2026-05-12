"use strict";
const store_cart = require("../store/cart.js");
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "inputBox",
  data() {
    return {
      show: false,
      value: "",
      // 保持字符串类型，方便小数点处理
      keys: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        ".",
        "取消"
      ],
      unit: "",
      funs: ["删除", "清空", "确定"],
      lock: true,
      // 键盘锁
      animationData: {},
      cartItem: {},
      // 商品信息
      cartStore: {}
    };
  },
  watch: {
    value(newValue, oldValue) {
      const newStrValue = String(newValue).trim();
      const oldStrValue = String(oldValue).trim();
      if (newStrValue !== this.value) {
        this.value = newStrValue;
        return;
      }
      if (!newStrValue)
        return;
      if (newStrValue.charAt(0) === ".") {
        this.value = `0${newStrValue}`;
        return;
      }
      const dotArr = newStrValue.split(".");
      if (dotArr.length - 1 > 1) {
        this.value = oldStrValue;
        return;
      }
      if (newStrValue.startsWith("00") && dotArr.length === 1) {
        this.value = oldStrValue;
        return;
      }
      if (dotArr.length === 2 && dotArr[1].length > 1) {
        this.value = oldStrValue;
      }
    },
    // 监听数字键盘是否弹起
    show(newValue) {
      if (newValue) {
        const tempCount = this.cartStore.getTempCount(this.cartItem.id) || 0;
        this.value = String(tempCount);
      }
    }
  },
  computed: {
    singleItemPrice() {
      const price = Number(this.cartItem.price) || 0;
      const count = Number(this.value) || 0;
      return (price * count).toFixed(2);
    }
  },
  created() {
    this.cartStore = store_cart.useCartStore();
  },
  methods: {
    // 校验是否为数字（支持小数）
    isNumeric(str) {
      return /^\d+(\.\d+)?$/.test(str);
    },
    // 收起键盘
    close() {
      this.show = false;
    },
    // 输入数字/小数点
    inputNum(num) {
      let currentValue = String(this.value).trim();
      if (num === ".") {
        if (currentValue.includes("."))
          return;
        if (!currentValue) {
          this.value = "0.";
          return;
        }
        this.value = `${currentValue}.`;
        return;
      }
      if (currentValue === "0") {
        this.value = num;
      } else {
        this.value = `${currentValue}${num}`;
      }
    },
    // 功能函数
    func(label) {
      switch (label) {
        case "删除":
          this.remove();
          break;
        case "取消":
          this.close();
          break;
        case "清空":
          this.clear();
          break;
        case "确定":
          this.sure();
          break;
      }
    },
    // 删除最后一位
    remove() {
      if (!this.value)
        return;
      this.value = this.value.substring(0, this.value.length - 1);
    },
    // 清空值（设为空字符串，保持类型一致）
    clear() {
      this.value = "";
      if (this.cartItem.id) {
        this.cartItem.count = 0;
        this.anyNumber(this.cartItem);
      }
    },
    // 确认提交
    sure() {
      let finalCount = 0;
      if (this.value && this.isNumeric(this.value)) {
        finalCount = Number(this.value);
      }
      if (this.cartItem.id) {
        this.cartItem.count = finalCount;
        this.anyNumber(this.cartItem);
      }
      this.show = false;
    },
    anyNumber(cartItem) {
      this.cartStore.anyNumber(cartItem);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.cartItem.commodity_name || "商品"),
    b: common_vendor.t($data.cartItem.price || 0),
    c: common_vendor.t($data.value || "0"),
    d: common_vendor.t($options.singleItemPrice),
    e: common_vendor.f($data.keys, (item, k0, i0) => {
      return {
        a: common_vendor.t(item),
        b: item === "取消" ? 1 : "",
        c: item,
        d: common_vendor.o(($event) => item !== "取消" ? $options.inputNum(item) : $options.func(item), item)
      };
    }),
    f: common_vendor.o(($event) => $options.func("删除")),
    g: common_vendor.o(($event) => $options.func("清空")),
    h: common_vendor.o(($event) => $options.func("确定")),
    i: $data.show,
    j: common_vendor.o(() => {
    }),
    k: common_vendor.o((...args) => $options.close && $options.close(...args)),
    l: $data.show,
    m: $data.animationData
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c235284e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/inputBox.js.map
