<template>
	<view class="container">
		<!-- 进度指示器 -->
		<view class="progress-bar">
			<view class="step active">1. 基本信息</view>
			<view class="step" :class="setp == 2 ? 'active':''">2. 确认提交</view>
		</view>

		<scroll-view scroll-y v-show="setp == 1">
			<view class="form-card animated fadeIn">
				<view class="card-header">
					<uni-icons type="info" size="18" color="#4CD964" />
					<text class="card-title">菜品信息</text>
				</view>

				<uni-forms ref="form" :modelValue="formData" label-position="top">
					<view class="form-row">
						<view class="col-9">
							<uni-forms-item label="预售菜品" required name="category">
								<input type="text" v-model="formData.goodsname" placeholder="输入名称">
							</uni-forms-item>
						</view>

					</view>
					
					<view class="form-row">
						<view class="col-9">
							<uni-forms-item label="菜品分类" required name="category">
								<picker class="picker" :range="pickerRange" :value="selectedCategoryIndex"
									@change="onCategoryChange">
									<view class="picker-text" style="">{{ pickerRange[selectedCategoryIndex] }}</view>
								</picker>
							</uni-forms-item>
						</view>
					
					</view>
					
					
					
					<view class="form-row">
						<view class="col-9" >
							<uni-forms-item label="预售库存" required name="stock" >
								<input   type="text" v-model.number="formData.goodstotal" placeholder="请输入库存">

							</uni-forms-item>
						</view>
						<view class="col-9">
							<uni-forms-item label="预售单位" required name="stock">
								<input type="text" v-model="formData.unit" placeholder="请输入单位">

							</uni-forms-item>
						</view>
					</view>

					<view class="price-group form-row">
						<uni-forms-item label="预卖价" required name="price">
							<view class="price-input">
								<text class="currency">¥</text>
								<uni-easyinput type="number" v-model.number="formData.presaleprice" placeholder="0.00"
									:inputBorder="false" :styles="{color: isPaid ? '#999' : '#FF4444'}"
									:disabled="isPaid" />
							</view>
						</uni-forms-item>
						<!-- <view class="price-tips">
							<uni-icons type="alert" size="14" color="#999" />
							<text>预付后价格将锁定不可修改</text>
						</view> -->
					</view>
					<view class="price-group form-row">
						<uni-forms-item label="市场价" required name="price">
							<view class="price-input">
								<text class="currency">¥</text>
								<uni-easyinput type="number" v-model.number="formData.price" placeholder="0.00"
									:inputBorder="false" :styles="{color: isPaid ? '#999' : '#FF4444'}"
									:disabled="isPaid" />
							</view>
						</uni-forms-item>
					</view>
					
					<view class="form-item">
						<view class="item-label">
							<view style="display: flex;">
								<uni-icons type="image" size="18" color="#666" style="" />
								<uni-forms-item label="菜品图片" required name="week" style=""></uni-forms-item>
							</view>
					
						</view>
						<view class="upload-btn" :class="{ 'uploaded': isImageSelected }" @tap="chooseImage">
							<uni-icons :type="isImageSelected ? 'checkmarkempty' : 'plusempty'" size="24"
								:color="isImageSelected ? '#67C23A' : '#999'" />
							<text>{{ isImageSelected ? '已上传' : '点击上传' }}</text>
						</view>
					</view>
					<uni-forms-item label="是否预卖" required name="week">
						<switch @change="switchChange" />
					</uni-forms-item>
					<uni-forms-item label="预售起始" required name="week">
						<uni-datetime-picker type="datetime" v-model="formData.sellbegintime" return-type="timestamp" />
					</uni-forms-item>
					<uni-forms-item label="预售结束" required name="week">
						<uni-datetime-picker type="datetime" v-model="formData.sellendtime" return-type="timestamp" />
					</uni-forms-item>


					

				</uni-forms>
			</view>


		</scroll-view>


		<scroll-view scroll-y v-show="setp == 2">
			<view class="form-card animated fadeIn">
				<view class="card-header">
					<uni-icons type="info" size="18" color="#4CD964" />
					<text class="card-title">提交申请</text>
				</view>

				<view class="form-card">

					<!-- <view class="protocol-section">
						<text class="section-title">第一条 商品信息</text>
						<text class="protocol-text">
							1.1 预售商品名称：{{goodsInfo.name}}\n1.2商品单价：¥{{goodsInfo.price}}/{{goodsInfo.unit}}\n1.3预售周期：{{formatWeek(goodsInfo.weekSelection)}}
						</text>
					</view> -->

					<view class="protocol-section">
						<text class="section-title">第一条 质量保证</text>
						<!-- <text class="protocol-text">
							卖方承诺商品质量符合GB/T 20014.5-2013标准，并提供以下证明文件：\n- 农产品质量安全检测报告\n- 原产地证明\n- 无公害农产品认证
						</text> -->
					</view>

					<view class="protocol-section">
						<text class="section-title">第二条 隐私条款</text>
