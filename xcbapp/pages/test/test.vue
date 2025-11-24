<template>
  <view>
    <button @click="handleSpeak">点击语音播报</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isPlusReady: false
    };
  },
  onLaunch() { // 用 onLaunch（App 启动时）替代 onReady，更早监听
    // 仅在 App 环境执行
    // #ifdef APP-PLUS
    // 循环检查 plus 是否可用（打包后初始化可能延迟）
    const checkPlus = setInterval(() => {
      if (window.plus) {
        clearInterval(checkPlus);
        // 监听 plusready 事件（确保所有模块加载完成）
        plus.globalEvent.addEventListener('plusready', () => {
          this.isPlusReady = true;
          console.log('打包后 plus 环境就绪');
        }, false);
      }
    }, 100); // 每 100ms 检查一次，最多等 5 秒
    setTimeout(() => clearInterval(checkPlus), 5000);
    // #endif
  },
  methods: {
    handleSpeak() {
		console.log(plus)
      // #ifdef APP-PLUS
      if (!this.isPlusReady || !window.plus) {
        uni.showToast({ title: '环境未就绪', icon: 'none' });
        return;
      }
      // 执行语音播报
      plus.speech.speak('打包后测试播报', {
        onerror: (e) => console.error('播报失败：', e)
      });
      // #endif
    }
  }
};
</script>