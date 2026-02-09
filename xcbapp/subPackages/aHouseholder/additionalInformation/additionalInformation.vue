<template>
	<view class="profile-page">
		<!-- 动态标题：编辑模式/补充模式 -->
		<text class="page-title">{{ isEditMode ? '户主资料编辑' : '户主资料补充' }}</text>
		<!-- 表单容器 -->
		<view class="form-container">
			<!-- 真实姓名 -->
			<view class="form-item">
				<label class="form-label">真实姓名</label>
				<input type="text" v-model="userinfo.farmersname" 
                       placeholder="请输入真实姓名" 
                       class="form-input"
                       maxlength="20"/>
			</view>
			<!-- 身份证号 -->
			<view class="form-item">
				<label class="form-label">身份证号</label>
				<input type="text" v-model="userinfo.cardnumber" 
                       placeholder="请输入18位身份证号码" 
                       class="form-input"
                       maxlength="18"/>
			</view>
			<!-- 头像上传 -->
			<view class="form-item avatar-item">
				<label class="form-label">{{ isEditMode ? '当前头像' : '上传头像' }}</label>
				<view class="avatar-wrapper" @click="commitAvater">
					<image :src="userinfo.avatar" mode="aspectFill" class="avatar-image" v-show="userinfo.avatar"/>
					<view class="avatar-placeholder" v-show="!userinfo.avatar">
						<uni-icons type="camera" size="40" color="#86909c"/>
					</view>
				</view>
			</view>
			<!-- 详细地址 -->
			<view class="form-item">
				<label class="form-label">详细地址</label>
				<input type="text" v-model="userinfo.address" 
                       placeholder="请输入详细居住地址" 
                       class="form-input"
                       maxlength="100"/>
			</view>
		</view>

		<!-- 提交按钮：动态文字 -->
		<view class="button-container">
			<button @click="submitForm" class="submit-btn" :disabled="loading">
				<uni-load-more type="loading" size="mini" class="btn-loading" v-show="loading"/>
				<text v-show="!loading">{{ isEditMode ? '保存修改' : '提交资料' }}</text>
			</button>
		</view>
	</view>
</template>

<style scoped>
/* 完全延续之前的高颜值简约样式，无任何修改 */
.profile-page {
	padding: 60rpx 30rpx 80rpx;
	background-color: #f7f8fa;
	min-height: 100vh;
	box-sizing: border-box;
}
.page-title {
	display: block;
	text-align: center;
	font-size: 38rpx;
	font-weight: 600;
	color: #2d3748;
	margin-bottom: 60rpx;
	letter-spacing: 3rpx;
}
.form-container {
	background: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
	padding: 40rpx 30rpx;
}
.form-item {
	display: flex;
	flex-direction: column;
	margin-bottom: 40rpx;
}
.form-item:last-child {
	margin-bottom: 0;
}
.avatar-item {
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0;
}
.form-label {
	font-size: 28rpx;
	color: #4a5568;
	font-weight: 500;
	margin-bottom: 16rpx;
}
.avatar-item .form-label {
	margin-bottom: 0;
}
.form-input {
	font-size: 28rpx;
	color: #2d3748;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #e2e8f0;
	transition: all 0.2s ease;
}
.form-input:focus {
	outline: none;
	border-bottom-color: #4299e1;
}
.form-input::placeholder {
	color: #a0aec0;
	font-size: 26rpx;
}
.avatar-wrapper {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	border: 2rpx dashed #e2e8f0;
	background: #f7f8fa;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	transition: all 0.3s ease;
}
.avatar-wrapper:active {
	transform: scale(0.95);
	border-color: #4299e1;
}
.avatar-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.avatar-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
}
.button-container {
	margin-top: 60rpx;
	padding: 0 10rpx;
}
.submit-btn {
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background: linear-gradient(90deg, #4299e1 0%, #3182ce 100%);
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 500;
	border-radius: 16rpx;
	border: none;
	box-shadow: 0 4rpx 12rpx rgba(66, 153, 225, 0.25);
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
}
.submit-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 2rpx 8rpx rgba(66, 153, 225, 0.25);
}
.submit-btn:disabled {
	background: #e2e8f0;
	color: #a0aec0;
	box-shadow: none;
	transform: none;
}
.btn-loading {
	margin-right: 12rpx;
}
</style>

