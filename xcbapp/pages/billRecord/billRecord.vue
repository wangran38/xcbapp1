<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="navBarStyle">
      <text class="nav-title">账单记录</text>
    </view>

    <!-- 筛选区域 -->
    <view class="filter-card">
      <view class="filter-group">
        <picker mode="selector" :range="typeOptions" @change="typeChange">
          <view class="filter-btn">
            <uni-icons type="bars" size="16" color="#666"></uni-icons>
            <text>{{ typeOptions[typeIndex] }}</text>
          </view>
        </picker>
        <picker mode="date" fields="month" @change="dateChange">
          <view class="filter-btn">
            <uni-icons type="calendar" size="16" color="#666"></uni-icons>
            <text>{{ currentDate }}</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <view class="stat-item income">
        <text class="stat-label">总收入</text>
        <text class="stat-value">+¥{{ totalIncome }}</text>
      </view>
      <view class="stat-item expense">
        <text class="stat-label">总支出</text>
        <text class="stat-value">-¥{{ totalExpense }}</text>
      </view>
    </view>

    <!-- 账单列表 -->
    <view class="list-container">
      <uni-list v-if="filteredBills.length">
        <uni-list-item 
          v-for="(item, index) in filteredBills" 
          :key="index"
          :title="item.category"
          :note="formatDate(item.date)"
          :rightText="item.type === 'income' ? '+'+item.amount : '-'+item.amount"
          :rightTextStyle="item.type === 'income' ? rightTextStyle.income : rightTextStyle.expense"
          hover-class="none"
          @click="handleItemClick(item)"
        >
          <template v-slot:footer>
            <text class="remark">{{ item.remark || '暂无备注' }}</text>
          </template>
          <template v-slot:header>
            <uni-icons 
              :type="item.type === 'income' ? 'arrowthindown' : 'arrowthinup'" 
              :color="item.type === 'income' ? themeColor.primary : themeColor.danger"
              size="20"
            ></uni-icons>
          </template>
        </uni-list-item>
      </uni-list>

      <!-- 加载状态 -->
      <view class="loading-state">
        <text v-if="loading" class="loading-text">加载中...</text>
        <text v-if="!hasMore && filteredBills.length" class="no-more">已经到底啦\~</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && !filteredBills.length" class="empty-state">
        <text class="empty-text">本月还没有账单记录哦～</text>
      </view>
    </view>

  </view>
</template>

<script>
// 确保已安装uni-ui组件：npm install @dcloudio/uni-ui
export default {
  data() {
    return {
      statusBarHeight: 20,
      typeOptions: ['全部', '收入', '支出'],
      typeIndex: 0,
      currentDate: this.formatDate(new Date()),
      bills: [],
      pageSize: 10,
      currentPage: 1,
      loading: false,
      hasMore: true,
      themeColor: {
        primary: '#409EFF',    // 轻蓝主色
        danger: '#F56C6C',     // 警示色
      }
    };
  },
  computed: {
    rightTextStyle() {
      return {
        income: { color: this.themeColor.primary },
        expense: { color: this.themeColor.danger }
      }
    },
    filteredBills() {
      // 先过滤后分页
      const filtered = this.bills.filter(item => {
        const typeMatch = this.typeIndex === 0 || 
          (this.typeIndex === 1 && item.type === 'income') ||
          (this.typeIndex === 2 && item.type === 'expense');
        const dateMatch = new Date(item.date).getMonth() === new Date(this.currentDate).getMonth();
        return typeMatch && dateMatch;
      });
      return filtered.slice(0, this.currentPage * this.pageSize);
    },
    totalIncome() {
      return this.bills
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0)
        .toFixed(2);
    },
    totalExpense() {
      return this.bills
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0)
        .toFixed(2);
    },
    navBarStyle() {
      return {
        paddingTop: `${this.statusBarHeight}px`,
        height: '44px',
        background: this.themeColor.primary
      };
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    },
    typeChange(e) {
      this.typeIndex = e.detail.value;
      this.resetPagination();
    },
    dateChange(e) {
      this.currentDate = e.detail.value;
      this.resetPagination();
    },
    resetPagination() {
      this.currentPage = 1;
      this.hasMore = true;
      this.bills = [];
      this.loadMore();
    },
    handleItemClick(item) {
      uni.navigateTo({
        url: `/pages/bill/detail?id=${item.id}`
      });
    },
	
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 20;
    },
    async loadMore() {
      if (this.loading || !this.hasMore) return;
      
      this.loading = true;
      try {
        // 模拟网络请求
        const newData = await this.mockFetchData();
        this.bills = [...this.bills, ...newData];
        this.hasMore = newData.length >= this.pageSize;
        this.currentPage++;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    mockFetchData() {
      return new Promise(resolve => {
        setTimeout(() => {
          // 生成测试数据
          const data = Array.from({ length: this.pageSize }, (_, i) => ({
            id: Date.now() + i,
            type: Math.random() > 0.5 ? 'income' : 'expense',
            category: ['工资', '餐饮', '交通', '购物'][Math.floor(Math.random() * 4)],
            amount: (Math.random() * 2000 + 100).toFixed(2),
            date: new Date(new Date().setDate(Math.floor(Math.random() * 30 + 1))).toISOString().split('T')[0],
            remark: Math.random() > 0.7 ? '测试备注' : ''
          }));
          resolve(data);
        }, 800);
      });
    }
  },
  onLoad() {
    this.getSystemInfo();
    this.loadMore();
  },
  onReachBottom() {
    this.loadMore();
  }
};
</script>

<style lang="scss">
$primary: #409EFF;
$danger: #F56C6C;
$background: #F5F7FA;

page {
  background-color: $background;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.custom-navbar {
  padding: 0 30rpx;
  .nav-title {
    color: #fff;
    font-size: 18px;
    line-height: 44rpx;
    font-weight: 500;
  }
}

.filter-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
  .filter-group {
    display: flex;
    padding: 20rpx;
    gap: 20rpx;
    .filter-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #666;
      uni-icons {
        margin-right: 8rpx;
      }
    }
  }
}

.stats-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
  display: flex;
  .stat-item {
    flex: 1;
    padding: 30rpx;
    &:first-child {
      border-right: 2rpx solid #eee;
    }
    .stat-label {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 10rpx;
    }
    .stat-value {
      font-size: 32rpx;
      font-weight: 500;
      &.income { color: $primary; }
      &.expense { color: $danger; }
    }
  }
}

.list-container {
  margin: 0 20rpx;
  .empty-state {
    text-align: center;
    padding: 100rpx 0;
    image {
      width: 240rpx;
      height: 240rpx;
      margin-bottom: 30rpx;
    }
    .empty-text {
      color: #999;
      font-size: 28rpx;
    }
  }
}

.loading-state {
  padding: 30rpx 0;
  text-align: center;
  .loading-text {
    color: #666;
    font-size: 28rpx;
  }
  .no-more {
    color: #999;
    font-size: 24rpx;
  }
}

.float-button {
  position: fixed;
  right: 40rpx;
  bottom: calc(120rpx + constant(safe-area-inset-bottom));
  bottom: calc(120rpx + env(safe-area-inset-bottom));
  width: 100rpx;
  height: 100rpx;
  background: $primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(64,158,255,0.3);
  z-index: 100;
}

/* 修复uni-list-item样式 */
uni-list-item {
  margin: 12rpx 0;
  border-radius: 16rpx !important;
  &::after { display: none !important; }
  .uni-list-item__container {
    padding: 24rpx !important;
  }
}
</style>
