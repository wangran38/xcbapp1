<template>
	<view class="district-detail-page">


		<view class="summary-card">
			<view class="summary-highlight">
				<view class="highlight-label">
					<text class="iconfont icon-money"></text>
					收益总额
				</view>
				<view class="highlight-value">¥{{data.total_money.toFixed(2) }}</view>
			</view>

			<view class="summary-grid">
				<view class="summary-item">
					<view class="summary-label">
						<text class="iconfont icon-order"></text>
						订单总数
					</view>
					<view class="summary-value">{{data.order_count}} 个</view>
				</view>
				<view class="summary-item">
					<view class="summary-label">
						<text class="iconfont icon-market"></text>
						拥有菜市场
					</view>
					<view class="summary-value">{{ data.market_count }} 个</view>
				</view>
				<view class="summary-item">
					<view class="summary-label">
						<text class="iconfont icon-farmer"></text>
						拥有农户
					</view>
					<view class="summary-value">{{ data.farmers_count }} 个</view>
				</view>
				<view class="summary-item">
					<view class="summary-label">
						<text class="iconfont icon-stall"></text>
						拥有摊主
					</view>
					<view class="summary-value">{{ data.shop_count }} 个</view>
				</view>
				<view class="summary-item">
					<view class="summary-label">
						<text class="iconfont icon-wholesaler"></text>
						拥有批发商
					</view>
					<view class="summary-value">{{ 0 }} 个</view>
				</view>
			</view>
		</view>

		<view class="jump-entrance">
			<button class="jump-btn" @click="goNavigateTo('/subPackages/agent/farmerList/farmerList')">地区农户</button>
			<button class="jump-btn" @click="goNavigateTo('/subPackages/agent/supplyInfo/supplyInfo')">供求信息</button>
		</view>

		<!-- 菜市场列表 -->
		<view class="content-container">
			<view style="margin: 20rpx; font-weight: bold;font-size: 35rpx;">菜市场</view>

			<view class="empty-tip" v-if="!marketList.length">暂无菜市场数据</view>

			<view class="card-list" v-else>
				<view class="market-card" v-for="(market, index) in marketList" :key="market.id"
					@click="toMarketDetail(market)">
					<view class="card-header">
						<view class="card-title">{{ market.marketname }}</view>
						<uni-icons type="arrowright" size="16" color="#999" />
					</view>
					<view class="card-body">
						<view class="card-item">
							<view class="item-label">收益总额</view>
							<view class="item-value">¥{{ 0 }}</view>
						</view>
						<view class="card-item">
							<view class="item-label">订单数</view>
							<view class="item-value">{{ 0 }} 笔</view>
						</view>
					</view>
				</view>
			</view>

		
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	export default {
		data() {
			return {
				districtId: '',
				districtName: '',
				cityName: '',

				marketList: [],
				totalMarketCount: 0,
				totalConsume: 0,
				totalOrderCount: 0,
				pageNum: 1,
				pageSize: 5,
				hasMore: true,
				// 筛选
				startDate: '2024-01-01',
				endDate: new Date().toISOString().split('T')[0],
				selectedDate: '全部时间',
				query: {
					area_id: null,
					limit: 100
				},
				data: null
			}
		},
		onLoad(options) {

			let data = JSON.parse(options.data)
			// console.log("子组件数据",data)
			this.data = data

			this.query.area_id = Number(this.data.id)

			this.loadMarketData()
		},
		methods: {
			goNavigateTo(url) {
				let data = JSON.stringify(this.data)
				try {
					uni.navigateTo({
						url:url+`?data=${data}`
					});
				} catch {
					console.log('跳转异常')
				}
			},

			// 加载菜市场数据
			async loadMarketData() {
				try {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})


					let data = await api.marketlist(this.query.area_id, this.query.limit)



					if (data.code == 200) {
						this.marketList = [...data.data.listdata]
					}


					uni.hideLoading()
				} catch (error) {
					console.error('加载菜市场数据失败：', error)
					uni.showToast({
						title: '数据加载失败',
						icon: 'none'
					})
				}
			},

			// 加载更多
			loadMore() {
				this.pageNum++
				this.loadMarketData()
			},

			// 跳转到菜市场详情页
			toMarketDetail(market) {
				// console.log("跳转菜市场传递的数据:",market)
				uni.navigateTo({
					url: `/subPackages/agent/marketDetail/marketDetail?marketId=${market.id}`
				})
			},

			toFarmerList() {
				uni.showToast({
					icon: 'error',
					title: '功能正在开发中'
				})
			},


		}
	}
</script>

<style scoped>
	.district-detail-page {
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

	/* 新增：极简跳转入口样式 - 仅按钮，无多余装饰 */
	.jump-entrance {
		width: 92%;
		margin: 0 auto 20rpx;
		display: flex;
		gap: 15rpx;
	}

	.jump-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #FFF8F0;
		color: #FF7D00;
		border: 1rpx solid #FFE8D0;
		border-radius: 8rpx;
		font-size: 28rpx;
		padding: 0;
	}

	.jump-btn::after {
		border: none;
		/* 去掉uni-app按钮默认边框 */
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

	.card-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 12px;
		margin-bottom: 15px;
	}

	.market-card {
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		padding: 15px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		padding-bottom: 6px;
		border-bottom: 1px solid #f5f5f5;
	}

	.card-title {
		font-size: 15px;
		font-weight: 500;
		color: #2d3748;
	}

	.card-body {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.card-item {
		text-align: center;
	}

	.item-label {
		font-size: 11px;
		color: #718096;
		margin-bottom: 4px;
	}

	.item-value {
		font-size: 14px;
		font-weight: 500;
		color: #2d3748;
	}

	.load-more {
		text-align: center;
		padding: 15px 0;
		font-size: 13px;
		color: #4285F4;
	}

	/* 响应式适配 */
	@media (max-width: 767px) {
		.summary-card {
			flex-direction: column;
			gap: 10px;
		}

		.card-list {
			grid-template-columns: 1fr;
		}
	}
</style>