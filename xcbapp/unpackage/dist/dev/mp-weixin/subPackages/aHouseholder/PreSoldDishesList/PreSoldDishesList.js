"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  data() {
    return {
      activeNav: 0,
      navItems: ["预卖菜品列表"],
      deleteId: null,
      vegetables: [],
      livestock: [
        // 禽畜数据
      ],
      formData: {
        farmersgoods_id: null,
        page: 1,
        limit: 30
      }
    };
  },
  mixins: [utils_public.myMixin],
  onShow() {
    this.getData();
  },
  methods: {
    origin(item) {
      common_vendor.index.__f__("log", "at subPackages/aHouseholder/PreSoldDishesList/PreSoldDishesList.vue:132", item);
      common_vendor.index.navigateTo({
        url: `/subPackages/aHouseholder/Traceability/Traceability?id=${item.id}&goodsname=${item.goodsname}&type=2`
      });
    },
    additionalinformation() {
      common_vendor.index.navigateTo({
        url: "/pages/additionalinformation/additionalinformation"
      });
    },
    beListed(item) {
      let jsondata = JSON.stringify(item);
      common_vendor.index.navigateTo({
        url: "/subPackages/aHouseholder/beListed/beListed?pramas=" + jsondata
      });
    },
    editItem(item) {
      let jsondata = JSON.stringify(item);
      common_vendor.index.navigateTo({
        url: "/subPackages/aHouseholder/modifyPreSoldDishes/modifyPreSoldDishes?pramas=" + jsondata
      });
    },
    switchNav(index) {
      this.activeNav = index;
    },
    async getData() {
      let data = await api_index.api.goodslist(this.formData);
      if (data.code == 200) {
        this.vegetables = data.data.listdata;
      }
    },
    getStatusStyle(status) {
      const styles = {
        "生长中": {
          background: "#E8F5E9",
          color: "#4CAF50"
        },
        "已采收": {
          background: "#F5F5F5",
          color: "#9E9E9E"
        }
      };
      return styles[status] || {};
    },
    showDeleteConfirm(id) {
      this.deleteId = id;
      this.$refs.deletePopup.open();
    },
    confirmDelete() {
      api_index.api.delDishes({
        id: this.deleteId
      }).then((data) => {
        common_vendor.index.__f__("log", "at subPackages/aHouseholder/PreSoldDishesList/PreSoldDishesList.vue:185", data);
        if (data.code == 200) {
          this.getData();
          common_vendor.index.showToast({
            title: data.message,
            icon: "success"
          });
        }
      });
      this.$refs.deletePopup.close();
    },
    cancelDelete() {
      this.deleteId = null;
      this.$refs.deletePopup.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup_dialog + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.activeNav === 0
  }, $data.activeNav === 0 ? {
    b: common_vendor.f($data.vegetables, (item, index, i0) => {
      return common_vendor.e({
        a: item.imglogo,
        b: common_vendor.t(item.goodsname)
      }, !$data.formData.id ? {
        c: "0ca9e5c2-0-" + i0,
        d: common_vendor.p({
          type: "trash",
          size: "18",
          color: "#fff"
        }),
        e: common_vendor.o(($event) => $options.showDeleteConfirm(item.id), item.id),
        f: "0ca9e5c2-1-" + i0,
        g: common_vendor.p({
          type: "upload",
          size: "18",
          color: "#fff"
        }),
        h: common_vendor.o(($event) => $options.beListed(item), item.id),
        i: "0ca9e5c2-2-" + i0,
        j: common_vendor.p({
          type: "staff",
          size: "18",
          color: "#fff"
        }),
        k: common_vendor.o(($event) => $options.additionalinformation(item), item.id),
        l: "0ca9e5c2-3-" + i0,
        m: common_vendor.p({
          type: "staff",
          size: "18",
          color: "#fff"
        }),
        n: common_vendor.o(($event) => $options.origin(item), item.id),
        o: "0ca9e5c2-4-" + i0,
        p: common_vendor.p({
          type: "staff",
          size: "18",
          color: "#fff"
        }),
        q: common_vendor.o(($event) => $options.editItem(item), item.id)
      } : {}, {
        r: item.id
      });
    }),
    c: !$data.formData.id
  } : {}, {
    d: $data.activeNav === 1
  }, $data.activeNav === 1 ? {
    e: common_vendor.f($data.livestock, (item, index, i0) => {
      return {
        a: item.id
      };
    })
  } : {}, {
    f: $data.vegetables.length <= 0
  }, $data.vegetables.length <= 0 ? {} : {}, {
    g: common_vendor.o($options.confirmDelete),
    h: common_vendor.o($options.cancelDelete),
    i: common_vendor.p({
      mode: "base",
      title: "确认删除",
      content: "确定要删除这个预卖菜品？"
    }),
    j: common_vendor.sr("deletePopup", "0ca9e5c2-5"),
    k: common_vendor.p({
      type: "dialog"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0ca9e5c2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/aHouseholder/PreSoldDishesList/PreSoldDishesList.js.map
