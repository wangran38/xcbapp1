"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      banners: [{
        img: "https://img2.baidu.com/it/u=3794887849,1985339825&fm=253&fmt=auto&app=138&f=JPEG?w=537&h=500",
        title: "大山里的希望果园"
      }, {
        img: "https://img.tusij.com/qiantu_assets/user_download_ue/2021-05-17/qt_bb0f4a635fde3dfb99161a1f193df968_39881.jpg?auth_key=2342036953-0-0-5365a15afbb4e023df1aacbbdb5b36de&x-oss-process=image/resize,m_fixed,h_934,w_700/crop,x_0,y_0,w_700,h_476",
        title: "乡村振兴在行动"
      }],
      products: [{
        id: 1,
        cover: "https://img2.baidu.com/it/u=1634565536,1061025085&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
        title: "农家自采天然蜂蜜",
        region: "海南琼海",
        progress: 78,
        price: 39.9,
        originalPrice: 58,
        sold: 2560,
        farmer: {
          name: "王伟",
          avatar: "https://p2-pro.a.yximgs.com/uhead/AB/2025/04/01/16/BMjAyNTA0MDExNjQyNDZfMTQ1NDAxNDI5MV8yX2hkMTg5XzE1MA==_s.jpg"
        }
      }]
    };
  }
};
if (!Array) {
  const _component_u_tag = common_vendor.resolveComponent("u-tag");
  const _component_u_line_progress = common_vendor.resolveComponent("u-line-progress");
  (_component_u_tag + _component_u_line_progress)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.banners, (item, index, i0) => {
      return {
        a: item.img,
        b: common_vendor.t(item.title),
        c: index
      };
    }),
    b: common_vendor.f($data.products, (item, k0, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.title),
        c: "14ee270a-0-" + i0,
        d: common_vendor.p({
          text: item.region,
          size: "mini",
          type: "warning"
        }),
        e: item.farmer.avatar,
        f: common_vendor.t(item.farmer.name),
        g: "14ee270a-1-" + i0,
        h: common_vendor.p({
          percent: item.progress,
          ["show-text"]: false,
          height: "10",
          ["active-color"]: "#ff7900"
        }),
        i: common_vendor.t(item.progress),
        j: common_vendor.t(item.price),
        k: common_vendor.t(item.originalPrice),
        l: common_vendor.t(item.sold),
        m: item.id,
        n: common_vendor.o(($event) => _ctx.viewDetail(item.id), item.id)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-14ee270a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/shoppingPageList/agriculturalAssistanceZone/agriculturalAssistanceZone.js.map
