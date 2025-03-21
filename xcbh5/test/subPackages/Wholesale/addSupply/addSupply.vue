<template>
	<view class="create-container">
		<uni-forms ref="formRef" :model="formData" :rules="formRules">
			<uni-card title="基本信息" margin>
				<uni-forms-item label="供应标题" required name="title" labelWidth="80px">
					<uni-easyinput v-model="formData.title" placeholder="请输入供应商品名称（5-30字符）" />
				</uni-forms-item>
				<uni-forms-item label="产品类目" required name="category" labelWidth="80px">
					 <uni-data-select
					        v-model="value"
					        :localdata="range"
					        @change="change"
					      ></uni-data-select>
				</uni-forms-item>
			</uni-card>

			<uni-card title="产品图片" margin>
				<uni-file-picker 
					v-model="formData.images"
					fileMediatype="image" 
					limit="9" 
					:image-styles="imageStyles"
					@select="handleImageSelect"
				/>
			</uni-card>

			<!-- 供应详情 -->
			<uni-card title="供应详情" margin>
				<uni-forms-item label="阶梯价格" required name="prices">
					<view class="price-ladder">
						<view 
							v-for="(item,index) in formData.prices" 
							:key="index"
							class="price-item"
						>
							<view class="input-group">
								<uni-easyinput 
									type="digit" 
									v-model="item.min" 
									placeholder="起订量" 
									:disabled="index > 0"
									@input="validatePrices"
								/>
								<text class="unit">-</text>
								<uni-easyinput 
									type="digit" 
									v-model="item.max" 
									placeholder="最大量"
									:disabled="index < formData.prices.length-1"
									@input="validatePrices"
								/>
								<uni-easyinput 
									type="digit" 
									v-model="item.price" 
									placeholder="单价" 
									prefix-icon="rmb"
									@input="validatePrices"
								/>
							</view>
							<uni-icons 
								v-if="formData.prices.length > 1" 
								type="close" 
								class="remove-btn"
								@click="removePrice(index)"
							/>
						</view>
						<button class="add-btn" @click="addPrice">+ 新增价格段</button>
					</view>
				</uni-forms-item>
			</uni-card>

			<!-- 提交按钮 -->
			<view class="submit-bar">
				<button 
					type="primary" 
					class="submit-btn" 
					@click="handleSubmit" 
					:disabled="submitting"
				>
					{{ submitting ? '提交中...' : '立即发布' }}
				</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				title: '',
				category: [],
				images: [],
				prices: [{ min: 1, max: null, price: null }],
				imagePrivate: false
			},
			 range: [
			          { value: 0, text: "蔬菜" },
			          { value: 1, text: "水果" },
			          { value: 2, text: "水产" },
			          { value: 3, text: "肉类" },
			          { value: 4, text: "豆制品" },
			          { value: 5, text: "干货" },
			        ],
			submitting: false,
			imageStyles: {
				width: 200,
				height: 200,
				border: { color: '#eee', width: 1, style: 'solid' }
			},
			formRules: {
				title: {
					rules: [
						{ required: true, errorMessage: '标题不能为空' },
						{ minLength: 5, maxLength: 30, errorMessage: '长度需5-30个字符' }
					]
				},
				category: {
					rules: [{
						validate: (val) => val?.length === 3,
						errorMessage: '请完整选择三级分类'
					}]
				},
				prices: {
					rules: [
						{ 
							validate: (val) => val.every(i => i.min && i.max && i.price),
							errorMessage: '请填写完整价格信息'
						},
						{
							validate: this.validatePriceLadder,
							errorMessage: '价格阶梯设置错误'
						}
					]
				}
			}
		}
	},
	methods: {
		handleCategoryChange(selected) {
			this.formData.category = selected
			this.$refs.formRef.validateField('category')
		},

		async handleImageSelect(e) {
			try {
				const { tempFilePath } = e.tempFiles[0]
				this.formData.images.push({
					url: tempFilePath,
					status: 'uploading'
				})
				
				// 模拟上传过程
				setTimeout(() => {
					const index = this.formData.images.findIndex(img => img.url === tempFilePath)
					if (index > -1) {
						this.$set(this.formData.images, index, {
							...this.formData.images[index],
							status: 'success'
						})
					}
				}, 1500)
			} catch (error) {
				uni.showToast({
					title: '上传失败，请重试',
					icon: 'none'
				})
			}
		},

		validatePriceLadder(prices) {
			let prevMax = 0
			return prices.every((item, index) => {
				const { min, max, price } = item
				if (min >= max) return false
				if (index > 0 && min !== prevMax + 1) return false
				prevMax = max
				return true
			})
		},

		addPrice() {
			const last = this.formData.prices[this.formData.prices.length - 1]
			this.formData.prices.push({
				min: last.max ? Number(last.max) + 1 : null,
				max: null,
				price: null
			})
		},

		removePrice(index) {
			this.formData.prices.splice(index, 1)
			this.validatePrices()
		},

		async handleSubmit() {
			try {
				this.submitting = true
				const valid = await this.$refs.formRef.validate()
				
				// 构造提交数据
				const submitData = {
					...this.formData,
					categoryPath: this.formData.category.map(c => c.name).join(' > '),
					prices: this.formData.prices.map(p => ({
						minQuantity: Number(p.min),
						maxQuantity: Number(p.max),
						unitPrice: Number(p.price)
					}))
				}
				
				console.log('提交数据:', submitData)
				
				uni.showToast({
					title: '发布成功',
					icon: 'success',
					duration: 2000
				})
				
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} catch (error) {
				console.error('表单验证失败:', error)
			} finally {
				this.submitting = false
			}
		}
	}
}
</script>

<style lang="scss">
	/deep/ .uni-card{
		overflow: visible !important;
	}
.create-container {
	padding: 20rpx;
	
	.image-tip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		// color: $uni-text-color-grey;
		font-size: 24rpx;
		padding: 20rpx 0;
		
		.privacy-switch {
			display: flex;
			align-items: center;
			gap: 10rpx;
		}
	}

	.price-ladder {
		.price-item {
			display: flex;
			align-items: center;
			gap: 20rpx;
			margin-bottom: 30rpx;
			
			.input-group {
				flex: 1;
				display: flex;
				gap: 10rpx;
				align-items: center;
				
				.unit {
					// color: $uni-text-color-grey;
					padding: 0 10rpx;
				}
				
				.uni-easyinput {
					flex: 1;
				}
			}
			
			.remove-btn {
				// color: $uni-color-error;
				padding: 10rpx;
				font-size: 40rpx;
			}
		}
		
		.add-btn {
			margin-top: 20rpx;
			// background: $uni-color-primary-light;
			// color: $uni-color-primary;
			border: none;
			
			&:active {
				// background: darken($uni-color-primary-light, 10%);
			}
		}
	}

	.submit-bar {
		position: sticky;
		bottom: 0;
		background: white;
		padding: 30rpx 0;
		box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
		
		.submit-btn {
			// background: $uni-color-primary;
			color: white;
			height: 80rpx;
			border-radius: 40rpx;
			font-size: 32rpx;
			
			&[disabled] {
				// background: $uni-color-primary-disabled;
			}
		}
	}
}
</style>
