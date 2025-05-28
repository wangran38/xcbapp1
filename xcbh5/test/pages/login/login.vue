<template>
	<view class="login-container">
		<!-- 背景装饰 -->
		<view class="decorative-circle circle-1"></view>
		<view class="decorative-circle circle-2"></view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 标题 -->
			<view class="header">
				<text class="title">乡愁宝大市场</text>
				<text class="subtitle">请登录您的账号</text>
			</view>

			<!-- 表单区域 -->
			<view class="form-wrapper">
				<!-- 手机号输入 -->
				<view class="input-group">
					<uni-icons type="phone" size="24" color="#409EFF"></uni-icons>
					<input class="form-input" type="number" v-model="form.username" placeholder="手机号码" maxlength="11" />
				</view>

				<!-- 密码输入 -->
				<view class="input-group">
					<uni-icons type="locked" size="24" color="#409EFF"></uni-icons>
					<input class="form-input" :type="showPassword ? 'text':'password'" v-model="form.password"
						placeholder="密码" />
<!-- 					<uni-icons :type="showPassword ? 'eye-slash' : 'eye'" size="24" color="#999"
						@tap="togglePassword" /> -->
				</view>

				<button class="login-btn" :class="{ 'active': formValid}" @click="login">
					<text v-if="!loading">登 录</text>
					<uni-icons v-else type="spinner-cycle" size="24" color="#fff" class="loading-icon"></uni-icons>
				</button>

				<!-- 辅助链接 -->
				<view class="assist-links">
					<text class="link-text" @click="gotoRegster">注册账号</text>
					<text class="link-text" @click="gotoUptdatePwd">忘记密码</text>
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
					password: ''
				},
				showPassword: false,
				loading: false
			}
		},
		computed: {
			formValid() {
				return /^1[3-9]\d{9}$/.test(this.form.username) && this.form.password.length >= 6
			}
		},
		methods: {
			togglePassword() {
				this.showPassword = !this.showPassword
			},
			async login() {
				try {
					const response = await api.login(this.form.username, this.form.password);
					if (response.code === 200) {
						const token = response.data.token;
						// 保存token
						uni.setStorageSync('token', token);
						
						let promise = new Promise((res, rej) => {
							if (this.form.password == '123456') {
								uni.showToast({
									icon: 'error',
									title: '密码过于简单,请用户自行修改以确保账号安全',
									duration: 1000
								})
								setTimeout(() => {
									res(200)
								}, 2000)
								
							} else {
								res(201)
							}
						})
						promise.then((code) => {
							if (code == 200) {
								uni.showToast({
									icon: 'loading',
									title: '正在登录.....',
									duration: 2000
								})
								
								setTimeout(() => {
									// console.log(code,"正在登录")
									return code
								}, 1500)
							}else{
								uni.showToast({
									icon: 'loading',
									title: '正在登录.....',
									duration: 1000
								})
								return code
							}
						}).then((code) => {
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1000)
						})

					} else {
						uni.showToast({
							title: response.msg || response.message,
							icon: 'none'
						});
					}
				} catch (error) {
					console.log(error)
					uni.showToast({
						title: `登录失败`,
						icon: 'error'
					});
				}
			},
			gotoRegster() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},
			gotoUptdatePwd() {
				uni.navigateTo({
					url: '/subPackages/settings/updatePwd/updatePwd'
				})
			}
		}
	}
</script>

<style lang="scss">
	$primary: #409EFF;
	$gradient-start: #6AB3FD;
	$gradient-end: #409EFF;
	$text-dark: #2c3e50;
	$text-light: #7f8c8d;

	.login-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%);
		position: relative;
		overflow: hidden;

		.decorative-circle {
			position: absolute;
			border-radius: 50%;
			background: linear-gradient(45deg, rgba($primary, 0.1) 0%, rgba($primary, 0.05) 100%);

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
					color: $text-dark;
					margin-bottom: 16rpx;
				}

				.subtitle {
					font-size: 28rpx;
					color: $text-light;
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

					&.focus {
						box-shadow: 0 8rpx 24rpx rgba($primary, 0.1);
						transform: translateY(-2rpx);
					}

					.form-input {
						flex: 1;
						height: 100%;
						margin: 0 24rpx;
						font-size: 30rpx;
						color: $text-dark;
						border: none;
						outline: none;
					}
				}

				.login-btn {
					height: 96rpx;
					line-height: 96rpx;
					font-size: 34rpx;
					color: #fff;
					background: linear-gradient(45deg, $gradient-start, $gradient-end);
					border-radius: 48rpx;
					margin-top: 60rpx;
					transition: all 0.3s;
					box-shadow: 0 8rpx 24rpx rgba($primary, 0.2);

					&:not(.active) {
						opacity: 0.6;
						background: #c0dfff;
						box-shadow: none;
					}

					&.loading {
						opacity: 0.9;
					}

					.loading-icon {
						animation: rotate 1s linear infinite;
					}
				}

				.assist-links {
					margin-top: 40rpx;
					display: flex;
					justify-content: space-between;

					.link-text {
						color: $primary;
						font-size: 28rpx;
						position: relative;

						&::after {
							content: '';
							position: absolute;
							bottom: -4rpx;
							left: 0;
							width: 0;
							height: 2rpx;
							background: $primary;
							transition: width 0.3s;
						}

						&:active::after {
							width: 100%;
						}
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
</style>