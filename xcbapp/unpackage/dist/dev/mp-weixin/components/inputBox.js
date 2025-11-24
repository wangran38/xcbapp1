"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "inputBox",
  data() {
    return {
      show: false,
      value: "等待输入......",
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
      funs: [
        "删除",
        "清空",
        "确定"
      ],
      lock: true,
      // 键盘锁
      animationData: {},
      cartItem: 0
    };
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue[0] == ".") {
        this.value = "0" + this.value;
      }
      newValue.split(".");
      if (newValue.split(".").length - 1 > 1) {
        this.value = oldValue;
      }
      if (newValue == "00") {
        this.value = oldValue;
      }
      try {
        if (newValue.split(".")[1].length >= 2) {
          this.value = oldValue;
        }
      } catch {
      }
      let value = Number(Number(this.value));
      this.cartItem.count = value;
      this.anyNumber(this.cartItem);
    },
    // 监听数字键盘是否弹起
    show(newValue, oldValue) {
      if (newValue) {
        this.value = this.getTempCount(this.cartItem.id) + "";
      }
    }
  },
  computed: {
    ...common_vendor.mapGetters("cart", ["getTempCount"]),
    singleItemPrice() {
      return new common_vendor.Decimal(this.cartItem.price).mul(new common_vendor.Decimal(this.value)).toNumber();
    }
  },
  methods: {
    // state购物车自定义数量
    ...common_vendor.mapMutations("cart", ["anyNumber"]),
    isNumeric(str) {
      return /^\d+(\.\d+)?$/.test(str);
    },
    // 收起键盘
    close() {
      this.show = false;
    },
    // 输入数字
    inputNum(num) {
      if (this.value == "0") {
        this.value = num;
      } else {
        this.value += num;
      }
    },
    // 功能函数
    func(lable) {
      switch (lable) {
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
    remove() {
      this.value = this.value.substring(0, this.value.length - 1);
    },
    // 清空值
    clear() {
      this.value = "";
    },
    // 确认提交
    sure() {
      if (!this.value) {
        this.cartItem.count = 0;
        this.anyNumber(this.cartItem);
        this.show = false;
      }
      if (this.isNumeric(this.value)) {
        let value = Number(Number(this.value));
        this.cartItem.count = value;
        this.anyNumber(this.cartItem);
        this.show = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.value),
    b: common_vendor.t($data.cartItem.commodity_name),
    c: common_vendor.t($data.cartItem.price),
    d: common_vendor.t($data.cartItem.weight_name),
    e: common_vendor.t($options.singleItemPrice),
    f: common_vendor.f($data.keys, (item, k0, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: common_vendor.o(($event) => item != "取消" ? $options.inputNum(item) : $options.func(item), item)
      };
    }),
    g: common_vendor.f($data.funs, (item, k0, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.func(item))
      };
    }),
    h: $data.show,
    i: common_vendor.o(() => {
    }),
    j: common_vendor.o((...args) => $options.close && $options.close(...args)),
    k: $data.show,
    l: $data.animationData
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/inputBox.js.map
