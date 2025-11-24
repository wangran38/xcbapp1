<template>
	<view class="profile-page">
		<text class="page-title">户主资料补充</text>
		<view class="form-container">
			<view class="form-item">
				<label class="form-label">真实姓名：</label>
				<input type="text" v-model="userinfo.reallyname" 
                     placeholder="请输入真实姓名" 
                     class="form-input"/>
			</view>
			<view class="form-item">
				<label class="form-label">身份证：</label>
				<input type="text" v-model="userinfo.cardnumber" 
                     placeholder="请输入身份证号码" 
                     class="form-input"/>
			</view>
			<view class="form-item avatar-item">
				<label class="form-label">头像：</label>
				<view class="avatar-wrapper">
					<image :src="userinfo.avatar" mode="aspectFit" 
                         class="avatar-image" 
                         v-show="userinfo.avatar" 
                         @click="commitAvater"/>
					<uni-icons type="plusempty" size="50" 
                            class="avatar-placeholder" 
                            @click="commitAvater" 
                            v-show="!userinfo.avatar"/>
				</view>
			</view>
			<view class="form-item">
				<label class="form-label">详细地址：</label>
				<input type="text" v-model="userinfo.address" 
                     placeholder="请输入详细地址" 
                     class="form-input"/>
			</view>
		</view>
		<view class="button-container">
			<button @click="submitForm" class="submit-btn">提交信息</button>
		</view>
	</view>
</template>

<style scoped>
/* 整体页面样式 */
.profile-page {
	padding: 40rpx 30rpx;
	background: linear-gradient(135deg, #f9f9f9 0%, #eef2f5 100%);
	min-height: 100vh;
}

.page-title {
	display: block;
	text-align: center;
	font-size: 36rpx;
	font-weight: 600;
	color: #2c3e50;
	margin: 40rpx 0;
	letter-spacing: 2rpx;
}

/* 表单容器 */
.form-container {
	border-radius: 24rpx;
	background: rgba(255,255,255,0.95);
	box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.06);
	padding: 20rpx 0;
}

/* 表单项 */
.form-item {
	padding: 32rpx 40rpx;
	display: flex;
	align-items: center;
	border-bottom: 2rpx solid #f1f3f6;
}

.form-item:last-child {
	border-bottom: none;
}

/* 标签样式 */
.form-label {
	width: 180rpx;
	font-size: 30rpx;
	color: #5a6573;
	font-weight: 500;
	flex-shrink: 0;
}

/* 输入框样式 */
.form-input {
	flex: 1;
	padding: 24rpx 32rpx;
	border-radius: 16rpx;
	background: #f8fafc;
	border: 2rpx solid #e8eef3;
	font-size: 28rpx;
	color: #34495e;
	transition: all 0.3s ease;
}

.form-input:focus {
	outline: none;
	border-color: #4dabf7;
	box-shadow: 0 0 12rpx rgba(77, 171, 247, 0.2);
}

/* 头像上传区域 */
.avatar-item {
	position: relative;
	padding: 40rpx;
}

.avatar-wrapper {
	width: 160rpx;
	height: 160rpx;
	border-radius: 24rpx;
	background: #f8fafc;
	border: 4rpx dashed #e8eef3;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	transition: all 0.3s ease;
}

.avatar-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.avatar-placeholder {
	color: #aeb8c4;
	padding: 24rpx;
	border-radius: 16rpx;
	transition: transform 0.2s ease;
}

.avatar-placeholder:active {
	transform: scale(0.95);
}

/* 提交按钮 */
.submit-btn {
	background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
	color: white;
	font-size: 32rpx;
	font-weight: 500;
	height: 96rpx;
	line-height: 96rpx;
	border-radius: 16rpx;
	box-shadow: 0 8rpx 24rpx rgba(51, 154, 240, 0.3);
	transition: all 0.3s ease;
}

.submit-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 16rpx rgba(51, 154, 240, 0.3);
}

.button-container {
	padding: 60rpx 40rpx 40rpx;
}
</style>
<script>
	import {api} from '../../../api';
	import {
		useUpload
	} from "@/hooks/useUpload"
	export default {
		data() {
			return {
				userinfo:{
					reallyname: '',
					cardnumber: '',
					avatar: '',
					address: '',
				},
				oldDataInfo:null
			};
		},
		async onLoad() {
			let res = await api.myInfo({})
			this.oldDataInfo = res.data
		},
		methods: {
			commitAvater(){
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
								this.userinfo.avatar = obj.data.url
							})
						}
					}
				});
			},
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
			async submitForm() {
				let res = await api.upFarmers({
					id:this.oldDataInfo.id,
					...this.userinfo
				})
				if (res.code == 200){
					uni.showToast({
						icon:'success',
						title:res.msg
					})
					{}
					this.customizeBack()
				}
				uni.showToast({
					icon:'error',
					title:res.msg
				})
			},
		},
	};
</script>