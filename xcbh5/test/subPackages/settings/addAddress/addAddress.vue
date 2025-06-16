<template>
	<view class="address-edit-page">
		<!-- 头部 -->
		<!-- 		<view class="app-bar">
			<text class="title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
		</view> -->

		<map :latitude="location.latitude" :longitude="location.longitude" :markers="markers" style="width: 100%; height: 100vh; position: absolute; "  v-if="mapKey"></map>
		<scroll-view  scroll-y class="form-container" style="margin-top: 150rpx;">
			<view class="form-item">
				<text class="label">收货人</text>
				<input v-model="formData.phonename" placeholder="请输入收货人姓名" class="input"
					:class="{ error: error.phonename }" />
				<text v-if="error.phonename" class="error-msg">请输入收货人姓名</text>
			</view>

			<view class="form-item">
				<text class="label">联系电话</text>
				<input v-model="formData.phone" placeholder="请输入手机号码" type="number" class="input"
					:class="{ error: error.phone }" />
				<text v-if="error.phone" class="error-msg">请输入正确手机号</text>
			</view>

			<view class="form-item">
				<text class="label">所在地区</text>
					<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
						@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
						<view class="picker-text">
							{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }}
							-{{ selectedCountry === 'overseas' ? '' : multiArray[2][multiIndex[2]] }}
						</view>
					</picker>
				
				<text v-if="error.region" class="error-msg">请选择所在地区</text>
			</view>

			<view class="form-item">
				<text class="label">详细地址</text>
				<!-- <button @click="selectLocation" style="margin-left: -44rpx;">位置选择</button> -->
				<textarea  v-model="formData.address" placeholder="街道、楼牌号等详细信息" class="textarea"
					:class="{ error: error.address }"   @click="selectLocation"/>
			</view>

			<view class="form-item switch-item">
				<text class="label">默认地址</text>
				<switch :checked="formData.isshow == 1 ? false:true" @change="toggleDefault" color="#1a73e8" />
			</view>
			<view class="save-footer">
				<button class="save-btn" @click="handleSubmit">保存地址</button>
			</view>
		</scroll-view>




	</view>
</template>

