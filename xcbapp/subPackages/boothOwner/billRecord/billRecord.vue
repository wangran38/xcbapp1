<template>
	<view class="container">
		<!-- 统计与筛选 -->
		<view class="header">
			<text class="total-count">共 {{ total }} 条提现记录</text>
			<picker @change="statusChange" :range="filterOptions">
				<view class="filter-btn">
					{{ currentFilter }}
					<uni-icons type="arrowdown" size="14" color="#666" />
				</view>
			</picker>
		</view>

		<!-- 记录列表 -->
		<scroll-view scroll-y class="record-list" @scrolltolower="loadMore">
			<view v-for="(item, index) in showList" :key="item.id" class="record-card">
				<view class="card-content">
					<view class="left-section">
						<text class="time">{{ initTime(item.createtime) }}</text>
						<text class="amount">¥{{ item.shopmoney.toFixed(2) }}</text>
					</view>
					<view class="status" :style="item.status == 1 ? 'background: #FFF3E0;color: #FFA726;':'background: #E8F5E9;color: #4CAF50;'">
						{{ item.status === 1 ? '申请中' : '已完成' }}
					</view>
				</view>
			</view>
			<view class="load-more">
				{{ loadStatus === 'loading' ? '正在加载...' : '没有更多数据了' }}
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

	export default {
		mixins: [myMixin],
		data() {
			return {
				showList: [],
				currentFilter: '全部',
				filterOptions: ['全部', '申请中', '已完成'],
				page: 1,
				pageSize: 10,
				total: 0,
				loadStatus: 'loading',
				query: {
					page: 1,
					limit: 10,
					status: 0 // 默认0加载全部
				},
			}
		},

		methods: {
			// 初始化模拟数据
			initMockData() {
				this.loadData()
			},


			// 状态筛选
			statusChange(e) {
				// 清空原有数据
				this.showList = []
				this.currentFilter = this.filterOptions[e.detail.value]
				console.log(e.detail.value)
				switch (e.detail.value){
					case 0:
						this.query.status= 0
						break;
					case 1:
						this.query.status= 1
						break;
					case 2:
						this.query.status= 2
						break;
				}
				this.query.page = 1
				this.loadData()
			},

			// 加载数据
			async loadData() {
				let res = await api.shopmoneylist(this.query)
				if (res.code == 200) {
					this.total=res.data.totalnum
					this.showList = [...this.showList, ...res.data.listdata]
					this.loadStatus = res.data.listdata.length <this.query.limit ? 'more':'loading'
				}
			},

			// 加载更多
			loadMore() {
				if (this.loadStatus !== 'more') return
				this.query.page += 1
				this.loadData()
			}
		},
		mounted() {
			this.initMockData()

		}
	}
</script>

<style lang="scss">
	.container {
		padding: 24rpx;
		background: #f8f9fa;
		min-height: 100vh;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
		padding: 0 16rpx;

		.total-count {
			font-size: 28rpx;
			color: #666;
			font-weight: 500;
		}

		.filter-btn {
			background: #fff;
			padding: 12rpx 32rpx;
			border-radius: 40rpx;
			font-size: 26rpx;
			color: #333;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
			display: flex;
			align-items: center;
			gap: 8rpx;
		}
	}

	.record-list {
		height: calc(100vh - 160rpx);

		.record-card {
			background: #fff;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			padding: 32rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
			transition: transform 0.2s;

			&:active {
				transform: scale(0.98);
			}

			.card-content {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left-section {
					.time {
						display: block;
						font-size: 26rpx;
						color: #909399;
						margin-bottom: 12rpx;
					}

					.amount {
						font-size: 36rpx;
						font-weight: 600;
						color: #303133;
					}
				}

				.status {
					padding: 8rpx 24rpx;
					border-radius: 40rpx;
					font-size: 24rpx;
					font-weight: 500;

				}
			}
		}

		.load-more {
			text-align: center;
			padding: 24rpx;
			color: #999;
			font-size: 26rpx;
		}
	}

	/* 暗黑模式适配 */
	// @media (prefers-color-scheme: dark) {
	// 	.container {
	// 		// background: #121212;

	// 		.header {
	// 			.filter-btn {
	// 				background: #2d2d2d;
	// 				color: #ddd;
	// 			}
	// 		}

	// 		.record-card {
	// 			background: #242424;

	// 			.card-content {
	// 				.left-section {
	// 					.time {
	// 						color: #888;
	// 					}

	// 					.amount {
	// 						color: #eee;
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }
</style>