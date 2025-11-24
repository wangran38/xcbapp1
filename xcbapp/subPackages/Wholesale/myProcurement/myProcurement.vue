<template>
	<view class="purchase-list">
		<!-- 沉浸式标题栏 -->
		<view class="app-bar">
			<text class="title">我的采购</text>
			<view class="stats">
				<text class="count">{{ dataTotal }}条记录</text>
				<uni-icons type="filter" size="20" color="#fff" />
			</view>
		</view>

		<!-- 卡片式列表 -->
		<scroll-view scroll-y class="card-list">
			<view v-for="(item, index) in listData" :key="item.id" class="purchase-card"
				:class="'status-' + item.status">

				<!-- 信息容器 -->
				<view class="card-content">
					<view class="status-bar">
						<view class="status-tag">
							<view class="dot" :style="{backgroundColor: statusConfig[1].color}"></view>
							{{ statusConfig[1].text }}
						</view>
					</view>

					<!-- 核心信息 -->
					<view class="main-info">
						<text class="product-name">{{ item.infotitle }}</text>
						<view class="specs">
							<view class="spec-item">
								<uni-icons type="shop" size="16" color="#666" />
								<text>{{ item.infonumber }}{{ item.unit }}</text>
							</view>
							<view class="spec-item">
								<uni-icons type="calendar" size="16" color="#666" />
								<text>{{ initDate(item.stoptime) }}截止</text>
							</view>
						</view>
					</view>

					<!-- 地址信息 -->
					<view class="address-info">
						<uni-icons type="location" size="16" color="#666" />
						<text class="address">{{ item.buyaddress }}</text>
					</view>
					<view class="address-info">
						注:
						<text class="address">{{ item.content }}</text>
					</view>

					<!-- 供应商动态 -->
					<view class="supplier-info">
						<text class="quote-count">{{ 1 }}家已报价</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	import {myMixin} from '@/utils/public.js'

	export default {
		mixins:[myMixin],
		data() {
			return {
				dataTotal:null,
				listData: [
				],
				statusConfig: {
					1: {
						text: '报价中',
						color: '#007AFF'
					},
					2: {
						text: '已截单',
						color: '#4cd964'
					},
					3: {
						text: '已完成',
						color: '#909399'
					}
				},
				noMore:false,
				queryData:{
					page:1,
					limit:10
				}
			}
		},
		methods: {
			async getData(){
				let data = await api.myProcurementData(this.queryData)
				console.log(data)
				if (data.code == 200){
					this.dataTotal = data.data.totalnum
					this.listData = [...this.listData,...data.data.listdata]
				}
			}
		},
		async onLoad() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
	.purchase-list {
		background: #f8f9fa;
		min-height: 100vh;

		.app-bar {
			background: linear-gradient(135deg, #2c3e50, #3498db);
			color: white;
			padding: 40rpx 32rpx 100rpx;

			.title {
				font-size: 44rpx;
				font-weight: 600;
				display: block;
				margin-bottom: 16rpx;
			}

			.stats {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				opacity: 0.9;

				.count {
					margin-right: 16rpx;
				}
			}
		}

		.card-list {
			position: relative;
			top: -80rpx;
			padding: 0 32rpx;
		}

		.purchase-card {
			width: 700rpx;
			background: white;
			border-radius: 24rpx;
			margin-bottom: 32rpx;
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
			overflow: hidden;
			transition: transform 0.3s ease;

			&:active {
				transform: scale(0.98);
			}

			.product-thumb {
				width: 100%;
				height: 320rpx;
				background: #f0f2f5;
			}

			.card-content {
				padding: 32rpx;
			}

			.status-bar {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24rpx;

				.status-tag {
					font-size: 26rpx;
					display: flex;
					align-items: center;

					.dot {
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						margin-right: 12rpx;
					}
				}

				.update-time {
					color: #666;
					font-size: 24rpx;
				}
			}

			.main-info {
				margin-bottom: 32rpx;

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

					.spec-item {
						display: flex;
						align-items: center;
						color: #666;
						font-size: 26rpx;

						uni-icons {
							margin-right: 8rpx;
						}
					}
				}
			}

			.address-info {
				display: flex;
				align-items: center;
				background: #f8f9fa;
				padding: 20rpx;
				border-radius: 12rpx;
				margin-bottom: 32rpx;

				.address {
					color: #666;
					font-size: 26rpx;
					margin-left: 12rpx;
				}
			}

			.supplier-info {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.avatar-group {
					display: flex;

					.supplier-avatar {
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						border: 2rpx solid white;
						margin-left: -16rpx;

						&:first-child {
							margin-left: 0;
						}
					}
				}

				.quote-count {
					color: #007AFF;
					font-size: 26rpx;
				}
			}
		}
	}
</style>