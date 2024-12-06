<template>
	<view class="container">
		<view class="form-container">
			<form @submit.prevent="handleSubmit">
				<view class="form-item">
					<label class="label">菜品名称</label>
					<input type="text" v-model="dish.name" class="input" placeholder="请输入菜品名称" required />
				</view>

				<view class="form-item" style="position: relative;">
					<label class="label">上传实物图片 <text style="font-size: 20rpx; color: rgb(170, 0, 0)">(上传图片之后长按图片可以删除)</text></label>
					<view class="images">
						
						<image :src="item" mode="aspectFit" v-for="(item,index) in dish.imagesList" :key="item+index" @longpress="deleteItem(index)"></image>
						<uni-icons type="plusempty" size="50" @click="commitAvater" ></uni-icons>
					</view>
					
				</view>
				<button type="submit" class="submit-btn">发布菜品</button>
			</form>
		</view>
	</view>
</template>

<script>
	import {
		useUpload
	} from "@/hooks/useUpload"
	export default {
		data() {
			return {
				dish: {
					name: '',
					price: 0,
					imagesList: []
				}
			};
		},
		methods: {
			deleteItem(index){
				uni.showModal({
					content:'是否删除照片',
					complete:(res)=>{
						console.log(res)
						if (res.confirm){
							this.dish.imagesList.splice(index,1)
						}
					}
				})
				
			},
			handleSubmit() {
				console.log('提交的菜品信息：', this.dish);
			},
			commitAvater() {
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
								this.dish.imagesList.push(obj.data.url)
							})
						}
					}
				});
			},
		}
	};
</script>

<style scoped>
	.images image {
		margin: 3rpx;
		border: 1rpx solid gainsboro;
		height: 200rpx;
		width: calc(53.333% - 20px);
	}

	.images {
		
		min-height: 50rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.uni-icons {
		margin: 50rpx 0 0 90rpx;
		line-height: 100rpx;
		width: 100rpx;
		height: 100rpx;
		padding: 12rpx;
		border: 3rpx solid black;
	}

	.container {
		padding: 24px;
		background-color: #f8f8f8;
	}

	.form-container {
		background-color: #ffffff;
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		max-width: 500px;
		margin: 0 auto;
	}

	.form-item {
		margin-bottom: 20px;
	}

	.label {
		display: block;
		margin-bottom: 8px;
		font-size: 16px;
		color: #333333;
	}

	.input {
		padding: 12px;
		border: 1px solid #dddddd;
		border-radius: 8px;
		font-size: 16px;
		color: #333333;
	}

	.submit-btn {
		width: 100%;
		padding: 12px;
		background-color: #007aff;
		color: #ffffff;
		border: none;
		border-radius: 8px;
		font-size: 18px;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.submit-btn:hover {
		background-color: #005bb5;
	}
</style>