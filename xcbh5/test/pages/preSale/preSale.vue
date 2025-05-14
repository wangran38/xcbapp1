<template>
	<view class="container">
		<!-- 进度指示器 -->
		<view class="progress-steps">
			<view class="step-line"></view>
			<view class="step-item" :class="{'active': setp >= 1}">
				<view class="step-dot"></view>
				<text class="step-text">基本信息</text>
			</view>
			<view class="step-item" :class="{'active': setp >= 2}">
				<view class="step-dot"></view>
				<text class="step-text">确认提交</text>
			</view>
		</view>

		<scroll-view scroll-y>
			<view class="form-container" v-show="setp == 1">
				<!-- 表单标题 -->
				<view class="form-header">
					<uni-icons type="info" size="20" color="#2979FF" />
					<text class="form-title">菜品信息</text>
				</view>

				<!-- 表单内容 -->
				<uni-forms ref="form" :modelValue="formData" label-position="top">
					<!-- 菜品名称 -->
					<view class="form-item">
						<label class="form-label">预售菜品</label>
						<uni-easyinput type="text" v-model="formData.goodsname" placeholder="请输入菜品名称" />
					</view>

					<!-- 菜品分类 -->
					<view class="form-item">
						<label class="form-label">菜品分类</label>
						<picker class="category-picker" :range="pickerRange" :value="selectedCategoryIndex"
							@change="onCategoryChange">
							<view class="picker-content">
								<text>{{ pickerRange[selectedCategoryIndex] }}</text>
								<uni-icons type="arrowdown" size="14" color="#666" />
							</view>
						</picker>
					</view>

					<!-- 图片上传 -->
					<view class="form-item">
						<label class="form-label upload-label">
							<uni-icons type="image" size="18" color="#2979FF" />
							<text>菜品图片</text>
						</label>
						<view class="upload-area" :class="{ 'has-image': isImageSelected }" @tap="chooseImage">
							<uni-icons :type="isImageSelected ? 'checkmarkempty' : 'plusempty'" size="32"
								:color="isImageSelected ? '#67C23A' : '#C0C4CC'" />
							<text class="upload-tip">{{ isImageSelected ? '上传成功' : '点击上传' }}</text>
						</view>
					</view>
				</uni-forms>

			</view>
			<view v-show="setp == 2" class="form-container">
				<view class="regulations">
					<view class="title">第一条 商品信息</view>
					<view class="content">
						<view>1.1</view>
						<view>1.2</view>
					</view>
				</view>
				<view class="regulations">
					<view class="title">第二条 质量保证</view>
					<view class="content">
						<view>2.1</view>
						<view>2.2</view>
					</view>
				</view>
			</view>
			<button @click="gotoSupplement" type="default"
				style="color:#ffffff;backgroundColor:#007aff;">{{BtnText}}</button>
		</scroll-view>



	</view>
</template>

<style lang="scss">
	.content view {
		color: gray;
	}

	.regulations {
		padding: 10rpx;
		margin: 10rpx;
	}

	.regulations .title {
		padding: 5rpx;
		border-left: 10rpx solid #007aff;
	}

	.container {
		padding: 32rpx;
		background: #f8f9fa;
		min-height: 100vh;
	}

	/* 进度条样式 */
	.progress-steps {
		display: flex;
		justify-content: space-between;
		position: relative;
		margin-bottom: 48rpx;

		.step-line {
			position: absolute;
			top: 14rpx;
			left: 50%;
			right: 50%;
			height: 4rpx;
			background: #e4e7ed;
			transform: translateY(-50%);
			z-index: 0;
		}

		.step-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			z-index: 1;

			.step-dot {
				width: 24rpx;
				height: 24rpx;
				border-radius: 50%;
				background: #c0c4cc;
				margin-bottom: 16rpx;
				transition: all 0.3s;
			}

			.step-text {
				font-size: 28rpx;
				color: #909399;
				white-space: nowrap;
			}

			&.active {
				.step-dot {
					background: #2979FF;
					transform: scale(1.2);
					box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.3);
				}

				.step-text {
					color: #303133;
					font-weight: 500;
				}
			}
		}
	}

	/* 表单容器 */
	.form-container {
		background: #fff;
		border-radius: 24rpx;
		padding: 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
	}

	.form-header {
		display: flex;
		align-items: center;
		margin-bottom: 32rpx;

		.form-title {
			font-size: 34rpx;
			color: #303133;
			margin-left: 16rpx;
			font-weight: 500;
		}
	}

	/* 表单元素 */
	.form-item {
		margin-bottom: 48rpx;

		.form-label {
			display: block;
			font-size: 30rpx;
			color: #606266;
			margin-bottom: 24rpx;
			font-weight: 400;
		}
	}

	/* 输入框样式 */
	.uni-easyinput {
		border-radius: 12rpx !important;
		box-shadow: 0 0 0 2rpx #e4e7ed inset !important;
		transition: all 0.3s;

		&:focus-within {
			box-shadow: 0 0 0 2rpx #2979FF inset !important;
		}
	}

	/* 分类选择器 */
	.category-picker {
		.picker-content {
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 24rpx;
			background: #f8f9fa;
			border-radius: 12rpx;
			font-size: 28rpx;
			color: #303133;
		}
	}

	/* 上传区域 */
	.upload-area {
		height: 240rpx;
		background: #f8f9fa;
		border: 2rpx dashed #dcdfe6;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;

		&.has-image {
			border-color: #67C23A;
			background: rgba(103, 194, 58, 0.05);
		}

		.upload-tip {
			font-size: 26rpx;
			color: #909399;
			margin-top: 16rpx;
		}
	}
