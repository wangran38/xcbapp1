<template>
	<view class="agent-index-page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-title">代理商消费数据中心</view>
			<!-- 代理级别切换（测试用） -->
			<!-- 	<view class="level-switch" @click="switchAgentLevel">
				{{ agentLevel === 'PROVINCIAL' ? '切换为市级' : '切换为省级' }}
			</view> -->
			<view class="role-tag" :class="agentLevel === 'PROVINCIAL' ? 'provincial' : 'municipal'">
				{{ agentLevel === 'PROVINCIAL' ? '省级代理' : '市县区级代理' }}
			</view>

			<view class="summary-card">
				<!-- 收益总额单独突出展示区 -->
				<view class="summary-highlight">
					<view class="highlight-label">
						<text class="iconfont icon-money"></text>
						收益总额
					</view>
					<view class="highlight-value">¥{{ countData.money_total.toFixed(2) }}</view>
				</view>

				<view class="summary-grid">
					<view class="summary-item">
						<view class="summary-label">
							<text class="iconfont icon-order"></text>
							订单总数
						</view>
						<view class="summary-value">{{countData.order_total }} 个</view>
					</view>
					<view class="summary-item">
						<view class="summary-label">
							<text class="iconfont icon-market"></text>
							拥有菜市场
						</view>
						<view class="summary-value">{{ countData.market_total }} 个</view>
					</view>
					<view class="summary-item">
						<view class="summary-label">
							<text class="iconfont icon-farmer"></text>
							拥有农户
						</view>
						<view class="summary-value">{{ countData.farmers_total }} 个</view>
					</view>
					<view class="summary-item">
						<view class="summary-label">
							<text class="iconfont icon-stall"></text>
							拥有摊主
						</view>
						<view class="summary-value">{{ countData.shop_total }} 个</view>
					</view>
					<view class="summary-item">
						<view class="summary-label">
							<text class="iconfont icon-wholesaler"></text>
							采购信息
						</view>
						<view class="summary-value">{{ 0 }} 个</view>
					</view>
					<view class="summary-item">
						<view class="summary-label">
							<text class="iconfont icon-wholesaler"></text>
							供求信息
						</view>
						<view class="summary-value">{{ 0 }} 个</view>
					</view>
				</view>


			</view>
		</view>

		<view class="content-container">
			<view class="empty-tip" v-if="!dataList.length">暂无数据可展示</view>

			<view class="card-list" v-else-if="agentLevel === 'PROVINCIAL'">
				<view class="city-card" v-for="city in dataList" :key="city.id">
					<!-- @click="toCityDetail(city.children)" -->
					<view class="card-header">
						<view class="card-title">{{ city.name }}</view>
						<!-- <uni-icons type="arrowright" size="16" color="#999" /> -->
					</view>
					<view class="card-body">

						<view v-for="(item, index) in city.children" :key="index" class="district-item"
							@click="toDistrictDetail(item)">
							<view class="district-info">
								<view class="district-name">{{ item.name }}</view>
								<view class="district-extra">
									菜市场：{{ item.market_count }}个
								</view>
								<view class="district-extra">
									农户：{{ item.farmers_count }}个
								</view>
								<view class="district-extra">
									摊主：{{ item.shop_count }}个
								</view>
							</view>

							<!-- 箭头图标 -->
							<uni-icons type="arrowright" size="18" color="#999" />
						</view>

					</view>
				</view>
			</view>


			<!-- 	<view class="load-more" @click="loadMore" v-if="hasMore">
				加载更多 <uni-icons type="down" size="14" />
			</view> -->
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
				agentLevel: 'PROVINCIAL', // PROVINCIAL(省级) / MUNICIPAL(市级)
				dataList: [],
				countData: {
					farmers_total: 0,
					market_total: 0,
					money_total: 0,
					order_total: 0,
					shop_total: 0
				},
				pageNum: 1,
				pageSize: 5,
				hasMore: true,
				city: null,
			}
		},
		async onLoad() {
			this.checkUserInfo()
			this.loadData()
		},
		methods: {
			// 跳转到区县详情页
			toDistrictDetail(district) {
				let data = JSON.stringify(district)
				uni.navigateTo({
					url: `/subPackages/agent/districtDetail/districtDetail?data=${data}`
				})
			},
			async checkUserInfo() {
				let data = await api.viewAgentInfo()
				if (data.code == 200) {
					if (data.data.listdata[0].type == 1) {
						this.agentLevel = 'PROVINCIAL'
					} else {
						this.agentLevel = 'MUNICIPAL'
					}
				}
			},

			// 切换代理级别
			switchAgentLevel() {
				this.agentLevel = this.agentLevel === 'PROVINCIAL' ? 'MUNICIPAL' : 'PROVINCIAL'
				this.pageNum = 1
				this.hasMore = true
				this.loadData()
			},

			// 加载数据
			async loadData() {
				let data = await api.getprogetsumall()
				try {
					uni.showLoading({
						title: '加载数据...',
						mask: true
					})
					if (this.agentLevel === 'PROVINCIAL') {
						let cityList = data['data']['city_list'].map((item, index) => {
							return {
								id: `city_${index}`,
								name: item.name,
								districtCount: 0,
								marketCount: 0,
								totalConsume: 0,
								children: item.children
							}
						})
						// countData: {
						// 	farmers_total: 0,
						// 	market_total: 0,
						// 	money_total: 0,
						// 	order_total: 0,
						// 	shop_total: 0
						// },
						this.countData.farmers_total = data.data.farmers_total
						this.countData.market_total = data.data.market_total
						this.countData.money_total = data.data.money_total
						this.countData.order_total = data.data.order_total
						this.countData.shop_total = data.data.shop_total
						this.dataList = cityList

					} else {
				
						this.dataList = districtList
					}
					this.totalConsume = data.data.money_total
					this.orderCount = data.data.order_total
					this.totalMarketCount = data.data.market_total
					uni.hideLoading()
				} catch (error) {
					uni.showToast({
						title: '数据加载失败',
						icon: 'none'
					})
				}
			},

			// 加载更多
			loadMore() {
				this.pageNum++
				this.loadData()
			},

			// 跳转到市详情页（省级代理）
			toCityDetail(city) {
				let children = JSON.stringify(city)
				uni.navigateTo({
					url: `/subPackages/agent/cityDetail/cityDetail?children=${children}`
				})
			},


		}
	}
