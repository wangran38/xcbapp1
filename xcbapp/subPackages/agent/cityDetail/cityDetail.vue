<template>
	<view class="city-detail-page">

		
		<view class="summary-card">
		  <view class="summary-item">
		    <view class="summary-label">
		      <text class="iconfont icon-district"></text>
		      订单总数
		    </view>
		    <view class="summary-value">{{0 }} 个</view>
		  </view>
		  <view class="summary-item">
		    <view class="summary-label">
		      <text class="iconfont icon-market"></text>
		      菜市场总数
		    </view>
		    <view class="summary-value">{{ totalMarketCount }} 个</view>
		  </view>
		  <view class="summary-item">
		    <view class="summary-label">
		      <text class="iconfont icon-money"></text>
		      收益总额
		    </view>
		    <view class="summary-value">¥{{ totalConsume.toFixed(1) }}</view>
		  </view>
		</view>



		<!-- 区县列表 -->
		<view class="content-container">
			<view class="empty-tip" v-if="!districtList.length">暂无区县数据</view>

			<view class="card-list" v-else>
				<view class="district-card" v-for="(district, index) in districtList" :key="district.id"
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
							<view class="item-label">收益总额</view>
							<view class="item-value">¥{{ district.totalConsume.toLocaleString() }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- <view class="load-more" @click="loadMore" v-if="hasMore">
				加载更多 <uni-icons type="down" size="14" />
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cityId: '',
				cityName: '',
				districtList: [],
				totalDistrictCount: 0,
				totalMarketCount: 0,
				totalConsume: 0,
				pageNum: 1,
				pageSize: 5,
				hasMore: true
			}
		},
		onLoad(options) {
			// this.cityId = options.cityId
			// this.cityName = options.cityName
			// console.log()
			this.districtList = JSON.parse(options.children).map(item=>{
				return {
					id: item.pid,
					name: item.name,
					marketCount: 0,
					totalConsume: 0
				}
			})
			// this.loadDistrictData()
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},

			// 加载区县数据
			loadDistrictData() {
				try {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})

					// 模拟不同市的区县数据
					const districtMap = {
						city_01: [ // 广州市
							{
								id: "district_0101",
								name: "秀英区",
								marketCount: 12,
								totalConsume: 896002.80
							},
							{
								id: "district_0102",
								name: "龙华区",
								marketCount: 9,
								totalConsume: 752005.50
							},
							{
								id: "district_0103",
								name: "琼山区",
								marketCount: 10,
								totalConsume: 689001.10
							},
							{
								id: "district_0104",
								name: "美兰区",
								marketCount: 8,
								totalConsume: 587003.30
							},
						],
						city_02: [ // 深圳市
							{
								id: "district_0201",
								name: "海棠区",
								marketCount: 10,
								totalConsume: 958003.30
							},
							{
								id: "district_0202",
								name: "吉阳区",
								marketCount: 8,
								totalConsume: 887005.50
							},
							{
								id: "district_0203",
								name: "天涯区",
								marketCount: 9,
								totalConsume: 789008.80
							}, {
								id: "district_0203",
								name: "崖州区",
								marketCount: 9,
								totalConsume: 789008.80
							}
						],
						city_03: [ // 深圳市
							{
								id: "district_0201",
								name: "西沙群岛",
								marketCount: 10,
								totalConsume: 958003.30
							},
							{
								id: "district_0202",
								name: "南沙群岛",
								marketCount: 8,
								totalConsume: 887005.50
							},
							{
								id: "district_0203",
								name: "中沙群岛",
								marketCount: 9,
								totalConsume: 789008.80
							}
						],
						city_04: [ // 深圳市
							{
								id: "district_0201",
								name: "五指山市",
								marketCount: 10,
								totalConsume: 958003.30
							},
							{
								id: "district_0202",
								name: "琼海市",
								marketCount: 8,
								totalConsume: 887005.50
							},
							{
								id: "district_0203",
								name: "儋州市",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "文昌市",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "万宁市",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "东方市",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "定安县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "屯昌县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "澄迈县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "临高县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "白沙县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "昌江县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "乐东县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "陵水县",
								marketCount: 9,
								totalConsume: 789008.80
							},
							{
								id: "district_0203",
								name: "保亭县",
								marketCount: 9,
								totalConsume: 789008.80
							},
						]
					}

					const allDistricts = districtMap[this.cityId] || districtMap.city_01
					const paginatedData = allDistricts.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this
						.pageSize)

					this.districtList = this.pageNum === 1 ? paginatedData : [...this.districtList, ...paginatedData]
					this.totalDistrictCount = allDistricts.length
					this.totalMarketCount = allDistricts.reduce((sum, item) => sum + item.marketCount, 0)
					this.totalConsume = allDistricts.reduce((sum, item) => sum + item.totalConsume, 0)
					this.hasMore = this.pageNum * this.pageSize < allDistricts.length

					uni.hideLoading()
				} catch (error) {
					console.error('加载区县数据失败：', error)
					uni.showToast({
						title: '数据加载失败',
						icon: 'none'
					})
				}
			},

			// 加载更多
			loadMore() {
				this.pageNum++
				this.loadDistrictData()
			},

			// 跳转到区县详情页
			toDistrictDetail(district) {
				uni.navigateTo({
					url: `/subPackages/agent/districtDetail/districtDetail?districtId=${district.id}&districtName=${district.name}&cityName=${this.cityName}`
				})
			}
		}
	}
