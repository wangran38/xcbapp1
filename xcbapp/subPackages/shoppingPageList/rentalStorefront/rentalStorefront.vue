<template>
  <view class="rental-page">
    <swiper class="swiper" autoplay circular>
      <swiper-item v-for="(img, index) in shop.images" :key="index">
        <image :src="img" mode="aspectFill" class="swiper-img" />
      </swiper-item>
    </swiper>

    <view class="core-info">
      <view class="price-section">
        <text class="price">¥{{ shop.rent }}/月</text>
        <text class="area">{{ shop.area }}㎡</text>
      </view>
      <view class="meta-info">
        <text class="location">
          <uni-icons type="location" size="16" color="#666"/>
          {{ shop.address }}
        </text>
        <text class="type">{{ shop.type }}</text>
      </view>
    </view>

    <uni-section title="房源信息" type="line">
      <view class="detail-grid">
        <view class="grid-item">
          <text class="label">层高</text>
          <text class="value">{{ shop.height }}m</text>
        </view>
        <view class="grid-item">
          <text class="label">面宽</text>
          <text class="value">{{ shop.width }}m</text>
        </view>
        <view class="grid-item">
          <text class="label">物业费</text>
          <text class="value">¥{{ shop.managementFee }}/月</text>
        </view>
        <view class="grid-item">
          <text class="label">免租期</text>
          <text class="value">{{ shop.freeRentPeriod }}天</text>
        </view>
      </view>
    </uni-section>

    <!-- 全景看房 -->
<!--    <uni-section title="全景看房" type="line">
      <view class="panorama-box">
        <image 
          src="/static/panorama_cover.jpg" 
          mode="aspectFill"
          class="panorama-img"
          @click="handleViewPanorama"
        />
        <text class="panorama-tip">点击查看360°全景</text>
      </view>
    </uni-section> -->

    <uni-section title="位置信息" type="line">
      <map 
        style="width: 100%; height: 300rpx;"
        show-location
      ></map>
    </uni-section>

    <view class="booking-form">
      <uni-section title="预约看房" type="line"></uni-section>
      <uni-forms :modelValue="formData">
        <uni-forms-item label="您的姓名" required label-width="80">
          <uni-easyinput v-model="formData.name" placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item label="联系电话" required label-width="80">
          <uni-easyinput 
            v-model="formData.phone" 
            type="number" 
            placeholder="请输入手机号"
          />
        </uni-forms-item>
        <uni-forms-item label="预约时间" required label-width="80">
          <uni-datetime-picker
            type="datetime"
            v-model="formData.time"
          />
        </uni-forms-item>
      </uni-forms>
    </view>

    <view class="footer-bar">
      <button class="contact-btn" @tap="handleCall">
        <uni-icons type="phone" size="20" color="#fff"/>
        立即联系
      </button>
      <button class="booking-btn" @tap="handleSubmit">
        提交预约
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      shop: {
        id: 'SH2023',
        rent: 15000,
        area: 120,
        address: '岳松路88号',
        type: '临街商铺',
        height: 5.8,
        width: 8,
        managementFee: 3.5,
        freeRentPeriod: 30,
        images: [
          'https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
          'https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067'
        ],
        location: {
          latitude: 39.90923,
          longitude: 116.42843
        }
      },
      formData: {
        name: '',
        phone: '',
        time: ''
      },
      markers: [{
        id: 1,
        latitude: 39.90923,
        longitude: 116.42843,
        iconPath: 'https://img1.baidu.com/it/u=819157245,3100371643&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
        width: 30,
        height: 30
      }]
    }
  },
  methods: {
    handleViewPanorama() {
      uni.navigateTo({
        url: '/pages/panorama/index?id=SH2023'
      })
    },
    handleCall() {
      uni.makePhoneCall({
        phoneNumber: '400-1234-5678'
      })
    },
    async handleSubmit() {
      // 表单验证
      if (!this.formData.name || !this.formData.phone) {
        return uni.showToast({ title: '请填写完整信息', icon: 'none' })
      }

      // 提交预约
      uni.showLoading({ title: '提交中...' })
      try {
        await this.$http.post('/booking', {
          shopId: this.shop.id,
          ...this.formData
        })
        uni.showToast({ title: '预约成功' })
        this.formData = { name: '', phone: '', time: '' }
      } catch (e) {
        uni.showToast({ title: '提交失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rental-page {
  padding-bottom: 120rpx;

  .swiper {
    height: 500rpx;
    
    &-img {
      width: 100%;
      height: 100%;
    }
  }

  .core-info {
    padding: 30rpx;
    background: #fff;
    
    .price-section {
      display: flex;
      align-items: baseline;
      margin-bottom: 20rpx;
      
      .price {
        color: #e4393c;
        font-size: 48rpx;
        font-weight: bold;
        margin-right: 20rpx;
      }
      
      .area {
        color: #666;
        font-size: 32rpx;
      }
    }

    .meta-info {
      display: flex;
      justify-content: space-between;
      color: #666;
      
      .location {
        flex: 1;
      }
    }
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30rpx;
    padding: 20rpx;
    
    .grid-item {
      background: #f8f8f8;
      border-radius: 8rpx;
      padding: 20rpx;
      
      .label {
        color: #999;
        font-size: 24rpx;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .value {
        font-size: 32rpx;
        font-weight: 500;
      }
    }
  }

  .panorama-box {
    position: relative;
    height: 400rpx;
    border-radius: 8rpx;
    overflow: hidden;
    
    &-img {
      width: 100%;
      height: 100%;
    }
    
    &-tip {
      position: absolute;
      bottom: 20rpx;
      right: 20rpx;
      color: #fff;
      background: rgba(0,0,0,0.5);
      padding: 8rpx 20rpx;
      border-radius: 40rpx;
    }
  }

  .booking-form {
    background: #fff;
    margin-top: 30rpx;
    padding: 20rpx;
  }

  .footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    display: flex;
    background: #fff;
    box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.1);
    
    button {
      flex: 1;
      height: 100%;
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      
      &.contact-btn {
        background: #333;
        color: #fff;
      }
      
      &.booking-btn {
        background: #e4393c;
        color: #fff;
      }
    }
  }
}
</style>
