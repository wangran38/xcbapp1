<template>
  <view class="page-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">商家报价中心</text>
      <uni-icons type="notification" size="28" color="#fff" />
    </view>

    <!-- 需求卡片 -->
    <view class="demand-card glassmorphism">
      <view class="ribbon">新需求</view>
      <view class="content">
        <view class="product-info">
          <image src="/static/product.jpg" class="product-image" />
          <view class="text-info">
            <text class="product-name">工业级温湿度传感器</text>
            <text class="spec">规格: 高精度防水款</text>
          </view>
        </view>
        
        <view class="details-grid">
          <view class="detail-item">
            <uni-icons type="calendar" size="20" color="#6366f1" />
            <text>需求交期: 2023-08-30</text>
          </view>
          <view class="detail-item">
            <uni-icons type="shop" size="20" color="#ec4899" />
            <text>采购数量: 500件</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 报价表单 -->
    <view class="quote-form glassmorphism">
      <view class="form-header">
        <text class="section-title">填写报价单</text>
        <view class="decor-line"></view>
      </view>

      <view class="input-group">
        <view class="input-item">
          <text class="input-label">单价 (¥)</text>
          <input 
            class="stylish-input"
            type="number"
            placeholder="0.00"
            v-model="quote.price"
          />
        </view>

        <view class="input-item">
          <text class="input-label">有效期至</text>
          <uni-datetime-picker 
            class="stylish-picker"
            type="date" 
            v-model="quote.expireDate"
          />
        </view>
      </view>

      <view class="action-buttons">
        <button class="gradient-btn secondary">
          <uni-icons type="star" />收藏
        </button>
        <button class="gradient-btn primary">
          <uni-icons type="checkmark" />提交报价
        </button>
      </view>
    </view>

    <!-- 历史报价 -->
    <view class="history-section">
      <view class="section-header">
        <text>历史报价记录</text>
        <uni-icons type="arrowright" />
      </view>
      <view class="history-card glassmorphism">
        <view class="quote-item" v-for="item in 3" :key="item">
          <view class="meta">
            <text class="date">2023-08-{{ 10 + item }}</text>
            <text class="status approved">已采纳</text>
          </view>
          <text class="price">¥ 45.80</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      quote: {
        price: '',
        expireDate: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 基础样式 */
.page-container {
  background: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 30rpx;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 0;
  
  .title {
    font-size: 38rpx;
    font-weight: 700;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

/* 玻璃拟态效果 */
.glassmorphism {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 24rpx;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

/* 需求卡片 */
.demand-card {
  position: relative;
  padding: 30rpx;
  margin-bottom: 30rpx;
  overflow: hidden;

  .ribbon {
    position: absolute;
    top: 15rpx;
    right: -60rpx;
    background: var(--secondary-gradient);
    color: white;
    padding: 8rpx 60rpx;
    transform: rotate(45deg);
    font-size: 24rpx;
  }

  .product-info {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;

    .product-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 16rpx;
      margin-right: 20rpx;
    }

    .product-name {
      font-size: 32rpx;
      font-weight: 600;
      color: #1e293b;
    }

    .spec {
      color: #64748b;
      font-size: 26rpx;
    }
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;

    .detail-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: rgba(241, 245, 249, 0.6);
      border-radius: 12rpx;

      text {
        margin-left: 12rpx;
        color: #475569;
      }
    }
  }
}

/* 报价表单 */
.quote-form {
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;

  .form-header {
    margin-bottom: 40rpx;
    
    .section-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1e293b;
    }

    .decor-line {
      width: 60rpx;
      height: 4rpx;
      background: var(--primary-gradient);
      margin-top: 16rpx;
    }
  }

  .input-group {
    .input-item {
      margin-bottom: 40rpx;

      .input-label {
        display: block;
        color: #64748b;
        margin-bottom: 16rpx;
        font-weight: 500;
      }

      .stylish-input {
        width: 100%;
        padding: 24rpx;
        background: rgba(241, 245, 249, 0.6);
        border-radius: 12rpx;
        font-size: 32rpx;
        color: #1e293b;
        transition: all 0.3s;

        &:focus {
          box-shadow: 0 0 0 2px #818cf8;
        }
      }

      .stylish-picker {
        /deep/ .uni-date__x-input {
          padding: 24rpx !important;
          background: rgba(241, 245, 249, 0.6) !important;
          border-radius: 12rpx !important;
        }
      }
    }
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 20rpx;
    margin-top: 40rpx;

    .gradient-btn {
      border: none;
      color: white;
      border-radius: 12rpx;
      padding: 24rpx;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;

      uni-icons {
        margin-right: 12rpx;
      }

      &.primary {
        background: var(--primary-gradient);
      }

      &.secondary {
        background: var(--secondary-gradient);
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}

/* 历史报价 */
.history-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    color: #64748b;
  }

  .history-card {
    padding: 30rpx;

    .quote-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1px solid rgba(226, 232, 240, 0.6);

      &:last-child {
        border-bottom: none;
      }

      .meta {
        .date {
          color: #64748b;
          font-size: 26rpx;
        }

        .status {
          font-size: 24rpx;
          padding: 4rpx 12rpx;
          border-radius: 6rpx;

          &.approved {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }
        }
      }

      .price {
        font-size: 32rpx;
        font-weight: 600;
        color: #1e293b;
      }
    }
  }
}
</style>
