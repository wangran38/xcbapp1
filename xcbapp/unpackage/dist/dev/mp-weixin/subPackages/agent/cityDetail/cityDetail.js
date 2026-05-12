"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      cityId: "",
      cityName: "",
      districtList: [],
      totalDistrictCount: 0,
      totalMarketCount: 0,
      totalConsume: 0,
      pageNum: 1,
      pageSize: 5,
      hasMore: true
    };
  },
  onLoad(options) {
    this.districtList = JSON.parse(options.children).map((item) => {
      return {
        id: item.pid,
        name: item.name,
        marketCount: 0,
        totalConsume: 0
      };
    });
  },
  methods: {
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 加载区县数据
    loadDistrictData() {
      try {
        common_vendor.index.showLoading({
          title: "加载中...",
          mask: true
        });
        const districtMap = {
          city_01: [
            // 广州市
            {
              id: "district_0101",
              name: "秀英区",
              marketCount: 12,
              totalConsume: 896002.8
            },
            {
              id: "district_0102",
              name: "龙华区",
              marketCount: 9,
              totalConsume: 752005.5
            },
            {
              id: "district_0103",
              name: "琼山区",
              marketCount: 10,
              totalConsume: 689001.1
            },
            {
              id: "district_0104",
              name: "美兰区",
              marketCount: 8,
              totalConsume: 587003.3
            }
          ],
          city_02: [
            // 深圳市
            {
              id: "district_0201",
              name: "海棠区",
              marketCount: 10,
              totalConsume: 958003.3
            },
            {
              id: "district_0202",
              name: "吉阳区",
              marketCount: 8,
              totalConsume: 887005.5
            },
            {
              id: "district_0203",
              name: "天涯区",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "崖州区",
              marketCount: 9,
              totalConsume: 789008.8
            }
          ],
          city_03: [
            // 深圳市
            {
              id: "district_0201",
              name: "西沙群岛",
              marketCount: 10,
              totalConsume: 958003.3
            },
            {
              id: "district_0202",
              name: "南沙群岛",
              marketCount: 8,
              totalConsume: 887005.5
            },
            {
              id: "district_0203",
              name: "中沙群岛",
              marketCount: 9,
              totalConsume: 789008.8
            }
          ],
          city_04: [
            // 深圳市
            {
              id: "district_0201",
              name: "五指山市",
              marketCount: 10,
              totalConsume: 958003.3
            },
            {
              id: "district_0202",
              name: "琼海市",
              marketCount: 8,
              totalConsume: 887005.5
            },
            {
              id: "district_0203",
              name: "儋州市",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "文昌市",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "万宁市",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "东方市",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "定安县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "屯昌县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "澄迈县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "临高县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "白沙县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "昌江县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "乐东县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "陵水县",
              marketCount: 9,
              totalConsume: 789008.8
            },
            {
              id: "district_0203",
              name: "保亭县",
              marketCount: 9,
              totalConsume: 789008.8
            }
          ]
        };
        const allDistricts = districtMap[this.cityId] || districtMap.city_01;
        const paginatedData = allDistricts.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize);
        this.districtList = this.pageNum === 1 ? paginatedData : [...this.districtList, ...paginatedData];
        this.totalDistrictCount = allDistricts.length;
        this.totalMarketCount = allDistricts.reduce((sum, item) => sum + item.marketCount, 0);
        this.totalConsume = allDistricts.reduce((sum, item) => sum + item.totalConsume, 0);
        this.hasMore = this.pageNum * this.pageSize < allDistricts.length;
        common_vendor.index.hideLoading();
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/cityDetail/cityDetail.vue:284", "加载区县数据失败：", error);
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none"
        });
      }
    },
    // 加载更多
    loadMore() {
      this.pageNum++;
      this.loadDistrictData();
    },
    // 跳转到区县详情页
    toDistrictDetail(district) {
      common_vendor.index.navigateTo({
        url: `/subPackages/agent/districtDetail/districtDetail?districtId=${district.id}&districtName=${district.name}&cityName=${this.cityName}`
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(0),
    b: common_vendor.t($data.totalMarketCount),
    c: common_vendor.t($data.totalConsume.toFixed(1)),
    d: !$data.districtList.length
  }, !$data.districtList.length ? {} : {
    e: common_vendor.f($data.districtList, (district, index, i0) => {
      return {
        a: common_vendor.t(district.name),
        b: "f8530dd0-0-" + i0,
        c: common_vendor.t(district.marketCount),
        d: common_vendor.t(district.totalConsume.toLocaleString()),
        e: district.id,
        f: common_vendor.o(($event) => $options.toDistrictDetail(district), district.id)
      };
    }),
    f: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f8530dd0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/cityDetail/cityDetail.js.map
