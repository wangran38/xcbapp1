<template>
  <view class="supply-container">
    <!-- 筛选搜索区域 -->
    <view class="filter-section">
      <!-- 搜索 + 按钮区域 -->
      <view class="search-bar">
        <input
          class="search-input"
          type="text"
          placeholder="请输入关键字"
          v-model="searchText"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
        <button class="reset-btn" @click="handleReset">重置</button>
      </view>
      <!-- 分类筛选区域 -->
      <view class="filter-group">
        <picker
          @change="categoryChange"
          :range="categories"
          range-key="label"
        >
          <view class="filter-btn">
            {{ categories[selectedCategoryIndex].label }}
          </view>
        </picker>
        <picker :range="distances" range-key="label">
          <view class="filter-btn">
            {{ distances[selectedDistanceIndex].label }}
          </view>
        </picker>
      </view>
    </view>

    <!-- 商品列表区域 -->
    <scroll-view
      class="goods-list"
      scroll-y
      @scrolltolower="loadMore"
      :scroll-with-animation="true"
    >
      <view class="goods-grid">
        <view
          class="goods-card"
          v-for="(item, index) in goodsList"
          :key="index"
          @click="goDetail(item.id)"
        >
          <!-- 商品图片 -->
          <view class="image-container">
            <image
              class="goods-image"
              :src="item.selllogo"
              mode="aspectFill"
              :lazy-load="true"
            />
            <view class="goods-tag" v-if="item.tag">
              {{ item.tag }}
            </view>
          </view>
          <!-- 商品信息 -->
          <view class="goods-content">
            <text class="goods-title">{{ item.selltitle }}</text>
            <view class="price-section">
              <text class="current-price">￥{{ item.marketprice }}</text>
              <text class="original-price" v-if="item.price">
                ￥{{ item.price }}
              </text>
            </view>
            <view class="action-bar">
              <view class="sales-info">
                <uni-icons type="shop" size="12" color="#666"></uni-icons>
                <text>{{ item.stoptime }}人付款</text>
              </view>
              <view class="contact-btn" @click.stop="contactNow">
                <text>询底价</text>
                <uni-icons type="arrow-right" size="14" color="#fff"></uni-icons>
              </view>
            </view>
            <view class="location-info">
              <uni-icons type="location" size="12" color="#666"></uni-icons>
              <text>{{ item.selladdress }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="load-status">
        <text v-if="loading" class="loading-text">加载中...</text>
        <text v-else-if="noMore" class="no-more">—— 没有更多了 ——</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/api/index.js'

export default {
  data() {
    return {
      // 搜索关键字
      searchText: '',
      // 分类数据
      categories: [
        { label: '所有分类', value: '' },
        { label: '菜类', value: '' },
        { label: '肉类', value: '' }
      ],
      selectedCategoryIndex: 0,
      // 距离筛选
      distances: [
        { label: '离我最近', value: '' },
        { label: '离我最远', value: '' }
      ],
      selectedDistanceIndex: 0,
      // 商品列表
      goodsList: [],
      page: 1,
      loading: false,
      noMore: false,
      queryData: {
        page: 1,
        limit: 10
      }
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      if (this.loading || this.noMore) return
      this.loading = true
      try {
        const res = await api.wholesaleList(this.queryData)
        this.goodsList = res.data.listdata
        if (res.data.listdata.length === 0) {
          this.noMore = true
          return
        }
        this.page++
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 处理搜索
    handleSearch() {
      this.resetList()
      this.loadData()
    },
    // 重置筛选
    handleReset() {
      this.searchText = ''
      this.selectedCategoryIndex = 0
      this.selectedDistanceIndex = 0
      this.resetList()
      this.loadData()
    },
    // 加载更多
    loadMore() {
      if (!this.noMore) this.loadData()
    },
    // 重置列表
    resetList() {
      this.goodsList = []
      this.page = 1
      this.noMore = false
    },
    // 联系商家
    contactNow() {
      uni.showToast({
        title: '已发送联系请求',
        icon: 'none'
      })
    },
    // 跳转详情
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${id}`
      })
    },
    // 分类改变
    categoryChange(e) {
      this.selectedCategoryIndex = e.detail.value
      this.resetList()
      this.loadData()
    }
  }
}
</script>

<style lang="scss">
/* 定义主题色等变量，方便统一调整 */
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;

$bg-color: #f5f7fa;
$white: #fff;
$gray-light: #e5e7eb;
$text-main: #303133;
$text-secondary: #606266;
$text-placeholder: #909399;

.supply-container {
  padding: 24rpx;
  background-color: $bg-color;
  min-height: 100vh;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 24rpx;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  .search-input {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    padding: 0 24rpx;
    border: none;
    background-color: $white;
    font-size: 28rpx;
    color: $text-main;
    &::placeholder {
      color: $text-placeholder;
    }
  }

  .search-btn,
  .reset-btn {
    height: 88rpx;
    line-height: 88rpx;
    padding: 0 36rpx;
    border: none;
    color: $white;
    font-size: 28rpx;
    cursor: pointer;
    transition: all 0.3s ease;
	margin: 10rpx;
  }

  .search-btn {
    background: linear-gradient(90deg, #66b1ff, $primary-color);
	
    &:hover {
      opacity: 0.9;
    }
  }

  .reset-btn {
    background: linear-gradient(90deg, #f78989, $danger-color);
    margin-left: 12rpx;
    &:hover {
      opacity: 0.9;
    }
  }
}

/* 分类筛选 */
.filter-group {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .filter-btn {
    padding: 14rpx 28rpx;
    background-color: $white;
    border: 1rpx solid $gray-light;
    border-radius: 44rpx;
    font-size: 28rpx;
    color: $text-secondary;
    transition: all 0.3s ease;
    &:hover {
      border-color: $primary-color;
      color: $primary-color;
    }
  }
}

/* 商品列表 */
.goods-list {
  height: calc(100vh - 260rpx); /* 留出筛选区域高度 */
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.goods-card {
  background-color: $white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.05);
    transform: translateY(-2rpx);
  }
}

.image-container {
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;

  .goods-image {
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
    &:hover {
      transform: scale(1.05);
    }
  }

  .goods-tag {
    position: absolute;
    top: 12rpx;
    left: 12rpx;
    background: $danger-color;
    color: $white;
    padding: 6rpx 18rpx;
    border-radius: 8rpx;
    font-size: 22rpx;
    opacity: 0.9;
  }
}

.goods-content {
  padding: 24rpx;

  .goods-title {
    font-size: 28rpx;
    color: $text-main;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    min-height: 80rpx;
    margin-bottom: 16rpx;
  }

  .price-section {
    display: flex;
    align-items: baseline;
    margin-bottom: 20rpx;

    .current-price {
      color: $danger-color;
      font-size: 34rpx;
      font-weight: 600;
      margin-right: 12rpx;
    }

    .original-price {
      color: $text-placeholder;
      font-size: 24rpx;
      text-decoration: line-through;
    }
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;

    .sales-info {
      display: flex;
      align-items: center;
      color: $text-secondary;
      font-size: 24rpx;

      .uni-icons {
        margin-right: 6rpx;
      }
    }

    .contact-btn {
      background: linear-gradient(90deg, #66b1ff, $primary-color);
      border-radius: 40rpx;
      padding: 8rpx 24rpx;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
      &:hover {
        opacity: 0.9;
      }

      text {
        color: $white;
        font-size: 24rpx;
        margin-right: 8rpx;
      }
    }
  }

  .location-info {
    display: flex;
    align-items: center;
    color: $text-secondary;
    font-size: 24rpx;

    .uni-icons {
      margin-right: 6rpx;
    }
  }
}

/* 加载状态 */
.load-status {
  padding: 30rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: $text-placeholder;

  .no-more {
    color: $text-secondary;
  }
}
</style>