<template>
	<view class="me-container">
		<!-- 其他内容 -->
		<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower"
			:style="{ height: '100vh' }" lower-threshold="10">
			<view class="disheslist">
				<view class="type" v-for="item in pageData" :key="item.id">
					<image class="type-image" v-if="isloaded" lazy-load :src="item.imglogo " mode="scaleToFill"></image>
					<view class="regard">
						<view class="typetitle">
							{{item.goodsname}}
						</view>
					</view>

					<view class="function">
						<view class="rigicon" @click="edit(item)">修改</view>
						<view class="rigicon"  style="background-color: #67c23a" @click="shelves(item)">上架</view>
						<view class="rigicon" style="background-color: #f56c6c" @click="removeItem(item)">删除</view>
					</view>
				</view>
				<view v-if="pageLoading" class="loading">加载中...</view>
				<view v-if="!hasMore" class="loading">没有更多了</view>
			</view>

		</scroll-view>
		
		<view class="butt" @click="goTorelePage">
			点击新增菜品
		</view>
		<!-- 编辑弹出层 -->
		<view v-if="showEditPopup" class="popup-overlay" @click="closePopup">
			<view class="popup" @click.stop>
				<view class="close-button" @click="closePopup">×</view>
				<!-- <view class="popup-header">修改商品信息</view> -->

				<!-- 在这里添加你的表单内容 -->
				<view class="popup-content">
					<!-- 表单或其他内容 -->

					<view class="content">
						<view class="cuisine">
							<view class="title">菜名</view>
							<view class="shuru"><input class="shurucon" type="text" v-model="currentItem.goodsname" />
							</view>
						</view>
						<view class="class">
							<view class="title">分类</view>
							<picker class="picker" :range="pickerRange" :value="selectedCategoryIndex"
								@change="onCategoryChange">
								<view class="picker-text">{{ pickerRange[selectedCategoryIndex] }}</view>
							</picker>
						</view>
						<view class="editimg">
							<view class="title">图片</view>
							<image class="cimg" :src="currentItem.imglogo" mode="aspectFit" @tap="uploadcuisine">
							</image>
						</view>
					</view>
				</view>
				<view class="popup-footer">
					<button @click="closePopup">取消</button>
					<button @click="confirmEdit" style="background-color: #007aff;color: white;">确认</button>
				</view>
			</view>
		</view>
		<!-- 上架弹出层 -->
		<view v-if="showEditPopup1" class="popup-overlay" @click="closePopup">
			<view class="popup" @click.stop>
				<view class="close-button" @click="closePopup">×</view>
				<view class="popup-header">{{currentItem.goodsname}}</view>
				<!-- 在这里添加你的表单内容 -->
				<view class="popup-content">
					<!-- 表单或其他内容 -->

					<view class="content">
						<view class="cuisine">
							<view class="title">选择摊位</view>

							<picker class="picker1" :range="pickerRange1" :value="selectedCategoryIndex1"
								@change="onMarketChange">
								<view class="picker-text">{{ pickerRange1[selectedCategoryIndex1]}}</view>
							</picker>
						</view>
						<view class="editimg">
							<view class="title">菜品价格</view>
							<view class="shuru"><input class="shurucon" type="text" placeholder="请输入价格"
									v-model="itemPrice" /></view>
							<view class="unit">元/</view>
							<view class="example-body" @click="clicKexampleBody">
								<view class="unit">{{unit?unit:'单位'}}</view>
								<view class="icon"><uni-icons :type="iconStatus ? 'up':'down'" size="20"></uni-icons>
								</view>
								
							</view>
							<view class="items" v-show="isShowItems">
								<view class="item" v-for="pop in candidates" @click="selectItem(pop)">
									{{pop}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-footer">
					<button @click="closePopup">取消</button>
					<button @click="confirmShelves" style="background-color: #007aff;color: white;">确认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index'
	import usePage from '@/hooks/usePage';
	import {
		useUpload
	} from "@/hooks/useUpload"
	export default {
		data() {
			return {
				pageData: [],
				showEditPopup: false,
				currentItem: {},
				categories: [],
				pickerRange: [],
				selectedCategoryIndex: 0,
				imageUploaded: false,
				// imglogo: '',
				showEditPopup1: false,
				pickerRange1: [],
				selectedCategoryIndex1: 0,
				itemDescription: '', // 上架时的详细说明
				itemPrice: '', // 上架时的价格
				marketList: [], // 存储摊位列表
				candidates: ['斤', '两','瓶','桶','个'],
				candidate2: ['元'],
				unit: '',
				unit2: '',
				tijiaoPrice: '',
				isloaded: false,
				iconStatus: true,
				isShowItems: false
			}
		},
		mixins: [usePage],
		onLoad() {
			this.isloaded = true;
		},
		onShow() {
			this.reloadData()
		},

		methods: {
			async removeItem(item){
				let requestsData = {
					id:item.id,
					isshow:2
				}
				console.log(item,requestsData)
				let res = await api.editgoods(requestsData)
				if (res.code == 200){
					uni.showToast({
						title:'删除成功',
						icon:'success'
					})
					// 重新加载数据
					this.reloadData()
				}else{
					uni.showToast({
						title:'删除失败',
						icon:'error'
					})
				}
				
			},
			// 打开选择单位
			clicKexampleBody() {
				this.iconStatus = !this.iconStatus
				this.isShowItems = !this.isShowItems
			},
			// 选择单位
			selectItem(val) {
				this.unit = val
				this.iconStatus = !this.iconStatus
				this.isShowItems = !this.isShowItems
			},
			fetchCategories() {
				api.cglist().then(res => {
					if (res.code === 200) {
						// 获取分类数据
						const categories = res.data.listdata.map(item => ({
							id: item.id,
							content: item.content
						}));
						// 存储分类数据
						this.categories = categories;
						// 初始化 picker 的范围数据，包括默认提示项
						this.pickerRange = [...categories.map(category => category.content)];
					}
				})
			},
			async fetchMarketList() {
				try {
					const token = uni.getStorageSync('token'); // 请根据实际情况获取 token
					const params = {
						limit: 100, // 设置你需要的 limit
						page: 1 // 设置你需要的 page
					};
					const res = await api.getMyShops({
						token: this.token,
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
			onCategoryChange(e) {
				this.selectedCategoryIndex = e.detail.value;
				this.currentItem.category_id = this.categories[this.selectedCategoryIndex].id;
			},
			onMarketChange(e) {
				this.selectedCategoryIndex1 = e.detail.value;
				this.currentItem.market_id = this.marketList[this.selectedCategoryIndex1].id;
			},
			async fetchData(params) {
				const response = await api.getCommdityList(params)
				return response.data

			},
			// 你的方法
			goTorelePage() {
				uni.navigateTo({
					url: '/pages/release/release'
				});
			},
			edit(item) {
				this.currentItem = {
					...item
				};
				this.fetchCategories(); // 获取分类数据
				this.showEditPopup = true; // 显示弹出层
				// 调用获取菜品详情的方法
				this.fetchCommodityDetails(item.id);
				// 检查用户是否选择了有效的分类（跳过第一个默认项）
			},
			fetchCommodityDetails(id) {
				api.getCommodityDetails(id).then(res => {
					if (res.code === 200) {
						const commodity = res.data.listdata[0];
						this.currentItem.goodsname = commodity.goodsname;
						this.currentItem.imglogo = commodity.imglogo;

						// 根据分类 ID 找到对应的分类索引
						const categoryIndex = this.categories.findIndex(cat => cat.id === commodity.category_id);
						if (categoryIndex !== -1) {
							this.selectedCategoryIndex = categoryIndex;
						}
					}
				})
			},
			uploadcuisine() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// const tempFilePaths = res.tempFilePaths;
						// this.uploadImage(tempFilePaths[0]);
						// this.isImageSelected = true; // 更新图片选择状态
						const tempFilePaths = res.tempFilePaths;
						if (tempFilePaths.length > 0) {
							console.log(66676,res.tempFiles[0]);
							const {
								upload,
								request
							} = useUpload({
								uploadPath: '/group1/upload',
								tempFilePaths: tempFilePaths[0],
								file:res.tempFiles[0]
							})

							upload().then((res) => {
								res  = JSON.parse(res)
								this.currentItem.imglogo = res.data.url;
								// console.log('更新后的图片路径:', this.currentItem.imglogo);
								// this.isImageSelected = true;
								// this.imageUploaded = true; // 更新图片上传状态
							})
							// api.uploadImage(tempFilePaths[0])
							// 	.then(data => {
							// 		this.user.headimgurl = data.url; // 更新头像 URL
							// 	})
							// 	.catch(error => {
							// 		uni.showToast({
							// 			title: '上传失败',
							// 			icon: 'none'
							// 		});
							// 	});
						}
					}
				});
			},

			shelves(item) {
				this.currentItem = {
					...item
				};
				console.log(this.currentItem)
				this.showEditPopup1 = true; // 显示弹出层
				this.fetchMarketList(); // 获取摊位列表
			},
			closePopup() {
				this.showEditPopup = false; // 隐藏弹出层
				this.showEditPopup1 = false;
				
				// 清空值
				this.itemPrice = ''
			},
			//确认事件
			confirmEdit() {
				// 在这里处理修改的确认逻辑
				// 检查当前商品 ID 是否有效
				if (!this.currentItem.id) {
					uni.showToast({
						title: '商品 ID 不正确',
						icon: 'none'
					});
					return;
				}

				// 检查图片上传状态或显示上传错误
				if (!this.imageUploaded && !this.currentItem.imglogo) {
					uni.showToast({
						title: '请上传图片',
						icon: 'none'
					});
					return;
				}

				// 调用 editGoods API 进行修改
				const {
					id,
					category_id,
					goodsname,
					imglogo
				} = this.currentItem;
				api.editGoods({
					id,
					category_id,
					goodsname,
					imglogo
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '商品修改成功',
							icon: 'success'
						});
						this.reloadData(); // 重新加载数据
						this.closePopup(); // 关闭弹出层
					} else {
						uni.showToast({
							title: res.msg || '商品修改失败',
							icon: 'none'
						});
					}
				})
			},

			confirmShelves() {
				console.log('Goods ID:', this.currentItem.id);

				if (!this.itemPrice) {
					uni.showToast({
						title: '请填写价格',
						icon: 'none'
					});
					return;
				}
				if (!this.unit) {
					uni.showToast({
						title: '请选择单位',
						icon: 'none'
					});
					return;
				}
				api.addCommodityToShop({
					goods_id: this.currentItem.id,
					shop_id: this.marketList[this.selectedCategoryIndex1].id,
					content: this.itemDescription,
					price: parseFloat(this.itemPrice),
					weight_name: this.unit
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '上架成功'
						});
						this.closePopup();
						this.reloadData();
					} else {
						uni.showToast({
							title: '上架失败',
							icon: 'none'
						});
					}
				});
			},
		}
	}
