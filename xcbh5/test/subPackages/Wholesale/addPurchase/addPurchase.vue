<template>
	<view class="purchase-container">
		<uni-forms ref="form">


			<view class="section">
				<uni-section title="采购明细" type="line"></uni-section>
				<uni-forms-item label="商品名称" required name="productName">
					<uni-easyinput v-model="formData.productName" placeholder="请输入商品名称"
						@focus="showGoodsPicker = true" />

					<uni-popup ref="goodsPopup" type="dialog">
						<goods-picker @select="handleGoodsSelect" />
					</uni-popup>
				</uni-forms-item>

				<uni-forms-item label="采购量" required name="quantity">
					<view class="quantity-input">
						<uni-easyinput type="number" v-model="formData.quantity" placeholder="请输入数量" />
						<uni-data-select v-model="formData.unit" :localdata="units" class="unit-select"
							placeholder="单位" />
					</view>
				</uni-forms-item>

				<uni-forms-item label="采购要求" name="requirements">
					<uni-easyinput type="textarea" v-model="formData.requirements" placeholder="请输入规格、材质等要求"
						:maxlength="500" />
				</uni-forms-item>
			</view>

			<!-- 时间要求 -->
			<view class="section">
				<uni-section title="时间要求" type="line"></uni-section>
				<uni-forms-item label="报价截止" required name="quoteDeadline">
					<uni-datetime-picker type="date" v-model="formData.quoteDeadline" :start="today"
						:end="maxQuoteDate" />
				</uni-forms-item>

				<!-- 				<uni-forms-item label="采购周期" required name="deliveryPeriod">
					<view class="range-picker">
						<uni-datetime-picker type="date" v-model="formData.deliveryStart" placeholder="开始日期" />
						<text class="separator">至</text>
						<uni-datetime-picker type="date" v-model="formData.deliveryEnd" placeholder="结束日期" />
					</view>
				</uni-forms-item> -->
			</view>

			<!-- 物流信息 -->
			<view class="section">
				<uni-section title="物流信息" type="line"></uni-section>
				<uni-forms-item label="收货地址" required name="deliveryAddress">
					<picker mode="multiSelector" :range="multiArray" :value="multiIndex" @change="bindMultiPickerChange"
						@columnchange="bindMultiPickerColumnChange">
						<view class="compact-picker" style="display: flex; justify-content: space-between;">
							<view>
								<text class="province">{{ multiArray[0][multiIndex[0]] || '省' }}</text>
								<text class="separator">/</text>
								<text class="city">{{ multiArray[1][multiIndex[1]] || '市' }}</text>
								<text class="separator">/</text>
								<text class="district">{{ multiArray[2][multiIndex[2]] || '区' }}</text>
							</view>

							<view>
								<uni-icons type="arrowright" size="18" color="#999" />
							</view>
						</view>
					</picker>

				</uni-forms-item>

				<uni-forms-item label="期望货源地" name="preferredOrigin">
					<uni-easyinput v-model="formData.preferredOrigin" placeholder="请输入供应商或地区" />
				</uni-forms-item>
			</view>

			<button type="primary" @click="submitForm">提交采购单</button>
		</uni-forms>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js';

	export default {
		data() {
			const today = '';

			return {
				multiArray: [
					[],
					[],
					[]
				],
				multiIndex: [0, 0, 0],
				formData: {
					applicant: '',
					department: '',
					applyDate: 'today',
					productName: '',
					quantity: null,
					unit: null,
					requirements: '',
					quoteDeadline: '',
					deliveryStart: '',
					deliveryEnd: '',
					deliveryAddress: [],
					preferredOrigin: '',
					area_id: null,
					market_id: null,
					category_id: null,
				},

				units: [{
						value: '件',
						text: '件'
					},
					{
						value: '吨',
						text: '吨'
					},
					{
						value: '箱',
						text: '箱'
					},
					{
						value: '斤',
						text: '斤'
					},

				],
				today,
				maxQuoteDate: ''
			};
		},
		mounted() {
			this.initializePicker();
			this.fetchCategories();
		},
		options: {
			stylelsolation: 'shared'
		},
		methods: {
			async fetchCategories() {
				try {
					const response = await api.cglist();
					if (response.code === 200) {
						const categories = response.data.listdata;
						this.categoryList = ['请选择分类', ...categories.map(item => item.title)];
						this.categoryIdMap = categories.reduce((map, item) => {
							map[item.title] = item.id;
							return map;
						}, {});
					} else {
						throw new Error('Failed to fetch categories');
					}
				} catch (error) {
					console.error('Failed to fetch categories:', error);
				}
			},
			async bindMultiPickerColumnChange(e) {
				console.log(e.detail)
				const column = e.detail.column;
				const value = e.detail.value;
				this.multiIndex[column] = value;

				if (column === 0) {
					const provinceId = this.provinceList[value].id;
					const cities = await this.fetchCities(provinceId);
					console.log(cities)
					this.cityList = cities;
					this.multiArray[1] = cities.map(item => item.name);
					this.multiArray[2] = cities ? cities[0].Children.map(item => item.name) : [];
					this.multiIndex[1] = 0;
					this.multiIndex[2] = 0;
				} else if (column === 1) {
					const cityId = this.cityList[value].id;
					const areas = await this.fetchAreas(cityId);
					this.districtList = areas;
					this.multiArray[2] = areas.map(item => item.name);
					this.multiIndex[2] = 0;
				}

				console.log(this.multiArray[2][this.multiIndex[2]])
				this.multiIndex = [...this.multiIndex];
			},

			bindMultiPickerChange(e) {
				console.log(e)
				this.multiIndex = e.detail.value;
				const selectedProvince = this.multiArray[0][this.multiIndex[0]];
				const selectedCity = this.multiArray[1][this.multiIndex[1]];
				const selectedArea = this.multiArray[2][this.multiIndex[2]];
				const selectedAreaId = this.districtList[this.multiIndex[2]].id;
				this.area_id = selectedAreaId;
				this.fetchMarkets(selectedAreaId);
			},

			async fetchProvinces() {
				try {
					const response = await api.citylist({
						level: 1,
						limit: 100
					});
					if (response.code === 200) {
						this.provinceList = response.data.listdata;
						return this.provinceList;
					}
					throw new Error('Failed to fetch provinces');
				} catch (error) {
					console.error('Failed to fetch provinces:', error);
					throw error;
				}
			},
			async initializePicker() {
				try {
					const provinces = await this.fetchProvinces();
					this.multiArray[0] = provinces.map(item => item.name);
					const cities = await this.fetchCities(provinces[0].id);
					this.multiArray[1] = cities.map(item => item.name);
					const areas = await this.fetchAreas(cities[0].id);
					this.multiArray[2] = areas.map(item => item.name);
					this.multiIndex = [0, 0, 0];
				} catch (error) {
					return
				}
			},
			async fetchCities(provinceId) {
				try {
					const response = await api.citytree(provinceId);
					if (response.code === 200 && Array.isArray(response.data)) {
						return response.data;
					} else {
						console.error('No cities data found');
						return [];
					}
				} catch (error) {
					// console.error('Failed to fetch cities:', error);
					return [];
				}
			},
			async fetchAreas(cityId) {
				try {
					const response = await api.citytree(cityId);
					if (response.code === 200 && Array.isArray(response.data)) {
						return response.data;
					} else {
						console.error('No areas data found');
						return [];
					}
				} catch (error) {
					console.error('Failed to fetch areas:', error);
					return [];
				}
			}
		}
	};
