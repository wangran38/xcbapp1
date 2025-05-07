<template>
  <view class="container">
    <!-- 分类导航 -->
    <scroll-view 
      class="category-tabs"
      scroll-x 
      scroll-with-animation
      :scroll-left="scrollLeft"
    >
      <view class="tab-wrapper">
        <view 
          v-for="(category, index) in categories"
          :key="index"
          :class="['tab-item', activeCategory === category.value ? 'active' : '']"
          @click="switchCategory(category.value, index)"
        >
          {{ category.label }}
        </view>
      </view>
    </scroll-view>

    <!-- 菜品列表 -->
    <scroll-view 
      class="dish-list"
      scroll-y
      :style="{height: scrollHeight + 'px'}"
      :refresher-enabled="true"
      @refresherrefresh="onRefresh"
    >
      <view 
        v-for="(dish, index) in filteredDishes"
        :key="dish.id"
        class="dish-card"
      >
        <image 
          class="dish-image" 
          :src="dish.image" 
          mode="aspectFill"
          @error="handleImageError(dish)"
        ></image>
        <view class="dish-content">
          <text class="dish-name">{{ dish.name }}</text>
          <text class="dish-price">¥{{ dish.price.toFixed(2) }}</text>
          <text class="dish-stock">库存: {{ dish.stock }}{{ dish.unit }}</text>
          <button 
            class="off-shelf-btn"
            @click="handleOffShelf(dish.id)"
            :disabled="processingIds.includes(dish.id)"
          >
            {{ processingIds.includes(dish.id) ? '处理中...' : '下架' }}
          </button>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && filteredDishes.length === 0" class="empty-wrapper">
        <image class="empty-image" src="/static/empty.png"></image>
        <text class="empty-text">暂无上架商品</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
	import {api} from '@/api/index.js'
export default {
  data() {
    return {
      activeCategory: 'self',
      categories: [
        { label: '自销', value: 'self' },
        { label: '代提', value: 'agent' },
        { label: '批发', value: 'wholesale' }
      ],
      dishes: [
        // 自销菜品
        {
          id: 1001,
          name: '11111',
          price: 68.0,
          stock: 23,
          unit: '份',
          image: '/static/dishes/braised_pork.jpg',
          category: 'self',
          status: 1
        },
        {
          id: 1002,
          name: '22222',
          price: 298.0,
          stock: 8,
          unit: '条',
          image: '/static/dishes/steamed_fish.jpg',
          category: 'self',
          status: 1
        },
      
        // 代提商品
        {
          id: 2001,
          name: '333333',
          price: 888.0,
          stock: 15,
          unit: '盒',
          image: '/static/dishes/beef_box.jpg',
          category: 'agent',
          status: 1
        },
        {
          id: 2002,
          name: '444444',
          price: 399.0,
          stock: 5,
          unit: '箱',
          image: '/static/dishes/oysters.jpg',
          category: 'agent',
          status: 1
        },
      
        // 批发商品
        {
          id: 3001,
          name: '55555',
          price: 68.0,
          stock: 150,
          unit: '袋(10kg)',
          image: '/static/dishes/rice.jpg',
          category: 'wholesale',
          status: 1
        },
        {
          id: 3002,
          name: '666666',
          price: 128.0,
          stock: 89,
          unit: '箱(6L)',
          image: '/static/dishes/olive_oil.jpg',
          category: 'wholesale',
          status: 1
        },
        {
          id: 3003,
          name: '77777',
          price: 158.0,
          stock: 42,
          unit: '袋(1kg)',
          image: '/static/dishes/coffee_beans.jpg',
          category: 'wholesale',
          status: 1
        }
      ],
      scrollHeight: 600,
      scrollLeft: 0,
      processingIds: [],
      loading: true
    }
  },
  computed: {
    filteredDishes() {
      return this.dishes.filter(
        item => item.category === this.activeCategory && item.status === 1
      )
    }
  },
  mounted() {
    this.loadData()
    this.calcScrollHeight()
  },
  methods: {
    async loadData() {
      try {
        // 模拟接口请求
        const res = await this.$api.getDishList()
        this.dishes = res.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    calcScrollHeight() {
      const systemInfo = uni.getSystemInfoSync()
      const query = uni.createSelectorQuery().in(this)
      query.select('.category-tabs').boundingClientRect()
      query.exec(res => {
        const tabHeight = res[0]?.height || 60
        this.scrollHeight = systemInfo.windowHeight - tabHeight - 10
      })
    },

    switchCategory(value, index) {
      this.activeCategory = value
      // 计算滚动定位
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this)
        query.select(`.tab-item:nth-child(${index + 1})`).boundingClientRect()
        query.exec(res => {
          if (res[0]) {
            this.scrollLeft = res[0].left - 50
          }
        })
      })
    },

    async handleOffShelf(id) {
      this.processingIds.push(id)
      try {
        await this.$api.updateDishStatus({ id, status: 0 })
        this.dishes = this.dishes.map(item => 
          item.id === id ? { ...item, status: 0 } : item
        )
        uni.showToast({ title: '下架成功', icon: 'success' })
      } catch (error) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      } finally {
        this.processingIds = this.processingIds.filter(i => i !== id)
      }
    },

    handleImageError(dish) {
      dish.image = '/static/default-dish.png'
    },

    onRefresh() {
      this.loadData()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f8f8;
  height: 100vh;
  box-sizing: border-box;
}

.category-tabs {
  background: #fff;
  padding: 20rpx 0;
  white-space: nowrap;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
  
  .tab-wrapper {
    display: inline-flex;
    padding: 0 30rpx;
  }
  
  .tab-item {
    position: relative;
    padding: 16rpx 40rpx;
    margin-right: 40rpx;
    font-size: 30rpx;
    color: #666;
    transition: color 0.2s;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 4rpx;
      background: #007AFF;
      transition: all 0.3s;
    }
    
    &.active {
      color: #007AFF;
      font-weight: 500;
      
      &::after {
        left: 0;
        width: 100%;
      }
    }
  }
}

.dish-list {
  padding: 30rpx;
  box-sizing: border-box;
}

.dish-card {
  display: flex;
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 30rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
  
  .dish-image {
    width: 220rpx;
    height: 220rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
    background: #f5f5f5;
  }
  
  .dish-content {
    flex: 1;
    margin-left: 24rpx;
    position: relative;
    padding-right: 160rpx;
    
    .dish-name {
      font-size: 32rpx;
      color: #333;
      line-height: 1.4;
    }
    
    .dish-price {
      display: block;
      color: #ff4444;
      font-size: 36rpx;
      font-weight: 600;
      margin: 16rpx 0;
    }
    
    .dish-stock {
      display: block;
      font-size: 26rpx;
      color: #999;
    }
    
    .off-shelf-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 0 40rpx;
      height: 64rpx;
      line-height: 64rpx;
      font-size: 28rpx;
      background: #f8f8f8;
      color: #666;
      border-radius: 40rpx;
      
      &::after {
        border: none;
      }
      
      &[disabled] {
        opacity: 0.6;
      }
    }
  }
}

.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  
  .empty-image {
    width: 280rpx;
    height: 280rpx;
    opacity: 0.8;
  }
  
  .empty-text {
    color: #999;
    font-size: 30rpx;
    margin-top: 20rpx;
  }
}

/* 多行省略 */
@mixin multiline-ellipsis($lines) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $lines;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
