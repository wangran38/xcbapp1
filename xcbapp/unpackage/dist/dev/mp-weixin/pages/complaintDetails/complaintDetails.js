"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_public = require("../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      statusTypes: ["处理中", "已受理", "调解中", "已完结"],
      detail: {
        id: "TS20231015001",
        status: 0,
        // 0-待处理 1-处理中 2-已完成   
        createTime: "2023-10-15 14:30:45",
        phone: "138****1234",
        content: "购买的菜品质量不行，还有商家的态度极差",
        images: []
      },
      processSteps: [
        {
          title: "处理中",
          time: "2023-10-15 14:30"
        },
        {
          title: "已受理",
          time: "2023-10-15 15:15"
        },
        {
          title: "调解中",
          time: "2023-10-16 09:30"
        },
        {
          title: "已完结",
          time: "2023-10-17 14:00"
        }
      ],
      statusColors: ["#FF9F43", "#2E86DE", "#10AC84", "#8395A7"]
    };
  },
  onLoad({
    strJsonData
  }) {
    if (strJsonData) {
      let data = JSON.parse(strJsonData);
      if (data.complaint_img) {
        data.complaint_img = data.complaint_img.split(",");
      }
      this.detail = data;
    }
  },
  methods: {
    // 标签样式
    tagStyle(status) {
      return {
        background: this.statusColors[status] + "15",
        Color: this.statusColors[status]
      };
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    previewImage(index) {
      common_vendor.index.previewImage({
        current: index,
        urls: this.detail.complaint_img
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.statusTypes[$data.detail.status - 1]),
    b: common_vendor.s($options.tagStyle($data.detail.status - 1)),
    c: common_vendor.t(_ctx.initTime($data.detail.createtime)),
    d: common_vendor.t($data.detail.phone),
    e: common_vendor.t($data.detail.content),
    f: common_vendor.t($data.detail.complaint_img.length),
    g: common_vendor.f($data.detail.complaint_img, (img, index, i0) => {
      return {
        a: img,
        b: index,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    }),
    h: $data.detail.complaint_img.length <= 0
  }, $data.detail.complaint_img.length <= 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-af642d83"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/complaintDetails/complaintDetails.js.map
