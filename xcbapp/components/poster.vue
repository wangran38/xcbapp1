<template>
	<view class="container">
		<!-- 画布宽高用动态px，确保在所有设备上可见 -->
		<canvas 
			canvas-id="pureCanvas" 
			:style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}"
			class="canvas"
		></canvas>
		<button @click="saveCanvasImage" class="save-btn">
			保存图片到相册
		</button>
	</view>
</template>

<script>
import { api } from '@/api/index.js'
export default {
	data() {
		return {
			scene: null,
			canvasWidth: 300,  // 默认画布宽度（px）
			canvasHeight: 220, // 默认画布高度（px）
			scale: 1,          // 缩放比例（基于屏幕宽度）
		};
	},
	props: {
		name: {
			type: String,
			default: '无人测试'
		}
	},
	onLoad() {
		// 1. 获取屏幕信息计算缩放比例
		const { windowWidth } = uni.getSystemInfoSync()
		// 以屏幕宽度的80%作为画布宽度（确保在各种屏幕上都能显示完整）
		this.canvasWidth = Math.floor(windowWidth * 0.8)
		// 保持宽高比 5:4（根据内容调整，确保不拉伸）
		this.canvasHeight = Math.floor(this.canvasWidth * 0.73)
		// 计算缩放比例（以300px为基准设计稿）
		this.scale = this.canvasWidth / 300
	},
	async onReady() {
		// 2. 确保二维码加载成功后再绘制
		try {
			const data = await api.getqrcode({})
			// console.log(data.data)
			// 将用户id传回父组件
			this.$emit('initLoad',data.data.userid)
			this.scene = data.data.fileURL
			// 延迟绘制，确保DOM渲染完成
			setTimeout(() => {
				this.drawPureCanvas()
			}, 100)
		} catch (err) {
			console.error('获取二维码失败：', err)
			uni.showToast({ title: '二维码加载失败', icon: 'none' })
		}
	},
	methods: {
		// 适配尺寸：将设计稿尺寸（基于300px宽度）转换为实际尺寸
		adapt(size) {
			return Math.floor(size * this.scale)
		},

		// 保存图片逻辑
		doSaveImage() {
			uni.canvasToTempFilePath({
				canvasId: 'pureCanvas',
				width: this.canvasWidth,
				height: this.canvasHeight,
				destWidth: this.canvasWidth * 3, // 高清输出
				destHeight: this.canvasHeight * 3,
				quality:1,
				success: (res) => {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: () => uni.showToast({ title: '保存成功', icon: 'success' }),
						fail: () => uni.showToast({ title: '保存失败', icon: 'none' })
					})
				},
				fail: () => uni.showToast({ title: '生成图片失败', icon: 'none' })
			}, this)
		},

		saveCanvasImage() {
			// #ifdef MP-WEIXIN
			uni.getSetting({
				success: (res) => {
					if (!res.authSetting['scope.writePhotosAlbum']) {
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							success: () => this.doSaveImage(),
							fail: () => {
								uni.showModal({
									title: '提示',
									content: '需要开启保存图片权限',
									success: (modalRes) => modalRes.confirm && uni.openSetting()
								})
							}
						})
					} else {
						this.doSaveImage()
					}
				}
			})
			// #endif
		},

		// 加载图片为本地路径
		loadImageUrl(url) {
			return new Promise((resolve, reject) => {
				uni.getImageInfo({
					src: url,
					success: (res) => resolve(res.path),
					fail: (err) => reject(`图片加载失败：${err.errMsg}`)
				})
			})
		},

		// 绘制圆角矩形
		drawRoundRect(ctx, x, y, w, h, r) {
			ctx.beginPath()
			ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
			ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
			ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
			ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
			ctx.closePath()
		},

		async drawPureCanvas() {
			try {
				const ctx = uni.createCanvasContext('pureCanvas', this)
				
				// 1. 绘制背景（占满整个画布，确保可见）
				const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight)
				gradient.addColorStop(0, '#409EFF')
				gradient.addColorStop(1, '#B37EF1')
				ctx.setFillStyle(gradient)
				ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

				// 2. 绘制标题（确保在画布顶部可见）
				ctx.setFillStyle('#FFFFFF')
				ctx.setFontSize(this.adapt(18)) // 设计稿18px，按比例缩放
				const titleY = this.adapt(30) // 距离顶部30px（设计稿）
				ctx.fillText('农链天下', this.adapt(20), titleY)

				// 3. 绘制邀请语（标题下方）
				ctx.setFontSize(this.adapt(12))
				const descY = this.adapt(60) // 距离顶部60px
				ctx.fillText('我在这个平台发现了好东西，邀请你一起加入～', this.adapt(20), descY)

				// 4. 绘制白色卡片（确保在画布中间区域）
				const cardX = this.adapt(20) // 左边距20px
				const cardY = this.adapt(80) // 距离顶部80px
				const cardWidth = this.canvasWidth - this.adapt(40) // 左右边距各20px
				const cardHeight = this.adapt(90) // 高度90px
				const cornerRadius = this.adapt(8) // 圆角8px

				ctx.setFillStyle('#FFFFFF')
				this.drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, cornerRadius)
				ctx.fill()

				// 5. 绘制卡片内文字（卡片上方区域）
				ctx.setFillStyle('#333333')
				ctx.setFontSize(this.adapt(12))
				const cardTitleY = cardY + this.adapt(30) // 卡片内上边距30px
				ctx.fillText('邀请你加入"农链天下"', cardX + this.adapt(20), cardTitleY)

				const cardDescY = cardY + this.adapt(55) // 第二行文字
				ctx.fillText('微信长按识别二维码', cardX + this.adapt(20), cardDescY)

				// 6. 绘制二维码（卡片右侧，确保不超出画布）
				if (!this.scene) throw new Error('二维码地址为空')
				const imgPath = await this.loadImageUrl(this.scene)
				const qrSize = this.adapt(70) // 二维码尺寸70px
				// 二维码位置：右边距20px，与卡片垂直居中
				const qrX = this.canvasWidth - this.adapt(20) - qrSize
				const qrY = cardY + (cardHeight - qrSize) / 2

				ctx.drawImage(imgPath, qrX, qrY, qrSize, qrSize)

				// 7. 执行绘制（关键：必须调用draw()才会显示）
				ctx.draw()

			} catch (err) {
				console.error('绘制失败：', err)
				uni.showToast({ title: '绘制失败', icon: 'none' })
			}
		}
	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
}
.canvas {
	background-color: #f5f5f5; /* 临时背景色，方便确认画布是否显示 */
}
.save-btn {
	margin-top: 20rpx;
	padding: 10px 20px;
	background: #409EFF;
	color: white;
	border-radius: 4px;
}
</style>