</script>

<style lang="scss">
	/deep/ .uni-forms-item__label {
		font-size: 30rpx;
		width: auto !important;

	}
	/deep/ .uni-forms-item{
		// background-color: red;
	}
	/deep/ .distraction {
		font-size: 30rpx !important;
	}

	.purchase-container {
		padding: 12rpx 24rpx 80rpx;
		background: #f8f8f8;
		min-height: 100vh;
		box-sizing: border-box;

		/* 区块样式 */
		.section {
			margin-bottom: 24rpx;
			background: #fff;
			border-radius: 16rpx;
			padding: 0 24rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);

			/* 区块标题 */
			.uni-section__header {
				padding: 28rpx 0 12rpx;

				.uni-section__content-title {
					font-size: 32rpx !important;
					font-weight: 600;
					color: #333;
				}
			}
		}

		/* 表单项 */
		.uni-forms-item {
			padding: 28rpx 0;
			border-bottom: 1rpx solid #eee;

			&:last-child {
				border-bottom: none;
			}

			/* 标签样式 */
			.uni-forms-item__label {
				width: 160rpx !important;
				font-size: 28rpx !important;
				color: #666 !important;
				padding-right: 24rpx;
			}

			/* 输入框 */
			.uni-easyinput {
				flex: 1;

				&__content {
					min-height: 80rpx !important;

					input,
					textarea {
						font-size: 28rpx !important;
						color: #333;
					}

					/* 聚焦状态 */
					&--focus {
						border-color: #007AFF !important;
					}
				}
			}

			/* 日期选择器 */
			.uni-datetime-picker {
				flex: 1;

				.uni-datetime-picker__input {
					font-size: 28rpx !important;
				}
			}
		}

		/* 采购量输入布局 */
		.quantity-input {
			display: flex;
			gap: 20rpx;

			.uni-easyinput {
				flex: 2;
			}

			.unit-select {
				flex: 1;

				/deep/ .uni-select__input-text {
					font-size: 28rpx !important;
				}
			}
		}

		/* 地址选择器 */
		.compact-picker {
			// background-color: red;
			margin:10rpx 0 10rpx 10rpx;
			// width: 100%;
			// padding: 24rpx 0;
			font-size: 30rpx;
			// color: #333;

			// .separator {
			// 	color: #999;
			// 	margin: 0 12rpx;
			// }

			// uni-icons {
			// 	margin-left: auto;
			// }
		}

		/* 提交按钮 */
		button[type=primary] {
			position: fixed;
			bottom: 32rpx;
			left: 24rpx;
			right: 24rpx;
			height: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			border-radius: 44rpx;
			background: #007AFF;
			box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.3);
		}
	}
</style>