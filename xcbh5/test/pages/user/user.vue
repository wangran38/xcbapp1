<template>
	<view class="me-container">
		<view class="checkUpdate" @click="checkUpdate">检查更新</view>
		<view class="user">
			<view class="user-info">
				<view class="user-img">
					<image :src="userAvatar || 'http://h5.xcbdsc.com/static/morentouxiang.jpg'" mode="aspectFill">
					</image>
					<!-- <open-data wx:else type="userAvatarUrl" data-url="{{userInfo.avatar}}"></open-data> -->
				</view>
				<view class="user-name">
					<button v-if="!isLoggedIn" @click="login" class="login-button">点击登录</button>
					<view v-if="isLoggedIn" class="nickname-container">
						<!-- <input v-model="nickname" placeholder="请到我的信息中填写信息" class="nickname-input" /> -->
						<view class="nickname-input">{{ userName || '请到我的信息中填写昵称' }}</view>
					</view>
				</view>

				<uni-icons custom-prefix="iconfont" type="icon-shezhi" size="20" class="settings-icon"
					@click="useredit"></uni-icons>
			</view>
		</view>

		<!-- 其他视图保持不变 -->

		<view class="Integral">
			<view class="Total-spending">
				<view>消费总额</view>
				<view>0元</view>
			</view>
			<view class="Points-available">
				<view>可用积分</view>
				<view>{{score}}分</view>
			</view>
			<view class="Freeze-points">
				<view>冻结积分</view>
				<view>0分</view>
			</view>
		</view>

		<view class="lottery" @click="lottery">
			<view class="lottery-info">
				<uni-icons type="auth" size="30" color="#00ff00"></uni-icons>
				<text style="margin: auto 40rpx; text-align: center;">打卡抽奖</text>
				<text style="font-size: 24rpx;color: #708090;">累计打卡{{totalnum}}次</text>
			</view>
			<view class="item">
				<!-- <f-icon width="30" height="30" path="../../static/right.png"></f-icon> -->
				<uni-icons type="right" size="20"></uni-icons>
			</view>
		</view>

		<!-- <view class="prize" @click="coupons">
			<view class="prize-info">
				<uni-icons type="auth-filled" size="30" color="#fb9755"></uni-icons>
				<text style="margin: auto 40rpx; text-align: center;">我的奖品</text>
			</view>
			<view class="item">
				<uni-icons type="right" size="20"></uni-icons>
			</view>
		</view> -->
		<view class="MyPoints" @click="mypoints">
			<view class="MyPoints-info">
				<uni-icons type="vip" size="30" color="#f4e323"></uni-icons>
				<text style="margin: auto 40rpx; text-align: center;">我的积分</text>
			</view>
			<view class="item">
				<!-- <f-icon width="30" height="30" path="../../static/right.png"></f-icon> -->
				<uni-icons type="right" size="20"></uni-icons>
			</view>
		</view>

<!-- 		<view class="Notice">
			今日打卡次数: &nbsp;{{signTotal.todayusernum}}<br>
			历史打卡累计: &nbsp;{{signTotal.allnum}}
		</view> -->
		<view class="My-Order">
			<view class="Order-top" @click="toorders(0)">
				<view style="margin: auto 20rpx; text-align: center;">我的订单</view>
				<view style=" margin: auto 20rpx; text-align: center;color: #ccc;">全部<uni-icons type="right" size="14"
						color="#ccc"></uni-icons></view>
			</view>
			<view class="Order-bottom">
				<view class="item-title" @click="toorders(1)">
					<uni-icons custom-prefix="iconfont" type="icon-zhifuguanli" size="30"></uni-icons>
					<text style="margin-top: 10rpx;">待支付</text>
				</view>
				<view class="item-title" @click="toorders(2)">
					<uni-icons custom-prefix="iconfont" type="icon-fapiaoguanli" size="30"></uni-icons>
					<text style="margin-top: 10rpx;">已支付</text>
				</view>
				<view class="item-title" @click="toorders(3)">
					<uni-icons custom-prefix="iconfont" type="icon-fahuoguanli" size="30"></uni-icons>
					<text style="margin-top: 10rpx;">待收货</text>
				</view>
				<view class="item-title" @click="toorders(4)">
					<uni-icons custom-prefix="iconfont" type="icon-dingdanguanli" size="30"></uni-icons>
					<text style="margin-top: 10rpx;">已完成</text>
				</view>
			</view>
		</view>



		<view class="tool">
			<!-- <view class="Check" @click="Check">
				<view >每日打卡</view>
				<uni-icons type="right" size="20"></uni-icons>
			</view> -->
			<view class="Apply" @click="Apply">
				<view>摊主申请</view>
				<uni-icons type="right" size="20"></uni-icons>
			</view>
			<view class="Apply" @click="useredit">
				<view>我的信息</view>
				<uni-icons type="right" size="20"></uni-icons>
			</view>
			<view class="user-edit" @click="bindingWechat">
				<view>绑定微信</view>
				<uni-icons type="right" size="20"></uni-icons>
			</view>
		</view>

		<view v-if="isLoggedIn">
			<button @click="logout" class="Signout">退出登录</button>
		</view>

	</view>
