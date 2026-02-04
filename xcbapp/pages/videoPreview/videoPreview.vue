<template>
  <view class="video-preview-container">
    <video :src="videoUrl" controls autoplay fullscreen="true" objectFit="contain"></video>
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoUrl: ''
    }
  },
  onLoad(options) {
    this.videoUrl = decodeURIComponent(options.videoUrl);
  }
}
</script>

<style scoped>
.video-preview-container {
  width: 100vw;
  height: 100vh;
  background-color: #000;
}
video {
  width: 100%;
  height: 100%;
}
</style>