"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_public = require("../../utils/public.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      rewardRecords: [
        // { 
        //   title: '被邀请人消费返佣', 
        //   amount: 35.50, 
        //   time: '2024-09-22 15:35',
        //   invitee: '张三'
        // }
      ],
      totalMoney: 0,
      query: {
        page: 1,
        limit: 20
      }
    };
  },
  onLoad() {
    this.getdata();
  },
  methods: {
    async getdata() {
      let data = await api_index.api.userRevenue(this.query);
      if (data.code == 200) {
        this.totalMoney = data.data.totalMoney;
        this.rewardRecords = [...this.rewardRecords, ...data.data.listdata];
        common_vendor.index.__f__("log", "at pages/earningsRecord/earningsRecord.vue:81", data);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.totalMoney),
    b: common_vendor.f($data.rewardRecords, (item, index, i0) => {
      return {
        a: common_vendor.t(_ctx.initTime(item.createtime)),
        b: common_vendor.t(item.level6money),
        c: index
      };
    }),
    c: $data.rewardRecords.length === 0
  }, $data.rewardRecords.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2fd53ada"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/earningsRecord/earningsRecord.js.map
