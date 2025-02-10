<template>
	<view class="container">
		<view class="header">
			注册
		</view>
		<view class="input-group">
			<uni-easyinput v-model="form.username" prefixIcon="person" placeholder="请输入手机号码"
				@input="validatePhoneNumber"></uni-easyinput>
			<view v-if="phoneError" class="error-message">{{ phoneError }}</view>
		</view>
		<view class="input-group">
			<uni-easyinput v-model="form.password" type="password" prefixIcon="locked" placeholder="请输入六位密码"
				@input="validatePassword('password')" maxlength="6"></uni-easyinput>
			<view
				:class="['error-message', { 'valid': passwordValid, 'invalid':!passwordValid && form.password.length > 0 }]">
				{{ passwordError }}
			</view>
		</view>
		<view class="input-group">
			<uni-easyinput v-model="form.confirm" type="password" prefixIcon="locked" placeholder="请确认密码"
				@input="validatePassword('confirm')" maxlength="6"></uni-easyinput>
			<view
				:class="['error-message', { 'valid': confirmPasswordValid, 'invalid':!confirmPasswordValid && form.confirm.length > 0 }]">
				{{ confirmPasswordError }}
			</view>
		</view>
		<view style="margin-bottom: 62rpx; position: relative; left: -91rpx;">
			<view class="agreement-checkbox">
				<checkbox v-model="agreeServiceAgreement" :checked="agreeServiceAgreement" @click="checkBox(0)">
				</checkbox>
				<view class="checkbox-container">
					<view class="checkbox-text">
						我已阅读并同意 <navigator url="/pages/userServiceAgreement/userServiceAgreement" style="color: #007aff;">服务协议
						</navigator>
					</view>
				</view>
			</view>
			<view class="agreement-checkbox">
				<checkbox v-model="agreePrivacyPolicy" :checked="agreePrivacyPolicy" @click="checkBox(1)">
				</checkbox>
				<view class="checkbox-container">
					<view class="checkbox-text">
						我已阅读并同意 <navigator url="/pages/privacyAgreement/privacyAgreement" style="color: #007aff;">隐私协议
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<view class="button-group">
			<button class="login-button" @click="register">注册</button>
		</view>
	</view>
</template>