<!-- 						<text class="protocol-text">
							平台将采取以下措施保护用户隐私：\n1. 联系方式加密存储（AES-256）\n2. 生物特征信息实时删除
						</text> -->
					</view>

					<!-- <view class="protocol-section">
						<text class="section-title">第四条 违约责任</text>
						<text class="protocol-text">
							违约金计算公式：\n违约金 = 定金金额 × 违约天数 × 0.05\n最低违约金：¥500
						</text>
					</view> -->


					<view class="protocol-actions">
						<label class="agree-checkbox">
							<checkbox :checked="agreed" @click="disabled = !disabled" color="#4CD964" />
							<text>我已阅读并同意上述协议</text>
						</label>
						<button class="confirm-btn" :class="disabled ? '':'disabled'" @click="handleConfirm">
							提交申请，交付押金
						</button>
					</view>
				</view>
			</view>

		</scroll-view>

		<view class="fab-container" v-show="setp==1">
			<button class="fab-button" @click="gotoSupplement">
				<text>下一步</text>
			</button>
		</view>
	</view>
</template>

<script>
	import {
		api,
		UPLOAD_URL
	} from '../../api/index.js';
	import {
		useUpload
	} from "@/hooks/useUpload"
	import {myMixin} from '@/utils/public.js'
	export default {
		mixins:[myMixin],
		data() {
			return {
				selectedCategoryIndex:0,
				pickerRange:[],
				isImageSelected: false,
				imglogo: null,
				disabled: false,
				agreed: false,
				goodsInfo: {
					name: '有机高山娃娃菜',
					price: 12.8,
					unit: '斤',
					weekSelection: 3
				},
				setp: 1,
				isPaid: false,
				formData: {
					goodsname: null, // 菜品名称
					goodstotal: null, // 菜品库存数量
					ispresale: 1, //是否预卖
					unit: null, // 菜品单位
					imglogo: null, // 图片地址
					sellbegintime: null, // 预卖开始时间戳
					sellendtime: null, //  预卖结束时间戳
					presaleprice: null, // 预卖价格
					price: null // 市场价
				},
			}
		},
		computed: {
			supplementProgress() {
				const storedData = uni.getStorageSync('supplementData') || {}
				return Math.min(Object.keys(storedData).length * 20, 100)
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
					this.category_id = this.categories[selectedIndex - 1].id; // -1 是因为 `pickerRange` 的第一项是提示
				} else {
					this.category_id = ''; // 用户选择了默认提示项，重置 `category_id`
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
				if (this.disabled) {
					this.formData.presaleprice = parseInt(this.formData.presaleprice)
					this.formData.price = parseInt(this.formData.price)
					api.addPreSale(this.formData).then((data)=>{
						console.log(data)
						if (data.code == 200) {
							uni.showToast({
								icon:"success",
								title:'添加成功'
							})
							setTimeout(()=>{
								this.customizeBack()
							},2000)
						}else{
							uni.showToast({
								icon:"error",
								title:data.msg
							})
						}
					})
					
				}
				// 开始提交菜品信息

			},
			switchChange() {
				this.formData.ispresale = this.formData.ispresale == 1 ? 2 : 1
				console.log(this.formData.ispresale)
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
				this.setp = 2

			}
		}
	}
</script>


