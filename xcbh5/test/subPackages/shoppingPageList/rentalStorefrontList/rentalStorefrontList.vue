<template>
  <view class="container">
    <view class="market-header">
      <view class="market-info">
        <text class="market-name">定安-塔岭农贸菜市场</text>
        <text class="market-status">营业中</text>
      </view>
      <uni-icons type="map-pin" size="20" color="#666" />
    </view>
    <view class="status-filter">
      <button 
        v-for="(item, index) in filterOptions" 
        :key="index"
        :class="['filter-btn', { active: currentFilter === item.value }]"
        @click="changeFilter(item.value)"
      >
        {{ item.label }}
      </button>
    </view>

    <scroll-view 
      scroll-y 
      class="stall-list"
      @scrolltolower="loadMore"
    >
      <view 
        v-for="(stall, index) in filteredStalls" 
        :key="index"
        class="stall-item"
        @click="viewDetail(stall.id)"
      >
        <image :src="stall.image" class="stall-image" mode="aspectFill" />
        
        <view class="info-container">
          <view class="top-info">
            <text class="stall-number">{{ stall.number }}</text>
            <view :class="['status-tag', stall.status]">
              {{ stall.status === 'leased' ? '已出租' : '待出租' }}
            </view>
          </view>

          <view class="core-info">
            <text class="price">¥{{ stall.price.toLocaleString() }}/月</text>
            <text class="area">{{ stall.area }}㎡</text>
          </view>

          <view class="detail-info">
            <view class="info-row">
              <uni-icons type="location" size="14" color="#666" />
              <text class="location">{{ stall.location }}</text>
            </view>
            <view class="info-row">
              <uni-icons type="shop" size="14" color="#666" />
              <text>{{ stall.suitable }}</text>
            </view>
          </view>

          <view class="feature-tags">
            <text 
              v-for="(tag, tagIndex) in stall.features"
              :key="tagIndex"
              class="tag"
            >
              #{{ tag }}
            </text>
          </view>
        </view>
      </view>

      <view class="loading-status">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">已加载全部{{ filteredStalls.length }}个摊位</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentFilter: 'all',
      filterOptions: [
        { label: '全部', value: 'all' },
        { label: '待出租', value: 'available' },
        { label: '已出租', value: 'leased' }
      ],
      stallData: [],
      loading: false,
      noMore: false
    }
  },
  computed: {
    filteredStalls() {
      return this.stallData.filter(item => 
        this.currentFilter === 'all' || 
        item.status === this.currentFilter
      )
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500))
        this.stallData = this.getMockData()
      } finally {
        this.loading = false
        this.noMore = true
      }
    },

    getMockData() {
      return [
        {
          id: 1,
          number: 'A-01',
          status: 'leased',
          price: 2400,
          area: 8,
          location: '蔬菜区主通道',
          suitable: '绿叶蔬菜专营',
          image: 'https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
          features: ['智能电子秤', '扫码溯源']
        },
        {
          id: 2,
          number: 'B-02',
          status: 'available',
          price: 2400,
          area: 8,
          location: '肉类边柜区',
          suitable: '冷冻肉制品',
          image: 'https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
          features: ['独立冷藏柜', '押金1.5万']
        },
        {
          id: 3,
          number: 'C-01',
          status: 'leased',
          price: 2400,
          area: 12,
          location: '水产鲜活区',
          suitable: '活鱼现杀',
          image: 'https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
          features: ['循环水系统', '日交易200斤+']
        },
        {
          id: 4,
          number: 'H-02',
          status: 'available',
          price: 2400,
          area: 10,
          location: '熟食区',
          suitable: '早餐',
          image: 'https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
          features: ['粉汤', '炒粉','猪脚饭']
        }
      ]
    },

    changeFilter(status) {
      this.currentFilter = status
    },

    loadMore() {
      if (!this.noMore) {
        // 实际项目应在此处加载分页数据
      }
    },

    viewDetail(id) {
      uni.navigateTo({
        url: `/subPackages/shoppingPageList/rentalStorefront/rentalStorefront`
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

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;

  .market-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .market-name {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
  }

  .market-status {
    font-size: 24rpx;
    color: #07c160;
    padding: 6rpx 20rpx;
    background: #e8ffec;
    border-radius: 30rpx;
  }
}

.status-filter {
  display: flex;
  padding: 20rpx;
  background: white;
  gap: 20rpx;

  .filter-btn {
    flex: 1;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 35rpx;
    font-size: 28rpx;
    color: #666;
    background: #f5f5f5;
    
    &.active {
      background: #e8f4ff;
      color: #007AFF;
      font-weight: 500;
    }
  }
}

.stall-list {
  height: calc(100vh - 240rpx);
  padding: 20rpx;
}

.stall-item {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  display: flex;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .stall-image {
    width: 240rpx;
    height: 240rpx;
  }

  .info-container {
    flex: 1;
    padding: 20rpx;
  }

  .top-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;

    .stall-number {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .status-tag {
      padding: 6rpx 20rpx;
      border-radius: 30rpx;
      font-size: 24rpx;

      &.leased {
        background: #e8f4ff;
        color: #007AFF;
      }

      &.available {
        background: #fff0e8;
        color: #ff5a00;
      }
    }
  }

  .core-info {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;

    .price {
      color: #e4393c;
      font-size: 36rpx;
      font-weight: bold;
      margin-right: 20rpx;
    }

    .area {
      color: #666;
      font-size: 28rpx;
    }
  }

  .detail-info {
    .info-row {
      display: flex;
      align-items: center;
      color: #666;
      font-size: 24rpx;
      margin-bottom: 8rpx;

      uni-icons {
        margin-right: 8rpx;
      }
    }
  }

  .feature-tags {
    margin-top: 16rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    
    .tag {
      padding: 4rpx 12rpx;
      background: #f5f5f5;
      border-radius: 6rpx;
      color: #666;
      font-size: 24rpx;
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
