<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header-bar">
      <text class="page-title">我的批发</text>
    </view>

    <!-- 主内容 -->
    <scroll-view scroll-y class="main-content">
      <!-- 我的供应 -->
      <view class="nav-card supply-card" @click="navToMySupply">
        <view class="card-inner">
          <uni-icons type="shop-filled" size="48" color="#fff" />
          <view class="card-content">
            <text class="card-title">我的供应</text>
            <text class="card-stats">已发布{{ supplyCount }}个商品</text>
          </view>
          <uni-icons type="right" size="28" color="#fff" />
        </view>
      </view>

      <!-- 我的采购 -->
      <view class="nav-card purchase-card" @click="navToMyPurchase">
        <view class="card-inner">
          <uni-icons type="cart-filled" size="48" color="#fff" />
          <view class="card-content">
            <text class="card-title">我的采购</text>
            <text class="card-stats">进行中{{ purchaseCount }}个订单</text>
          </view>
          <uni-icons type="right" size="28" color="#fff" />
        </view>
      </view>

     
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      supplyCount: 15,     // 当前供应数量
      purchaseCount: 8,    // 当前采购数量
      totalSupply: 238,    // 历史供应总量
      totalPurchase: 156   // 历史采购总量
    }
  },
  methods: {
    navToMySupply() {
      uni.navigateTo({ url: '/subPackages/Wholesale/mySupply/mySupply' })
    },
    navToMyPurchase() {
      uni.navigateTo({ url: '/subPackages/Wholesale/myProcurement/myProcurement' })
    }
  }
}
</script>

<style lang="scss">
.container {
  background: #f8f9fa;
  min-height: 100vh;
}

.header-bar {
  padding: 40rpx 32rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;
  
  .page-title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
  }
}

.nav-card {
  margin: 30rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  
  .card-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .card-content {
    flex: 1;
    margin-left: 32rpx;
    
    .card-title {
      font-size: 36rpx;
      color: #fff;
      display: block;
    }
    
    .card-stats {
      font-size: 28rpx;
      color: rgba(255,255,255,0.9);
      margin-top: 12rpx;
    }
  }
}

.supply-card {
  background: linear-gradient(135deg, #2979FF, #6ab0ff);
}

.purchase-card {
  background: linear-gradient(135deg, #00C853, #66bb6a);
}

.stats-panel {
  margin: 40rpx 30rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  
  .stats-item {
    text-align: center;
    
    .stats-value {
      font-size: 40rpx;
      color: #333;
      font-weight: bold;
      display: block;
    }
    
    .stats-label {
      font-size: 26rpx;
      color: #666;
      margin-top: 8rpx;
    }
  }
}
</style>
