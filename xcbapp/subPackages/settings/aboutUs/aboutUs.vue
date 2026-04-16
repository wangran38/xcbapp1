<template>
  <view class="about-page">
    <!-- 顶部卡片 -->
    <view class="card-top">
      <view class="logo-box">
        <image src="/static/logo.png" class="logo" mode="widthFix"></image>
      </view>
      <text class="app-name">农链天下</text>
      <text class="app-desc">农产品交易服务平台</text>
    </view>

    <!-- 信息卡片 -->
    <view class="card-info">
      <view class="info-item">
        <text class="label">版本号</text>
        <text class="value">V1.0.0</text>
      </view>
      <view class="info-item">
        <text class="label">开发公司</text>
        <text class="value">海南积分宝电子商务有限公司</text>
      </view>
      <view class="info-item">
        <text class="label">客服热线</text>
        <text class="value">68552337</text>
      </view>
      <view class="info-item">
        <text class="label">联系邮箱</text>
        <text class="value">13707081816@163.com</text>
      </view>
    </view>

    <!-- 协议入口（高级可点击） -->
    <view class="agreement-box">
      <view class="agreement-item" @click="goPrivacy">
        <view class="left">
          <text class="icon-text">🔒</text>
          <text class="title">隐私政策</text>
        </view>
        <text class="arrow">></text>
      </view>

      <view class="agreement-item" @click="goService">
        <view class="left">
          <text class="icon-text">📜</text>
          <text class="title">服务协议</text>
        </view>
        <text class="arrow">></text>
      </view>
    </view>

    <!-- 底部说明 -->
    <view class="footer">
      <text class="copyright">© 2026 海南积分宝电子商务公司 版权所有</text>
    </view>
  </view>
</template>


<style scoped>
/* 页面整体 */
.about-page {
  padding: 20rpx;
  background-color: #f7f8fa;
  min-height: 100vh;
}

/* 顶部卡片 */
.card-top {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 30rpx;
}

.logo-box {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto 30rpx;
}

.logo {
  width: 100%;
  height: 100%;
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #222;
}

.app-desc {
  font-size: 26rpx;
  color: #999;
  margin-top: 16rpx;
}

/* 信息卡片 */
.card-info {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f2f2f2;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 协议入口 */
.agreement-box {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.agreement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.agreement-item:active {
  background: #f7f7f7;
}

.left {
  display: flex;
  align-items: center;
}

.icon-text {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.title {
  font-size: 30rpx;
  color: #333;
}

.arrow {
  font-size: 32rpx;
  color: #ccc;
}

/* 底部 */
.footer {
  text-align: center;
  padding: 60rpx 0 30rpx;
}

.copyright {
  font-size: 24rpx;
  color: #bbb;
}
</style>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 跳转隐私政策
    goPrivacy() {
      uni.navigateTo({
        url: "/pages/privacyAgreement/privacyAgreement"
      });
    },
    // 跳转服务协议
    goService() {
      uni.navigateTo({
        url: "/pages/userServiceAgreement/userServiceAgreement"
      });
    }
  }
};
</script>

