<template>
	<view class="me-container">
		<view class="content">
			<view class="state">
				{{ isSignedIn ? '已打卡' : '此次未打卡' }}
			</view>
			<!-- <view class="clock" @click="signIn">
                立即打卡
            </view> -->
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '../../api/index.js';
	export default {
		data() {
			return {
				isSignedIn: false,
				// statusMessage: '未打卡', // 默认状态
				timestamp: '', // 存储时间戳
				time: '',
			}
		},
		onLoad(options) {
			// options 是一个对象，包含了所有页面路径中的查询参数
			if (options.time) {
				this.time = options.time; // 将时间戳存储到 data 中
			}
			this.signIn();
		},
		methods: {
			async signIn(data) {
				try {
					/*#ifdef H5*/
					  // 在浏览器端（H5）执行的逻辑
					  uni.showModal({
					  	title: '提示',
					  	content: '请前往小程序中进行打卡',
					  	showCancel: false,
					  	success: () => {
							return
					  	}
					  });
					/*#endif*/
					
					
					/*#ifdef MP-WEIXIN*/
						const token = uni.getStorageSync('token'); // 获取存储的token
						if (!token) {
							// 用户未登录
							uni.showModal({
								title: '提示',
								content: '请登录后再打卡',
								showCancel: false,
								success: () => {
									uni.navigateTo({
										url: '/pages/login/login', // 跳转到登录页面
									});
								}
							});
							return;
						}
						const timestamp = Math.floor(Date.now() / 1000); // 当前时间转换为秒级时间戳
						const currentDate = new Date();
						const currentDay = currentDate.toDateString(); // 获取当前日期
						const signInDate = new Date(this.time * 1000).toDateString(); // 根据传入时间戳获取打卡日期
						if (currentDay !== signInDate) {
							uni.showModal({
								title: '提示',
								content: '不能打卡未来日期！',
								showCancel: false,
							});
							return;
						}
						// 判断传入的时间戳是否在允许打卡的时间范围内
						if (this.time < timestamp ) {
							uni.showModal({
								title: '提示',
								content: '无法对过去的时间打卡！',
								showCancel: false,
							});
							return;
						}
						
						const morning = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), new Date()
							.getDate(), 5, 0, 0).getTime() / 1000);
						const noon = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), new Date()
							.getDate(), 12, 0, 0).getTime() / 1000);
						const evening = Math.floor(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate
							.getDate(), 20, 30, 0).getTime() / 1000);
						const result = await api.sign(data);
						console.log(result.code)
						
						if (result.code === 200) {
							this.isSignedIn = true;
							if (timestamp >= morning && timestamp < noon) {
								// this.isSignedIn = true;
								if (timestamp < this.time) {
									uni.showModal({
										content: result.msg,
										icon: 'success',
						
										success: () => {
											setTimeout(() => {
												uni.switchTab({
													url: '/pages/index/index'
												});
											}, 1000);
										}
									});
								}
							} else if (timestamp >= noon && timestamp < evening) {
								// this.isSignedIn = true;
								if (timestamp < this.time) {
									uni.showModal({
										content: result.msg,
										icon: 'success',
						
										success: () => {
											setTimeout(() => {
												uni.switchTab({
													url: '/pages/index/index'
												});
											}, 1000);
										}
									});
								}
							} else {
								uni.showModal({
									title: '提示',
									content: result.msg || '打卡超时，请稍后重试',
									showCancel: false,
								});
							}
						} else if (result.code === 201) {
							this.isSignedIn = false; // 使用后端返回的消息
							uni.showModal({
								title: '提示',
								content: result.msg || '你今日打卡已经超过限定次数',
								showCancel: false,
						
								success: () => {
									setTimeout(() => {
										uni.switchTab({
											url: '/pages/index/index'
										});
									}, 1000);
								}
							});
						} else {
							uni.showModal({
								title: '提示',
								content: result.msg || '操作失败，请稍后重试',
								showCancel: false,
							});
						}
					/*#endif*/
				} catch (error) {
					console.error('请求打卡接口出错:', error);
					uni.showModal({
						title: '提示',
						content: '打卡失败，请稍后重试。',
						showCancel: false,
					});
				}
			},
		}
	}
</script>

<style>
	.me-container {
		height: 100vh;
		width: 100%;
		box-sizing: border-box;
		color: white;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.content {
		height: 100%;
		width: 90%;
		margin: auto auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.state {
		font-size: 60rpx;
		margin-bottom: 100rpx;
		color: black;
	}

	.clock {
		height: 5%;
		width: 50%;
		font-size: 50rpx;
		border: 1px solid #007aff;
		background-color: #007aff;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>