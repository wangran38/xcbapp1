"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const hooks_useUpload = require("../../../hooks/useUpload.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      multiArray: [
        [],
        [],
        []
      ],
      selectedCountry: "china",
      multiIndex: [0, 0, 0],
      formData: {
        selltitle: null,
        // 商品名称
        content: null,
        // 供应说明
        sellnumber: 0,
        // 批发数量
        unit: 0,
        // 单位
        selladdress: null,
        // 供应详细地址
        price: 0,
        // 市场价
        marketprice: 0,
        // 批发价
        category_id: null,
        // 所售分类
        selllogo: null
        //  logo
      },
      categories: [],
      submitting: false,
      imageStyles: {
        width: 200,
        height: 200,
        border: {
          color: "#eee",
          width: 1,
          style: "solid"
        }
      },
      formRules: {
        selltitle: {
          rules: [
            {
              required: true,
              errorMessage: "标题不能为空"
            },
            {
              minLength: 5,
              maxLength: 30,
              errorMessage: "长度需5-30个字符"
            }
          ]
        },
        category: {
          rules: [{
            validate: (val) => (val == null ? void 0 : val.length) === 3,
            errorMessage: "请完整选择三级分类"
          }]
        }
      }
    };
  },
  mounted() {
    this.initializePicker();
    this.fetchCategories();
  },
  methods: {
    initFormData() {
      this.formData = {
        selltitle: null,
        content: null,
        sellnumber: 0,
        unit: 0,
        selladdress: null,
        price: 0,
        marketprice: 0,
        category_id: null,
        selllogo: null
      };
    },
    async fetchCategories() {
      const response = await api_index.api.cglist();
      this.categories = response.data.listdata.map((item) => {
        return { value: item.id, text: item.content };
      });
    },
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
    async fetchCities(provinceId) {
      try {
        const response = await api_index.api.citytree(provinceId);
        if (response.code === 200 && Array.isArray(response.data)) {
          this.cityList = response.data;
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:217", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:221", "Failed to fetch cities:", error);
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
          common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:232", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:236", "Failed to fetch areas:", error);
        return [];
      }
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
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:253", "Failed to fetch provinces:", error);
        throw error;
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
        common_vendor.index.__f__("log", "at subPackages/Wholesale/addSupply/addSupply.vue:267", error);
      }
    },
    // 上传菜品图片
    uploadcuisine() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed", "original"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePaths = res.tempFilePaths;
          common_vendor.index.__f__("log", "at subPackages/Wholesale/addSupply/addSupply.vue:279", res);
          if (tempFilePaths.length > 0) {
            const {
              upload,
              request
            } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              file: res.tempFiles[0],
              // 传输文件对象
              tempFilePaths: tempFilePaths[0]
              // 传输文件路径
            });
            upload().then((res2) => {
              var obj = JSON.parse(res2);
              this.formData.selllogo = api_index.UPLOAD_URL + obj.data.path;
            });
          }
        }
      });
    },
    async handleSubmit() {
      let res = await api_index.api.publishWholesale(this.formData);
      if (res.code == 200) {
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        this.initFormData();
        setTimeout(() => {
          this.customizeBack();
        }, 2e3);
      } else {
        common_vendor.index.showToast({
          title: "发布失败",
          icon: "error"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_icons2 + _easycom_uni_card2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_icons + _easycom_uni_card + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.selltitle = $event),
    b: common_vendor.p({
      placeholder: "输入商品名称",
      modelValue: $data.formData.selltitle
    }),
    c: common_vendor.p({
      label: "供应商品",
      required: true,
      name: "selltitle",
      labelWidth: "80px"
    }),
    d: common_vendor.o(($event) => $data.formData.category_id = $event),
    e: common_vendor.p({
      localdata: $data.categories,
      modelValue: $data.formData.category_id
    }),
    f: common_vendor.p({
      label: "产品类目",
      required: true,
      name: "category",
      labelWidth: "80px"
    }),
    g: common_vendor.o(common_vendor.m(($event) => $data.formData.sellnumber = $event, {
      number: true
    }, true)),
    h: common_vendor.p({
      placeholder: "输入库存",
      modelValue: $data.formData.sellnumber
    }),
    i: common_vendor.p({
      label: "库存",
      required: true,
      name: "category",
      labelWidth: "80px"
    }),
    j: common_vendor.o(($event) => $data.formData.unit = $event),
    k: common_vendor.p({
      placeholder: "输入单位",
      modelValue: $data.formData.unit
    }),
    l: common_vendor.p({
      label: "单位",
      required: true,
      name: "category",
      labelWidth: "80px"
    }),
    m: common_vendor.p({
      type: "help-filled"
    }),
    n: common_vendor.o(common_vendor.m(($event) => $data.formData.price = $event, {
      number: true
    }, true)),
    o: common_vendor.p({
      placeholder: "输入市场价",
      modelValue: $data.formData.price
    }),
    p: common_vendor.p({
      label: "市场价",
      required: true,
      name: "category",
      labelWidth: "80px"
    }),
    q: common_vendor.o(common_vendor.m(($event) => $data.formData.marketprice = $event, {
      number: true
    }, true)),
    r: common_vendor.p({
      placeholder: "输入批发价",
      modelValue: $data.formData.marketprice
    }),
    s: common_vendor.p({
      label: "批发价",
      required: true,
      name: "category",
      labelWidth: "80px"
    }),
    t: common_vendor.t($data.multiArray[0][$data.multiIndex[0]]),
    v: common_vendor.t($data.multiArray[1][$data.multiIndex[1]]),
    w: common_vendor.t($data.selectedCountry === "overseas" ? "" : $data.multiArray[2][$data.multiIndex[2]]),
    x: $data.multiArray,
    y: $data.multiIndex,
    z: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    A: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    B: common_vendor.p({
      label: "供应地区",
      required: true,
      name: "category",
      labelWidth: "80px"
    }),
    C: common_vendor.o(($event) => $data.formData.selladdress = $event),
    D: common_vendor.p({
      placeholder: "输入详细地址",
      modelValue: $data.formData.selladdress
    }),
    E: common_vendor.p({
      label: "详细地址",
      required: true,
      name: "category",
      labelWidth: "80px"
    }),
    F: common_vendor.p({
      title: "基本信息"
    }),
    G: !$data.formData.selllogo,
    H: common_vendor.p({
      type: "plusempty",
      size: "50"
    }),
    I: $data.formData.selllogo,
    J: $data.formData.selllogo,
    K: common_vendor.o((...args) => $options.uploadcuisine && $options.uploadcuisine(...args)),
    L: common_vendor.p({
      title: "产品图片"
    }),
    M: $data.formData.content,
    N: common_vendor.o(($event) => $data.formData.content = $event.detail.value),
    O: common_vendor.p({
      title: "供应说明"
    }),
    P: common_vendor.t($data.submitting ? "提交中..." : "立即发布"),
    Q: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    R: $data.submitting,
    S: common_vendor.sr("formRef", "619b709c-0"),
    T: common_vendor.p({
      model: $data.formData,
      rules: $data.formRules
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/addSupply/addSupply.js.map
