"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_public = require("../../../utils/public.js");
const api_index = require("../../../api/index.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  // 4. 混入公共方法
  mixins: [utils_public.myMixin],
  // 5. 数据定义
  data() {
    return {
      product: {},
      // 从上一页传递的商品数据
      productImages: [],
      // 商品轮播图（默认3张占位图）
      currentSwiperIndex: 0,
      // 当前轮播图索引
      showDetail: false,
      // 是否展开商品详情
      showTraceability: false,
      // 是否显示溯源弹窗
      showFullRules: false,
      // 是否显示完整规则
      selectedPoint: null,
      // 选中的提货点ID
      deliveryPoints: [
        // 提货点列表
        {
          id: 1,
          name: "绿鲜社区店",
          address: "朝阳区光华路8号底商",
          pickupTime: "09:00-21:00"
        },
        {
          id: 2,
          name: "智慧生活超市",
          address: "海淀区中关村大街12号",
          pickupTime: "08:30-22:00"
        },
        {
          id: 3,
          name: "生鲜便利店",
          address: "西城区西单北大街109号",
          pickupTime: "10:00-20:00"
        }
      ],
      // 规则文本
      shortRules: [
        "定金支付后不可退换",
        "提货时需出示订单二维码",
        "预售商品到货后统一配送"
      ],
      fullRules: [
        "定金支付后不可退换，如商品未按约定时间到货，系统将自动退款并补偿5元优惠券",
        "提货时需出示订单二维码，核对身份信息后方可提货，代提需提供双方有效证件",
        "预售商品到货后将统一配送到您选择的提货点，到货后会通过短信通知，请在3天内提货",
        "预订商品数量有限，每个用户ID限购5份，超出部分将按原价结算，不享受预售优惠",
        "商品保质期为到货后3天，请在保质期内提货并食用，逾期未提视为自动放弃",
        "如对商品质量有异议，请在提货后24小时内联系客服处理，逾期将不再受理"
      ],
      // 提交表单数据
      fromData: {
        farmer_id: "",
        goods_num: 1,
        // 默认购买1件
        price: 0,
        payprice: 0,
        payway: 2,
        // 支付方式：2=微信支付
        goods_arr: [],
        money: 0
        // 商品单价
      },
      query: {
        farmersgoods_id: null,
        page: 1,
        limit: 10
      }
    };
  },
  // 6. 页面加载时初始化
  onLoad({
    query
  }) {
    const jsonQuery = typeof query === "string" ? JSON.parse(query) : query;
    this.product = jsonQuery || {};
    this.query.farmersgoods_id = jsonQuery.farmersgoods_id;
    this.getData();
    this.fromData.farmer_id = this.product.id || "";
    this.fromData.money = parseFloat(this.product.price) || 0;
    if (this.deliveryPoints.length > 0) {
      this.selectedPoint = this.deliveryPoints[0].id;
    }
  },
  // 7. 计算属性（总金额）
  computed: {
    totalAmount() {
      if (isNaN(this.fromData.money) || isNaN(this.fromData.goods_num) || this.fromData.goods_num < 1) {
        return 0;
      }
      return new common_vendor.Decimal(this.fromData.money).mul(this.fromData.goods_num).toNumber();
    }
  },
  // 8. 方法定义
  methods: {
    async getData() {
      let data = await api_index.api.goodsinfoList(this.query);
      this.productImages = [this.product.imglogo];
      data.data.listdata.forEach((item) => {
        if (item.imgs.split(",").length > 1 && this.productImages.length < 10) {
          common_vendor.index.__f__("log", "at subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit.vue:336", item.imgs.split(","));
          this.productImages = [...this.productImages, ...item.imgs.split(",")];
        }
      });
    },
    // 轮播图切换事件
    onSwiperChange(e) {
      this.currentSwiperIndex = e.detail.current;
    },
    // 展开/收起商品详情
    toggleDetail() {
      this.showDetail = !this.showDetail;
    },
    // 选择提货点
    selectPoint(id) {
      this.selectedPoint = id;
    },
    // 数量输入框变化（限制正整数）
    onKeyInput(e) {
      const inputVal = e.detail.value.trim();
      const num = parseInt(inputVal);
      this.fromData.goods_num = isNaN(num) || num < 1 ? 1 : num;
    },
    // 减少购买数量
    minusGoods_num() {
      if (this.fromData.goods_num > 1) {
        this.fromData.goods_num--;
      }
    },
    // 增加购买数量
    addGoods_num() {
      this.fromData.goods_num++;
    },
    // 加入购物车（模拟）
    addToCart() {
      common_vendor.index.showToast({
        title: "已加入购物车",
        icon: "success",
        duration: 1500
      });
    },
    // 提交预售订单
    async handleSubmit() {
      var _a;
      if (!this.selectedPoint) {
        common_vendor.index.showToast({
          title: "请选择提货点",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (this.fromData.goods_num < 1) {
        common_vendor.index.showToast({
          title: "购买数量不能小于1",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (this.fromData.money <= 0) {
        common_vendor.index.showToast({
          title: "商品价格异常，请刷新",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.fromData.price = this.totalAmount;
      this.fromData.payprice = this.totalAmount;
      this.fromData.goods_arr = [{
        goods_id: this.product.id || "",
        goodsname: this.product.goodsname || "",
        goodsnum: this.fromData.goods_num,
        price: this.fromData.price,
        pay_time: Date.now()
      }];
      try {
        const res = await api_index.api.prePurchaseOrder(this.fromData);
        if (res.code === 200 && ((_a = res.data) == null ? void 0 : _a.out_trade_no)) {
          this.startPayment(res.data.out_trade_no);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "订单提交失败",
            icon: "error",
            duration: 2e3
          });
          this.fromData.goods_arr = [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit.vue:439", "提交订单异常：", err);
        common_vendor.index.showToast({
          title: "网络异常，请稍后重试",
          icon: "error",
          duration: 2e3
        });
        this.fromData.goods_arr = [];
      }
    },
    // 发起微信支付
    async startPayment(out_trade_no) {
      try {
        const payRes = await api_index.api.wechatpay({
          out_trade_no
        });
        if (payRes.code === 200 && payRes.data) {
          const payParams = {
            ...payRes.data,
            timeStamp: payRes.data.timeStamp.toString(),
            nonceStr: payRes.data.nonceStr || "",
            package: payRes.data.package || "",
            signType: payRes.data.signType || "MD5",
            paySign: payRes.data.paySign || ""
          };
          common_vendor.index.requestPayment({
            ...payParams,
            success: () => {
              common_vendor.index.showToast({
                title: "预订成功",
                icon: "success",
                duration: 2e3
              });
              setTimeout(() => common_vendor.index.navigateBack({
                delta: 1
              }), 2e3);
            },
            fail: () => {
              common_vendor.index.showToast({
                title: "支付已取消",
                icon: "none",
                duration: 2e3
              });
            },
            complete: () => {
              this.fromData.goods_arr = [];
            }
          });
        } else if (payRes.code === 202) {
          await this.bindOpenIDAndPay(out_trade_no);
        } else {
          common_vendor.index.showToast({
            title: payRes.msg || "获取支付参数失败",
            icon: "error",
            duration: 2e3
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit.vue:504", "支付异常：", err);
        common_vendor.index.showToast({
          title: "支付服务异常",
          icon: "error",
          duration: 2e3
        });
      }
    },
    // 绑定OpenID并重新支付
    async bindOpenIDAndPay(out_trade_no) {
      try {
        const loginRes = await new Promise((resolve, reject) => {
          common_vendor.index.login({
            provider: "weixin",
            success: resolve,
            fail: reject
          });
        });
        if (loginRes.code) {
          const bindRes = await api_index.api.bindingOpenid({
            code: loginRes.code
          });
          if (bindRes.code === 200) {
            await this.startPayment(out_trade_no);
          } else {
            common_vendor.index.showToast({
              title: "账号绑定失败",
              icon: "none",
              duration: 2e3
            });
          }
        } else {
          common_vendor.index.showToast({
            title: "获取微信登录信息失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit.vue:548", "绑定OpenID异常：", err);
        common_vendor.index.showToast({
          title: "绑定服务异常",
          icon: "none",
          duration: 2e3
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.productImages, (img, index, i0) => {
      return {
        a: img,
        b: index
      };
    }),
    b: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    c: common_vendor.t($data.currentSwiperIndex + 1),
    d: common_vendor.t($data.productImages.length),
    e: common_vendor.t($data.product.goodsname || "未命名商品"),
    f: common_vendor.t($data.product.price || 0),
    g: $data.product.originalPrice
  }, $data.product.originalPrice ? {
    h: common_vendor.t($data.product.originalPrice)
  } : {}, {
    i: common_vendor.t($data.product.unit),
    j: common_vendor.t($data.product.sales || 0),
    k: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    l: common_vendor.t($data.product.content || "暂无信息"),
    m: common_vendor.o(($event) => $data.showTraceability = true),
    n: $data.showDetail ? 1 : "",
    o: common_vendor.p({
      type: "down",
      size: "18",
      color: "#999"
    }),
    p: common_vendor.o((...args) => $options.toggleDetail && $options.toggleDetail(...args)),
    q: $data.showDetail
  }, $data.showDetail ? {
    r: common_vendor.t($data.product.fromcontent || "暂无信息")
  } : {}, {
    s: common_vendor.p({
      type: "minus",
      size: "20"
    }),
    t: $data.fromData.goods_num <= 1 ? 1 : "",
    v: common_vendor.o((...args) => $options.minusGoods_num && $options.minusGoods_num(...args)),
    w: common_vendor.o([($event) => $data.fromData.goods_num = $event.detail.value, (...args) => $options.onKeyInput && $options.onKeyInput(...args)]),
    x: $data.fromData.goods_num,
    y: common_vendor.p({
      type: "plus",
      size: "20"
    }),
    z: common_vendor.o((...args) => $options.addGoods_num && $options.addGoods_num(...args)),
    A: common_vendor.f($data.shortRules, (rule, index, i0) => {
      return {
        a: "45c8e94c-4-" + i0,
        b: common_vendor.t(rule),
        c: index
      };
    }),
    B: common_vendor.p({
      type: "circle",
      size: "12",
      color: "#1890FF"
    }),
    C: common_vendor.p({
      type: "right",
      size: "14",
      color: "#1890FF"
    }),
    D: common_vendor.o(($event) => $data.showFullRules = true),
    E: common_vendor.t($options.totalAmount.toFixed(2)),
    F: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    G: !$data.selectedPoint,
    H: common_vendor.o(($event) => $data.showTraceability = false),
    I: common_vendor.p({
      type: "close",
      size: "22",
      color: "#999"
    }),
    J: common_assets._imports_0$3,
    K: common_assets._imports_1,
    L: common_vendor.t($data.product.trace && $data.product.trace.farmer || "张建国"),
    M: common_vendor.p({
      type: "verified",
      size: "18",
      color: "#1890FF"
    }),
    N: common_vendor.o(($event) => $data.showTraceability = $event),
    O: common_vendor.p({
      mode: "bottom",
      modelValue: $data.showTraceability
    }),
    P: common_vendor.o(($event) => $data.showFullRules = false),
    Q: common_vendor.p({
      type: "close",
      size: "22",
      color: "#999"
    }),
    R: common_vendor.f($data.fullRules, (rule, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(rule),
        c: index
      };
    }),
    S: common_vendor.o(($event) => $data.showFullRules = $event),
    T: common_vendor.p({
      mode: "center",
      modelValue: $data.showFullRules
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-45c8e94c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit.js.map
