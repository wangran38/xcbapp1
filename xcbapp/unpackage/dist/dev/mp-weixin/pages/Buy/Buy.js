"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      cart: [],
      pageData: [],
      shopDetails: {},
      cartItems: [],
      couponName: "选择优惠卷",
      couponPrice: "0.00",
      cartItemCount: 0,
      totalPrice: "0.00",
      paymentMethod: "请选择",
      score: "",
      inputScore: "",
      isEditingScore: false,
      shop_id: "",
      single: ""
    };
  },
  computed: {
    ...common_vendor.mapState("cart", ["carts"]),
    ...common_vendor.mapGetters("cart", ["cartTotalByShopId", "getTempCount", "cartsLengthByShopId", "getCartsByShopId"]),
    // 计算积分金额
    usableScoreAmount() {
      return parseFloat(this.inputScore / 10) || 0;
    },
    // 计算最终支付金额
    finalAmount() {
      const total = this.cartTotalByShopId;
      const coupon = parseFloat(this.couponPrice) || 0;
      const scoreAmount = this.usableScoreAmount;
      return Math.max(total - coupon - scoreAmount, 0);
    },
    // totalItemCount() {
    // 	return this.filteredCarts.reduce((total, item) => {
    // 		return total + this.getTempCount(item.id);
    // 	}, 0);
    // },
    // 计算显示的支付方式
    displayPaymentMethod() {
      if (this.isEditingScore) {
        return `使用积分 ${this.inputScore}`;
      }
      return this.paymentMethod + (this.paymentMethod.startsWith("积分支付") ? ` (积分余额: ${this.score})` : "");
    },
    currentShopId() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const query = currentPage.options;
      const shopId = Number(query == null ? void 0 : query.id);
      return shopId;
    }
    // filteredCarts() {
    // 	return this.carts.filter(item => item.shop_id === parseInt(this.currentShopId));
    // },
  },
  mounted() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const query = currentPage.options;
    this.shop_id = query.id;
  },
  methods: {
    selectMethod() {
      const method = ["线上支付", "到付"];
      common_vendor.index.showActionSheet({
        itemList: method,
        success: async (res) => {
          const selectedMethod = method[res.tapIndex];
          this.paymentMethod = selectedMethod;
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/Buy/Buy.vue:175", "选择支付方式失败:", err);
        }
      });
    },
    ...common_vendor.mapMutations("cart", ["addItem", "subItem", "clearCart"]),
    clearCart() {
      this.$store.commit("cart/clearCart");
    },
    loadCouponData(id) {
      if (!id) {
        this.couponPrice = "";
        this.couponName = "选择优惠卷";
        return;
      }
      let couponData = common_vendor.index.getStorageSync("coupon");
      if (typeof couponData === "string") {
        try {
          couponData = JSON.parse(couponData);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/Buy/Buy.vue:199", "解析 coupon 数据失败:", error);
          return;
        }
      }
      if (couponData && couponData.type === "object" && Array.isArray(couponData.data)) {
        couponData = couponData.data;
      }
      if (Array.isArray(couponData)) {
        const matchedCoupon = couponData.find((item) => item.id === parseInt(id));
        if (matchedCoupon) {
          this.couponName = matchedCoupon.coupon_name;
          this.couponPrice = matchedCoupon.price.toFixed(2);
        }
      } else {
        common_vendor.index.__f__("error", "at pages/Buy/Buy.vue:217", "coupon 数据格式不正确:", couponData);
      }
    },
    async fetchUserProfile() {
      const response = await api_index.api.getUserProfile();
      if (response.code === 200) {
        const {
          score
        } = response.data;
        this.score = score;
      }
    },
    async addorder(data) {
      const orderItems = this.getCartsByShopId(this.shop_id).map((item) => ({
        goods_id: item.id,
        goodsname: item.commodity_name,
        price: item.price,
        goodsnum: item.tempCount
      }));
      if (!orderItems.length) {
        common_vendor.index.showToast({
          title: "您还未选购商品,无法提交订单!!!!",
          icon: "error",
          duration: 5e3
        });
        return;
      }
      try {
        const remainingAmount = parseFloat(this.cartTotalByShopId(this.shop_id));
        const Totalpoints = parseFloat(this.score) / 10;
        if (!this.single) {
          common_vendor.index.showToast({
            title: "还没选取货时间呢",
            icon: "error"
          });
          return;
        }
        const orderData = {
          pay_time: this.single,
          shop_id: Number(this.shop_id),
          goods_num: this.cartsLengthByShopId(this.shop_id),
          // 商品数量
          price: Number(this.cartTotalByShopId(this.shop_id)),
          // 订单合计金额
          payprice: Number(this.cartTotalByShopId(this.shop_id)),
          // 实际支付金额
          payway: this.payway,
          goods_arr: orderItems
          // 商品数组
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
            title: "订单提交失败: " + response.msg,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Buy/Buy.vue:320", "创建订单失败:", error);
        common_vendor.index.showToast({
          title: "订单创建失败",
          icon: "none"
        });
      }
    },
    updatePaymentMethodOnBlur() {
      if (this.inputScore) {
        this.paymentMethod = `使用积分: ${this.inputScore}`;
        this.$set(this, "payway", 1);
      } else {
        this.paymentMethod = "积分支付";
        this.$set(this, "payway", 1);
      }
      this.isEditingScore = false;
    },
    handlePaymentMethodClick() {
      this.showActionSheet();
    },
    showActionSheet() {
      const paymentMethods = ["积分支付"];
      common_vendor.index.showActionSheet({
        itemList: paymentMethods,
        success: async (res) => {
          const selectedMethod = paymentMethods[res.tapIndex];
          this.paymentMethod = selectedMethod;
          if (selectedMethod === "积分支付") {
            await this.fetchUserProfile();
            this.payway = 1;
          } else if (selectedMethod === "微信支付") {
            this.payway = 2;
          } else if (selectedMethod === "支付宝支付") {
            this.payway = 3;
          }
          common_vendor.index.__f__("log", "at pages/Buy/Buy.vue:368", "更新后的支付方式:", this.paymentMethod);
          this.paymentMethod += selectedMethod === "积分支付" ? ` (积分余额: ${this.score})` : "";
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/Buy/Buy.vue:372", "选择支付方式失败:", err);
        }
      });
    },
    gotousecou() {
      common_vendor.index.redirectTo({
        url: "/pages/usecoupons/usecoupons"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_easycom_uni_icons2 + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_datetime_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.getCartsByShopId($data.shop_id), (item, k0, i0) => {
      return {
        a: common_vendor.t(item.shopTitle),
        b: "4ca90ae6-0-" + i0,
        c: item.imglogo,
        d: common_vendor.t(item.commodity_name),
        e: common_vendor.t(item.price.toFixed(2)),
        f: common_vendor.o(($event) => _ctx.subItem(item), item.id),
        g: common_vendor.t(_ctx.getTempCount(item.id)),
        h: common_vendor.o(($event) => _ctx.addItem(item), item.id),
        i: item.id
      };
    }),
    b: common_vendor.p({
      type: "right",
      size: "14",
      color: "#ccc"
    }),
    c: common_vendor.p({
      type: "right",
      size: "14",
      color: "#ccc"
    }),
    d: common_vendor.o(($event) => $data.single = $event),
    e: common_vendor.p({
      type: "datetime",
      ["clear-icon"]: false,
      ["return-type"]: "timestamp",
      modelValue: $data.single
    }),
    f: common_vendor.t(_ctx.cartTotalByShopId($data.shop_id)),
    g: common_vendor.t(_ctx.cartsLengthByShopId($data.shop_id)),
    h: common_vendor.o((...args) => $options.addorder && $options.addorder(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4ca90ae6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Buy/Buy.js.map
