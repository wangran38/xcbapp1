"use strict";
const common_vendor = require("../../common/vendor.js");
const store_cart = require("../../store/cart.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      methodItems: [{
        "value": 1,
        "text": "摊位自取"
      }, {
        "value": 2,
        "text": "送货上门",
        "disable": true
      }],
      // 取菜方式列表
      selectMethod: null,
      // 已选择取菜方式
      totalCount: 0,
      cartList: [],
      pageData: [],
      shopDetails: {},
      cartItems: [],
      couponName: "选择优惠卷",
      couponPrice: "0.00",
      cartItemCount: 0,
      totalPrice: "0.00",
      paymentMethod: "请选择",
      // 初始值明确
      score: "",
      inputScore: "",
      isEditingScore: false,
      shop_id: "",
      single: 0,
      // 取货时间初始化为数字（timestamp）
      payway: 0,
      // 初始化支付方式标识，保证响应式
      cartStore: null
      // 提前初始化cartStore
    };
  },
  computed: {
    // 计算积分抵扣金额
    usableScoreAmount() {
      return parseFloat(this.inputScore / 10) || 0;
    },
    // 计算最终支付金额
    finalAmount() {
      var _a;
      const total = ((_a = this.cartStore) == null ? void 0 : _a.cartTotalByShopId(Number(this.shop_id))) || 0;
      const coupon = parseFloat(this.couponPrice) || 0;
      const scoreAmount = this.usableScoreAmount;
      return Math.max(total - coupon - scoreAmount, 0);
    },
    // 计算显示的支付方式（优化重复拼接问题）
    displayPaymentMethod() {
      if (this.isEditingScore) {
        return `使用积分 ${this.inputScore || 0}`;
      }
      const baseText = this.paymentMethod;
      if (baseText.startsWith("积分支付") && this.score) {
        return baseText.includes("积分余额") ? baseText : `${baseText} (积分余额: ${this.score})`;
      }
      return baseText;
    },
    cartList() {
      return this.cartStore.getCartsByShopId(this.shop_id);
    }
  },
  created() {
    this.cartStore = store_cart.useCartStore();
  },
  onLoad(query) {
    this.shop_id = Number(query.id) || 0;
    this.totalCount = this.cartStore.cartTotalByShopId(this.shop_id);
  },
  methods: {
    onChangeMethod({ detail }) {
      this.selectMethod = detail.value[0].value;
    },
    // 实现缺失的减少商品数量方法
    subItem(item) {
      this.cartStore.subItem(item);
    },
    // 实现缺失的增加商品数量方法
    addItem(item) {
      this.cartStore.addItem(item);
    },
    // 选择支付方式
    selectMethod() {
      const method = ["线上支付", "到付"];
      common_vendor.index.showActionSheet({
        itemList: method,
        success: (res) => {
          this.paymentMethod = method[res.tapIndex];
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/Buy/Buy.vue:169", "选择支付方式失败:", err);
        }
      });
    },
    clearCart() {
      this.cartStore.clearCart();
    },
    // 加载优惠券数据
    loadCouponData(id) {
      const couponData = common_vendor.index.getStorageSync("coupon");
      if (!couponData) {
        this.couponPrice = "0.00";
        this.couponName = "选择优惠卷";
        return;
      }
      let parsedCoupon = couponData;
      if (typeof parsedCoupon === "string") {
        try {
          parsedCoupon = JSON.parse(parsedCoupon);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/Buy/Buy.vue:191", "解析优惠券失败:", error);
          return;
        }
      }
      if ((parsedCoupon == null ? void 0 : parsedCoupon.type) === "object" && Array.isArray(parsedCoupon.data)) {
        parsedCoupon = parsedCoupon.data;
      }
      if (Array.isArray(parsedCoupon)) {
        const matchedCoupon = parsedCoupon.find((item) => item.id === parseInt(id));
        if (matchedCoupon) {
          this.couponName = matchedCoupon.coupon_name;
          this.couponPrice = matchedCoupon.price.toFixed(2);
        }
      }
    },
    // 获取用户积分
    async fetchUserProfile() {
      try {
        const response = await api_index.api.getUserProfile();
        if (response.code === 200) {
          this.score = response.data.score || 0;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Buy/Buy.vue:217", "获取用户积分失败:", error);
        common_vendor.index.showToast({
          title: "获取积分失败",
          icon: "none"
        });
      }
    },
    // 取货时间确认
    handleTimeConfirm(e) {
      this.single = e.value;
    },
    // 提交订单
    async addorder() {
      const orderItems = this.cartStore.getCartsByShopId(Number(this.shop_id)).map((item) => ({
        goods_id: item.id,
        goodsname: item.commodity_name,
        price: item.price,
        goodsnum: item.tempCount || 0
      }));
      if (!orderItems.length) {
        common_vendor.index.showToast({
          title: "您还未选购商品,无法提交订单!!!!",
          icon: "error",
          duration: 5e3
        });
        return;
      }
      if (!this.selectMethod) {
        common_vendor.index.showToast({
          title: "您还未选择取菜方式",
          icon: "error",
          duration: 5e3
        });
        return;
      }
      if (!this.single || this.single === 0) {
        common_vendor.index.showToast({
          title: "请选择取货时间",
          icon: "error"
        });
        return;
      }
      try {
        const shopId = Number(this.shop_id);
        const totalPrice = Number(this.cartStore.cartTotalByShopId(shopId));
        const goodsNum = this.cartStore.cartsLengthByShopId(shopId);
        const orderData = {
          pay_time: this.single,
          // 时间戳（后端若需字符串可转换：new Date(this.single).toLocaleString()）
          shop_id: shopId,
          goods_num: goodsNum,
          // 修复：调用cartStore的方法
          price: totalPrice,
          payprice: this.finalAmount,
          // 使用最终抵扣后的金额
          payway: this.payway,
          goods_arr: orderItems
        };
        const response = await api_index.api.addorder(orderData);
        if (response.code === 200) {
          common_vendor.index.showToast({
            title: "订单提交成功",
            icon: "success",
            duration: 1500,
            complete: () => {
              setTimeout(() => {
                this.clearCart();
                common_vendor.index.redirectTo({
                  url: `/subPackages/PaymentModule/collectOnDelivery/collectOnDelivery?out_trade_no=${response.data.out_trade_no}`
                });
              }, 1500);
            }
          });
        } else if (response.code === 201) {
          common_vendor.index.showToast({
            title: response.msg || "积分余额不足",
            icon: "none"
          });
        } else {
          common_vendor.index.showToast({
            title: "订单提交失败: " + (response.msg || "未知错误"),
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Buy/Buy.vue:314", "创建订单失败:", error);
        common_vendor.index.showToast({
          title: "订单创建失败",
          icon: "none"
        });
      }
    },
    // 积分输入失焦处理
    updatePaymentMethodOnBlur() {
      if (this.inputScore) {
        this.paymentMethod = `使用积分: ${this.inputScore}`;
        Vue.set(this, "payway", 1);
      } else {
        this.paymentMethod = "积分支付";
        Vue.set(this, "payway", 1);
      }
      this.isEditingScore = false;
    },
    // 支付方式点击处理
    handlePaymentMethodClick() {
      this.showActionSheet();
    },
    // 显示支付方式选择面板
    showActionSheet() {
      const paymentMethods = ["积分支付"];
      common_vendor.index.showActionSheet({
        itemList: paymentMethods,
        success: async (res) => {
          const selectedMethod = paymentMethods[res.tapIndex];
          this.paymentMethod = selectedMethod;
          if (selectedMethod === "积分支付") {
            await this.fetchUserProfile();
            Vue.set(this, "payway", 1);
            this.paymentMethod = `${selectedMethod} (积分余额: ${this.score})`;
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/Buy/Buy.vue:353", "选择支付方式失败:", err);
        }
      });
    },
    // 跳转到优惠券页面
    gotousecou() {
      common_vendor.index.redirectTo({
        url: "/pages/usecoupons/usecoupons"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_easycom_uni_data_picker2 + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_data_picker + _easycom_uni_datetime_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$options.cartList.length
  }, !$options.cartList.length ? {} : {}, {
    b: common_vendor.f($options.cartList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.shopTitle),
        b: item.imglogo,
        c: common_vendor.t(item.commodity_name),
        d: common_vendor.t(item.price),
        e: common_vendor.o(($event) => $options.subItem(item), index),
        f: common_vendor.t(item.tempCount),
        g: common_vendor.o(($event) => $options.addItem(item), index),
        h: index
      };
    }),
    c: common_vendor.o($options.onChangeMethod),
    d: common_vendor.o(($event) => $options.selectMethod = $event),
    e: common_vendor.p({
      localdata: $data.methodItems,
      multiple: false,
      modelValue: $options.selectMethod
    }),
    f: common_vendor.o($options.handleTimeConfirm),
    g: common_vendor.o(($event) => $data.single = $event),
    h: common_vendor.p({
      type: "datetime",
      ["clear-icon"]: false,
      ["return-type"]: "timestamp",
      modelValue: $data.single
    }),
    i: common_vendor.t($options.finalAmount),
    j: common_vendor.t($options.cartList.length),
    k: common_vendor.o((...args) => $options.addorder && $options.addorder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4ca90ae6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Buy/Buy.js.map
