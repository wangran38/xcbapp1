<template>
	<view class="create-container">
		<uni-forms ref="formRef" :model="formData" :rules="formRules">
			<uni-card title="基本信息">
				<uni-forms-item label="供应商品" required name="selltitle" labelWidth="80px">
					<uni-easyinput v-model="formData.selltitle" placeholder="输入商品名称" />
				</uni-forms-item>
				<uni-forms-item label="产品类目" required name="category" labelWidth="80px">
					<uni-data-select v-model="formData.category_id" :localdata="categories"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="库存" required name="category" labelWidth="80px">
					<uni-easyinput v-model.number="formData.sellnumber" placeholder="输入库存" />
				</uni-forms-item>
				<uni-forms-item label="单位" required name="category" labelWidth="80px">
					<uni-easyinput v-model="formData.unit" placeholder="输入单位" />
				</uni-forms-item>
				<view style="color:darkgray"><uni-icons type="help-filled"></uni-icons> 市场价和批发价用于对比，实际以批发价为标准</view>
				<uni-forms-item label="市场价" required name="category" labelWidth="80px">
					<uni-easyinput v-model.number="formData.price" placeholder="输入市场价" />
				</uni-forms-item>
				<uni-forms-item label="批发价" required name="category" labelWidth="80px">
					<uni-easyinput v-model.number="formData.marketprice" placeholder="输入批发价" />
				</uni-forms-item>


				<uni-forms-item label="供应地区" required name="category" labelWidth="80px">
					<view style="display: flex;  align-items: center; height: 70rpx; ">
						<picker class="picker" mode="multiSelector" :range="multiArray" :value="multiIndex"
							@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
							<view style="font-size: 25rpx;">
								{{ multiArray[0][multiIndex[0]] }} - {{ multiArray[1][multiIndex[1]] }}
								-{{ selectedCountry === 'overseas' ? '' : multiArray[2][multiIndex[2]] }}
							</view>
						</picker>
					</view>
				</uni-forms-item>
				<uni-forms-item label="详细地址" required name="category" labelWidth="80px">
					<uni-easyinput v-model="formData.selladdress" placeholder="输入详细地址" />
				</uni-forms-item>

			</uni-card>

			<uni-card title="产品图片" >
				<view class="imgIcon" @click="uploadcuisine">
					<uni-icons type="plusempty" size="50" v-show="!formData.selllogo"></uni-icons>
					<image v-show="formData.selllogo" :src="formData.selllogo" alt="" style="width: 100%; height: 100%;">
				</view>
				<!-- 				<uni-file-picker v-model="formData.selllogo" fileMediatype="image" limit="1" :image-styles="imageStyles"
					@select="handleImageSelect" /> -->
			</uni-card>

			<uni-card title="供应说明">
				<textarea v-model="formData.content"
					style="box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px; width: 100%; padding: 5rpx;"></textarea>
			</uni-card>


			<view class="submit-bar">
				<view class="submit-btn" @click="handleSubmit" :disabled="submitting">
					{{ submitting ? '提交中...' : '立即发布' }}
				</view>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		api,UPLOAD_URL
	} from '@/api/index.js';
	import {
		useUpload,
	} from '@/hooks/useUpload.js'
	export default {
		data() {
			return {
				multiArray: [
					[],
					[],
					[]
				],
				selectedCountry: 'china',
				multiIndex: [0, 0, 0],
				formData: {
					selltitle: null, // 商品名称
					content: null, // 供应说明
					sellnumber: 0, // 批发数量
					unit: 0, // 单位
					selladdress: null, // 供应详细地址
					price: 0, // 市场价
					marketprice: 0, // 批发价
					category_id: null, // 所售分类
					selllogo: null, //  logo
				},
				categories: [
				],
				submitting: false,
				imageStyles: {
					width: 200,
					height: 200,
					border: {
						color: '#eee',
						width: 1,
						style: 'solid'
					}
				},
				formRules: {
					selltitle: {
						rules: [{
								required: true,
								errorMessage: '标题不能为空'
							},
							{
								minLength: 5,
								maxLength: 30,
								errorMessage: '长度需5-30个字符'
							}
						]
					},
					category: {
						rules: [{
							validate: (val) => val?.length === 3,
							errorMessage: '请完整选择三级分类'
						}]
					},

				}
			}
		},
		mounted() {
			this.initializePicker();
			this.fetchCategories()
		},
		methods: {
			initFormData(){
				this.formData = {
					selltitle: null, 
					content: null, 
					sellnumber: 0,
					unit: 0, 
					selladdress: null, 
					price: 0,
					marketprice: 0, 
					category_id: null, 
					selllogo: null, 
				}
			},
			async fetchCategories() {
				const response = await api.cglist()
				this.categories = response.data.listdata.map(item=>{
					return {value:item.id,text:item.content}
				})
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
				// this.multiIndex = e.detail.value;
				this.formData.area_id = this.districtList[this.multiIndex[2]]['id']

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
					console.log(error)
				}
			},

			// 上传菜品图片
			uploadcuisine() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed', 'original'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						const tempFilePaths = res.tempFilePaths;
						console.log(res)
						if (tempFilePaths.length > 0) {
							const {
								upload,
								request
							} = useUpload({
								uploadPath: '/group1/upload',
								file: res.tempFiles[0],  // 传输文件对象
								tempFilePaths: tempFilePaths[0] // 传输文件路径
							})
							
							upload().then((res) => {
								var obj = JSON.parse(res);
								// this.imglogo = UPLOAD_URL + obj.data.path
								this.formData.selllogo =  UPLOAD_URL + obj.data.path
							})
						}
					}
				});
			},
			







			async handleSubmit() {
				let res = await api.publishWholesale(this.formData)
				if (res.code == 200) {
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					})
					this.initFormData()
				} else {
					uni.showToast({
						title: '发布失败',
						icon: 'error'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.imgIcon{
		border-width: 1px;
		border-style: solid;
		border-color: rgb(238, 238, 238);
		border-radius: 3px;
		height: 200px;
		padding-top: 0px;
		width: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	/deep/ .uni-card {
		overflow: visible !important;
	}

	.create-container {
		padding: 20rpx;

		.image-tip {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// color: $uni-text-color-grey;
			font-size: 24rpx;
			padding: 20rpx 0;

			.privacy-switch {
				display: flex;
				align-items: center;
				gap: 10rpx;
			}
		}

		.price-ladder {
			.price-item {
				display: flex;
				align-items: center;
				gap: 20rpx;
				margin-bottom: 30rpx;

				.input-group {
					flex: 1;
					display: flex;
					gap: 10rpx;
					align-items: center;

					.unit {
						// color: $uni-text-color-grey;
						padding: 0 10rpx;
					}

					.uni-easyinput {
						flex: 1;
					}
				}

				.remove-btn {
					// color: $uni-color-error;
					padding: 10rpx;
					font-size: 40rpx;
				}
			}

			.add-btn {
				margin-top: 20rpx;
				// background: $uni-color-primary-light;
				// color: $uni-color-primary;
				border: none;

				&:active {
					// background: darken($uni-color-primary-light, 10%);
				}
			}
		}

		.submit-bar {
			position: sticky;
			bottom: 0;
			background: white;
			padding: 30rpx 0;
			box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

			.submit-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #007aff;
				color: white;
				height: 80rpx;
				border-radius: 40rpx;
				font-size: 32rpx;

			}
		}
	}
</style>