<template>
	<view class="me-container">
		<view class="content">
			<view class="avatar">
				<view class="title">头像</view>
				<view class="avatar-box" @click="chooseImage">
					<image :src="user.Headimgurl  || 'http://h5.xcbdsc.com/static/morentouxiang.jpg'" class="avatar-image" mode="aspectFill"></image>
				</view>
			</view>

			<view class="name">
				<view class="title">昵称</view>
				<view class="name-item">
					<input class="input-text" type="text" placeholder="请输入昵称" v-model="user.nickname" />
					<uni-icons class="rigicon" type="right" size="14" color="rgb(229, 229, 229)"></uni-icons>
				</view>
			</view>
			<view class="phone">
				<view class="title">电话</view>
				<view class="name-item">
					<input class="input-text" type="text" placeholder="请输入电话" v-model="user.phone" />
					<uni-icons class="rigicon" type="right" size="14" color="rgb(229, 229, 229)"></uni-icons>
				</view>
			</view>
			<view class="sex">
				<view class="title">性别</view>
				<view class="name-item">
					<!-- <input class="input-text" type="number" placeholder="请输入性别" v-model="user.sex" /> -->
					<picker class="input-text" :range="sexOptions" @change="handleSexChange">
						<!-- <view class="picker"> -->
						{{ sexOptions[user.sex] }}
						<!-- </view> -->
					</picker>
					<uni-icons class="rigicon" type="right" size="14" color="rgb(229, 229, 229)"></uni-icons>
				</view>
			</view>
			<button class="submit" @click="submitForm" :disabled="isSubmitting">
							提交
			</button>
		</view>
	</view>
</template>

<script>
	import {
		api,UPLOAD_URL 
	} from '../../api/index.js'; // 确保路径正确
	import {
		useUpload
	} from "@/hooks/useUpload";
	export default {
		data() {
			return {
				user: {
					Headimgurl: '',
					nickname: '',
					phone: '',
					sex: ''
				},
				sexOptions: ['未知', '男', '女'],
				isSubmitting: false
			}
		},
		onShow() {
			if (this.checkToken()){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
		},
		onLoad() {
			// 从本地存储中获取 token
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}

			// 从后端获取用户数据
			api.getUserProfile(token)
				.then(response => {
					console.log('用户数据:', response.data);
					this.user = response.data;
					this.user.nickname = response.data.name;
					this.user.sex = this.mapSexFromBackend(response.data.sex);
				})
				.catch(error => {
					console.error('获取用户数据失败', error);
					uni.showToast({
						title: '获取用户数据失败',
						icon: 'none'
					});
				});
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
			handleSexChange(e) {
				this.user.sex = Number(e.detail.value); // 更新性别
			},
			mapSexFromBackend(sex) {
				return sex === 2 ? 2 : (sex === 1 ? 1 : 0);
			},
			mapSexToBackend(sex) {
				return sex === 2 ? 2 : (sex === 1 ? 1 : 0);
			},
			//头像						
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed','original'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// console.log(res.data.path);
						const tempFilePaths = res.tempFilePaths;
						if (tempFilePaths.length > 0) {
							console.log(tempFilePaths);
							const {upload,request} = useUpload({
								uploadPath: '/group1/upload',
								tempFilePaths: tempFilePaths[0],
								file:res.tempFiles[0]
							})

							upload().then((res) => {
								var obj = JSON.parse(res);
								// console.log(obj.data);
								this.user.Headimgurl = UPLOAD_URL+obj.data.path
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


			submitForm() {
				this.isSubmitting = true;
				api.editUserProfile(this.user)
					.then(response => {
						console.log('修改成功', response);
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						});
					})
					.catch(error => {
						console.error('修改失败', error);
						uni.showToast({
							title: '修改失败',
							icon: 'none'
						});
					})
				.finally(() => {
					this.isSubmitting = false;
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
		height: 500rpx;
		display: flex;
		flex-direction: column;
		background-color: white;
		color: black;
		padding: 20rpx;
		flex: 5;
	}

	.name,
	.phone,
	.sex,
	.avatar {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.name-item {
		height: 100rpx;
		width: 50%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		/* background-color: aqua; */
	}

	.avatar-box {
		height: 100rpx;
		width: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		/* background-color: aqua; */
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.title {
		height: 100rpx;
		width: 80rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 34rpx;
		color: #666666;
		/* background-color: #007aff; */
	}

	.input-text {
		height: 80rpx;
		width: 100%;
		color: black;
		text-align: right;
		line-height: 80rpx;
		margin-right: 20rpx;
		/* background-color: #007aff; */
	}

	.rigicon {
		height: 80rpx;
		width: 50rpx;
		text-align: center;
		line-height: 80rpx;
	}

	.submit {
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
	.submit[disabled] {
			color: #ccc; /* 提交按钮禁用时的颜色 */
		}
</style>