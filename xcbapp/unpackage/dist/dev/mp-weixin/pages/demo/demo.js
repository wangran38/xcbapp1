"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  mixins: [],
  components: {},
  data() {
    return {};
  },
  onReady() {
    this.drawPureCanvas();
  },
  methods: {
    // 加载图片返回本地路径
    loadImageUrl(url) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getImageInfo({
          src: url,
          success: (res) => resolve(res.path),
          fail: (err) => reject(new Error(`图片加载失败：${err.errMsg}`))
        });
      });
    },
    /**
     * 绘制带圆角的矩形
     * @param {Object} ctx - Canvas上下文
     * @param {number} x - 左上角x坐标
     * @param {number} y - 左上角y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @param {number} radius - 圆角半径
     */
    drawRoundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
      ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
      ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
      ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
      ctx.closePath();
    },
    async drawPureCanvas() {
      try {
        const ctx = common_vendor.index.createCanvasContext("pureCanvas", this);
        const canvasWidth = 400;
        const canvasHeight = 200;
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, "#409EFF");
        gradient.addColorStop(1, "#B37EF1");
        ctx.setFillStyle(gradient);
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.setFillStyle("#FFFFFF");
        ctx.setFontSize(18);
        ctx.fillText("王启军", 20, 40);
        ctx.setFontSize(12);
        ctx.fillText("我在这个平台发现了好东西，邀请你一起加入～", 20, 70);
        const cardX = 20;
        const cardY = 90;
        const cardWidth = canvasWidth - 90;
        const cardHeight = 90;
        const cornerRadius = 8;
        ctx.setFillStyle("#FFFFFF");
        this.drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, cornerRadius);
        ctx.fill();
        ctx.setFillStyle("#333333");
        ctx.setFontSize(12);
        ctx.fillText('邀请你加入"农链天下"', 40, 130);
        const imageUrl = "https://image.xcbdsc.com/group1/default/20241103/15/40/8/d772fe7b3a949cf0f63a97cd0c7cd258.jpg";
        const imgPath = await this.loadImageUrl(imageUrl);
        const imgSize = 80;
        const imgX = canvasWidth - 80 - imgSize;
        const imgY = cardY + (cardHeight - imgSize) / 2;
        ctx.drawImage(imgPath, imgX, imgY, imgSize, imgSize);
        ctx.draw();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/demo/demo.vue:104", "Canvas绘制错误：", err);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/demo/demo.js.map
