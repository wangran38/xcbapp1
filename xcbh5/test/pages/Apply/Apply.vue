<template>
	<view class="me-container">
		<view class="basicsinfo">
			<text style="margin: 0rpx 20rpx;">基本信息</text>
			<view class="item-info">
				<view class="name">
					<text>联系人:</text>
					<input v-model="contactpeople" type="text" placeholder="请填写联系人" />
				</view>
				<view class="phone">
					<text>联系电话:</text>
					<input v-model="contactphone" type="text" placeholder="请填写联系人电话" />
				</view>
			</view>
		</view>

		<view class="store">
			<text style="margin: 10rpx 20rpx;">摊铺信息</text>
			<view class="storename">
				<text>摊铺名称:</text>
				<input v-model="title" type="text" placeholder="请填写摊铺名称" />
			</view>
			<view class="area">
				<text>所在地区:</text>
				<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
					@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
					<view class="picker-text">
						{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }} -
						{{ multiArray[2][multiIndex[2]] }}
					</view>
				</picker>
			</view>
			<view class="Address">
				<text>选择菜市场:</text>
				<picker class="picker" mode="selector" :range="marketList" :value="selectedMarketIndex"
					@change="bindMarketChange">
					<view class="picker-text">{{ marketList[selectedMarketIndex]  }}</view>
				</picker>
			</view>
			<view class="Category">
				<text>所售类目:</text>
				<picker class="Categorypicker" mode="selector" :range="categoryList" @change="bindCategoryChange">
					<view >{{ selectedCategory }}</view>
				</picker>
			</view>
			<view class="stallphone">
				<text>摊主电话:</text>
				<input v-model="phone" type="text" placeholder="请填写摊主电话" />
			</view>


			<!-- <view class="BL">
				<text>相关行业许可证</text>
				<uni-file-picker class="BLpicker" v-model="imageValue" fileMediatype="image" mode="grid"
					file-extname="png,jpg" :limit="9" @select="select" @progress="progress" @success="success"
					@fail="fail" 点击上传图片
					/>   //这里不要
				<button class="BLpicker" @tap="chooseImage">选择图片</button>
			</view> -->
			<view class="BL1">
				<text>摊位图片:</text>
				<view class="BLpicker" @tap="chooseImage">{{ isImageSelected ? '已选择' : '选择图片' }}</view>
			</view>
			
<!-- 			<view class="BL">
				<text>营业执照:</text>
				<view class="BLpicker" @tap="chooseImage2">{{ isImageSelected2 ? '已选择' : '选择图片' }}</view>
			</view> -->
<!-- 
			<view class="illustrate">
				<text>摊位的详细内容说明</text>
				<textarea v-model="content" placeholder-style="color:#666666" placeholder="请输入详细内容说明" />
			</view> -->

		</view>

		<button class="submit" type="primary" @click="submitForm" :disabled="isSubmitting">提交</button>
	</view>
</template>

<script>
	import {
		api,UPLOAD_URL 
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
				businessLicense:'', // 营业执照
				isImageSelected:false
			};
		},
		mounted() {
			this.initializePicker();
			this.fetchCategories();
			this.fetchMarkets(); // 获取市场列表
		},
		onShow() {
			if (this.checkToken()){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
		},
		methods: {
			// 检查是否token存在，存在则已登陆
			checkToken() {
				const token = uni.getStorageSync('token');
				if (!token){
					return true
				}
				return false
			},
			// 返回上一页
			 async customizeBack(){  
			  let canNavBack = await getCurrentPages()
			  if( canNavBack && canNavBack.length>1) {  
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
					const response = await api.marketlist(areaId,Limit); // 传递实际的 areaId
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
					sizeType: ['compressed','original'],
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
								file:res.tempFiles[0]
							})

							upload().then((res) => {
								var obj = JSON.parse(res);
								// console.log(obj.data);
								this.logo = UPLOAD_URL+obj.data.path;
									this.isImageSelected = true;
							})
						}
					}
				});
			},
			


			async submitForm() {
				if (this.isSubmitting) return; // 如果正在提交，直接返回
				if (!this.contactpeople || !this.contactphone || !this.title || !this.phone  || !this
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
							duration:2000
						})
						// 清空表单或进行其他操作
						// 返回上一页
						setTimeout(()=>{
							this.customizeBack()
						},2000)
						
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


