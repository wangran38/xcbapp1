<template>
  <view class="container">
    <view class="header">
      <text class="title">重置密码</text>
      <text class="subtitle">请验证手机号并设置新密码</text>
    </view>
    
    <view class="form">
      <!-- 手机号输入 -->
      <view class="form-item">
        <text class="item-label">手机号</text>
        <input 
          v-model="formData.phone"
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
          @input="validatePhone"
        />
        <text v-if="phoneError" class="error-tip">{{ phoneError }}</text>
      </view>

      <!-- 验证码输入 -->
      <view class="form-item">
        <text class="item-label">验证码</text>
        <view class="code-input">
          <input
            v-model="formData.verificationCode"
            type="number"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <button 
            class="code-btn"
            :class="{ disabled: !canSendCode }"
            :disabled="!canSendCode"
            @click="sendVerificationCode"
          >
            {{ codeBtnText }}
          </button>
        </view>
      </view>

      <!-- 新密码输入 -->
      <view class="form-item">
        <text class="item-label">新密码</text>
        <view class="password-input">
          <input
            v-model="formData.newPassword"
            type="text"
            placeholder="8-20位字母数字组合"
            maxlength="20"
            @input="validatePassword"
          />
          <image 
            class="eye-icon"
            :src="showPassword ? '/static/eye-open.png' : '/static/eye-close.png'"
            @click="togglePassword"
          />
        </view>
        <text v-if="passwordError" class="error-tip">{{ passwordError }}</text>
      </view>

      <!-- 确认密码 -->
      <view class="form-item">
        <text class="item-label">确认密码</text>
        <input
          v-model="formData.confirmPassword"
          type="'text'"
          placeholder="请再次输入密码"
          @input="validateConfirm"
        />
        <text v-if="confirmError" class="error-tip">{{ confirmError }}</text>
      </view>

      <!-- 提交按钮 -->
      <button 
        class="submit-btn"
        :class="{ disabled: !formValid }"
        :disabled="!formValid"
        @click="handleSubmit"
      >
        确认重置
      </button>
    </view>

    <!-- 全局提示 -->
    <view v-if="message" class="message-box" :class="{ error: isError }">
      {{ message }}
    </view>
  </view>
</template>

<script>
	import {api} from '@/api/index.js'
export default {
  data() {
    return {
      formData: {
        phone: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
      },
      showPassword: false,
      codeBtnText: '获取验证码',
      canSendCode: true,
      countdown: 0,
      phoneError: '',
      passwordError: '',
      confirmError: '',
      message: '',
      isError: false
    };
  },
  computed: {
    formValid() {
      return (
        !this.phoneError &&
        !this.passwordError &&
        !this.confirmError &&
        this.formData.phone &&
        this.formData.verificationCode &&
        this.formData.newPassword &&
        this.formData.confirmPassword
      );
    }
  },
  onLoad(va) {
	  // 如果是从首页过来会携带参数过来
  	if (va.phone){
		this.formData.phone = va.phone
	}
  },
  methods: {
    validatePhone() {
      const reg = /^1[3-9]\d{9}$/;
      if (!this.formData.phone) {
        this.phoneError = '手机号不能为空';
      } else if (!reg.test(this.formData.phone)) {
        this.phoneError = '手机号格式不正确';
      } else {
        this.phoneError = '';
      }
    },
    
    validatePassword() {
      const reg = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/;
      if (!this.formData.newPassword) {
        this.passwordError = '密码不能为空';
      } else if (!reg.test(this.formData.newPassword)) {
        this.passwordError = '需包含字母和数字，8-20位';
      } else {
        this.passwordError = '';
      }
	  if(this.formData.confirmPassword){
		  if (this.formData.confirmPassword !== this.formData.newPassword) {
		    this.passwordError = '两次输入密码不一致';
		  }else{
		  		  this.passwordError = '';
		  }
	  }
    },

    validateConfirm() {
      if (this.formData.confirmPassword !== this.formData.newPassword) {
        this.confirmError = '两次输入密码不一致';
      } else {
        this.confirmError = '';
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async sendVerificationCode() {
      if (this.phoneError || !this.formData.phone) return;

      this.startCountdown();
      let res = await api.sendText({'phonenumber':this.formData.phone})
	  if (res.code == 200){
		  uni.showToast({
		  	icon:'success',
			title:'短信已发送至您的手机,请注意查收'
		  })
	  }else{
		  uni.showToast({
		  	icon:'error',
		  	title:res.msg
		  })
	  }
    },

    startCountdown() {
      this.canSendCode = false;
      this.countdown = 60;
      this.codeBtnText = `${this.countdown}秒后重发`;
      
      const timer = setInterval(() => {
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.canSendCode = true;
          this.codeBtnText = '获取验证码';
          return;
        }
        this.countdown--;
        this.codeBtnText = `${this.countdown}秒后重发`;
      }, 1000);
    },

    async handleSubmit() {
      if (!this.formValid) return;
      
      let res  = await api.editPwd({
		  phone:this.formData.phone,
		  codenum:this.formData.verificationCode,
		  psw:this.formData.newPassword
	  })
      this.showMessage('密码重置成功', false);
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    },

    showMessage(msg, isError = true) {
      this.message = msg;
      this.isError = isError;
      setTimeout(() => {
        this.message = '';
      }, 2000);
    }
  }
};
</script>

<style scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: #f5f6fa;
}

.header {
  margin-bottom: 60rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #7f8c8d;
}

.form-item {
  margin-bottom: 40rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.item-label {
  display: block;
  font-size: 28rpx;
  color: #34495e;
  margin-bottom: 20rpx;
}

input {
  height: 80rpx;
  font-size: 30rpx;
  width: 100%;
  padding: 0 10rpx;
  border-bottom: 2rpx solid #eee;
}

.code-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.code-btn {
  width: 200rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 20rpx;
  background: #3498db;
  color: #fff;
  border-radius: 30rpx;
  margin-left: 20rpx;
  
}

.password-input {
  position: relative;
}

.eye-icon {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  width: 40rpx;
  height: 40rpx;
}

.submit-btn {
  margin-top: 60rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #2ecc71;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
  transition: all 0.3s;
  
}

.error-tip {
  display: block;
  color: #e74c3c;
  font-size: 24rpx;
  margin-top: 10rpx;
}

.message-box {
  position: fixed;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 20rpx 40rpx;
  border-radius: 48rpx;
  background: #2ecc71;
  color: #fff;
  font-size: 28rpx;
  
}
</style>