</script>

<style scoped>
	.city-detail-page {
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

	/* 核心卡片容器 - 渐变背景+强立体感 */
	.summary-card {
	  display: flex;
	  flex-direction: column;
	  /* 橙色调渐变背景，瞬间抓住注意力 */
	  background: linear-gradient(135deg, #FFF8F0 0%, #FFFAF5 100%);
	  /* 圆角优化，更圆润有质感 */
	  border-radius: 12rpx;
	  /* 增强阴影，提升立体感 */
	  box-shadow: 0 4rpx 20rpx rgba(255, 125, 0, 0.12);
	  /* 适度增加上下内边距，提升呼吸感 */
	  padding: 25rpx 0;
	  margin: 0 auto;
	  margin-bottom: 10rpx;
	  width: 90%;
	  box-sizing: border-box;
	  /* 边框点缀，强化卡片轮廓 */
	  border: 1rpx solid #FFE8D0;
	}
	
	/* 单个数据项 - 优化间距和分隔 */
	.summary-item {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  /* 增加项内左右内边距，避免内容拥挤 */
	  padding: 20rpx 25rpx;
	  position: relative;
	}
	
	/* 分隔线 - 渐变细线条，更精致 */
	.summary-item:not(:last-child)::after {
	  content: '';
	  position: absolute;
	  left: 25rpx;
	  bottom: 0;
	  width: calc(100% - 50rpx);
	  height: 1rpx;
	  background: linear-gradient(90deg, transparent 0%, #FFE0C0 50%, transparent 100%);
	}
	
	/* 数据标签 - 强化视觉，加小图标点缀 */
	.summary-label {
	  display: flex;
	  align-items: center;
	  font-size: 30rpx;
	  color: #555555;
	  font-weight: 600;
	  /* 标签文字间距，提升可读性 */
	  letter-spacing: 0.8rpx;
	}
	
	/* 标签前的小图标（可选，增强辨识度） */
	.summary-label .iconfont {
	  color: #FF7D00;
	  font-size: 28rpx;
	  margin-right: 12rpx;
	}
	
	/* 数据数值 - 极致醒目，视觉焦点 */
	.summary-value {
	  font-size: 42rpx; /* 大幅放大数值 */
	  font-weight: 800; /* 超粗体，强化冲击感 */
	  color: #FF7D00; /* 主色加深，更醒目 */
	  text-align: right;
	  white-space: nowrap;
	  /* 数值轻微发光效果，提升焦点 */
	  text-shadow: 0 0 8rpx rgba(255, 125, 0, 0.15);
	  /* 数值位置微调，更贴合视觉中心 */
	  transform: translateY(1rpx);
	}
	
	/* 可选：消费总额数值加特殊样式，突出核心数据 */
	.summary-item:last-child .summary-value {
	  color: #E86800; /* 更深的橙色，突出核心数据 */
	  font-size: 44rpx;
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

	.district-card {
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		padding: 15px;
		cursor: pointer;
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
		cursor: pointer;
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