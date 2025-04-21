<template>
	<view class="container">
		<view class="header">
			<text class="title">铺面招租</text>
			<text class="subtitle">信息发布</text>
		</view>

		<scroll-view class="form-container" scroll-y>
			<view class="form-card">
				<view class="card-title">
					<text>位置信息</text>
				</view>
				
				所在地区
				<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
					@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
					<view class="picker-text">
						{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }}
						-{{ selectedCountry === 'overseas' ? '' : multiArray[2][multiIndex[2]] }}
					</view>
				</picker>
				
				菜市场
				<picker class="picker" mode="selector" :range="displayMarketList" :value="selectedMarketIndex"
					@change="bindMarketChange">
					<view class="picker-text">{{ displayMarketList[selectedMarketIndex] }}</view>
				</picker>
				<!-- <view class="input-group">
          <input 
            v-model="form.address" 
            placeholder="请输入详细地址"
            class="modern-input"
            placeholder-class="placeholder"
          />
          <image src="/static/icon-edit.png" class="input-icon" />
        </view> -->
			</view>

			<view class="form-card grid">
				<view class="grid-item">
					<text class="input-label">建筑面积 (m²)</text>
					<view class="input-group">
						<input v-model="form.area" type="number" placeholder="0" class="modern-input" />
						<text class="unit">m²</text>
					</view>
				</view>
				<view class="divider"></view>
				<view class="grid-item">
					<text class="input-label">租金价格</text>
					<view class="input-group">
						<input v-model="form.price" type="number" placeholder="0" class="modern-input" />
						<text class="unit">元/月</text>
					</view>
				</view>
			</view>

			<view class="form-card">
				<text class="card-title">租期要求</text>
				<view class="duration-picker">
					<view v-for="(item,index) in leaseTerms" :key="index"
						:class="['duration-item', activeTerm === index ? 'active' : '']" @click="activeTerm = index">
						{{ item }}
					</view>
				</view>
			</view>

			<view class="form-card">
				<text class="card-title">配套设施</text>
				<view class="facility-grid">
					<view v-for="(item,index) in facilities" :key="index"
						:class="['facility-item', item.checked ? 'active' : '']" @click="toggleFacility(index)">
						<image :src="item.checked ? item.activeIcon : item.icon" class="facility-icon" />
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>

			<view class="form-card">
				<text class="card-title">铺面照片</text>
				<view class="upload-container">
					<uni-file-picker limit="9" fileMediatype="image" class="modern-uploader">
						<view class="upload-card">
							<image src="/static/icon-camera.png" class="upload-icon" />
							<text class="upload-text">点击上传照片</text>
						</view>
					</uni-file-picker>
				</view>
			</view>

			<view class="form-card">
				<text class="card-title">详细信息</text>
				<textarea v-model="form.details" placeholder="描述铺面特色（如层高、结构、周边环境等）" class="modern-textarea"
					placeholder-class="placeholder" />
			</view>
		</scroll-view>
		<view class="footer">
			<button class="submit-btn" @click="submitForm">
				<text>立即发布</text>
				<image src="/static/icon-rocket.png" class="btn-icon" />
			</button>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	export default {
		data() {
			return {
				multiArray: [
					[],
					[],
					[],
				],
				marketList:[],
				selectedMarketIndex: 0,
				selectedCountry: 'china',
				multiIndex: [0, 0, 0],
				activeTerm: 0,
				leaseTerms: ['12个月', '24个月', '36个月'],
				facilities: [{
						name: '供水',
						value: 'water',
						icon: '/static/icon-water.png',
						activeIcon: '/static/icon-water-active.png',
						checked: false
					},
					{
						name: '供电',
						value: 'electric',
						icon: '/static/icon-electric.png',
						activeIcon: '/static/icon-electric-active.png',
						checked: false
					},
					{
						name: '排水',
						value: 'drain',
						icon: '/static/icon-drain.png',
						activeIcon: '/static/icon-drain-active.png',
						checked: false
					},
					{
						name: '空调',
						value: 'ac',
						icon: '/static/icon-ac.png',
						activeIcon: '/static/icon-ac-active.png',
						checked: false
					}
				],
				form: {
					address: '',
					area: '',
					price: '',
					details: ''
				},
				
			}
		},
		computed:{
			displayMarketList() {
				return this.selectedCountry === 'china' ? this.marketList : ['暂时还没有数据'];
			}
		},
		async mounted() {
			await this.initializePicker(); // 组件加载时初始化数据
		},
		methods: {
			bindMarketChange(e) {
				this.selectedMarketIndex = e.detail.value;
				const selectedMarket = this.marketList[this.selectedMarketIndex];
				this.market_id = this.marketIdMap[selectedMarket] || null;
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
			async fetchOverseas() {
				try {
					const response = await api.countrylist(0, 200, 1);
					if (response.code === 200) {
						this.overseasCountries = response.data.listdata;
						this.multiArray[0] = this.overseasCountries.map(c => c.shortname);
						this.multiArray[1] = [];
						this.multiArray[2] = [];
						this.multiIndex = [0, 0, 0];
						return this.overseasCountries;
					} else {
						throw new Error('Failed to fetch overseas continents');
					}
				} catch (error) {
					console.error('Failed to fetch overseas continents:', error);
					throw error;
				}
			},
			
			// 菜市场
			async fetchMarkets(areaId) {
				try {
					const Limit = 100;
					const response = await api.marketlist(areaId, Limit);
					if (response.code === 200 && Array.isArray(response.data.listdata)) {
						this.marketList = response.data.listdata.map(item => item.marketname);
						this.marketIdMap = response.data.listdata.reduce((map, item) => {
							map[item.marketname] = item.id;
							return map;
						}, {});
					} else {
						console.error('No market data found');
						this.marketList = [];
						this.marketIdMap = {};
					}
				} catch (error) {
					console.error('Failed to fetch markets:', error);
					this.marketList = [];
					this.marketIdMap = {};
				}
			},

			// 默认选中海南省定安县塔岭市场
			async initializePicker() {
				try {
					if (this.selectedCountry === 'china') {
						const provinces = await this.fetchProvinces();
						this.multiArray[0] = provinces.map(item => item.name);
						if (provinces.length > 0) {



							// const cities = await this.fetchCities(provinces[0].id);
							const cities = await this.fetchCities(provinces[20].id);



							this.multiArray[1] = cities.map(item => item.name);
							if (cities.length > 0) {
								const areas = await this.fetchAreas(2306);

								this.multiArray[2] = areas.map(item => item.name);
							}
						}
						this.multiIndex = [20, 3, 6];


					} else if (this.selectedCountry === 'overseas') {
						const countries = await this.fetchOverseas();
						this.multiArray[0] = countries.map(c => c.shortname);
						this.multiArray[1] = [];
						this.multiArray[2] = [];
						this.multiIndex = [0, 0, 0];
					}
				} catch (error) {
					console.error('Failed to initialize picker:', error);
				}
				this.fetchMarkets(2313)
				this.selectedMarketIndex = 1
			},

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
				this.multiIndex = e.detail.value;
				if (this.selectedCountry === 'china') {
					const selectedCityIndex = this.multiIndex[1];
					const selectedCityId = this.cityList[selectedCityIndex]?.id || null;
					if (selectedCityId) {
						await this.fetchAreas(selectedCityId);
						this.area_id = this.districtList[this.multiIndex[2]]?.id || null;
						await this.fetchMarkets(this.area_id);
					}
				} else if (this.selectedCountry === 'overseas') {
					const selectedCountryIndex = this.multiIndex[0];
					this.overseasCountryId = this.overseasCountries[selectedCountryIndex]?.id || null;
					const selectedCityIndex = this.multiIndex[1];
					if (this.overseasCountryId) {
						await this.fetchOverseasCities(this.overseasCountryId);
						this.overseasCityId = this.overseasCities[selectedCityIndex]?.id || null;
					}
				}
			},
			toggleFacility(index) {
				this.facilities[index].checked = !this.facilities[index].checked
			},
			submitForm() {
				// 提交逻辑
			}
		}
	}