<script>
	import {
		myMixin
	} from '@/utils/public.js'
	import fegionSelection from '@/components/fegionSelection/fegionSelection.vue'
	import {
		api,
		locationsKey
	} from '@/api/index.js'

	export default {
		mixins: [myMixin],
		components: {
			fegionSelection: fegionSelection
		},
		data() {
			return {
				mapKey: false,
				selectedCountry: 'china',
				multiArray: [
					[],
					[],
					[]
				],

				area_id: null, // 所在区域id
				multiIndex: [0, 0, 0],
				isEdit: false,
				formData: {
					area_id: null, // 所在区域id
					phone: null, // 手机号
					phonename: null, // 收货人姓名
					address: null, // 详细地址
					isshow: 1 // 是否为默认地址
				},
				error: {
					phonename: false,
					phone: false,
					region: false,
					detail: false
				},
				location: {
					latitude: null,
					longitude: null,
				},
				markers:[]


			}
		},
		onLoad(options) {
			// api.addressResolution({
			// 	address: '海南省琼海市会山镇大缴村'
			// }).then(data => {
			// 	console.log(data)
			// })
			uni.getLocation({
				altitude: true,
				isHighAccuracy: true,
				highAccuracy: true,
				type: 'gcj02',
				success:(res)=> {
					this.location.longitude = res.longitude
					// 确保能看到标记点
					this.location.latitude = res.latitude-0.005
					
					this.mapKey = true
					
					console.log(this.location)
					this.markers.push({id:1,longitude:this.location.longitude,latitude:this.location.latitude+0.005,iconPath:'../../../static/selectlocation.png',width:30,height:30})
					console.log(this.markers)
					// 强制更新（针对小程序平台）
					// this.$forceUpdate();
					// uni.request({
					// 	url:'https://restapi.amap.com/v3/assistant/coordinate/convert?parameters',
					// 	method:'get',
					// 	data:{
					// 		key:locationsKey,
					// 		localtion:`${res.longitude},${res.latitude}`
					// 	},
					// 	success:(res)=>{
					// 		console.log(res)
					// 	}
					// })
				},
				fail(e) {
					console.log(e)
				}
			})

			this.initializePicker()
			// console.log(options)

			if (JSON.parse(options.isEdit)) {
				this.isEdit = true
				this.formData = JSON.parse(options.jsonData)
			}


		},
		methods: {
			selectLocation() {
				uni.chooseLocation({
					success:(res)=>{
						this.formData.address = res.address
					},
					fail(e) {
						console.log(e)
					}
				})
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

			async initializePicker() {
				try {
					if (this.selectedCountry === 'china') {
						const provinces = await this.fetchProvinces();
						this.multiArray[0] = provinces.map(item => item.name);
						if (provinces.length > 0) {

							const cities = await this.fetchCities(provinces[0].id);



							this.multiArray[1] = cities.map(item => item.name);
							if (cities.length > 0) {
								const areas = await this.fetchAreas(2);

								this.multiArray[2] = areas.map(item => item.name);
							}
						}
						this.multiIndex = [0, 0, 0];


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








			toggleDefault(e) {
				this.formData.isshow = e.detail.value ? 2 : 1
			},

			validateForm() {
				
			},

			async handleSubmit() {

				// if (!this.validateForm()) return
				let res = null


				this.formData.area_id = this.area_id
				if (!this.isEdit) {
					// 新增接口
					res = await api.addMyAddress(this.formData)
					// console.log(res)
				} else {
					// 编辑接口
					// console.log(this.formData)
					res = await api.editMyAddress(this.formData)
					// console.log(res)
				}
				if (res.code == 200) {
					// 保存逻辑
					uni.showToast({
						title: '保存成功',
						icon: 'success',
						success: () => {
							setTimeout(() => {
								this.customizeBack()
							}, 1500)
						}
					})
				} else {
					// 保存逻辑
					uni.showToast({
						title: '请求异常',
						icon: 'error',
						success: () => {
							setTimeout(() => {
								this.customizeBack()
							}, 1500)
						}
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-edit-page {
		display: flex;
		justify-content: left;
		background: #f8f9fb;
		min-height: 100vh;

		.app-bar {
			display: flex;
			align-items: center;
			padding: 48rpx 32rpx 24rpx;
			background: #fff;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

			.title {
				font-size: 36rpx;
				font-weight: 500;
				color: #2d3742;
				margin-left: 24rpx;
			}
		}

		.form-container {
			position: fixed;
			bottom: 0;
			width: 700rpx;
			padding: 32rpx;
		}

		.form-item {
			display: flex;
			justify-content: left;
			align-items: center;
			background: #fff;
			// border-radius: 16rpx;
			padding: 18rpx;
			position: relative;
			text-align: left;

			.label {
				width: 200rpx;
				display: block;
				color: #4a5568;
				font-size: 30rpx;
				margin-bottom: 24rpx;
			}

			.input,
			.region-picker,
			.textarea {
				width: 600rpx;
				height: 88rpx;
				padding: 0 24rpx;
				border: 1px solid #e2e8f0;
				border-radius: 12rpx;
				font-size: 30rpx;

				&.error {
					border-color: #ef4444;
				}
			}

			.region-picker {
				display: flex;
				align-items: center;
				color: #718096;

				.placeholder {
					color: #a0aec0;
				}
			}

			.textarea {
				height: 200rpx;
				padding: 24rpx;
				line-height: 1.6;
			}

			.error-msg {
				color: #ef4444;
				font-size: 24rpx;
				margin-top: 12rpx;
				display: block;
			}
		}

		.switch-item {
			display: flex;
			justify-content: left;
			align-items: center;
		}

		.save-footer {
			z-index: 999;
			// position: fixed;
			// bottom: 0;
			// left: 0;
			// right: 0;
			background: #fff;
			padding: 24rpx 32rpx;
			box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.04);

			.save-btn {
				background: #1a73e8;
				color: #fff;
				height: 96rpx;
				border-radius: 48rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	@media (min-width: 768px) {
		.address-edit-page {
			.form-container {
				max-width: 1000px;
				margin: 0 auto;
			}
		}
	}
</style>