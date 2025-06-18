<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <text class="title">幸运大抽奖</text>
      <text class="points">剩余积分: {{ userPoints }}</text>
    </view>

    <!-- 主内容区 -->
    <view class="main-content">
      <!-- 转盘容器 -->
      <view class="wheel-container">
        <!-- 转盘背景 -->
        <view 
          ref="wheel" 
          class="wheel" 
          :style="{ transform: `rotate(${wheelRotate}deg)` }"
        >
          <!-- 奖品区块 -->
          <view 
            v-for="(prize, index) in prizes" 
            :key="prize.id" 
            class="prize-item"
            :style="{ 
              transform: `rotate(${360 / prizes.length * index}deg)`,
              background: prize.bgColor
            }"
          >
            <view class="prize-content" :style="{ transform: `rotate(${-360 / prizes.length * index}deg)` }">
              <image :src="prize.imgUrl" mode="aspectFit" class="prize-icon"></image>
              <text class="prize-name">{{ prize.name }}</text>
            </view>
          </view>
          
          <!-- 转盘中心 -->
          <view class="wheel-center" @click="startLottery">
            <text class="center-text">开始</text>
          </view>
        </view>
        
        <!-- 转盘指针 -->
        <view class="wheel-pointer">
          <image src="/static/pointer.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 抽奖按钮 -->
      <button 
        class="lottery-btn" 
        :disabled="isLottering" 
        @click="startLottery"
      >
        {{ isLottering ? '抽奖中...' : '开始抽奖' }}
      </button>
    </view>

    <!-- 奖品记录 -->
    <view class="prize-history">
      <text class="history-title">最近中奖记录</text>
      <scroll-view class="history-list" scroll-y>
        <view class="history-item" v-for="(item, index) in prizeHistory" :key="index">
          <text class="history-name">{{ item.name }}</text>
          <text class="history-time">{{ item.time }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 结果弹窗 -->
    <view class="result-modal" v-if="showResultModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ resultTitle }}</text>
          <view class="close-btn" @click="closeResultModal">×</view>
        </view>
        <view class="modal-body">
          <image :src="resultPrizeImg" mode="aspectFit" class="result-img"></image>
          <text class="result-text">{{ resultMessage }}</text>
        </view>
        <view class="modal-footer">
          <button class="modal-btn" @click="closeResultModal">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 用户信息
      userPoints: 100, // 用户积分
      
      // 转盘相关
      wheelRotate: 0, // 转盘当前角度
      isLottering: false, // 是否正在抽奖
      prizeIndex: 0, // 中奖索引
      
      // 奖品配置
      prizes: [
        { id: 1, name: '一等奖', imgUrl: '/static/prize1.png', bgColor: '#FFD700', probability: 1 },
        { id: 2, name: '二等奖', imgUrl: '/static/prize2.png', bgColor: '#C0C0C0', probability: 3 },
        { id: 3, name: '三等奖', imgUrl: '/static/prize3.png', bgColor: '#CD7F32', probability: 6 },
        { id: 4, name: '四等奖', imgUrl: '/static/prize4.png', bgColor: '#FFA07A', probability: 10 },
        { id: 5, name: '五等奖', imgUrl: '/static/prize5.png', bgColor: '#90EE90', probability: 20 },
        { id: 6, name: '谢谢参与', imgUrl: '/static/prize6.png', bgColor: '#D3D3D3', probability: 60 }
      ],
      
      // 中奖历史
      prizeHistory: [
        { name: '用户1中了二等奖', time: '10:23' },
        { name: '用户2中了四等奖', time: '10:15' },
        { name: '用户3中了五等奖', time: '10:02' },
        { name: '用户4中了三等奖', time: '09:58' },
        { name: '用户5中了谢谢参与', time: '09:45' }
      ],
      
      // 结果弹窗
      showResultModal: false,
      resultTitle: '',
      resultMessage: '',
      resultPrizeImg: ''
    }
  },
  methods: {
    // 开始抽奖
    startLottery() {
      // 检查积分
      if (this.userPoints < 10) {
        uni.showToast({
          title: '积分不足，无法抽奖',
          icon: 'none'
        })
        return;
      }
      
      // 防止重复点击
      if (this.isLottering) return;
      
      // 扣除积分
      this.userPoints -= 10;
      this.isLottering = true;
      
      // 计算中奖结果
      this.prizeIndex = this.calculatePrize();
      
      // 设置动画效果
      const targetRotate = 360 * 5 + (360 / this.prizes.length * this.prizeIndex);
      const rotateDiff = targetRotate - this.wheelRotate;
      
      // 动画效果
      const duration = 4000; // 4秒
      const startTime = Date.now();
      
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < duration) {
          // 使用缓动函数
          const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
          const progress = easeOutQuart(elapsedTime / duration);
          this.wheelRotate += rotateDiff * (progress / (duration / 16));
          requestAnimationFrame(animate);
        } else {
          // 动画结束
          this.wheelRotate = targetRotate;
          this.isLottering = false;
          
          // 显示结果
          this.showPrizeResult();
        }
      }
      
      requestAnimationFrame(animate);
    },
    
    // 计算中奖结果
    calculatePrize() {
      // 计算总概率
      const totalProbability = this.prizes.reduce((sum, prize) => sum + prize.probability, 0);
      
      // 生成随机数
      let random = Math.random() * totalProbability;
      
      // 根据概率分布确定中奖索引
      for (let i = 0; i < this.prizes.length; i++) {
        random -= this.prizes[i].probability;
        if (random <= 0) {
          return i;
        }
      }
      
      return 0; // 默认返回第一个奖品
    },
    
    // 显示中奖结果
    showPrizeResult() {
      const prize = this.prizes[this.prizeIndex];
      
      // 更新中奖历史
      this.prizeHistory.unshift({
        name: '你中了' + prize.name,
        time: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes())
      });
      
      // 设置结果信息
      this.resultTitle = prize.name === '谢谢参与' ? '很遗憾' : '恭喜中奖';
      this.resultMessage = prize.name === '谢谢参与' ? '再接再厉！' : '恭喜您获得' + prize.name + '！';
      this.resultPrizeImg = prize.imgUrl;
      
      // 显示弹窗
      this.showResultModal = true;
    },
    
    // 关闭结果弹窗
    closeResultModal() {
      this.showResultModal = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f4ed;
  padding: 20rpx;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.points {
  font-size: 28rpx;
  color: #666;
}

.main-content {
  padding: 20rpx 0;
}

.wheel-container {
  position: relative;
  width: 600rpx;
  height: 600rpx;
  margin: 0 auto;
}

.wheel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.1);
}

