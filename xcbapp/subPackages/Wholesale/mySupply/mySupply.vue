<template>
	<view class="supply-container">
		<!-- 渐变头部 -->
		<view class="header-bg">
			<view class="header-content">
				<text class="title">我的供应</text>
				<text class="count">共{{ dataTotal }}条记录</text>
			</view>
		</view>

		<!-- 供应列表 -->
		<scroll-view scroll-y class="card-list">
			<!-- 供应卡片 -->
			<view v-for="item in supplyData" :key="item.id" class="supply-card" :class="'status-' + item.status">
				<!-- 商品信息 -->
				<view class="card-header">
					<image :src="item.selllogo" class="product-thumb" mode="aspectFill" />
				</view>

				<!-- 详细信息 -->
				<view class="card-body">
					<view class="main-info">
						<text class="product-name">{{ item.selltitle }}</text>
						<view class="specs">
							<view class="spec-item">
								<uni-icons type="wallet" size="16" color="#666" />
								<text class="price">¥{{ item.price.toFixed(2) }}/{{ item.unit }}</text>
							</view>
							<view class="spec-item">
								<uni-icons type="shop" size="16" color="#666" />
								<text>库存 {{ item.sellnumber }}{{ item.unit }}</text>
							</view>
						</view>
					</view>

					<view class="supply-details">
						<view class="detail-item">
							<uni-icons type="location" size="14" color="#666" />
							<text class="address">{{ item.selladdress }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="!supplyData.length" class="empty-state">
				<image src="/static/empty-supply.png" class="empty-img" />
				<text class="empty-text">暂无供应信息</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	import {
		myMixin
	} from '@/utils/public.js'
	import mButtonVue from '@/components/public/mButton/mButton.vue'

	export default {
		components: {
			mButtonVue
		},
		data() {
			return {
				queryData: {
					page: 1,
					limit: 10
				},
				dataTotal: null,
				noMore: false,
				supplyData: [

				],
				statusConfig: {
					1: {
						text: '供应中',
						color: '#4cd964'
					},
					2: {
						text: '已下架',
						color: '#909399'
					}
				}
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			async getData() {
				let data = await api.mySupplyData(this.queryData)
				console.log(data)
				if (data.code == 200) {
					this.dataTotal = data.data.totalnum
					this.supplyData = [...this.supplyData, ...data.data.listdata]
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.supply-container {
		background: #f8f9fa;
		min-height: 100vh;

		.header-bg {
			background: linear-gradient(135deg, #2c3e50, #3498db);
			padding: 40rpx 32rpx 120rpx;
			color: white;

			.title {
				font-size: 44rpx;
				font-weight: 600;
				display: block;
				margin-bottom: 16rpx;
			}

			.count {
				font-size: 28rpx;
				opacity: 0.9;
			}
		}

		.card-list {
			position: relative;
			top: -80rpx;
			padding: 0 32rpx 120rpx;
		}

		.supply-card {
			width: 700rpx;
			background: #fff;
			border-radius: 24rpx;
			margin-bottom: 32rpx;
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
			overflow: hidden;

			&.status-1 {
				border-left: 8rpx solid #4cd964;
			}

			&.status-2 {
				border-left: 8rpx solid #909399;
			}

			.product-thumb {
				width: 100%;
				height: 320rpx;
				background: #f0f2f5;
			}

			.status-tag {
				position: absolute;
				top: 24rpx;
				left: 24rpx;
				background: rgba(0, 0, 0, 0.7);
				padding: 8rpx 24rpx;
				border-radius: 40rpx;
				color: white;
				font-size: 24rpx;
				display: flex;
				align-items: center;

				.dot {
					width: 12rpx;
					height: 12rpx;
					border-radius: 50%;
					margin-right: 12rpx;
				}
			}

			.card-body {
				padding: 32rpx;

				.product-name {
					font-size: 34rpx;
					font-weight: 500;
					color: #2c3e50;
					line-height: 1.4;
					margin-bottom: 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.specs {
					display: flex;
					gap: 32rpx;
					margin-bottom: 32rpx;

					.spec-item {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: #666;

						.price {
							color: #e64340;
							font-weight: 500;
							margin-left: 8rpx;
						}
					}
				}

				.supply-details {
					background: #f8f9fa;
					border-radius: 12rpx;
					padding: 24rpx;

					.detail-item {
						display: flex;
						align-items: center;
						margin-bottom: 16rpx;
						font-size: 26rpx;
						color: #666;

						&:last-child {
							margin-bottom: 0;
						}

						.address {
							margin-left: 8rpx;
							max-width: 80%;
						}
					}
				}
			}
		}

		.empty-state {
			text-align: center;
			padding: 100rpx 0;

			.empty-img {
				width: 300rpx;
				height: 300rpx;
				opacity: 0.8;
			}

			.empty-text {
				display: block;
				color: #666;
				margin: 20rpx 0;
				font-size: 28rpx;
			}
		}
	}

	@media (min-width: 768px) {
		.supply-container {
			.card-list {
				max-width: 1200px;
				margin: 0 auto;
			}

			.supply-card {
				margin-bottom: 48rpx;

				.card-body {
					padding: 48rpx;
				}
			}
		}
	}
</style>