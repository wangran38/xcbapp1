<template>
	<view class="area-picker-container">


		<!-- 地区选择器 -->
		<view class="area">
			<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
				@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
				<view class="picker-text">
					{{ multiArray[0][multiIndex[0]] || '请选择' }} -
					{{ multiArray[1][multiIndex[1]] ? multiArray[1][multiIndex[1]] : '暂无数据' }} -
					{{ selectedCountry === 'overseas' ? '' : (multiArray[2][multiIndex[2]] || '暂无数据') }}
				</view>
			</picker>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js';

	export default {
		name: 'AreaPicker',
		props: {
			// 初始选中类型：china/overseas
			initCountry: {
				type: String,
				default: 'china'
			},
			// 初始省市区索引 [省,市,区]
			initMultiIndex: {
				type: Array,
				default: () => [20, 3, 6] // 默认海南-定安-对应区
			}
		},
		data() {
			return {
				selectedCountry: 'china',
				multiArray: [
					[],
					[],
					[]
				], // 省/海外国家 | 市/海外城市 | 区
				multiIndex: [0, 0, 0],
				// 中国地区数据
				provinceList: [],
				cityList: [],
				districtList: [],
				// 海外地区数据
				overseasCountries: [],
				overseasCities: [],
				overseasCountryId: null,
				overseasCityId: null
			};
		},
		watch: {
			initCountry: {
				immediate: true,
				handler(newVal) {
					this.selectCountry(newVal);
				}
			},
			initMultiIndex: {
				immediate: true,
				handler(newVal) {
					this.multiIndex = newVal;
				}
			}
		},
		async mounted() {
			await this.initializePicker();
		},
		methods: {
			// 初始化选择器数据
			async initializePicker() {
				try {
					if (this.selectedCountry === 'china') {
						// 加载中国省数据
						const provinces = await this.fetchProvinces();
						this.multiArray[0] = provinces.map(item => item.name);
						this.provinceList = provinces;

						// 加载默认省对应的市
						if (provinces.length > 0) {
							const targetProvinceId = provinces[this.multiIndex[0]]?.id;
							const cities = await this.fetchCities(targetProvinceId);
							this.multiArray[1] = cities.map(item => item.name);
							this.cityList = cities;

							// 加载默认市对应的区
							if (cities.length > 0) {
								const targetCityId = cities[this.multiIndex[1]]?.id || 2306;
								const areas = await this.fetchAreas(targetCityId);
								this.multiArray[2] = areas.map(item => item.name);
								this.districtList = areas;
							}
						}
					} else {
						// 加载海外数据
						await this.fetchOverseas();
					}
				} catch (error) {
					console.error('初始化地区选择器失败:', error);
				}
			},

			// 切换中国/海外
			async selectCountry(country) {
				this.selectedCountry = country;
				this.multiArray = [
					[],
					[],
					[]
				];
				this.multiIndex = [0, 0, 0];
				await this.initializePicker();
				this.emitAreaChange();
			},

			// 获取中国省份列表
			async fetchProvinces() {
				try {
					const res = await api.citylist({
						level: 1,
						limit: 100
					});
					return res.code === 200 ? res.data.listdata : [];
				} catch (error) {
					console.error('获取省份失败:', error);
					return [];
				}
			},

			// 获取城市列表
			async fetchCities(provinceId) {
				try {
					const res = await api.citytree(provinceId);
					return res.code === 200 && Array.isArray(res.data) ? res.data : [];
				} catch (error) {
					console.error('获取城市失败:', error);
					return [];
				}
			},

			// 获取区县列表
			async fetchAreas(cityId) {
				try {
					const res = await api.citytree(cityId);
					return res.code === 200 && Array.isArray(res.data) ? res.data : [];
				} catch (error) {
					console.error('获取区县失败:', error);
					return [];
				}
			},

			// 获取海外国家/地区
			async fetchOverseas() {
				try {
					const res = await api.countrylist(0, 200, 1);
					if (res.code === 200) {
						this.overseasCountries = res.data.listdata;
						this.multiArray[0] = this.overseasCountries.map(c => c.shortname);
					}
				} catch (error) {
					console.error('获取海外数据失败:', error);
				}
			},

			// 获取海外城市
			async fetchOverseasCities(continentId) {
				try {
					const res = await api.countrylist(continentId, 100, 1);
					if (res.code === 200) {
						this.overseasCities = res.data.listdata;
						this.multiArray[1] = this.overseasCities.map(c => c.shortname);
					}
				} catch (error) {
					console.error('获取海外城市失败:', error);
				}
			},

			// 列滚动事件
			async bindMultiPickerColumnChange(e) {
				const {
					column,
					value
				} = e.detail;
				this.multiIndex[column] = value;

				if (this.selectedCountry === 'china') {
					// 滚动省份列
					if (column === 0) {
						const provinceId = this.provinceList[value]?.id;
						const cities = await this.fetchCities(provinceId);
						this.multiArray[1] = cities.map(item => item.name);
						this.cityList = cities;
						// 重置市、区索引
						this.multiIndex[1] = 0;
						this.multiIndex[2] = 0;

						// 加载对应市的区县
						const cityId = cities[0]?.id;
						const areas = await this.fetchAreas(cityId);
						this.multiArray[2] = areas.map(item => item.name);
						this.districtList = areas;
					}
					// 滚动城市列
					else if (column === 1) {
						const cityId = this.cityList[value]?.id;
						const areas = await this.fetchAreas(cityId);
						this.multiArray[2] = areas.map(item => item.name);
						this.districtList = areas;
						// 重置区索引
						this.multiIndex[2] = 0;
					}
				} else {
					// 海外：滚动国家列
					if (column === 0) {
						const continentId = this.overseasCountries[value]?.id;
						await this.fetchOverseasCities(continentId);
						this.multiIndex[1] = 0;
						this.multiIndex[2] = 0;
					}
				}

				// 触发视图更新
				this.multiIndex = [...this.multiIndex];
			},

			// 选择完成事件
			bindMultiPickerChange() {
				this.emitAreaChange();
			},

			// 向外暴露选择结果
			emitAreaChange() {
				let areaInfo = {
					selectedCountry: this.selectedCountry,
					multiIndex: [...this.multiIndex],
					areaText: `${this.multiArray[0][this.multiIndex[0]] || ''} - ${this.multiArray[1][this.multiIndex[1]] || ''} ${
          this.selectedCountry === 'china' ? `- ${this.multiArray[2][this.multiIndex[2]] || ''}` : ''
        }`.trim()
				};

				// 补充中国地区的ID信息
				if (this.selectedCountry === 'china') {
					areaInfo.provinceId = this.provinceList[this.multiIndex[0]]?.id || null;
					areaInfo.cityId = this.cityList[this.multiIndex[1]]?.id || null;
					areaInfo.districtId = this.districtList[this.multiIndex[2]]?.id || null;
				} else {
					// 补充海外地区的ID信息
					areaInfo.overseasCountryId = this.overseasCountries[this.multiIndex[0]]?.id || null;
					areaInfo.overseasCityId = this.overseasCities[this.multiIndex[1]]?.id || null;
				}

				this.$emit('area-change', areaInfo);
			},

			// 外部调用：获取当前选择结果
			getCurrentArea() {
				let areaInfo = {
					selectedCountry: this.selectedCountry,
					multiIndex: [...this.multiIndex],
					areaText: `${this.multiArray[0][this.multiIndex[0]] || ''} - ${this.multiArray[1][this.multiIndex[1]] || ''} ${
          this.selectedCountry === 'china' ? `- ${this.multiArray[2][this.multiIndex[2]] || ''}` : ''
        }`.trim()
				};

				if (this.selectedCountry === 'china') {
					areaInfo.provinceId = this.provinceList[this.multiIndex[0]]?.id || null;
					areaInfo.cityId = this.cityList[this.multiIndex[1]]?.id || null;
					areaInfo.districtId = this.districtList[this.multiIndex[2]]?.id || null;
				} else {
					areaInfo.overseasCountryId = this.overseasCountries[this.multiIndex[0]]?.id || null;
					areaInfo.overseasCityId = this.overseasCities[this.multiIndex[1]]?.id || null;
				}
				return areaInfo;
			}
		}
	};
