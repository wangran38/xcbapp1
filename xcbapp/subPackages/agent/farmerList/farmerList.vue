<template>
	<view class="farmer-list-page">


		<!-- 统计卡片：加装饰背景 -->
		<view class="summary-card">
			<view class="summary-bg-icon">👨‍🌾</view>
			<view class="summary-item single-item">
				<view class="summary-label">当前区域农户总数</view>
				<view class="summary-value">{{ totalFarmerCount }} 户</view>
			</view>
		</view>


		<!-- 农户列表 -->
		<view class="content-container">
			<view class="empty-tip" v-if="!farmerList.length">
				<view class="empty-icon">👤</view>
				<text class="empty-text">暂无符合条件的农户数据</text>
				<view class="empty-btn" @click="loadFarmerData">重新加载</view>
			</view>

			<view class="card-list" v-else>
				<view class="farmer-card" v-for="(farmer, index) in farmerList" :key="farmer.id"
					@click="toFarmerDetail(farmer)">
					<view class="farmer-avatar">{{ farmer.farmersname.charAt(0) }}</view>
					<view class="farmer-content">
						<view class="content-body">
							<view class="body-item">
								<text style="font-size: 35rpx;font-weight: bold;">{{ farmer.farmersname }}</text>
								<text class="item-icon">📞</text>
								<text class="item-text">{{ farmer.phone }}</text>
							</view>
							<view class="body-item">
								<text class="item-icon"></text>
								<text class="item-text">主营：{{ farmer.category_name }}</text>
							</view>
							<view class="body-item">
								<text class="item-icon"></text>
								<text class="item-text">地址：{{ farmer.address }}</text>
							</view>
						</view>
					</view>
					<uni-icons type="arrowright" size="20" color="#ddd" />
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
				farmerList: [],
				totalFarmerCount: 0,
				hasMore: true,
				filterType: 'all',

				query: {
					page: 1,
					limit: 10,
					area_id: null
				}
			}
		},
		onLoad(options) {
			this.query.area_id = Number(JSON.parse(options.data).id)
			this.loadFarmerData()
		},
		methods: {

			async loadFarmerData() {
				if (!this.hasMore) {
					return
				}
				const fakeData = []

				let data = await api.farmersList(this.query)

				this.farmerList = [...this.farmerList, ...data.data.listdata]
				this.hasMore = this.farmerList.length < this.query.limit ? false : true
				this.totalFarmerCount = data.data.totalnum
			},
			loadMore() {
				this.query.page++
				this.loadFarmerData()
			},
			toFarmerDetail(farmer) {
				uni.showToast({
					title: `查看${farmer.name}详情`,
					icon: 'none'
				})
			}
		}
	}
</script>

<style scoped>
	/* 基础布局 - 柔和背景 */
	.farmer-list-page {
		background-color: #f2f2f2;
		min-height: 100vh;
		font-size: 14px;
		padding-bottom: 40px;
	}

	/* 头部：渐变+右侧标签 */
	.page-header {
		padding: 20px 16px;
		background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D0 100%);
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 2rpx 15rpx rgba(255, 125, 0, 0.1);
	}

	.back-btn {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 15px;
		color: #FF7D00;
	}

	.header-title {
		font-size: 18px;
		font-weight: 600;
		color: #333;
	}

	.header-tag {
		font-size: 12px;
		color: #FF7D00;
		background: #fff;
		padding: 3px 8px;
		border-radius: 10px;
	}

	/* 统计卡片：带装饰图标 */
	.summary-card {
		position: relative;
		background-color: #ffffff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 20rpx rgba(255, 125, 0, 0.08);
		padding: 30rpx 20rpx;
		margin: 20rpx 15rpx;
		border: 1rpx solid #FFE8D0;
		overflow: hidden;
	}

	.summary-bg-icon {
		position: absolute;
		top: 10rpx;
		right: 20rpx;
		font-size: 60rpx;
		color: rgba(255, 125, 0, 0.08);
	}

	.summary-item.single-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10rpx 0;
	}

	.summary-label {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.summary-value {
		font-size: 40rpx;
		font-weight: 700;
		color: #FF7D00;
	}

	/* 筛选栏 */
	.filter-bar {
		display: flex;
		gap: 10rpx;
		padding: 0 15rpx;
		margin-bottom: 20rpx;
		overflow-x: auto;
	}

	.filter-item {
		padding: 8rpx 20rpx;
		background: #fff;
		border-radius: 20rpx;
		font-size: 24rpx;
		color: #666;
		white-space: nowrap;
	}

	.filter-item.active {
		background: #FF7D00;
		color: #fff;
	}

	/* 内容容器 */
	.content-container {
		width: 92%;
		margin: 0 auto;
	}

	/* 空数据：美化 */
	.empty-tip {
		text-align: center;
		padding: 80px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;
	}

	.empty-icon {
		font-size: 80rpx;
		color: #ccc;
	}

	.empty-text {
		font-size: 26rpx;
		color: #999;
	}

	.empty-btn {
		padding: 10rpx 25rpx;
		background: #FFF8F0;
		color: #FF7D00;
		border-radius: 20rpx;
		font-size: 24rpx;
	}

	/* 卡片列表：间距调整 */
	.card-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 15px;
		margin-bottom: 20px;
	}

	/* 农户卡片：左侧头像+内容布局 */
	.farmer-card {
		display: flex;
		align-items: center;
		gap: 15px;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
		padding: 15px;
		transition: all 0.2s ease;
	}

	.farmer-card:active {
		transform: scale(0.98);
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
	}

	/* 头像占位 */
	.farmer-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background: #FFF8F0;
		color: #FF7D00;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
	}

	.farmer-content {
		flex: 1;
	}

	.content-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.farmer-name {
		font-size: 16px;
		font-weight: 600;
		color: #333;
	}

	.farmer-tag {
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 12px;
		color: #666;
	}

	.content-body {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.body-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #666;
	}

	.item-icon {
		font-size: 12px;
	}

	/* 加载更多：带加载图标 */
	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 15px 0;
		font-size: 14px;
		color: #FF7D00;
		font-weight: 500;
	}
</style>