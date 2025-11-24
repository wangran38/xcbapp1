"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_public = require("../../../utils/public.js");
const api_index = require("../../../api/index.js");
const oneVue = () => "./componment/one.js";
const twoVue = () => "./componment/two.js";
const threeVue = () => "./componment/three.js";
const describeVue = () => "./componment/describe.js";
const _sfc_main = {
  mixins: [utils_public.myMixin],
  components: {
    oneVue,
    twoVue,
    threeVue,
    describeVue
  },
  data() {
    return {
      show: false,
      content: `
				第一
				第二
				第三
				第四
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				`,
      selectIndex: 0,
      typeList: [
        {
          id: 1,
          name: "自销",
          active: true,
          refName: "oneRef"
        },
        {
          id: 2,
          name: "提货点",
          active: false,
          refName: "twoRef"
        },
        {
          id: 2,
          name: "批发",
          active: false,
          refName: "threeRef"
        }
      ],
      dishId: null
    };
  },
  // 加载菜品id
  onLoad({
    pramas
  }) {
    this.dishId = JSON.parse(pramas).id;
  },
  methods: {
    /**
     * 
     * @description 自定义事件回调函数,启动窗口
     */
    Open(value) {
      this.show = true;
    },
    Close() {
      this.show = false;
    },
    /**
     * @param formData
     */
    agree(formData) {
      common_vendor.index.showToast({
        icon: "loading",
        title: "正在处理......"
      });
      this.typeList.filter((item) => {
        setTimeout(async () => {
          if (item.active) {
            let formData2 = this.$refs[item.refName].formData;
            formData2.farmersgoods_id = this.dishId;
            formData2.market_id = this.$refs[item.refName]["marketIdMap"][this.$refs[item.refName].marketList[this.$refs[item.refName].selectedMarketIndex]];
            formData2.area_id = this.$refs[item.refName]["area_id"];
            formData2 = { ...formData2, isshow: 2, ispresale: 2 };
            common_vendor.index.__f__("log", "at subPackages/aHouseholder/beListed/beListed.vue:158", formData2);
            let res = await api_index.api.foodOnSale(formData2);
            if (res.code == 200) {
              common_vendor.index.showToast({
                icon: "success",
                title: "提交成功"
              });
              setTimeout(() => {
                this.customizeBack();
              }, 1e3);
            } else {
              setTimeout(() => {
                common_vendor.index.showToast({
                  icon: "error",
                  title: "提交异常！！！！"
                });
              }, 1e3);
            }
          }
        }, 1e3);
      });
      this.Close();
    },
    // 不同意
    disagree() {
      this.Close();
    },
    selectItem(item, index) {
      this.typeList.filter((item2) => {
        item2.active = false;
      });
      this.selectIndex = index;
      item.active = true;
    }
  }
};
if (!Array) {
  const _component_one_vue = common_vendor.resolveComponent("one-vue");
  const _component_two_vue = common_vendor.resolveComponent("two-vue");
  const _component_three_vue = common_vendor.resolveComponent("three-vue");
  const _component_describe_vue = common_vendor.resolveComponent("describe-vue");
  (_component_one_vue + _component_two_vue + _component_three_vue + _component_describe_vue)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.typeList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.o(($event) => $options.selectItem(item, index)),
        c: common_vendor.s(item.active ? {
          background: "linear-gradient(135deg, #2d8cf0, #53a1f3)",
          color: "white"
        } : {})
      };
    }),
    b: common_vendor.sr("oneRef", "73db4282-0"),
    c: $data.selectIndex == 0,
    d: common_vendor.o($options.Open),
    e: common_vendor.sr("twoRef", "73db4282-1"),
    f: $data.selectIndex == 1,
    g: common_vendor.o($options.Open),
    h: common_vendor.sr("threeRef", "73db4282-2"),
    i: $data.selectIndex == 2,
    j: common_vendor.o($options.Open),
    k: common_vendor.o($options.agree),
    l: common_vendor.o($options.disagree),
    m: common_vendor.p({
      show: $data.show,
      content: $data.content
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/beListed/beListed.js.map
