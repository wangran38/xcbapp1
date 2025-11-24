<template>
	<view class="core-verification-page">
	
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	methods: {
		// 返回处理
		handleBack() {
			uni.showModal({
				title: '提示',
				content: '未完成实名认证将无法使用店铺入驻、商品发布等功能，确定要离开吗？',
				confirmText: '暂不认证',
				cancelText: '继续认证',
				success: (res) => {
					if (res.confirm) {
						uni.navigateBack();
					}
				}
			});
		},
		
		// 显示帮助
		showHelp() {
			this.showHelpModal = true;
		},
		
		// 选择经营意向
		onIntentChange(e) {
			this.selectedIntent = this.businessIntents[e.detail.value];
		},
		
		// 选择图片
		chooseImage(type) {
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.idImages[type] = res.tempFilePaths[0];
				}
			});
		},
		
		// 删除图片
		deleteImage(type) {
			this.idImages[type] = '';
		},
		
		// 上一步
		prevStep() {
			this.currentStep--;
			uni.pageScrollTo({ scrollTop: 0, duration: 300 });
		},
		
		// 下一步
		nextStep() {
			if (this.currentStep === 0) {
				// 验证基本信息
				if (!this.baseInfo.accountName) {
					this.showToast('请设置账号名称');
					return;
				}
				if (!this.baseInfo.phone || this.baseInfo.phone.length !== 11) {
					this.showToast('请输入正确的手机号');
					return;
				}
				if (!this.selectedIntent) {
					this.showToast('请选择经营意向');
					return;
				}
			} else if (this.currentStep === 1) {
				// 验证身份信息
				if (!this.idInfo.realName) {
					this.showToast('请输入真实姓名');
					return;
				}
				if (!this.idInfo.idNumber || this.idInfo.idNumber.length !== 18) {
					this.showToast('请输入正确的身份证号');
					return;
				}
				if (!this.idImages.front) {
					this.showToast('请上传身份证正面');
					return;
				}
				if (!this.idImages.back) {
					this.showToast('请上传身份证反面');
					return;
				}
			}
			
			this.currentStep++;
			uni.pageScrollTo({ scrollTop: 0, duration: 300 });
		},
		
		// 提交认证
		submitAuth() {
			if (!this.agreeAgreement) {
				this.showToast('请阅读并同意信息使用授权');
				return;
			}
			
			uni.showLoading({ title: '提交中...' });
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showModal({
					title: '认证提交成功',
					content: '您的实名认证申请已提交，1-2个工作日内完成审核。审核通过后，可直接使用店铺入驻和商品发布功能',
					showCancel: false,
					confirmText: '前往首页',
					success: () => {
						uni.switchTab({ url: '/pages/index' });
					}
				});
			}, 1500);
		},
		
		// 显示提示
		showToast(title) {
			uni.showToast({ title, icon: 'none', duration: 2000 });
		},
		
		// 手机号脱敏
		maskPhone(phone) {
			if (!phone) return '';
			return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
		},
		
		// 身份证脱敏
		maskIdCard(id) {
			if (!id) return '';
			return id.replace(/(\d{6})(\d{8})(\d{4})/, '$1********$3');
		}
	}
};
</script>

<style scoped>
/* 基础样式 */
.core-verification-page {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	background-color: #f5f7fa;
	min-height: 100vh;
	padding-bottom: 80px;
}

/* 导航栏 */
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 48px;
	padding: 0 16px;
	background-color: #fff;
	border-bottom: 1px solid #f0f0f0;
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-title {
	font-size: 18px;
	font-weight: 500;
	color: #333;
}

.help-btn {
	color: #1890FF;
	font-size: 16px;
}

/* 核心关联提示 */
.core-hint-bar {
	display: flex;
	align-items: center;
	padding: 12px 16px;
	background-color: #e6f7ff;
	color: #1890FF;
	font-size: 14px;
	border-bottom: 1px solid #bae7ff;
}

.bar-text {
	margin-left: 8px;
	line-height: 1.5;
}

/* 价值卡片 */
.value-cards {
	display: flex;
	padding: 16px;
	gap: 10px;
	background-color: #fff;
	overflow-x: auto;
}