</script>

<style lang="scss">
	.picker {
		height: 150rpx;
		width: 100%;
		color: black;
		line-height: 150rpx;
		text-align: center;
		box-sizing: border-box;
		font-size: 30rpx;
		padding: 0 10rpx;
		overflow: hidden;
		/* 隐藏超出部分 */
	}

	/* 基础样式 */
	$primary-color: #2B6FF3;
	$secondary-color: #8E9AB5;
	$success-color: #4CAF50;

	.container {
		background: #F5F7FA;
		min-height: 100vh;
		padding: 40rpx 32rpx;
	}

	/* 头部样式 */
	.header {
		margin-bottom: 60rpx;

		.title {
			font-size: 48rpx;
			font-weight: 700;
			color: #1A2945;
		}

		.subtitle {
			font-size: 32rpx;
			color: $secondary-color;
		}
	}

	/* 表单卡片 */
	.form-card {
		background: white;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(43, 111, 243, 0.08);

		.card-title {
			font-size: 36rpx;
			color: #1A2945;
			margin-bottom: 40rpx;
			display: flex;
			align-items: center;

			.icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 16rpx;
			}
		}
	}

	/* 输入组件 */
	.modern-input {
		height: 96rpx;
		padding: 0 32rpx;
		font-size: 32rpx;
		background: #F8F9FC;
		border-radius: 16rpx;
		color: #1A2945;
	}

	.input-group {
		position: relative;

		.unit {
			position: absolute;
			right: 32rpx;
			top: 50%;
			transform: translateY(-50%);
			color: $secondary-color;
		}

		.input-icon {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			right: 32rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	/* 双列布局 */
	.grid {
		display: flex;
		gap: 32rpx;

		.grid-item {
			flex: 1;
		}

		.divider {
			width: 2rpx;
			background: #EEE;
		}
	}

	/* 租期选择 */
	.duration-picker {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;

		.duration-item {
			height: 96rpx;
			border-radius: 16rpx;
			background: #F8F9FC;
			display: flex;
			align-items: center;
			justify-content: center;
			color: $secondary-color;
			transition: all 0.2s;

			&.active {
				background: $primary-color;
				color: white;
				font-weight: 500;
			}
		}
	}

	/* 设施选择 */
	.facility-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 32rpx;

		.facility-item {
			height: 140rpx;
			border: 2rpx solid #EEE;
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&.active {
				border-color: $primary-color;
				background: rgba($primary-color, 0.05);
			}

			.facility-icon {
				width: 64rpx;
				height: 64rpx;
				margin-bottom: 16rpx;
			}
		}
	}

	/* 上传组件 */
	.upload-container {
		border: 2rpx dashed #EEE;
		border-radius: 16rpx;

		.upload-card {
			height: 200rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.upload-icon {
				width: 64rpx;
				height: 64rpx;
				margin-bottom: 16rpx;
			}
		}
	}

	/* 文本域 */
	.modern-textarea {
		width: 95%;
		min-height: 200rpx;
		padding: 32rpx;
		background: #F8F9FC;
		border-radius: 16rpx;
		font-size: 32rpx;
	}

	/* 底部按钮 */
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%);
		padding: 32rpx;

		.submit-btn {
			height: 96rpx;
			background: linear-gradient(90deg, $primary-color 0%, #5A8BFF 100%);
			border-radius: 64rpx;
			color: white;
			font-size: 36rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 12rpx 24rpx rgba(43, 111, 243, 0.3);

			.btn-icon {
				width: 48rpx;
				height: 48rpx;
				margin-left: 16rpx;
			}
		}
	}

	/* 占位符样式 */
	.placeholder {
		color: #C3CAD9 !important;
		font-size: 32rpx !important;
	}
</style>