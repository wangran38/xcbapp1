<template>
	<view class="traceability-tab-page">

		<!-- Tab导航栏 -->
		<view class="tab-nav">
			<view class="tab-item" :class="{ active: activeTab === 0 }" @click="activeTab = 0">
				<text>溯源信息</text>
				<view class="tab-indicator" v-if="activeTab === 0"></view>
			</view>
			<view  v-if="type==1"  class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1">
				<text>图片上传</text>
				<view class="tab-indicator" v-if="activeTab === 1"></view>
			</view>
		</view>

		<!-- Tab内容区域 -->
		<view class="tab-content">
			<!-- 第一个Tab：溯源信息 -->
			<view class="tab-panel" v-if="activeTab === 0">
				<!-- 溯源介绍 -->
				<view class="intro-card">
					<view class="intro-icon">
						<!-- <icon type="info" size="24" color="#1890FF"></icon> -->
					</view>
					<view class="intro-content">
						<view class="intro-title">补充溯源信息，生意更旺！</view>
						<view class="intro-points">
							<view class="intro-point">• 买家看得到来源，买得更放心</view>
							<view class="intro-point">• 平台优先推荐，曝光更多</view>
							<view class="intro-point">• 农产品/生鲜专属标签，区别普通商品</view>
						</view>
					</view>
				</view>

				<view class="form-container">
					<!-- 选中商品 -->
					<view class="form-item">
						<view class="item-label required">选中商品</view>
						<view class="item-content">
							<view class="picker-view">
								{{goodsname}}
								<!-- <icon type="arrowright" size="16" color="#999"></icon> -->
							</view>
						</view>
					</view>

					<!-- 基础信息模块 -->
					<view class="form-item">
						<view class="item-label required">基础信息</view>
						<view class="item-content">
							<textarea placeholder="输入产品基本信息:" maxlength="2000" style="padding: 10rpx; font-size: 38rpx;"
								v-model="formData.content"></textarea>
						</view>
					</view>

					<!-- 溯源信息描述 -->
					<view class="form-item">
						<view class="item-label required">溯源信息描述</view>
						<view class="item-content">
							<textarea
								placeholder="输入溯源信息：1. 生产环节:产地、种植/生产方式、周期等2.质检情况:检测标准、结果、机构等3. 物流信息:仓储条件、运输方式等4. 其他:原料来源、工艺特点等..."
								v-model="formData.fromcontent" maxlength="2000"
								style="padding: 10rpx; font-size: 38rpx;"></textarea>
							<view class="word-count">{{ formData.fromcontent.length || 0 }} / 2000</view>
							<view class="info-hint">
								<!-- <icon type="help" size="14" color="#1890FF"></icon> -->
								<text>真实细节越丰富，买家信任度越高，平台推荐越多</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 第二个Tab：多图展示上传 -->
			<view class="tab-panel" v-if="activeTab === 1">
				<!-- 图片上传说明 -->
				<view class="upload-guide-card">
					<view class="guide-icon">
						<!-- <icon type="lightbulb" size="24" color="#1890FF"></icon> -->
					</view>
					<view class="guide-content">
						<view class="guide-title">上传优质图片，提升溯源可信度</view>
						<view class="guide-points">
							<view class="guide-point">• 清晰展示商品真实情况，避免模糊、歪斜</view>
							<view class="guide-point">• 不同场景分类上传，方便买家了解全过程</view>
							<view class="guide-point">• 最多可上传9张</view>
						</view>
					</view>
				</view>

				<!-- 多图上传主区域 -->
				<view class="upload-container">
					<!-- 图片网格布局 -->
					<view class="image-grid">
						<!-- 上传按钮 -->
						<view class="upload-btn" @click="chooseImage" v-if="images.length < 9">
							<!-- <icon type="camera" size="32" color="#1890FF"></icon> -->
							<text>拍摄/选择</text>
						</view>

						<!-- 图片预览项 -->
						<view class="image-item" v-for="img in images" :key="img.id">
							<image :src="img.url" mode="aspectFill"></image>
							<view class="image-overlay">
								<uni-icons type="clear" size="20" color="#fff" class="delete-icon"
									@click.stop="deleteImage(img.id)"></uni-icons>
							</view>
						</view>
					</view>

					<!-- 数量提示 -->
					<view class="image-count">
						已上传 {{ images.length }} / 9 张图片
					</view>
				</view>
			</view>
		</view>

		<button class="submit-btn" @click="submitForm" v-if="activeTab==0">
			<text>提交溯源信息</text>
		</button>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	export default {
		onLoad(option) {
			try {
				// console.log(option.type)
				if (option.type) {
					this.type = Number(option.type)
				}
			} catch {

			}
			this.id = option.id
			this.goodsname = option.goodsname
			this.formData.goods_id = Number(option.id)
			this.uploadImageback()
		},
		data() {
			return {
				type: 1, // 状态为1是摊主，状态为2是农户
				goodsname: null,
				id: null,
				activeTab: 0, // 0:溯源信息 1:图片上传
				selectedSource: '',
				sourceTypes: ['自家种植', '合作社供货', '批发市场进货', '产地直采'],

				// 图片相关
				categories: ['种植/养殖场景', '进货单据', '摊位实拍', '商品细节', '质检报告'],
				activeCategory: 0,
				images: [],
				formData: {
					content: null,
					fromcontent: ''
				}
			};
		},
		methods: {

			// 图片上传之后的回调
			async uploadImageback() {
				let data = await api.getManyImages({
					goodsid: Number(this.id),
					limit: 100,
					page: 1
				})

				if (data.code == 200) {
					console.log(data.data)
					this.images = [...data.data]
				}
			},
			// 货源类型选择变化
			onSourceChange(e) {
				this.selectedSource = this.sourceTypes[e.detail.value];
			},


			saveImage(path) {
				return new Promise((res, rej) => {
					uni.uploadFile({
						url: 'https://image.xcbdsc.com/group1/upload',
						name: 'file',
						filePath: path,
						formData: {
							output: 'json2'
						},
						success: (reponse) => {
							res(JSON.parse(reponse.data))
						},
						fail: (err) => {
							rej(err)
							uni.showToast({
								title: '上传失败',
								icon: 'error'
							});
						}
					})
				})
			},
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 9 - this.images.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const newImages = res.tempFilePaths.map(path => ({
							url: path
						}));
						// this.images = [...this.images, ...newImages];
						const imgUploadPromises = newImages.map(item => {
							return this.saveImage(item.url)
						})
						Promise.all(imgUploadPromises).then(async (data) => {
							// console.log(data)
							data.forEach(item => {
								api.manyImages({
									goodsid: Number(this.id),
									url: item.data.url
								}).then((data) => {
									this.images.push({
										url: data.data.url,
										id: data.data.id
									})
									console.log(this.images)
								})
							})
						})
					}
				});
			},

			// 删除图片
			deleteImage(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张图片吗？',
					success: (res) => {
						if (res.confirm) {
							api.delManyImages({
								id: id
							}).then((data) => {
								this.uploadImageback()
							})
						}
					}
				});
			},

			// 提交表单
			async submitForm() {
				let get = null
				if (this.type == 1) {
					get = api.addTraceability
				} else {
					this.formData.id = this.formData.goods_id
					delete this.formData.goods_id
					get = api.updateDish
				}
				let data = await get(
					this.formData
				)
				console.log(data)

				// 模拟提交
				uni.showLoading({
					title: '提交中...'
				});

				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '提交成功，等待审核',
						icon: 'success',
						duration: 2000
					});

					// 返回上一页
					// setTimeout(() => {
					// 	uni.navigateBack();
					// }, 2000);
				}, 1500);
			}
		}
	};
