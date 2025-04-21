<template>
	<view class="complaint-page">
		<view class="page-header">
			<text class="title">投诉与建议</text>
		</view>

		<!-- 投诉表单 -->
		<uni-forms ref="form" :model="formData">
			<!-- 投诉类型 -->
			<uni-forms-item label="投诉类型" required name="type">
				<uni-data-select v-model="formData.type" :localdata="complaintTypes" placeholder="请选择投诉类型" />
			</uni-forms-item>

			<!-- 订单选择 -->
			<uni-forms-item label="相关订单" required name="orderId">
				<uni-easyinput v-model="formData.orderId" placeholder="输入订单编号" suffixIcon="search"
					@iconClick="showOrderList" />
			</uni-forms-item>

			<!-- 投诉内容 -->
			<uni-forms-item label="投诉描述" required name="content">
				<textarea v-model="formData.content" placeholder="请详细描述您的问题（不少于20字）" class="content-input"
					auto-height />
			</uni-forms-item>

			<!-- 图片上传 -->
			<view class="upload-section">
				<text class="upload-title">上传凭证（最多4张）</text>
				<uni-file-picker v-model="formData.files" fileMediatype="image" limit="4" :image-styles="imageStyles"
					@select="handleFileSelect" />
			</view>

			<!-- 联系方式 -->
			<uni-forms-item label="联系方式" required name="contact">
				<uni-easyinput v-model="formData.contact" placeholder="手机/邮箱" />
			</uni-forms-item>

			<!-- 提交按钮 -->
			<button class="submit-btn" :class="{ disabled: !formValid }" @click="handleSubmit">
				<text v-if="loading" class="loading-text">提交中...</text>
				<text v-else>立即提交</text>
			</button>
		</uni-forms>

		<!-- 订单选择弹窗 -->
		<uni-popup ref="orderPopup" type="bottom">
			<view class="order-popup">
				<view class="popup-header">
					<text>选择订单</text>
					<uni-icons type="close" @click="closeOrderList" />
				</view>
				<scroll-view scroll-y class="order-list">
					<view v-for="order in recentOrders" :key="order.id" class="order-item" @click="selectOrder(order)">
						<text class="order-no">{{ order.orderNo }}</text>
						<text class="order-date">{{ formatDate(order.date) }}</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				formData: {
					type: '',
					orderId: '',
					content: '',
					files: [],
					contact: ''
				},
				complaintTypes: [{
						value: 1,
						text: "商品质量问题"
					},
					{
						value: 2,
						text: "配送问题"
					},
					{
						value: 3,
						text: "服务态度"
					},
					{
						value: 4,
						text: "其他问题"
					}
				],
				imageStyles: {
					width: 160,
					height: 160,
					border: {
						color: "#eee",
						width: 1,
						style: 'solid'
					}
				}
			}
		},

		computed: {
		},

		methods: {
			// 表单验证方法
			validateContent(rule, value, callback) {
				if (value.length < 20) {
					callback('描述需不少于20字')
				}
				return true
			},

			validateContact(rule, value, callback) {
				const phoneReg = /^1[3-9]\d{9}$/
				const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
				if (!phoneReg.test(value) && !emailReg.test(value)) {
					callback('请输入有效的手机或邮箱')
				}
				return true
			},

			// 文件选择处理
			handleFileSelect(e) {
				if (e.tempFilePaths.length > 4) {
					uni.showToast({
						title: '最多选择4张图片',
						icon: 'none'
					})
					return false
				}
			},

			// 订单选择
			showOrderList() {
				this.$refs.orderPopup.open()
			},

			selectOrder(order) {
				this.formData.orderId = order.orderNo
				this.$refs.orderPopup.close()
			},

			closeOrderList() {
				this.$refs.orderPopup.close()
			},

			// 提交处理
			async handleSubmit() {
				if (this.loading || !this.formValid) return

				try {
					this.loading = true
					await this.$refs.form.validate()

					const form = new FormData()
					Object.entries(this.formData).forEach(([key, value]) => {
						if (key === 'files') {
							value.forEach(file => form.append('files', file))
						} else {
							form.append(key, value)
						}
					})

					await this.$api.submitComplaint(form)
					uni.showToast({
						title: '提交成功'
					})
					setTimeout(() => uni.navigateBack(), 1500)
				} catch (error) {
					console.error('提交失败:', error)
				} finally {
					this.loading = false
				}
			},

			formatDate(date) {
				return new Date(date).toLocaleDateString()
			}
		}
	}
</script>

<style lang="scss">
	.complaint-page {
		padding: 30rpx;
		background: #f8f9fa;
		min-height: 100vh;

		.page-header {
			margin-bottom: 40rpx;

			.title {
				display: block;
				font-size: 44rpx;
				font-weight: 600;
				color: #333;
			}

			.subtitle {
				font-size: 26rpx;
				color: #999;
				margin-top: 16rpx;
			}
		}

		.content-input {
			width: 100%;
			min-height: 200rpx;
			padding: 24rpx;
			background: #fff;
			border-radius: 12rpx;
			font-size: 28rpx;
		}

		.upload-section {
			margin: 40rpx 0;

			.upload-title {
				display: block;
				font-size: 28rpx;
				color: #666;
				margin-bottom: 24rpx;
			}
		}

		.submit-btn {
			background: #007aff;
			color: white;
			height: 88rpx;
			border-radius: 44rpx;
			font-size: 32rpx;
			margin-top: 60rpx;

			&.disabled {
				opacity: 0.6;
			}

			.loading-text {
				display: flex;
				align-items: center;
				justify-content: center;

				&::after {
					content: '';
					display: inline-block;
					width: 32rpx;
					height: 32rpx;
					border: 4rpx solid #fff;
					border-radius: 50%;
					border-top-color: transparent;
					animation: spin 0.8s linear infinite;
					margin-left: 16rpx;
				}
			}
		}

		.order-popup {
			background: #fff;
			border-radius: 32rpx 32rpx 0 0;
			padding: 32rpx;

			.popup-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 32rpx;

				text {
					font-size: 36rpx;
					font-weight: 500;
				}
			}

			.order-list {
				max-height: 60vh;

				.order-item {
					padding: 24rpx;
					background: #f8f9fa;
					border-radius: 16rpx;
					margin-bottom: 24rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.order-no {
						font-weight: 500;
						color: #333;
					}

					.order-date {
						color: #999;
						font-size: 24rpx;
					}
				}
			}
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>