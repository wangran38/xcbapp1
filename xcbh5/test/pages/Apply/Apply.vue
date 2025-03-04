<template>
	<view class="me-container">
		<!-- 基本信息卡片 -->
		<view class="form-card">
			<view class="section-title">
				<text class="title-icon">｜</text>
				<text class="title-text">基本信息</text>
			</view>
			<view class="form-item">
				<view class="item-label">
					<uni-icons type="person" size="18" color="#666" />
					<text>联系人</text>
				</view>
				<input class="form-input" v-model="contactpeople" placeholder="请输入联系人姓名"
					placeholder-style="color: #c0c4cc" />
			</view>
			<view class="form-item">
				<view class="item-label">
					<uni-icons type="phone" size="18" color="#666" />
					<text>联系电话</text>
				</view>
				<input class="form-input" v-model="contactphone" type="number" placeholder="请输入联系人电话"
					placeholder-style="color: #c0c4cc" />
			</view>
		</view>


		<view class="form-card">
			<view class="section-title">
				<text class="title-icon">｜</text>
				<text class="title-text">所在地</text>
			</view>
			<view class="form-item picker-item compact">
				<view class="item-label">
					<uni-icons type="location" size="18" color="#666" />
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
			<!-- 菜市场选择 -->
			<view class="form-item picker-item">
				<view class="item-label">
					<uni-icons type="flag" size="18" color="#666" />
					<text>选择菜市场</text>
				</view>
				<picker mode="selector" :range="marketList" :value="selectedMarketIndex" @change="bindMarketChange">
					<view class="picker-content">
						<text class="picker-text">{{ marketList[selectedMarketIndex] || '请选择菜市场' }}</text>
						<uni-icons type="arrowright" size="18" color="#999" />
					</view>
				</picker>
			</view>

		</view>


		<!-- 摊铺信息卡片 -->
		<view class="form-card">
			<view class="section-title">
				<text class="title-icon">｜</text>
				<text class="title-text">摊铺信息</text>
			</view>

			<!-- 摊铺名称 -->
			<view class="form-item">
				<view class="item-label">
					<uni-icons type="shop" size="18" color="#666" />
					<text>摊铺名称</text>
				</view>
				<input class="form-input" v-model="title" placeholder="请输入摊铺名称" placeholder-style="color: #c0c4cc" />
			</view>

			<!-- 地区选择 -->

			<!-- 类目选择 -->
			<view class="form-item picker-item">
				<view class="item-label">
					<uni-icons type="list" size="18" color="#666" />
					<text>所售类目</text>
				</view>
				<picker mode="selector" :range="categoryList" @change="bindCategoryChange">
					<view class="picker-content">
						<text class="picker-text">{{ selectedCategory || '请选择经营类目' }}</text>
						<uni-icons type="arrowright" size="18" color="#999" />
					</view>
				</picker>
			</view>

			<!-- 摊主电话 -->
			<view class="form-item">
				<view class="item-label">
					<uni-icons type="phone" size="18" color="#666" />
					<text>摊主电话</text>
				</view>
				<input class="form-input" v-model="phone" type="number" placeholder="请输入摊主联系电话"
					placeholder-style="color: #c0c4cc" />
			</view>

			<!-- 图片上传 -->
			<view class="form-item">
				<view class="item-label">
					<uni-icons type="image" size="18" color="#666" />
					<text>摊位图片</text>
				</view>
				<view class="upload-btn" :class="{ 'uploaded': isImageSelected }" @tap="chooseImage">
					<uni-icons :type="isImageSelected ? 'checkmarkempty' : 'plusempty'" size="24"
						:color="isImageSelected ? '#67C23A' : '#999'" />
					<text>{{ isImageSelected ? '已上传' : '点击上传' }}</text>
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-wrapper">
			<button class="submit-btn" :class="{ 'disabled': isSubmitting }" @click="submitForm">
				{{ isSubmitting ? '提交中...' : '立即提交' }}
				<text class="loading-icon" v-if="isSubmitting">◌</text>
			</button>
		</view>
	</view>
</template>

<script>
	import {
		api,
		UPLOAD_URL
	} from '../../api/index.js';
	import {
		useUpload
	} from "@/hooks/useUpload"
	export default {
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
				contactpeople: '',
				contactphone: '',
				title: '',
				logo: '', // 摊位图片
				phone: '',
				content: '',
				area_id: null,
				market_id: null,
				category_id: null,
				isSubmitting: false,
				businessLicense: '', // 营业执照
				isImageSelected: false
			};
		},
		mounted() {
			this.initializePicker();
			this.fetchCategories();
			this.fetchMarkets(); // 获取市场列表
		},
		onShow() {
			if (this.checkToken()) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		methods: {
			// 检查是否token存在，存在则已登陆
			checkToken() {
				const token = uni.getStorageSync('token');
				if (!token) {
					return true
				}
				return false
			},
			// 返回上一页
			async customizeBack() {
				let canNavBack = await getCurrentPages()
				if (canNavBack && canNavBack.length > 1) {
					uni.navigateBack()
				} else {
					history.back();
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
					this.multiArray[2] = [];
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
				this.category_id = this.categoryIdMap[this.selectedCategory]; // 设置分类ID
			},

			// 摊位图片上传
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed', 'original'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						if (tempFilePaths.length > 0) {
							const {
								upload,
								request
							} = useUpload({
								uploadPath: '/group1/upload',
								tempFilePaths: tempFilePaths[0],
								file: res.tempFiles[0]
							})

							upload().then((res) => {
								var obj = JSON.parse(res);
								// console.log(obj.data);
								this.logo = UPLOAD_URL + obj.data.path;
								this.isImageSelected = true;
							})
						}
					}
				});
			},



			async submitForm() {
				if (this.isSubmitting) return; // 如果正在提交，直接返回
				if (!this.contactpeople || !this.contactphone || !this.title || !this.phone || !this
					.area_id || !this.market_id || !this.category_id || !this.logo) {
					uni.showToast({
						title: '请填写完整的信息',
						icon: 'none'
					});
					return;
				}

				this.isSubmitting = true; // 设置为正在提交状态
				try {
					const formData = {
						contactpeople: this.contactpeople,
						contactphone: this.contactphone,
						title: this.title,
						logo: this.logo, // 取第一个上传的图片作为logo
						phone: this.phone,
						content: this.content,
						area_id: this.area_id,
						market_id: this.market_id,
						category_id: this.category_id,

					};

					const response = await api.addshop(formData);

					if (response.code === 200) {
						uni.showToast({
							title: '摊位申请成功',
							icon: 'success',
							duration: 2000
						})
						// 清空表单或进行其他操作
						// 返回上一页
						setTimeout(() => {
							this.customizeBack()
						}, 2000)

					} else {
						uni.showToast({
							title: response.msg || '提交失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('提交失败:', error);
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
				} finally {
					this.isSubmitting = false; // 提交完成，重置状态
				}
			}
		}
	};
</script>


<style lang="scss" scoped>
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