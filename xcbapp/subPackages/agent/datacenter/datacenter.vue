<template>
  <view class="agent-data-page">
    <!-- 页面标题区域 -->
    <view class="page-header">
      <view class="header-title">代理商数据中心</view>
      <view class="header-subtitle">实时查看您的业务数据概况</view>
    </view>

    <!-- 数据容器 -->
    <view class="data-container">
      <!-- 核心数据卡片 -->
      <view class="data-card">
        <view class="section-header">
          <view class="section-icon">
            <uni-icons type="chart" size="20" color="#4285F4" />
          </view>
          <view class="section-name">核心业务数据</view>
        </view>

        <view class="data-grid">
          <view class="data-item">
            <view class="data-label">累计销售额</view>
            <view class="data-value">¥{{ coreData.totalSales.toLocaleString() }}</view>
            <view class="data-desc">本月：¥{{ coreData.monthSales.toLocaleString() }}</view>
          </view>
          <view class="data-item">
            <view class="data-label">累计订单数</view>
            <view class="data-value">{{ coreData.totalOrders.toLocaleString() }}</view>
            <view class="data-desc">本月：{{ coreData.monthOrders.toLocaleString() }}</view>
          </view>
          <view class="data-item">
            <view class="data-label">服务客户数</view>
            <view class="data-value">{{ coreData.totalCustomers.toLocaleString() }}</view>
            <view class="data-desc">新增：{{ coreData.newCustomers.toLocaleString() }}</view>
          </view>
          <view class="data-item">
            <view class="data-label">累计收益</view>
            <view class="data-value">¥{{ coreData.totalProfit.toLocaleString() }}</view>
            <view class="data-desc">本月：¥{{ coreData.monthProfit.toLocaleString() }}</view>
          </view>
        </view>
      </view>

      <!-- 业绩达成卡片 -->
      <view class="data-card">
<!--        <view class="section-header">
          <view class="section-icon">
            <uni-icons type="star" size="20" color="#FBBC05" />
          </view>
          <view class="section-name">本月业绩目标</view>
        </view> -->

        <view class="target-progress">
          <view class="target-info">
            <view class="target-label">业绩达成率</view>
            <view class="target-value">{{ coreData.targetRate }}%</view>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: coreData.targetRate + '%' }"></view>
          </view>
          <view class="target-detail">
            <view class="detail-item">目标：¥{{ coreData.targetAmount.toLocaleString() }}</view>
            <view class="detail-item">已完成：¥{{ coreData.completedAmount.toLocaleString() }}</view>
          </view>
        </view>
      </view>

      <!-- 近期订单卡片 -->
      <view class="data-card">
        <view class="section-header">
          <view class="section-icon">
            <uni-icons type="orders-o" size="20" color="#34A853" />
          </view>
          <view class="section-name">近期订单明细</view>
        </view>

        <view class="order-list">
          <view class="order-item" v-for="order in recentOrders" :key="order.id">
            <view class="order-left">
              <view class="order-no">订单号：{{ order.orderNo }}</view>
              <view class="order-date">{{ formatDate(order.createTime) }}</view>
            </view>
            <view class="order-right">
              <view class="order-amount">¥{{ order.amount.toFixed(2) }}</view>
              <view class="order-status" :class="'status-' + order.status">
                {{ getStatusText(order.status) }}
              </view>
            </view>
          </view>
          <view class="view-all" @click="viewAllOrders">查看全部订单 →</view>
        </view>
      </view>

      <!-- 数据统计卡片 -->
      <view class="data-card">
        <view class="section-header">
          <view class="section-icon">
            <uni-icons type="calendar" size="20" color="#EA4335" />
          </view>
          <view class="section-name">数据统计趋势</view>
        </view>

        <view class="trend-filter">
          <picker mode="selector" :range="trendRange" :value="selectedTrendRange" @change="changeTrendRange">
            <view class="filter-text">{{ trendRange[selectedTrendRange] }}</view>
            <uni-icons type="down" size="14" class="filter-icon" />
          </picker>
        </view>

        <view class="trend-chart">
        </view>
      </view>
    </view>
</view>
  </template>

<script>
import { api } from '@/api/index.js'

// import { formatDate } from '@/utils/date.js'

