<template>
	<view class="container">
		<!-- 浅色背景 -->
		<view class="background-wave"></view>
		<!-- 商品选择 -->
		<view class="product-selector">
			<uni-forms-item label="选择菜品" label-width="80" label-align="right">
				<uni-data-select v-model="selectedProduct" :localdata="products" placeholder="请选择菜品"
					class="nature-select" />
			</uni-forms-item>
		</view>
		<scroll-view scroll-y="true" class="timeline-container" v-show="timelineData.length">
			<view v-for="(item, index) in timelineData" :key="index" class="timeline-item">
				<view class="timeline-marker">
					<view class="marker-icon">
						<uni-icons type="calendar" size="28" color="#fff" />
					</view>
					<view class="timeline-connector"></view>
				</view>
				<view class="nature-card" @click="handleDayClick(item)">
					<view class="card-header">
						<text class="date-label">{{ initTime(item.created) }}</text>
					</view>
					<view class="card-content">
						<text class="content-text">点击查看生长情况</text>
					</view>
					<view class="status-tag" :class="{ completed: true }">
						已完成
					</view>
				</view>
			</view>
		</scroll-view>

		<uni-popup ref="editPanel" type="bottom" @maskClick="viewPanelClosePopup" is-mask-click>
			<view class="edit-panel">
				<view class="panel-header">
					<text class="panel-title">{{ currentDate }} 生长记录</text>
				</view>
				<view class="panel-body">
					<button class="action-button" @click="selectMedia">
						<uni-icons type="camera" size="20" color="#fff" />
						<text>上传图片/视频</text>
					</button>
					<view class="delete-icon" @click="editPanelClosePopup">×</view>

					<scroll-view class="preview-container" scroll-x="true">
						<view v-for="(item, index) in fileList" :key="index" class="preview-item">
							<!-- 编辑页：图片直接展示 -->
							<view v-if="item.fileType === 'image'" class="media-wrap" @click="previewMedia(item)">
								<image :src="item.tempFilePath" mode="aspectFill" class="media-content" />
							</view>
							<!-- 编辑页：视频-临时缩略图+播放图标（前端临时展示，不提交） -->
							<view v-else class="media-wrap video-wrap" @click="previewMedia(item)">
								<image :src="item.thumbTempFilePath || '/static/images/video-default.png'"
									mode="aspectFill" class="media-content" />
								<uni-icons type="videocam-filled" size="40" color="#fff" class="video-play-icon" />
								<video :src="item.tempFilePath" class="video-hide"></video>
							</view>
							<view class="delete-icon" @click.stop="handleDelete(index)">×</view>
						</view>
					</scroll-view>

					<textarea v-model="tempText" placeholder="请输入详细记录..." class="record-textarea" />
					<button class="confirm-button" @click="saveContent">保存记录</button>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="viewPanel" type="bottom" @maskClick="editPanelClosePopup" is-mask-click>
			<view class="edit-panel">
				<view class="panel-header">
					<text class="panel-title">{{ currentDate }} 生长记录</text>
				</view>
				<view class="panel-body">
					<view class="delete-icon" @click="viewPanelClosePopup">×</view>

					<scroll-view class="preview-container" scroll-x="true">
						<!-- 查看页：媒体项 - 按后端返回顺序渲染，自动关联对应路径 -->
						<view v-for="(item, index) in viewImgAndVideo" :key="index" class="preview-item">
							<!-- 查看页：图片直接展示，点击预览 -->
							<view v-if="item.fileType === 'image'" class="media-wrap" @click="previewMedia(item)">
								<image :src="item.path" mode="aspectFill" class="media-content" />
							</view>
							<view v-else class="media-wrap video-wrap" @click="previewMedia(item)">
								<image :src="item.thumb || '/static/images/video-default.png'" mode="aspectFill"
									class="media-content" />
								<uni-icons type="videocam-filled" size="40" color="#fff" class="video-play-icon" />
								<video :src="item.path" class="video-hide"></video>
							</view>
						</view>
					</scroll-view>

					<textarea v-model="tempText" placeholder="" class="record-textarea" disabled />
					<button class="confirm-button" style="background-color: red;" @click="removeItem">删除记录</button>
				</view>
			</view>
		</uni-popup>

		<view v-if="!timelineData.length" class="empty-state">
			<text class="empty-text">请先选择种植商品</text>
		</view>

		<view class="float-btn" @click="addRecord">
			<uni-icons type="plusempty" size="30" color="#fff" />
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import {
		api,
		UPLOAD_URL
	} from '../../api/index.js';
	import {
		myMixin
	} from '@/utils/public.js'

	export default {
		data() {
			return {
				selectedProduct: null,
				products: [],
				timelineData: [],
				activeIndex: -1,
				tempText: '',
				currentDate: '',
				formData: {
					page: 1,
					limit: 30
				},
				fileList: [], // 编辑页：存储媒体完整对象（含tempFilePath/fileType/thumbTempFilePath）
				viewImgAndVideo: [], // 查看页：按后端顺序存储{fileType, path}，确保一一关联
				openId: null,
			}
		},
		mixins: [myMixin],
		watch: {
			selectedProduct(newValue) {
				newValue && this.lifeCycleData()
			}
		},
		async onLoad() {
			this.currentDate = dayjs().format('YYYY-MM-DD');
			try {
				const data = await api.goodslist(this.formData)
				if (data.code === 200) {
					this.products = data.data.listdata.map(item => ({
						value: item.id,
						text: item.goodsname
					}))
					this.products.length && (this.selectedProduct = this.products[0].value) && this.lifeCycleData()
				}
			} catch (err) {
				console.error('获取菜品列表失败', err)
				uni.showToast({
					title: '获取菜品失败',
					icon: 'none'
				})
			}
		},
		methods: {
			// 统一预览：图片/视频 自动关联对应路径（核心：item携带当前媒体的完整信息）
			previewMedia(item) {
				if (!item) return;
				const {
					fileType,
					tempFilePath,
					path
				} = item;
				const realUrl = tempFilePath || path; // 编辑页取tempFilePath，查看页取path，自动适配

				if (fileType === 'image') {
					uni.previewImage({
						showmenu: false,
						urls: [realUrl]
					});
				} else if (fileType === 'video') {
					// 直接跳转预览页，播放当前item对应的视频路径，确保关联
					uni.navigateTo({
						url: `/pages/videoPreview/videoPreview?videoUrl=${encodeURIComponent(realUrl)}`
					});
				}
			},
			// 删除记录
			async removeItem() {
				if (!this.openId) return;
				try {
					const res = await api.delMoments({
						id: this.openId
					})
					if (res.code === 200) {
						uni.showToast({
							icon: 'success',
							title: res.message || res.msg
						})
						this.initPorp()
						this.lifeCycleData()
					} else {
						uni.showToast({
							title: res.message || '删除失败',
							icon: 'none'
						})
					}
				} catch (err) {
					console.error('删除记录失败', err)
					uni.showToast({
						title: '删除记录失败',
						icon: 'none'
					})
				}
			},
			// 关闭弹窗初始化
			initPorp() {
				uni.hideLoading();
				this.$refs.editPanel?.close()
				this.$refs.viewPanel?.close()
				this.tempText = ''
				this.fileList = []
			},
			editPanelClosePopup() {
				this.initPorp()
			},
			viewPanelClosePopup() {
				this.initPorp()
			},
			// 获取生长记录数据
			async lifeCycleData() {
				if (!this.selectedProduct) return;
				try {
					const data = await api.goodsinfoList({
						page: 1,
						limit: 100,
						farmersgoods_id: this.selectedProduct
					})
					this.timelineData = data.data?.listdata || []
				} catch (err) {
					console.error('获取生长记录失败', err)
					uni.showToast({
						title: '获取记录失败',
						icon: 'none'
					})
				}
			},
			// 删除编辑页的媒体项（保持数组顺序）
			handleDelete(index) {
				(index >= 0 && index < this.fileList.length) && this.fileList.splice(index, 1)
			},
			// 打开新增记录弹窗
			addRecord() {
				this.$refs.editPanel.open()
			},
			// 日期格式化
			initTime(dateStr) {
				return dateStr ? dayjs(dateStr).format('YYYY-MM-DD HH:mm') : '未知日期'
			},

			handleDayClick(item) {
				if (!item) return;
				this.$refs.viewPanel.open()
				this.tempText = item.content || ''
				this.openId = item.id
				this.currentDate = item.created ? this.initTime(item.created).split(' ')[0] : this.currentDate

				// 初始化查看页媒体数组（仅解析格式和路径，无异步提取，兼容所有端）
				this.viewImgAndVideo = [];
				if (item.imgs && item.imgs.trim()) {
					const mediaUrlArr = item.imgs.split(',').filter(url => url.trim());
					// 直接解析，无需异步操作，保证顺序和关联
					this.viewImgAndVideo = mediaUrlArr.map(url => {
						const lowerUrl = url.toLowerCase();
						const isVideo = lowerUrl.endsWith('mp4');
						const isImage = lowerUrl.endsWith('jpg') || lowerUrl.endsWith('png');
						return {
							fileType: isVideo ? 'video' : 'image',
							path: url, // 强关联对应媒体路径，确保播放准确
							// 移除缩略图字段，无需异步赋值
						}
					});
				}
			},
			// 统一上传媒体
			saveMedia(path) {
				return new Promise((res, rej) => {
					if (!path) return rej('文件路径为空');
					uni.uploadFile({
						url: 'https://image.xcbdsc.com/group1/upload',
						name: 'file',
						filePath: path,
						formData: {
							output: 'json2'
						},
						success: (response) => {
							// 步骤 1：先打印后端真实返回数据，方便你排查（后续可删除）
							console.log("上传接口后端真实返回：", response.data);
							console.log("上传接口状态码：", response.statusCode);

							// 步骤 2：先判断 HTTP 状态码，200 开头说明接口请求成功
							if (response.statusCode >= 200 && response.statusCode < 300) {
								try {
									// 尝试解析 JSON（兼容后端返回合法 JSON 的情况）
									const result = JSON.parse(response.data);
									res(result);
								} catch (err) {
									// 解析失败：兼容非 JSON 返回（纯文本/空数据等）
									console.warn("JSON 解析失败，后端返回非 JSON 格式：", err);
									// 处理非 JSON 场景：提取有效信息，避免保存流程中断
									const nonJsonResult = {
										data: {
											url: response.data, // 直接把返回内容作为 url（若后端直接返回图片/视频路径）
											msg: "上传成功（非 JSON 格式返回）"
										},
										code: 200
									};
									// 即使解析失败，也正常返回结果，让保存流程继续
									res(nonJsonResult);
								}
							} else {
								// HTTP 状态码异常（404/500 等），直接抛出错误
								rej(`上传接口请求失败，状态码：${response.statusCode}`);
							}
						},
						fail: (err) => {
							// 上传请求本身失败（网络异常、文件不存在等）
							console.error("文件上传请求失败：", err);
							rej(`文件上传失败：${err.errMsg || '未知错误'}`);
						}
					})
				})
			},
			// 选择图片/视频（编辑页，保留临时缩略图）
			selectMedia() {
				uni.chooseMedia({
					count: 9,
					sourceType: ['album', 'camera'],
					mediaType: ['image', 'video'],
					sizeType: ['original', 'compressed'],
					maxDuration: 60,
					success: (res) => {
						this.fileList = [...this.fileList, ...res.tempFiles];
						// 统计数量提示
						const imgCount = res.tempFiles.filter(i => i.fileType === 'image').length;
						const videoCount = res.tempFiles.filter(i => i.fileType === 'video').length;
						let tip = '';
						if (imgCount && videoCount) tip = `选中${imgCount}张图片+${videoCount}个视频`;
						else if (imgCount) tip = `选中${imgCount}张图片`;
						else tip = `选中${videoCount}个视频`;
						uni.showToast({
							title: tip,
							icon: 'none'
						});
					},
					fail: (err) => {
						console.error("选择媒体失败", err);
						uni.showToast({
							title: '选择媒体失败',
							icon: 'none'
						})
					}
				});
			},
			// 保存记录：仅上传真实媒体路径，按顺序提交，保证后端存储顺序和前端一致
			async saveContent() {
				if (!this.selectedProduct) {
					uni.showToast({
						title: '请选择菜品',
						icon: 'error'
					});
					return
				}
				if (this.fileList.length === 0 && !this.tempText.trim()) {
					uni.showToast({
						title: '请上传图片/视频或输入记录内容',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: '正在上传中.....'
				});
				try {
					const uploadPromises = this.fileList.map(item => this.saveMedia(item.tempFilePath));
					const uploadRes = await Promise.all(uploadPromises);
					// 按上传顺序过滤有效路径，保证和前端展示顺序一致
					const mediaUrls = uploadRes.filter(item => item && item.data?.url).map(item => item.data.url);

					const res = await api.addinfos({
						farmersgoods_id: this.selectedProduct,
						imgs: mediaUrls.join(','), // 顺序和前端展示一致，查看页按此解析
						type: 1,
						content: this.tempText.trim()
					})

					if (res.code === 200) {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						})
						this.initPorp()
						this.lifeCycleData()
					} else {
						uni.showToast({
							title: res.message || '保存失败',
							icon: 'none'
						})
					}
				} catch (err) {
					console.error('保存记录失败', err)
					uni.showToast({
						title: '保存记录失败',
						icon: 'none'
					})
				} finally {
					uni.hideLoading();
				}
			}
		}
	}
