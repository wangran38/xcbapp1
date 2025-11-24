<template>
  <view class="all">
    <view class="tip">
      <view class="heading">请选择您的身份</view>
      <view class="items">
        <view class="mencheng booth-owner" @click="goToBoothOwner" data-bg-color="#90EE90">
          <uni-icons type="staff-filled" size="60rpx"></uni-icons>
          <view>我是摊主</view>
        </view>
        <view class="mencheng householder" @click="goToAhouseholder" data-bg-color="#ADD8E6">
          <uni-icons type="person-filled" size="60rpx"></uni-icons>
          <view>我是户主</view>
        </view>
		<view class="mencheng householder" @click="goToAgent" data-bg-color="#ADD8E6">
		  <uni-icons type="auth" size="60rpx"></uni-icons>
		  <view>我是代理</view>
		</view>
      </view>
    </view>
    <view class="description">
      <text>在这里，无论是摊主还是户主，都能享受到便捷的服务哦。摊主可以轻松管理自己的摊位商品，进行售卖等操作；</text>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      // 跳转至我的摊主
      goToBoothOwner() {
        if (this.checkToken()) {
          uni.showModal({
            showCancel: false,
            content: '暂未登录,请前往登录',
          }).then(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          })
        } else {
          uni.navigateTo({
            url: '/pages/boothOwner/boothOwner'
          })
        }
      },
	  // 跳转至我的代理商
	  goToAgent() {
	    if (this.checkToken()) {
	      uni.showModal({
	        showCancel: false,
	        content: '暂未登录,请前往登录',
	      }).then(() => {
	        uni.navigateTo({
	          url: '/pages/login/login'
	        })
	      })
	    } else {
	      uni.navigateTo({
	        url: '/pages/agent/agent'
	      })
	    }
	  },
      // 跳转至我的户主
      goToAhouseholder() {
        if (this.checkToken()) {
          uni.showModal({
            showCancel: false,
            content: '暂未登录,请前往登录',
          }).then(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          })
        } else {
          uni.navigateTo({
            url: '/pages/aHouseholder/aHouseholder'
          })
        }
      },
      // 检查是否token存在，存在则已登陆
      checkToken() {
        const token = uni.getStorageSync('token');
        if (!token) {
          return true
        }
        return false
      },
    }
  }
</script>

<style>
/* 整体页面背景设置 */
page {
  background-color: #f8f8f8;
}

/* 整个页面内容容器样式 */
.all {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 20rpx; /* 左右添加一点内边距，避免内容太靠边 */
}

/* 提示区域样式 */
.tip {
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1); /* 添加淡淡的阴影，增加层次感 */
  border-radius: 10rpx; /* 给容器添加圆角 */
  padding: 30rpx 0; /* 上下添加内边距，让内部元素更舒展 */
}

/* 标题样式 */
.heading {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
}

/* 按钮通用样式 */
.mencheng {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30rpx;
  font-size: 32rpx;
}

/* 摊主按钮样式 */
.booth-owner {
  background: linear-gradient(to bottom, #b3f0b3, #55aa55); /* 调淡了绿色系的渐变颜色 */
  color: white;
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.08); /* 调淡阴影效果 */
}

/* 摊主按钮悬停效果 */
.booth-owner:hover {
  transform: scale(1.05);
  opacity: 0.85;
  background-color: rgba(255, 255, 255, 0.15);
}

/* 摊主按钮点击效果 */
.booth-owner:active {
  transform: scale(0.98);
  background-color: #c8ffc8; /* 点击时变亮一点的示例颜色，调淡了一些，更柔和 */
  transition: all 0.1s ease;
}

/* 户主按钮样式 */
.householder {
  background: linear-gradient(to bottom, #c0e0f0, #6699cc); /* 调淡了蓝色系的渐变颜色 */
  color: white;
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.08); /* 调淡阴影效果 */
}

/* 户主按钮悬停效果 */
.householder:hover {
  transform: scale(1.05);
  opacity: 0.85;
  background-color: rgba(255, 255, 255, 0.15);
}

/* 户主按钮点击效果 */
.householder:active {
  transform: scale(0.98);
  background-color: #d9e9ff; /* 点击时变亮一点的示例颜色，调淡了一些，更柔和 */
  transition: all 0.1s ease;
}

/* 按钮内图标样式 */
.mencheng uni-icons {
  size: 60rpx;
  margin-right: 15rpx;
}

/* 按钮组样式 */
.items {
  margin-top: 50rpx;
  margin-bottom: 50rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 新增的描述文字样式 */
.description {
  text-align: center;
  margin: 30rpx 0;
  color: #666;
  font-size: 28rpx;
  line-height: 1.5;
}

</style>