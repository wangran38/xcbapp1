<template>
  <view class="container">
    <view class="product-card">
      <text class="title">{{ product.goodsname }}</text>
      <view class="price-info">
        <text class="deposit">单价：¥{{ product.presaleprice }}</text>
      </view>
    </view>

    <view class="form-item">
      <text class="label">购买数量</text>
      <view class="number-selector">
        <button 
          class="btn minus" 
          :class="{ disabled: quantity <= 1 }"
          @click="changeQuantity(-1)"
        >-</button>
        <input 
          class="input" 
          type="number" 
          :value="quantity"
          @input="handleInput"
          :min="1"
          :max="99"
        />
        <button 
          class="btn plus" 
          :class="{ disabled: quantity >= 99 }"
          @click="changeQuantity(1)"
        >+</button>
		<text style="font-size: 35rpx; position: absolute; right: 60rpx;">{{product.unit}}</text>
      </view>
    </view>

    <view class="form-item">
      <text class="label">选择提货点</text>
	  <view style="font-weight: bold; font-size: 25rpx;">{{deliveryPoints.length<=0? '暂无数据':''}}</view>
      <scroll-view scroll-y class="delivery-list">
        <view 
          v-for="point in deliveryPoints"
          :key="point.id"
          class="delivery-item"
          :class="{ active: selectedPoint === point.id }"
          @click="selectPoint(point.id)"
        >
          <view class="point-info">
            <text class="name">{{ point.name }}</text>
            <text class="address">{{ point.address }}</text>
          </view>
          <view class="distance">
            <text>{{ point.distance }}km</text>
            <uni-icons 
              v-if="selectedPoint === point.id"
              type="checkmarkempty" 
              color="#07c160"
              size="20"
            />
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="form-item">
      <text class="label">预售规则</text>
      <view class="rules">
        <view v-for="(rule,index) in shortRules" :key="index" class="rule-item">
          {{ index + 1 }}. {{ rule }}
        </view>
        <text class="view-detail" @click="showRulesPopup = true">查看完整规则 ></text>
      </view>
    </view>

    <view class="footer">
      <view class="total">
        <text>应付定金：</text>
        <text class="price">¥{{ totalDeposit }}</text>
      </view>
      <button 
        class="submit-btn"
        :class="{ disabled: !formValid }"
        @click="handleSubmit"
      >
        {{ formValid ? '支付定金' : '请完善信息' }}
      </button>
    </view>

    <uni-popup ref="popup" type="bottom">
      <view class="rules-popup">
        <view class="popup-header">
          <text>完整预售规则</text>
          <uni-icons type="close" size="24" @click="showRulesPopup = false"/>
        </view>
        <scroll-view scroll-y class="rules-content">
          <view v-for="(rule,index) in fullRules" :key="index" class="rule-item">
            {{ index + 1 }}. {{ rule }}
          </view>
        </scroll-view>
      </view>
    </uni-popup>
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
      showRulesPopup: false,
      deliveryPoints: [
        // {
        //   id: 1,
        //   name: "绿鲜社区店",
        //   address: "朝阳区光华路8号",
        //   distance: 1.2
        // },
        // {
        //   id: 2,
        //   name: "智慧生活超市",
        //   address: "海淀区中关村大街12号",
        //   distance: 2.5
        // }
      ],
      shortRules: [
        "定金支付后不可退换"
      ],
      fullRules: [
        "定金用于锁定商品购买资格，支付后不可退换",
        "每周二18:00前可在小程序修改提货点和配送时间",
        "尾款需在商品到货后3日内完成支付",
        "逾期未付尾款视为自动放弃，定金不予退还",
        "商品价格波动不影响已支付定金订单",
        "最终商品以实际到货为准，保持合理误差"
      ]
    }
  },
  onLoad({query}) {
  	this.product =  JSON.parse(query)
  },
  computed: {
    totalDeposit() {
      return (this.product.presaleprice * this.quantity /3).toFixed(2)
    },
    formValid() {
      return this.selectedPoint !== null && this.quantity >= 1
    }
  },
  methods: {
    changeQuantity(step) {
      this.quantity = Math.max(1, Math.min(99, this.quantity + step))
    },
    handleInput(e) {
      let val = parseInt(e.detail.value) || 1
      this.quantity = Math.max(1, Math.min(99, val))
    },
    selectPoint(id) {
      this.selectedPoint = this.selectedPoint === id ? null : id
    },
    handleSubmit() {
      if (!this.formValid) {
        uni.showToast({
          title: '请选择提货点',
          icon: 'none'
        })
        return
      }

      uni.showLoading({ title: '提交中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.navigateTo({
          url: '/pages/order/result?status=success'
        })
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 24rpx;
  min-height: 100vh;
  background: #f8f8f8;
}

.product-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }

  .price-info {
    .deposit {
      color: #e4393c;
      font-size: 36rpx;
      margin-right: 16rpx;
    }
    .final {
      color: #999;
      font-size: 24rpx;
    }
  }
}

.form-item {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border-radius: 16rpx;

  .label {
    font-size: 30rpx;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
}

.number-selector {
  display: flex;
  align-items: center;
  
  .btn {
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 8rpx;
    background: #f0f0f0;
    font-size: 36rpx;
    
    &.disabled {
      opacity: 0.5;
    }
    
    &.plus {
      color: #07c160;
    }
  }
  
  .input {
    width: 100rpx;
    height: 64rpx;
    margin: 0 20rpx;
    text-align: center;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    font-size: 32rpx;
  }
}

.delivery-list {
  max-height: 500rpx;
  
  .delivery-item {
    padding: 24rpx;
    margin: 12rpx 0;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    display: flex;
    justify-content: space-between;
    
    &.active {
      border-color: #07c160;
      background: #f8fff8;
    }

    .name {
      font-size: 28rpx;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .address {
      color: #666;
      font-size: 24rpx;
    }
    
    .distance {
      color: #666;
      display: flex;
      align-items: center;
    }
  }
}

.rules {
  .rule-item {
    color: #666;
    font-size: 26rpx;
    line-height: 1.6;
    margin-bottom: 12rpx;
  }
  
  .view-detail {
    color: #07c160;
    margin-top: 16rpx;
    display: block;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.05);

  .total {
    .price {
      color: #e4393c;
      font-size: 36rpx;
      font-weight: bold;
    }
  }

  .submit-btn {
    background-color: #007aff;
    color: white;
    width: 300rpx;
    border-radius: 50rpx;
    font-size: 30rpx;
    
    &.disabled {
      background: #ccc;
    }
  }
}

.rules-popup {
  background: #fff;
  padding: 40rpx;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 70vh;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
    font-size: 32rpx;
    font-weight: 500;
  }

  .rules-content {
    max-height: 60vh;
    
    .rule-item {
      color: #666;
      font-size: 28rpx;
      line-height: 1.6;
      margin-bottom: 24rpx;
    }
  }
}
</style>
