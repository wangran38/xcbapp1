<template>
  <view class="container">
    <!-- 主内容区（居中、留白充足，干净不混乱） -->
    <view class="content">
      <!-- 优雅标题（与农链天下品牌标题同风格，渐变文字） -->
      <view class="heading">
        <text>请选择您的身份</text>
      </view>

      <!-- 选项容器（白色大圆角卡片，内部列表式排列，绝不混乱） -->
      <view class="selection-card">
        <!-- 摊主 -->
        <view class="option-item" @click="goToBoothOwner">
          <view class="icon-box booth">
            <uni-icons type="staff-filled" size="58" color="#fff" />
          </view>
          <view class="option-text">
            <text class="title">我是摊主</text>
            <!-- <text class="desc">管理摊位 · 轻松售卖</text> -->
          </view>
          <uni-icons type="right" size="24" color="#ccc" />
        </view>

        <!-- 户主 -->
        <view class="option-item" @click="goToAhouseholder">
          <view class="icon-box householder">
            <uni-icons type="person-filled" size="58" color="#fff" />
          </view>
          <view class="option-text">
            <text class="title">我是户主</text>
            <!-- <text class="desc">发布货源 · 灵活交易</text> -->
          </view>
          <uni-icons type="right" size="24" color="#ccc" />
        </view>

        <!-- 代理 -->
        <view class="option-item" @click="goToAgent">
          <view class="icon-box agent">
            <uni-icons type="auth" size="58" color="#fff" />
          </view>
          <view class="option-text">
            <text class="title">我是代理</text>
            <!-- <text class="desc">连接供需 · 赚取佣金</text> -->
          </view>
          <uni-icons type="right" size="24" color="#ccc" />
        </view>
      </view>

      <!-- 底部说明（轻盈、专业） -->
      <view class="description">
        <text>在这里，无论是摊主、户主还是代理，都能享受到专业便捷的服务。摊主轻松管理商品，户主灵活发布需求，代理轻松连接供需。</text>
      </view>
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

<style lang="scss" scoped>
  $green: #4caf50;
  $blue: #2d8cf0;
  $purple: #9c27b0;

  .container {
    min-height: 100vh;
    background: #f8f9fb;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40rpx;
  }

  .content {
    width: 100%;
    max-width: 680rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 标题（优雅渐变，与农链天下同风格） */
  .heading {
    margin-bottom: 70rpx;
    text {
      font-size: 54rpx;
      font-weight: 800;
      background: linear-gradient(135deg, #2d3436 0%, #555 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 6rpx;
    }
  }

  /* 选项卡片容器（白色大圆角 + 立体阴影，内部列表清晰不混乱） */
  .selection-card {
    width: 100%;
    background: #fff;
    border-radius: 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.07);
    overflow: hidden;
    margin-bottom: 70rpx;
  }

  .option-item {
    display: flex;
    align-items: center;
    padding: 36rpx 40rpx;
    transition: all 0.25s ease;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: #f8f9fb;
      transform: scale(0.98);
    }

    .icon-box {
      width: 92rpx;
      height: 92rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 36rpx;
      flex-shrink: 0;
    }

    .option-text {
      flex: 1;

      .title {
        font-size: 38rpx;
        font-weight: 700;
        color: #2d3436;
        display: block;
        margin-bottom: 4rpx;
      }

      .desc {
        font-size: 26rpx;
        color: #8a8f99;
        line-height: 1.4;
      }
    }
  }

  /* 各身份专属颜色 */
  .booth { background: linear-gradient(135deg, $green, #66bb6a); }
  .householder { background: linear-gradient(135deg, $blue, #5aa8ff); }
  .agent { background: linear-gradient(135deg, $purple, #ba68c8); }

  /* 说明文字（轻盈易读） */
  .description {
    text-align: center;
    color: #7f8c8d;
    font-size: 28rpx;
    line-height: 1.65;
    padding: 0 30rpx;
  }
</style>