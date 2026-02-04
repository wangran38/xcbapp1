<template>
	<view class="market-detail-page">

		<view class="summary-card">
			<view class="summary-highlight">
				<view class="highlight-label">
					<text class="iconfont icon-money"></text>
					收益总额
				</view>
				<view class="highlight-value">¥{{ 0.0 }}</view>
			</view>

			<view class="summary-grid">
				<view class="summary-item">
					<view class="summary-label">
						<text class="iconfont icon-order"></text>
						订单总数
					</view>
					<view class="summary-value">{{totalOrderCount}} 个</view>
				</view>


				<view class="summary-item">
					<view class="summary-label">
						<text class="iconfont icon-stall"></text>
						拥有摊主
					</view>
					<view class="summary-value">{{ 0 }} 个</view>
				</view>

			</view>
		</view>


		<!-- 消费明细列表 -->
		<view class="content-container">
			<view class="empty-tip" v-if="!detailList.length && !hasMore">暂无消费明细数据</view>

			<view class="detail-container" v-if="detailList.length">
				<view class="detail-header">
					<view class="detail-col">订单号</view>
					<view class="detail-col">省代收益</view>
					<view class="detail-col">市县区代收益</view>
				</view>
				<view class="detail-item" v-for="item in detailList" :key="item.id">
					<view class="detail-col">{{ item.out_trade_no }}</view>
					<view class="detail-col">¥{{ item.level2money.toFixed(1) }}</view>
					<view class="detail-col">¥{{ item.level4money.toFixed(1) }}</view>
<!-- 					<view class="detail-col">{{ initDate(item.createtime) }}</view> -->
				</view>
			</view>

			<!-- 	<view class="load-more" @click="loadMore" v-if="hasMore">
				加载更多订单 <uni-icons type="down" size="14" />
			</view> -->
		</view>
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
				detailList: [],
				totalOrderCount: 0,
				hasMore: true,
				query: {
					page: 1,
					limit: 10,
					marketid: null
				}
			}
		},
		onLoad(options) {
			this.query.marketid = Number(options.marketId)

			this.loadDetailData()
		},
		methods: {

			// 加载消费明细
			async loadDetailData() {

				try {
					let data = await api.getMoneyalllist(this.query)
					console.log("订单数据:", data.data.listdasta)
					uni.showLoading({
						title: '加载明细...',
						mask: true
					})
					this.detailList =  [...this.detailList, ...data.data.listdata]

					this.totalOrderCount = data.data.totalnum
					this.hasMore = data.data.listdata.length < this.query.limit ? false:true

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


	/* 核心卡片容器 */
	.summary-card {
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 20rpx rgba(255, 125, 0, 0.08);
		padding: 30rpx 20rpx;
		margin: 20rpx 0;
		width: 100%;
		box-sizing: border-box;
		border: 1rpx solid #FFE8D0;
		margin-bottom: 20rpx;

	}

	/* 收益总额单独突出区 - 视觉核心 */
	.summary-highlight {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 25rpx 0;
		margin-bottom: 25rpx;
		/* 渐变背景突出收益 */
		background: linear-gradient(135deg, #FFF8F0 0%, #FFFAF5 100%);
		border-radius: 10rpx;
		position: relative;
	}

	/* 收益标签 */
	.highlight-label {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
		display: flex;
		align-items: center;
	}

	.highlight-label .iconfont {
		color: #FF7D00;
		font-size: 26rpx;
		margin-right: 10rpx;
	}

	/* 收益数值 - 极致醒目 */
	.highlight-value {
		font-size: 48rpx;
		font-weight: 800;
		color: #E86800;
		text-shadow: 0 0 10rpx rgba(255, 125, 0, 0.2);
		letter-spacing: 1rpx;
	}

	/* 5个小数据网格布局 - 规整排列 */
	.summary-grid {
		display: flex;
		flex-wrap: wrap;
		/* 自动换行，保证排列规则 */
		justify-content: space-between;
		gap: 15rpx 0;
		/* 项之间的上下间距 */
	}

	/* 小数据项 - 统一样式，2列/3列自适应 */
	.summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* 每2个占一行，自动均分宽度（5个则2+2+1，视觉更规整） */
		flex: 0 0 48%;
		padding: 15rpx 0;
		border-bottom: 1rpx solid #f8f8f8;
	}

	/* 最后一行的项去掉下边框 */
	.summary-item:nth-last-child(1),
	.summary-item:nth-last-child(2) {
		border-bottom: none;
	}

	/* 小数据标签 */
	.summary-label {
		font-size: 24rpx;
		color: #555;
		margin-bottom: 8rpx;
		display: flex;
		align-items: center;
	}

	.summary-label .iconfont {
		color: #FF9500;
		font-size: 22rpx;
		margin-right: 8rpx;
	}

	/* 小数据数值 */
	.summary-value {
		font-size: 28rpx;
		font-weight: 700;
		color: #FF7D00;
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
		font-size: 25rpx;
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