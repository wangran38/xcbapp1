<template>
	<view class="container">
		<popVue ref="pop" @receive="over"></popVue>
		<view class="header">
			<view class="title">
				轻松三步，成为农户
				<view class="decorate-line"></view>
			</view>
		</view>

		<uni-steps :options="options" :active="active" class="steps" active-color="#00ff00"></uni-steps>

		<!-- 第一步：地区选择 -->
		<view class="step-content" v-show="active == 0">
			<view class="tip-text">
				<uni-icons type="info" size="16" color="#6C757D"></uni-icons>
				先选择自己所在的城市地区，申请成功后将展示在该地区的所有范围
			</view>

			<uni-card class="form-card">
				<view class="card-header">
					<text class="card-title">所在地区</text>
					<uni-icons type="location-filled" size="20" color="#4A6572"></uni-icons>
				</view>
				<picker class="area-picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
					@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
					<view class="picker-content">
						{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }}
						-{{ selectedCountry === 'overseas' ? '' : multiArray[2][multiIndex[2]] }}
						<uni-icons type="arrowright" size="18" color="#8E9BA6"></uni-icons>
					</view>
				</picker>
			</uni-card>
		</view>

		<!-- 第二步：用户信息 -->
		<view class="step-content" v-show="active == 1">
			<view class="tip-text">
				<uni-icons type="info" size="16" color="#6C757D"></uni-icons>
				请输入户主名称，选择您要卖的菜品所属分类，以及详细地址
			</view>

			<view class="form-section">
				<uni-card class="form-card">
					<!-- 户主名称 -->
					<view class="form-item">
						<text class="item-label">户主名称</text>
						<input class="input-box" v-model="userInfo.name" placeholder="请输入名称"
							placeholder-style="color:#ADB5BD" />
					</view>

					<!-- 分割线 -->
					<view class="divider"></view>

					<!-- 所售类目 -->
					<view class="form-item">
						<text class="item-label">所售类目</text>
						<picker class="category-picker" mode="selector" :range="categoryList"
							@change="bindCategoryChange">
							<view class="picker-content">
								{{ selectedCategory }}
								<uni-icons type="arrowright" size="18" color="#8E9BA6"></uni-icons>
							</view>
						</picker>
					</view>

					<!-- 分割线 -->
					<view class="divider"></view>

					<!-- 详细地址 -->
					<view class="form-item">
						<text class="item-label">详细地址</text>
						<input class="input-box" v-model="userInfo.location" placeholder="请输入地址"
							placeholder-style="color:#ADB5BD" @blur="seachAddress" />
					</view>
				</uni-card>
			</view>
		</view>

		<!-- 操作按钮 -->
		<button class="next-btn" @click="next">{{title}}</button>
	</view>
</template>

<style scoped>
	/* 整体容器 */
	.container {
		padding: 40rpx 32rpx;
		background: #F8F9FA;
		min-height: 100vh;
	}

	/* 头部样式 */
	.header {
		margin-bottom: 60rpx;
	}

	.title {
		font-size: 38rpx;
		color: black;
		font-weight: 500;
		position: relative;
		display: inline-block;
		letter-spacing: 1rpx;
	}

	.decorate-line {
		position: absolute;
		bottom: -12rpx;
		left: 0;
		width: 70%;
		height: 4rpx;
		background: rgba(58, 95, 124, 0.3);
		border-radius: 2rpx;
	}

	/* 步骤条样式 */
	.steps {
		margin-bottom: 60rpx;
	}

	/* 提示文本 */
	.tip-text {
		background: #EDF2F5;
		padding: 24rpx 32rpx;
		border-radius: 8rpx;
		color: #4A6572;
		font-size: 28rpx;
		margin-bottom: 40rpx;
		line-height: 1.6;
		display: flex;
		align-items: flex-start;
	}

	/* 表单卡片 */
	.form-card {
		border-radius: 12rpx;
		overflow: hidden;
		border: 1rpx solid #E9ECEF;
		background: #FFFFFF;
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.card-title {
		font-size: 32rpx;
		color: #2D3A4A;
		margin-right: 16rpx;
		font-weight: 500;
	}

	/* 选择器样式 */
	.area-picker,
	.category-picker {
		padding: 32rpx 0;
	}

	.picker-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;
		color: #4A6572;
		padding: 24rpx 0;
	}

	/* 表单项 */
	.form-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx 0;
	}

	.item-label {
		font-size: 30rpx;
		color: #4A6572;
		width: 160rpx;
		font-weight: 400;
	}

	.input-box {
		flex: 1;
		font-size: 30rpx;
		color: #2D3A4A;
		text-align: right;
		padding: 20rpx 0;
	}

	/* 分割线 */
	.divider {
		height: 1rpx;
		background: #E9ECEF;
		margin: 8rpx 0;
	}

	/* 下一步按钮 */
	.next-btn {
		position: fixed;
		bottom: 80rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #007aff;
		color: white;
		font-size: 32rpx;
		border-radius: 8rpx;
		transition: background 0.3s;
		border: none;
	}

	.next-btn:active {
		background: #2D4A5F;
	}
