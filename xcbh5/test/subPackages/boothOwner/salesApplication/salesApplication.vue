<template>
  <view class="container">
    <!-- 头部统计 -->
    <view class="header-card">
      <view class="stat-item">
        <text class="stat-number">12</text>
        <text class="stat-label">今日申请</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-number">3</text>
        <text class="stat-label">待处理</text>
      </view>
    </view>

    <!-- 申请列表 -->
    <scroll-view scroll-y class="list-container">
      <view v-for="(item, index) in applicationList" :key="index" class="application-card">
        <!-- 农户信息 -->
        <view class="user-info">
          <view class="user-detail">
            <text class="user-name">{{item.farmerName}}</text>
            <text class="user-address">{{item.farmAddress}}</text>
          </view>
          <view :class="['status-tag', statusClass(item.status)]">
            {{item.status | statusText}}
          </view>
        </view>

        <!-- 产品信息 -->
        <view class="product-info">
          <view class="info-row">
            <text class="info-label">产品名称：</text>
            <text class="info-value">{{item.productName}}</text>
          </view>
          <view class="info-row">
            <text class="info-label">库存：</text>
            <text class="info-value">{{item.yield}}公斤</text>
          </view>
          <view class="info-row">
            <text class="info-label">期望单价：</text>
            <text class="info-value">￥{{item.price}}/公斤</text>
          </view>
          <view class="info-row">
            <text class="info-label">配送方式：</text>
            <text class="info-value">{{item.deliveryType}}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons" v-if="item.status === 0">
          <button class="btn reject-btn" @click="handleReject(item.id)">拒绝申请</button>
          <button class="btn accept-btn" @click="handleAccept(item.id)">同意代销</button>
        </view>

        <!-- 申请时间 -->
        <text class="apply-time">申请时间：{{item.applyTime}}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      applicationList: [
        {
          id: 1,
          farmerName: "王启俊",
          farmAddress: "海南省定安县雷鸣镇",
          productName: "黑猪肉粽子",
          yield: 150,
          price: 5.8,
          deliveryType: "农户自配送",
          applyTime: "2023-08-20 09:30",
          status: 0, // 0待处理 1已同意 2已拒绝
          avatar: "/static/avatar1.png"
        },
        // 更多模拟数据...
      ]
    };
  },
  filters: {
    statusText(value) {
      const statusMap = {0: '待处理', 1: '已同意', 2: '已拒绝'}
      return statusMap[value] || '未知状态'
    }
  },
  methods: {
    statusClass(status) {
      return {
        'status-pending': status === 0,
        'status-approved': status === 1,
        'status-rejected': status === 2
      }
    },
    handleAccept(id) {
      uni.showModal({
        title: '确认操作',
        content: '确定同意该代销申请吗？',
        success: (res) => {
          if (res.confirm) {
            // 调用同意API
          }
        }
      })
    },
    handleReject(id) {
      uni.showModal({
        title: '确认操作',
        content: '确定拒绝该代销申请吗？',
		confirmColor:'red',
        success: (res) => {
          if (res.confirm) {
            // 调用拒绝API
          }
        }
      })
    }
  }
};
</script>

<style scoped>
/* 整体容器 */
.container {
  padding: 30rpx;
  background: #f8f9fb;
  min-height: 100vh;
}

/* 头部统计卡片 */
.header-card {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
  margin-bottom: 40rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 44rpx;
  font-weight: 600;
  color: #2c3e50;
}

.stat-label {
  font-size: 24rpx;
  color: #95a5a6;
  margin-top: 12rpx;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: #e8eef3;
}

/* 申请卡片样式 */
.application-card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  position: relative;
}

.user-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.user-detail {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 32rpx;
  font-weight: 500;
  color: #2c3e50;
}

.user-address {
  font-size: 24rpx;
  color: #95a5a6;
}

.status-tag {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8rpx 24rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
}

.status-pending {
  background: #fff4e5;
  color: #f39c12;
}

.status-approved {
  background: #e3f8ff;
  color: #3498db;
}

.status-rejected {
  background: #ffeef0;
  color: #e74c3c;
}

/* 产品信息 */
.product-info {
  border-top: 2rpx solid #f1f3f6;
  padding-top: 24rpx;
  margin-bottom: 32rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.info-label {
  color: #7f8c8d;
  font-size: 28rpx;
}

.info-value {
  color: #34495e;
  font-weight: 500;
  font-size: 28rpx;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 30rpx;
  margin-top: 40rpx;
}

.btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  transition: all 0.3s;
}

.reject-btn {
  background: #fff0f1;
  color: #e74c3c;
  border: 2rpx solid #ffd5d7;
}

.accept-btn {
  background: #e8f9f4;
  color: #2ecc71;
  border: 2rpx solid #b8f1d6;
}

.btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.apply-time {
  display: block;
  text-align: right;
  color: #95a5a6;
  font-size: 24rpx;
  margin-top: 20rpx;
}
</style>
