"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const mButtonVue = () => "../../../components/public/mButton/mButton.js";
const _sfc_main = {
  mixins: [utils_public.myMixin],
  components: {
    mButtonVue
  },
  data() {
    return {
      activeCategory: 0,
      searchText: "",
      scrollHeight: 0,
      categories: [],
      query: {
        category_name: null,
        // 分类
        page: 1,
        limit: 10
      },
      newsList: [],
      isNext: false
    };
  },
  mounted() {
    this.calcScrollHeight();
    this.initClassification();
    this.getData();
  },
  watch: {
    activeCategory(newValue, oldValue) {
      this.query.page = 1;
      this.isNext = false;
      this.query.category_name = this.categories[newValue].name;
      this.getData(true);
    }
  },
  methods: {
    // 翻页
    changePage() {
      if (!this.isNext) {
        this.query.page += 1;
        this.getData();
      }
    },
    // 分类数据
    async initClassification() {
      let data = await api_index.api.classification({});
      if (data.code == 200) {
        let newList = data.data.map((item, index) => {
          return {
            id: index,
            name: item
          };
        });
        common_vendor.index.__f__("log", "at subPackages/shoppingPageList/realTimeInfo/realTimeInfo.vue:107", newList);
        this.categories = [{
          id: -1,
          name: "全部"
        }, ...newList];
      }
    },
    async getData(lock = false) {
      let data = await api_index.api.informationData(this.query);
      if (data.code == 200) {
        if (!lock) {
          this.newsList = [...this.newsList, ...data.data.listdata];
        } else {
          this.newsList = data.data.listdata;
        }
        this.isNext = data.data.listdata.length < this.query.limit ? true : false;
      }
    },
    calcScrollHeight() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.scrollHeight = systemInfo.windowHeight - 180;
    },
    // 切换分类
    switchCategory(index) {
      this.activeCategory = index;
      this.query.category_name = this.categories[index].name;
    },
    onSearchInput(e) {
      this.searchText = e.detail.value.trim();
    },
    navigateToDetail(item) {
      let content = encodeURIComponent(item.content);
      common_vendor.index.navigateTo({
        url: `/subPackages/shoppingPageList/realTimeInfoDetail/realTimeInfoDetail?content=${content}&createtime=${this.initTime(item.createtime)}`
      });
    }
  }
};
if (!Array) {
  const _component_mButtonVue = common_vendor.resolveComponent("mButtonVue");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_mButtonVue + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(_ctx.startSearch),
    b: common_vendor.o(_ctx.stopSearch),
    c: common_vendor.p({
      isShowbutton2: true,
      placeholder: "输入关键词搜索"
    }),
    d: common_vendor.f($data.categories, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: $data.activeCategory === index
      }, $data.activeCategory === index ? {} : {}, {
        c: item.id,
        d: $data.activeCategory === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchCategory(index), item.id)
      });
    }),
    e: common_vendor.f($data.newsList, (news, k0, i0) => {
      return {
        a: common_vendor.t(news.title),
        b: common_vendor.t(news.description),
        c: common_vendor.t(_ctx.initTime(news.createtime)),
        d: "ffc9b95d-1-" + i0,
        e: common_vendor.t(news.likeCount),
        f: news.id,
        g: common_vendor.o(($event) => $options.navigateToDetail(news), news.id)
      };
    }),
    f: common_vendor.p({
      type: "hand-up",
      size: "14"
    }),
    g: $data.scrollHeight + "px",
    h: common_vendor.o((...args) => $options.changePage && $options.changePage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ffc9b95d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/realTimeInfo/realTimeInfo.js.map
