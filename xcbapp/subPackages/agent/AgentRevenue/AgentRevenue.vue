<template>
	<view class="agent-profit-page">
		<view class="overview-container">
			<view class="overview-card">
				<view class="overview-item">
					<text class="overview-label">累计收益 (元)</text>
					<text class="overview-value pending-value">¥ {{ totalMoney.toFixed(2) }}</text>
				</view>
			</view>
		</view>
		<view class="explanation">
			<text>推广说明：您推广的用户完成订单支付后，系统将自动计算并发放收益。</text>
		</view>
		<scroll-view class="profit-list" scroll-y @scrolltolower="loadMore">
			<view class="list-item" v-for="(item, index) in profitRecords" :key="index">
				<view class="item-left">
					<view class="order-icon">
						<text class="icon-text">订</text>
					</view>
					<view class="item-info">
						<view class="item-order-no">订单号:{{ item.out_trade_no }}</view>
						<view class="item-time">创建时间：{{ formatTime(item.createtime) }}</view>
					</view>
				</view>
				<view class="item-right">
					<text class="item-amount"
						:class="{'amount-pending': item.status === 'pending', 'amount-settled': item.status === 'settled'}">
						{{ item.status === 'pending' ? '+¥' : '¥' }}{{ item.level4money.toFixed(2) }}
					</text>
				</view>
			</view>
			<view class="empty-state" v-if="profitRecords.length === 0 && !loading">
				<text class="empty-text">暂无推广收益记录</text>
				<text class="empty-hint">分享您的推广链接，邀请用户下单即可获得收益</text>
			</view>
			<view class="loading-state" v-if="loading">
				<uni-load-more :status="loadStatus"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		myMixin
	} from '@/utils/public.js';
	import {
		api
	} from '@/api/index.js';

	export default {
		mixins: [myMixin],
		data() {
			return {
				totalMoney: 0, // 发展佣金
				profitRecords: [],
				query: {
					page: 1,
					limit: 10,
				},
				loading: false,
				loadStatus: 'more', // 'more', 'loading', 'noMore'
				hasMore: true,
			};
		},
		onLoad() {
			this.fetchProfitData();
		},
		methods: {
			/**
			 * 格式化时间
			 * @param {String} timeStr - 原始时间字符串
			 * @returns {String} 格式化后的时间
			 */
			formatTime(timeStr) {
				if (!timeStr) return '';
				const date = new Date(timeStr);
				return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
			},

			/**
			 * 获取收益数据（概览 + 列表）
			 */
			async fetchProfitData() {
				this.loading = true;
				this.loadStatus = 'loading';
				try {
					const response = await api.cityAgentRevenue(this.query);

					if (response.code === 200) {
						const data = response.data;

						// 更新概览数据
						this.totalMoney = data.totalMoney || 0;

						// 更新列表数据
						if (this.query.page === 1) {
							this.profitRecords = data.listdata || [];
						} else {
							this.profitRecords = [...this.profitRecords, ...data.listdata];
						}

						// 判断是否还有更多数据
						this.hasMore = this.query.page * this.query.limit < data.total_count;
						this.loadStatus = this.hasMore ? 'more' : 'noMore';
					} else {
						uni.showToast({
							title: response.message || '获取收益数据失败',
							icon: 'none'
						});
						this.loadStatus = 'more';
					}
				} catch (error) {
					console.error('获取代理商收益数据失败:', error);
					uni.showToast({
						title: '网络请求异常',
						icon: 'none'
					});
					this.loadStatus = 'more';
				} finally {
					this.loading = false;
				}
			},

			/**
			 * 下拉加载更多
			 */
			loadMore() {
				if (!this.hasMore || this.loading) return;
				this.query.page++;
				this.fetchProfitData();
			}
		}
	};
</script>

<style scoped>
	/* 页面容器 */
	.agent-profit-page {
		background-color: #f5f5f7;
		min-height: 100vh;
		font-size: 14px;
	}

	/* 导航栏 */
	.navbar {
		height: 48px;
		background-color: #409EFF;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.nav-title {
		color: #ffffff;
		font-size: 18px;
		font-weight: 500;
	}

	/* 收益概览容器 */
	.overview-container {
		padding: 0 15px;
		margin-top: 15px;
	}

	/* 收益概览卡片 */
	.overview-card {
		background-color: #ffffff;
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 15px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.split-card {
		display: flex;
		justify-content: space-between;
	}

	.overview-item {
		text-align: center;
	}

	.half-item {
		flex: 1;
	}

	/* 为中间的分割线添加样式 */
	.split-card .overview-item:first-child {
		border-right: 1px solid #f0f0f0;
	}

	.split-card .overview-item:last-child {
		padding-left: 20px;
	}

	.overview-label {
		color: #666666;
		font-size: 14px;
		display: block;
		margin-bottom: 8px;
	}

	.overview-value {
		color: #333333;
		font-size: 24px;
		font-weight: bold;
	}

	.pending-value {
		color: #fa8c16;
		/* 橙色 - 待结算 */
	}

	.settled-value {
		color: #52c41a;
		/* 绿色 - 已结算 */
	}

	/* 说明文字 */
	.explanation {
		padding: 0 15px 10px;
		color: #666666;
		font-size: 13px;
	}

	.profit-list {
		/* margin: 10px 15px 0; */
		height: calc(100vh - 48px - 220px);
	}

	.list-item {
		margin: 10rpx 0 10rpx 0;
	  background-color: #ffffff;
	  padding: 15px;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  border-bottom: 1px solid #f5f5f5;
	}

	.item-left {
		display: flex;
		align-items: flex-start;
		flex: 1;
	}

	.order-icon {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		color: #ffffff;
		font-weight: bold;
		background-color: #409EFF;
		font-size: 12px;
	}

	.item-info {
		flex: 1;
	}

	.item-order-no {
		color: #333333;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.4;
	}

	.item-product,
	.item-time {
		color: #999999;
		font-size: 12px;
		line-height: 1.5;
	}

	.item-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
	}

	.item-amount {
		color: #f5222d;
		font-size: 16px;
		font-weight: 500;
	}

	.amount-pending {
		color: #fa8c16;
		/* 橙色 - 待结算 */
	}

	.amount-settled {
		color: #52c41a;
		/* 绿色 - 已结算 */
	}

	.item-status {
		font-size: 12px;
		margin-top: 4px;
		padding: 2px 6px;
		border-radius: 4px;
	}

	.status-pending {
		color: #fa8c16;
		background-color: #fff7e6;
	}

	.status-settled {
		color: #52c41a;
		background-color: #f6ffed;
	}

	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: #999999;
		padding: 0 20px;
		text-align: center;
	}

	.empty-text {
		font-size: 15px;
		margin-bottom: 8px;
	}

	.empty-hint {
		font-size: 13px;
		line-height: 1.5;
	}

	/* 加载状态 */
	.loading-state {
		padding: 15px;
		text-align: center;
	}
</style>