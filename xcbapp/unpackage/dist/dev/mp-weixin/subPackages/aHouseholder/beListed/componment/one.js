"use strict";
const common_vendor = require("../../../../common/vendor.js");
const api_index = require("../../../../api/index.js");
const _sfc_main = {
  name: "one",
  mounted() {
    this.initializePicker();
    this.fetchMarkets();
  },
  data() {
    return {
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
      // 添加市场列表
      marketIdMap: {},
      // 菜市场名称到ID的映射
      selectedMarketIndex: 0,
      // 记录当前选择的市场索引
      area_id: null,
      market_id: null,
      isSubmitting: false,
      formData: {
        sellstatus: 1,
        // 自销
        farmersgoods_id: null,
        // 菜品id，
        market_id: null,
        // 市场id
        area_id: null,
        // 城市id
        unit: null,
        // 单位
        ispresale: 2,
        // 是否上市
        sellbegintime: null,
        // 开始时间戳
        sellendtime: null,
        // 结束时间戳
        presaleprice: null,
        // 市场价
        price: null,
        // 上市价
        goodstotal: null,
        // 库存
        contactpeople: null,
        // 联系人
        contactphone: null,
        // 手机号
        pickaddress: null
        // 取货点
      }
    };
  },
  methods: {
    submit() {
      this.$emit("open", "自销");
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
        common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:201", "Failed to initialize picker:", error);
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
        common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:217", "Failed to fetch provinces:", error);
        throw error;
      }
    },
    async fetchCities(provinceId) {
      try {
        const response = await api_index.api.citytree(provinceId);
        if (response.code === 200 && Array.isArray(response.data)) {
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:229", "No cities data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:233", "Failed to fetch cities:", error);
        return [];
      }
    },
    async fetchAreas(cityId) {
      try {
        const response = await api_index.api.citytree(cityId);
        if (response.code === 200 && Array.isArray(response.data)) {
          return response.data;
        } else {
          common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:245", "No areas data found");
          return [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:249", "Failed to fetch areas:", error);
        return [];
      }
    },
    bindMultiPickerChange(e) {
      this.multiIndex = e.detail.value;
      const selectedProvince = this.multiArray[0][this.multiIndex[0]];
      const selectedCity = this.multiArray[1][this.multiIndex[1]];
      const selectedArea = this.multiArray[2][this.multiIndex[2]];
      const selectedAreaId = this.districtList[this.multiIndex[2]].id;
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/beListed/componment/one.vue:259", "选择的省市区:", selectedProvince, selectedCity, selectedArea);
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
          common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:302", "Failed to fetch markets:", response.message);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/aHouseholder/beListed/componment/one.vue:305", "Failed to fetch markets:", error);
      }
    },
    bindMarketChange(e) {
      this.selectedMarketIndex = e.detail.value;
      const selectedMarketName = this.marketList[this.selectedMarketIndex];
      this.market_id = this.marketIdMap[selectedMarketName] || null;
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_easycom_uni_icons2 + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_icons = () => "../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_datetime_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.multiArray[0][$data.multiIndex[0]] || "省"),
    b: common_vendor.t($data.multiArray[1][$data.multiIndex[1]] || "市"),
    c: common_vendor.t($data.multiArray[2][$data.multiIndex[2]] || "区"),
    d: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    e: $data.multiArray,
    f: $data.multiIndex,
    g: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    h: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    i: common_vendor.t($data.marketList[$data.selectedMarketIndex] || "请选择菜市场"),
    j: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    k: $data.marketList,
    l: $data.selectedMarketIndex,
    m: common_vendor.o((...args) => $options.bindMarketChange && $options.bindMarketChange(...args)),
    n: $data.formData.pickaddress,
    o: common_vendor.o(($event) => $data.formData.pickaddress = $event.detail.value),
    p: $data.formData.price,
    q: common_vendor.o(common_vendor.m(($event) => $data.formData.price = $event.detail.value, {
      number: true
    })),
    r: $data.formData.presaleprice,
    s: common_vendor.o(common_vendor.m(($event) => $data.formData.presaleprice = $event.detail.value, {
      number: true
    })),
    t: $data.formData.goodstotal,
    v: common_vendor.o(common_vendor.m(($event) => $data.formData.goodstotal = $event.detail.value, {
      number: true
    })),
    w: $data.formData.unit,
    x: common_vendor.o(($event) => $data.formData.unit = $event.detail.value),
    y: common_vendor.o(($event) => $data.formData.sellbegintime = $event),
    z: common_vendor.p({
      type: "date",
      ["return-type"]: "timestamp",
      modelValue: $data.formData.sellbegintime
    }),
    A: common_vendor.o(($event) => $data.formData.sellendtime = $event),
    B: common_vendor.p({
      type: "date",
      ["return-type"]: "timestamp",
      modelValue: $data.formData.sellendtime
    }),
    C: $data.formData.contactpeople,
    D: common_vendor.o(($event) => $data.formData.contactpeople = $event.detail.value),
    E: $data.formData.contactphone,
    F: common_vendor.o(($event) => $data.formData.contactphone = $event.detail.value),
    G: common_vendor.t($data.isSubmitting ? "提交中..." : "立即提交"),
    H: $data.isSubmitting
  }, $data.isSubmitting ? {} : {}, {
    I: $data.isSubmitting ? 1 : "",
    J: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0d62553b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/beListed/componment/one.js.map
