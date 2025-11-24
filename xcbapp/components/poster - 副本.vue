<template>
	<view>
		<canvas canvas-id="pureCanvas" style="width: 700rpx; height: 600rpx;"></canvas>
		<button @click="saveCanvasImage"
			style="position: relative;top: -200rpx; padding: 10px; background: #409EFF; color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
			保存图片到相册
		</button>
	</view>
</template>

<script>
	import {api} from '@/api/index.js'
	export default {
		data() {
			return {
				scaleRatio:1,
				scene:null
			};
		},
		props:{
			name:{
				type:String,
				default:'无人测试'
			}
		},
		async onReady() {
			let data = await api.getqrcode({})
			this.scene = data.data
			this.drawPureCanvas();
		},
		methods: {
			/**
			 * 执行保存图片的核心逻辑
			 */
			doSaveImage() {
				const canvasWidth = 400;
				const canvasHeight = 200;

				// 1. 将Canvas内容转为临时图片路径
				uni.canvasToTempFilePath({
					canvasId: 'pureCanvas', // 对应canvas的canvas-id属性
					width: canvasWidth, // 画布实际宽度
					height: canvasHeight, // 画布实际高度
					destWidth: canvasWidth * 3, // 输出图片宽度（*2避免模糊）
					destHeight: canvasHeight * 3, // 输出图片高度（*2避免模糊）
					success: (res) => {
						console.log(res.tempFilePath)
						// 2. 将临时路径保存到相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({
									title: '保存成功',
									icon: 'success',
									duration: 2000
								});
							},
							fail: (err) => {
								console.error('保存到相册失败：', err);
								uni.showToast({
									title: '保存失败',
									icon: 'none',
									duration: 2000
								});
							}
						});
					},
					fail: (err) => {
						console.error('Canvas转临时文件失败：', err);
						uni.showToast({
							title: '生成图片失败',
							icon: 'none',
							duration: 2000
						});
					}
				}, this); // 第二个参数指定组件上下文
			},
			/**
			 * 保存Canvas内容到相册
			 * 步骤：1. Canvas转临时文件 2. 保存临时文件到相册
			 */
			saveCanvasImage() {
				// 1. 先检查是否有保存图片的权限
				uni.getSetting({
					success: (res) => {
						// 没有权限则申请
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => {
									this.doSaveImage(); // 授权成功后执行保存
								},
								fail: () => {
									// 用户拒绝授权，提示打开设置
									uni.showModal({
										title: '提示',
										content: '需要开启保存图片权限才能保存到相册',
										success: (modalRes) => {
											if (modalRes.confirm) {
												uni.openSetting(); // 打开权限设置页
											}
										}
									});
								}
							});
						} else {
							// 已有权限，直接保存
							this.doSaveImage();
						}
					}
				});
			},
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
			
			getAdaptiveValue(originValue) {return Math.round(originValue * this.scaleRatio)},

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
					ctx.setFontSize(this.getAdaptiveValue(18));
					ctx.fillText('农链天下', this.getAdaptiveValue(20), this.getAdaptiveValue(40));

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

					ctx.setFillStyle('#333333');
					ctx.setFontSize(12);
					ctx.fillText('微信长按识别二维码', 40, 150);
					// 6. 绘制放大后的图片（从60x60调整为70x70，保持居中）
					// const imageUrl =
					// 	'https://image.xcbdsc.com/group1/default/20250922/15/52/8/dc77b91695893c2e1581d68d2bc57934.jpg';
					console.log(this.scene,"载入二维码")
					const imgPath = await this.loadImageUrl(this.scene);

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