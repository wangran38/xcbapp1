<template>
  <view class="agent-consume-page">
    <view class="page-header">
      <view class="header-title">代理商消费数据中心</view>
	  
     <!-- <view class="level-switch" @click="switchAgentLevel">
        切换至{{ agentLevel === 'PROVINCIAL' ? '市级' : '省级' }}代理
      </view>
      <view class="role-tag" :class="agentLevel === 'PROVINCIAL' ? 'provincial' : 'municipal'">
        {{ agentLevel === 'PROVINCIAL' ? '省级代理' : '市级代理' }}
      </view> -->

     <view class="summary-card">
        <view class="summary-item">
          <view class="summary-label">累计消费总额</view>
          <view class="summary-value">¥{{ totalConsume.toLocaleString() }}</view>
        </view>
        <view class="summary-item">
          <view class="summary-label">下辖菜市场数</view>
          <view class="summary-value">{{ marketTotalCount }} 个</view>
        </view>
        <view class="summary-item">
          <view class="summary-label">累计订单数</view>
          <view class="summary-value">{{ totalOrderCount }} 笔</view>
        </view>
      </view>


<!--      <view class="filter-bar" v-if="rootDataList.length">
        <picker mode="date" :start="startDate" :end="endDate" @change="changeDate">
          <view class="filter-text">
            {{ selectedDate }} <uni-icons type="calendar" size="14" />
          </view>
        </picker>
      </view> -->
    </view>

    <view class="data-container">
      <view class="empty-tip" v-if="!rootDataList.length">暂无消费数据可展示</view>

      <view class="card-list" v-else-if="agentLevel === 'PROVINCIAL'">
        <view class="city-card" v-for="(city, index) in rootDataList" :key="city.id" @click="toCityDetail(city)">
          <view class="card-header">
            <view class="card-title">{{ city.name }}</view>
            <uni-icons type="arrowright" size="16" color="#999" />
          </view>
          <view class="card-body">
            <view class="card-item">
              <view class="item-label">菜市场数</view>
              <view class="item-value">{{ city.marketCount }} 个</view>
            </view>
            <view class="card-item">
              <view class="item-label">消费总额</view>
              <view class="item-value">¥{{ city.totalConsume.toLocaleString() }}</view>
            </view>
            <view class="card-item">
              <view class="item-label">订单数</view>
              <view class="item-value">{{ city.totalOrderCount }} 笔</view>
            </view>
          </view>
        </view>

        <view class="load-more" @click="loadMore" v-if="hasMore">
          加载更多 <uni-icons type="down" size="14" />
        </view>
      </view>

      <view class="card-list" v-else>
        <view class="market-card" v-for="(market, index) in rootDataList" :key="market.id" @click="toMarketDetail(market)">
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
            <view class="card-item">
              <view class="item-label">平均客单价</view>
              <view class="item-value">¥{{ (market.totalConsume / market.orderCount).toFixed(2) }}</view>
            </view>
          </view>
        </view>

        <view class="load-more" @click="loadMore" v-if="hasMore">
          加载更多 <uni-icons type="down" size="14" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {} from '@/api/index.js'
