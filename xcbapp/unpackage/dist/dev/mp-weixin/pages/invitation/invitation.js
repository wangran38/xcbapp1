"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_public = require("../../utils/public.js");
const posterVue = () => "../../components/poster.js";
const _sfc_main = {
  components: {
    posterVue
  },
  mixins: [utils_public.myMixin],
  data() {
    return {
      // 邀请码（实际项目中从接口获取当前用户的专属邀请码）
      inviteCode: "INV8866",
      // 邀请记录（模拟数据，实际替换为接口数据）
      inviteRecords: [],
      query: {
        page: 1,
        limit: 10
      },
      turnThePage: true
    };
  },
  onLoad() {
    this.getFromuserlist();
  },
  methods: {
    // 获取用户id
    loadInviteCode(uid) {
      this.inviteCode = uid;
    },
    changePage() {
      if (!this.turnThePage)
        return;
      this.query.page++;
      this.getFromuserlist();
    },
    async getFromuserlist() {
      let data = await api_index.api.fromuserlist(this.query);
      if (data.code == 200) {
        this.inviteRecords = [...this.inviteRecords, ...data.data.data];
        this.turnThePage = data.data.data.length < this.query.limit ? false : true;
      }
    },
    routePush(path) {
      common_vendor.index.navigateTo({
        url: path
      });
    },
    // copyCode() {
    // 	uni.setClipboardData({
    // 		data: this.inviteCode,
    // 		success: () => {
    // 			uni.showToast({
    // 				title: '邀请码复制成功',
    // 				icon: 'success',
    // 				duration: 1500
    // 			});
    // 		},
    // 		fail: () => {
    // 			uni.showToast({
    // 				title: '复制失败，请重试',
    // 				icon: 'none',
    // 				duration: 1500
    // 			});
    // 		}
    // 	});
    // },
    // 显示邀请海报弹窗
    async showInvitePoster() {
      this.$refs.posterPopup.open();
    },
    // 朋友圈分享
    onShareTimeline(options) {
      return {
        title: "好友邀请你加入平台，注册即得20元券，我还能得现金奖励",
        query: `/pages/register/register?scene=${this.inviteCode}`,
        // 好友注册页，携带邀请码
        success: () => {
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
        }
      };
    },
    // 微信好友（对接小程序分享API）
    onShareAppMessage(options) {
      const title = "我在这个平台发现了好东西，邀请你一起加入～";
      return {
        title,
        path: `/pages/register/register?scene=${this.inviteCode}`,
        // 好友注册页，携带邀请码
        imageUrl: "/static/favicon.ico",
        // 分享图标
        success: () => {
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
        }
      };
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  const _component_posterVue = common_vendor.resolveComponent("posterVue");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_collapse_item2 + _easycom_uni_collapse2 + _component_posterVue + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_collapse_item + _easycom_uni_collapse + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "gift",
      size: "24",
      color: "#FF7A45"
    }),
    b: common_vendor.o((...args) => $options.showInvitePoster && $options.showInvitePoster(...args)),
    c: $data.inviteRecords.length > 0
  }, $data.inviteRecords.length > 0 ? {
    d: common_vendor.f($data.inviteRecords, (item, index, i0) => {
      return {
        a: common_vendor.t(_ctx.hidePhone(item.phone)),
        b: common_vendor.t(_ctx.initTime(item.Created)),
        c: index
      };
    }),
    e: common_vendor.n("status-pending"),
    f: common_vendor.o((...args) => $options.changePage && $options.changePage(...args))
  } : {
    g: common_vendor.p({
      type: "empty",
      size: "48",
      color: "#ccc"
    })
  }, {
    h: common_vendor.p({
      type: "right",
      size: "18",
      color: "#999"
    }),
    i: common_vendor.o(($event) => $options.routePush("/pages/earningsRecord/earningsRecord")),
    j: common_vendor.p({
      title: "邀请规则说明",
      ["title-style"]: {
        fontSize: "24rpx",
        color: "#666"
      }
    }),
    k: common_vendor.o($options.loadInviteCode),
    l: common_vendor.sr("posterPopup", "d9b3f790-5")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d9b3f790"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/invitation/invitation.js.map
