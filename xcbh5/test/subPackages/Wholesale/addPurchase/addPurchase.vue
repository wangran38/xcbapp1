<template>
	<view class="purchase-container">
		<uni-forms ref="form">
			<view class="section">
				<uni-section title="采购明细" type="line"></uni-section>
				<uni-forms-item label="商品名称" required name="infotitle">
					<uni-easyinput v-model="formData.infotitle" placeholder="请输入商品名称" @focus="showGoodsPicker = true" />

					<uni-popup ref="goodsPopup" type="dialog">
						<goods-picker @select="handleGoodsSelect" />
					</uni-popup>
				</uni-forms-item>

				<uni-forms-item label="采购量" required name="quantity">
					<view class="quantity-input">
						<uni-easyinput type="number" v-model.number="formData.infonumber" placeholder="请输入数量" />
						<uni-data-select v-model="formData.unit" :localdata="units" class="unit-select"
							placeholder="单位" />
					</view>
				</uni-forms-item>

				<uni-forms-item label="采购要求" name="requirements">
					<uni-easyinput type="textarea" v-model="formData.content" placeholder="请输入规格、材质等要求"
						:maxlength="500" />
				</uni-forms-item>


				<uni-forms-item  label="收货地址" required name="deliveryAddress"
					class="range-picker">
					<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
						@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
						<view style="font-size: 25rpx;">
							{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }}
							-{{ selectedCountry === 'overseas' ? '' : multiArray[2][multiIndex[2]] }}
						</view>
					</picker>
				</uni-forms-item>

				<uni-forms-item label="详细地址" name="byaddress">
					<uni-easyinput v-model="formData.byaddress" placeholder="请输入详细地址" />
				</uni-forms-item>
				<uni-forms-item label="报价截止" required name="stoptime">
					<uni-datetime-picker type="date" v-model="formData.stoptime" :start="today"
						return-type="timestamp" />
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
	import {
		myMixin
	} from '@/utils/public.js'

	export default {
		mixins: [myMixin],
		data() {
			const today = Date.now();

			return {
				multiArray: [
					[],
					[],
					[]
				],
				selectedCountry: 'china',
				multiIndex: [0, 0, 0],
				formData: {
					infotitle: '', // 商品名称
					infonumber: null, // 采购量
					unit: null, // 采购量
					stoptime: '', // 截至时间
					// deliveryStart: '',
					// deliveryEnd: '',
					// deliveryAddress: [],
					byaddress: '', // 求购商品的指定货源地
					buyaddress: '', // 求购商品物流地址
					area_id: null,
					content: ''
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
				districtList: [],
				today,
			};
		},
		mounted() {
			this.initializePicker();
		},
		options: {
			stylelsolation: 'shared'
		},
		methods: {
			async bindMultiPickerColumnChange(e) {
				const column = e.detail.column;
				const value = e.detail.value;

				if (this.selectedCountry === 'china') {
					if (column === 0) {
						const selectedProvince = this.provinceList[value];
						if (selectedProvince && selectedProvince.id !== undefined) {
							const cities = await this.fetchCities(selectedProvince.id);
							this.multiArray[1] = cities.map(item => item.name);
							if (cities.length > 0) {
								const areas = await this.fetchAreas(cities[0].id);
								this.multiArray[2] = areas.map(item => item.name);
							} else {
								this.multiArray[2] = [];
							}
						}
						this.multiIndex[1] = 0;
						this.multiIndex[2] = 0;
					} else if (column === 1) {
						const selectedCity = this.cityList[value];
						if (selectedCity && selectedCity.id !== undefined) {
							const areas = await this.fetchAreas(selectedCity.id);
							this.multiArray[2] = areas.map(item => item.name);
						} else {
							this.multiArray[2] = [];
						}
						this.multiIndex[2] = 0;
					}
				} else if (this.selectedCountry === 'overseas') {
					if (column === 0) {
						const selectedContinent = this.overseasCountries[value];
						if (selectedContinent && selectedContinent.id !== undefined) {
							await this.fetchOverseasCities(selectedContinent.id);
						}
						this.multiArray[2] = [];
						this.multiIndex[1] = 0;
						this.multiIndex[2] = 0;
					} else if (column === 1) {
						this.multiArray[2] = [];
						this.multiIndex[2] = 0;
					}
				}

				this.multiIndex[column] = value;
				this.multiIndex = [...this.multiIndex];
			},

			async bindMultiPickerChange(e) {
				// this.multiIndex = e.detail.value;
				this.formData.area_id = this.districtList[this.multiIndex[2]]['id']
				// if (this.selectedCountry === 'china') {
				// 	const selectedCityIndex = this.multiIndex[1];
				// 	const selectedCityId = this.cityList[selectedCityIndex]?.id || null;
				// 	if (selectedCityId) {
				// 		await this.fetchAreas(selectedCityId);
				// 		this.area_id = this.districtList[this.multiIndex[2]]?.id || null;
				// 		await this.fetchMarkets(this.area_id);
				// 	}
				// } else if (this.selectedCountry === 'overseas') {
				// 	const selectedCountryIndex = this.multiIndex[0];
				// 	this.overseasCountryId = this.overseasCountries[selectedCountryIndex]?.id || null;
				// 	const selectedCityIndex = this.multiIndex[1];
				// 	if (this.overseasCountryId) {
				// 		await this.fetchOverseasCities(this.overseasCountryId);
				// 		this.overseasCityId = this.overseasCities[selectedCityIndex]?.id || null;
				// 	}
				// }
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
			async fetchCities(provinceId) {
				try {
					const response = await api.citytree(provinceId);
					if (response.code === 200 && Array.isArray(response.data)) {
						this.cityList = response.data;
						return response.data;
					} else {
						console.error('No cities data found');
						return [];
					}
				} catch (error) {
					console.error('Failed to fetch cities:', error);
					return [];
				}
			},
			async fetchAreas(cityId) {
				try {
					const response = await api.citytree(cityId);
					if (response.code === 200 && Array.isArray(response.data)) {
						this.districtList = response.data;
						return response.data;
					} else {
						console.error('No areas data found');
						return [];
					}
				} catch (error) {
					console.error('Failed to fetch areas:', error);
					return [];
				}
			},

			async submitForm() {

				this.formData.buyaddress = this.multiArray[0][this.multiIndex[0]] + '-' + this.multiArray[1][this
					.multiIndex[1]
				] + '-' + this.multiArray[2][this.multiIndex[2]]
				console.log(this.formData)
				let data = await api.buyinfoAdd(this.formData)
				if (data.code != 200) {
					uni.showToast({
						icon: 'error',
						title: data.msg || data.message
					})

				} else {
					setTimeout(() => {
						this.customizeBack()
					}, 2000)
					uni.showToast({
						icon: 'success',
						title: data.msg || data.message
					})
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
					console.log(error)
				}
			},

		}
	};
</script>

<style lang="scss">

	/deep/ .uni-forms-item__label {
		font-size: 30rpx;
		width: auto !important;

	}

	/deep/ .uni-forms-item {
		align-items: center;
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
			margin: 10rpx 0 10rpx 10rpx;
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