export default {
	data() {
		return {
			shareParams: {
				path: '/pages/index/index',
				title: '分享给朋友',
				imageUrl: '',
				desc: '',
				content: ''
			}
		}
	},
	//分享给朋友
	onShareAppMessage(res) {
		return {
			title: this.shareParams.title, // 标题
			path: this.shareParams.path, // 分享路径
			imageUrl: this.shareParams.imageUrl, // 分享图
			desc: this.shareParams.desc,
			content: this.shareParams.content,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		};
	},
	//分享到朋友圈
	onShareTimeline(res) {
		return {
			title: this.shareParams.title, // 标题
			path: this.shareParams.path, // 分享路径
			imageUrl: this.shareParams.imageUrl ,// 分享图
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		};
	}
}