</script>

<style scoped>
	/* 横向滚动容器：基础样式 */
	.preview-container {
		white-space: nowrap;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 10rpx;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		/* 开启弹性滚动，提升体验 */
	}

	/* 媒体项：统一尺寸、圆角，inline-block保证横向排列 */
	.preview-item {
		display: inline-block;
		width: 200rpx;
		height: 200rpx;
		margin-right: 15rpx;
		position: relative;
		border-radius: 12rpx;
		overflow: hidden;
	}

	/* 媒体包裹层：占满容器 */
	.media-wrap {
		width: 100%;
		height: 100%;
	}

	/* 图片/视频封面：铺满，不变形 */
	.media-content {
		width: 100%;
		height: 100%;
		display: block;
	}

	/* 视频包裹层：相对定位，用于放置播放图标 */
	.video-wrap {
		position: relative;
	}

	/* 视频播放图标：居中、半透明背景，提升辨识度 */
	.video-play-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		padding: 15rpx;
	}

	/* 隐藏备用video标签，仅保留路径 */
	.video-hide {
		display: none;
	}

	/* 删除按钮：悬浮在右上角，高层级不被覆盖 */
	.delete-icon {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background: #ff3333;
		color: #ffffff;
		text-align: center;
		line-height: 40rpx;
		border-radius: 50%;
		font-size: 28rpx;
		z-index: 99;
	}

	/* 按钮、输入框、悬浮按钮样式：统一美观 */
	.action-button {
		background: #007aff;
		color: #fff;
		border: none;
		padding: 15rpx 30rpx;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
	}

	.record-textarea {
		width: 100%;
		height: 200rpx;
		border: 1rpx solid #e5e5e5;
		border-radius: 8rpx;
		padding: 15rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		font-size: 28rpx;
	}

	.confirm-button {
		background: #007aff;
		color: #fff;
		border: none;
		padding: 20rpx 0;
		border-radius: 8rpx;
		width: 100%;
		font-size: 30rpx;
	}

	.float-btn {
		position: fixed;
		bottom: 50rpx;
		right: 30rpx;
		width: 80rpx;
		height: 80rpx;
		background: #007aff;
		border-radius: 50%;
		text-align: center;
		line-height: 80rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 122, 255, 0.3);
	}

	/* 时间线、空状态样式：保留原有即可，可根据项目调整 */
	.timeline-container {
		padding: 20rpx;
	}

	.timeline-item {
		display: flex;
		margin-bottom: 30rpx;
	}

	.timeline-marker {
		margin-right: 20rpx;
	}

	.marker-icon {
		width: 50rpx;
		height: 50rpx;
		background: #007aff;
		border-radius: 50%;
		text-align: center;
		line-height: 50rpx;
	}

	.timeline-connector {
		width: 2rpx;
		height: calc(100% + 30rpx);
		background: #e5e5e5;
		margin-left: 24rpx;
	}

	.nature-card {
		flex: 1;
		background: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.date-label {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
	}

	.content-text {
		font-size: 28rpx;
		color: #666;
		margin: 10rpx 0;
		display: block;
	}

	.status-tag {
		font-size: 24rpx;
		color: #00c853;
	}

	.empty-state {
		text-align: center;
		padding: 100rpx 0;
		color: #999;
		font-size: 28rpx;
	}
</style>

<style scoped>
	.media-content {
		width: 100%;
		height: 100%;
	}

	.float-btn {
		position: fixed;
		bottom: 100rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(45deg, #FF8E8E, #FF6B6B);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 12rpx 24rpx rgba(255, 107, 107, 0.3);
		transition: transform 0.3s;

	}

	.preview-container {
		white-space: nowrap;
		/* height: 200rpx; */
		display: flex;
		padding: 20rpx;
	}

	.preview-item {
		display: inline-block;
		position: relative;
		width: 320rpx;
		height: 320rpx;
		margin: 10rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background: #f5f5f5;
	}

	.preview-image,
	.preview-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.delete-icon {
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		width: 40rpx;
		height: 40rpx;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15rpx;
		font-size: 50rpx;
		z-index: 2;
		color: white;
	}

	.video-wrapper {
		position: relative;
	}


	/* 适配小程序特殊样式 */
	video::-webkit-media-controls-enclosure {
		display: none !important;
	}

	.preview-video {
		-webkit-object-fit: cover;
		object-fit: cover;
	}

	/* 处理小程序边框显示问题 */
	.preview-item::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 200%;
		height: 200%;
		border: 2rpx solid #eee;
		transform-origin: 0 0;
		transform: scale(0.5);
		box-sizing: border-box;
		pointer-events: none;
	}
</style>

<style lang="scss" scoped>
	/* 主色调 */
	$primary-color: #55ff7f; // 海绿色
	$secondary-color: #00aaff; // 中绿松石色
	$background-color: #F5FFFA; // 薄荷乳白色

	.container {
		background: $background-color;
		min-height: 100vh;
	}

	.background-wave {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 200rpx;
		background: linear-gradient(160deg, #55FFED 20%, $secondary-color 80%);
		border-radius: 0 0 30% 30%;
		z-index: 0;
	}

	.product-selector {
		padding: 30rpx;
		position: relative;
		z-index: 1;

		:deep(.uni-forms-item__label) {
			font-size: 32rpx;
			color: #333;
		}
	}

	.nature-select {
		:deep(.uni-select__input) {
			font-size: 28rpx;
			color: #333;
			background: #fff;
			border: 2rpx solid $primary-color !important;
			border-radius: 10rpx;
			padding: 20rpx;
		}
	}

	.timeline-container {
		height: 80vh;
		padding: 0 30rpx;
	}

	.timeline-item {
		display: flex;
		margin-bottom: 40rpx;

		.timeline-marker {
			width: 80rpx;
			position: relative;

			.marker-icon {
				width: 60rpx;
				height: 60rpx;
				background: $primary-color;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4rpx 12rpx rgba(46, 139, 87, 0.3);
			}

			.timeline-connector {
				position: absolute;
				left: 50%;
				top: 60rpx;
				bottom: -40rpx;
				width: 4rpx;
				background: #B0E0E6;
				transform: translateX(-50%);
			}
		}
	}

	.nature-card {
		max-width: 550rpx;
		position: relative;
		flex: 1;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-left: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.day-title {
				font-size: 32rpx;
				color: $primary-color;
				font-weight: 500;
			}

			.date-label {
				font-size: 26rpx;
				color: #666;
			}
		}

		.content-image {
			width: 100%;
			height: 300rpx;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			border: 2rpx solid $secondary-color;
		}

		.content-text {
			font-size: 28rpx;
			color: #666;
			line-height: 1.6;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;

			&:empty::before {
				content: '点击记录生长情况';
				color: #999;
			}
		}

		.status-tag {
			position: absolute;
			right: 30rpx;
			top: 90rpx;
			background: rgba(72, 209, 204, 0.1);
			color: red;
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
			font-size: 24rpx;

			&.completed {
				background: rgba(46, 139, 87, 0.1);
				color: $primary-color;
			}
		}
	}

	.edit-panel {
		background: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 40rpx;

		.panel-title {
			font-size: 36rpx;
			color: $primary-color;
			font-weight: 500;
			margin-bottom: 30rpx;
			display: block;
			text-align: center;
		}

		.action-button {
			margin-bottom: 20rpx;
			background: $secondary-color;
			color: #fff;
			border-radius: 50rpx;
			padding: 10rpx;
			font-size: 28rpx;
			display: inline-flex;
			align-items: center;

			uni-icons {
				margin-right: 15rpx;
			}
		}

		.image-preview {
			width: 100%;
			height: 400rpx;
			border-radius: 20rpx;
			margin: 30rpx 0;
			border: 2rpx solid $primary-color;
		}

		.record-textarea {
			width: 100%;
			min-height: 200rpx;
			background: #f8f8f8;
			border-radius: 20rpx;
			padding: 20rpx;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 30rpx;
		}

		.confirm-button {
			background: $primary-color;
			color: #fff;
			border-radius: 50rpx;
			padding: 10rpx;
			font-size: 32rpx;
		}
	}

	.empty-state {
		text-align: center;
		padding-top: 200rpx;

		.empty-icon {
			width: 200rpx;
			height: 200rpx;
			opacity: 0.3;
		}

		.empty-text {
			display: block;
			color: #999;
			font-size: 28rpx;
			margin-top: 30rpx;
		}
	}
</style>