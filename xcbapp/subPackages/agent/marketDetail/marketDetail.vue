<template>
	<view class="market-detail-page">
		<!-- 页面头部 -->
		<!--    <view class="page-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="left" size="18" /> 返回
      </view>
      <view class="header-title">{{ marketName }} - 消费明细</view>
    </view> -->

		<!-- 汇总数据 -->
		<view class="summary-card">
			<view class="summary-item">
				<view class="summary-label">消费总额</view>
				<view class="summary-value">¥{{ '999999' }}</view>
			</view>
			<view class="summary-item">
				<view class="summary-label">订单数</view>
				<view class="summary-value">{{ totalOrderCount }} 笔</view>
			</view>
			<view class="summary-item">
				<view class="summary-label">代理总收益</view>
				<view class="summary-value">¥{{ '999999' }}</view>
			</view>
		</view>

		<!-- 筛选栏 -->
		<!-- <view class="filter-bar">
			<picker mode="date" :start="startDate" :end="endDate" @change="changeDate">
				<view class="filter-text">
					{{ selectedDate }} <uni-icons type="calendar" size="14" />
				</view>
			</picker>
			<view class="filter-text" @click="resetFilter">
				重置 <uni-icons type="refresh" size="14" />
			</view>
		</view> -->

		<!-- 消费明细列表 -->
		<view class="content-container">
			<view class="empty-tip" v-if="!detailList.length && !hasMore">暂无消费明细数据</view>

			<view class="detail-container" v-if="detailList.length">
				<view class="detail-header">
					<view class="detail-col">订单号</view>
					<view class="detail-col">消费金额</view>
					<view class="detail-col">消费时间</view>
					<view class="detail-col">代理收益</view>
				</view>
				<view class="detail-item" v-for="item in detailList" :key="item.id">
					<view class="detail-col">{{ item.orderNo }}</view>
					<view class="detail-col">¥{{ item.amount.toFixed(2) }}</view>
					<view class="detail-col">{{ item.consumeTime }}</view>
					<view class="detail-col profit">¥{{ item.profit.toFixed(2) }}</view>
				</view>
			</view>

			<view class="load-more" @click="loadMore" v-if="hasMore">
				加载更多订单 <uni-icons type="down" size="14" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				marketId: '',
				marketName: '',
				districtName: '',
				cityName: '',
				detailList: [],
				totalConsume: 0,
				totalOrderCount: 0,
				totalProfit: 0,
				pageNum: 1,
				pageSize: 10,
				hasMore: true,
				// 筛选
				startDate: '2024-01-01',
				endDate: new Date().toISOString().split('T')[0],
				selectedDate: '全部时间'
			}
		},
		onLoad(options) {
			this.marketId = options.marketId
			this.marketName = options.marketName
			this.districtName = options.districtName
			this.cityName = options.cityName
			this.loadDetailData()
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},

			// 时间筛选
			changeDate(e) {
				this.selectedDate = e.detail.value
				this.pageNum = 1
				this.hasMore = true
				this.loadDetailData()
			},

			// 重置筛选
			resetFilter() {
				this.selectedDate = '全部时间'
				this.pageNum = 1
				this.hasMore = true
				this.loadDetailData()
			},

			// 加载消费明细
			loadDetailData() {
				try {
					uni.showLoading({
						title: '加载明细...',
						mask: true
					})

					// 生成模拟明细数据
					const allDetails = []
					for (let i = 1; i <= 100; i++) {
						const amount = 50 + Math.floor(Math.random() * 500) + Math.random()
						const profit = amount * 0.1 // 10%收益
						const date =
							`2024-0${Math.floor(Math.random()*6)+1}-${Math.floor(Math.random()*28)+1} ${Math.floor(Math.random()*24).toString().padStart(2, '0')}:${Math.floor(Math.random()*60).toString().padStart(2, '0')}`
						allDetails.push({
							id: `order_${this.marketId}_${i}`,
							orderNo: `OD${date.replace(/-| |:/g, '').substring(0, 12)}`,
							amount: amount,
							consumeTime: date,
							profit: profit
						})
					}

					const paginatedData = allDetails.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this
						.pageSize)

					this.detailList = this.pageNum === 1 ? paginatedData : [...this.detailList, ...paginatedData]
					this.totalConsume = allDetails.reduce((sum, item) => sum + item.amount, 0)
					this.totalOrderCount = allDetails.length
					this.totalProfit = allDetails.reduce((sum, item) => sum + item.profit, 0)
					this.hasMore = this.pageNum * this.pageSize < allDetails.length

					uni.hideLoading()
				} catch (error) {
					console.error('加载明细数据失败：', error)
					uni.showToast({
						title: '数据加载失败',
						icon: 'none'
					})
				}
			},

			// 加载更多
			loadMore() {
				this.pageNum++
				this.loadDetailData()
			}
		}
	}
</script>

<style scoped>
	.market-detail-page {
		background-color: #f8f9fa;
		min-height: 100vh;
		font-size: 14px;
		padding-bottom: 40px;
	}

	.page-header {
		padding: 15px 16px;
		background-color: #fff;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
	}

	.back-btn {
		font-size: 14px;
		color: #4285F4;
		margin-right: 15px;
	}

	.header-title {
		font-size: 16px;
		font-weight: 500;
		color: #2d3748;
	}

	.summary-card {
		background-color: #fff;
		border-radius: 12px;
		padding: 15px;
		margin: 15px auto;
		width: 92%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-around;
	}

	.summary-item {
		text-align: center;
	}

	.summary-label {
		font-size: 12px;
		color: #718096;
		margin-bottom: 5px;
	}

	.summary-value {
		font-size: 16px;
		font-weight: 600;
		color: #2d3748;
	}

	.filter-bar {
		width: 92%;
		margin: 0 auto 15px;
		display: flex;
		gap: 10px;
	}

	.filter-text {
		background-color: #fff;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 12px;
		color: #4285F4;
		display: inline-block;
		cursor: pointer;
	}

	.content-container {
		width: 92%;
		margin: 0 auto;
	}

	.empty-tip {
		text-align: center;
		padding: 60px 0;
		color: #999;
	}

	.detail-container {
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.detail-header {
		display: flex;
		padding: 12px 15px;
		background-color: #f0f0f0;
		font-size: 12px;
		color: #718096;
		border-bottom: 1px solid #f5f5f5;
	}

	.detail-col {
		flex: 1;
		text-align: center;
	}

	.detail-item {
		display: flex;
		padding: 12px 15px;
		border-bottom: 1px solid #f5f5f5;
		font-size: 13px;
		color: #2d3748;
	}

	.detail-item:last-child {
		border-bottom: none;
	}

	.detail-col.profit {
		color: #e53e3e;
		font-weight: 500;
	}

	.load-more {
		text-align: center;
		padding: 15px 0;
		font-size: 13px;
		color: #4285F4;
		cursor: pointer;
	}

	/* 响应式适配 */
	@media (max-width: 767px) {
		.summary-card {
			flex-direction: column;
			gap: 10px;
		}

		.detail-header,
		.detail-item {
			font-size: 11px;
		}

		.detail-col:nth-child(1) {
			flex: 2;
		}

		.detail-col:nth-child(2),
		.detail-col:nth-child(3),
		.detail-col:nth-child(4) {
			flex: 1;
		}
	}
</style>