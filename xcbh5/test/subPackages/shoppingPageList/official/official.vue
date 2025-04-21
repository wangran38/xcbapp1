<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <uni-icons type="search" size="20" color="#999" />
      <input 
        class="search-input" 
        placeholder="搜索产品" 
        placeholder-class="placeholder-style"
      />
    </view>

    <!-- 分类导航 -->
    <scroll-view scroll-x class="nav-scroll">
      <view 
        v-for="(item, index) in categories"
        :key="index"
        :class="['nav-item', activeNav === index ? 'active' : '']"
        @click="switchNav(index)"
      >
        {{ item.name }}
      </view>
    </scroll-view>

    <!-- 商品网格 -->
    <view class="product-grid">
      <view 
        v-for="(item, index) in productList"
        :key="index"
        class="product-card"
        @click="navToDetail(item.id)"
      >
        <view class="card-header">
          <image class="product-img" :src="item.cover" mode="aspectFill" />
          <view class="tag-wrap">
            <text class="origin-tag">{{ item.origin }}</text>
            <text v-if="item.isNew" class="new-tag">新品</text>
          </view>
        </view>
        
        <view class="card-body">
          <text class="product-title">{{ item.title }}</text>
          <view class="price-wrap">
            <text class="current-price">¥{{ item.price }}</text>
            <text class="old-price">¥{{ item.originalPrice }}</text>
          </view>
          <view class="sales-wrap">
            <progress 
              :percent="item.progress" 
              stroke-width="4" 
              activeColor="#FF9900" 
              backgroundColor="#EEE" 
            />
            <text class="sales-text">已售{{ item.sales }}{{ item.unit }}</text>
          </view>
        </view>
        
        <view class="card-footer">
          <uni-icons type="shop" size="18" color="#666" />
          <button class="buy-btn" @click.stop="addToCart(item)">询价</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeNav: 0,
      categories: [
        { name: '蔬菜' },
        { name: '水果' },
        { name: '水产' },
        { name: '肉类' },
      ],
      productList: [
        {
          id: 1,
          cover: 'https://qcloud.dpfile.com/pc/wjwuf0kuNAC-9AUfBkdUJL5dT3d8GGcuGlPpgYqjMJQDY_ZFhBScrG7sKiYM3WjS.jpg',
          title: '海南叶椰子 现摘现发',
          price: 8.8,
          originalPrice: 12.6,
          unit: '个',
          sales: 3280,
          progress: 82,
          origin: '海南万宁',
          isNew: true
        },
       
      ]
    }
  },
  methods: {
    switchNav(index) {
      this.activeNav = index
    },
    navToDetail(id) {
      uni.navigateTo({ url: `/pages/detail?id=${id}` })
    },
    addToCart(item) {
      uni.showToast({
        title: `已加入助农清单：${item.title}`,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #F8F8F8;
  min-height: 100vh;
  padding: 20rpx;
}

.search-bar {
  background: #FFF;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
  
  .search-input {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
    margin-left: 20rpx;
  }
  
  .placeholder-style {
    color: #CCC;
  }
}

.nav-scroll {
  white-space: nowrap;
  margin-bottom: 30rpx;
  
  .nav-item {
    display: inline-block;
    padding: 0 36rpx;
    height: 64rpx;
    line-height: 64rpx;
    font-size: 28rpx;
    color: #666;
    background: #FFF;
    border-radius: 32rpx;
    margin-right: 20rpx;
    transition: all 0.3s;
    
    &.active {
      background: #5B8C00;
      color: #FFF;
      font-weight: 500;
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-card {
  background: #FFF;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 24rpx rgba(0,0,0,0.04);
  
  .card-header {
    position: relative;
    
    .product-img {
      width: 100%;
      height: 320rpx;
    }
    
    .tag-wrap {
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      display: flex;
      gap: 10rpx;
      
      text {
        padding: 4rpx 16rpx;
        border-radius: 8rpx;
        font-size: 22rpx;
      }
      
      .origin-tag {
        background: rgba(0,0,0,0.7);
        color: #FFF;
      }
      
      .new-tag {
        background: #FF4040;
        color: #FFF;
      }
    }
  }
  
  .card-body {
    padding: 20rpx;
    
    .product-title {
      font-size: 28rpx;
      color: #333;
      line-height: 1.4;
    }
    
    .price-wrap {
      margin: 16rpx 0;
      display: flex;
      align-items: baseline;
      
      .current-price {
        color: #E4393C;
        font-size: 32rpx;
        font-weight: 600;
        margin-right: 12rpx;
      }
      
      .old-price {
        color: #999;
        font-size: 24rpx;
        text-decoration: line-through;
      }
    }
    
    .sales-wrap {
      display: flex;
      align-items: center;
      gap: 12rpx;
      
      progress {
        flex: 1;
      }
      
      .sales-text {
        font-size: 24rpx;
        color: #666;
        white-space: nowrap;
      }
    }
  }
  
  .card-footer {
    display: flex;
    align-items: center;
    padding: 20rpx;
    border-top: 1rpx solid #EEE;
    
    .buy-btn {
      flex: 1;
      height: 56rpx;
      line-height: 56rpx;
      background: #5B8C00;
      color: #FFF;
      border-radius: 40rpx;
      font-size: 26rpx;
      margin-left: 20rpx;
      
      &::after {
        border: none;
      }
    }
  }
}
</style>
