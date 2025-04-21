<template>
	<view class="me-container">
		<view class="top">
			乡愁宝大市场
		</view>
		<view class="region">
			<view class="nation">
				<view class="china" :class="{ active: selectedCountry === 'china' }" @click="selectCountry('china')">中国
				</view>
				<view class="overseas" :class="{ active: selectedCountry === 'overseas' }"
					@click="selectCountry('overseas')">海外</view>
			</view>
			<view class="area">
				<text>所在的地区</text>
				<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
					@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
					<view class="picker-text">
						{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }} -{{ selectedCountry === 'overseas' ? '' : multiArray[2][multiIndex[2]] }}
					</view>
				</picker>
			</view>
			<view class="Address">
				<text>选择菜市场</text>
				<picker class="picker" mode="selector" :range="displayMarketList" :value="selectedMarketIndex"
					@change="bindMarketChange">
					<view class="picker-text">{{ displayMarketList[selectedMarketIndex] }}</view>
				</picker>
			</view>
			<button class="save" @click="saveData">立即逛</button>
		</view>
		
		<view class="notice">
			<view class="nleft">
				<uni-icons type="sound-filled" size="20" color="#007aff"></uni-icons>
				<text class="ntext">公告</text>
			</view>
			<view class="ncen">
				<swiper class="swiper" vertical autoplay interval="2000" duration="500" circular>
					<swiper-item class="swiitem" v-for="item in NoticeList" @click="goTorules(item)">{{item}}</swiper-item>
				</swiper>
			</view>
			<view class="nrig">
				<uni-icons type="right" size="16" color="#333"></uni-icons>
			</view>
		</view>
		<view class="Notice">
			<view>今日打卡人次：{{signTotalData.todaynum}} <br>累计打卡人次：{{signTotalData.allnum}}</view>
			<button @click="goToJackpot" style="margin-top: 10rpx; font-size: 30rpx; color: #ff3030;">查看摇号结果</button>
		</view>
		
		

	</view>
</template>

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
				NoticeList:['赠送积分说明'],
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
				signTotalData:{
				}
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
				return this.selectedCountry === 'china' ? this.marketList : ['暂时还没有数据'];
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
			goToJackpot(){
				uni.navigateTo({
					url:"/pages/jackpot/jackpot"
				})
			},
			...mapMutations('location', ['setStatus']),
			
			goTorules(item) {
				console.log(item)
				switch (item){
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
				const savedData = {
					multiIndex: this.multiIndex,
					area_id: this.area_id,
					market_id: this.marketIdMap[this.displayMarketList[this.selectedMarketIndex]],
					selectedMarketIndex: this.selectedMarketIndex,
					marketName:this.displayMarketList[this.selectedMarketIndex]
				};
				
				
				this.setStatus()
				// console.log(this.displayMarketList[this.selectedMarketIndex])
				// console.log('Saving data:', savedData); // 这行可以帮助你调试
				uni.setStorageSync('userSelection', savedData);
				uni.showToast({
					title: '正在加载',
					icon: 'success'
				});
				uni.switchTab({
					url: '/pages/index/index',
				});

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






<style>
	.Notice {
		margin: 50rpx;
		text-align: center;
		color: black;
	}
	.notice {
		margin-top: 20rpx;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: white;
		margin: 20rpx auto;
		border-radius: 80rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 0 20rpx;
	}
	
	.nlef {
		width: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.ntext {
		color: #007aff;
		font-weight: 600;
		font-size: 28rpx;
	}
	
	.nrig {
		width: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.ncen {
		height: 100%;
		flex: 1;
	}
	
	.swiper {
		height: 100%;
		/* background-color: #007aff; */
	}
	
	.swiitem {
		height: 100%;
		text-align: center;
		font-size: 30rpx;
		color: #666;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.dishes {
		display: flex;
		flex-direction: column;
		margin-bottom: 180rpx;
	}
	
	.dishes>text {
		color: black;
		font-size: 30rpx;
		font-weight: 600;
	}
	.me-container {
		overflow-x: hidden;
		height: 100vh;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 40rpx 0 40rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.me-container::after {
		content: "";
		width: 140%;
		height: 200px;
		position: absolute;
		left: -20%;
		top: 0;
		z-index: -1;
		border-radius: 0 0 50% 50%;
		background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
	}

	.top {	
		margin: 10% auto;
		position: absolute;
		font-size: 100rpx;
		font-weight: bold;
		text-align: center;
		/*字体粗细*/
		/* -webkit-text-stroke: 1px #aa55ff; */
		-webkit-text-stroke: 1px white;
		/*描边*/
		-webkit-text-fill-color: transparent;
		margin-top: 150rpx;
	}

	.region {
		width: 650rpx;
		height: 520rpx;
		/* margin: auto auto; */
		margin-top: 300rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* align-items: center;	 */
		background: rgba(255, 255, 255, 1);
		/* background-color: white; */
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		backdrop-filter: blur(13.5px);
		-webkit-backdrop-filter: blur(13.5px);
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.18);
	}

	.nation {
		height: 100rpx;
		width: 100%;
		text-align: center;
		line-height: 100rpx;
		display: flex;
		flex-direction: row;
		/* background-color: darkred; */
		border-bottom: 1px solid #ccc;
		color: black;
	}

	.china {
		flex: 1;
		border-right: 1px solid #ccc;
		cursor: pointer;
		transition: all 0.3s;
	}

	.overseas {
		flex: 1;
		cursor: pointer;
		transition: all 0.3s;
	}

	.active {
		font-weight: bold;
		border-bottom: 2px solid #007aff;
	}

	.area {
		height: 150rpx;
		display: flex;
		flex-direction: row;
		/* justify-content: space-between; */
		align-items: center;
		/* margin: 0 20rpx; */
		/* padding: 0 20rpx; */
		/* margin-top: 30rpx; */
		border-bottom: 1px solid #ccc;
		/* background-color: white; */
	}

	.area>text {
		height: 150rpx;
		width: 200rpx;
		line-height: 150rpx;
		text-align: left;
		color: black;
		font-size: 28rpx;
		box-sizing: border-box;
		border-right: 1px solid #ccc;
		/* background-color: antiquewhite; */
	}

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

	.picker-text {
		white-space: nowrap;
		/* 禁止换行 */
		overflow: hidden;
		/* 隐藏超出部分 */
		text-overflow: ellipsis;
		/* 超出部分显示省略号 */
		line-height: 150rpx;
		text-align: center;
		box-sizing: border-box;
		font-size: 30rpx;
		padding: 0 10rpx;
	}

	.Address {
		height: 150rpx;
		display: flex;
		flex-direction: row;
		/* justify-content: space-between; */
		align-items: center;
		/* margin: 0 20rpx; */
		/* padding: 0 20rpx; */
		border-bottom: 1px solid #ccc;
		/* background-color: red; */
	}

	.Address>text {
		height: 150rpx;
		width: 200rpx;
		line-height: 150rpx;
		text-align: left;
		color: black;
		font-size: 28rpx;
		box-sizing: border-box;
		border-right: 1px solid #ccc;
		/* background-color: yellow; */
	}

	.save {
		background: transparent;
		border: none;
		color: white;
		font-size: 34rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 20 rpx;
		background-color: #007aff;
		margin: auto 10rpx;
	}
</style>