export default {

  data() {
    return {
      // 核心数据
      coreData: {
        totalSales: 0,
        monthSales: 0,
        totalOrders: 0,
        monthOrders: 0,
        totalCustomers: 0,
        newCustomers: 0,
        totalProfit: 0,
        monthProfit: 0,
        targetRate: 0,
        targetAmount: 0,
        completedAmount: 0
      },
      // 近期订单
      recentOrders: [],
      // 趋势筛选
      trendRange: ['近7天', '近30天', '近90天'],
      selectedTrendRange: 1,
      // 图表数据
      trendData: {},
      // 图表配置
      chartOpts: {
        color: ['#4285F4'],
        padding: [15, 15, 0, 15],
        legend: { show: false },
        xAxis: {
          type: 'grid',
          gridType: 'dash',
          dashLength: 2,
          axisLine: false,
          labelCount: 5,
          fontSize: 11,
          color: '#999'
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2,
          axisLine: false,
          labelCount: 4,
          fontSize: 11,
          color: '#999'
        },
        extra: {
          line: { width: 2, type: 'curve' }
        }
      }
    }
  },

  onLoad() {
    this.loadData()
  },

  methods: {
    // 加载数据
    async loadData() {
      try {
        uni.showLoading({ title: '加载中...', mask: true })
        
        // 并行请求数据
        const [coreRes, orderRes, trendRes] = await Promise.all([
          api.getAgentCoreData(),
          api.getRecentOrders({ limit: 5 }),
          api.getSalesTrend({ range: this.trendRange[this.selectedTrendRange] })
        ])

        // 处理核心数据
        if (coreRes.code === 200) {
          this.coreData = coreRes.data
        }

        // 处理订单数据
        if (orderRes.code === 200) {
          this.recentOrders = orderRes.data
        }

        // 处理趋势数据
        if (trendRes.code === 200) {
          this.trendData = trendRes.data
        }
      } catch (error) {
        console.error('数据加载失败:', error)
        uni.showToast({ title: '数据加载失败', icon: 'none', duration: 2000 })
      } finally {
        uni.hideLoading()
      }
    },

    // 切换趋势时间范围
    changeTrendRange(e) {
      this.selectedTrendRange = e.detail.value
      this.loadData()
    },

    // 格式化日期
    formatDate(dateStr) {
      return formatDate(dateStr, 'YYYY-MM-DD HH:mm')
    },

    // 订单状态文本
    getStatusText(status) {
      const statusMap = {
        'PENDING': '待支付',
        'PAID': '已支付',
        'SHIPPED': '已发货',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
      }
      return statusMap[status] || status
    },

    // 查看全部订单
    viewAllOrders() {
      uni.navigateTo({ url: '/pages/agent/all-orders' })
    }
  }
}
</script>

<style scoped>
/* 页面基础样式 */
.agent-data-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-size: 14px;
  padding-bottom: 30px;
}

/* 页面标题 */
.page-header {
  text-align: center;
  padding: 30px 20px 20px;
}

.header-title {
  font-size: 22px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.header-subtitle {
  font-size: 13px;
  color: #718096;
}

/* 数据容器 */
.data-container {
  width: 92%;
  margin: 0 auto;
}

/* 数据卡片样式（复用申请表卡片风格） */
.data-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px 18px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

/* section头部（复用申请表风格） */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.section-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: rgba(66, 133, 244, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.data-card:nth-child(2) .section-icon {
  background-color: rgba(251, 188, 5, 0.1);
}

.data-card:nth-child(3) .section-icon {
  background-color: rgba(52, 168, 83, 0.1);
}

.data-card:nth-child(4) .section-icon {
  background-color: rgba(234, 67, 53, 0.1);
}

.section-name {
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
}

/* 核心数据网格 */
.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.data-item {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 14px;
}

.data-label {
  font-size: 13px;
  color: #718096;
  margin-bottom: 6px;
}

.data-value {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.data-desc {
  font-size: 12px;
  color: #999;
}

/* 业绩目标进度 */
.target-progress {
  padding: 8px 0;
}

.target-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.target-label {
  font-size: 14px;
  color: #718096;
}

.target-value {
  font-size: 24px;
  font-weight: 600;
  color: #4285F4;
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background-color: #4285F4;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.target-detail {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

/* 订单列表 */
.order-list {
  margin-top: 8px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.order-no {
  font-size: 14px;
  color: #2d3748;
  font-weight: 500;
  margin-bottom: 4px;
}

.order-date {
  font-size: 12px;
  color: #999;
}

.order-amount {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  text-align: right;
  margin-bottom: 4px;
}

.order-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  float: right;
}

.status-pending {
  background-color: rgba(251, 188, 5, 0.1);
  color: #FBBC05;
}

.status-paid {
  background-color: rgba(52, 168, 83, 0.1);
  color: #34A853;
}

.status-shipped {
  background-color: rgba(66, 133, 244, 0.1);
  color: #4285F4;
}

.status-completed {
  background-color: rgba(103, 80, 229, 0.1);
  color: #6750E3;
}

.status-cancelled {
  background-color: rgba(234, 67, 53, 0.1);
  color: #EA4335;
}

.view-all {
  text-align: center;
  font-size: 13px;
  color: #4285F4;
  margin-top: 16px;
  cursor: pointer;
}

/* 趋势筛选 */
.trend-filter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
  color: #4285F4;
  font-size: 13px;
}

.filter-text {
  margin-right: 6px;
}

/* 趋势图表 */
.trend-chart {
  height: 220px;
  width: 100%;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .data-container {
    width: 60%;
    max-width: 500px;
  }
}
</style>