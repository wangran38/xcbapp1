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
          common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:157", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:161", "Failed to fetch cities:", error);
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
          common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:172", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:176", "Failed to fetch areas:", error);
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
        common_vendor.index.__f__("error", "at subPackages/Wholesale/addSupply/addSupply.vue:193", "Failed to fetch provinces:", error);
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
        common_vendor.index.__f__("log", "at subPackages/Wholesale/addSupply/addSupply.vue:207", error);
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
          common_vendor.index.__f__("log", "at subPackages/Wholesale/addSupply/addSupply.vue:219", res);
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/Wholesale/addSupply/addSupply.js.map
