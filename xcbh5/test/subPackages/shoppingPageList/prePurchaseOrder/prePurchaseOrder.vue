<template>
  <view class="container">
    <!-- 头部统计 -->
    <view class="header">
      <text class="title">我的预购订单</text>
      <view class="stats">
        <text>进行中 {{ processingCount }} 笔</text>
        <text>总金额 ¥{{ totalAmount }}</text>
      </view>
    </view>

    <!-- 状态筛选 -->
    <view class="status-tabs">
      <view 
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="['tab-item', { active: activeStatus === tab.value }]"
        @click="changeStatus(tab.value)"
      >
        <text>{{ tab.label }}</text>
        <view v-if="activeStatus === tab.value" class="indicator"></view>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view 
      scroll-y 
      class="order-list"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
      refresher-enabled
    >
      <view 
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-item"
        @click="viewDetail(order.id)"
      >
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <view :class="['status-tag', order.status]">
            {{ statusMap[order.status] }}
          </view>
        </view>

        <view class="goods-info">
          <image :src="order.goodsImage" class="goods-image" />
          <view class="goods-detail">
            <text class="goods-name">{{ order.goodsName }}</text>
            <text class="quantity">x{{ order.quantity }}</text>
            <view class="price-info">
              <text class="deposit">定金：¥{{ order.deposit }}</text>
              <text class="final">尾款：¥{{ order.finalPayment }}</text>
            </view>
          </view>
        </view>

        <view class="footer-info">
          <text class="pickup-info">
            <uni-icons type="shop" size="14" />
            {{ order.pickupPoint }} · {{ order.pickupTime }}
          </text>
          <view class="actions">
            <button 
              v-if="order.status === 'wait_pay'"
              class="btn mini"
              @click.stop="payFinal(order.id)"
            >
              支付尾款
            </button>
            <button 
              v-if="order.status === 'completed'"
              class="btn mini"
              @click.stop="applyAfterSales(order.id)"
            >
              申请售后
            </button>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-status">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多订单了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeStatus: 'all',
      statusTabs: [
        { label: '全部', value: 'all' },
        { label: '待提货', value: 'wait_pickup' },
        { label: '已完成', value: 'completed' }
      ],
      orders: [],
      loading: false,
      noMore: false,
      statusMap: {
        'wait_pickup': '待提货',
        'completed': '已完成',
        'canceled': '已取消'
      }
    }
  },
  computed: {
    filteredOrders() {
      if (this.activeStatus === 'all') return this.orders
      return this.orders.filter(o => o.status === this.activeStatus)
    },
    processingCount() {
      return this.orders.filter(o => 
        ['wait_pay', 'wait_pickup'].includes(o.status)
      ).length
    },
    totalAmount() {
      return this.orders.reduce((sum, o) => sum + (o.deposit + o.finalPayment), 0)
        .toFixed(2)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        // 模拟接口请求
        await new Promise(resolve => setTimeout(resolve, 100))
        this.orders = this.getMockData()
      } finally {
        this.loading = false
      }
    },

    getMockData() {
      return [
        {
          id: 1,
          orderNo: 'xcbdsc20251128001',
          status: 'completed',
          goodsImage: 'https://img1.baidu.com/it/u=2670186960,2836929917&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
          goodsName: '定安黑猪',
          quantity: 2,
          deposit: 60,
          finalPayment: 196,
          pickupPoint: '猪肉铺小吴',
          pickupTime: '12月5日 14:00-18:00'
        },
      ]
    },

    changeStatus(status) {
      this.activeStatus = status
    },

    onRefresh() {
      this.loadData()
    },

    loadMore() {
      if (!this.noMore) {
        // 分页加载逻辑
      }
    },

    viewDetail(id) {
      uni.navigateTo({
        url: `/pages/preorder/detail?id=${id}`
      })
    },

    payFinal(id) {
      uni.showModal({
        title: '支付尾款',
        content: '确认支付尾款金额？',
        success: (res) => {
          if (res.confirm) {
            // 调用支付接口
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #f8f8f8;
  min-height: 100vh;
}

.header {
  padding: 24rpx 32rpx;
  background: #fff;
  
  .title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
  }
  
  .stats {
    margin-top: 16rpx;
    display: flex;
    gap: 32rpx;
    color: #666;
    font-size: 26rpx;
  }
}

.status-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  
  .tab-item {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    position: relative;
    
    &.active {
      color: #007AFF;
      font-weight: 500;
      
      .indicator {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background: #007AFF;
        border-radius: 2rpx;
      }
    }
  }
}

.order-list {
  height: calc(100vh - 280rpx);
  padding: 20rpx;
}

.order-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .order-no {
      color: #666;
      font-size: 26rpx;
    }
    
    .status-tag {
      font-size: 24rpx;
      padding: 6rpx 20rpx;
      border-radius: 30rpx;
      
      &.wait_pay {
        background: #fff0e8;
        color: #ff5a00;
      }
      
      &.wait_pickup {
        background: #e8f4ff;
        color: #007AFF;
      }
      
      &.completed {
        background: #e8ffec;
        color: #07c160;
      }
    }
  }

  .goods-info {
    display: flex;
    gap: 20rpx;
    
    .goods-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
    }
    
    .goods-detail {
      flex: 1;
      
      .goods-name {
        font-size: 30rpx;
        color: #333;
      }
      
      .quantity {
        color: #666;
        font-size: 26rpx;
        margin: 8rpx 0;
      }
      
      .price-info {
        display: flex;
        gap: 20rpx;
        
        .deposit {
          color: #999;
          font-size: 26rpx;
        }
        
        .final {
          color: #e4393c;
          font-size: 28rpx;
          font-weight: bold;
        }
      }
    }
  }

  .footer-info {
    margin-top: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .pickup-info {
      color: #666;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      
      uni-icons {
        margin-right: 8rpx;
      }
    }
    
    .btn {
      height: 56rpx;
      line-height: 56rpx;
      padding: 0 32rpx;
      font-size: 26rpx;
      
      &.mini {
        border: 1rpx solid #007AFF;
        color: #007AFF;
        background: #fff;
      }
    }
  }
}

.loading-status {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
