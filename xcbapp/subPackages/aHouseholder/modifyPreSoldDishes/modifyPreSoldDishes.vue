<template>
	<view class="container">
		<view class="form-container">
			<view class="form-item">
				<view class="item-header">
					<text class="label">菜名</text>
				</view>
				<view class="input-group">
					<input type="text" v-model="currentItem.goodsname" placeholder="输入名称" class="price-input" />
				</view>
			</view>

			<view class="form-item" style="display: flex; justify-content: space-between; width: 130px;">
				<view class="item-header">
					<text class="label">分类</text>
				</view>
				<picker class="picker" :range="pickerRange" :value="selectedCategoryIndex" @change="onCategoryChange">
					<view style="font-size: 40rpx;">{{ pickerRange[selectedCategoryIndex] }}</view>
				</picker>
			</view>

			<view class="form-item" style="display: flex; justify-content: space-between; width: 600rpx;">
				<view class="item-header">
					<text class="label">图片</text>
				</view>
				<image class="cimg" :src="currentItem.imglogo" mode="aspectFit" @tap="uploadcuisine">
				</image>
			</view>
		</view>

		<view class="submit-container">
			<button class="submit-btn" @click="submit">保存修改</button>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	import {
		myMixin
	} from '@/utils/public.js'
	import {
		useUpload
	} from "@/hooks/useUpload"
	export default {
		data() {
			return {
				formData: {},
				pickerRange: [],
				selectedCategoryIndex: 0,
				currentItem: {},
			}
		},
		mixins: [myMixin],
		methods: {
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
							console.log(66676, res.tempFiles[0]);
							const {
								upload,
								request
							} = useUpload({
								uploadPath: '/group1/upload',
								tempFilePaths: tempFilePaths[0],
								file: res.tempFiles[0]
							})

							upload().then((res) => {
								res = JSON.parse(res)
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

			onCategoryChange(e) {
				this.selectedCategoryIndex = e.detail.value;
				this.currentItem.category_id = this.categories[this.selectedCategoryIndex].id;
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
						console.log(this.pickerRange)
					}
				})
			},
			submit() {
				console.log(this.currentItem)
				uni.showToast({
					icon: 'loading',
					title: '正在修改....'
				})
				setTimeout(() => {
					api.updateDish({
						id:this.currentItem.id,
						goodsname:this.currentItem.goodsname,
						imglogo:this.currentItem.imglogo,
						category_id:this.currentItem.category_id,
					}).then((data) => {
						if (data.code == 200) {
							this.customizeBack()
						}
					})
				}, 2000)
			},
		},
		onLoad({
			pramas
		}) {
			if (pramas) {
				this.currentItem = JSON.parse(pramas)
			}
			this.fetchCategories()
			this.selectedCategoryIndex =  this.currentItem.category_id-1
		},
	}
</script>

<style lang="scss">
	$primary-color: #8DC9B2; // 主色调
	$secondary-color: #E6F4EC; // 辅助色
	$text-primary: #2B593E; // 主要文字色

	.container {
		padding: 32rpx;
		background: #F8FFFC;
		min-height: 100vh;
	}

	.product-header {
		margin-bottom: 48rpx;

		.product-name {
			display: block;
			font-size: 40rpx;
			color: $text-primary;
			font-weight: 600;
			line-height: 1.4;
			margin-bottom: 16rpx;
		}

		.decorative-line {
			width: 80rpx;
			height: 6rpx;
			background: $primary-color;
			border-radius: 3rpx;
		}
	}

	.form-container {
		background: #FFFFFF;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 32rpx rgba(141, 201, 178, 0.1);
		padding: 0 32rpx;
	}

	.form-item {
		padding: 40rpx 0;
		border-bottom: 2rpx solid #F0F7F3;

		&:last-child {
			border-bottom: none;
		}

		.item-header {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;

			.icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}

			.label {
				width: 40px;
				font-size: 32rpx;
				color: $text-primary;
				font-weight: 500;
			}
		}
	}

	.input-group {
		display: flex;
		align-items: center;
		height: 96rpx;
		background: $secondary-color;
		border-radius: 16rpx;
		padding: 0 32rpx;

		.currency {
			font-size: 40rpx;
			color: $primary-color;
			margin-right: 16rpx;
		}

		.price-input {
			flex: 1;
			font-size: 36rpx;
			color: $text-primary;
			height: 100%;
		}
	}

	.stock-input {
		height: 96rpx;
		background: $secondary-color;
		border-radius: 16rpx;
		padding: 0 32rpx;
		font-size: 32rpx;
		color: $text-primary;
	}

	.unit-picker {
		.picker-content {
			height: 96rpx;
			background: $secondary-color;
			border-radius: 16rpx;
			padding: 0 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 32rpx;
			color: $text-primary;

			.arrow {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.switch-item {
		.item-header {
			margin-bottom: 0;
		}
	}

	.submit-container {
		margin-top: 64rpx;
		padding: 0 32rpx;

		.submit-btn {
			height: 96rpx;
			line-height: 96rpx;
			background: linear-gradient(135deg, $primary-color, #7BCFA9);
			color: white;
			border-radius: 64rpx;
			font-size: 34rpx;
			font-weight: 500;
			box-shadow: 0 8rpx 24rpx rgba(141, 201, 178, 0.3);

			&::after {
				border: none;
			}

			&:active {
				opacity: 0.9;
			}
		}
	}
</style>