.value-card {
	flex: 1;
	min-width: 120px;
	background-color: #f0f7ff;
	border-radius: 8px;
	padding: 14px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.value-icon {
	margin-bottom: 10px;
}

.value-title {
	font-size: 15px;
	color: #1890FF;
	font-weight: 500;
	margin-bottom: 6px;
}

.value-desc {
	font-size: 12px;
	color: #40a9ff;
	line-height: 1.4;
}

/* 步骤指示器 */
.steps-container {
	padding: 16px;
	background-color: #fff;
	margin: 10px 16px;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.step-item {
	display: flex;
	align-items: center;
	position: relative;
}

.step-number {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-color: #e5e5e5;
	color: #999;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.step-content {
	margin-left: 12px;
}

.step-title {
	font-size: 15px;
	color: #333;
	font-weight: 500;
}

.step-desc {
	font-size: 13px;
	color: #666;
	margin-top: 4px;
}

.step-line {
	height: 6px;
	background-color: #e5e5e5;
	margin: 12px 16px;
}

/* 步骤状态 */
.step-item.current .step-number {
	background-color: #1890FF;
	color: #fff;
}

.step-line.passed {
	background-color: #1890FF;
}

/* 表单容器 */
.form-container {
	padding: 0 16px;
}

.form-panel {
	background-color: #fff;
	border-radius: 10px;
	padding: 18px;
	margin-bottom: 16px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.form-title {
	font-size: 17px;
	color: #333;
	font-weight: 500;
	margin-bottom: 18px;
	padding-bottom: 10px;
	border-bottom: 1px solid #f5f5f5;
}

.verify-notice {
	background-color: #fff8e6;
	color: #fa8c16;
	font-size: 13px;
	padding: 10px;
	border-radius: 6px;
	margin-bottom: 18px;
	line-height: 1.5;
}

/* 表单组 */
.form-group {
	margin-bottom: 20px;
}

.form-label {
	font-size: 14px;
	color: #666;
	margin-bottom: 8px;
	display: block;
}

.required::after {
	content: '*';
	color: #ff4d4f;
	margin-left: 4px;
}

.form-input input {
	width: 100%;
	padding: 12px 14px;
	border: 1px solid #e5e5e5;
	border-radius: 6px;
	font-size: 15px;
	color: #333;
	background-color: #fafafa;
}

.form-hint {
	font-size: 12px;
	color: #999;
	margin-top: 6px;
}

.picker-view {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 14px;
	border: 1px solid #e5e5e5;
	border-radius: 6px;
	font-size: 15px;
	color: #333;
	background-color: #fafafa;
}

/* 身份证上传区域 */
.id-upload-area {
	display: flex;
	gap: 10px;
}

.id-upload-item {
	flex: 1;
}

.upload-title {
	font-size: 13px;
	color: #666;
	margin-bottom: 8px;
}

.upload-box {
	width: 100%;
	height: 140px;
	border: 1px dashed #e5e5e5;
	border-radius: 6px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #fafafa;
	color: #1890FF;
	font-size: 14px;
}

.upload-box icon {
	margin-bottom: 8px;
}

.preview-box {
	width: 100%;
	height: 140px;
	border-radius: 6px;
	overflow: hidden;
	position: relative;
}

.preview-box image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.preview-box icon {
	position: absolute;
	top: 5px;
	right: 5px;
	background-color: rgba(255,77,79,0.9);
	border-radius: 50%;
	width: 26px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.upload-desc {
	font-size: 12px;
	color: #999;
	margin-top: 6px;
	text-align: center;
}

/* 确认信息区域 */
.confirm-card {
	background-color: #fafafa;
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 18px;
}

.confirm-section {
	margin-bottom: 16px;
}

.confirm-section:last-child {
	margin-bottom: 0;
}

.section-header {
	font-size: 14px;
	color: #1890FF;
	font-weight: 500;
	margin-bottom: 12px;
	padding-bottom: 6px;
	border-bottom: 1px solid #e6f7ff;
}

.confirm-item {
	display: flex;
	margin-bottom: 10px;
	font-size: 14px;
}

.item-key {
	color: #666;
	width: 90px;
	flex-shrink: 0;
}

.item-value {
	color: #333;
	flex: 1;
	word-break: break-all;
}

.status-success {
	color: #52c41a;
}

.status-error {
	color: #ff4d4f;
}

/* 协议区域 */
.agreement-section {
	background-color: #f0f7ff;
	border-radius: 8px;
	padding: 16px;
}

.agreement-title {
	font-size: 14px;
	color: #1890FF;
	font-weight: 500;
	margin-bottom: 12px;
}

.agreement-content {
	font-size: 13px;
	color: #666;
	line-height: 1.6;
	margin-bottom: 16px;
}

.agreement-item {
	margin-bottom: 8px;
}

.agreement-check {
	display: flex;
	align-items: flex-start;
	font-size: 13px;
	color: #666;
}

.agreement-check checkbox {
	margin-top: 2px;
	margin-right: 8px;
}

/* 操作按钮 */
.action-buttons {
	display: flex;
	gap: 12px;
	padding: 16px;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #fff;
	border-top: 1px solid #f0f0f0;
}

.prev-btn, .next-btn, .submit-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	height: 48px;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 500;
}

.prev-btn {
	background-color: #f5f5f5;
	color: #333;
	border: none;
}

.next-btn, .submit-btn {
	background-color: #1890FF;
	color: #fff;
	border: none;
}

.submit-btn:disabled {
	background-color: #a0cfff;
}

/* 帮助弹窗 */
.help-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding: 20px;
}

.modal-wrapper {
	width: 100%;
	max-width: 400px;
	background-color: #fff;
	border-radius: 10px;
	overflow: hidden;
	position: relative;
}

.modal-title {
	font-size: 18px;
	color: #333;
	font-weight: 500;
	padding: 16px;
	border-bottom: 1px solid #f0f0f0;
}

.modal-close {
	position: absolute;
	top: 16px;
	right: 16px;
}

.modal-content {
	max-height: 400px;
	overflow-y: auto;
	padding: 16px;
}

.help-section {
	margin-bottom: 16px;
}

.help-section:last-child {
	margin-bottom: 0;
}

.help-title {
	font-size: 15px;
	color: #333;
	font-weight: 500;
	margin-bottom: 6px;
}

.help-text {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 375px) {
	.id-upload-area {
		flex-direction: column;
	}
	
	.confirm-item {
		flex-direction: column;
	}
	
	.item-key {
		margin-bottom: 4px;
	}
}
</style>
