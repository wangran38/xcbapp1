"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  name: "fegionSelection",
  data() {
    return {
      areaData: [
        [],
        [],
        []
      ],
      areaIndex: [
        0,
        0,
        0
      ],
      provinceList: [],
      cityLevelList: []
    };
  },
  mounted() {
    this.initPicker();
  },
  methods: {
    bindPickerChange({ detail }) {
      switch (detail.column) {
        case 0:
          common_vendor.index.__f__("log", "at components/fegionSelection/fegionSelection.vue:40", this.provinceList[detail.value], "索引");
          this.getCitytreeData(this.provinceList[detail.value].id);
          break;
      }
    },
    async getCitytreeData(pid) {
      let res = await api_index.api.citytree(pid);
      if (res.code == 200) {
        this.cityLevelList = res.data;
        this.areaData[1] = this.cityLevelList.map((item) => item.name);
      }
    },
    async initPicker() {
      try {
        const response = await api_index.api.citylist({
          level: 1,
          limit: 100
        });
        if (response.code === 200) {
          this.provinceList = response.data.listdata;
          this.areaData[0] = this.provinceList.map((item) => item.shortname);
          return this.provinceList;
        }
        throw new Error("Failed to fetch provinces");
      } catch (error) {
        common_vendor.index.__f__("error", "at components/fegionSelection/fegionSelection.vue:69", "Failed to fetch provinces:", error);
        throw error;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.areaData[0]),
    b: common_vendor.t($data.areaData[1][$data.areaIndex[1]]),
    c: common_vendor.t($data.areaData[2][$data.areaIndex[2]]),
    d: $data.areaIndex,
    e: $data.areaData,
    f: common_vendor.o((...args) => $options.bindPickerChange && $options.bindPickerChange(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/fegionSelection/fegionSelection.js.map
