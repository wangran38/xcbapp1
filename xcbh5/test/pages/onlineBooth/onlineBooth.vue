<template>
	<view class="bixBox">
		<popVue ref="pop"  @receive="over"></popVue>
		<view class="title">
			轻松三步，成为农户
		</view>
		<uni-steps :options="options" :active="active" class="steps"></uni-steps>
		<view class="one" v-show="active == 0">
			<view class="tip">
				先选择自己所在的城市地区，申请成功后将展示在该地区的所有范围
			</view>
			<view class="info">
				<uni-card title="所在的地区" :isFull="true">
					<view class="area">
						<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
							@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
							<view class="picker-text">
								{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }}
								-{{ selectedCountry === 'overseas' ? '' : multiArray[2][multiIndex[2]] }}
							</view>
						</picker>
					</view>
				</uni-card>

			</view>
		</view>


		<view class="two" v-show="active == 1">
			<view class="tip">
				请输入户主名称，选择您要卖的菜品所属分类，以及详细地址，申请成功后在页面上显示您的信息。帮您全平台推广您的菜品。
			</view>
			<view class="title" style="text-align: left; color: black; font-weight: 100;">
				店主身份
			</view>
			<view class="form">
				<view class="card">
					<view class="label">
						户主名称
					</view>
					<input v-model="userInfo.name" type="text" placeholder="请输入名称" />
				</view>
				<view class="hr">
				</view>
				<view class="card">
					<view class="label">
						所售类目
					</view>
					<view class="Select">
						<picker class="Categorypicker" mode="selector" :range="categoryList" @change="bindCategoryChange">
							<view style="text-align: center; width: 230rpx; font-size: 30rpx; line-height: 50rpx; ">{{ selectedCategory }}</view>
						</picker>
					</view>
				</view>
				
				<view class="hr">
				</view>
				<view class="card">
					<view class="label">
						详细地址
					</view>
					<view class="Select">
						<input v-model="userInfo.location" type="text" placeholder="请输入地址"  style="mix-width: 400rpx;"/>
					</view>
				</view>
				<view>

				</view>
			</view>
		</view>

		<view class="three" v-show="active == 2">
			<view class="tip">
				建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议
			</view>
			<view class="registerBtn" @click="register">
				开通并领取福利
			</view>

		</view>
		<button class="btn" @click="next">{{title}}</button>
	</view>
</template>

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
				options: [{
					title: '创建摊位'
				}, {
					title: '用户信息'
				}, {
					title: '领取福利'
				}, ],
				active: 0,
				categoryList: ['请选择分类'],
				selectedCategory: '请选择分类',  // 分类
				userInfo:{  // 用户信息
					name:null,
					location:null,
					index:null
				},
				title:'下一步',
				lock:true, // 领取按钮锁




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
		components:{
			popVue
		},
		methods: {
			async over(){
				// 发送申请注册
				
				let res = await api.addfarmers({
					area_id:this.area_id,
					farmersname:this.userInfo.name,
					address:this.userInfo.location,
					category_id:this.userInfo.index
				})
				console.log(res)
				if (res.code == 200){
					this.title = '完成'
				}else{
					uni.showToast({
						icon:'error',
						title:'服务器异常'
					})
				}
				
			},
			register(){
				if (this.lock){
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
						this.categoryList = [ ...categories.map(item => item.title)];
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
				switch (this.active){
					case 0:
						this.active += 1
						break
					case 1:
						this.userInfo.index = this.categoryList.findIndex((item)=>item==this.selectedCategory)
						if (this.userInfo.name && this.userInfo.location && this.userInfo.index!=-1){
							this.active += 1
							
						}else{
							uni.showToast({
								icon:'error',
								title:'请补充完整信息'
							})
						}
						break
					case 2:
						// 注册完成
						if (this.title =='完成'){
							uni.showToast({
								title:'注册完成'
							})
						}

						
				}
				
			}

		}
	};
</script>



<style scoped>
	.registerBtn{
		box-shadow: 10rpx 10rpx 10rpx #e8e8e8;
		background-color: lightblue;
		width: 230rpx;
		height: 100rpx;
		font-size: 26rpx;
		line-height: 100rpx;
		border-radius: 10rpx;
		margin: 0 auto;
		color: white;
		font-family: STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑";
	}
	.Select {
		display: flex;
	}

	.area {
		font-size: 35rpx;
	}

	.bixBox {
		padding: 20rpx 20rpx 20rpx 20rpx;
		text-align: center;
	}

	.title {
		font-weight: 700;
		font-size: 30rpx;
		color: limegreen;
	}

	.steps {
		margin-top: 20rpx;
	}

	.tip {
		font-weight: 800;
		text-align: left;
		margin: 20rpx 0 20rpx 0;
		height: 200rpx;
		border-radius: 10rpx;
		background-color: white;
	}

	.info {
		margin-top: 30rpx;
	}

	.label {
		width:200rpx;
		font-weight: 300;
		font-size: 25rpx;
		margin-bottom: 20rpx;
	}

	.btn {
		width: 90%;
		background-color: lightgreen;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 30rpx;
	}


	.hr {
		background-color: #e8e8e8;
		height: 1rpx;

	}

	.form {
		background-color: white;
		position: relative;
		text-align: left;
		line-height: 30rpx;
		border: 1rpx solid #e8e8e8;
		padding: 20rpx 0rpx 20rpx 0rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
	}

	.form input {
		width: 230rpx;
		text-align: center;
		font-size: 30rpx;
	}

	.form .label {
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: 600;
	}

	.card {
		padding: 10rpx 10rpx 10rpx 10rpx;
		display: flex;
	}
</style>