</script>

<style>
	.items {
		border-radius: 5rpx;
		z-index: 10000;
		position: absolute;
		top: 232rpx;
		left: 468rpx;
		width: 15%;
		padding: 10rpx;
		background-color: white;
		border: 1px solid gray;
	}

	.item {
		width: 100%;
		border-bottom: 1px dashed gray;
	}

	.me-container {
		/* overflow: hidden; */
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 40rpx 0 40rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		position: relative;
		height: calc(100vh -10rpx);
	}

	.butt {
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
		padding: 30rpx 30rpx;
		background-color: #007BFF;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}

	.disheslist {
		width: 100%;
		height: 1200rpx;
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.type {
		padding: 10rpx;
		height: 12%;
		/* width: 90%; */
		display: flex;
		flex-direction: row;
		background-color: white;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 30rpx;
		box-shadow: 5rpx 5rpx  5rpx rgba(0, 0, 0, .3);
		border-radius: 5rpx;
	}

	.type-image {
		height: 130rpx;
		width: 130rpx;
		border-radius: 20rpx;
		background-color: #007aff;
	}

	.regard {
		width: 30%;
		height: 180rpx;
		color: black;
		font-size: 30rpx;
		position: relative;
		top: 60rpx;
		left: 20rpx;
	}



	/* .price {
		align-self: self-start;
	} */
	.function {
		display: flex;
		height: 100%;
		width: 250rpx;
		margin-left: auto;
		justify-content: space-around;
		align-items: center;
	}

	.rigicon {
		font-weight: bold;
		font-size: 25rpx;
		height: 70rpx;
		width: 150rpx;
		background-color: #007aff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		margin-left: 5rpx;
	}

	.loading {
		text-align: center;
		padding: 20rpx;
		color: #999;
	}


	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		color: black;
	}

	.popup {
		position: relative;
		width: 80%;
		max-width: 600rpx;
		background-color: white;
		border-radius: 20rpx;
		padding: 20rpx;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
	}

	.popup-header {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.popup-content {
		/* 这里你可以添加弹出层内容的样式 */
		display: flex;
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		justify-content: center;
		align-items: center;
	}

	.popup-footer {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx;
	}

	.close-button {
		padding: 10rpx;
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		font-size: 50rpx;
		color: black;
		cursor: pointer;
		z-index: 10;
		width: 50rpx;
		height: 50rpx;
		text-align: center;
		line-height: 45rpx;
		background-color: #ffffff;
		border-radius: 50%;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	}

	.content {
		width: 100%;
		height: 300rpx;
	}

	.cuisine {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.class {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.editimg {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cimg {
		width: 100rpx;
		height: 100rpx;
	}

	.picker {
		width: 100rpx;
		height: 100rpx;
		display: flex;
		justify-content: end;
		align-items: center;
		font-size: 35rpx;
	}

	.shuru {
		width: auto;
		height: 100rpx;
		display: flex;
		justify-content: end;
		align-items: center;
	}

	.example-body {
		border-radius: 10rpx;
		padding: 10rpx;
		margin: 10rpx 0 0 20rpx;
		border: 1px solid gray;
		background-color: white;
		display: flex;
		justify-content: space-between;
		min-width: 100rpx;
	}
	
	.unit{
		font-size: 28rpx;
	}

	.shurucon {
		text-align: end;
		font-size: 30rpx;
	}

	.title {
		width: 40%;
		font-size: 30rpx;
	}

	.picker1 {
		width: 300rpx;
		height: 100rpx;
		display: flex;
		justify-content: end;
		align-items: center;
		font-size: 30rpx;
	}
</style>