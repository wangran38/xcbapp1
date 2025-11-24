"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  async onLoad({
    query
  }) {
    if (query) {
      this.product = JSON.parse(query);
      this.product.images = [];
    }
    this.initCount();
    let data = await api_index.api.traceabilityInfo({
      goods_id: Number(this.product.goods_id)
    });
    let data2 = await api_index.api.getManyImages({
      goodsid: Number(this.product.goods_id)
    });
    if (data2.code == 200) {
      data2.data.forEach((item) => {
        this.product.images.push(item.url);
        this.swiperKey++;
      });
    }
    this.product.description = data.data.content;
    this.product.traceability = data.data.fromcontent;
  },
  data() {
    return {
      showCountInput: false,
      swiperKey: 0,
      // 商品数据
      product: {
        id: 1,
        title: "有机生态种植红富士苹果 5斤装 新鲜水果 脆甜多汁",
        price: 39.9,
        originalPrice: 59.9,
        salesVolume: null,
        // 已售
        rating: 4.7,
        reviewCount: 328,
        images: [],
        description: ``,
        traceability: null,
        reviews: []
      },
      // 相关推荐商品
      relatedProducts: [],
      // 标签页
      tabs: [
        {
          name: "基础信息"
        },
        {
          name: "溯源信息"
        }
        // {
        // 	name: "用户评价"
        // },
        // {
        // 	name: "种养来历"
        // }
      ],
      activeTab: 0,
      // 选择的规格索引
      selectedSpecIndex: 0,
      // 是否收藏
      isFavorite: false,
      count: 1
    };
  },
  methods: {
    initCount() {
      let oldCount = this.getTempCount()(this.product.id);
      if (oldCount > 1) {
        this.count = oldCount;
      }
    },
    ...common_vendor.mapGetters("cart", ["getTempCount"]),
    ...common_vendor.mapMutations("cart", ["addItem", "anyNumber", "subItem"]),
    // 分享
    onShare() {
    },
    // 取消
    cancelAddToCart() {
      this.showCountInput = false;
      common_vendor.index.showToast({
        icon: "success",
        title: "已取消"
      });
      this.initCount();
    },
    // 确定加入购物车
    confirmAddToCart() {
      this.product.count = this.count;
      this.anyNumber(this.product);
      common_vendor.index.showToast({
        icon: "success",
        title: "已加入"
      });
      this.showCountInput = false;
    },
    // 减少数量
    decreaseQuantity() {
      if (this.count <= 0)
        return;
      this.count--;
    },
    // 增加数量
    increaseQuantity() {
      this.count++;
    },
    // 查看质检报告
    viewReport() {
    },
    // 加载更多评价
    loadMoreReviews() {
    },
    // 加入收藏
    addToFavorites() {
    },
    // 联系客服
    contactSeller() {
    },
    // 加入购物车
    addToCart() {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.product.images, (img, k0, i0) => {
      return {
        a: img
      };
    }),
    b: $data.swiperKey,
    c: common_vendor.t($data.product.commodity_name),
    d: common_vendor.t($data.product.price.toFixed(2)),
    e: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: index,
        c: $data.activeTab === index ? 1 : "",
        d: common_vendor.o(($event) => $data.activeTab = index, index)
      };
    }),
    f: $data.activeTab === 0
  }, $data.activeTab === 0 ? {
    g: $data.product.description
  } : {}, {
    h: $data.activeTab === 1
  }, $data.activeTab === 1 ? {
    i: $data.product.traceability
  } : {}, {
    j: $data.activeTab === 2
  }, $data.activeTab === 2 ? {} : {}, {
    k: !$data.showCountInput
  }, !$data.showCountInput ? {
    l: common_vendor.o(($event) => $data.showCountInput = true)
  } : {}, {
    m: $data.showCountInput
  }, $data.showCountInput ? {
    n: common_vendor.o((...args) => $options.decreaseQuantity && $options.decreaseQuantity(...args)),
    o: $data.count,
    p: common_vendor.o(($event) => $data.count = $event.detail.value),
    q: common_vendor.o((...args) => $options.increaseQuantity && $options.increaseQuantity(...args)),
    r: common_vendor.o((...args) => $options.confirmAddToCart && $options.confirmAddToCart(...args)),
    s: common_vendor.o((...args) => $options.cancelAddToCart && $options.cancelAddToCart(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7f9cd24e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/commodityDetail/commodityDetail.js.map
