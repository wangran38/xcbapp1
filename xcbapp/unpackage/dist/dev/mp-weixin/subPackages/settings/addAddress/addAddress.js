"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_public = require("../../../utils/public.js");
const api_index = require("../../../api/index.js");
const fegionSelection = () => "../../../components/fegionSelection/fegionSelection.js";
const _sfc_main = {
  mixins: [utils_public.myMixin],
  components: {
    fegionSelection
  },
  data() {
    return {
      mapKey: false,
      selectedCountry: "china",
      multiArray: [
        [],
        [],
        []
      ],
      area_id: null,
      // 所在区域id
      multiIndex: [0, 0, 0],
      isEdit: false,
      formData: {
        area_id: null,
        // 所在区域id
        phone: null,
        // 手机号
        phonename: null,
        // 收货人姓名
        address: null,
        // 详细地址
        isshow: 1
        // 是否为默认地址
      },
      error: {
        phonename: false,
        phone: false,
        region: false,
        detail: false
      },
      location: {
        latitude: null,
        longitude: null
      },
      markers: []
    };
  },
  onLoad(options) {
    common_vendor.index.getLocation({
      altitude: true,
      isHighAccuracy: true,
      highAccuracy: true,
      type: "gcj02",
      success: (res) => {
        this.location.longitude = res.longitude;
        this.location.latitude = res.latitude - 5e-3;
        this.mapKey = true;
        common_vendor.index.__f__("log", "at subPackages/settings/addAddress/addAddress.vue:127", this.location);
        this.markers.push({ id: 1, longitude: this.location.longitude, latitude: this.location.latitude + 5e-3, iconPath: "../../../static/selectlocation.png", width: 30, height: 30 });
        common_vendor.index.__f__("log", "at subPackages/settings/addAddress/addAddress.vue:129", this.markers);
      },
      fail(e) {
        common_vendor.index.__f__("log", "at subPackages/settings/addAddress/addAddress.vue:145", e);
      }
    });
    this.initializePicker();
    if (JSON.parse(options.isEdit)) {
      this.isEdit = true;
      this.formData = JSON.parse(options.jsonData);
    }
  },
  methods: {
    selectLocation() {
      common_vendor.index.chooseLocation({
        success: (res) => {
          this.formData.address = res.address;
        },
        fail(e) {
          common_vendor.index.__f__("log", "at subPackages/settings/addAddress/addAddress.vue:166", e);
        }
      });
    },
    async fetchCities(provinceId) {
      try {
        const response = await api_index.api.citytree(provinceId);
        if (response.code === 200 && Array.isArray(response.data)) {
          this.cityList = response.data;
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:177", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:181", "Failed to fetch cities:", error);
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
          common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:192", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:196", "Failed to fetch areas:", error);
        return [];
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
          common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:212", "No market data found");
          this.marketList = [];
          this.marketIdMap = {};
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:217", "Failed to fetch markets:", error);
        this.marketList = [];
        this.marketIdMap = {};
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
        common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:235", "Failed to fetch provinces:", error);
        throw error;
      }
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
    async initializePicker() {
      try {
        if (this.selectedCountry === "china") {
          const provinces = await this.fetchProvinces();
          this.multiArray[0] = provinces.map((item) => item.name);
          if (provinces.length > 0) {
            const cities = await this.fetchCities(provinces[0].id);
            this.multiArray[1] = cities.map((item) => item.name);
            if (cities.length > 0) {
              const areas = await this.fetchAreas(2);
              this.multiArray[2] = areas.map((item) => item.name);
            }
          }
          this.multiIndex = [0, 0, 0];
        } else if (this.selectedCountry === "overseas") {
          const countries = await this.fetchOverseas();
          this.multiArray[0] = countries.map((c) => c.shortname);
          this.multiArray[1] = [];
          this.multiArray[2] = [];
          this.multiIndex = [0, 0, 0];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/settings/addAddress/addAddress.vue:289", "Failed to initialize picker:", error);
      }
      this.fetchMarkets(2313);
      this.selectedMarketIndex = 1;
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
    toggleDefault(e) {
      this.formData.isshow = e.detail.value ? 2 : 1;
    },
    validateForm() {
    },
    async handleSubmit() {
      let res = null;
      this.formData.area_id = this.area_id;
      if (!this.isEdit) {
        res = await api_index.api.addMyAddress(this.formData);
      } else {
        res = await api_index.api.editMyAddress(this.formData);
      }
      if (res.code == 200) {
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success",
          success: () => {
            setTimeout(() => {
              this.customizeBack();
            }, 1500);
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请求异常",
          icon: "error",
          success: () => {
            setTimeout(() => {
              this.customizeBack();
            }, 1500);
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.mapKey
  }, $data.mapKey ? {
    b: $data.location.latitude,
    c: $data.location.longitude,
    d: $data.markers
  } : {}, {
    e: $data.error.phonename ? 1 : "",
    f: $data.formData.phonename,
    g: common_vendor.o(($event) => $data.formData.phonename = $event.detail.value),
    h: $data.error.phonename
  }, $data.error.phonename ? {} : {}, {
    i: $data.error.phone ? 1 : "",
    j: $data.formData.phone,
    k: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    l: $data.error.phone
  }, $data.error.phone ? {} : {}, {
    m: common_vendor.t($data.multiArray[0][$data.multiIndex[0]]),
    n: common_vendor.t($data.multiArray[1][$data.multiIndex[1]]),
    o: common_vendor.t($data.selectedCountry === "overseas" ? "" : $data.multiArray[2][$data.multiIndex[2]]),
    p: $data.multiArray,
    q: $data.multiIndex,
    r: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    s: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    t: $data.error.region
  }, $data.error.region ? {} : {}, {
    v: $data.error.address ? 1 : "",
    w: common_vendor.o((...args) => $options.selectLocation && $options.selectLocation(...args)),
    x: $data.formData.address,
    y: common_vendor.o(($event) => $data.formData.address = $event.detail.value),
    z: $data.formData.isshow == 1 ? false : true,
    A: common_vendor.o((...args) => $options.toggleDefault && $options.toggleDefault(...args)),
    B: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9983c65f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/addAddress/addAddress.js.map