</script>

<style scoped>
	/* 城市标题栏：区分层级 */
	.city-title {
		padding: 24rpx 30rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		border-bottom: 1rpx solid #f5f5f5;
	}

	/* 区县列表项：优化间距和交互 */
	.district-item {
		padding: 28rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f8f8f8;
		transition: background-color 0.2s;
	}

	/* 最后一项去掉下边框 */
	.district-item:last-child {
		border-bottom: none;
	}

	/* 点击态：增加交互反馈 */
	.district-item:active {
		background-color: #fafafa;
	}

	/* 区县信息区域：支持扩展其他数据 */
	.district-info {
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}

	/* 区县名称：主信息突出 */
	.district-name {
		font-size: 35rpx;
		color: #333;
	}

	.district-extra {
		font-size: 30rpx;
		color: #999;
	}

	.agent-index-page {
		background-color: #f8f9fa;
		min-height: 100vh;
		font-size: 14px;
		padding-bottom: 40px;
	}

	.page-header {
		padding: 20px 16px;
		background-color: #fff;
		border-bottom: 1px solid #f5f5f5;
	}

	.header-title {
		font-size: 20px;
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 10px;
	}

	.level-switch {
		position: absolute;
		top: 20px;
		right: 20px;
		font-size: 12px;
		color: #FF9500;
		padding: 4px 8px;
		border: 1px solid #4285F4;
		border-radius: 4px;
	}

	.role-tag {
		display: inline-block;
		padding: 4px 16px;
		border-radius: 20px;
		font-size: 12px;
		margin-bottom: 15px;
	}

	.provincial {
		background-color: #e8f4fd;
		color: #4285F4;
	}

	.municipal {
		background-color: #e6f4ea;
		color: #34A853;
	}

	/* 清除页面默认留白，保证卡片全屏 */
	page {
		padding: 0;
		margin: 0;
		background-color: #fafafa;
	}

	/* 核心卡片容器 */
	.summary-card {
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 20rpx rgba(255, 125, 0, 0.08);
		padding: 30rpx 20rpx;
		margin: 20rpx 0 0;
		width: 100%;
		box-sizing: border-box;
		border: 1rpx solid #FFE8D0;
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
		padding-top: 15px;
	}

	.empty-tip {
		text-align: center;
		padding: 60px 0;
		color: #999;
		font-size: 14px;
	}

	.card-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 12px;
		margin-bottom: 15px;
	}

	.city-card,
	.district-card {
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		padding: 15px;
		transition: transform 0.2s;
	}

	/* 
	.city-card:active,
	.district-card:active {
		transform: scale(0.98);
	} */

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		padding-bottom: 6px;
		border-bottom: 1px solid #f5f5f5;
	}

	.card-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #2d3748;
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
		}

		.card-body {
			grid-template-columns: 1fr 1fr;
		}

		.card-list {
			grid-template-columns: 1fr;
		}
	}
</style>