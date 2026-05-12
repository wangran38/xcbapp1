"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  name: "AreaPicker",
  props: {
    // 初始选中类型：china/overseas
    initCountry: {
      type: String,
      default: "china"
    },
    // 初始省市区索引 [省,市,区]
    initMultiIndex: {
      type: Array,
      default: () => [20, 3, 6]
      // 默认海南-定安-对应区
    }
  },
  data() {
    return {
      selectedCountry: "china",
      multiArray: [
        [],
        [],
        []
      ],
      // 省/海外国家 | 市/海外城市 | 区
      multiIndex: [0, 0, 0],
      // 中国地区数据
      provinceList: [],
      cityList: [],
      districtList: [],
      // 海外地区数据
      overseasCountries: [],
      overseasCities: [],
      overseasCountryId: null,
      overseasCityId: null
    };
  },
  watch: {
    initCountry: {
      immediate: true,
      handler(newVal) {
        this.selectCountry(newVal);
      }
    },
    initMultiIndex: {
      immediate: true,
      handler(newVal) {
        this.multiIndex = newVal;
      }
    }
  },
  async mounted() {
    await this.initializePicker();
  },
  methods: {
    // 初始化选择器数据
    async initializePicker() {
      var _a, _b;
      try {
        if (this.selectedCountry === "china") {
          const provinces = await this.fetchProvinces();
          this.multiArray[0] = provinces.map((item) => item.name);
          this.provinceList = provinces;
          if (provinces.length > 0) {
            const targetProvinceId = (_a = provinces[this.multiIndex[0]]) == null ? void 0 : _a.id;
            const cities = await this.fetchCities(targetProvinceId);
            this.multiArray[1] = cities.map((item) => item.name);
            this.cityList = cities;
            if (cities.length > 0) {
              const targetCityId = ((_b = cities[this.multiIndex[1]]) == null ? void 0 : _b.id) || 2306;
              const areas = await this.fetchAreas(targetCityId);
              this.multiArray[2] = areas.map((item) => item.name);
              this.districtList = areas;
            }
          }
        } else {
          await this.fetchOverseas();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at components/fegionSelection/fegionSelection.vue:105", "初始化地区选择器失败:", error);
      }
    },
    // 切换中国/海外
    async selectCountry(country) {
      this.selectedCountry = country;
      this.multiArray = [
        [],
        [],
        []
      ];
      this.multiIndex = [0, 0, 0];
      await this.initializePicker();
      this.emitAreaChange();
    },
    // 获取中国省份列表
    async fetchProvinces() {
      try {
        const res = await api_index.api.citylist({
          level: 1,
          limit: 100
        });
        return res.code === 200 ? res.data.listdata : [];
      } catch (error) {
        common_vendor.index.__f__("error", "at components/fegionSelection/fegionSelection.vue:131", "获取省份失败:", error);
        return [];
      }
    },
    // 获取城市列表
    async fetchCities(provinceId) {
      try {
        const res = await api_index.api.citytree(provinceId);
        return res.code === 200 && Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        common_vendor.index.__f__("error", "at components/fegionSelection/fegionSelection.vue:142", "获取城市失败:", error);
        return [];
      }
    },
    // 获取区县列表
    async fetchAreas(cityId) {
      try {
        const res = await api_index.api.citytree(cityId);
        return res.code === 200 && Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        common_vendor.index.__f__("error", "at components/fegionSelection/fegionSelection.vue:153", "获取区县失败:", error);
        return [];
      }
    },
    // 获取海外国家/地区
    async fetchOverseas() {
      try {
        const res = await api_index.api.countrylist(0, 200, 1);
        if (res.code === 200) {
          this.overseasCountries = res.data.listdata;
          this.multiArray[0] = this.overseasCountries.map((c) => c.shortname);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at components/fegionSelection/fegionSelection.vue:167", "获取海外数据失败:", error);
      }
    },
    // 获取海外城市
    async fetchOverseasCities(continentId) {
      try {
        const res = await api_index.api.countrylist(continentId, 100, 1);
        if (res.code === 200) {
          this.overseasCities = res.data.listdata;
          this.multiArray[1] = this.overseasCities.map((c) => c.shortname);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at components/fegionSelection/fegionSelection.vue:180", "获取海外城市失败:", error);
      }
    },
    // 列滚动事件
    async bindMultiPickerColumnChange(e) {
      var _a, _b, _c, _d;
      const {
        column,
        value
      } = e.detail;
      this.multiIndex[column] = value;
      if (this.selectedCountry === "china") {
        if (column === 0) {
          const provinceId = (_a = this.provinceList[value]) == null ? void 0 : _a.id;
          const cities = await this.fetchCities(provinceId);
          this.multiArray[1] = cities.map((item) => item.name);
          this.cityList = cities;
          this.multiIndex[1] = 0;
          this.multiIndex[2] = 0;
          const cityId = (_b = cities[0]) == null ? void 0 : _b.id;
          const areas = await this.fetchAreas(cityId);
          this.multiArray[2] = areas.map((item) => item.name);
          this.districtList = areas;
        } else if (column === 1) {
          const cityId = (_c = this.cityList[value]) == null ? void 0 : _c.id;
          const areas = await this.fetchAreas(cityId);
          this.multiArray[2] = areas.map((item) => item.name);
          this.districtList = areas;
          this.multiIndex[2] = 0;
        }
      } else {
        if (column === 0) {
          const continentId = (_d = this.overseasCountries[value]) == null ? void 0 : _d.id;
          await this.fetchOverseasCities(continentId);
          this.multiIndex[1] = 0;
          this.multiIndex[2] = 0;
        }
      }
      this.multiIndex = [...this.multiIndex];
    },
    // 选择完成事件
    bindMultiPickerChange() {
      this.emitAreaChange();
    },
    // 向外暴露选择结果
    emitAreaChange() {
      var _a, _b, _c, _d, _e;
      let areaInfo = {
        selectedCountry: this.selectedCountry,
        multiIndex: [...this.multiIndex],
        areaText: `${this.multiArray[0][this.multiIndex[0]] || ""} - ${this.multiArray[1][this.multiIndex[1]] || ""} ${this.selectedCountry === "china" ? `- ${this.multiArray[2][this.multiIndex[2]] || ""}` : ""}`.trim()
      };
      if (this.selectedCountry === "china") {
        areaInfo.provinceId = ((_a = this.provinceList[this.multiIndex[0]]) == null ? void 0 : _a.id) || null;
        areaInfo.cityId = ((_b = this.cityList[this.multiIndex[1]]) == null ? void 0 : _b.id) || null;
        areaInfo.districtId = ((_c = this.districtList[this.multiIndex[2]]) == null ? void 0 : _c.id) || null;
      } else {
        areaInfo.overseasCountryId = ((_d = this.overseasCountries[this.multiIndex[0]]) == null ? void 0 : _d.id) || null;
        areaInfo.overseasCityId = ((_e = this.overseasCities[this.multiIndex[1]]) == null ? void 0 : _e.id) || null;
      }
      this.$emit("area-change", areaInfo);
    },
    // 外部调用：获取当前选择结果
    getCurrentArea() {
      var _a, _b, _c, _d, _e;
      let areaInfo = {
        selectedCountry: this.selectedCountry,
        multiIndex: [...this.multiIndex],
        areaText: `${this.multiArray[0][this.multiIndex[0]] || ""} - ${this.multiArray[1][this.multiIndex[1]] || ""} ${this.selectedCountry === "china" ? `- ${this.multiArray[2][this.multiIndex[2]] || ""}` : ""}`.trim()
      };
      if (this.selectedCountry === "china") {
        areaInfo.provinceId = ((_a = this.provinceList[this.multiIndex[0]]) == null ? void 0 : _a.id) || null;
        areaInfo.cityId = ((_b = this.cityList[this.multiIndex[1]]) == null ? void 0 : _b.id) || null;
        areaInfo.districtId = ((_c = this.districtList[this.multiIndex[2]]) == null ? void 0 : _c.id) || null;
      } else {
        areaInfo.overseasCountryId = ((_d = this.overseasCountries[this.multiIndex[0]]) == null ? void 0 : _d.id) || null;
        areaInfo.overseasCityId = ((_e = this.overseasCities[this.multiIndex[1]]) == null ? void 0 : _e.id) || null;
      }
      return areaInfo;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.multiArray[0][$data.multiIndex[0]] || "请选择"),
    b: common_vendor.t($data.multiArray[1][$data.multiIndex[1]] ? $data.multiArray[1][$data.multiIndex[1]] : "暂无数据"),
    c: common_vendor.t($data.selectedCountry === "overseas" ? "" : $data.multiArray[2][$data.multiIndex[2]] || "暂无数据"),
    d: $data.multiArray,
    e: $data.multiIndex,
    f: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    g: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a4f39d15"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/fegionSelection/fegionSelection.js.map
