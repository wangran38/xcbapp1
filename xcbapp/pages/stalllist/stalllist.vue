<template>
	<view class="me-container">
		<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower"
			:style="{ height: '100vh' }">
			<view v-for="item in pageData" :key="item.id" class="item-list">
				<view class="logo" @click="gotostaldis(item.id)">
					<image class="logos" v-if="isloaded"  lazy-load :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="info" @click="gotostaldis(item.id)">
					<view class="message">菜市场名称：{{ item.market_name}}</view>
					<view class="message">摊位名称：{{ item.title }}</view>
					<view class="message">摊位编号：{{ item.id }}</view>
				</view>
				<view class="interface">
					<view class="edit" @click="editShop(item)">编辑</view>
					<view class="delete" @click="deleteShop(item)">删除</view>
				</view>

			</view>
			<view v-if="pageLoading" class="loading">加载中...</view>
			<view v-if="!hasMore" class="loading">没有更多了</view>
		</scroll-view>
		<!-- 编辑弹出层代码 -->
		<view v-if="showEditPopup" class="popup-overlay" @click="closePopup">
			<view class="popup" @click.stop>
				<view class="close-button" @click="closePopup">×</view>
				<!-- <view class="popup-header">修改商品信息</view> -->

				<!-- 在这里添加你的表单内容 -->
				<view class="popup-content">

					<view class="content">
						<view class="cuisine">
							<view class="title">摊位名称</view>
							<view class="shuru"><input class="shurucon" type="text" v-model="currentShopTitle" />
							</view>
						</view>

						<view class="editimg">
							<view class="title">摊位图片</view>
							<image class="cimg" :src="currentShopLogo" mode="aspectFit" @tap="uploadcuisine">
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
	</view>
</template>


<script>
	import {
		api
	} from '@/api'; // 根据你的项目路径引入
	import usePage from '@/hooks/usePage';
	import {
		useUpload
	} from "@/hooks/useUpload"
	export default {
		data() {
			return {
				pageData: [],
				shopList: [], // 用于存储摊位列表数据
				// marketList: [], // 用于存储市场列表数据
				imageUploaded: false,
				showEditPopup: false,
				currentShopTitle: '',
				currentShopLogo: '',
				isloaded:false,
			}
		},
		mixins: [usePage],
		onLoad() {
			this.isloaded = true;
		},
		created() {
			this.reloadData()
			// this.fetchMarketList(); // 获取市场列表
			// this.fetchShopList();	
		},
		methods: {
			async deleteShop(item){
				let res = await api.editshop({
					id:item.id,
					isshow:2
				})
				if (res.code == 200){
					uni.showToast({
						title:'删除成功',
						icon:'success'
					})
					this.reloadData()
				}
			},
			
			// 获取摊位列表
			async fetchData(params) {
				try {
					const response = await api.getMyShops({
						...params
					});
					// this.querySuccess(response.data);
					return response.data;
				} catch (error) {
					console.error('获取摊位列表失败', error);
					uni.showToast({
						title: '获取摊位列表失败',
						icon: 'none'
					});
				}
			},

			// 编辑
			editShop(item) {
				this.currentShopId = item.id;
				this.currentShopTitle = item.title;
				this.currentShopLogo = item.logo;
				this.showEditPopup = true; // 显示弹出层

			},
			closePopup() {
				this.showEditPopup = false; // 隐藏弹出层
			},
			//确认事件
			async confirmEdit(data) {
				// 在这里处理修改的确认逻辑
				// 检查当前商品 ID 是否有效
				if (!this.currentShopTitle) {
					uni.showToast({
						title: '请输入摊位名称',
						icon: 'none'
					});
					return;
				}

				// 检查图片上传状态或显示上传错误
				if (!this.imageUploaded && !this.currentShopLogo) {
					uni.showToast({
						title: '请上传图片',
						icon: 'none'
					});
					return;
				}

				// 调用 editshop API 进行修改
				try {
					console.log('Calling editshop API');
					const response = await api.editshop({
						id: this.currentShopId,
						title: this.currentShopTitle,
						logo: this.currentShopLogo
					});
					if (response.code === 200) {
						uni.showToast({
							title: '摊位信息修改成功',
							icon: 'success'
						});
						this.reloadData(); // 重新加载数据
						this.closePopup(); // 关闭弹出层
					} else {
						uni.showToast({
							title: response.msg || '摊位信息修改失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '修改失败，请稍后重试',
						icon: 'none'
					});
				}
			},
			// 上传图片
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
							// console.log(tempFilePaths);
							const {
								upload,
								request
							} = useUpload({
								uploadPath: '/group1/upload',
								file: res.tempFiles[0],
								tempFilePaths: tempFilePaths[0]
							})

							upload().then((res) => {
								res = JSON.parse(res)
								this.currentShopLogo = res.data.url;
								console.log('更新后的图片路径:', this.currentShopLogo);
								this.isImageSelected = true;
								this.imageUploaded = true; // 更新图片上传状态
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


			gotostaldis(itemId) {
				uni.navigateTo({
					url: `/pages/Stalls-dishes/Stalls-dishes?id=${itemId}`
				});
			},
		}
	}
</script>


<style>
	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 30rpx 0 30rpx;
		color: white;
		z-index: 1;
		background-color: #f4f4f4;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.item-list {
		height: 200rpx;
		width: 100%;
		margin-top: 15rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background-color: #ffffff;
		border-radius: 20rpx;
	}

	.logo {
		height: 180rpx;
		width: 30%;
		text-align: center;
		line-height: 200rpx;
		background-color: #1296db;
		border-radius: 20rpx;
		/* padding: 10rpx 10rpx; */
	}

	.logos {
		height: 180rpx;
		width: 100%;
		border-radius: 20rpx;
	}

	.info {
		height: 200rpx;
		width: 50%;
		margin-left: 10rpx;
		/* 设置info和logo之间的间距 */
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		flex: 1;
		/* 确保info占据剩余空间 */
		overflow: hidden;
		/* 确保内容不溢出 */
	}

	.message {
		width: 100%;
		margin: 10rpx;
		/* 调整这个值以改变上下间距 */
		color: black;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.interface {
		height: 100%;
		width: 20%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: auto;
		/* 设置interface与info的间距 */
		position: relative;
		/* margin-right: 0rpx; */
		/* background-color: #1296db; */
	}

	.interface>.edit {
		text-align: center;
		color: white;
		font-size: 30rpx;
		width: 100rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: #1296db;
		border-radius: 20rpx;
		margin-bottom: 20rpx;

	}

	.interface>.delete {
		text-align: center;
		color: white;
		font-size: 30rpx;
		width: 100rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: #ff1909;
		border-radius: 20rpx;
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
		position: absolute;
		top: 5rpx;
		right: 5rpx;
		font-size: 40rpx;
		color: black;
		cursor: pointer;
		z-index: 10;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		border-radius: 50%;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	}

	.cimg {
		width: 100rpx;
		height: 100rpx;
	}

	.content {
		width: 100%;
		height: 200rpx;
	}

	.cuisine {
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

	.title {
		font-size: 35rpx;
	}

	.shuru {
		width: auto;
		height: 100rpx;
		display: flex;
		justify-content: end;
		align-items: center;
	}

	.shurucon {
		text-align: right;
		font-size: 35rpx;
	}
</style>