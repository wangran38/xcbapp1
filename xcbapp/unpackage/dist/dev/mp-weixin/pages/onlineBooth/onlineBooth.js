"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const popVue = () => "./components/pop.js";
const _sfc_main = {
  data() {
    return {
      // options: [{
      // 	title: '创建摊位'
      // }, {
      // 	title: '用户信息'
      // }, {
      // 	title: '领取福利'
      // }, ]
      options: [{
        title: "创建摊位"
      }, {
        title: "用户信息"
      }],
      active: 0,
      categoryList: ["请选择分类"],
      selectedCategory: "请选择分类",
      // 分类
      userInfo: {
        // 用户信息
        name: null,
        location: null,
        index: null,
        lng: null,
        lat: null
      },
      title: "下一步",
      lock: true,
      // 领取按钮锁
      selectedCountry: "china",
      multiArray: [
        [],
        [],
        []
      ],
      multiIndex: [0, 0, 0],
      selectedMarketIndex: 0,
      area_id: 2313,
      // 默认是定安县
      market_id: null,
      overseasCountries: [],
      overseasCities: [],
      overseasCountryId: null,
      overseasCityId: null
    };
  },
  computed: {
    displayArray() {
      if (this.selectedCountry === "china") {
        return [this.multiArray[0], this.multiArray[1], this.multiArray[2]];
      } else {
        return [
          this.multiArray[0],
          this.multiArray[1],
          []
        ];
      }
    },
    displayMarketList() {
      return this.selectedCountry === "china" ? this.marketList : ["暂时还没有数据"];
    }
  },
  watch: {
    selectedCountry(newCountry) {
      this.selectCountry(newCountry);
    }
  },
  async mounted() {
    await this.initializePicker();
    this.fetchCategories();
  },
  components: {
    popVue
  },
  methods: {
    // 获取经纬度
    async seachAddress() {
      if (this.userInfo.location) {
        let res = await api_index.api.searchResolution({
          "address": this.userInfo.location
        });
        if (!res.error) {
          this.userInfo.lng = res.lng;
          this.userInfo.lat = res.lat;
        } else {
          common_vendor.index.showToast({
            icon: "error",
            title: "详细地址有误,获取不到经纬度"
          });
          this.userInfo.lng = 110.358001;
          this.userInfo.lat = 19.681215;
        }
      }
    },
    async customizeBack() {
      let canNavBack = await getCurrentPages();
      if (canNavBack && canNavBack.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        history.back();
      }
    },
    async over() {
      let res = await api_index.api.addfarmers({
        area_id: this.area_id,
        farmersname: this.userInfo.name,
        address: this.userInfo.location,
        category_id: this.userInfo.index,
        lng: this.userInfo.lng,
        lat: this.userInfo.lat
      });
      common_vendor.index.__f__("log", "at pages/onlineBooth/onlineBooth.vue:348", res);
      if (res.code == 200) {
        common_vendor.index.showToast({
          icon: "success",
          title: "注册成功"
        }).then((data) => {
          setTimeout(() => {
            this.customizeBack();
          }, 2e3);
        });
      } else {
        common_vendor.index.showToast({
          icon: "error",
          title: res.msg || res.message
        });
      }
    },
    register() {
      if (this.lock) {
        let pop = this.$refs.pop;
        pop.show = true;
        pop.custom();
        this.lock = false;
      }
    },
    async fetchCategories() {
      try {
        const response = await api_index.api.cglist();
        if (response.code === 200) {
          const categories = response.data.listdata;
          this.categoryList = [...categories.map((item) => item.title)];
          this.categoryIdMap = categories.reduce((map, item) => {
            map[item.title] = item.id;
            return map;
          }, {});
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:389", "Failed to fetch categories:", error);
      }
    },
    // 选择菜品
    bindCategoryChange(e) {
      const selectedIndex = e.detail.value;
      this.selectedCategory = this.categoryList[selectedIndex];
      this.category_id = this.categoryIdMap[this.selectedCategory];
    },
    goToJackpot() {
      common_vendor.index.navigateTo({
        url: "/pages/jackpot/jackpot"
      });
    },
    ...common_vendor.mapMutations("location", ["setStatus"]),
    // 默认选中海南省定安县塔岭市场
    async initializePicker() {
      try {
        if (this.selectedCountry === "china") {
          const provinces = await this.fetchProvinces();
          this.multiArray[0] = provinces.map((item) => item.name);
          if (provinces.length > 0) {
            const cities = await this.fetchCities(provinces[20].id);
            this.multiArray[1] = cities.map((item) => item.name);
            if (cities.length > 0) {
              const areas = await this.fetchAreas(2306);
              this.multiArray[2] = areas.map((item) => item.name);
            }
          }
          this.multiIndex = [20, 3, 6];
        } else if (this.selectedCountry === "overseas") {
          const countries = await this.fetchOverseas();
          this.multiArray[0] = countries.map((c) => c.shortname);
          this.multiArray[1] = [];
          this.multiArray[2] = [];
          this.multiIndex = [0, 0, 0];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:439", "Failed to initialize picker:", error);
      }
      this.fetchMarkets(2313);
      this.selectedMarketIndex = 1;
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
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:459", "Failed to fetch provinces:", error);
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
          common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:470", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:474", "Failed to fetch cities:", error);
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
          common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:485", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:489", "Failed to fetch areas:", error);
        return [];
      }
    },
    async fetchOverseas() {
      try {
        const response = await api_index.api.countrylist(0, 200, 1);
        if (response.code === 200) {
          this.overseasCountries = response.data.listdata;
          this.multiArray[0] = this.overseasCountries.map((c) => c.shortname);
          this.multiArray[1] = [];
          this.multiArray[2] = [];
          this.multiIndex = [0, 0, 0];
          return this.overseasCountries;
        } else {
          throw new Error("Failed to fetch overseas continents");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:507", "Failed to fetch overseas continents:", error);
        throw error;
      }
    },
    async fetchOverseasCities(continentId) {
      try {
        const response = await api_index.api.countrylist(continentId, 100, 1);
        if (response.code === 200) {
          this.overseasCities = response.data.listdata;
          this.multiArray[1] = this.overseasCities.map((c) => c.shortname);
          this.multiArray[2] = [];
          this.multiIndex[1] = 0;
          this.multiIndex[2] = 0;
          return this.overseasCities;
        } else {
          throw new Error("Failed to fetch overseas countries");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:525", "Failed to fetch overseas countries:", error);
        throw error;
      }
    },
    async selectCountry(country) {
      this.selectedCountry = country;
      this.multiArray = [
        [],
        [],
        []
      ];
      this.marketList = [];
      this.selectedMarketIndex = 0;
      this.area_id = null;
      this.market_id = null;
      if (country === "china") {
        await this.initializePicker();
      } else if (country === "overseas") {
        await this.fetchOverseas();
      }
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
      var _a, _b, _c, _d;
      this.multiIndex = e.detail.value;
      if (this.selectedCountry === "china") {
        const selectedCityIndex = this.multiIndex[1];
        const selectedCityId = ((_a = this.cityList[selectedCityIndex]) == null ? void 0 : _a.id) || null;
        if (selectedCityId) {
          await this.fetchAreas(selectedCityId);
          this.area_id = ((_b = this.districtList[this.multiIndex[2]]) == null ? void 0 : _b.id) || null;
          await this.fetchMarkets(this.area_id);
        }
      } else if (this.selectedCountry === "overseas") {
        const selectedCountryIndex = this.multiIndex[0];
        this.overseasCountryId = ((_c = this.overseasCountries[selectedCountryIndex]) == null ? void 0 : _c.id) || null;
        const selectedCityIndex = this.multiIndex[1];
        if (this.overseasCountryId) {
          await this.fetchOverseasCities(this.overseasCountryId);
          this.overseasCityId = ((_d = this.overseasCities[selectedCityIndex]) == null ? void 0 : _d.id) || null;
        }
      }
    },
    async fetchMarkets(areaId) {
      try {
        const Limit = 100;
        const response = await api_index.api.marketlist(areaId, Limit);
        if (response.code === 200 && Array.isArray(response.data.listdata)) {
          this.marketList = response.data.listdata.map((item) => item.marketname);
          this.marketIdMap = response.data.listdata.reduce((map, item) => {
            map[item.marketname] = item.id;
            return map;
          }, {});
        } else {
          common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:626", "No market data found");
          this.marketList = [];
          this.marketIdMap = {};
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/onlineBooth/onlineBooth.vue:631", "Failed to fetch markets:", error);
        this.marketList = [];
        this.marketIdMap = {};
      }
    },
    bindMarketChange(e) {
      this.selectedMarketIndex = e.detail.value;
      const selectedMarket = this.marketList[this.selectedMarketIndex];
      this.market_id = this.marketIdMap[selectedMarket] || null;
    },
    // 下一步
    next() {
      switch (this.active) {
        case 0:
          this.active += 1;
          this.title = "注册";
          break;
        case 1:
          this.userInfo.index = this.categoryList.findIndex((item) => item == this.selectedCategory);
          if (this.userInfo.name && this.userInfo.location && this.userInfo.index != -1) {
            this.over();
          } else {
            common_vendor.index.showToast({
              icon: "error",
              title: "请补充完整信息"
            });
          }
          break;
        case 2:
          if (this.title == "完成") {
            common_vendor.index.showToast({
              title: "注册完成"
            });
          }
      }
    }
  }
};
if (!Array) {
  const _component_popVue = common_vendor.resolveComponent("popVue");
  const _easycom_uni_steps2 = common_vendor.resolveComponent("uni-steps");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_component_popVue + _easycom_uni_steps2 + _easycom_uni_icons2 + _easycom_uni_card2)();
}
const _easycom_uni_steps = () => "../../uni_modules/uni-steps/components/uni-steps/uni-steps.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_steps + _easycom_uni_icons + _easycom_uni_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("pop", "2ffa6e15-0"),
    b: common_vendor.o($options.over),
    c: common_vendor.p({
      options: $data.options,
      active: $data.active,
      ["active-color"]: "#00ff00"
    }),
    d: common_vendor.p({
      type: "info",
      size: "16",
      color: "#6C757D"
    }),
    e: common_vendor.p({
      type: "location-filled",
      size: "20",
      color: "#4A6572"
    }),
    f: common_vendor.t($data.multiArray[0][$data.multiIndex[0]]),
    g: common_vendor.t($data.multiArray[1][$data.multiIndex[1]]),
    h: common_vendor.t($data.selectedCountry === "overseas" ? "" : $data.multiArray[2][$data.multiIndex[2]]),
    i: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#8E9BA6"
    }),
    j: $data.multiArray,
    k: $data.multiIndex,
    l: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    m: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    n: $data.active == 0,
    o: common_vendor.p({
      type: "info",
      size: "16",
      color: "#6C757D"
    }),
    p: $data.userInfo.name,
    q: common_vendor.o(($event) => $data.userInfo.name = $event.detail.value),
    r: common_vendor.t($data.selectedCategory),
    s: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#8E9BA6"
    }),
    t: $data.categoryList,
    v: common_vendor.o((...args) => $options.bindCategoryChange && $options.bindCategoryChange(...args)),
    w: common_vendor.o((...args) => $options.seachAddress && $options.seachAddress(...args)),
    x: $data.userInfo.location,
    y: common_vendor.o(($event) => $data.userInfo.location = $event.detail.value),
    z: $data.active == 1,
    A: common_vendor.t($data.title),
    B: common_vendor.o((...args) => $options.next && $options.next(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2ffa6e15"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/onlineBooth/onlineBooth.js.map
