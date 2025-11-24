<template>
	<canvas canvas-id="pureCanvas" style="width: 700rpx; height: 600rpx;"></canvas>
</template>

<script>
	export default {
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
					uni.getImageInfo({
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
				// 左上角圆角
				ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
				// 右上角圆角
				ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
				// 右下角圆角
				ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
				// 左下角圆角
				ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
				ctx.closePath(); // 闭合路径
			},

			async drawPureCanvas() {
				try {
					const ctx = uni.createCanvasContext('pureCanvas', this);
					const canvasWidth = 400;
					const canvasHeight = 200;

					// 1. 绘制渐变背景
					const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
					gradient.addColorStop(0, '#409EFF');
					gradient.addColorStop(1, '#B37EF1');
					ctx.setFillStyle(gradient);
					ctx.fillRect(0, 0, canvasWidth, canvasHeight);

					// 2. 绘制用户名
					ctx.setFillStyle('#FFFFFF');
					ctx.setFontSize(18);
					ctx.fillText('王启军', 20, 40);

					// 3. 绘制邀请语
					ctx.setFontSize(12);
					ctx.fillText('我在这个平台发现了好东西，邀请你一起加入～', 20, 70);

					// 4. 绘制带圆角的白色卡片（圆角半径8px，放大图片后保持卡片尺寸不变）
					const cardX = 20;
					const cardY = 90;
					const cardWidth = canvasWidth - 90;
					const cardHeight = 90;
					const cornerRadius = 8; // 圆角大小

					ctx.setFillStyle('#FFFFFF');
					this.drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, cornerRadius);
					ctx.fill(); // 填充圆角矩形

					// 5. 绘制卡片标题
					ctx.setFillStyle('#333333');
					ctx.setFontSize(12);
					ctx.fillText('邀请你加入"农链天下"', 40, 130);

					// 6. 绘制放大后的图片（从60x60调整为70x70，保持居中）
					const imageUrl =
						'https://image.xcbdsc.com/group1/default/20241103/15/40/8/d772fe7b3a949cf0f63a97cd0c7cd258.jpg';
					const imgPath = await this.loadImageUrl(imageUrl);

					// 图片尺寸放大到70x70（原60x60）
					const imgSize = 80;
					// 计算位置：右距20px，垂直居中
					const imgX = canvasWidth - 80 - imgSize;
					const imgY = cardY + (cardHeight - imgSize) / 2;

					ctx.drawImage(imgPath, imgX, imgY, imgSize, imgSize);

					// 7. 渲染所有内容
					ctx.draw();

				} catch (err) {
					console.error('Canvas绘制错误：', err);
				}
			}
		}
	};
</script>

<style scoped>
</style>