
<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {},
		onShow() {
			const updateManager = uni.getUpdateManager()
			// 请求完新版本信息的回调
			updateManager.onCheckForUpdate(res => {
				if (res.hasUpdate) {
					// 新版本下载成功
					updateManager.onUpdateReady(() => {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，点击确定重启小程序',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，强制更新
									updateManager.applyUpdate()
								}
							}
						})
					})
				}
			})
			// 新版本下载失败
			updateManager.onUpdateFailed(res => {
				console.error(res)
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}

	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	@import "@/static/iconfont.css";



	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}

	// 隐藏滚动条
	::-webkit-scrollbar {
		width: 0 !important;
	}

	::-webkit-scrollbar {
		width: 0 !important;
		height: 0;
	}


	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
</style>