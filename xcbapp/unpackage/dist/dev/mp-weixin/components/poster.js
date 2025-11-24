"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
const _sfc_main = {
  data() {
    return {
      scene: null,
      canvasWidth: 300,
      // 默认画布宽度（px）
      canvasHeight: 220,
      // 默认画布高度（px）
      scale: 1
      // 缩放比例（基于屏幕宽度）
    };
  },
  props: {
    name: {
      type: String,
      default: "无人测试"
    }
  },
  onLoad() {
    const { windowWidth } = common_vendor.index.getSystemInfoSync();
    this.canvasWidth = Math.floor(windowWidth * 0.8);
    this.canvasHeight = Math.floor(this.canvasWidth * 0.73);
    this.scale = this.canvasWidth / 300;
  },
  async onReady() {
    try {
      const data = await api_index.api.getqrcode({});
      this.$emit("initLoad", data.data.userid);
      this.scene = data.data.fileURL;
      setTimeout(() => {
        this.drawPureCanvas();
      }, 100);
    } catch (err) {
      common_vendor.index.__f__("error", "at components/poster.vue:55", "获取二维码失败：", err);
      common_vendor.index.showToast({ title: "二维码加载失败", icon: "none" });
    }
  },
  methods: {
    // 适配尺寸：将设计稿尺寸（基于300px宽度）转换为实际尺寸
    adapt(size) {
      return Math.floor(size * this.scale);
    },
    // 保存图片逻辑
    doSaveImage() {
      common_vendor.index.canvasToTempFilePath({
        canvasId: "pureCanvas",
        width: this.canvasWidth,
        height: this.canvasHeight,
        destWidth: this.canvasWidth * 3,
        // 高清输出
        destHeight: this.canvasHeight * 3,
        quality: 1,
        success: (res) => {
          common_vendor.index.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => common_vendor.index.showToast({ title: "保存成功", icon: "success" }),
            fail: () => common_vendor.index.showToast({ title: "保存失败", icon: "none" })
          });
        },
        fail: () => common_vendor.index.showToast({ title: "生成图片失败", icon: "none" })
      }, this);
    },
    saveCanvasImage() {
      common_vendor.index.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            common_vendor.index.authorize({
              scope: "scope.writePhotosAlbum",
              success: () => this.doSaveImage(),
              fail: () => {
                common_vendor.index.showModal({
                  title: "提示",
                  content: "需要开启保存图片权限",
                  success: (modalRes) => modalRes.confirm && common_vendor.index.openSetting()
                });
              }
            });
          } else {
            this.doSaveImage();
          }
        }
      });
    },
    // 加载图片为本地路径
    loadImageUrl(url) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getImageInfo({
          src: url,
          success: (res) => resolve(res.path),
          fail: (err) => reject(`图片加载失败：${err.errMsg}`)
        });
      });
    },
    // 绘制圆角矩形
    drawRoundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
      ctx.closePath();
    },
    async drawPureCanvas() {
      try {
        const ctx = common_vendor.index.createCanvasContext("pureCanvas", this);
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, "#409EFF");
        gradient.addColorStop(1, "#B37EF1");
        ctx.setFillStyle(gradient);
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.setFillStyle("#FFFFFF");
        ctx.setFontSize(this.adapt(18));
        const titleY = this.adapt(30);
        ctx.fillText("农链天下", this.adapt(20), titleY);
        ctx.setFontSize(this.adapt(12));
        const descY = this.adapt(60);
        ctx.fillText("我在这个平台发现了好东西，邀请你一起加入～", this.adapt(20), descY);
        const cardX = this.adapt(20);
        const cardY = this.adapt(80);
        const cardWidth = this.canvasWidth - this.adapt(40);
        const cardHeight = this.adapt(90);
        const cornerRadius = this.adapt(8);
        ctx.setFillStyle("#FFFFFF");
        this.drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, cornerRadius);
        ctx.fill();
        ctx.setFillStyle("#333333");
        ctx.setFontSize(this.adapt(12));
        const cardTitleY = cardY + this.adapt(30);
        ctx.fillText('邀请你加入"农链天下"', cardX + this.adapt(20), cardTitleY);
        const cardDescY = cardY + this.adapt(55);
        ctx.fillText("微信长按识别二维码", cardX + this.adapt(20), cardDescY);
        if (!this.scene)
          throw new Error("二维码地址为空");
        const imgPath = await this.loadImageUrl(this.scene);
        const qrSize = this.adapt(70);
        const qrX = this.canvasWidth - this.adapt(20) - qrSize;
        const qrY = cardY + (cardHeight - qrSize) / 2;
        ctx.drawImage(imgPath, qrX, qrY, qrSize, qrSize);
        ctx.draw();
      } catch (err) {
        common_vendor.index.__f__("error", "at components/poster.vue:184", "绘制失败：", err);
        common_vendor.index.showToast({ title: "绘制失败", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.canvasWidth + "px",
    b: $data.canvasHeight + "px",
    c: common_vendor.o((...args) => $options.saveCanvasImage && $options.saveCanvasImage(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-df1b4024"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/poster.js.map