<script>
	import { api } from '../../../api';
	import { useUpload } from "@/hooks/useUpload"

	export default {
		data() {
			return {
				userinfo: { 
					farmersname: '',
					cardnumber: '',
					avatar: '',
					address: '',
				},
				oldDataInfo: null, // 存储原始用户数据，用于取ID和判断模式
				isEditMode: false, // 核心模式标识：true=编辑模式，false=补充模式
				loading: false, // 全局加载状态：头像上传+提交共用
			};
		},
		/**
		 * 页面加载核心：获取用户资料 → 判断模式 → 数据回显
		 */
		async onLoad() {
			try {
				const res = await api.myInfo({});
				
				console.log("个人信息回显",res.data)
				if (res.code === 200 && res.data) {
					this.oldDataInfo = res.data;
					// 2. 判断是否为编辑模式：有核心资料（姓名/身份证/地址）即为编辑模式
					const hasUserInfo = res.data.farmersname || res.data.cardnumber || res.data.address;
					this.isEditMode = hasUserInfo;
					// 3. 编辑模式：数据回显，填充表单
					if (this.isEditMode) {
						this.userinfo = {
							farmersname: res.data.farmersname || '',
							cardnumber: res.data.cardnumber || '',
							avatar: res.data.avatar || '',
							address: res.data.address || '',
						};
					}
				}
			} catch (err) {
				console.error('获取用户资料异常：', err);
				// 容错：获取失败默认走【补充模式】
				this.isEditMode = false;
			}
		},
		methods: {
			/**
			 * 头像上传：补充/编辑模式共用，上传后自动更新表单
			 */
			async commitAvater() {
				if (this.loading) return;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						const tempFilePath = res.tempFilePaths[0];
						if (!tempFilePath) return;

						this.loading = true;
						try {
							const { upload } = useUpload({
								uploadPath: '/group1/upload',
								tempFilePaths: tempFilePath,
								file: res.tempFiles[0]
							});
							const uploadRes = await upload();
							const obj = JSON.parse(uploadRes);

							if (obj?.data?.url) {
								this.userinfo.avatar = obj.data.url;
								uni.showToast({ 
									icon: 'success', 
									title: this.isEditMode ? '头像更新成功' : '头像上传成功' 
								});
							} else {
								throw new Error('上传结果无效');
							}
						} catch (err) {
							console.error('头像操作失败：', err);
							uni.showToast({ 
								icon: 'none', 
								title: this.isEditMode ? '头像更新失败' : '头像上传失败' 
							});
						} finally {
							this.loading = false;
						}
					},
					fail: (err) => {
						if (err.errMsg !== 'chooseImage:cancel') {
							uni.showToast({ icon: 'none', title: '选择图片失败' });
						}
					}
				});
			},

			/**
			 * 表单校验：补充/编辑模式共用，规则一致
			 */
			validateForm() {
				const { farmersname, cardnumber, avatar, address } = this.userinfo;
				// 真实姓名
				if (!farmersname.trim()) {
					uni.showToast({ icon: 'none', title: '请输入真实姓名' });
					return false;
				}
				// 身份证（18位正则）
				const cardReg = /^\d{17}[\dXx]$/;
				if (!cardnumber.trim() || !cardReg.test(cardnumber.trim())) {
					uni.showToast({ icon: 'none', title: '请输入有效18位身份证' });
					return false;
				}
				// 头像
				if (!avatar) {
					uni.showToast({ icon: 'none', title: '请上传头像' });
					return false;
				}
				// 详细地址
				if (!address.trim()) {
					uni.showToast({ icon: 'none', title: '请输入详细地址' });
					return false;
				}
				return true;
			},


			async submitForm() {
				// 1. 表单合法性校验
				if (!this.validateForm()) return;
				// 2. 加载中禁止重复提交
				if (this.loading) return;
				this.loading = true;

				try {
					// 3. 根据模式构造提交参数
					let submitData = { ...this.userinfo };
					// 编辑模式：追加用户ID（后端根据ID更新）
					if (this.isEditMode && this.oldDataInfo?.id) {
						submitData.id = this.oldDataInfo.id;
					}
					
					console.log("个人数据提交",submitData)

					// 4. 调用统一接口提交（后端需支持：有ID=更新，无ID=补充）
					const res = await api.upFarmers(submitData);
					// 5. 动态提示语，贴合当前模式
					if (res.code === 200) {
						uni.showToast({ 
							icon: 'success', 
							title: this.isEditMode ? '资料修改成功' : '资料补充成功' 
						});
						// 延迟返回，让用户看到提示
						setTimeout(() => {
							uni.navigateBack({ delta: 1 });
						}, 1200);
					} else {
						uni.showToast({ 
							icon: 'none', 
							title: res.msg || (this.isEditMode ? '资料修改失败' : '资料补充失败') 
						});
					}
				} catch (err) {
					console.error('提交失败：', err);
					uni.showToast({ 
						icon: 'none', 
						title: '网络异常，请稍后重试' 
					});
				} finally {
					this.loading = false;
				}
			},
		},
	};
</script>