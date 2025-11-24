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
      common_vendor.index.__f__("log", "at subPackages/settings/myAddress/myAddress.vue:39", item);
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
          common_vendor.index.__f__("log", "at subPackages/settings/myAddress/myAddress.vue:51", res);
          if (res.confirm) {
            let data = await api_index.api.delMyAddress({ id: item.Id });
            common_vendor.index.__f__("log", "at subPackages/settings/myAddress/myAddress.vue:54", data);
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9e1740bb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/myAddress/myAddress.js.map
