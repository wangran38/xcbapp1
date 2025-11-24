"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      shop: {
        id: "SH2023",
        rent: 15e3,
        area: 120,
        address: "岳松路88号",
        type: "临街商铺",
        height: 5.8,
        width: 8,
        managementFee: 3.5,
        freeRentPeriod: 30,
        images: [
          "https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
          "https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067"
        ],
        location: {
          latitude: 39.90923,
          longitude: 116.42843
        }
      },
      formData: {
        name: "",
        phone: "",
        time: ""
      },
      markers: [{
        id: 1,
        latitude: 39.90923,
        longitude: 116.42843,
        iconPath: "https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
        width: 30,
        height: 30
      }]
    };
  },
  methods: {
    handleViewPanorama() {
      common_vendor.index.navigateTo({
        url: "/pages/panorama/index?id=SH2023"
      });
    },
    handleCall() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "400-1234-5678"
      });
    },
    async handleSubmit() {
      if (!this.formData.name || !this.formData.phone) {
        return common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      try {
        await this.$http.post("/booking", {
          shopId: this.shop.id,
          ...this.formData
        });
        common_vendor.index.showToast({ title: "预约成功" });
        this.formData = { name: "", phone: "", time: "" };
      } catch (e) {
        common_vendor.index.showToast({ title: "提交失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_icons2 + _easycom_uni_section2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_section = () => "../../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_section + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.shop.images, (img, index, i0) => {
      return {
        a: img,
        b: index
      };
    }),
    b: common_vendor.t($data.shop.rent),
    c: common_vendor.t($data.shop.area),
    d: common_vendor.p({
      type: "location",
      size: "16",
      color: "#666"
    }),
    e: common_vendor.t($data.shop.address),
    f: common_vendor.t($data.shop.type),
    g: common_vendor.t($data.shop.height),
    h: common_vendor.t($data.shop.width),
    i: common_vendor.t($data.shop.managementFee),
    j: common_vendor.t($data.shop.freeRentPeriod),
    k: common_vendor.p({
      title: "房源信息",
      type: "line"
    }),
    l: common_vendor.p({
      title: "位置信息",
      type: "line"
    }),
    m: common_vendor.p({
      title: "预约看房",
      type: "line"
    }),
    n: common_vendor.o(($event) => $data.formData.name = $event),
    o: common_vendor.p({
      placeholder: "请输入姓名",
      modelValue: $data.formData.name
    }),
    p: common_vendor.p({
      label: "您的姓名",
      required: true,
      ["label-width"]: "80"
    }),
    q: common_vendor.o(($event) => $data.formData.phone = $event),
    r: common_vendor.p({
      type: "number",
      placeholder: "请输入手机号",
      modelValue: $data.formData.phone
    }),
    s: common_vendor.p({
      label: "联系电话",
      required: true,
      ["label-width"]: "80"
    }),
    t: common_vendor.o(($event) => $data.formData.time = $event),
    v: common_vendor.p({
      type: "datetime",
      modelValue: $data.formData.time
    }),
    w: common_vendor.p({
      label: "预约时间",
      required: true,
      ["label-width"]: "80"
    }),
    x: common_vendor.p({
      modelValue: $data.formData
    }),
    y: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#fff"
    }),
    z: common_vendor.o((...args) => $options.handleCall && $options.handleCall(...args)),
    A: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c251ce5d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/rentalStorefront/rentalStorefront.js.map