.prize-item {
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: bottom right;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
}

.prize-content {
  position: absolute;
  width: 120rpx;
  text-align: center;
  transform-origin: center;
  top: 60rpx;
}

.prize-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

.prize-name {
  font-size: 24rpx;
  color: #333;
  white-space: nowrap;
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.center-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #e64340;
}

.wheel-pointer {
  position: absolute;
  top: -30rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 80rpx;
  z-index: 20;
}

.wheel-pointer image {
  width: 100%;
  height: 100%;
}

.lottery-btn {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #e64340;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  margin: 40rpx auto;
  text-align: center;
}

.prize-history {
  margin-top: 20rpx;
}

.history-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.history-list {
  height: 200rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #eee;
}

.history-name {
  font-size: 24rpx;
  color: #666;
}

.history-time {
  font-size: 20rpx;
  color: #999;
}

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  width: 500rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.modal-header {
  position: relative;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #e64340;
  color: #fff;
  text-align: center;
  font-size: 32rpx;
}

.close-btn {
  position: absolute;
  right: 20rpx;
  top: 0;
  font-size: 36rpx;
  cursor: pointer;
}

.modal-body {
  padding: 40rpx 20rpx;
  text-align: center;
}

.result-img {
  width: 200rpx;
  height: 200rpx;
  margin: 0 auto 20rpx;
}

.result-text {
  font-size: 32rpx;
  color: #333;
}

.modal-footer {
  padding: 20rpx;
  text-align: center;
}

.modal-btn {
  width: 240rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #e64340;
  color: #fff;
  font-size: 28rpx;
  border-radius: 35rpx;
  margin: 0 auto;
}
</style>