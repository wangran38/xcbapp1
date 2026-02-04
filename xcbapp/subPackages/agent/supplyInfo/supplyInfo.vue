<template>
	<view class="supply-demand-page">
		<view class="summary-card">
			<view class="summary-bg-icon" :class="activeTab === 'supply' ? 'supply-icon' : 'demand-icon'">
				🛒
			</view>
			<view class="summary-item single-item">
				<view class="summary-label">
					{{ activeTab === 'supply' ? '当前区域供应总数' : '当前区域求购总数' }}
				</view>
				<view class="summary-value">
					{{ activeTab === 'supply' ? supplyList.length : totalDemandCount }} 条
				</view>
				<view class="summary-sub" v-if="activeTab === 'supply'">
					在售 {{ supplyList.length }} 条
				</view>
				<view class="summary-sub" v-if="activeTab === 'demand'">
					待接单 {{ demandList.length }} 条
				</view>
			</view>
		</view>

		<view class="tab-bar">
			<view class="tab-item" :class="{ active: activeTab === 'supply' }" @click="switchTab('supply')">
				<text>供应信息</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'demand' }" @click="switchTab('demand')">
				<text>求购信息</text>
			</view>
		</view>

		<view class="content-container">
			<!-- 供应列表 -->
			<view v-if="activeTab === 'supply'">
				<view class="empty-tip" v-if="!supplyList.length">
					<text class="empty-text">暂无供应信息</text>
					<view class="empty-btn" @click="loadSupplyData">刷新数据</view>
				</view>
				<view class="card-list" v-else>
					<view class="supply-card" v-for="(supply, index) in supplyList" :key="supply.id"
						@click="toDetail('supply', supply)">
						<view class="supply-img" >
							<img style="width: 100%; height: 100%;"  :src="supply.selllogo" alt=""/>
						</view>
						<view class="supply-content">
							<view class="content-header">
								<view class="supply-name">{{ supply.selltitle }}</view>
								<view class="supply-tag">
									在售</view>
							</view>
							<view class="content-body">
								<view class="body-row">
									<view class="row-item">
										<text class="item-label">市场价：</text>
										<text class="item-value price">￥{{ supply.price }}</text>
									</view>
									<view class="row-item">
										<text class="item-label">批发价：</text>
										<text class="item-value price">¥{{ supply.price }}/{{ supply.unit }}</text>
									</view>
								</view>
								<view class="body-row">
									<view class="row-item full">
										<text class="item-label">库存：</text>
										<text class="item-value" :class="{ low: supply.sellnumber < 50 }">
											{{ supply.sellnumber }} {{ supply.unit }}
										</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="load-more" @click="loadMore('supply')" v-if="hasMoreSupply">
					<uni-icons type="spinner" size="14" color="#FF7D00" />
					<text>加载更多供应</text>
				</view> -->
			</view>

			<view v-if="activeTab === 'demand'">
				<view class="empty-tip" v-if="!demandList.length">
					<text class="empty-text">暂无求购信息</text>
					<view class="empty-btn" @click="loadDemandData">刷新数据</view>
				</view>
				<view class="card-list" v-else>
					<view class="demand-card" v-for="(demand, index) in demandList" :key="demand.id"
						@click="toDetail('demand', demand)">
						<view class="demand-img" >
							{{ demand.infotitle }}
						</view>
						<view class="demand-content">
							<view class="content-header">
								<view class="demand-name">{{ demand.infotitle }}</view>
							</view>
							<view class="content-body">
								<view class="body-row">
									<view class="row-item">
										<text class="item-label">地区：</text>
										<text class="item-value">{{ demand.buyaddress }}</text>
									</view>
									<!-- <view class="row-item">
										<text class="item-label">预算：</text>
										<text class="item-value price">¥{{ demand.budget }}/{{ demand.unit }}</text>
									</view> -->
								</view>
								<view class="body-row">
									<view class="row-item full">
										<text class="item-label">需求量：</text>
										<text class="item-value">{{ demand.infonumber }} {{ demand.unit }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {api} from '@/api/index.js'
	export default {
		data() {
			return {
				districtId: '',
				districtName: '',
				cityName: '',
				// Tab 切换控制
				activeTab: 'supply',
				// 供应数据
				supplyList: [],
				totalSupplyCount:0,
				hasMoreSupply: true,
				// 求购数据
				demandList: [],
				totalDemandCount: 10,
				pageNumDemand: 1,
				pageSizeDemand: 5,
				hasMoreDemand: true,
				query:{
					page:1,
					limit:10,
					area_id:null
				}
			}
		},
		onLoad(options) {
			this.query.area_id = Number(JSON.parse(options.data).id)
			// 加载初始数据
			this.loadSupplyData()
			this.loadDemandData()
		},
		methods: {
			// 切换 Tab
			switchTab(tabType) {
				this.activeTab = tabType
				this.query.page = 1
			},
			
			
			
			async loadSupplyData() {
				let data = await api.wholesaleList(this.query)
				// console.log("供应数据",data)
				this.supplyList = [...this.supplyList, ...data.data.listdata]
				this.totalSupplyCount  = data.data.totalnum
				this.hasMoreSupply = data.data.listdata.length < this.query.limit ? true:false
			},
			
			
			async loadDemandData() {
				let data = await api.buyinfoList(this.query)
				// console.log("求购数据",data.data)
				
				// const fakeData = [{
				// 		id: 1,
				// 		product_name: '大米',
				// 		status: 'pending',
				// 		demander_name: '旭源大厦',
				// 		budget: 20.0,
				// 		unit: '斤',
				// 		need_count: 500
				// 	},
				// ]
				this.totalDemandCount = data.data.totalnum
				this.demandList = [...this.demandList,...data.data.listdata]
			},
			// 加载更多
			loadMore(type) {
				if (type === 'supply') {
					this.pageNumSupply++
					this.loadSupplyData()
				} else {
					this.pageNumDemand++
					this.loadDemandData()
				}
			},
			// 跳转详情
			toDetail(type, data) {
				// const title = type === 'supply' ? `查看${data.product_name}供应详情` : `查看${data.product_name}求购详情`
				// uni.showToast({
				// 	title,
				// 	icon: 'none'
				// })
			}
		}
	}
</script>

<style scoped>
	/* 基础布局 */
	.supply-demand-page {
		background-color: #f2f2f2;
		min-height: 100vh;
		font-size: 14px;
		padding-bottom: 40px;
	}

	/* 头部：带筛选按钮 */
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

	.header-filter {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 统计卡片：带装饰和子标题 */
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
		margin-bottom: 5rpx;
	}

	.summary-value {
		font-size: 40rpx;
		font-weight: 700;
		color: #FF7D00;
		margin-bottom: 5rpx;
	}

	.summary-sub {
		font-size: 22rpx;
		color: #999;
	}

	/* Tab 切换栏 */
	.tab-bar {
		display: flex;
		background: #fff;
		margin: 0 15rpx 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 15rpx 0;
		font-size: 28rpx;
		color: #666;
	}

	.tab-item.active {
		background: #FF7D00;
		color: #fff;
	}

	/* 内容容器 */
	.content-container {
		width: 92%;
		margin: 0 auto;
	}

	/* 空数据美化 */
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

	/* 卡片列表 */
	.card-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 15px;
		margin-bottom: 20px;
	}

	/* 供应卡片：左侧图片+内容 */
	.supply-card,
	.demand-card {
		display: flex;
		align-items: center;
		gap: 15px;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
		padding: 15px;
		transition: all 0.2s ease;
	}

	.supply-card:active,
	.demand-card:active {
		transform: scale(0.98);
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
	}

	/* 产品/求购品图片占位 */
	.supply-img,
	.demand-img {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666;
		font-weight: 600;
	}

	.supply-content,
	.demand-content {
		flex: 1;
	}

	.content-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.supply-name,
	.demand-name {
		font-size: 16px;
		font-weight: 600;
		color: #333;
	}

	/* 状态标签 */
	.supply-tag,
	.demand-tag {
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 12px;
	}

	.supply-tag.on {
		background: #ECFDF3;
		color: #00B42A;
	}

	.supply-tag.off {
		background: #F5F5F5;
		color: #999;
	}

	.demand-tag.pending {
		background: #FFF1F0;
		color: #FF7D00;
	}

	.demand-tag.done {
		background: #F5F5F5;
		color: #999;
	}

	.content-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.body-row {
		display: flex;
		gap: 15px;
	}

	.row-item.full {
		flex: 1;
	}

	.item-label {
		font-size: 13px;
		color: #999;
	}

	.item-value {
		font-size: 14px;
		color: #333;
	}

	.item-value.price {
		color: #FF7D00;
		font-weight: 500;
	}

	.item-value.low {
		color: #F53F3F;
	}

	/* 加载更多 */
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

	/* 筛选弹窗 */
	.filter-popup {
		background: #fff;
		border-radius: 16rpx 16rpx 0 0;
		padding: 20rpx;
	}

	.popup-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 20rpx;
	}

	.filter-item {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		margin-bottom: 20rpx;
	}

	.filter-item text {
		font-size: 26rpx;
		color: #333;
	}

	.filter-options {
		display: flex;
		gap: 15rpx;
		flex-wrap: wrap;
	}

	.option {
		padding: 8rpx 20rpx;
		background: #F5F5F5;
		border-radius: 20rpx;
		font-size: 24rpx;
		color: #666;
	}

	.option.active {
		background: #FF7D00;
		color: #fff;
	}

	.popup-btns {
		display: flex;
		gap: 15rpx;
		margin-top: 30rpx;
	}

	.btn {
		flex: 1;
		text-align: center;
		padding: 15rpx 0;
		border-radius: 8rpx;
		font-size: 26rpx;
	}

	.btn.cancel {
		background: #F5F5F5;
		color: #666;
	}

	.btn.confirm {
		background: #FF7D00;
		color: #fff;
	}
</style>