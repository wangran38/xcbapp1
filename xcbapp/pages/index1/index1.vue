<template>
	<view class="me-container">
		<view class="brand-header">
			<view class="brand-title">农链天下</view>
			<view class="brand-subtitle">连接城乡 · 悦享农鲜</view>
		</view>

		<view class="region-card">
			<view class="nation-tabs">
				<view class="tab-item" :class="{ active: selectedCountry === 'china' }" @click="selectCountry('china')">
					<text>中国</text>
					<view class="active-line"></view>
				</view>
				<view class="tab-item" :class="{ active: selectedCountry === 'overseas' }"
					@click="selectCountry('overseas')">
					<text>海外</text>
					<view class="active-line"></view>
				</view>
			</view>

			<view class="picker-group">
				<view class="input-row">
					<view class="label">
						<uni-icons type="location-filled" size="18" color="#ff4d4f" />
						<text>所在地区</text>
					</view>
					<picker class="main-picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
						@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
						<view class="picker-content">
							<text class="value-text">
								{{ multiArray[0][multiIndex[0]] || '请选择' }}
								<block v-if="multiArray[1][multiIndex[1]]"> / {{ multiArray[1][multiIndex[1]] }}</block>
								<block v-if="selectedCountry !== 'overseas' && multiArray[2][multiIndex[2]]"> /
									{{ multiArray[2][multiIndex[2]] }}</block>
							</text>
							<uni-icons type="right" size="14" color="#ccc" />
						</view>
					</picker>
				</view>

				<view class="input-row">
					<view class="label">
						<uni-icons type="shop-filled" size="18" color="#ff4d4f" />
						<text>目标市场</text>
					</view>
					<picker class="main-picker" mode="selector" :range="displayMarketList" :value="selectedMarketIndex"
						@change="bindMarketChange">
						<view class="picker-content">
							<text class="value-text">{{ displayMarketList[selectedMarketIndex] || '请选择菜市场' }}</text>
							<uni-icons type="right" size="14" color="#ccc" />
						</view>
					</picker>
				</view>
			</view>

			<view class="action-bar">
				<button class="save-btn" @click="saveData">
					<text>立即逛</text>
				</button>
			</view>
		</view>

		<view class="footer-tips">
			<view class="tip-item">
				<uni-icons type="checkmark-circle" size="14" color="#52c41a" />
				<text>溯源品质保障</text>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.me-container {
		min-height: 100vh;
		background-color: #fcfcfc;
		background-image:
			radial-gradient(at 0% 0%, rgba(255, 77, 79, 0.05) 0px, transparent 50%),
			radial-gradient(at 100% 0%, rgba(24, 144, 255, 0.05) 0px, transparent 50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 40rpx;
	}

	/* 顶部品牌感 */
	.brand-header {
		margin-top: 120rpx;
		text-align: center;

		.brand-title {
			font-size: 88rpx;
			font-weight: 900;
			background: linear-gradient(135deg, #333 0%, #666 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			letter-spacing: 4rpx;
		}

		.brand-subtitle {
			font-size: 26rpx;
			color: #999;
			letter-spacing: 10rpx;
			margin-top: 10rpx;
			text-transform: uppercase;
		}
	}

	/* 核心卡片布局 */
	.region-card {
		width: 100%;
		margin-top: 80rpx;
		background: #ffffff;
		border-radius: 40rpx;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.06);
		padding: 40rpx;
		box-sizing: border-box;
	}

	/* 选项卡切换 */
	.nation-tabs {
		display: flex;
		margin-bottom: 40rpx;
		border-bottom: 1rpx solid #f0f0f0;

		.tab-item {
			flex: 1;
			padding: 20rpx 0;
			text-align: center;
			position: relative;

			text {
				font-size: 32rpx;
				color: #999;
				transition: all 0.3s;
			}

			.active-line {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 0;
				height: 6rpx;
				background: #ff4d4f;
				border-radius: 4rpx;
				transition: all 0.3s;
			}

			&.active {
				text {
					color: #333;
					font-weight: bold;
					font-size: 34rpx;
				}

				.active-line {
					width: 60rpx;
				}
			}
		}
	}

	/* 输入行样式 */
	.picker-group {
		.input-row {
			margin-bottom: 40rpx;

			.label {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				text {
					font-size: 28rpx;
					color: #666;
					margin-left: 10rpx;
					font-weight: 500;
				}
			}

			.main-picker {
				background: #f7f8fa;
				border-radius: 20rpx;
				height: 100rpx;

				.picker-content {
					height: 100rpx;
					padding: 0 30rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.value-text {
						font-size: 30rpx;
						color: #333;
						font-weight: 500;
						flex: 1;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}

	/* 按钮样式 */
	.action-bar {
		margin-top: 60rpx;

		.save-btn {
			background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%);
			color: #fff;
			height: 110rpx;
			line-height: 110rpx;
			border-radius: 55rpx;
			font-size: 34rpx;
			font-weight: bold;
			border: none;
			box-shadow: 0 10rpx 30rpx rgba(255, 77, 79, 0.3);
			display: flex;
			align-items: center;
			justify-content: center;

			&:active {
				transform: scale(0.98);
				opacity: 0.9;
			}
		}
	}

	/* 底部小字 */
	.footer-tips {
		margin-top: 60rpx;
		display: flex;
		gap: 40rpx;

		.tip-item {
			display: flex;
			align-items: center;

			text {
				font-size: 24rpx;
				color: #bbb;
				margin-left: 8rpx;
			}
		}
	}
</style>

<script>
	import {
		api
	} from '@/api/index.js';
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				NoticeList: ['赠送积分说明'],
				selectedCountry: 'china',
				multiArray: [
					[],
					[],
					[]
				],
				multiIndex: [0, 0, 0],
				provinceList: [],
				cityList: [],
				districtList: [],
				marketList: [],
				marketIdMap: {},
				selectedMarketIndex: 0,
				area_id: null,
				market_id: null,
				overseasCountries: [],
				overseasCities: [],
				overseasCountryId: null,
				overseasCityId: null,
				signTotalData: {}
				// marketName:'' // 市场名
			};
		},
		computed: {
			displayArray() {
				if (this.selectedCountry === 'china') {
					return [this.multiArray[0], this.multiArray[1], this.multiArray[2]];
				} else {
					return [this.multiArray[0], this.multiArray[1],
						[]
					];
				}
			},
			displayMarketList() {
				return this.selectedCountry === 'china' ? this.marketList : ['暂无数据'];
			}
		},
		watch: {
			selectedCountry(newCountry) {
				this.selectCountry(newCountry);
			}
		},
		async mounted() {

			await this.initializePicker(); // 组件加载时初始化数据
			let res = await api.signTotal()
			this.signTotalData = res.data


		},
		methods: {

			gotodemo() {
				uni.navigateTo({
					url: "/pages/demo/demo"
				})
			},
			goToJackpot() {
				uni.navigateTo({
					url: "/pages/jackpot/jackpot"
				})
			},
			...mapMutations('location', ['setStatus']),

			goTorules(item) {
				console.log(item)
				switch (item) {
					case '赠送积分说明':
						uni.navigateTo({
							url: '/pages/rules/rules'
						});
						break;
					case '关于春节放假通知':
						uni.navigateTo({
							url: '/pages/arrangeNotification/arrangeNotification'
						});

						break;
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
				// console.log(this.multiArray, this.multiIndex)
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
			async fetchOverseasCities(continentId) {
				try {
					const response = await api.countrylist(continentId, 100, 1);
					if (response.code === 200) {
						this.overseasCities = response.data.listdata;
						this.multiArray[1] = this.overseasCities.map(c => c.shortname);
						this.multiArray[2] = [];
						this.multiIndex[1] = 0;
						this.multiIndex[2] = 0;
						return this.overseasCities;
					} else {
						throw new Error('Failed to fetch overseas countries');
					}
				} catch (error) {
					console.error('Failed to fetch overseas countries:', error);
					throw error;
				}
			},
			async selectCountry(country) {
				this.selectedCountry = country;
				this.multiArray = [
					[],
					[],
					[]
				];
				this.marketList = [];
				this.selectedMarketIndex = 0;
				this.area_id = null;
				this.market_id = null;

				if (country === 'china') {
					await this.initializePicker();
				} else if (country === 'overseas') {
					await this.fetchOverseas();
				}
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
			async fetchMarkets(areaId) {
				// console.log('请求市场数据的 areaId:', areaId); // 确认 areaId 是否正确
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
			bindMarketChange(e) {
				this.selectedMarketIndex = e.detail.value;
				const selectedMarket = this.marketList[this.selectedMarketIndex];
				this.market_id = this.marketIdMap[selectedMarket] || null;
			},


			saveData() {
				// console.log(this.selectedCountry,this.market_id,"这是校验数据")
				// if (this.selectedCountry === 'china' && !this.market_id) {
				// 	return uni.showToast({
				// 		title: '请先选择所在地区和市场',
				// 		icon: 'none'
				// 	});
				// }

				const savedData = {
					area_id: this.area_id,
					market_id: this.market_id,
					marketName: this.displayMarketList[this.selectedMarketIndex],
					country: this.selectedCountry
				};

				uni.setStorageSync('userSelection', savedData);
				uni.showToast({
					title: '加载中',
					icon: 'loading'
				});

				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}, 500);
			},

			loadSavedData() {
				// 加载保存的数据
				const savedData = uni.getStorageSync('userSelection');
				if (savedData) {
					this.multiIndex = savedData.multiIndex || [0, 0, 0];
					this.area_id = savedData.area_id || null;
					this.market_id = savedData.market_id || null;
					this.selectedMarketIndex = savedData.selectedMarketIndex || 0;

					// 重新初始化选择器数据
					this.initializePicker().then(() => {
						if (this.area_id && this.selectedCountry === 'china') {
							this.fetchMarkets(this.area_id);
						}
					});
				} else {
					// 如果没有保存的数据，初始化选择器
					this.initializePicker();
				}

			},

		}
	};
</script>