<script>
	import {
		api
	} from '../../api/index.js';

	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
					confirm: ''
				},
				phoneError: '',
				passwordError: '',
				confirmPasswordError: '',
				passwordValid: false,
				confirmPasswordValid: false,
				// 新增的状态，用于存储用户是否同意服务协议
				agreeServiceAgreement: true,
				// 新增的状态，用于存储用户是否同意隐私协议
				agreePrivacyPolicy: true
			};
		},
		watch: {
			'form.username': 'validatePhoneNumber',
			'form.password': 'validatePassword'
		},
		methods: {
			validatePhoneNumber() {
				let reg = /^1[3-9]\d{9}$/;
				if (!reg.test(this.form.username)) {
					this.phoneError = '请输入正确的11位手机号';
				} else {
					this.phoneError = '';
				}
			},
			validatePassword(field) {
				this.$nextTick(() => {
					if (field === 'password') {
						if (this.form.password.length === 0) {
							this.passwordError = '密码不能为空';
							this.passwordValid = false;
						} else if (this.form.password.length !== 6) {
							this.passwordError = '密码必须6位';
							this.passwordValid = false;
						} else {
							this.passwordError = '密码格式正确';
							this.passwordValid = true;
						}
					} else if (field === 'confirm') {
						if (this.form.confirm.length === 0) {
							this.confirmPasswordError = '密码不能为空';
							this.confirmPasswordValid = false;
						} else if (this.form.confirm.length !== 6) {
							this.confirmPasswordError = '密码必须6位';
							this.confirmPasswordValid = false;
						} else if (this.form.confirm !== this.form.password) {
							this.confirmPasswordError = '两次密码输入不一致';
							this.confirmPasswordValid = false;
						} else {
							this.confirmPasswordError = '密码格式正确';
							this.confirmPasswordValid = true;
						}
					}
				});
			},
			// 新增的方法，用于处理协议勾选状态的变化
			checkBox(value) {
				switch (value){
					case 0:
						this.agreeServiceAgreement = !this.agreeServiceAgreement
						break;
					case 1:
						this.agreePrivacyPolicy = !this.agreePrivacyPolicy
						break;
				}
			},
			async register() {
				// 校验手机号是否为空
				if (this.form.username === '') {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					});
					return;
				}
				// 校验密码是否为空
				if (this.form.password === '') {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				// 校验密码是否为6位
				if (this.form.password.length !== 6) {
					uni.showToast({
						icon: 'none',
						title: '密码必须为6位'
					});
					return;
				}
				if (this.form.password !== this.form.confirm) {
					uni.showToast({
						icon: 'none',
						title: '两次密码输入不一致'
					});
					return;
				}
				if (this.phoneError) {
					uni.showToast({
						icon: 'none',
						title: this.phoneError
					});
					return;
				}
				console.log(this.agreeServiceAgreement,this.agreePrivacyPolicy)
				// 新增的校验，确保用户已勾选服务协议和隐私协议
				if (!this.agreeServiceAgreement || !this.agreePrivacyPolicy) {
					uni.showToast({
						icon: 'none',
						title: '请勾选服务协议和隐私协议'
					});
					return;
				}

				try {
					const response = await api.register(this.form.username, this.form.password, this.form.confirm);
					if (response.code === 200) {
						const token = response.data;
						uni.setStorageSync('token', token);

						uni.showToast({
							title: '注册成功',
							icon: 'success',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}, 2000);
					} else {
						uni.showToast({
							icon: 'none',
							title: response.msg || '注册失败，请重试'
						});
					}
				} catch (error) {
					uni.showToast({
						icon: 'none',
						title: '网络错误，请稍后重试'
					});
					console.error('Registration Error:', error);
				}
			}
		}
	}
</script>

<style>
	.uni-easyinput__content-input{
		font-size: 30rpx !important;
		height: 100rpx !important;
	}
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40rpx;
		background-color: #f5f5f5;
	}

	.header {
		font-size: 48rpx;
		margin-bottom: 40rpx;
		color: #333;
	}

	.input-group {
		width: 90%;
		margin-bottom: 40rpx;
	}

	.button-group {
		width: 90%;
	}

	.login-button {
		width: 100%;
		padding: 15rpx;
		background-color: #007aff;
		color: white;
		font-size: 32rpx;
		border: none;
		border-radius: 10rpx;
		cursor: pointer;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		transition: background-color 0.3s ease;
	}

	.login-button:active {
		background-color: #0056b3;
	}

	.error-message {
		color: red;
		font-size: 24rpx;
		margin-top: 10rpx;
	}

	.error-message.valid {
		color: green;
		/* 正确提示的绿色 */
	}

	.error-message.invalid {
		color: red;
		/* 错误提示的红色 */
	}

	/* 协议勾选部分的样式 */
	.agreement-checkbox {
		display: flex;
		justify-content: left;
		width: 100%;
		margin-bottom: 15rpx;
	}

	.checkbox-container {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666;
	}

	.checkbox-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30rpx;
		height: 30rpx;
		border: 2rpx solid #ccc;
		border-radius: 5rpx;
		margin-right: 10rpx;
	}

	.checkbox-icon checkbox {
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.checkbox-text {
		font-size: 30rpx;
		display: flex;
		align-items: center;
	}

	.checkbox-text navigator {
		text-decoration: underline;
	}

	.checkbox-container.checked.checkbox-icon {
		background-color: #007aff;
		border-color: #007aff;
	}

	.checkbox-container.checked.checkbox-icon::after {
		content: '';
		display: block;
		width: 16rpx;
		height: 8rpx;
		border-left: 3rpx solid white;
		border-bottom: 3rpx solid white;
		transform: rotate(-45deg);
	}
</style>