<template>
	<view class="container">
		<view class="header-bar">
			<text class="platform-name">批发</text>
<!-- 			<uni-icons type="notification" size="28" color="#2d3436" />
			<view
				style="width: 30rpx; height: 30rpx; position: absolute; right: 12rpx; border: 5rpx solid red; background-color: red; top: 5rpx;border-radius: 50%; text-align: center; line-height: 30rpx; font-size: 17rpx; font-weight: bold;">
				100</view> -->
		</view>

		<!-- 主内容区域 -->
		<view class="main-content">
			<!-- 供应大厅卡片 -->
			<view class="nav-card supply-card" :style="{height: cardHeight}" @click="goToSupply">
				<view class="card-inner">
					<uni-icons type="shop-filled" size="48" color="#fff" />
					<text class="card-title">供应大厅</text>
					<text class="card-desc">浏览最新货源信息</text>
				</view>
			</view>

			<!-- 采购大厅卡片 -->
			<view class="nav-card purchase-card" :style="{height: cardHeight}" @click="goToPurchase">
				<view class="card-inner">
					<uni-icons type="cart-filled" size="48" color="#fff" />
					<text class="card-title">采购大厅</text>
					<text class="card-desc">发布采购需求</text>
				</view>
			</view>

			<view class="stats-panel">
				<view class="stats-item">
					<text class="stats-value">1,502</text>
					<text class="stats-label">今日供应量</text>
				</view>
				<view class="stats-item">
					<text class="stats-value">893</text>
					<text class="stats-label">今日采购量</text>
				</view>
			</view>
			
			<view style="margin: 30rpx 0 0 0; display: flex; justify-content: center;" @click="toggle('bottom')">
				<uni-icons type="plusempty" size="40" style="background-color: limegreen; padding: 20rpx; border-radius: 10rpx; color: white;"></uni-icons>
			</view>
			
			<uni-popup ref="popup" style="padding-bottom: 0;">
				<view style="height: 30vh; border-radius:30rpx 30rpx 0rpx 0rpx; background-color: white; display: flex; justify-content: center; align-items: center;">
					<view style="text-align: center; margin: 0 50rpx 0 0;" >
						<uni-icons type="plusempty" size="40" style="border-radius: 50%;" @click="goToAddPurchase"></uni-icons>
						<view style="font-size: 30rpx; font-weight: bold;">发采购</view>
						<view class="label">让百万供应商为你报价</view>
					</view>
					<view style="text-align: center;">
						<uni-icons type="plusempty" size="40" style="border-radius: 50%;" @click="goToAddSupply"></uni-icons>
						<view style="font-size: 30rpx; font-weight: bold;">发商品</view>
						<view class="label">千万采购商找到你</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardHeight: '380rpx' // 默认卡片高度
			};
		},
		onLoad() {
			this.calculateLayout();
		},
		methods: {
			goToAddPurchase(){
				uni.navigateTo({
					url:'/subPackages/Wholesale/addPurchase/addPurchase'
				})
			},
			goToAddSupply(){
				uni.navigateTo({
					url:'/subPackages/Wholesale/addSupply/addSupply'
				})
			},
			toggle(type) {
				this.type = type
				this.$refs.popup.open(type)
			},
			goToPurchase() {
				uni.navigateTo({
					url: '/subPackages/Wholesale/purchase/purchase'
				})
			},
			goToSupply() {
				uni.navigateTo({
					url: '/subPackages/Wholesale/supply/supply'
				})
			},

			// 计算布局尺寸
			calculateLayout() {
				const systemInfo = uni.getSystemInfoSync();
				this.cardHeight = `${systemInfo.windowHeight * 0.3}px`;
			},

			// 页面跳转
			navigateTo(type) {
				const routes = {
					supply: '/pages/supply/supply',
					purchase: '/pages/purchase/purchase'
				};
				uni.navigateTo({
					url: routes[type]
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.vue-ref{
		padding-bottom: 0px;
	}
	.label{
		color:gray;
	}
	$primary-blue: #2d8cf0;
	$primary-orange: #ff6a00;

	.container {
		height: 100vh;
		background: #f8f9fb;
		display: flex;
		flex-direction: column;

		.header-bar {
			padding: 24rpx 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: rgba(255, 255, 255, 0.92);
			backdrop-filter: blur(8px);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

			.platform-name {
				font-size: 36rpx;
				font-weight: 600;
				color: #2d3436;
				letter-spacing: 1rpx;
			}
		}

		.main-content {
			flex: 1;
			padding: 32rpx;

			.nav-card {
				border-radius: 24rpx;
				margin-bottom: 32rpx;
				overflow: hidden;
				position: relative;
				box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
				transition: transform 0.2s ease;

				&:active {
					transform: scale(0.98);
				}

				.card-inner {
					padding: 48rpx;
					color: #fff;

					.card-title {
						display: block;
						font-size: 40rpx;
						margin: 24rpx 0 12rpx;
						font-weight: 500;
					}

					.card-desc {
						font-size: 28rpx;
						opacity: 0.95;
					}
				}

				&.supply-card {
					background: linear-gradient(135deg, $primary-blue, lighten($primary-blue, 8%));
				}

				&.purchase-card {
					background: linear-gradient(135deg, $primary-orange, lighten($primary-orange, 8%));
				}
			}

			.stats-panel {
				background: #fff;
				border-radius: 16rpx;
				padding: 32rpx;
				display: flex;
				justify-content: space-around;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

				.stats-item {
					text-align: center;

					.stats-value {
						margin: 0 0 10rpx 0;
						display: block;
						font-size: 48rpx;
						font-weight: 700;
						color: #2d3436;
					}

					.stats-label {
						font-size: 26rpx;
						color: #7f8c8d;
						margin-top: 8rpx;
					}
				}
			}
		}
	}
</style>