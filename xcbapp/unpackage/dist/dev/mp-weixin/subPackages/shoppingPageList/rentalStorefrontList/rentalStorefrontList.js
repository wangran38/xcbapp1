"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentFilter: "all",
      filterOptions: [
        { label: "全部", value: "all" },
        { label: "待出租", value: "available" },
        { label: "已出租", value: "leased" }
      ],
      stallData: [],
      loading: false,
      noMore: false
    };
  },
  computed: {
    filteredStalls() {
      return this.stallData.filter(
        (item) => this.currentFilter === "all" || item.status === this.currentFilter
      );
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.stallData = this.getMockData();
      } finally {
        this.loading = false;
        this.noMore = true;
      }
    },
    getMockData() {
      return [
        {
          id: 1,
          number: "A-01",
          status: "leased",
          price: 2400,
          area: 8,
          location: "蔬菜区主通道",
          suitable: "绿叶蔬菜专营",
          image: "https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
          features: ["智能电子秤", "扫码溯源"]
        },
        {
          id: 2,
          number: "B-02",
          status: "available",
          price: 2400,
          area: 8,
          location: "肉类边柜区",
          suitable: "冷冻肉制品",
          image: "https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
          features: ["独立冷藏柜", "押金1.5万"]
        },
        {
          id: 3,
          number: "C-01",
          status: "leased",
          price: 2400,
          area: 12,
          location: "水产鲜活区",
          suitable: "活鱼现杀",
          image: "https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
          features: ["循环水系统", "日交易200斤+"]
        },
        {
          id: 4,
          number: "H-02",
          status: "available",
          price: 2400,
          area: 10,
          location: "熟食区",
          suitable: "早餐",
          image: "https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
          features: ["粉汤", "炒粉", "猪脚饭"]
        }
      ];
    },
    changeFilter(status) {
      this.currentFilter = status;
    },
    loadMore() {
      if (!this.noMore)
        ;
    },
    viewDetail(id) {
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/rentalStorefront/rentalStorefront`
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
    a: common_vendor.p({
      type: "map-pin",
      size: "20",
      color: "#666"
    }),
    b: common_vendor.f($data.filterOptions, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: index,
        c: common_vendor.n({
          active: $data.currentFilter === item.value
        }),
        d: common_vendor.o(($event) => $options.changeFilter(item.value), index)
      };
    }),
    c: common_vendor.f($options.filteredStalls, (stall, index, i0) => {
      return {
        a: stall.image,
        b: common_vendor.t(stall.number),
        c: common_vendor.t(stall.status === "leased" ? "已出租" : "待出租"),
        d: common_vendor.n(stall.status),
        e: common_vendor.t(stall.price.toLocaleString()),
        f: common_vendor.t(stall.area),
        g: "0154dd3c-1-" + i0,
        h: common_vendor.t(stall.location),
        i: "0154dd3c-2-" + i0,
        j: common_vendor.t(stall.suitable),
        k: common_vendor.f(stall.features, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        l: index,
        m: common_vendor.o(($event) => $options.viewDetail(stall.id), index)
      };
    }),
    d: common_vendor.p({
      type: "location",
      size: "14",
      color: "#666"
    }),
    e: common_vendor.p({
      type: "shop",
      size: "14",
      color: "#666"
    }),
    f: $data.loading
  }, $data.loading ? {} : $data.noMore ? {
    h: common_vendor.t($options.filteredStalls.length)
  } : {}, {
    g: $data.noMore,
    i: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0154dd3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/rentalStorefrontList/rentalStorefrontList.js.map
