<template>
	<view class="container">
		<!-- 顶部卡片 -->
		<view class="header-card">
			<view class="icon-box">
				<text class="icon">⚠️</text>
			</view>
			<view class="title">账号注销申请</view>
			<view class="subtitle">注销后将无法恢复，请谨慎操作</view>
		</view>

		<!-- 注销须知 -->
		<view class="card">
			<view class="card-title">
				<text class="dot"></text>注销须知
			</view>
			<view class="list">
				<view class="item">账号注销后将无法登录，所有数据清空且不可恢复</view>
				<view class="item">已绑定的手机号、第三方账号将自动解除绑定</view>
				<view class="item">会员权益、资产、积分等全部失效，不予退还</view>
			</view>
		</view>

		<!-- 身份验证 -->
		<view class="card">
			<view class="card-title">
				<text class="dot"></text>身份验证
			</view>
			<view class="input-wrapper">
				<input v-model="password" type="password" placeholder="请输入登录密码" placeholder-class="ph" />
			</view>
		</view>

		<!-- 同意协议 -->
		<view class="agree-card">
			<checkbox-group @change="agreeChange">
				<label class="agree-label">
					<checkbox :checked="isAgree" color="#1677FF" />
					<text class="agree-text">我已阅读并同意</text>
					<text class="link" @click="goPrivacy">《账号注销协议》</text>
				</label>
			</checkbox-group>
		</view>

		<!-- 提交按钮 -->
		<view class="btn-box">
			<button class="submit-btn" :class="canSubmit ? 'active' : 'disabled'" :disabled="!canSubmit"
				@click="showConfirm">
				确认注销账号
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password: '',
				isAgree: false
			}
		},
		computed: {
			canSubmit() {
				return this.isAgree && this.password.trim() !== ''
			}
		},
		methods: {
			agreeChange(e) {
				this.isAgree = e.detail.value.length > 0
			},
			goPrivacy() {
				uni.navigateTo({
					url: '/pages/logoutAgreement/logoutAgreement'
				})
			},
			showConfirm() {
				uni.showModal({
					title: '确认注销账号',
					content: '注销后数据无法恢复，确定继续吗？',
					confirmText: '确认注销',
					confirmColor: '#ff4444',
					success: res => {
						if (res.confirm) this.submitCancel()
					}
				})
			},
			submitCancel() {
				uni.showLoading({
					title: '提交中...'
				})
				setTimeout(() => {
					uni.hideLoading()
					uni.showModal({
						title: '注销申请已提交',
						content: '审核完成后将自动注销账号',
						showCancel: false,
						success: () => {
							uni.clearStorageSync()
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					})
				}, 1500)
			}
		}
	}
</script>

<style scoped>
	/* 整体布局 */
	.container {
		padding: 20rpx;
		background: #f6f7f9;
		min-height: 100vh;
		box-sizing: border-box;
	}

	/* 顶部提示卡片 */
	.header-card {
		background: linear-gradient(135deg, #1677FF, #4096ff);
		border-radius: 24rpx;
		padding: 40rpx 30rpx;
		text-align: center;
		color: #fff;
		margin-bottom: 30rpx;
		position: relative;
		overflow: hidden;
	}

	.icon-box {
		font-size: 60rpx;
		margin-bottom: 10rpx;
	}

	.icon {
		font-size: 50rpx;
	}

	.title {
		font-size: 38rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.subtitle {
		font-size: 26rpx;
		opacity: 0.9;
	}

	/* 卡片通用 */
	.card {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
	}

	.card-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.dot {
		display: inline-block;
		width: 12rpx;
		height: 12rpx;
		background: #1677FF;
		border-radius: 50%;
		margin-right: 16rpx;
	}

	/* 列表 */
	.list {
		padding-left: 26rpx;
	}

	.item {
		font-size: 27rpx;
		color: #666;
		line-height: 1.7;
		margin-bottom: 16rpx;
		position: relative;
	}

	.item::before {
		content: "•";
		position: absolute;
		left: -20rpx;
		color: #1677FF;
	}

	/* 输入框 */
	.input-wrapper {
		height: 88rpx;
		border-bottom: 2rpx solid #f0f0f0;
		display: flex;
		align-items: center;
	}

	.input-wrapper input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	.ph {
		color: #bbb;
	}

	/* 协议 */
	.agree-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx 30rpx;
		margin-bottom: 40rpx;
	}

	.agree-label {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
	}

	.agree-text {
		margin-left: 10rpx;
	}

	.link {
		color: #1677FF;
		margin: 0 6rpx;
		font-weight: 500;
	}

	/* 按钮 */
	.btn-box {
		margin-top: 20rpx;
	}

	.submit-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		font-size: 32rpx;
		color: #fff;
		border: none;
	}

	.submit-btn.active {
		background: linear-gradient(135deg, #ff4d4f, #ff7875);
	}

	.submit-btn.disabled {
		background: #dcdcdc;
	}
</style>