export default {
  data() {
    return {
      // 代理级别
      agentLevel: 'PROVINCIAL',
      // 全局汇总数据
      totalConsume: 0,
      marketTotalCount: 0,
      totalOrderCount: 0,
      // 根层级数据列表
      rootDataList: [],
      // 分页相关
      pageNum: 1,
      pageSize: 5,
      hasMore: true,
      // 时间筛选
      startDate: '2024-01-01',
      endDate: new Date().toISOString().split('T')[0],
      selectedDate: '全部时间'
    }
  },
  onLoad() {
    this.loadConsumeData()
  },
  methods: {
    // 切换代理级别
    switchAgentLevel() {
      this.agentLevel = this.agentLevel === 'PROVINCIAL' ? 'MUNICIPAL' : 'PROVINCIAL'
      // 重置分页
      this.pageNum = 1
      this.hasMore = true
      this.loadConsumeData()
    },

    // 加载模拟数据（分页加载，适配大数据）
    loadConsumeData() {
      try {
        uni.showLoading({ title: '加载数据...', mask: true })
        
        let mockData = {}
        // 模拟省级代理大数据（10个市县，每个市县多个菜市场）
        if (this.agentLevel === 'PROVINCIAL') {
          const cityList = [
            { id: "city_01", name: "海口市", marketCount: 8, totalConsume: 100, totalOrderCount: 3280 },
            { id: "city_02", name: "三亚市", marketCount: 6, totalConsume: 200, totalOrderCount: 2890 },
            { id: "city_03", name: "三沙市", marketCount: 5, totalConsume: 300, totalOrderCount: 2150 }
          ]
          // 分页截取数据
          const paginatedData = cityList.slice((this.pageNum-1)*this.pageSize, this.pageNum*this.pageSize)
          // 计算全局汇总
          const totalConsume = cityList.reduce((sum, item) => sum + item.totalConsume, 0)
          const marketTotalCount = cityList.reduce((sum, item) => sum + item.marketCount, 0)
          const totalOrderCount = cityList.reduce((sum, item) => sum + item.totalOrderCount, 0)

          mockData = {
            totalConsume,
            marketTotalCount,
            totalOrderCount,
            dataList: paginatedData,
            hasMore: this.pageNum*this.pageSize < cityList.length
          }
        } 
        // 模拟市级代理大数据（20个菜市场）
        else {
          const marketList = []
          // 生成20个菜市场模拟数据
          for (let i = 1; i <= 20; i++) {
            const consume = 50000 + Math.floor(Math.random() * 50000) + Math.random()
            const orderCount = Math.floor(consume / 100)
            marketList.push({
              id: `market_01${i.toString().padStart(2, '0')}`,
              name: `广州市${['天河区', '越秀区', '海珠区', '荔湾区', '白云区'][Math.floor(i%5)]}${i}号菜市场`,
              totalConsume: consume,
              orderCount: orderCount
            })
          }
          // 分页截取
          const paginatedData = marketList.slice((this.pageNum-1)*this.pageSize, this.pageNum*this.pageSize)
          // 全局汇总
          const totalConsume = marketList.reduce((sum, item) => sum + item.totalConsume, 0)
          const marketTotalCount = marketList.length
          const totalOrderCount = marketList.reduce((sum, item) => sum + item.orderCount, 0)

          mockData = {
            totalConsume,
            marketTotalCount,
            totalOrderCount,
            dataList: paginatedData,
            hasMore: this.pageNum*this.pageSize < marketList.length
          }
        }

        // 赋值
        this.totalConsume = mockData.totalConsume
        this.marketTotalCount = mockData.marketTotalCount
        this.totalOrderCount = mockData.totalOrderCount
        this.hasMore = mockData.hasMore
        // 分页加载：第一页直接赋值，后续页追加
        if (this.pageNum === 1) {
          this.rootDataList = mockData.dataList
        } else {
          this.rootDataList = [...this.rootDataList, ...mockData.dataList]
        }

        uni.hideLoading()
      } catch (error) {
        console.error('加载数据失败：', error)
        uni.showToast({ title: '数据加载失败', icon: 'none' })
      }
    },

    // 加载更多（分页）
    loadMore() {
      this.pageNum++
      this.loadConsumeData()
    },

    // 时间筛选（模拟）
    changeDate(e) {
      this.selectedDate = e.detail.value
      // 重置分页
      this.pageNum = 1
      this.hasMore = true
      // 模拟筛选后重新加载数据
      this.loadConsumeData()
    },

    // 省级：跳转到市县详情页（菜市场列表）
    toCityDetail(city) {
      uni.navigateTo({
        url: `/subPackages/agent/marketDetail/marketDetail?cityId=${city.id}&cityName=${city.name}`
      })
    },

    // 市级：跳转到菜市场详情页（消费明细）
    toMarketDetail(market) {
      uni.navigateTo({
        url: `/subPackages/agent/marketDetail/marketDetail?marketId=${market.id}&marketName=${market.name}`
      })
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.agent-consume-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-size: 14px;
  padding-bottom: 40px;
}

/* 头部 */
.page-header {
  padding: 20px 16px;
  text-align: center;
  position: relative;
}

.header-title {
  font-size: 22px;
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

/* 汇总卡片 */
.summary-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  margin: 0 auto 15px;
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-around;
  /* flex-wrap: wrap; */
  /* gap: 10px; */
}

.summary-item {
  text-align: center;
  min-width: 80px;
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

/* 筛选栏 */
.filter-bar {
  margin: 0 auto 15px;
  width: 90%;
}

.filter-text {
  background-color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #4285F4;
  display: inline-block;
}

/* 数据容器 */
.data-container {
  width: 92%;
  margin: 0 auto;
}

.empty-tip {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

/* 卡片列表 */
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

/* 市县/菜市场卡片通用 */
.city-card, .market-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s;
}

.city-card:active, .market-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.card-title {
  font-size: 16px;
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

/* 加载更多 */
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