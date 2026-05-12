<template>
  <view class="monitor-page">
    <!-- 农户信息 -->
    <view class="info-card">
      <view class="card-title">
        <uni-icons type="video" size="22" color="#00C26E" />
        <text>菜园实时监控</text>
      </view>
      <view class="info-item">
        <uni-icons type="person" size="18" color="#3A7AFE" />
        <text class="label">农户：</text>
        <text>{{ merchantInfo.farmersname }}</text>
      </view>
      <view class="info-item">
        <uni-icons type="location" size="18" color="#3A7AFE" />
        <text class="label">地址：</text>
        <text>{{ merchantInfo.address }}</text>
      </view>
    </view>

    <!-- 视频监控 -->
    <view class="video-card">
      <view class="video-container">
        <view class="video-placeholder" v-if="!videoUrl">
          <uni-icons type="play" size="50" color="#fff" />
          <text>监控直播加载中...</text>
        </view>
      </view>
      <view class="status-bar">
        <view class="status live">
          <view class="dot"></view>
          <text>实时直播中</text>
        </view>
        <view class="status">
          <uni-icons type="refresh" size="16" />
          <text>画面更新：实时</text>
        </view>
      </view>
    </view>

    <!-- 农产品溯源信息 -->
    <view class="trace-card">
      <view class="card-title">
        <uni-icons type="qr" size="22" color="#3A7AFE" />
        <text>农产品溯源信息</text>
      </view>
      <view class="trace-item">
        <view class="trace-label">种子来源</view>
        <view class="trace-value">本地良种培育基地采购</view>
      </view>
      <view class="trace-item">
        <view class="trace-label">所用农药</view>
        <view class="trace-value">生物低毒除菌剂，无高残留农药</view>
      </view>
      <view class="trace-item">
        <view class="trace-label">施肥用料</view>
        <view class="trace-value">农家腐熟有机肥、生态菌肥</view>
      </view>
      <view class="trace-item">
        <view class="trace-label">灌溉水源</view>
        <view class="trace-value">深层山泉水，无污染水源</view>
      </view>
      <view class="trace-item">
        <view class="trace-label">农残检测</view>
        <view class="trace-value green">检测合格 农残未超标</view>
      </view>
    </view>

    <!-- 本店相关菜品 -->
    <view class="goods-section">
      <view class="section-header">
        <text class="title">本店其他菜品</text>
        <text class="sub-title">同菜园直供</text>
      </view>
      <scroll-view scroll-x class="goods-scroll">
        <view class="goods-item" v-for="(item, index) in shopGoodsList" :key="index">
          <image :src="'../static/logo.png'" class="goods-img" mode="aspectFill"></image>
          <view class="goods-name">{{ item.goodsname }}</view>
          <view class="goods-price">¥{{ item.price }}</view>
        </view>
      </scroll-view>
    </view>
    <!-- <view class="desc-card">
      <view class="desc-title">监控说明</view>
      <view class="desc-item">
        <uni-icons type="checkmarkempty" size="18" color="#00C26E" />
        <text>24小时不间断直播，无剪辑无滤镜</text>
      </view>
      <view class="desc-item">
        <uni-icons type="checkmarkempty" size="18" color="#00C26E" />
        <text>真实菜园环境，看得见的新鲜安全</text>
      </view>
      <view class="desc-item">
        <uni-icons type="checkmarkempty" size="18" color="#00C26E" />
        <text>支持随时观看，放心购买绿色农产品</text>
      </view>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      merchantInfo: {},
      videoUrl: '',
      // 当前农户【本店模拟菜品数据】
      shopGoodsList: [
        {
          goodsname: '露天青生菜',
          price: '3.8',
          imglogo: 'https://img1.baidu.com/it/u=123123123,123123123&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        },
        {
          goodsname: '农家小菠菜',
          price: '4.5',
          imglogo: 'https://img0.baidu.com/it/u=234234234,234234234&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        },
        {
          goodsname: '生态油麦菜',
          price: '4.2',
          imglogo: 'https://img2.baidu.com/it/u=345345345,345345345&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        },
        {
          goodsname: '本地空心菜',
          price: '2.9',
          imglogo: 'https://img1.baidu.com/it/u=456456456,456456456&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        },
        {
          goodsname: '无公害小白菜',
          price: '3.2',
          imglogo: 'https://img0.baidu.com/it/u=567567567,567567567&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        }
      ]
    }
  },
  onLoad({ query }) {
    try {
      this.merchantInfo = JSON.parse(query)
    } catch (e) {
      console.error('参数解析失败', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor-page {
  background: #f7f8fa;
  min-height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
}

/* 信息卡片 */
.info-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);

  .card-title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }

  .info-item {
    display: flex;
    align-items: center;
    padding: 16rpx 0;
    font-size: 28rpx;
    color: #333;
  }
}

/* 视频卡片 */
.video-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.video-container {
  width: 100%;
  height: 400rpx;
  background: #000;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  gap: 20rpx;
  font-size: 28rpx;
}

.status-bar {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #666;
}

.status {
  display: flex;
  align-items: center;
  gap: 8rpx;

  &.live {
    color: #ff3b30;
    font-weight: 500;
  }
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: #ff3b30;
  border-radius: 50%;
  animation: breath 1.5s infinite alternate;
}

@keyframes breath {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

/* 溯源信息样式 */
.trace-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);

  .card-title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }

  .trace-item {
    display: flex;
    justify-content: space-between;
    padding: 18rpx 0;
    border-bottom: 1rpx solid #f2f3f5;

    &:last-child {
      border-bottom: none;
    }

    .trace-label {
      font-size: 26rpx;
      color: #666;
    }

    .trace-value {
      font-size: 26rpx;
      color: #333;
      font-weight: 500;
      max-width: 60%;
      text-align: right;

      &.green {
        color: #00C26E;
      }
    }
  }
}

/* 本店菜品横向滚动 */
.goods-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);

  .section-header {
    margin-bottom: 20rpx;

    .title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .sub-title {
      font-size: 24rpx;
      color: #999;
      margin-left: 10rpx;
    }
  }

  .goods-scroll {
    white-space: nowrap;
  }

  .goods-item {
    display: inline-block;
    width: 180rpx;
    margin-right: 20rpx;

    .goods-img {
      width: 180rpx;
      height: 180rpx;
      border-radius: 16rpx;
    }

    .goods-name {
      font-size: 24rpx;
      color: #333;
      margin-top: 10rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .goods-price {
      font-size: 26rpx;
      color: #ff3b30;
      font-weight: bold;
      margin-top: 6rpx;
    }
  }
}

/* 说明卡片 */
.desc-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);

  .desc-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
  }

  .desc-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 26rpx;
    color: #666;
    margin-bottom: 16rpx;
  }
}
</style>