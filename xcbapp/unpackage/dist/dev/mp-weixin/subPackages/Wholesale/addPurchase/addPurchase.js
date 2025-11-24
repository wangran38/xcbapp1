"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    const today = Date.now();
    return {
      multiArray: [
        [],
        [],
        []
      ],
      selectedCountry: "china",
      multiIndex: [0, 0, 0],
      formData: {
        infotitle: "",
        // 商品名称
        infonumber: null,
        // 采购量
        unit: null,
        // 采购量
        stoptime: "",
        // 截至时间
        // deliveryStart: '',
        // deliveryEnd: '',
        // deliveryAddress: [],
        byaddress: "",
        // 求购商品的指定货源地
        buyaddress: "",
        // 求购商品物流地址
        area_id: null,
        content: ""
      },
      units: [
        {
          value: "件",
          text: "件"
        },
        {
          value: "吨",
          text: "吨"
        },
        {
          value: "箱",
          text: "箱"
        },
        {
          value: "斤",
          text: "斤"
        }
      ],
      districtList: [],
      today
    };
  },
  mounted() {
    this.initializePicker();
  },
  options: {
    stylelsolation: "shared"
  },
  methods: {
    async bindMultiPickerColumnChange(e) {
      const column = e.detail.column;
      const value = e.detail.value;
      if (this.selectedCountry === "china") {
        if (column === 0) {
          const selectedProvince = this.provinceList[value];
          if (selectedProvince && selectedProvince.id !== void 0) {
            const cities = await this.fetchCities(selectedProvince.id);
            this.multiArray[1] = cities.map((item) => item.name);
            if (cities.length > 0) {
              const areas = await this.fetchAreas(cities[0].id);
              this.multiArray[2] = areas.map((item) => item.name);
            } else {
              this.multiArray[2] = [];
            }
          }
          this.multiIndex[1] = 0;
          this.multiIndex[2] = 0;
        } else if (column === 1) {
          const selectedCity = this.cityList[value];
          if (selectedCity && selectedCity.id !== void 0) {
            const areas = await this.fetchAreas(selectedCity.id);
            this.multiArray[2] = areas.map((item) => item.name);
          } else {
            this.multiArray[2] = [];
          }
          this.multiIndex[2] = 0;
        }
      } else if (this.selectedCountry === "overseas") {
        if (column === 0) {
          const selectedContinent = this.overseasCountries[value];
          if (selectedContinent && selectedContinent.id !== void 0) {
            await this.fetchOverseasCities(selectedContinent.id);
          }
          this.multiArray[2] = [];
          this.multiIndex[1] = 0;
          this.multiIndex[2] = 0;
        } else if (column === 1) {
          this.multiArray[2] = [];
          this.multiIndex[2] = 0;
        }
      }
      this.multiIndex[column] = value;
      this.multiIndex = [...this.multiIndex];
    },
    async bindMultiPickerChange(e) {
      this.formData.area_id = this.districtList[this.multiIndex[2]]["id"];
    },
    async fetchProvinces() {
      try {
        const response = await api_index.api.citylist({
          level: 1,
          limit: 100
        });
        if (response.code === 200) {
          this.provinceList = response.data.listdata;
          return this.provinceList;
        }
        throw new Error("Failed to fetch provinces");
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addPurchase/addPurchase.vue:198", "Failed to fetch provinces:", error);
        throw error;
      }
    },
    async fetchCities(provinceId) {
      try {
        const response = await api_index.api.citytree(provinceId);
        if (response.code === 200 && Array.isArray(response.data)) {
          this.cityList = response.data;
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at subPackages/Wholesale/addPurchase/addPurchase.vue:209", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addPurchase/addPurchase.vue:213", "Failed to fetch cities:", error);
        return [];
      }
    },
    async fetchAreas(cityId) {
      try {
        const response = await api_index.api.citytree(cityId);
        if (response.code === 200 && Array.isArray(response.data)) {
          this.districtList = response.data;
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at subPackages/Wholesale/addPurchase/addPurchase.vue:224", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addPurchase/addPurchase.vue:228", "Failed to fetch areas:", error);
        return [];
      }
    },
    async submitForm() {
      this.formData.buyaddress = this.multiArray[0][this.multiIndex[0]] + "-" + this.multiArray[1][this.multiIndex[1]] + "-" + this.multiArray[2][this.multiIndex[2]];
      common_vendor.index.__f__("log", "at subPackages/Wholesale/addPurchase/addPurchase.vue:238", this.formData);
      let data = await api_index.api.buyinfoAdd(this.formData);
      if (data.code != 200) {
        common_vendor.index.showToast({
          icon: "error",
          title: data.msg || data.message
        });
      } else {
        setTimeout(() => {
          this.customizeBack();
        }, 2e3);
        common_vendor.index.showToast({
          icon: "success",
          title: data.msg || data.message
        });
      }
    },
    async initializePicker() {
      try {
        const provinces = await this.fetchProvinces();
        this.multiArray[0] = provinces.map((item) => item.name);
        const cities = await this.fetchCities(provinces[0].id);
        this.multiArray[1] = cities.map((item) => item.name);
        const areas = await this.fetchAreas(cities[0].id);
        this.multiArray[2] = areas.map((item) => item.name);
        this.multiIndex = [0, 0, 0];
      } catch (error) {
        common_vendor.index.__f__("log", "at subPackages/Wholesale/addPurchase/addPurchase.vue:267", error);
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _component_goods_picker = common_vendor.resolveComponent("goods-picker");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_section2 + _easycom_uni_easyinput2 + _component_goods_picker + _easycom_uni_popup2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_section = () => "../../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_section + _easycom_uni_easyinput + _easycom_uni_popup + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      title: "采购明细",
      type: "line"
    }),
    b: common_vendor.o(($event) => _ctx.showGoodsPicker = true),
    c: common_vendor.o(($event) => $data.formData.infotitle = $event),
    d: common_vendor.p({
      placeholder: "请输入商品名称",
      modelValue: $data.formData.infotitle
    }),
    e: common_vendor.o(_ctx.handleGoodsSelect),
    f: common_vendor.sr("goodsPopup", "c26dcea4-4,c26dcea4-2"),
    g: common_vendor.p({
      type: "dialog"
    }),
    h: common_vendor.p({
      label: "商品名称",
      required: true,
      name: "infotitle"
    }),
    i: common_vendor.o(common_vendor.m(($event) => $data.formData.infonumber = $event, {
      number: true
    }, true)),
    j: common_vendor.p({
      type: "number",
      placeholder: "请输入数量",
      modelValue: $data.formData.infonumber
    }),
    k: common_vendor.o(($event) => $data.formData.unit = $event),
    l: common_vendor.p({
      localdata: $data.units,
      placeholder: "单位",
      modelValue: $data.formData.unit
    }),
    m: common_vendor.p({
      label: "采购量",
      required: true,
      name: "quantity"
    }),
    n: common_vendor.o(($event) => $data.formData.content = $event),
    o: common_vendor.p({
      type: "textarea",
      placeholder: "请输入规格、材质等要求",
      maxlength: 500,
      modelValue: $data.formData.content
    }),
    p: common_vendor.p({
      label: "采购要求",
      name: "requirements"
    }),
    q: common_vendor.t($data.multiArray[0][$data.multiIndex[0]]),
    r: common_vendor.t($data.multiArray[1][$data.multiIndex[1]]),
    s: common_vendor.t($data.selectedCountry === "overseas" ? "" : $data.multiArray[2][$data.multiIndex[2]]),
    t: $data.multiArray,
    v: $data.multiIndex,
    w: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    x: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    y: common_vendor.p({
      label: "收货地址",
      required: true,
      name: "deliveryAddress"
    }),
    z: common_vendor.o(($event) => $data.formData.byaddress = $event),
    A: common_vendor.p({
      placeholder: "请输入详细地址",
      modelValue: $data.formData.byaddress
    }),
    B: common_vendor.p({
      label: "详细地址",
      name: "byaddress"
    }),
    C: common_vendor.o(($event) => $data.formData.stoptime = $event),
    D: common_vendor.p({
      type: "date",
      start: $data.today,
      ["return-type"]: "timestamp",
      modelValue: $data.formData.stoptime
    }),
    E: common_vendor.p({
      label: "报价截止",
      required: true,
      name: "stoptime"
    }),
    F: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    G: common_vendor.sr("form", "c26dcea4-0")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c26dcea4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/addPurchase/addPurchase.js.map