</script>

<style scoped>
	.area-picker-container {
		width: 100%;
	}

	/* 中国/海外切换样式 */
	.nation {
		height: 100rpx;
		width: 100%;
		text-align: center;
		line-height: 100rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #ccc;
		color: black;
	}

	.china,
	.overseas {
		flex: 1;
		cursor: pointer;
		transition: all 0.3s;
	}

	.china {
		border-right: 1px solid #ccc;
	}

	.active {
		font-weight: bold;
		border-bottom: 2px solid #007aff;
	}

	/* 地区选择器样式 */
	.area {
		height: 150rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		/* border-bottom: 1px solid #ccc; */
		color: black;
	}

	.area>text {
		height: 150rpx;
		width: 200rpx;
		line-height: 150rpx;
		text-align: left;
		font-size: 28rpx;
		box-sizing: border-box;
		border-right: 1px solid #ccc;
	}

	.picker {
		border: 2rpx solid #ccc;
		height: 150rpx;
		width: 100%;
		line-height: 150rpx;
		text-align: center;
		box-sizing: border-box;
		font-size: 30rpx;
		padding: 0 10rpx;
		overflow: hidden;
	}

	.picker-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 150rpx;
		text-align: center;
		font-size: 30rpx;
		padding: 0 10rpx;
	}
</style>