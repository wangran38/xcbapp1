<template>
  <view class="container">
    <!-- 订单通知设置 -->
    <view class="settings-group">
      <text class="group-title">订单通知</text>
      <view class="setting-item">
        <view>开启新订单通知</view>
        <!-- <switch 
          :checked="form.notifyEnabled" 
          @change="val => setForm('notifyEnabled', val.detail.value)" 
          color="#4CD964"
        /> -->
		<view>
			<button :disabled="!messageStatus" @click="switchMessage" :style="messageStatus ?'background-color:#1AAD19;border-color:#1AAD19;color:#ffffff':'background-color:#aa0000;border-color:#aa0000;color:#ffffff'">{{messageStatusText}}</button>
		</view>
      </view>
    </view>

    <!-- 支付方式设置 -->
    <view class="settings-group">
      <text class="group-title">允许支付方式</text>
      <view class="setting-item">
        <text>微信支付</text>
       <switch 
          :checked="form.wechatPayEnabled" 
          @change="val => setForm('wechatPayEnabled', val.detail.value)"
          color="#4CD964"
        />
		
      </view>
      <view class="setting-item">
        <text>积分支付</text>
        <switch 
          :checked="form.pointsPayEnabled" 
          @change="val => setForm('pointsPayEnabled', val.detail.value)"
          color="#4CD964"
        />
      </view>
      
    </view>

    <!-- 配送设置 -->
    <view class="settings-group">
      <text class="group-title">支持配送方式</text>
      <view class="setting-item">
        <text>送货上门</text>
        <switch 
          :checked="form.deliveryEnabled" 
          @change="val => setForm('deliveryEnabled', val.detail.value)"
          color="#4CD964"
        />
      </view>
	  <view class="setting-item">
	    <text>客户自取</text>
	    <switch 
	      color="#4CD964"
	    />
	  </view>
    </view>

    
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        notifyEnabled: true,
        wechatPayEnabled: true,
        pointsPayEnabled: false,
        pointsRatio: 10,
        deliveryEnabled: true
      },
      showRatioPicker: false,
	  messageStatusText:null,
	  messageStatus:''
    }
  },
  onLoad() {
    this.loadSettings()
	
	
	//#ifdef  MP-WEIXIN
		/**
		 * 
		 * 用户订阅消息
		 */
		uni.getSetting({
			withSubscriptions: true, // 同时获取用户的订阅消息状态
			success: (res) => {
				console.log(res)
				if (!res.subscriptionsSetting.mainSwitch) {
					// 如果没有订阅就弹窗提醒用户订阅
					this.messageStatus = true
					this.messageStatusText = '订阅'
				} else {
					this.messageStatus = false
					this.messageStatusText = '已订阅'
					console.log("用户已订阅")
				}
		
			}
		})
	//#endif
	
  },
  methods: {
	  // 打开消息订阅授权
	  switchMessage() {
	  	uni.requestSubscribeMessage({
	  		tmplIds: ['PN8Vc4Z5rWUHi05A6F-J73TkkpF4iHxkEtA6bIoFUPw'],
	  		success: (res) => {
	  			if (res['PN8Vc4Z5rWUHi05A6F-J73TkkpF4iHxkEtA6bIoFUPw'] == 'accept'){
					this.messageStatus = false
					this.messageStatusText = '已订阅'
				}else{
					this.messageStatus = true
					this.messageStatusText = '订阅'
				}				
	  		},
	  		fail: (err) => {
	  			console.log(err)
	  		},
	  	})
	  },
    loadSettings() {
      try {
        const settings = uni.getStorageSync('shopSettings')
        if (settings) this.form = { ...this.form, ...settings }
      } catch (e) {
        console.error('加载设置失败:', e)
      }
    },
    setForm(key, value) {
      this.form[key] = value
      this.saveSettings()
    },
    saveSettings() {
      try {
        uni.setStorageSync('shopSettings', this.form)
        uni.showToast({ title: '设置已保存', icon: 'none' })
      } catch (e) {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    saveRatio() {
      this.showRatioPicker = false
      this.saveSettings()
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.settings-group {
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 0 15px;
}

.group-title {
  display: block;
  font-size: 16px;
  color: #666;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.setting-item {
	width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.ratio-item {
  background-color: #f8f8f8;
  padding: 12px;
  border-radius: 8px;
}

.ratio-value {
  color: #007AFF;
  font-size: 14px;
}

/* 模态框样式 */
.ratio-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  width: 80%;
  padding: 20px;
  border-radius: 12px;
}

.modal-title {
  font-size: 18px;
  display: block;
  text-align: center;
  margin-bottom: 20px;
}

.ratio-input {
  border: 1px solid #ddd;
  padding: 12px;
  margin: 15px 0;
  border-radius: 8px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 25px;
  border-radius: 6px;
}

.cancel {
  background: #eee;
  color: #666;
}

.confirm {
  background: #007AFF;
  color: white;
}
</style>
