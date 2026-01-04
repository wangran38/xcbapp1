<template>
  <view class="district-detail-page">
    <!-- 页面头部 -->
<!--    <view class="page-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="left" size="18" /> 返回
      </view>
      <view class="header-title">{{ districtName }} - 菜市场列表</view>
    </view> -->

    <!-- 汇总数据 -->
    <view class="summary-card">
      <view class="summary-item">
        <view class="summary-label">菜市场总数</view>
        <view class="summary-value">{{ totalMarketCount }} 个</view>
      </view>
      <view class="summary-item">
        <view class="summary-label">消费总额</view>
        <view class="summary-value">¥{{ '999999'.toLocaleString() }}</view>
      </view>
      <view class="summary-item">
        <view class="summary-label">订单总数</view>
        <view class="summary-value">{{ totalOrderCount }} 笔</view>
      </view>
    </view>

    <!-- 筛选栏 -->
    <!-- <view class="filter-bar">
      <picker mode="date" :start="startDate" :end="endDate" @change="changeDate">
        <view class="filter-text">
          {{ selectedDate }} <uni-icons type="calendar" size="14" />
        </view>
      </picker>
    </view> -->

    <!-- 菜市场列表 -->
    <view class="content-container">
      <view class="empty-tip" v-if="!marketList.length">暂无菜市场数据</view>

      <view class="card-list" v-else>
        <view class="market-card" v-for="(market, index) in marketList" :key="market.id" @click="toMarketDetail(market)">
          <view class="card-header">
            <view class="card-title">{{ market.name }}</view>
            <uni-icons type="arrowright" size="16" color="#999" />
          </view>
          <view class="card-body">
            <view class="card-item">
              <view class="item-label">消费总额</view>
              <view class="item-value">¥{{ market.totalConsume.toLocaleString() }}</view>
            </view>
            <view class="card-item">
              <view class="item-label">订单数</view>
              <view class="item-value">{{ market.orderCount }} 笔</view>
            </view>
          </view>
        </view>
      </view>

      <view class="load-more" @click="loadMore" v-if="hasMore">
        加载更多 <uni-icons type="down" size="14" />
      </view>
    </view>
  </view>
</template>

<script>
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
      selectedDate: '全部时间'
    }
  },
  onLoad(options) {
    this.districtId = options.districtId
    this.districtName = options.districtName
    this.cityName = options.cityName || ''
    this.loadMarketData()
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
      this.loadMarketData()
    },

    // 加载菜市场数据
    loadMarketData() {
      try {
        uni.showLoading({ title: '加载中...', mask: true })
        
        // 模拟各区县的菜市场数据
        const marketMap = {
          district_0101: [ // 天河区
            { id: "market_010101", name: "1号菜市场", totalConsume: 189600.20, orderCount: 1890 },
            { id: "market_010102", name: "2号菜市场", totalConsume: 158700.50, orderCount: 1580 },
            { id: "market_010103", name: "3号菜市场", totalConsume: 129800.10, orderCount: 1290 }
          ],
          district_0102: [ // 越秀区
            { id: "market_010201", name: "1号菜市场", totalConsume: 168700.50, orderCount: 1680 },
            { id: "market_010202", name: "2号菜市场", totalConsume: 156800.20, orderCount: 1560 }
          ]
        }

        const allMarkets = marketMap[this.districtId] || marketMap.district_0101
        const paginatedData = allMarkets.slice((this.pageNum-1)*this.pageSize, this.pageNum*this.pageSize)
        
        this.marketList = this.pageNum === 1 ? paginatedData : [...this.marketList, ...paginatedData]
        this.totalMarketCount = allMarkets.length
        this.totalConsume = allMarkets.reduce((sum, item) => sum + item.totalConsume, 0)
        this.totalOrderCount = allMarkets.reduce((sum, item) => sum + item.orderCount, 0)
        this.hasMore = this.pageNum*this.pageSize < allMarkets.length

        uni.hideLoading()
      } catch (error) {
        console.error('加载菜市场数据失败：', error)
        uni.showToast({ title: '数据加载失败', icon: 'none' })
      }
    },

    // 加载更多
    loadMore() {
      this.pageNum++
      this.loadMarketData()
    },

    // 跳转到菜市场详情页
    toMarketDetail(market) {
      uni.navigateTo({
        url: `/subPackages/agent/marketDetail/marketDetail?marketId=${market.id}&marketName=${market.name}&districtName=${this.districtName}&cityName=${this.cityName}`
      })
    }
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