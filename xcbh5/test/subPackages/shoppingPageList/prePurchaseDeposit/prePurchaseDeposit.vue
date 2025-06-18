<template>
  <view class="container">
    <!-- 商品主图卡片 -->
    <view class="product-card">
      <image 
        class="product-image" 
        :src="product.imglogo" 
        mode="aspectFill"
      ></image>
      <view class="product-info">
        <text class="product-name">{{ product.goodsname }}</text>
        <text class="product-tag">预售商品</text>
        <view class="product-price-row">
          <text class="product-price">¥{{ product.price }}</text>
          <text class="product-unit">{{ product.unit }}</text>
        </view>
        <text class="product-stock">库存: {{ product.stock || '充足' }}</text>
      </view>
    </view>

    <!-- 购买区域卡片 -->
    <view class="purchase-card">
      <view class="form-group quantity-group">
        <text class="form-label">购买数量</text>
        <view class="quantity-selector">
          <button 
            class="quantity-btn minus" 
            :class="{'disabled': quantity <= 1}"
            @click="changeQuantity(-1)"
            :disabled="quantity <= 1"
          >-</button>
          <input 
            class="quantity-input" 
            type="number" 
            :value="quantity"
            @input="handleInput"
            :min="1"
            :max="99"
            placeholder="请输入数量"
          />
          <button 
            class="quantity-btn plus" 
            :class="{'disabled': quantity >= 99}"
            @click="changeQuantity(1)"
            :disabled="quantity >= 99"
          >+</button>
        </view>
      </view>

      <view class="form-group pickup-group">
        <text class="form-label">提货点</text>
        <view class="pickup-list">
          <view 
            v-for="(point, index) in deliveryPoints"
            :key="index"
            class="pickup-item"
            :class="{'selected': selectedPoint === point.id}"
            @click="selectPoint(point.id)"
          >
            <view class="point-info">
              <text class="point-name">{{ point.name }}</text>
              <text class="point-address">{{ point.address }}</text>
            </view>
            <view class="pickup-check" v-if="selectedPoint === point.id">
              <uni-icons type="check" size="24" />
            </view>
          </view>
          <view v-if="!deliveryPoints.length" class="no-point">暂无可用提货点</view>
        </view>
      </view>
    </view>

    <!-- 规则说明卡片 -->
    <view class="rules-card">
      <text class="section-title">预售规则</text>
      <view class="rules-list">
        <view v-for="(rule, index) in shortRules" :key="index" class="rule-item">
          <text class="rule-text">{{ index + 1 }}. {{ rule }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer">
      <view class="total-info">
        <text class="total-label">总计：</text>
        <text class="total-amount">¥{{ totalAmount }}</text>
      </view>
      <button 
        class="submit-btn"
        :class="{'disabled': !formValid}"
        @click="handleSubmit"
        :disabled="!formValid"
      >
        {{ formValid ? '立即预订' : '请完善信息' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      product: {
      },
      quantity: 1,
      selectedPoint: null,
      deliveryPoints: [
        // { id: 1, name: '绿鲜社区店', address: '朝阳区光华路8号' },
        // { id: 2, name: '智慧生活超市', address: '海淀区中关村大街12号' },
        // { id: 3, name: '生鲜便利店', address: '西城区西单北大街109号' }
      ],
      shortRules: [
        '定金支付后不可退换',
        // '提货时需出示订单二维码',
        // '预售商品到货后统一配送'
      ]
    }
  },
  onLoad({query}) {
  	this.product = JSON.parse(query)
	console.log(this.product.pickaddress)
	this.deliveryPoints = [{id:1,name:this.product.pickaddress,address:this.product.pickaddress}]
  },
  computed: {
    totalAmount() {
      return (this.product.presaleprice * this.quantity).toFixed(2);
    },
    formValid() {
      return this.selectedPoint !== null && this.quantity >= 1;
    }
  },
  methods: {
    changeQuantity(step) {
      this.quantity = Math.max(1, Math.min(99, this.quantity + step));
    },
    handleInput(e) {
      const val = parseInt(e.detail.value) || 1;
      this.quantity = Math.max(1, Math.min(99, val));
    },
    selectPoint(id) {
      this.selectedPoint = id;
    },
    handleSubmit() {
      if (!this.formValid) {
        uni.showToast({
          title: '请确认提货点和数量',
          icon: 'none'
        });
        return;
      }
      uni.showToast({
        title: '预订成功',
        icon: 'success'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
/* 基础布局 */
.container {
  padding: 30rpx;
  background-color: #f5f5f5;
}

/* 商品主图卡片 */
.product-card {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08);
  margin-bottom: 30rpx;
  position: relative;
  
  .product-image {
    width: 100%;
    height: 400rpx;
  }
  
  .product-info {
    padding: 30rpx;
    
    .product-name {
      font-size: 36rpx;
      font-weight: 700;
      color: #333;
      margin-bottom: 15rpx;
      display: block;
    }
    
    .product-tag {
      display: inline-block;
      background-color: #ff4d4f;
      color: #fff;
      font-size: 24rpx;
      padding: 4rpx 12rpx;
      border-radius: 4rpx;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .product-price-row {
      display: flex;
      align-items: baseline;
      margin-bottom: 15rpx;
      
      .product-price {
        color: #ff4d4f;
        font-size: 56rpx;
        font-weight: 800;
        margin-right: 10rpx;
      }
      
      .product-unit {
        color: #666;
        font-size: 28rpx;
      }
    }
    
    .product-stock {
      color: #07c160;
      font-size: 28rpx;
      font-weight: 500;
    }
  }
}

/* 购买区域卡片 */
.purchase-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08);
  margin-bottom: 30rpx;
  
  .form-group {
    margin-bottom: 30rpx;
    
    .form-label {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 20rpx;
      display: block;
      position: relative;
      padding-left: 15rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 26rpx;
        background-color: #007aff;
        border-radius: 3rpx;
      }
    }
  }
  
  /* 数量选择器强化设计 */
  .quantity-group {
    .quantity-selector {
      display: flex;
      align-items: center;
      border: 3rpx solid #e5e5e5;
      border-radius: 12rpx;
      overflow: hidden;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
      
      .quantity-btn {
        width: 110rpx;
        height: 110rpx;
        line-height: 110rpx;
        font-size: 52rpx;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f9f9f9;
        transition: all 0.2s;
        
        &.minus {
          color: #ff5252;
        }
        
        &.plus {
          color: #07c160;
        }
        
        &.disabled {
          color: #ccc;
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        
        &:active {
          background-color: #f0f0f0;
        }
      }
      
      .quantity-input {
        flex: 1;
        height: 110rpx;
        text-align: center;
        font-size: 44rpx;
        color: #333;
        border: none;
        outline: none;
        background-color: #fff;
      }
    }
  }
  
  /* 自提点强化设计 */
  .pickup-group {
    .pickup-list {
      .pickup-item {
        padding: 25rpx 0;
        border-bottom: 1rpx solid #f5f5f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        transition: all 0.3s;
        
        &:last-child {
          border-bottom: none;
        }
        
        &.selected {
          &::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 8rpx;
            height: 40rpx;
            background-color: #07c160;
            border-radius: 4rpx;
          }
        }
        
        .point-info {
          .point-name {
            font-size: 32rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 5rpx;
          }
          
          .point-address {
            font-size: 28rpx;
            color: #666;
          }
        }
        
        .pickup-check {
          color: #07c160;
          font-size: 32rpx;
        }
      }
      
      .no-point {
        padding: 25rpx 0;
        font-size: 28rpx;
        color: #999;
        text-align: center;
      }
    }
  }
}

/* 规则说明卡片 */
.rules-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08);
  margin-bottom: 120rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 25rpx;
    padding-left: 15rpx;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 26rpx;
      background-color: #007aff;
      border-radius: 3rpx;
    }
  }
  
  .rules-list {
    .rule-item {
      margin-bottom: 20rpx;
      
      .rule-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}

/* 底部操作栏 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.05);
  z-index: 10;
  
  .total-info {
    flex: 1;
    
    .total-label {
      font-size: 32rpx;
      color: #333;
    }
    
    .total-amount {
      color: #ff4d4f;
      font-size: 40rpx;
      font-weight: bold;
      margin-left: 10rpx;
    }
  }
  
  .submit-btn {
    background-color: #ff4d4f;
    color: #fff;
    width: 300rpx;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 34rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 16rpx rgba(255,77,79,0.3);
    
    &.disabled {
      background-color: #ccc;
      box-shadow: none;
      cursor: not-allowed;
    }
  }
}
</style>