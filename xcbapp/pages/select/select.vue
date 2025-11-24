<template>
	<view class="select">
		<view class="vip">
			<button class="blue-button" @click="navigateToLogin">选择会员登录</button>
		</view>
		
		<view class="Owner">
			<button class="blue-button" @click="navigateToLogin">选择摊主登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			navigateToLogin() {
			        // 使用适当的导航方法跳转到指定页面，这里假设使用的是微信小程序的API
			        wx.navigateTo({
			          url: '/pages/login/login'
			        });
				}
		}
	}
</script>

<style>
.select{
	height: auto;
	margin: 50% 30rpx;
	display: flex;
	flex-direction: column;	
	justify-content: space-between; /* 垂直方向为上中下 */
}
.vip{
	margin-bottom: 100rpx;
}
.blue-button {
    background-color: #007aff; /* 蓝色 */
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
  }
</style>
