"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      markers: [],
      location: {
        latitude: null,
        longitude: null
      },
      formdata: {
        page: 1,
        limit: 1e3
      }
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
        this.location.latitude = res.latitude;
        this.mapKey = true;
        common_vendor.index.__f__("log", "at subPackages/shoppingPageList/statisticsMap/statisticsMap.vue:43", this.location);
        this.markers.push({ id: 1, label: { content: "当前位置", fontSize: 25 }, longitude: this.location.longitude, latitude: this.location.latitude, iconPath: "../../../static/selectlocation.png", width: 30, height: 30 });
        this.getData();
      },
      fail(e) {
        common_vendor.index.__f__("log", "at subPackages/shoppingPageList/statisticsMap/statisticsMap.vue:49", e);
      }
    });
  },
  methods: {
    async getData() {
      let data = await api_index.api.farmersList(this.formdata);
      if (data.code = 200) {
        let dataArray = data.data.listdata.map((item, index) => {
          return { id: index + 2, longitude: item.lng, latitude: item.lat, iconPath: "../../../static/selectlocation.png", width: 30, height: 30, label: { content: item.farmersname, fontSize: 25 } };
        });
        this.markers = [...this.markers, ...dataArray];
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.markers,
    b: $data.location.latitude,
    c: $data.location.longitude,
    d: {
      content: "111"
    }
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/statisticsMap/statisticsMap.js.map
