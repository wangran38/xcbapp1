"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const _sfc_main = {
  data() {
    return {
      addressData: [],
      formData: {
        page: 1,
        limit: 10
      }
    };
  },
  onShow() {
    this.getAddressData();
  },
  methods: {
    async getAddressData() {
      let res = await api_index.api.myaddressData(this.formData);
      if (res.code == 200) {
        this.addressData = res.data.listdata;
      }
    },
    addNewAddress() {
      common_vendor.index.navigateTo({
        url: "/subPackages/settings/addAddress/addAddress?isEdit=false"
      });
    },
    editAddress(item) {
      common_vendor.index.__f__("log", "at subPackages/settings/myAddress/myAddress.vue:100", item);
      let jsonData = JSON.stringify(item);
      common_vendor.index.navigateTo({
        url: `/subPackages/settings/addAddress/addAddress?isEdit=true&jsonData=${jsonData}`
      });
    },
    deleteAddress(item) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个地址吗？",
        success: async (res) => {
          common_vendor.index.__f__("log", "at subPackages/settings/myAddress/myAddress.vue:112", res);
          if (res.confirm) {
            let data = await api_index.api.delMyAddress({ id: item.Id });
            common_vendor.index.__f__("log", "at subPackages/settings/myAddress/myAddress.vue:115", data);
            if (data.code == 200) {
              common_vendor.index.showToast({
                icon: "success",
                title: data.message || data.msg
              });
              this.getAddressData();
            } else {
              common_vendor.index.showToast({
                icon: "error",
                title: data.message || data.msg
              });
            }
          }
        }
      });
    },
    toggleDefault(index) {
      this.addressData.forEach((item) => item.isDefault = false);
      this.addressData[index].isDefault = true;
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
    a: common_vendor.f($data.addressData, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.phonename),
        b: item.isshow == 2
      }, item.isshow == 2 ? {} : {}, {
        c: common_vendor.t(item.phone),
        d: common_vendor.t(item.area_id),
        e: common_vendor.t(item.address),
        f: "9e1740bb-0-" + i0,
        g: common_vendor.o(($event) => $options.editAddress(item), item.Id),
        h: "9e1740bb-1-" + i0,
        i: common_vendor.o(($event) => $options.deleteAddress(item), item.Id),
        j: item.Id,
        k: item.isshow == 2 ? 1 : ""
      });
    }),
    b: common_vendor.p({
      type: "compose",
      size: "18"
    }),
    c: common_vendor.p({
      type: "trash",
      size: "18"
    }),
    d: $data.addressData.length === 0
  }, $data.addressData.length === 0 ? {} : {}, {
    e: common_vendor.p({
      type: "plus",
      size: "20",
      color: "#fff"
    }),
    f: common_vendor.o((...args) => $options.addNewAddress && $options.addNewAddress(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9e1740bb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/myAddress/myAddress.js.map
