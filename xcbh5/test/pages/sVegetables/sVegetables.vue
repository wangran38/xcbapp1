<template>
	<view class="all">
		<view class="tip">
			<view class="heading">请选择您的身份</view>
			<view class="items">
				<view class="mencheng" @click="goToBoothOwner">
					<uni-icons type="staff-filled" size="50rpx"></uni-icons>
					<view>我是摊主</view>
				</view>
				<view class="mencheng" @click="goToAhouseholder">
					<uni-icons type="person-filled" size="50rpx"></uni-icons>
					<view>我是户主</view>
				</view>
			</view>
		</view>
		<!-- <inputBoxVue></inputBoxVue> -->
	</view>

</template>

	
<script>
	export default {
		data() {
			return {

			}
		},

		methods: {
			
			// 跳转至我的摊主
			goToBoothOwner() {
				if (this.checkToken()) {
					uni.showModal({
						showCancel: false,
						content: '暂未登录,请前往登录',
						success: () => {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/boothOwner/boothOwner'
					})
				}


			},
			// 跳转至我的户主
			goToAhouseholder() {
				if (this.checkToken()) {
					uni.showModal({
						showCancel: false,
						content: '暂未登录,请前往登录',
						success: () => {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/aHouseholder/aHouseholder'
					})
				}

			},
			// 检查是否token存在，存在则已登陆
			checkToken() {
				const token = uni.getStorageSync('token');
				if (!token) {
					return true
				}
				return false
			},

		}
	}
</script>

<style>
	.tip {
		width: 100%;
		height: 100%;
		background-color: white;
		position: fixed;
	}

	.heading {
		padding-left: 60rpx;
		font-size: 50rpx;
		font-weight: bold;
		position: relative;
		top: 370rpx;
		text-align: center;
	}

	.mencheng {
		padding: 20rpx;
		border-radius: 10rpx;
		background-color: yellowgreen;
		margin-left: 40rpx;
	}

	.items {
		text-align: center;
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
	}

	@font-face {
		font-family: CustomFont;
		src: url('../../static/maicai/iconfont.ttf');
	}

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
		flex: 4;
	}

	.dishes {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.outlets {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.orders {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.earnings {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
		margin-bottom: 20rpx;
	}

	.title {
		height: 80rpx;
		line-height: 80rpx;
		color: black;
		font-size: 32rpx;
		font-weight: 700;
		margin-left: 20rpx;
	}

	.content {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		gap: 30rpx;
		padding: 10rpx 10rpx;
	}

	.item {
		width: 180rpx;
		height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

	}

	.add-dishes {
		width: 100%;
		color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
</style>