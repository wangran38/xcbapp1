<template>
	<view class="me-container">
		<view class="store">
			<text style="margin: 10rpx 20rpx;">补充摊铺信息</text>
			<view class="Address">
				<text>选择摊位:</text>
				
				<picker class="picker" mode="selector" :range="pickerRange1" :value="selectedCategoryIndex1"
					@change="onMarketChange">
					<view class="picker-text">{{ pickerRange1[selectedCategoryIndex1]}}</view>
				</picker>
			</view>
			
			<view class="BL1">
				<text>摊主图片:</text>
				<view class="BLpicker" @tap="chooseImage">{{ isImageSelected ? '已选择' : '选择图片' }}</view>
			</view>
			
			<view class="BL">
				<text>营业执照:</text>
				<view class="BLpicker" @tap="chooseImage2">{{ isImageSelected2 ? '已选择' : '选择图片' }}</view>
			</view>
		</view>

		<button class="submit" type="primary" @click="submitForm" :disabled="isSubmitting">提交</button>
	</view>
</template>

<script>
	import {
		api,UPLOAD_URL,getMyShops,editshop
	} from '../../api/index.js';
	import {
		useUpload
	} from "@/hooks/useUpload"
	export default {
		data() {
			return {
				marketList:[],
				pickerRange1:[],
				selectedCategoryIndex1:0,
				isImageSelected: false, // 用于标记是否选择了摊主图片
				isImageSelected2: false, // 用于标记是否选择了营业执照图片
				facelogo: '', // 摊主图片
				isSubmitting: false,
				businesslogo:'' // 营业执照
			};
		},
		mounted() {
			this.fetchMarketList(); // 获取市场列表
		},
		methods: {
			// 返回上一页
			 async customizeBack(){  
			  let canNavBack = await getCurrentPages()
			  console.log(canNavBack)
			  if( canNavBack && canNavBack.length>1) {  
			      uni.navigateBack() 
			  } else {  
			      history.back();  
			  }
			},
			onMarketChange(e) {
				this.selectedCategoryIndex1 = e.detail.value;
			},

			
			
			// 获取摊位列表
			async fetchMarketList() {
				try {
					const params = {
						limit: 100, // 设置你需要的 limit
						page: 1 // 设置你需要的 page
					};
					const res = await api.getMyShops({
						...params
					});
					if (res.code === 200) {
						const marketList = res.data.listdata.map(item => ({
							id: item.id,
							title: item.title
						}));
						this.marketList = marketList;
						this.pickerRange1 = [...marketList.map(market => market.title)];
					} else {
						console.error('Failed to fetch market list:', res.msg);
					}
				} catch (error) {
					console.error('Error fetching market list:', error);
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
								this.facelogo = UPLOAD_URL+obj.data.path;
									this.isImageSelected = true;
							})
						}
					}
				});
			},
			
			// 营业执照图片上传
			chooseImage2() {
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
								this.businesslogo = UPLOAD_URL+obj.data.path;
									this.isImageSelected2 = true;
							})
						}
					}
				});
			},


			// 提交
			async submitForm() {
				if (this.isSubmitting) return; // 如果正在提交，直接返回
				if (!this.facelogo ||  !this.businesslogo ||!this.marketList[this.selectedCategoryIndex1]) {
					uni.showToast({
						title: '请填写完整的信息',
						icon: 'none'
					});
					return;
				} 
				
				this.isSubmitting = true; // 设置为正在提交状态
				try {
					const formData = {
						facelogo: this.facelogo, // 取第一个上传的图片作为logo
						id: this.marketList[this.selectedCategoryIndex1].id,
						businesslogo:this.businesslogo

						
					};
					// 发送请求
					const response = await api.editshop(formData);

					if (response.code === 200) {
						uni.showToast({
							title: '补充成功',
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
		height: 385rpx;
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