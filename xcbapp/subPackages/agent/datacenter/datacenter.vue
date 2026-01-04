<template>
	<view class="agent-index-page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-title">代理商消费数据中心</view>
			<!-- 代理级别切换（测试用） -->
			<view class="level-switch" @click="switchAgentLevel">
				{{ agentLevel === 'PROVINCIAL' ? '切换为市级' : '切换为省级' }}
			</view>
			<view class="role-tag" :class="agentLevel === 'PROVINCIAL' ? 'provincial' : 'municipal'">
				{{ agentLevel === 'PROVINCIAL' ? '省级代理' : '市级代理' }}
			</view>

			<view class="summary-card">
				<view class="summary-item">
					<view class="summary-label">区县总数</view>
					<view class="summary-value">{{ totalDistrictCount }} 个</view>
				</view>
				<view class="summary-item">
					<view class="summary-label">菜市场总数</view>
					<view class="summary-value">{{ totalMarketCount }} 个</view>
				</view>
				<view class="summary-item">
					<view class="summary-label">消费总额</view>
					<view class="summary-value">¥{{ totalConsume.toLocaleString() }}</view>
				</view>
			</view>
		</view>

		<view class="content-container">
			<view class="empty-tip" v-if="!dataList.length">暂无数据可展示</view>

			<view class="card-list" v-else-if="agentLevel === 'PROVINCIAL'">
				<view class="city-card" v-for="(city, index) in dataList" :key="city.id" @click="toCityDetail(city.children)">
					<view class="card-header">
						<view class="card-title">{{ city.name }}</view>
						<uni-icons type="arrowright" size="16" color="#999" />
					</view>
					<view class="card-body">
						<view class="card-item">
							<view class="item-label">区县数</view>
							<view class="item-value">{{ city.districtCount }} 个</view>
						</view>
						<view class="card-item">
							<view class="item-label">菜市场数</view>
							<view class="item-value">{{ city.marketCount }} 个</view>
						</view>
						<view class="card-item">
							<view class="item-label">消费总额</view>
							<view class="item-value">¥{{ city.totalConsume.toLocaleString() }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 市级代理：区县列表 -->
			<view class="card-list" v-else>
				<view class="district-card" v-for="(district, index) in dataList" :key="district.id"
					@click="toDistrictDetail(district)">
					<view class="card-header">
						<view class="card-title">{{ district.name }}</view>
						<uni-icons type="arrowright" size="16" color="#999" />
					</view>
					<view class="card-body">
						<view class="card-item">
							<view class="item-label">菜市场数</view>
							<view class="item-value">{{ district.marketCount }} 个</view>
						</view>
						<view class="card-item">
							<view class="item-label">消费总额</view>
							<view class="item-value">¥{{ district.totalConsume.toLocaleString() }}</view>
						</view>
						<view class="card-item">
							<view class="item-label">订单数</view>
							<view class="item-value">{{ district.totalOrderCount }} 笔</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view class="load-more" @click="loadMore" v-if="hasMore">
				加载更多 <uni-icons type="down" size="14" />
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
				agentLevel: 'PROVINCIAL', // PROVINCIAL(省级) / MUNICIPAL(市级)
				dataList: [],
				totalConsume: 0,
				totalDistrictCount: 0,
				totalMarketCount: 0,
				pageNum: 1,
				pageSize: 5,
				hasMore: true
			}
		},
		async onLoad() {

			this.loadData()
		},
		methods: {
			// 切换代理级别
			switchAgentLevel() {
				this.agentLevel = this.agentLevel === 'PROVINCIAL' ? 'MUNICIPAL' : 'PROVINCIAL'
				this.pageNum = 1
				this.hasMore = true
				this.loadData()
			},

			// 加载数据
			async loadData() {

				try {
					uni.showLoading({
						title: '加载数据...',
						mask: true
					})
					if (this.agentLevel === 'PROVINCIAL') {
						let data = await api.getprogetsumall()
						console.log(data, 111111)

						let cityList = data['data']['city_list'].map((item, index) => {
							return {
								id: `city_${index}`,
								name: item.name,
								districtCount: 11,
								marketCount: 89,
								totalConsume: 3285008.80,
								children:item.children
							}
						})
						console.log(cityList)
						this.dataList = [...this.dataList,...cityList]

						// console.log(cityList)

						// const cityList = [{
						// 		id: "city_01",
						// 		name: "海口市",
						// 		districtCount: 11,
						// 		marketCount: 89,
						// 		totalConsume: 3285008.80
						// 	},
						// 	{
						// 		id: "city_02",
						// 		name: "三亚市",
						// 		districtCount: 9,
						// 		marketCount: 76,
						// 		totalConsume: 2896007.70
						// 	},
						// 	{
						// 		id: "city_03",
						// 		name: "三沙市",
						// 		districtCount: 5,
						// 		marketCount: 58,
						// 		totalConsume: 2158005.50
						// 	},
						// 	{
						// 		id: "city_04",
						// 		name: "直辖县级",
						// 		districtCount: 32,
						// 		marketCount: 120,
						// 		totalConsume: 1892003.30
						// 	},
						// ]
					} else {
						// 加载市级代理数据

						const districtList = [{
								id: "district_0101",
								name: "秀英区",
								marketCount: 12,
								totalConsume: 896002.80,
								totalOrderCount: 8960
							},
							{
								id: "district_0102",
								name: "龙华区",
								marketCount: 9,
								totalConsume: 752005.50,
								totalOrderCount: 7520
							},
							{
								id: "district_0103",
								name: "琼山区",
								marketCount: 10,
								totalConsume: 689001.10,
								totalOrderCount: 6890
							},
							{
								id: "district_0104",
								name: "美兰区",
								marketCount: 8,
								totalConsume: 587003.30,
								totalOrderCount: 5870
							}
						]
						const paginatedData = districtList.slice((this.pageNum - 1) * this.pageSize, this.pageNum *
							this
							.pageSize)
						mockData = {
							list: paginatedData,
							totalConsume: districtList.reduce((sum, item) => sum + item.totalConsume, 0),
							totalDistrictCount: districtList.length,
							totalMarketCount: districtList.reduce((sum, item) => sum + item.marketCount, 0),
							hasMore: this.pageNum * this.pageSize < districtList.length
						}
					}

					// this.totalConsume = mockData.totalConsume
					// this.totalDistrictCount = mockData.totalDistrictCount
					// this.totalMarketCount = mockData.totalMarketCount
					// this.hasMore = mockData.hasMore

					uni.hideLoading()
				} catch (error) {
					console.error('加载数据失败：', error)
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
			toCityDetail(children) {
				// let children = JSON.stringify(children)
				console.log(children)
				uni.navigateTo({
					url: `/subPackages/agent/cityDetail/cityDetail?children=${children}`
				})
			},

			// 跳转到区县详情页（市级代理）
			toDistrictDetail(district) {
				uni.navigateTo({
					url: `/subPackages/agent/districtDetail/districtDetail?districtId=${district.id}&districtName=${district.name}`
				})
			}
		}
	}
</script>

<style scoped>
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
		color: #4285F4;
		padding: 4px 8px;
		border: 1px solid #4285F4;
		border-radius: 4px;
		cursor: pointer;
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

	.summary-card {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		gap: 10px;
		background-color: #f8f9fa;
		border-radius: 8px;
		padding: 10px;
		margin-bottom: 15px;
	}

	.summary-item {
		text-align: center;
		min-width: 80px;
	}

	.summary-label {
		font-size: 11px;
		color: #718096;
		margin-bottom: 4px;
	}

	.summary-value {
		font-size: 16px;
		font-weight: 600;
		color: #2d3748;
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
		cursor: pointer;
		transition: transform 0.2s;
	}

	.city-card:active,
	.district-card:active {
		transform: scale(0.98);
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
		grid-template-columns: repeat(3, 1fr);
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
		cursor: pointer;
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