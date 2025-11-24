"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      isPayment: false,
      out_trade_no: null,
      // 这里先写示例编号，实际由后端生成返回
      createtime: null,
      // 示例下单时间，实际由后端传递
      productList: [],
      totalPrice: 0,
      // 根据菜品单价和数量计算得出，示例价格
      otherFees: 0,
      // 其他费用
      totalAmount: 0,
      // 最终价格
      countDownTime: 15,
      // 设置倒计时时长，单位为分钟，可根据实际需求调整
      countDown: null,
      // 存储倒计时定时器实例
      isTimeOut: false,
      // 是否超时标志
      formattedCountDown: "",
      // 格式化后的倒计时显示文本
      PaymentTimer: null,
      paymentMethods: [
        {
          title: "微信支付",
          code: 1
        },
        {
          title: "积分支付",
          code: 2
        },
        {
          title: "数字人民币",
          code: 3
        }
      ],
      selectedPaymentMethod: 2,
      // 用户选择的支付方式
      supportMethod: [1, 2]
      // 目前支付的支付方式
    };
  },
  mounted() {
    this.startCountDown();
    this.PaymentTimer = setInterval(async () => {
      let {
        data
      } = await api_index.api.getorderinfo({
        out_trade_no: this.out_trade_no
      });
      if (data.is_pay == 2 && data.success_time != "") {
        clearInterval(this.PaymentTimer);
        common_vendor.index.redirectTo({
          url: `/pages/orders/orders?orderStatus=3`
        });
      }
    }, 2500);
  },
  beforeDestroy() {
    this.clearCountDown();
  },
  async onLoad(value) {
    this.out_trade_no = value.out_trade_no;
    let res = await api_index.api.myorders(value);
    if (res.code == 200) {
      let data = res.data.listdata[0];
      this.createtime = data.createtime;
      this.productList = data.list_arr;
      this.totalPrice = data.price;
      this.totalAmount = this.totalPrice + this.otherFees;
    } else {
      common_vendor.index.showToast({
        title: res.msg || res.message
      });
    }
  },
  onUnload() {
    clearInterval(this.PaymentTimer);
  },
  methods: {
    /**
     * 格式化时间
     */
    initTime(str) {
      let timestamp = new Date(str).getTime();
      var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1e3) : new Date(parseInt(
        timestamp
      ));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      if (m < 10) {
        m = "0" + m;
      }
      var d = time.getDate();
      if (d < 10) {
        d = "0" + d;
      }
      var h = time.getHours();
      if (h < 10) {
        h = "0" + h;
      }
      var mm = time.getMinutes();
      if (mm < 10) {
        mm = "0" + mm;
      }
      var s = time.getSeconds();
      if (s < 10) {
        s = "0" + s;
      }
      var timeStr = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
      return timeStr;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 选择支付方式
    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method.code;
    },
    // 调用微信支付方法
    async startPayment(out_trade_no) {
      let data = await api_index.api.wechatpay({
        out_trade_no: this.out_trade_no
      });
      if (data.code == 200) {
        data.data.timeStamp += "";
        common_vendor.index.requestPayment({
          ...data.data
        });
      } else if (data.code == 202) {
        common_vendor.index.login({
          provider: "true",
          success: async (res) => {
            let idReseponse = await api_index.api.bindingOpenid({
              code: res.code
            });
            common_vendor.index.__f__("log", "at subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.vue:224", idReseponse, data);
            if (idReseponse.code == 200) {
              let data2 = await api_index.api.wechatpay({
                out_trade_no: this.out_trade_no
              });
              if (data2.code == 200) {
                data2.data.timeStamp += "";
                common_vendor.index.requestPayment({
                  ...data2.data
                });
              } else {
                common_vendor.index.showToast({
                  title: data2.message,
                  icon: "error"
                });
              }
            } else {
              common_vendor.index.showToast({
                title: idReseponse.message,
                icon: "error"
              });
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: data.msg || data.message,
          icon: "error"
        });
      }
    },
    // 支付
    async prepay() {
      if (this.supportMethod.includes(this.selectedPaymentMethod)) {
        switch (this.selectedPaymentMethod) {
          case 1:
            this.startPayment(this.out_trade_no);
            break;
          case 2:
            common_vendor.index.getSetting({
              withSubscriptions: true,
              // 同时获取用户的订阅消息状态
              success: (res) => {
                if (!res.subscriptionsSetting.mainSwitch) {
                  common_vendor.index.openSetting({
                    withSubscriptions: true,
                    // 这里设置为true，以便获取订阅消息的设置状态
                    success(res2) {
                      common_vendor.index.__f__("log", "at subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.vue:298", res2.subscriptionsSetting);
                    }
                  });
                } else {
                  common_vendor.index.__f__("log", "at subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.vue:303", "用户已订阅");
                }
              }
            });
            let response = await api_index.api.payscore({
              out_trade_no: this.out_trade_no
            });
            common_vendor.index.__f__("log", "at subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.vue:314", response);
            if (response.code == 200) {
              common_vendor.index.showToast({
                title: "支付成功",
                icon: "success"
              });
              this.isPayment = true;
              this.clearCountDown();
              clearInterval(this.PaymentTimer);
              common_vendor.index.redirectTo({
                url: `/pages/orders/orders?orderStatus=3`
              });
            } else {
              common_vendor.index.showToast({
                title: response.msg || response.message,
                icon: "error"
              });
            }
            break;
          case 3:
            common_vendor.index.__f__("log", "at subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.vue:338", "数字人民币");
            break;
        }
      } else {
        common_vendor.index.showToast({
          title: "暂未开通" + this.paymentMethods[this.selectedPaymentMethod - 1].title,
          icon: "error"
        });
      }
    },
    startCountDown() {
      let totalSeconds = this.countDownTime * 60;
      this.countDown = setInterval(async () => {
        if (totalSeconds <= 0) {
          this.isTimeOut = true;
          this.clearCountDown();
          common_vendor.index.__f__("log", "at subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.vue:356", "订单超时，已自动取消");
          return;
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.formattedCountDown = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
        totalSeconds--;
      }, 1e3);
    },
    // 清空定时器
    clearCountDown() {
      if (this.countDown) {
        clearInterval(this.countDown);
      }
    },
    padZero(num) {
      return num < 10 ? `0${num}` : num.toString();
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
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.out_trade_no),
    c: common_vendor.t($options.initTime($data.createtime)),
    d: common_vendor.f($data.productList, (product, index, i0) => {
      return {
        a: product.imglogo,
        b: common_vendor.t(product.goodsname),
        c: common_vendor.t(product.price),
        d: common_vendor.t(product.goodsnum),
        e: index
      };
    }),
    e: common_vendor.t($data.totalPrice),
    f: common_vendor.t($data.otherFees),
    g: common_vendor.t($data.totalAmount),
    h: common_vendor.f($data.paymentMethods, (method, index, i0) => {
      return common_vendor.e({
        a: method.title == "积分支付"
      }, method.title == "积分支付" ? {
        b: "1a68b48a-0-" + i0,
        c: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26,
          color: "#ee6770;"
        })
      } : {}, {
        d: method.title == "微信支付"
      }, method.title == "微信支付" ? {
        e: "1a68b48a-1-" + i0,
        f: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26,
          color: "#09bb07;"
        })
      } : {}, {
        g: method.title == "数字人民币"
      }, method.title == "数字人民币" ? {
        h: "1a68b48a-2-" + i0,
        i: common_vendor.p({
          fontFamily: "MyIconFont",
          size: 26,
          color: "#ffd345;"
        })
      } : {}, {
        j: common_vendor.t(method.title),
        k: index,
        l: common_vendor.o(($event) => $options.selectPaymentMethod(method), index),
        m: $data.selectedPaymentMethod === method.code ? 1 : ""
      });
    }),
    i: common_vendor.t($data.isPayment ? "已支付" : "立即付款"),
    j: common_vendor.o((...args) => $options.prepay && $options.prepay(...args)),
    k: $data.isTimeOut || !$data.selectedPaymentMethod,
    l: common_vendor.t($data.countDownTime),
    m: common_vendor.t($data.formattedCountDown)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.js.map