</script>

<style scoped>
	/* 页面基础样式 */
	.traceability-tab-page {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f5f7fa;
		min-height: 100vh;
		padding-bottom: 80px;
		/* 为底部按钮留出空间 */
	}

	/* 导航栏 */
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 48px;
		padding: 0 16px;
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.nav-title {
		font-size: 18px;
		font-weight: 500;
		color: #333333;
	}

	.save-btn {
		color: #1890FF;
		font-size: 16px;
		padding: 6px 10px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.save-btn:active {
		background-color: #e6f7ff;
	}

	/* Tab导航 */
	.tab-nav {
		display: flex;
		height: 48px;
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		z-index: 99;
	}

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.tab-item text {
		font-size: 16px;
		color: #666666;
		transition: color 0.2s;
	}

	.tab-item.active text {
		color: #1890FF;
		font-weight: 500;
	}

	.tab-indicator {
		width: 30px;
		height: 3px;
		background-color: #1890FF;
		border-radius: 3px;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	/* Tab内容区域 */
	.tab-content {
		flex: 1;
	}

	.tab-panel {
		width: 100%;
	}

	/* 溯源信息Tab样式（复用之前的样式） */
	.intro-card {
		background-color: #e6f7ff;
		border-radius: 10px;
		padding: 16px;
		margin: 16px;
		display: flex;
		align-items: flex-start;
		border-left: 4px solid #1890FF;
		box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
	}

	.intro-icon {
		margin-right: 12px;
		margin-top: 2px;
		color: #1890FF;
	}

	.intro-title {
		font-size: 16px;
		color: #1890FF;
		font-weight: 500;
		margin-bottom: 8px;
	}

	.intro-points {
		font-size: 14px;
		color: #0050b3;
		line-height: 1.7;
	}

	.form-container {
		padding: 0 16px;
	}

	.form-item {
		margin-bottom: 16px;
		background-color: #ffffff;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.item-label {
		padding: 14px 16px;
		font-size: 15px;
		color: #333333;
		border-bottom: 1px solid #f5f5f5;
		display: flex;
		align-items: center;
	}

	.required::before {
		content: '*';
		color: #ff4d4f;
		margin-right: 4px;
	}

	.item-content {
		padding: 16px;
	}

	.picker-view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 14px;
		border: 1px solid #e5e5e5;
		border-radius: 6px;
		font-size: 15px;
		color: #333333;
		background-color: #fafafa;
		transition: all 0.2s;
	}

	/* 信息区域样式 */
	.info-section {
		background-color: #fafbfd;
		border-radius: 8px;
		padding: 14px;
		margin-bottom: 12px;
		border: 1px solid #f0f5ff;
	}

	.info-section.first-section {
		margin-top: 5px;
	}

	.section-subtitle {
		font-size: 14px;
		color: #1890FF;
		font-weight: 500;
		margin-bottom: 12px;
		padding-left: 4px;
		border-left: 3px solid #1890FF;
	}

	.info-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.info-label {
		font-size: 13px;
		color: #666666;
		font-weight: 500;
	}

	.info-input input,
	.info-input .picker-view {
		width: 100%;
		padding: 11px 12px;
		border: 1px solid #e5e5e5;
		border-radius: 6px;
		font-size: 14px;
		color: #333333;
		background-color: #ffffff;
		transition: all 0.2s;
	}

	textarea {
		width: 100%;
		padding: 14px;
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		font-size: 15px;
		color: #333333;
		min-height: 160px;
		resize: vertical;
		box-sizing: border-box;
		line-height: 1.7;
		background-color: #fafafa;
	}

	.word-count {
		text-align: right;
		font-size: 12px;
		color: #999999;
		margin-top: 8px;
	}

	.info-hint {
		display: flex;
		align-items: center;
		font-size: 13px;
		color: #1890FF;
		margin-top: 8px;
		padding-top: 8px;
		border-top: 1px dashed #e6f7ff;
	}

	/* 图片上传Tab样式 */
	.upload-guide-card {
		background-color: #e6f7ff;
		border-radius: 10px;
		padding: 14px 16px;
		margin: 12px 16px;
		display: flex;
		align-items: flex-start;
	}

	.guide-icon {
		margin-right: 10px;
		margin-top: 2px;
		color: #1890FF;
	}

	.guide-title {
		font-size: 15px;
		color: #1890FF;
		font-weight: 500;
		margin-bottom: 6px;
	}

	.guide-points {
		font-size: 13px;
		color: #0050b3;
		line-height: 1.6;
	}

	.image-category {
		padding: 0 16px;
		background-color: #ffffff;
	}

	.category-scroll {
		white-space: nowrap;
		padding: 12px 0;
	}

	.category-item {
		display: inline-block;
		padding: 6px 14px;
		margin-right: 10px;
		font-size: 14px;
		border-radius: 20px;
		background-color: #f5f5f5;
		color: #666666;
		transition: all 0.2s;
	}

	.category-item.active {
		background-color: #1890FF;
		color: #ffffff;
	}

	.upload-container {
		padding: 16px;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-bottom: 16px;
	}

	.upload-btn {
		width: 100%;
		aspect-ratio: 1/1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 2px dashed #e5e5e5;
		border-radius: 8px;
		color: #1890FF;
		font-size: 14px;
		background-color: #fafafa;
		transition: all 0.2s;
	}

	.upload-btn icon {
		margin-bottom: 8px;
	}

	.image-item {
		width: 100%;
		aspect-ratio: 1/1;
		position: relative;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.image-item image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-overlay {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 8px;
	}

	.image-tag {
		color: #ffffff;
		font-size: 12px;
		background-color: rgba(24, 144, 255, 0.8);
		padding: 2px 6px;
		border-radius: 3px;
	}

	.delete-icon {
		background-color: rgba(255, 77, 79, 0.9);
		border-radius: 50%;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-count {
		font-size: 14px;
		color: #666666;
		text-align: center;
		padding: 8px 0;
	}

	.required-hint {
		color: #ff4d4f;
		font-size: 13px;
	}

	.submit-btn {
		width: calc(100% - 32px);
		height: 50px;
		background-color: #1890FF;
		color: #ffffff;
		border: none;
		border-radius: 10px;
		font-size: 17px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
		transition: all 0.2s;
	}



	/* 响应式调整 */
	@media (max-width: 375px) {
		.info-grid {
			grid-template-columns: 1fr;
		}

		.image-grid {
			gap: 10px;
		}
	}
</style>