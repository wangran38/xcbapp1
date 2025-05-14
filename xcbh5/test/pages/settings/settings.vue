<template>
	<view class="settings-container">
		<!-- 头部 -->
		<view class="header">
			<text class="title">系统设置</text>
		</view>

		<!-- 设置项列表 -->
		<scroll-view scroll-y class="settings-list">
			<!-- 个人信息 -->
			<view class="section">
				<view class="section-title">账号管理</view>
				<view class="item" @click="navTo('/subPackages/settings/user-edit/user-edit')">
					<text>个人信息</text>
					<uni-icons type="right" size="18" color="#999" />
				</view>
				<view class="item" @click="navTo('/subPackages/settings/myAddress/myAddress')">
					<text>我的地址</text>
					<uni-icons type="right" size="18" color="#999" />
				</view>
			</view>



			<!-- 安全设置 -->
			<view class="section">
				<view class="section-title">安全设置</view>
				<view class="item" @click="bindingWechat">
					<text>绑定微信</text>
					<uni-icons type="right" size="18" color="#999" />
				</view>
				<view class="item" @click="navTo('/subPackages/settings/updatePwd/updatePwd')">
					<text>修改密码</text>
					<uni-icons type="right" size="18" color="#999" />
				</view>
			</view>


			<!-- 系统相关 -->
			<view class="section">
				<view class="item" @click="navTo('/subPackages/settings/aboutUs/aboutUs')">
					<text>关于我们</text>
					<uni-icons type="right" size="18" color="#999" />
				</view>
				<view class="item" @click="navTo('/subPackages/settings/version/version')">
					<text>版本更新</text>
					<uni-icons type="right" size="18" color="#999" />
				</view>
			</view>

			<button type="warn" @click="logout">退出登录</button>
		</scroll-view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	export default {
		methods: {
			navTo(url) {
				uni.navigateTo({
					url
				})
			},
			logout() {
				// 清除存储中的用户数据
				try {
					uni.removeStorageSync('token');
					uni.removeStorageSync('nickname');
					console.log('Token and nickname removed from storage');
				} catch (e) {
					console.error('Failed to remove token or nickname from storage', e);
				}
				// 设置登录状态为未登录
				this.isLoggedIn = false;
				this.nickname = '';
				this.userName = '';
				// 跳转到登录页面
				uni.redirectTo({
					url: '/pages/login/login'
				});
			},
			// 绑定微信
			async bindingWechat() {
				let systemInfo = await uni.getSystemInfo()
				// 判断是否是小程序端，如果不是就提示用户到小程序端进行绑定
				if (systemInfo[1].host && systemInfo[1].host.env == 'WeChat') {
					uni.login({
						provider: 'true',
						success: async res => {
							console.log(res.code, "这是用户唯一标识")
							let data = await api.bindingOpenid({
								code: res.code
							})
							let msg = data.message
							if (data.code == 200) {
								uni.showToast({
									title: msg,
									icon: 'success'
								})
							} else {
								uni.showToast({
									title: msg,
									icon: 'error'
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					uni.showToast({
						title: '请前往小程序端进行账号绑定',
						duration: 3000,
						icon: 'error'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.settings-container {
		background: #f8f9fa;
		min-height: 100vh;
	}

	.header {
		padding: 40rpx 32rpx;
		background: #fff;
		border-bottom: 1rpx solid #eee;

		.title {
			font-size: 36rpx;
			font-weight: 500;
			color: #333;
		}
	}

	.settings-list {
		padding: 20rpx 0;
	}

	.section {
		margin: 24rpx 0;
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;

		.section-title {
			padding: 24rpx 32rpx;
			font-size: 28rpx;
			color: #999;
			background: #fafafa;
		}

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx;
			border-bottom: 1rpx solid #f5f5f5;

			&:last-child {
				border: none;
			}

			text {
				font-size: 30rpx;
				color: #333;
			}
		}
	}
</style>