<style>
	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 40rpx 0 40rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.basicsinfo {
		height: 250rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 20rpx;
		border: 1px solid #ccc;
	}

	text {
		color: black;
		height: 50rpx;
		line-height: 50rpx;
	}

	.item-info {
		height: 200rpx;
		width: 100%;
		background-color: white;
	}

	.name {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
		margin: 0 20rpx;
	}

	.name>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.name>input {
		height: 100rpx;
		width: 100%;
		color: black;
	}

	.phone {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 0 20rpx;
	}

	.phone>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.phone>input {
		height: 100rpx;
		width: 100%;
		color: black;
	}

	.store {
		height: 685rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 30rpx;
		border: 1px solid #ccc;
	}

	.storename {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		border-bottom: 1px solid #ccc;
		background-color: white;
	}

	.storename>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.storename>input {
		height: 100rpx;
		width: 100%;
		color: black;
	}

	.area {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		border-bottom: 1px solid #ccc;
		background-color: white;
	}

	.area>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.picker {
		height: 100rpx;
		width: 100%;
		color: black;
		line-height: 100rpx;
		box-sizing: border-box;
		overflow: hidden; /* 隐藏超出部分 */
	}
	
	.picker-text {
	  white-space: nowrap; /* 禁止换行 */
	  overflow: hidden; /* 隐藏超出部分 */
	  text-overflow: ellipsis; /* 超出部分显示省略号 */
	  line-height: 100rpx;
	  box-sizing: border-box;
	  /* font-size: 30rpx; */
	  /* padding: 0 10rpx; */
	}

	.Address {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		border-bottom: 1px solid #ccc;
		background-color: white;
	}

	.Address>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	/* .Address>input {
		height: 100rpx;
		width: 100%;
		color: black;
	} */

	.Category {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		border-bottom: 1px solid #ccc;
		background-color: white;
	}

	.Category>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.Categorypicker {
		height: 100rpx;
		width: 100%;
		color: black;
		line-height: 100rpx;
		box-sizing: border-box;
	}

	.stallphone {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		background-color: white;
	}

	.stallphone>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.stallphone>input {
		height: 100rpx;
		width: 100%;
		color: black;
	}

	.BL {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		border-bottom: 1px solid #ccc;
		background-color: white;
	}

	.BL>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.BLpicker {
		height: 100rpx;
		width: 100%;
		color: black;
		line-height: 100rpx;
		box-sizing: border-box;
	}

	.BL1 {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		background-color: white;
		border-bottom: 1px solid #ccc;
	}

	.BL1>text {
		height: 100rpx;
		width: 200rpx;
		line-height: 100rpx;
		text-align: left;
	}

	.BLpicker {
		height: 100rpx;
		width: 100%;
		color: black;
		line-height: 100rpx;
		box-sizing: border-box;
	}

	.illustrate {
		height: 200rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: left;
		/* margin: 0 20rpx; */
		padding: 0 20rpx;
		box-sizing: border-box;
		background-color: white;
	}

	.illustrate>text {
		height: 200rpx;
		width: 200rpx;
		max-width: 200rpx;
		/* 或者一个适合的最大宽度 */
		line-height: 1.2;
		text-align: left;
		box-sizing: border-box;
		word-wrap: break-word;
		/* 允许长单词换行 */
		overflow-wrap: break-word;
		display: flex;
		align-items: center;
		border-right: 1px solid #ccc;
	}

	.illustrate>textarea {
		height: 100rpx;
		width: 100%;
		color: black;
	}

	.submit {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 40rpx 0 40rpx;
		margin-top: 30rpx;
	}
</style>