</style>


<script>
	import {
		api,
		UPLOAD_URL
	} from '../../api/index.js';
	import {
		useUpload
	} from "@/hooks/useUpload"
	import {
		myMixin
	} from '@/utils/public.js'
	export default {
		mixins: [myMixin],
		data() {
			return {
				selectedCategoryIndex: 0,
				pickerRange: [],
				isImageSelected: false,
				imglogo: null,
				setp: 1,
				isPaid: false,

				// formData: {
				// 	goodsname: null, // 菜品名称
				// 	goodstotal: null, // 菜品库存数量
				// 	ispresale: 1, //是否预卖
				// 	unit: null, // 菜品单位
				// 	imglogo: null, // 图片地址
				// 	sellbegintime: null, // 预卖开始时间戳
				// 	sellendtime: null, //  预卖结束时间戳
				// 	presaleprice: null, // 预卖价格
				// 	price: null // 市场价
				// },
				formData: {
					goodsname: null, // 菜品名称
					imglogo: null, // 图片地址
					category_id: null,
				},
			}
		},
		computed: {
			BtnText() {
				return this.setp == 1 ? '下一步' : '提交'
			}
		},
		onLoad() {
			this.fetchCategories();
		},
		methods: {
			onCategoryChange(e) {
				const selectedIndex = e.detail.value;
				this.selectedCategoryIndex = selectedIndex;

				// 检查用户是否选择了有效的分类（跳过第一个默认项）
				if (selectedIndex > 0) {
					this.formData.category_id = this.categories[selectedIndex - 1].id; // -1 是因为 `pickerRange` 的第一项是提示
				} else {
					this.formData.category_id = ''; // 用户选择了默认提示项，重置 `category_id`
				}
			},
			// 请求菜品分类数据
			fetchCategories() {
				api.cglist().then(res => {
					if (res.code === 200) {
						// 获取分类数据
						const categories = res.data.listdata.map(item => ({
							id: item.id,
							content: item.content
						}));
						// 存储分类数据
						this.categories = categories;
						// 初始化 picker 的范围数据，包括默认提示项
						this.pickerRange = ['请选择分类', ...categories.map(category => category.content)];
						if (categories.length > 0) {
							this.category_id = categories[0].id; // 默认选择第一个分类
						}
					} else {
						uni.showToast({
							title: res.message || '获取分类失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error(err);
					uni.showToast({
						title: '获取分类失败',
						icon: 'none'
					});
				});
			},

			handleConfirm() {
				api.addPreSale(this.formData).then((data) => {
					console.log(data)
					if (data.code == 200) {
						uni.showToast({
							icon: "success",
							title: '添加成功'
						})
						setTimeout(() => {
							this.customizeBack()
						}, 2000)
					} else {
						uni.showToast({
							icon: "error",
							title: data.msg
						})
					}
				})


			},
			// 图片上传
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed', 'original'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						if (tempFilePaths.length > 0) {
							const {
								upload,
								request
							} = useUpload({
								uploadPath: '/group1/upload',
								tempFilePaths: tempFilePaths[0],
								file: res.tempFiles[0]
							})

							upload().then((res) => {
								var obj = JSON.parse(res);
								this.formData.imglogo = UPLOAD_URL + obj.data.path;
								this.isImageSelected = true;
							})
						}
					}
				});
			},

			formatWeek(week) {
				const start = new Date()
				start.setDate(start.getDate() + (week - 1) * 7)
				const end = new Date(start)
				end.setDate(start.getDate() + 6)
				return `${this.formatDate(start)} 至 ${this.formatDate(end)}`
			},

			formatDate(date) {
				return `${date.getMonth()+1}-${date.getDate()}`
			},

			async gotoSupplement() {
				this.setp++
				if (this.setp > 2) {
					// 开始发送请求
					this.handleConfirm()
				}

			}
		}
	}
</script>