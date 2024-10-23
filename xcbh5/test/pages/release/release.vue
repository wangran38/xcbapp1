<template>
	<view class="me-container">
		<view class="content">
			<view class="name">
				<text class="title">菜名</text>
				<view class="item">
					<view class="picture">
						<input class="input-text" type="text" placeholder="请输入菜名" v-model="goodsname" />
					</view>

					<uni-icons class="rigicon" type="right" size="14" color="rgb(229, 229, 229)"></uni-icons>
				</view>

			</view>


			<view class="price">
				<text class="title">分类</text>
				<view class="item">
					<picker class="picker" :range="pickerRange" :value="selectedCategoryIndex"
						@change="onCategoryChange">
						<view class="picker-text">{{ pickerRange[selectedCategoryIndex] }}</view>
					</picker>

					<uni-icons class="rigicon" type="right" size="14" color="rgb(229, 229, 229)"></uni-icons>
				</view>

			</view>

			<view class="img" @tap="uploadcuisine">
				<text class="title">图片</text>
				<view class="item">
					<view class="picture">
						<view v-if="!imglogo">请上传图片</view>
						<image v-else :src="imglogo" class="uploaded-image" mode="aspectFit"></image>
						<!-- {{ imageUploaded ? '已上传' : '请上传图片' }} -->
					</view>
					<uni-icons class="rigicon" type="right" size="14" color="rgb(229, 229, 229)"></uni-icons>
				</view>

			</view>
			<view class="submit" @tap="submit">
				提交
			</view>
		</view>
		<text style="color: red;margin-top: 30rpx;font-size: 30rpx;">注意：添加菜品后要在菜品列表里面选择上架</text>
	</view>
</template>

<script>
	import {
		api,
		UPLOAD_URL
	} from '../../api/index.js';
	import {
		useUpload,
		compressPictures
	} from "@/hooks/useUpload"
	import Compressor from 'compressorjs';
	export default {
		data() {
			return {
				Image:'',
				goodsname: '',
				category_id: '',
				// price: '',
				imageUploaded: false, // 图片上传状态
				imglogo: '', // 存储图片地址
				categories: [],
				pickerRange: [],
				selectedCategoryIndex: 0,
			}
		},
		onLoad() {
			this.fetchCategories();
		},
		methods: {
			
			// 返回上一页
			async customizeBack() {
				let canNavBack = await getCurrentPages()
				if (canNavBack && canNavBack.length > 1) {
					uni.navigateBack()
				} else {
					history.back();
				}
			},
			// 请求菜品分类数据
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
						this.pickerRange = ['请选择分类', ...categories.map(category => category.content)];
						if (categories.length > 0) {
							this.category_id = categories[0].id; // 默认选择第一个分类
						}
					} else {
						uni.showToast({
							title: res.message || '获取分类失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error(err);
					uni.showToast({
						title: '获取分类失败',
						icon: 'none'
					});
				});
			},
			
			// 上传菜品图片
			uploadcuisine() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed', 'original'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						const tempFilePaths = res.tempFilePaths;
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
								this.imglogo = UPLOAD_URL + obj.data.path
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
			onCategoryChange(e) {
				const selectedIndex = e.detail.value;
				this.selectedCategoryIndex = selectedIndex;

				// 检查用户是否选择了有效的分类（跳过第一个默认项）
				if (selectedIndex > 0) {
					this.category_id = this.categories[selectedIndex - 1].id; // -1 是因为 `pickerRange` 的第一项是提示
				} else {
					this.category_id = ''; // 用户选择了默认提示项，重置 `category_id`
				}
			},
			submit() {
				console.log(this.goodsname,this.category_id)
				if (!this.goodsname || !this.category_id || !this.imglogo) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}

				api.addgoods({
					category_id: this.category_id,
					goodsname: this.goodsname,
					imglogo: this.imglogo, // 直接传递图片地址
					// price: parseFloat(this.price)
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '菜品添加成功',
							icon: 'success',
							duration: 1000
						}).then(() => {
							setTimeout(() => {
								// 是否继续添加菜品
								uni.showModal({
									title: "是否继续添加菜品",
									cancelText: '否',
									confirmText: '是',
									success: (res) => {
										if (res.confirm) {
											console.log("继续添加")
										} else {
											this.customizeBack()
										}
									},
								})
							}, 1000)
						})

						// 蔬菜名字清空
						this.goodsname = '';
						this.imglogo = '';
						this.imageUploaded = false;
					} else {
						uni.showToast({
							title: res.msg || '添加失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error(err);
					uni.showToast({
						title: '添加失败',
						icon: 'none'
					});
				});
			}

		}
	}
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

	.content {
		margin-top: 30rpx;
		background-color: white;
		flex: 4;
		display: flex;
		flex-direction: column;
		padding: 0 10rpx;
	}

	.name {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		/* flex: 1; */
	}

	.price {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		/* flex: 1; */
	}

	.img {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		/* flex: 1; */
	}

	.title {
		width: 100rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		/* font-size: 34rpx; */
		color: #666666;
	}

	.item {
		width: 250rpx;
		height: 80rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		margin-left: auto;
		/* 将item推到父容器的右边 */
		align-items: center;
		/* justify-content: center; */
	}

	.rigicon {
		/* background-color: bisque; */
		width: 50rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
	}

	.picker {
		width: 250rpx;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		/* background-color: #007aff; */
	}

	.picker-text {
		/* width: 250rpx; */
		height: 100%;
		color: #808080;
		font-size: 25rpx;
	}

	.picture {
		width: 250rpx;
		text-align: center;
		color: #808080;
		font-size: 25rpx;
	}

	.submit {
		/* flex: 1; */
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		color: white;
		font-size: 36rpx;
		font-weight: 500;
		margin: 20rpx 0;
		background-color: #007aff;
		border-radius: 20rpx;
	}

	.input-text {
		color: #808080;
		border: none;
		outline: none;
		box-shadow: none;
		font-size: 25rpx;
	}

	.uploaded-image {
		height: 100rpx;
		width: 100rpx;
	}
</style>