</style>

<script>
	import {
		api
	} from '../../api/index.js';
	import {
		mapMutations
	} from 'vuex';
	import popVue from './components/pop.vue';

	export default {
		data() {
			return {
				// options: [{
				// 	title: '创建摊位'
				// }, {
				// 	title: '用户信息'
				// }, {
				// 	title: '领取福利'
				// }, ]
				options: [{
					title: '创建摊位'
				}, {
					title: '用户信息'
				}, ],
				active: 0,
				categoryList: ['请选择分类'],
				selectedCategory: '请选择分类', // 分类
				userInfo: { // 用户信息
					name: null,
					location: null,
					index: null,
					lng: null,
					lat: null,
				},
				title: '下一步',
				lock: true, // 领取按钮锁


				selectedCountry: 'china',
				multiArray: [
					[],
					[],
					[]
				],
				multiIndex: [0, 0, 0],
				selectedMarketIndex: 0,
				area_id: 2313, // 默认是定安县
				market_id: null,
				overseasCountries: [],
				overseasCities: [],
				overseasCountryId: null,
				overseasCityId: null,

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
			this.fetchCategories()
		},
		components: {
			popVue
		},
		methods: {
			// 获取经纬度
			async seachAddress() {
				if (this.userInfo.location) {

					let res = await api.searchResolution({
						'address': this.userInfo.location
					})
					if (!res.error) {
						this.userInfo.lng = res.lng
						this.userInfo.lat = res.lat
					} else {
						uni.showToast({
							icon: 'error',
							title: '详细地址有误,获取不到经纬度'
						})
						this.userInfo.lng = 110.358001
						this.userInfo.lat = 19.681215
					}




				}

			},
			async customizeBack() {
				let canNavBack = await getCurrentPages()
				if (canNavBack && canNavBack.length > 1) {
					uni.navigateBack()
				} else {
					history.back();
				}
			},
			async over() {
				// 发送申请注册
				let res = await api.addfarmers({
					area_id: this.area_id,
					farmersname: this.userInfo.name,
					address: this.userInfo.location,
					category_id: this.userInfo.index,
					lng: this.userInfo.lng,
					lat: this.userInfo.lat
				})
				console.log(res)
				if (res.code == 200) {
					// this.title = '完成'
					uni.showToast({
						icon: 'success',
						title: '注册成功'
					}).then((data) => {
						setTimeout(() => {
							this.customizeBack()
						}, 2000)
					})
				} else {
					uni.showToast({
						icon: 'error',
						title: res.msg || res.message
					})
				}

			},
			register() {
				if (this.lock) {
					let pop = this.$refs.pop
					pop.show = true
					pop.custom()
					this.lock = false
				}
			},
			async fetchCategories() {
				try {
					const response = await api.cglist();
					if (response.code === 200) {
						const categories = response.data.listdata;
						this.categoryList = [...categories.map(item => item.title)];
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
			// 选择菜品
			bindCategoryChange(e) {
				const selectedIndex = e.detail.value;
				this.selectedCategory = this.categoryList[selectedIndex];
				this.category_id = this.categoryIdMap[this.selectedCategory]; // 设置分类ID
			},
			goToJackpot() {
				uni.navigateTo({
					url: "/pages/jackpot/jackpot"
				})
			},
			...mapMutations('location', ['setStatus']),



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

			// 下一步
			next() {
				switch (this.active) {
					case 0:
						this.active += 1
						this.title = '注册'
						break
					case 1:
						this.userInfo.index = this.categoryList.findIndex((item) => item == this.selectedCategory)
						if (this.userInfo.name && this.userInfo.location && this.userInfo.index != -1) {
							// this.active += 1
							this.over()
						} else {
							uni.showToast({
								icon: 'error',
								title: '请补充完整信息'
							})
						}

						break
					case 2:
						// 注册完成
						if (this.title == '完成') {
							uni.showToast({
								title: '注册完成'
							})
						}


				}

			}

		}
	};
</script>