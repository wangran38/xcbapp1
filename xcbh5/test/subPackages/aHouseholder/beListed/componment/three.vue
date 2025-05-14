<template>
	<view class="me-container">


		<view class="form-card">
			<view class="section-title">
				<text class="title-icon">｜</text>
				<text class="title-text">选择菜市场</text>
			</view>
			<view class="form-item picker-item compact">
				<view class="item-label">
					<text>所在地区</text>
				</view>
				<picker mode="multiSelector" :range="multiArray" :value="multiIndex" @change="bindMultiPickerChange"
					@columnchange="bindMultiPickerColumnChange">
					<view class="compact-picker">
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
			</view>


			<view class="form-item picker-item">
				<view class="item-label">
					<text>菜市场</text>
				</view>
				<picker mode="selector" :range="marketList" :value="selectedMarketIndex" @change="bindMarketChange">
					<view class="picker-content">
						<text class="picker-text">{{ marketList[selectedMarketIndex] || '请选择菜市场' }}</text>
						<uni-icons type="arrowright" size="18" color="#999" />
					</view>
				</picker>
			</view>

		</view>



		<view class="form-card">
			<view class="section-title">
				<text class="title-icon">｜</text>
				<text class="title-text">商品信息</text>
			</view>
			<view class="form-item">
				<view class="item-label">
					<text>联系人</text>
				</view>
				<input class="form-input" v-model="contactphone" type="number" placeholder="请输入联系人"
					placeholder-style="color: #c0c4cc" />
			</view>

			<view class="form-item">
				<view class="item-label">
					<text>联系电话</text>
				</view>
				<input class="form-input" v-model="contactphone" type="number" placeholder="请输入联系电话"
					placeholder-style="color: #c0c4cc" />
			</view>

			<view class="form-item">
				<view class="item-label">
					<text>预卖价</text>
				</view>
				<input class="form-input" v-model="contactpeople" placeholder="请输入预卖价"
					placeholder-style="color: #c0c4cc" />
			</view>
			<view class="form-item">
				<view class="item-label">
					<text>市场价</text>
				</view>
				<input class="form-input" v-model="contactphone" type="number" placeholder="请输入市场价"
					placeholder-style="color: #c0c4cc" />
			</view>
			<view class="form-item">
				<view class="item-label">
					<text>库存</text>
				</view>
				<input class="form-input" v-model="contactphone" type="number" placeholder="请输入库存"
					placeholder-style="color: #c0c4cc" />
			</view>
			<view class="form-item">
				<view class="item-label">
					<text>单位</text>
				</view>
				<input class="form-input" v-model="contactphone" type="number" placeholder="请输入单位"
					placeholder-style="color: #c0c4cc" />
			</view>
			<view class="form-item">
				<view class="item-label">
					<text>提货点</text>
				</view>
				<input class="form-input" v-model="contactphone" type="number" placeholder="请输入提货点"
					placeholder-style="color: #c0c4cc" />
			</view>

			<view class="form-item">
				<view class="item-label">
					<text>上市开始时间</text>
				</view>
				<uni-datetime-picker type="date" @change="change" />
			</view>
			<view class="form-item">
				<view class="item-label">
					<text>上市结束时间</text>
				</view>
				<uni-datetime-picker type="date" @change="change" />
			</view>

		</view>


		<!-- 提交按钮 -->
		<view class="submit-wrapper">
			<button class="submit-btn" :class="{ 'disabled': isSubmitting }" @click="submit">
				{{ isSubmitting ? '提交中...' : '立即提交' }}
				<text class="loading-icon" v-if="isSubmitting">◌</text>
			</button>
		</view>
	</view>
</template>