</template>

<script>
	import {
		api
	} from '../../api/index.js';
	import {getPlatform} from '../../hooks/useUpload.js'

	export default {
		data() {
			return {
				isLoggedIn: false,
				userName: '',
				userAvatar: '',
				score: '',
				// 添加你需要的数据属性
				totalnum: 0,
				signTotal: {}
			};
		},
		async onShow() {
			let res = await api.signTotal({})
			this.signTotal = res.data
			this.checkLoginStatus();
			if (this.isLoggedIn) {
				this.fetchUserProfile();
			}
			this.signlist()
		},
		methods: {
			/**
			 * 
			 * 检查更新
			 */
			checkUpdate() {
				if (getPlatform() == 3){
					// 小程序支持检查更新其他的提示不兼容
					if (wx.canIUse('getUpdateManager')) {
						const updateManager = uni.getUpdateManager()
						updateManager.onCheckForUpdate(function(res) {
							if (res.hasUpdate) {
								updateManager.onUpdateReady(function() {
									uni.showModal({
										title: '更新提示',
										content: '新版本已经准备好，是否重启应用？',
										success: function(res) {
											if (res.confirm) {
												updateManager.applyUpdate()
											}
										}
									})
								})
							}else{
								uni.showToast({
									title:'已经是最新版了',
									icon:'success'
								})
							}
						})
					} else {
						uni.showModal({
							title: '提示',
							content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
						})
					}
				}else{
					uni.showToast({
						title:'当前客户端不支持检查更新',
						icon:'error'
					})
				}
				
			},

			/**
			 * 检查登录状态
			 */
			checkLoginStatus() {
				const token = uni.getStorageSync('token');
				if (token) {
					this.isLoggedIn = true;
				} else {
					this.isLoggedIn = false;
				}
			},
			async fetchUserProfile() {
				try {
					const token = uni.getStorageSync('token');
					const response = await api.getUserProfile();
					if (response.code === 200) {
						const {
							name,
							Headimgurl,
							score
						} = response.data;
						this.userName = name;
						this.userAvatar = Headimgurl;
						this.score = score;
					} else {
						// 处理获取用户信息失败的情况
						uni.showToast({
							title: '获取用户信息失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('Error fetching user profile:', error);
					uni.showToast({
						title: '获取用户信息失败',
						icon: 'none'
					});
				}
			},

			async signlist(data) {
				const token = uni.getStorageSync('token');
				const response = await api.signlist(token);
				this.totalnum = response.data.totalnum
			},

			login() {
				// 跳转到登录页面
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			Apply() {
				// 跳转到申请页面
				uni.navigateTo({
					url: '/pages/Apply/Apply'
				});
			},
			useredit() {
				// 跳转到用户编辑页面
				uni.navigateTo({
					url: '/pages/user-edit/user-edit'
				});
			},
			coupons() {
				// 跳转到用户奖品页面
				uni.navigateTo({
					url: '/pages/coupons/coupons'
				});
			},
			lottery() {
				// 跳转到用户抽奖页面
				uni.navigateTo({
					url: '/pages/clock-records/clock-records'
				});
			},
			toorders(orderStatus) {
				// 跳转到用户抽奖页面
				uni.navigateTo({
					url: `/pages/orders/orders?orderStatus=${orderStatus}`
				});
			},
			mypoints() {
				// 跳转到用户抽奖页面
				uni.navigateTo({
					url: '/pages/MyPoints-records/MyPoints-records'
				});
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
							发送code
							let data = await api.bindingOpenid({
								code:res.code
							})
							console.log(data)
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					uni.showToast({
						title: '浏览器不支持调用api,请前往小程序端进行账号绑定',
						duration: 3000,
						icon: 'error'
					})
				}
			}
		}
	};
</script>


<style>
	.checkUpdate {
		font-size: 20rpx;
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		color: black;
		padding: 10rpx;
		background-color: #f8f8f8;
		box-shadow: 1rpx 1rpx 1rpx 1rpx gray;
	}

	.Notice {
		margin: 50rpx;
		text-align: center;
		color: black;
	}

	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 80rpx 40rpx 0 40rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		position: relative;
	}

	.me-container::after {
		content: "";
		width: 140%;
		height: 200px;
		position: absolute;
		left: -20%;
		top: 0;
		z-index: -1;
		border-radius: 0 0 50% 50%;
		background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
	}

	.user {
		height: 140rpx;
		display: flex;
		flex-direction: row;
		/* justify-content: space-between; */
		text-align: center;
		/* border: 1px solid #ccc; */
		/* background-color: white; */
		background-color: transparent;
	}

	.user-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		/* justify-content: flex-start; */
		margin: 0 20rpx;
		width: 100%;
	}

	.settings-icon {
		margin-left: auto;
		/* 将设置图标推到最右侧 */
	}

	.user-img {
		width: 110rpx;
		height: 110rpx;
		border: 1px solid #ccc;
		border-radius: 50%;
		overflow: hidden;
		/* margin: auto auto; */
		/* background-color: #00aaff; */
	}

	.user-img>image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.user-name {
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		margin: auto 30rpx;
	}

	.nickname-container {
		display: flex;
		margin-top: 10rpx;
	}

	.nickname-input {
		flex: 1;
		height: 60rpx;
		/* border: 1rpx solid #ccc; */
		border-radius: 10rpx;
		padding: 0 10rpx;
		margin-right: 10rpx;
		font-size: 30rpx;
		font-weight: 600;
	}


	.lottery {
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: black;
		text-align: center;
		border: 1rpx solid #ccc;
		background-color: white;
		box-sizing: border-box;
		border-top: none;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.lottery-info {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
	}

	.lottery>.item {
		width: 40rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		color: rgb(229, 229, 229);
		margin-right: 12rpx;
	}

	.prize {
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: black;
		text-align: center;
		border: 1rpx solid #ccc;
		background-color: white;
		box-sizing: border-box;
		border-top: none;
		/* border-bottom-left-radius: 20rpx; */
		/* border-bottom-right-radius: 20rpx; */
	}

	.prize-info {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
	}

	.prize>.item {
		width: 40rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		color: rgb(229, 229, 229);
		margin-right: 12rpx;
	}

	.MyPoints {
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: black;
		text-align: center;
		border: 1rpx solid #ccc;
		background-color: white;
		box-sizing: border-box;
		border-top: none;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}

	.MyPoints-info {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
	}

	.MyPoints>.item {
		width: 40rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		color: rgb(229, 229, 229);
		margin-right: 12rpx;
	}

	.My-Order {
		height: 200rpx;
		width: 100%;
		margin-top: 5%;
		background-color: white;
		border: 1px solid #ccc;
		border-radius: 20rpx;
	}

	.Order-top {
		height: 60rpx;
		width: 100%;
		line-height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-bottom: 1rpx solid #ccc;
		color: black;
	}

	.Order-bottom {
		height: 140rpx;
		flex: 5;
		display: flex;
		flex-direction: row;
	}

	.item-title {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* padding-top: 20rpx; */
		/* padding-bottom: 20rpx; */
		color: black;
		box-sizing: border-box;
		/* background-color: #4facfe; */
		/* height: 80%; */
	}


	.tool {
		height: 180rpx;
		width: 100%;
		margin-top: 5%;
		background-color: white;
		border: 1rpx solid #ccc;
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
	}

	.Apply {
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: black;
		padding: 0 20rpx;
		border-bottom: 1rpx solid #ccc;
	}

	.Signout {
		margin-top: 20rpx;
		background-color: #007aff;
		color: white;
	}

	.user-edit {
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: black;
		padding: 0 20rpx;
	}

	.login-button {
		display: flex;
		align-items: center;
		appearance: none;
		background-color: #fff;
		border-radius: 24px;
		font-size: 16px;
		font-weight: 500;
		height: 40px;
		justify-content: center;
		letter-spacing: .25px;
		line-height: 40rpx;
		max-width: 100%;
		overflow: visible;
	}

	.Integral {
		color: rgb(58, 58, 60);
		width: 100%;
		height: 100rpx;
		background-color: white;
		display: flex;
		align-items: center;
		margin-bottom: 3%;
		border-radius: 20rpx;
		border: 1px solid #ccc;
	}

	.Total-spending {
		width: 33%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-right: 1px solid #ccc;
	}

	.Points-available {
		width: 34%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-right: 1px solid #ccc;
	}

	.Freeze-points {
		width: 33%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>