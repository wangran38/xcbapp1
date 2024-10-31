<template>  
  <view class="container">  
    <view class="title">重置密码</view>  
   <view class="form">
   	<view class="card">
   		<view class="label">
   			手机号
   		</view>
   		<input type="text" placeholder="请输入手机号"/>
   	</view>
   	<view class="hr">
   	</view>
   	<view class="card">
   		<view class="label">
   			验证码
   		</view>
   		<input type="text" placeholder="请输入验证码">
   	</view>
	<view class="card">
		<view class="label">
			新密码
		</view>
		<input type="text" placeholder="请输入新密码">
	</view>
	
	<view class="card">
		<view class="label">
			确认密码
		</view>
		<input type="text" placeholder="请输入新密码">
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
        verificationCode: '',  
        newPassword: '',  
        confirmPassword: ''  
      },  
      message: '',  
      timer: null // 用于倒计时  
    };  
  },  
  methods: {  
    async sendVerificationCode() {  
      // 发送验证码的逻辑（需要后端支持）  
      if (!this.formData.phone) {  
        this.message = '请填写手机号';  
        return;  
      }  
        
      // 假设我们有一个API端点 /api/send-verification-code  
      try {  
        const response = await uni.request({  
          url: 'https://your-backend-api.com/api/send-verification-code',  
          method: 'POST',  
          data: {  
            phone: this.formData.phone  
          }  
        });  
  
        if (response.statusCode === 200) {  
          this.message = '验证码已发送，请注意查收。';  
          this.startCountdown();  
        } else {  
          this.message = '发送失败，请稍后再试。';  
        }  
      } catch (error) {  
        this.message = '网络错误，请检查您的网络连接。';  
      }  
    },  
    startCountdown() {  
      this.timer = setInterval(() => {  
        if (this.timerCount > 0) {  
          this.timerCount--;  
          this.$refs.getCodeBtn.text = `${this.timerCount}秒后重新发送`;  
        } else {  
          clearInterval(this.timer);  
          this.$refs.getCodeBtn.text = '获取验证码';  
        }  
      }, 1000);  
      this.timerCount = 60; // 60秒倒计时  
    },  
    async handleSubmit() {  
      // 提交重置密码的逻辑（需要后端支持）  
      if (this.formData.newPassword !== this.formData.confirmPassword) {  
        this.message = '两次输入的密码不一致，请重新输入。';  
        return;  
      }  
  
      // 假设我们有一个API端点 /api/reset-password  
      try {  
        const response = await uni.request({  
          url: 'https://your-backend-api.com/api/reset-password',  
          method: 'POST',  
          data: {  
            phone: this.formData.phone,  
            verificationCode: this.formData.verificationCode,  
            newPassword: this.formData.newPassword  
          }  
        });  
  
        if (response.statusCode === 200) {  
          this.message = '密码重置成功，请使用新密码登录。';  
          // 可以选择清空表单或跳转到登录页面  
          this.formData = {  
            phone: '',  
            verificationCode: '',  
            newPassword: '',  
            confirmPassword: ''  
          };  
          // uni.navigateTo({ url: '/pages/login/login' });  
        } else {  
          this.message = '重置失败，请稍后再试。';  
        }  
      } catch (error) {  
        this.message = '网络错误，请检查您的网络连接。';  
      }  
    }  
  },  
  onUnload() {  
    if (this.timer) {  
      clearInterval(this.timer);  
    }  
  }  
};  
</script>  
  
<style scoped>
	.form{
		background-color: white;
		position: relative;
		text-align: left;
		line-height: 30rpx;
		border: 1rpx solid #e8e8e8;
		padding: 20rpx 0rpx 20rpx 0rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
	}
	.form input{
		position: absolute;
		left: 150rpx;
		font-size: 30rpx;
	}
	.form .label{
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: 600;
	}
	.form .card{
		padding: 10rpx 10rpx 10rpx 10rpx;
		display: flex;
	}
.container {  
  padding: 20px;  
  background-color: #fff;  
  border-radius: 8px;  
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  
}  
.title {  
  font-size: 24px;  
  text-align: center;  
  margin-bottom: 20px;  
  color: #333;  
}  
.form-item {  
  margin-bottom: 20px;  
}  
.form-item label {  
  display: block;  
  font-size: 16px;  
  color: #666;  
  margin-bottom: 5px;  
}  
.form-item input {  
  width: 100%;  
  padding: 10px;  
  border: 1px solid #ddd;  
  border-radius: 4px;  
  box-sizing: border-box;  
  font-size: 16px;  
}  
.get-code-btn {  
  display: inline-block;  
  padding: 10px 20px;  
  background-color: #1aad19;  
  color: #fff;  
  border: none;  
  border-radius: 4px;  
  font-size: 16px;  
  margin-left: 10px;  
  vertical-align: middle;  
}  
.submit-btn {  
  width: 100%;  
  padding: 10px;  
  background-color: #ff6347;  
  color: #fff;  
  border: none;  
  border-radius: 4px;  
  font-size: 18px;  
}  
.message {  
  margin-top: 20px;  
  text-align: center;  
  color: #ff0000;  
  font-size: 16px;  
}  
</style>