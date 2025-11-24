"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    scan() {
      common_vendor.index.scanCode({
        onlyFromCamera: true,
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/rules/rules.vue:56", 1);
          common_vendor.index.__f__("log", "at pages/rules/rules.vue:57", "条码类型：" + res.scanType);
          common_vendor.index.__f__("log", "at pages/rules/rules.vue:58", "条码内容：" + res.result);
          const scannedUrl = res.result;
          if (scannedUrl.startsWith("http")) {
            common_vendor.index.__f__("log", "at pages/rules/rules.vue:63", "这是一个有效的 URL");
            const decodedUrl = decodeURIComponent(scannedUrl);
            common_vendor.index.__f__("log", "at pages/rules/rules.vue:66", "解码后的 URL:", decodedUrl);
            const hashIndex = decodedUrl.indexOf("#");
            if (hashIndex !== -1) {
              const pagesPath = decodedUrl.substring(hashIndex + 1);
              common_vendor.index.__f__("log", "at pages/rules/rules.vue:71", "提取到的页面路径:", pagesPath);
              common_vendor.index.navigateTo({
                url: pagesPath
                // 跳转到指定页面并带上参数
              });
            } else {
              common_vendor.index.__f__("warn", "at pages/rules/rules.vue:77", "未能解析到有效的页面路径");
            }
          } else {
            common_vendor.index.__f__("warn", "at pages/rules/rules.vue:81", "扫码结果不是有效的链接:", scannedUrl);
          }
        },
        fail: function(error) {
          common_vendor.index.__f__("error", "at pages/rules/rules.vue:85", "扫码失败:", error);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.scan && $options.scan(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/rules/rules.js.map