<style lang="scss">
	
	.picker-text {
		/* width: 250rpx; */
		height: 100%;
		color: #808080;
		font-size: 25rpx;
	}
	.upload-btn {
		display: inline-flex;
		align-items: center;
		padding: 16rpx 32rpx;
		border: 2rpx dashed #ddd;
		border-radius: 8rpx;
		transition: all 0.3s;

		&.uploaded {
			border-color: #67C23A;
			background: #f0f9eb;
		}

		uni-icons {
			margin-right: 12rpx;
		}

		text {
			font-size: 28rpx;
			color: #666;
		}
	}

	.form-item {
		padding: 25rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		.item-label {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			font-size: 28rpx;
			color: #666;

			uni-icons {
				margin-right: 12rpx;
			}
		}

		.form-input {
			height: 80rpx;
			font-size: 30rpx;
			color: #333;
			padding: 0 20rpx;
			background: #f8f8f8;
			border-radius: 8rpx;
		}
	}

	.protocol-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
		text-align: center;
	}

	.protocol-section {
		margin-bottom: 40rpx;
	}

	.section-title {
		font-size: 28rpx;
		color: #4CD964;
		font-weight: 500;
		margin: 20rpx 0;
		display: block;
		border-left: 6rpx solid #4CD964;
		padding-left: 15rpx;
	}

	.protocol-text {
		font-size: 26rpx;
		color: #666;
		line-height: 1.8;
		white-space: pre-wrap;
	}

	/* 操作区域样式 */
	.protocol-actions {
		margin-top: 40rpx;
		padding-top: 30rpx;
		border-top: 1rpx solid #eee;
	}

	.agree-checkbox {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		font-size: 28rpx;
		color: #666;

		checkbox {
			margin-right: 15rpx;
		}
	}

	.confirm-btn {
		background: linear-gradient(135deg, #4CD964, #34C759);
		color: white;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 32rpx;

		&.disabled {
			background: #e5e5e5;
			color: #999;
		}
	}

	/deep/ .uni-input-input {
		font-size: 30rpx !important;
	}

	.container {
		background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
		min-height: 100vh;
	}

	/* 进度指示器 */
	.progress-bar {
		display: flex;
		padding: 40rpx 30rpx;
		background: #fff;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);

		.step {
			flex: 1;
			text-align: center;
			font-size: 28rpx;
			color: #999;
			position: relative;

			// &::after {
			// 	content: '';
			// 	position: absolute;
			// 	right: -50%;
			// 	top: 50%;
			// 	width: 200rpx;
			// 	height: 2rpx;
			// 	background: #eee;
			// }

			&.active {
				color: #4CD964;
				font-weight: 500;
			}

			&:last-child::after {
				display: none;
			}
		}
	}

	.form-card {
		min-height: 70vh;
		margin: 30rpx;
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.03);

		.card-header {
			justify-content: center;
			display: flex;
			align-items: center;
			margin-bottom: 48rpx;

			.card-title {
				font-size: 32rpx;
				color: #333;
				// margin-left: 16rpx;
				font-weight: 600;
			}
		}
	}

	.form-row {
		display: flex;
		margin: 0 -16rpx;

		.col-6 {
			flex: 1;
			padding: 0 16rpx;
		}
	}


	.price-group {
		.price-input {
			display: flex;
			align-items: center;
			height: 96rpx;
			background: #f8f9fa;
			border-radius: 16rpx;
			padding: 0 24rpx;

			.currency {
				font-size: 40rpx;
				color: #FF4444;
				margin-right: 16rpx;
			}

			/deep/ .uni-easyinput__content {
				height: 96rpx !important;
				line-height: 96rpx !important;
				font-size: 48rpx !important;
			}
		}

		.price-tips {
			margin-top: 24rpx;
			font-size: 24rpx;
			color: #999;
			display: flex;
			align-items: center;

			uni-icons {
				margin-right: 8rpx;
			}
		}
	}


	/* 浮动操作按钮 */
	.fab-container {
		position: fixed;
		right: 48rpx;
		bottom: 30rpx;

		.fab-button {
			height: 96rpx;
			padding: 0 40rpx;
			background: linear-gradient(135deg, #4CD964, #34C759);
			border-radius: 48rpx;
			box-shadow: 0 8rpx 24rpx rgba(76, 217, 100, 0.3);
			display: flex;
			align-items: center;

			text {
				color: #fff;
				font-size: 28rpx;
			}
		}
	}
</style>