"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      activeNav: 0,
      categories: [
        { name: "蔬菜" },
        { name: "水果" },
        { name: "水产" },
        { name: "肉类" }
      ],
      productList: [
        {
          id: 1,
          cover: "https://qcloud.dpfile.com/pc/wjwuf0kuNAC-9AUfBkdUJL5dT3d8GGcuGlPpgYqjMJQDY_ZFhBScrG7sKiYM3WjS.jpg",
          title: "海南叶椰子 现摘现发",
          price: 8.8,
          originalPrice: 12.6,
          unit: "个",
          sales: 3280,
          progress: 82,
          origin: "海南万宁",
          isNew: true
        }
      ]
    };
  },
  methods: {
    switchNav(index) {
      this.activeNav = index;
    },
    navToDetail(id) {
      common_vendor.index.navigateTo({ url: `/pages/detail?id=${id}` });
    },
    addToCart(item) {
      common_vendor.index.showToast({
        title: `已加入助农清单：${item.title}`,
        icon: "none"
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
  return {
    a: common_vendor.p({
      type: "search",
      size: "20",
      color: "#999"
    }),
    b: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: common_vendor.n($data.activeNav === index ? "active" : ""),
        d: common_vendor.o(($event) => $options.switchNav(index), index)
      };
    }),
    c: common_vendor.f($data.productList, (item, index, i0) => {
      return common_vendor.e({
        a: item.cover,
        b: common_vendor.t(item.origin),
        c: item.isNew
      }, item.isNew ? {} : {}, {
        d: common_vendor.t(item.title),
        e: common_vendor.t(item.price),
        f: common_vendor.t(item.originalPrice),
        g: item.progress,
        h: common_vendor.t(item.sales),
        i: common_vendor.t(item.unit),
        j: "8e4dba1e-1-" + i0,
        k: common_vendor.o(($event) => $options.addToCart(item), index),
        l: index,
        m: common_vendor.o(($event) => $options.navToDetail(item.id), index)
      });
    }),
    d: common_vendor.p({
      type: "shop",
      size: "18",
      color: "#666"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8e4dba1e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/official/official.js.map
