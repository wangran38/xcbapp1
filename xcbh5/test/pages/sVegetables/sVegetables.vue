<template>
	<view class="me-container">
		<view class="outlets">
			<view class="title">
				我的摊铺
			</view>
			<view class="content">
				<view class="item" @click="goToapply">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-shenqing"></use>
					</svg>
					<view class="add-dishes">
						申请固定摊位
					</view>
				</view>
				<view class="item" @click="goToapply">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-wangshangshenqing
"></use>
					</svg>
					<view class="add-dishes">
						申请网络摊位
					</view>
				</view>
				<view class="item" @click="gotostalllist">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-shangpu"></use>
					</svg>
						<view class="add-dishes">
							摊位列表
						</view>
				</view>

				<view class="item" @click="gotoEditshop">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-keylinetubiao-26"></use>
					</svg>
					<view class="add-dishes">
						摊位资料补充
					</view>
				</view>
				<!-- <view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view> -->
			</view>
		</view>
		<view class="dishes">
			<view class="title">
				我的菜品
			</view>
			<view class="content">
				<view class="item" @click="goTorelePage">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-tianjiacaipin"></use>
					</svg>
					<view class="add-dishes">
						添加菜品
					</view>
				</view>
				<view class="item" @click="gotopublish">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-caipinliebiao"></use>
					</svg>
					<view class="add-dishes">
						菜品列表
					</view>
				</view>
				<view class="item" @click="gotoListDis">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-yishangjia"></use>
					</svg>
					<view class="add-dishes">
						已上架菜品
					</view>
				</view>
				<!-- <view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						菜品朋友圈
					</view>
				</view> -->
				<!-- <view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view> -->
			</view>

		</view>

		<view class="orders">
			<view class="title" @click="gotoOwneroders(0)">
				我的订单
			</view>
			<view class="content">
				<view class="item" @click="gotoOwneroders(1)">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-dengdaizhifu"></use>
					</svg>
					<view class="add-dishes">
						待支付
					</view>
				</view>
				<view class="item" @click="gotoOwneroders(3)">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-daishouhuo"></use>
					</svg>
					<view class="add-dishes">
						待收货
					</view>
				</view>
				<view class="item" @click="gotoOwneroders(5)">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-daijiesuan"></use>
					</svg>
					<view class="add-dishes">
						待结算
					</view>
				</view>
				<view class="item" @click="gotoOwneroders(6)">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-yijiesuan"></use>
					</svg>
					<view class="add-dishes">
						已结算
					</view>
				</view>
				<!-- <view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view> -->
			</view>
		</view>
		<view class="earnings">
			<view class="title">
				我的收益
			</view>
			<view class="content">
				<view class="item" @click="gotowallet">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-qianbao"></use>
					</svg>
					<view class="add-dishes">
						钱包
					</view>
				</view>
				<view class="item" @click="gotoPoints">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-jifen"></use>
					</svg>
					<view class="add-dishes">
						积分钱包
					</view>
				</view>
				<view class="item" @click="gotoPointspayouts">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-jifenjiesuan"></use>
					</svg>
					<view class="add-dishes">
						积分结算
					</view>
				</view>

				<view class="item" @click="gotoBankCard">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-yinhangqia"></use>
					</svg>
					<view class="add-dishes">
						银行卡
					</view>
				</view>
				<!-- <view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view>
				<view class="item">
					<uni-icons type="plus" size="30"></uni-icons>
					<view class="add-dishes">
						待开发
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			gotopublish() {
				uni.navigateTo({
					url: '/pages/publish/publish'
				});
			},
			goTorelePage() {
				uni.navigateTo({
					url: '/pages/release/release'
				});
			},
			goToapply() {
				uni.navigateTo({
					url: '/pages/Apply/Apply'
				});
			},
			gotostalllist() {
				uni.navigateTo({
					url: '/pages/stalllist/stalllist'
				});
			},
			gotoListDis() {
				uni.navigateTo({
					url: '/pages/Listed-Dishes/Listed-Dishes'
				});
			},
			gotoOwneroders(orderStatus) {
				uni.navigateTo({
					url: `/pages/Ownerorders/Ownerorders?orderStatus=${orderStatus}`
				});
			},
			gotowallet() {
				uni.navigateTo({
					url: '/pages/wallet/wallet'
				});
			},
			gotoPoints() {
				uni.navigateTo({
					url: '/pages/Points/Points'
				});
			},
			gotoPointspayouts() {
				uni.navigateTo({
					url: '/pages/pointspayouts/pointspayouts'
				});
			},
			// 补充摊位资料页面
			gotoEditshop() {
				uni.navigateTo({
					url: '/pages/editshop/editshop'
				});
			},
			// 银行卡
			gotoBankCard() {
				uni.navigateTo({
					url: '/pages/bankCard/bankCard'
				});
			}
		}
	}
</script>

<style>
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