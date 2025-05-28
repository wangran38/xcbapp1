<template>
  <view class="modern-update">
    <!-- 动态背景层 -->
    <view class="background-wave"></view>
    
    <!-- 主内容容器 -->
    <view class="update-card">
      <!-- 头部图标 -->
      <view class="header">
        <view class="icon-container">
          <image class="update-icon" src="/static/rocket.svg" mode="aspectFit"></image>
          <view class="shine-effect"></view>
        </view>
      </view>

      <!-- 版本信息 -->
      <view class="version-info">
        <text class="version-label">新版本</text>
        <text class="version-number">v{{ latestVersion }}</text>
      </view>

      <!-- 更新内容 -->
      <scroll-view class="changelog" scroll-y>
        <view v-for="(item, index) in updateContent" :key="index" class="changelog-item">
          <image class="item-icon" src="/static/check-circle.svg"></image>
          <text class="item-text">{{ item }}</text>
        </view>
      </scroll-view>

      <!-- 进度指示 -->
      <view class="progress-container" v-if="updating">
        <view class="progress-bar" :style="{ width: downloadPercent + '%' }">
          <view class="progress-pulse"></view>
        </view>
        <text v-if="updating"  class="progress-text">{{ progressPhrase }}</text>
      </view>

      <!-- 操作按钮 -->
      <button class="update-button" :disabled="updating" @click="handleUpdate">
        {{ buttonLabel }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
	// buttonLabel:'更新版本',
      latestVersion: '2.0.0',
      currentVersion: '1.0.0',
      downloadPercent: 0,
      updating: false,
      updateContent: [
        '新增会员积分体系',
        '优化商品搜索体验',
        '修复支付页面闪退问题'
      ],
	  downloading:false
    }
  },
  computed: {
	  buttonLabel() {
	        return this.updating ? 
	          `更新中 ${this.downloadPercent}%` : 
	          '立即体验新版本'
	      },
	  progressPhrase() {
	        const phrases = [
	          '正在连接更新服务器...',
	          '发现可用更新包',
	          '正在优化性能模块',
	          '校验文件完整性',
	          '准备就绪'
	        ]
	        return phrases[Math.min(Math.floor(this.downloadPercent/25), 4)]
	      },
    contentList() {
      return this.updateContent.filter(Boolean).map(item => item.trim())
    },
    btnText() {
      if (this.updating) {
        return this.downloadPercent === 100 ? '安装中...' : `下载中 ${this.downloadPercent}%`
      }
      return '立即更新'
    },
  },
  mounted() {
    // #ifdef MP-WEIXIN
    this.initUpdateManager()
    // #endif
  },
  methods: {
    // 初始化更新管理器
    initUpdateManager() {
      if (!wx.canIUse('getUpdateManager')) return
      
      const updateManager = wx.getUpdateManager()
      
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          this.showUpdatePage = true
          this.registerListeners(updateManager)
        }
      })
    },

    // 注册更新监听器
    registerListeners(manager) {
      // 下载进度事件
      manager.onUpdateReady(() => {
        this.downloadPercent = 100
        this.applyUpdate(manager)
      })

      // 下载失败处理
      manager.onUpdateFailed(() => {
        uni.showToast({
          title: '更新失败',
          icon: 'none',
          duration: 2000
        })
        this.updating = false
      })

      // 下载进度模拟（小程序无真实进度）
      this.simulateProgress()
    },

    // 处理更新操作
    handleUpdate() {
      this.updating = true
	  this.simulateProgress()
      wx.showLoading({
        title: '准备更新',
        mask: true
      })
      
      // 触发强制更新
      if (this.downloadPercent === 100) {
        this.applyUpdate(wx.getUpdateManager())
      }
    },

    // 应用更新
    applyUpdate(manager) {
      uni.showModal({
        title: '更新提示',
        content: '新版本已就绪，立即重启应用？',
        confirmText: '立即重启',
        success: res => {
          if (res.confirm) {
            manager.applyUpdate()
          }
        },
        complete: () => {
          this.updating = false
          wx.hideLoading()
        }
      })
    },

    // 模拟进度（因小程序无真实进度事件）
    simulateProgress() {
      let current = 0
      const timer = setInterval(() => {
        if (current < 95) {
          current += Math.floor(Math.random() * 15 + 5)
          this.downloadPercent = Math.min(current, 95)
        } else {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.modern-update {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background-wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: rgba(255,255,255,0.1);
  border-radius: 40%;
  animation: wave 20s infinite linear;
}

@keyframes wave {
  0% { transform: rotate(0deg) translateY(50px); }
  100% { transform: rotate(360deg) translateY(50px); }
}

.update-card {
  background: rgba(255,255,255,0.95);
  border-radius: 24px;
  padding: 40rpx;
  width: 85%;
  max-width: 600rpx;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  backdrop-filter: blur(10px);
}

.header {
  position: relative;
  margin-bottom: 40rpx;
}

.icon-container {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto;
  
  .update-icon {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3));
  }
  
  .shine-effect {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 140%;
    height: 140%;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%);
    animation: shine 2s ease-in-out infinite;
  }
}

@keyframes shine {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.version-info {
  text-align: center;
  margin-bottom: 40rpx;
  
  .version-label {
    display: block;
    color: #667eea;
    font-size: 28rpx;
    letter-spacing: 2px;
    margin-bottom: 12rpx;
  }
  
  .version-number {
    font-size: 48rpx;
    font-weight: 700;
    color: #2d3748;
  }
}

.changelog {
  max-height: 300rpx;
  margin-bottom: 40rpx;
  
  &-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    
    .item-icon {
      width: 36rpx;
      height: 36rpx;
      margin-right: 20rpx;
    }
    
    .item-text {
      font-size: 28rpx;
      color: #4a5568;
      line-height: 1.4;
    }
  }
}

.progress-container {
  margin: 40rpx 0;
  
  .progress-bar {
    height: 8px;
    background: #667eea;
    border-radius: 4px;
    position: relative;
    transition: width 0.3s ease;
    
    .progress-pulse {
      position: absolute;
      right: -8px;
      top: -4px;
      width: 16px;
      height: 16px;
      background: #667eea;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
  }
  
  .progress-text {
    display: block;
    text-align: center;
    font-size: 24rpx;
    color: #718096;
    margin-top: 20rpx;
  }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
  100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
}

.update-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::after {
    border: none;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  .loading-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 16rpx;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>