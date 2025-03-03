<template>
  <view class="register-container">
    <!-- 背景装饰 -->
    <view class="decorative-circle circle-1"></view>
    <view class="decorative-circle circle-2"></view>
    
    <!-- 内容区域 -->
    <view class="content-wrapper">
      <!-- 标题 -->
      <view class="header">
        <text class="title">欢迎注册</text>
      </view>

      <!-- 表单区域 -->
      <view class="form-wrapper">
        <!-- 手机号输入 -->
        <view class="input-group" :class="{ 'error': phoneError }">
          <uni-icons type="phone" size="24" color="#409EFF"></uni-icons>
          <input
            class="form-input"
            type="number"
            v-model="formData.phone"
            placeholder="请输入手机号"
            maxlength="11"
            @input="validatePhone"
          />
          <text v-if="phoneError" class="error-msg">{{ phoneError }}</text>
        </view>

        <!-- 密码输入 -->
        <view class="input-group" :class="{ 'error': passwordError }">
          <uni-icons type="locked" size="24" color="#409EFF"></uni-icons>
		  <input
		    class="form-input"
		    type="safe-password"
		    v-model="formData.password"
		    placeholder="请输入密码"
		    maxlength="11"
		    @input="validatePhone"
		  />
          <uni-icons 
            :type="showPassword ? 'eye' : 'eye-slash'"
            size="24"
            color="#999"
            @click="showPassword = !showPassword"
          />
        </view>

        <!-- 确认密码 -->
        <view class="input-group" :class="{ 'error': confirmPasswordError }">
          <uni-icons type="locked" size="24" color="#409EFF"></uni-icons>
         <input
           class="form-input"
           type="safe-password"
           v-model="formData.confirmPassword"
           placeholder="确认密码"
           maxlength="11"
           @input="validatePhone"
         />
          <uni-icons 
            :type="showConfirmPassword ? 'eye' : 'eye-slash'"
            size="24"
            color="#999"
            @click="showConfirmPassword = !showConfirmPassword"
          />
        </view>

        <!-- 协议勾选 -->
        <view class="agreement-group">
          <view class="checkbox-item">
            <uni-icons 
              :type="agreements.service ? 'checkbox-filled' : 'circle'" 
              size="24" 
              :color="agreements.service ? '#409EFF' : '#999'"
              @click="agreements.service = !agreements.service"
            />
            <text class="agreement-text">我已阅读并同意</text>
            <text class="link" @click="navigateTo('service')">《服务协议》</text>
          </view>
          <view class="checkbox-item">
            <uni-icons 
              :type="agreements.privacy ? 'checkbox-filled' : 'circle'" 
              size="24" 
              :color="agreements.privacy ? '#409EFF' : '#999'"
              @click="agreements.privacy = !agreements.privacy"
            />
            <text class="agreement-text">我已阅读并同意</text>
            <text class="link" @click="navigateTo('privacy')">《隐私政策》</text>
          </view>
        </view>

        <!-- 注册按钮 -->
        <button 
          class="register-btn"
          :class="{ 'active': formValid, 'loading': loading }"
          @click="handleRegister"
        >
          <text v-if="!loading">立即注册</text>
          <uni-icons v-else type="spinner-cycle" size="24" color="#fff" class="loading-icon"></uni-icons>
        </button>

        <!-- 已有账号 -->
        <view class="login-link">
          <text>已有账号？</text>
          <text class="link" @click="navigateToLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        phone: '',
        password: '',
        confirmPassword: ''
      },
      agreements: {
        service: false,
        privacy: false
      },
      showPassword: false,
      showConfirmPassword: false,
      phoneError: '',
      passwordError: '',
      confirmPasswordError: '',
      loading: false
    }
  },
  computed: {
    formValid() {
      return !this.phoneError && 
             !this.passwordError && 
             !this.confirmPasswordError &&
             this.agreements.service && 
             this.agreements.privacy
    }
  },
  methods: {
    validatePhone() {
      if (!this.formData.phone) {
        this.phoneError = '请输入手机号'
      } else if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        this.phoneError = '手机号格式不正确'
      } else {
        this.phoneError = ''
      }
    },
    validatePassword() {
      if (!this.formData.password) {
        this.passwordError = '请输入密码'
      } else if (this.formData.password.length < 6) {
        this.passwordError = '密码至少6位'
      } else if (this.formData.password.length > 20) {
        this.passwordError = '密码最多20位'
      } else {
        this.passwordError = ''
      }
    },
    validateConfirmPassword() {
      if (!this.formData.confirmPassword) {
        this.confirmPasswordError = '请确认密码'
      } else if (this.formData.confirmPassword !== this.formData.password) {
        this.confirmPasswordError = '两次密码不一致'
      } else {
        this.confirmPasswordError = ''
      }
    },
    async handleRegister() {
      if (!this.formValid || this.loading) return
      
      try {
        this.loading = true
        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        uni.showToast({ title: '注册成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({ title: '注册失败，请重试', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    navigateTo(type) {
      const routes = {
        service: '/pages/agreement/service',
        privacy: '/pages/agreement/privacy'
      }
      uni.navigateTo({ url: routes[type] })
    },
    navigateToLogin() {
      uni.navigateTo({ url: '/pages/login/login' })
    }
  }
}
</script>

<style lang="scss">
/* 独立样式表 */
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;

  .decorative-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(#409EFF, 0.1) 0%, rgba(#409EFF, 0.05) 100%);
    
    &.circle-1 {
      width: 600rpx;
      height: 600rpx;
      top: -300rpx;
      right: -300rpx;
    }
    
    &.circle-2 {
      width: 400rpx;
      height: 400rpx;
      bottom: -200rpx;
      left: -200rpx;
    }
  }

  .content-wrapper {
    padding: 60rpx 50rpx;
    position: relative;
    z-index: 1;

    .header {
      margin-bottom: 80rpx;
      .title {
        display: block;
        font-size: 48rpx;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 16rpx;
      }
      .subtitle {
        font-size: 28rpx;
        color: #7f8c8d;
      }
    }

    .form-wrapper {
      .input-group {
        height: 100rpx;
        background: #fff;
        border-radius: 16rpx;
        margin-bottom: 40rpx;
        padding: 0 32rpx;
        display: flex;
        align-items: center;
        box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.03);
        transition: all 0.3s ease;
        position: relative;
		

        &.error {
          border: 1rpx solid #F56C6C;
          animation: shake 0.4s;
          
          .form-input {
            color: #F56C6C;
          }
          
          .error-msg {
            position: absolute;
            right: 24rpx;
            bottom: -40rpx;
            font-size: 24rpx;
            color: #F56C6C;
          }
        }

        .form-input {
          flex: 1;
          height: 100%;
          margin: 0 24rpx;
          font-size: 30rpx;
          color: #2c3e50;
        }
      }

      .agreement-group {
        margin: 40rpx 0;
        
        .checkbox-item {
          display: flex;
          align-items: center;
          margin-bottom: 24rpx;
          
          .agreement-text {
            margin-left: 12rpx;
            font-size: 26rpx;
            color: #2c3e50;
          }
          
          .link {
            color: #409EFF;
            margin-left: 8rpx;
          }
        }
      }

      .register-btn {
        height: 96rpx;
        line-height: 96rpx;
        font-size: 34rpx;
        color: #fff;
        background: linear-gradient(45deg, #6AB3FD, #409EFF);
        border-radius: 48rpx;
        margin-top: 60rpx;
        transition: all 0.3s;
        box-shadow: 0 8rpx 24rpx rgba(64,158,255,0.2);

        &:not(.active) {
          opacity: 0.6;
          background: #c0dfff;
          box-shadow: none;
        }

        &.loading {
          opacity: 0.9;
        }

        .loading-icon {
          animation: rotate 1s linear infinite;
        }
      }

      .login-link {
        text-align: center;
        margin-top: 40rpx;
        font-size: 28rpx;
        color: #7f8c8d;
        
        .link {
          color: #409EFF;
          margin-left: 16rpx;
        }
      }
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10rpx); }
  40%, 80% { transform: translateX(10rpx); }
}
</style>
