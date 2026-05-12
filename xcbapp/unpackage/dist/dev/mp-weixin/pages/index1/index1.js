"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      NoticeList: ["赠送积分说明"],
      selectedCountry: "china",
      multiArray: [
        [],
        [],
        []
      ],
      multiIndex: [0, 0, 0],
      provinceList: [],
      cityList: [],
      districtList: [],
      marketList: [],
      marketIdMap: {},
      selectedMarketIndex: 0,
      area_id: null,
      market_id: null,
      overseasCountries: [],
      overseasCities: [],
      overseasCountryId: null,
      overseasCityId: null,
      signTotalData: {}
      // marketName:'' // 市场名
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
      return this.selectedCountry === "china" ? this.marketList : ["暂无数据"];
    }
  },
  watch: {
    selectedCountry(newCountry) {
      this.selectCountry(newCountry);
    }
  },
  async mounted() {
    await this.initializePicker();
    let res = await api_index.api.signTotal();
    this.signTotalData = res.data;
  },
  methods: {
    gotodemo() {
      common_vendor.index.navigateTo({
        url: "/pages/demo/demo"
      });
    },
    goToJackpot() {
      common_vendor.index.navigateTo({
        url: "/pages/jackpot/jackpot"
      });
    },
    ...common_vendor.mapMutations("location", ["setStatus"]),
    goTorules(item) {
      common_vendor.index.__f__("log", "at pages/index1/index1.vue:327", item);
      switch (item) {
        case "赠送积分说明":
          common_vendor.index.navigateTo({
            url: "/pages/rules/rules"
          });
          break;
        case "关于春节放假通知":
          common_vendor.index.navigateTo({
            url: "/pages/arrangeNotification/arrangeNotification"
          });
          break;
      }
    },
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
        common_vendor.index.__f__("error", "at pages/index1/index1.vue:375", "Failed to initialize picker:", error);
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
        common_vendor.index.__f__("error", "at pages/index1/index1.vue:399", "Failed to fetch provinces:", error);
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
          common_vendor.index.__f__("error", "at pages/index1/index1.vue:410", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index1/index1.vue:414", "Failed to fetch cities:", error);
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
          common_vendor.index.__f__("error", "at pages/index1/index1.vue:425", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index1/index1.vue:429", "Failed to fetch areas:", error);
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
        common_vendor.index.__f__("error", "at pages/index1/index1.vue:447", "Failed to fetch overseas continents:", error);
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
        common_vendor.index.__f__("error", "at pages/index1/index1.vue:465", "Failed to fetch overseas countries:", error);
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
          common_vendor.index.__f__("error", "at pages/index1/index1.vue:566", "No market data found");
          this.marketList = [];
          this.marketIdMap = {};
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index1/index1.vue:571", "Failed to fetch markets:", error);
        this.marketList = [];
        this.marketIdMap = {};
      }
    },
    bindMarketChange(e) {
      this.selectedMarketIndex = e.detail.value;
      const selectedMarket = this.marketList[this.selectedMarketIndex];
      this.market_id = this.marketIdMap[selectedMarket] || null;
    },
    saveData() {
      const savedData = {
        area_id: this.area_id,
        market_id: this.market_id,
        marketName: this.displayMarketList[this.selectedMarketIndex],
        country: this.selectedCountry
      };
      common_vendor.index.setStorageSync("userSelection", savedData);
      common_vendor.index.showToast({
        title: "加载中",
        icon: "loading"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }, 500);
    },
    loadSavedData() {
      const savedData = common_vendor.index.getStorageSync("userSelection");
      if (savedData) {
        this.multiIndex = savedData.multiIndex || [0, 0, 0];
        this.area_id = savedData.area_id || null;
        this.market_id = savedData.market_id || null;
        this.selectedMarketIndex = savedData.selectedMarketIndex || 0;
        this.initializePicker().then(() => {
          if (this.area_id && this.selectedCountry === "china") {
            this.fetchMarkets(this.area_id);
          }
        });
      } else {
        this.initializePicker();
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
    a: $data.selectedCountry === "china" ? 1 : "",
    b: common_vendor.o(($event) => $options.selectCountry("china")),
    c: $data.selectedCountry === "overseas" ? 1 : "",
    d: common_vendor.o(($event) => $options.selectCountry("overseas")),
    e: common_vendor.p({
      type: "location-filled",
      size: "18",
      color: "#4a90e2;"
    }),
    f: common_vendor.t($data.multiArray[0][$data.multiIndex[0]] || "请选择"),
    g: $data.multiArray[1][$data.multiIndex[1]]
  }, $data.multiArray[1][$data.multiIndex[1]] ? {
    h: common_vendor.t($data.multiArray[1][$data.multiIndex[1]])
  } : {}, {
    i: $data.selectedCountry !== "overseas" && $data.multiArray[2][$data.multiIndex[2]]
  }, $data.selectedCountry !== "overseas" && $data.multiArray[2][$data.multiIndex[2]] ? {
    j: common_vendor.t($data.multiArray[2][$data.multiIndex[2]])
  } : {}, {
    k: common_vendor.p({
      type: "right",
      size: "14",
      color: "#ccc"
    }),
    l: $data.multiArray,
    m: $data.multiIndex,
    n: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    o: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    p: common_vendor.p({
      type: "shop-filled",
      size: "18",
      color: "#4a90e2;"
    }),
    q: common_vendor.t($options.displayMarketList[$data.selectedMarketIndex] || "请选择菜市场"),
    r: common_vendor.p({
      type: "right",
      size: "14",
      color: "#ccc"
    }),
    s: $options.displayMarketList,
    t: $data.selectedMarketIndex,
    v: common_vendor.o((...args) => $options.bindMarketChange && $options.bindMarketChange(...args)),
    w: common_vendor.o((...args) => $options.saveData && $options.saveData(...args)),
    x: common_vendor.p({
      type: "checkmark-circle",
      size: "14",
      color: "#52c41a"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3b59972f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index1/index1.js.map
