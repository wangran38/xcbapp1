<template>
	<view class="register-container">
		<view class="decorative-circle circle-1"></view>
		<view class="decorative-circle circle-2"></view>

		<view class="content-wrapper">
			<view class="header">
				<text class="title">乡愁宝大市场</text>
				<text class="subtitle">开始注册您的账号</text>
			</view>

			<view class="form-wrapper">
				<view class="input-group">
					<uni-icons type="phone" size="24" color="#409EFF"></uni-icons>
					<input class="form-input" type="number" v-model="form.username" placeholder="请输入手机号"
						maxlength="11" />
				</view>
				<view class="input-group">
					<uni-icons type="locked" size="24" color="#409EFF"></uni-icons>
					<input class="form-input" :type="showPassword ? 'password':'text'" v-model="form.password" placeholder="请输入至少六位密码" />
					<uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="24" color="#999"
						@click="showPassword = !showPassword" />
				</view>
				

				<view class="input-group">
					<uni-icons type="locked" size="24" color="#409EFF"></uni-icons>
					<input class="form-input" :type="showConfirmPassword ? 'password':'text'" v-model="form.confirm" placeholder="确认密码"
						maxlength="11" />
					<uni-icons :type="showConfirmPassword ? 'eye' : 'eye-slash'" size="24" color="#999"
						@click="showConfirmPassword = !showConfirmPassword" />
				</view>
				<view class="agreement-group">
					<view class="checkbox-item">
						<uni-icons :type="agreements.service ? 'checkbox-filled' : 'circle'" size="24"
							:color="agreements.service ? '#409EFF' : '#999'"
							@click="agreements.service = !agreements.service" />
						<text class="agreement-text">我已阅读并同意</text>
						<text class="link" @click="goTouserServiceAgreement">《服务协议》</text>
					</view>
					<view class="checkbox-item">
						<uni-icons :type="agreements.privacy ? 'checkbox-filled' : 'circle'" size="24"
							:color="agreements.privacy ? '#409EFF' : '#999'"
							@click="agreements.privacy = !agreements.privacy" />
						<text class="agreement-text">我已阅读并同意</text>
						<text class="link" @click="goToprivacyAgreement">《隐私政策》</text>
					</view>
				</view>

				<button class="register-btn" @click="register">
					<text class="link">立即注册</text>
				</button>
				<view class="login-link">
					<text>已有账号？</text>
					<text class="link" @click="navigateToLogin">立即登录</text>
				</view>
			</view>
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
				agreements: {
					service: false,
					privacy: false
				},
				showPassword: true,
				showConfirmPassword: true
			}
		},
		watch: {
			'form.username': 'validatePhoneNumber',
			'form.password': 'validatePassword'
		},

		methods: {
			goTouserServiceAgreement(){
				uni.navigateTo({
					url:'/pages/userServiceAgreement/userServiceAgreement'
				})
			},
			goToprivacyAgreement(){
				uni.navigateTo({
					url:'/pages/privacyAgreement/privacyAgreement'
				})
			},
			async register() {
					let reg = /^1[3-9]\d{9}$/;
					if (!reg.test(this.form.username)) {
						uni.showToast({
							title: '请输入正确的11位手机号',
							icon: 'error'
						});
						return 
					}
					if (this.form.password === '') {
						uni.showToast({
							title: '请输入密码',
							icon: 'error'
						});
						return;
					}
					// 校验密码是否为6位
					if (this.form.password.length !== 6) {
						uni.showToast({
							icon: 'error',
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
					// 新增的校验，确保用户已勾选服务协议和隐私协议
					if (!this.agreements.service || !this.agreements.privacy) {
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
			,
			checkBox(value) {
				switch (value) {
					case 0:
						this.agreeServiceAgreement = !this.agreeServiceAgreement
						break;
					case 1:
						this.agreePrivacyPolicy = !this.agreePrivacyPolicy
						break;
				}
			},
			navigateToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	.form-input {
		flex: 1;
		height: 100%;
		margin: 0 24rpx;
		font-size: 30rpx;
		border: none;
		outline: none;
	}
	/* 独立样式表 */
	.register-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%);
		position: relative;
		overflow: hidden;

		.decorative-circle {
			position: absolute;
			border-radius: 50%;
			background: linear-gradient(45deg, rgba(#409EFF, 0.1) 0%, rgba(#409EFF, 0.05) 100%);

			&.circle-1 {
				width: 600rpx;
				height: 600rpx;
				top: -300rpx;
				right: -300rpx;
			}

			&.circle-2 {
				width: 400rpx;
				height: 400rpx;
				bottom: -200rpx;
				left: -200rpx;
			}
		}

		.content-wrapper {
			padding: 60rpx 50rpx;
			position: relative;
			z-index: 1;

			.header {
				margin-bottom: 80rpx;

				.title {
					display: block;
					font-size: 48rpx;
					font-weight: 600;
					color: #2c3e50;
					margin-bottom: 16rpx;
				}

				.subtitle {
					font-size: 28rpx;
					color: #7f8c8d;
				}
			}

			.form-wrapper {
				.input-group {
					height: 100rpx;
					background: #fff;
					border-radius: 16rpx;
					margin-bottom: 40rpx;
					padding: 0 32rpx;
					display: flex;
					align-items: center;
					box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.03);
					transition: all 0.3s ease;
					position: relative;


					&.error {
						border: 1rpx solid #F56C6C;
						animation: shake 0.4s;

						.form-input {
							color: #F56C6C;
						}

						.error-msg {
							position: absolute;
							right: 24rpx;
							bottom: -40rpx;
							font-size: 24rpx;
							color: #F56C6C;
						}
					}

					.form-input {
						flex: 1;
						height: 100%;
						margin: 0 24rpx;
						font-size: 30rpx;
						color: #2c3e50;
					}
				}

				.agreement-group {
					margin: 40rpx 0;

					.checkbox-item {
						display: flex;
						align-items: center;
						margin-bottom: 24rpx;

						.agreement-text {
							margin-left: 12rpx;
							font-size: 26rpx;
							color: #2c3e50;
						}

						.link {
							color: #409EFF;
							margin-left: 8rpx;
						}
					}
				}

				.register-btn {
					height: 96rpx;
					line-height: 96rpx;
					font-size: 34rpx;
					color: #fff;
					background: linear-gradient(45deg, #6AB3FD, #409EFF);
					border-radius: 48rpx;
					margin-top: 60rpx;
					transition: all 0.3s;
					box-shadow: 0 8rpx 24rpx rgba(64, 158, 255, 0.2);

					&:not(.active) {
						background: blue;
						box-shadow: none;
					}


					.loading-icon {
						animation: rotate 1s linear infinite;
					}
				}

				.login-link {
					text-align: center;
					margin-top: 40rpx;
					font-size: 28rpx;
					color: #7f8c8d;

					.link {
						color: #409EFF;
						margin-left: 16rpx;
					}
				}
			}
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	@keyframes shake {

		0%,
		100% {
			transform: translateX(0);
		}

		20%,
		60% {
			transform: translateX(-10rpx);
		}

		40%,
		80% {
			transform: translateX(10rpx);
		}
	}
</style>