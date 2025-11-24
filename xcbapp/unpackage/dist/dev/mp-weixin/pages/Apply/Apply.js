"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const hooks_useUpload = require("../../hooks/useUpload.js");
const _sfc_main = {
  data() {
    return {
      multiArray: [
        [],
        [],
        []
      ],
      multiIndex: [0, 0, 0],
      categoryList: ["请选择分类"],
      categoryIdMap: {},
      // 分类名称到ID的映射
      selectedCategory: "请选择分类",
      provinceList: [],
      cityList: [],
      districtList: [],
      marketList: [],
      // 添加市场列表
      marketIdMap: {},
      // 菜市场名称到ID的映射
      selectedMarketIndex: 0,
      // 记录当前选择的市场索引
      contactpeople: "",
      contactphone: "",
      title: "",
      logo: "",
      // 摊位图片
      phone: "",
      content: "",
      area_id: null,
      market_id: null,
      category_id: null,
      isSubmitting: false,
      businessLicense: "",
      // 营业执照
      isImageSelected: false
    };
  },
  mounted() {
    this.initializePicker();
    this.fetchCategories();
    this.fetchMarkets();
  },
  onShow() {
    if (this.checkToken()) {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  methods: {
    // 检查是否token存在，存在则已登陆
    checkToken() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        return true;
      }
      return false;
    },
    // 返回上一页
    async customizeBack() {
      let canNavBack = await getCurrentPages();
      if (canNavBack && canNavBack.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        history.back();
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
        common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:219", "Failed to initialize picker:", error);
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
        common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:235", "Failed to fetch provinces:", error);
        throw error;
      }
    },
    async fetchCities(provinceId) {
      try {
        const response = await api_index.api.citytree(provinceId);
        if (response.code === 200 && Array.isArray(response.data)) {
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:247", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:251", "Failed to fetch cities:", error);
        return [];
      }
    },
    async fetchAreas(cityId) {
      try {
        const response = await api_index.api.citytree(cityId);
        if (response.code === 200 && Array.isArray(response.data)) {
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:263", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:267", "Failed to fetch areas:", error);
        return [];
      }
    },
    bindMultiPickerChange(e) {
      this.multiIndex = e.detail.value;
      const selectedProvince = this.multiArray[0][this.multiIndex[0]];
      const selectedCity = this.multiArray[1][this.multiIndex[1]];
      const selectedArea = this.multiArray[2][this.multiIndex[2]];
      const selectedAreaId = this.districtList[this.multiIndex[2]].id;
      common_vendor.index.__f__("log", "at pages/Apply/Apply.vue:277", "选择的省市区:", selectedProvince, selectedCity, selectedArea);
      this.area_id = selectedAreaId;
      this.fetchMarkets(selectedAreaId);
    },
    async bindMultiPickerColumnChange(e) {
      const column = e.detail.column;
      const value = e.detail.value;
      this.multiIndex[column] = value;
      if (column === 0) {
        const provinceId = this.provinceList[value].id;
        const cities = await this.fetchCities(provinceId);
        this.cityList = cities;
        this.multiArray[1] = cities.map((item) => item.name);
        this.multiArray[2] = cities ? cities[0].Children.map((item) => item.name) : [];
        this.multiIndex[1] = 0;
        this.multiIndex[2] = 0;
      } else if (column === 1) {
        const cityId = this.cityList[value].id;
        const areas = await this.fetchAreas(cityId);
        this.districtList = areas;
        this.multiArray[2] = areas.map((item) => item.name);
        this.multiIndex[2] = 0;
      }
      this.multiIndex = [...this.multiIndex];
    },
    async fetchMarkets(areaId) {
      try {
        const Limit = 100;
        const response = await api_index.api.marketlist(areaId, Limit);
        if (response.code === 200) {
          this.marketData = response.data.listdata;
          this.marketList = response.data.listdata.map((item) => item.marketname);
          this.marketIdMap = this.marketData.reduce((map, item) => {
            map[item.marketname] = item.id;
            return map;
          }, {});
        } else {
          common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:320", "Failed to fetch markets:", response.message);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:323", "Failed to fetch markets:", error);
      }
    },
    bindMarketChange(e) {
      this.selectedMarketIndex = e.detail.value;
      const selectedMarketName = this.marketList[this.selectedMarketIndex];
      this.market_id = this.marketIdMap[selectedMarketName] || null;
    },
    async fetchCategories() {
      try {
        const response = await api_index.api.cglist();
        if (response.code === 200) {
          const categories = response.data.listdata;
          this.categoryList = ["请选择分类", ...categories.map((item) => item.title)];
          this.categoryIdMap = categories.reduce((map, item) => {
            map[item.title] = item.id;
            return map;
          }, {});
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:347", "Failed to fetch categories:", error);
      }
    },
    bindCategoryChange(e) {
      const selectedIndex = e.detail.value;
      this.selectedCategory = this.categoryList[selectedIndex];
      this.category_id = this.categoryIdMap[this.selectedCategory];
    },
    // 摊位图片上传
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed", "original"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 0) {
            const {
              upload,
              request
            } = hooks_useUpload.useUpload({
              uploadPath: "/group1/upload",
              tempFilePaths: tempFilePaths[0],
              file: res.tempFiles[0]
            });
            upload().then((res2) => {
              var obj = JSON.parse(res2);
              this.logo = api_index.UPLOAD_URL + obj.data.path;
              this.isImageSelected = true;
            });
          }
        }
      });
    },
    async submitForm() {
      if (this.isSubmitting)
        return;
      if (!this.contactpeople || !this.contactphone || !this.title || !this.phone || !this.area_id || !this.market_id || !this.category_id || !this.logo) {
        common_vendor.index.showToast({
          title: "请填写完整的信息",
          icon: "none"
        });
        return;
      }
      this.isSubmitting = true;
      try {
        const formData = {
          contactpeople: this.contactpeople,
          contactphone: this.contactphone,
          title: this.title,
          logo: this.logo,
          // 取第一个上传的图片作为logo
          phone: this.phone,
          content: this.content,
          area_id: this.area_id,
          market_id: this.market_id,
          category_id: this.category_id
        };
        const response = await api_index.api.addshop(formData);
        if (response.code === 200) {
          common_vendor.index.showToast({
            title: "摊位申请成功",
            icon: "success",
            duration: 2e3
          });
          setTimeout(() => {
            this.customizeBack();
          }, 2e3);
        } else {
          common_vendor.index.showToast({
            title: response.msg || "提交失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Apply/Apply.vue:434", "提交失败:", error);
        common_vendor.index.showToast({
          title: "提交失败",
          icon: "none"
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "person",
      size: "18",
      color: "#666"
    }),
    b: $data.contactpeople,
    c: common_vendor.o(($event) => $data.contactpeople = $event.detail.value),
    d: common_vendor.p({
      type: "phone",
      size: "18",
      color: "#666"
    }),
    e: $data.contactphone,
    f: common_vendor.o(($event) => $data.contactphone = $event.detail.value),
    g: common_vendor.p({
      type: "location",
      size: "18",
      color: "#666"
    }),
    h: common_vendor.t($data.multiArray[0][$data.multiIndex[0]] || "省"),
    i: common_vendor.t($data.multiArray[1][$data.multiIndex[1]] || "市"),
    j: common_vendor.t($data.multiArray[2][$data.multiIndex[2]] || "区"),
    k: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    l: $data.multiArray,
    m: $data.multiIndex,
    n: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    o: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    p: common_vendor.p({
      type: "flag",
      size: "18",
      color: "#666"
    }),
    q: common_vendor.t($data.marketList[$data.selectedMarketIndex] || "请选择菜市场"),
    r: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    s: $data.marketList,
    t: $data.selectedMarketIndex,
    v: common_vendor.o((...args) => $options.bindMarketChange && $options.bindMarketChange(...args)),
    w: common_vendor.p({
      type: "shop",
      size: "18",
      color: "#666"
    }),
    x: $data.title,
    y: common_vendor.o(($event) => $data.title = $event.detail.value),
    z: common_vendor.p({
      type: "list",
      size: "18",
      color: "#666"
    }),
    A: common_vendor.t($data.selectedCategory || "请选择经营类目"),
    B: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    C: $data.categoryList,
    D: common_vendor.o((...args) => $options.bindCategoryChange && $options.bindCategoryChange(...args)),
    E: common_vendor.p({
      type: "phone",
      size: "18",
      color: "#666"
    }),
    F: $data.phone,
    G: common_vendor.o(($event) => $data.phone = $event.detail.value),
    H: common_vendor.p({
      type: "image",
      size: "18",
      color: "#666"
    }),
    I: common_vendor.p({
      type: $data.isImageSelected ? "checkmarkempty" : "plusempty",
      size: "24",
      color: $data.isImageSelected ? "#67C23A" : "#999"
    }),
    J: common_vendor.t($data.isImageSelected ? "已上传" : "点击上传"),
    K: $data.isImageSelected ? 1 : "",
    L: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    M: common_vendor.t($data.isSubmitting ? "提交中..." : "立即提交"),
    N: $data.isSubmitting
  }, $data.isSubmitting ? {} : {}, {
    O: $data.isSubmitting ? 1 : "",
    P: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cdb56d2d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Apply/Apply.js.map