<script>
	import {
		api,
	} from '@/api/index.js';
	export default {
		name: 'three',
		data() {
			return {
				multiArray: [
					[],
					[],
					[]
				],
				multiIndex: [0, 0, 0],
				categoryList: ['请选择分类'],
				categoryIdMap: {}, // 分类名称到ID的映射
				selectedCategory: '请选择分类',
				provinceList: [],
				cityList: [],
				districtList: [],
				marketList: [], // 添加市场列表
				marketIdMap: {}, // 菜市场名称到ID的映射
				selectedMarketIndex: 0, // 记录当前选择的市场索引

				area_id: null,
				market_id: null,
				isSubmitting: false,
				formData:{
					sellstatus:3, // 批发
					farmersgoods_id:null  ,// 菜品id，
					market_id:null, // 市场id
					area_id:null, // 城市id
					unit:null, // 单位
					ispresale:2, // 是否上市
					sellbegintime:null, // 开始时间戳
					sellendtime:null, // 结束时间戳
					presaleprice:null, // 市场价
					price:null, // 上市价
					goodstotal:null, // 库存
					contactpeople:null, // 联系人
					contactphone:null, // 手机号
					pickaddress:null, // 取货点
				}
			};
		},


		mounted() {
			this.initializePicker();
			this.fetchCategories();
			this.fetchMarkets(); // 获取市场列表
		},

		methods: {
			submit() {
				this.$emit('open', '自销')
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
					console.error('Failed to initialize picker:', error);
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
			async fetchCities(provinceId) {
				// console.log('Fetching cities for provinceId:', provinceId);
				try {
					const response = await api.citytree(provinceId);
					// console.log('Cities API response:', response);
					if (response.code === 200 && Array.isArray(response.data)) {
						return response.data; // Assuming response.data is the array of cities
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
				// console.log('Fetching areas for cityId:', cityId);
				try {
					const response = await api.citytree(cityId);
					// console.log('Areas API response:', response);
					if (response.code === 200 && Array.isArray(response.data)) {
						return response.data; // Assuming response.data is the array of areas
					} else {
						console.error('No areas data found');
						return [];
					}
				} catch (error) {
					console.error('Failed to fetch areas:', error);
					return [];
				}
			},
			bindMultiPickerChange(e) {
				this.multiIndex = e.detail.value;
				const selectedProvince = this.multiArray[0][this.multiIndex[0]];
				const selectedCity = this.multiArray[1][this.multiIndex[1]];
				const selectedArea = this.multiArray[2][this.multiIndex[2]];
				const selectedAreaId = this.districtList[this.multiIndex[2]].id;
				console.log('选择的省市区:', selectedProvince, selectedCity, selectedArea);
				this.area_id = selectedAreaId;
				this.fetchMarkets(selectedAreaId);
			},
			async bindMultiPickerColumnChange(e) {
				const column = e.detail.column;
				const value = e.detail.value;
				this.multiIndex[column] = value;

				if (column === 0) {
					const provinceId = this.provinceList[value].id;
					const cities = await this.fetchCities(provinceId);
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

				this.multiIndex = [...this.multiIndex];
			},

			async fetchMarkets(areaId) {
				try {
					const Limit = 100;
					const response = await api.marketlist(areaId, Limit); // 传递实际的 areaId
					// console.log('Market API response:', response); // 打印响应数据
					if (response.code === 200) {
						this.marketData = response.data.listdata;
						this.marketList = response.data.listdata.map(item => item.marketname);
						this.marketIdMap = this.marketData.reduce((map, item) => {
							map[item.marketname] = item.id;

							return map;
						}, {});

					} else {
						console.error('Failed to fetch markets:', response.message);
					}
				} catch (error) {
					console.error('Failed to fetch markets:', error);
				}
			},

			bindMarketChange(e) {
				this.selectedMarketIndex = e.detail.value;
				const selectedMarketName = this.marketList[this.selectedMarketIndex];
				this.market_id = this.marketIdMap[selectedMarketName] || null;
			},

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
			bindCategoryChange(e) {
				const selectedIndex = e.detail.value;
				this.selectedCategory = this.categoryList[selectedIndex];
				this.category_id = this.categoryIdMap[this.selectedCategory];
			},

		}
	};
</script>


<style lang="scss" scoped>
	/deep/.uni-date__x-input {
		font-size: 28rpx;
	}

	.compact-picker {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;

	}

	.me-container {
		padding: 30rpx;
		background-color: #f8f8f8;
		min-height: 100vh;
	}

	.form-card {
		background: white;
		border-radius: 16rpx;
		padding: 0 30rpx 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

		.section-title {
			padding: 30rpx 0;
			border-bottom: 2rpx solid #eee;
			margin-bottom: 20rpx;

			.title-icon {
				color: #409EFF;
				margin-right: 12rpx;
			}

			.title-text {
				font-size: 34rpx;
				font-weight: 600;
				color: #333;
			}
		}
	}

	.form-item {
		padding: 25rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		.item-label {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			font-size: 28rpx;
			color: #666;

			uni-icons {
				margin-right: 12rpx;
			}
		}

		.form-input {
			height: 80rpx;
			font-size: 30rpx;
			color: #333;
			padding: 0 20rpx;
			background: #f8f8f8;
			border-radius: 8rpx;
		}
	}

	.picker-item {
		.picker-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;

			.picker-text {
				font-size: 30rpx;
				color: #333;
				flex: 1;
				margin-right: 20rpx;

				&:empty::after {
					content: '请选择';
					color: #c0c4cc;
				}
			}
		}
	}

	.upload-btn {
		display: inline-flex;
		align-items: center;
		padding: 16rpx 32rpx;
		border: 2rpx dashed #ddd;
		border-radius: 8rpx;
		transition: all 0.3s;

		&.uploaded {
			border-color: #67C23A;
			background: #f0f9eb;
		}

		uni-icons {
			margin-right: 12rpx;
		}

		text {
			font-size: 28rpx;
			color: #666;
		}
	}

	.submit-wrapper {
		margin-top: 60rpx;
		padding: 0 30rpx;

		.submit-btn {
			background: linear-gradient(45deg, #409EFF, #64b5f6);
			color: white;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 44rpx;
			font-size: 34rpx;
			letter-spacing: 2rpx;
			transition: opacity 0.3s;

			&.disabled {
				opacity: 0.7;
				background: #c0c4cc;
			}

			.loading-icon {
				display: inline-block;
				margin-left: 15rpx;
				animation: rotate 1s linear infinite;
			}
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>