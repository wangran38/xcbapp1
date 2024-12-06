<template>
	<view class="profile-page">
		<text style="display: block; text-align: center; font-size: 30rpx; font-weight: bold;">户主资料补充</text>
		<view class="form-item">
			<label>真实姓名：</label>
			<input type="text" v-model="userinfo.reallyname" placeholder="请输入真实姓名" />
		</view>
		<view class="form-item">
			<label>身份证：</label>
			<input type="text" v-model="userinfo.cardnumber" placeholder="请输入身份证号码" />
		</view>
		<view class="form-item" style="position: relative;" >
			<label>头像：</label>
			<image :src="userinfo.avatar" mode="aspectFit"  v-show="userinfo.avatar" @click="commitAvater"></image>
			<uni-icons type="plusempty" size="50" @click="commitAvater" v-show="!userinfo.avatar"></uni-icons>
		</view>
		<view class="form-item">
			<label>详细地址：</label>
			<input type="text" v-model="userinfo.address" placeholder="请输入详细地址" />
		</view>
		<view class="button-container">
			<button @click="submitForm">提交</button>
		</view>
	</view>
</template>


<style scoped>
	.uni-icons {
		padding: 12rpx;
		position: absolute;
		left: 180rpx;
		border: 3rpx solid black;
	}

	.profile-page {
		padding: 20px;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.form-item {
		border-radius: 10rpx;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
		padding: 20rpx;
		background-color: white;
		margin: 60rpx;
		display: flex;
		align-items: center;
	}

	.form-item label {
		width: 100px;
		font-size: 16px;
		color: #333;
	}

	.form-item input[type="text"] {
		flex: 1;
		padding: 12px 16px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		font-size: 16px;
	}

	.avatar-container {
		position: relative;
		width: 100px;
		height: 100px;
	}

	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.avatar-input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.button-container {
		margin-top: 30px;
		text-align: center;
	}

	.submit-button {
		padding: 12px 24px;
		background-color: #1aad19;
		color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.submit-button:hover {
		background-color: #168a16;
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