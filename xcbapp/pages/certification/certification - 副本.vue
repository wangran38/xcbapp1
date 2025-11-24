<template>
	<view class="core-verification-page">
		
		<!-- 核心关联提示 -->
		<view class="core-hint-bar">
			<icon type="lock" size="16" color="#1890FF"></icon>
			<text class="bar-text">完成实名认证后，可解锁店铺入驻、商品发布等功能，所有操作将与您的认证信息关联</text>
		</view>

		<!-- 认证价值卡片 -->
		<view class="value-cards">
			<view class="value-card">
				<view class="value-icon">
					<icon type="shop" size="24" color="#1890FF"></icon>
				</view>
				<view class="value-content">
					<view class="value-title">店铺入驻</view>
					<view class="value-desc">认证信息将作为店铺主体资质，无需重复提交</view>
				</view>
			</view>
			<view class="value-card">
				<view class="value-icon">
					<icon type="goods" size="24" color="#1890FF"></icon>
				</view>
				<view class="value-content">
					<view class="value-title">商品发布</view>
					<view class="value-desc">发布商品将自动关联认证信息，提升买家信任</view>
				</view>
			</view>
			<view class="value-card">
				<view class="value-icon">
					<icon type="safetycertificate" size="24" color="#1890FF"></icon>
				</view>
				<view class="value-content">
					<view class="value-title">信息互通</view>
					<view class="value-desc">一次认证，全平台通用，无需重复验证</view>
				</view>
			</view>
		</view>

		<!-- 认证步骤 -->
		<view class="steps-container">
			<view class="step-item" :class="{ current: currentStep === 0 }">
				<view class="step-number">1</view>
				<view class="step-content">
					<view class="step-title">基本信息填写</view>
					<view class="step-desc">设置账号基本信息，将用于店铺和商品展示</view>
				</view>
			</view>
			<view class="step-line" :class="{ passed: currentStep > 0 }"></view>
			
			<view class="step-item" :class="{ current: currentStep === 1 }">
				<view class="step-number">2</view>
				<view class="step-content">
					<view class="step-title">身份信息验证</view>
					<view class="step-desc">提交身份证信息，确保账号主体真实性</view>
				</view>
			</view>
			<view class="step-line" :class="{ passed: currentStep > 1 }"></view>
			
			<view class="step-item" :class="{ current: currentStep === 2 }">
				<view class="step-number">3</view>
				<view class="step-content">
					<view class="step-title">认证信息确认</view>
					<view class="step-desc">确认信息无误，授权用于店铺和商品关联</view>
				</view>
			</view>
		</view>

		<!-- 表单内容区 -->
		<view class="form-container">
			<!-- 第一步：基本信息 -->
			<view class="form-panel" v-if="currentStep === 0">
				<view class="form-title">账号基本信息</view>
				
				<view class="form-group">
					<view class="form-label required">账号名称</view>
					<view class="form-input">
						<input type="text" v-model="baseInfo.accountName" placeholder="请设置您的账号名称（将显示在店铺和商品页）"></input>
					</view>
					<view class="form-hint">建议使用真实姓名或店铺名称，便于买家识别</view>
				</view>
				
				<view class="form-group">
					<view class="form-label required">联系电话</view>
					<view class="form-input">
						<input type="tel" v-model="baseInfo.phone" placeholder="请输入常用手机号"></input>
					</view>
					<view class="form-hint">将用于接收店铺通知、订单提醒和验证码</view>
				</view>
				
				<view class="form-group">
					<view class="form-label required">经营意向</view>
					<view class="form-input">
						<picker mode="selector" :range="businessIntents" @change="onIntentChange">
							<view class="picker-view">
								{{ selectedIntent || "请选择您的主要经营方向" }}
								<icon type="arrowright" size="16" color="#999"></icon>
							</view>
						</picker>
					</view>
					<view class="form-hint">将影响后续店铺入驻和商品发布的相关设置</view>
				</view>
			</view>

			<!-- 第二步：身份验证 -->
			<view class="form-panel" v-if="currentStep === 1">
				<view class="form-title">身份信息验证</view>
				<view class="verify-notice">
					<text>以下信息将作为账号的主体认证依据，用于关联您的店铺和发布的商品</text>
				</view>
				
				<view class="form-group">
					<view class="form-label required">真实姓名</view>
					<view class="form-input">
						<input type="text" v-model="idInfo.realName" placeholder="请输入与身份证一致的姓名"></input>
					</view>
				</view>
				
				<view class="form-group">
					<view class="form-label required">身份证号码</view>
					<view class="form-input">
						<input type="text" v-model="idInfo.idNumber" placeholder="请输入18位身份证号码"></input>
					</view>
				</view>
				
				<view class="form-group">
					<view class="form-label required">身份证正反面</view>
					<view class="id-upload-area">
						<view class="id-upload-item">
							<view class="upload-title">身份证正面</view>
							<view class="upload-box" @click="chooseImage('front')" v-if="!idImages.front">
								<icon type="camera" size="24" color="#1890FF"></icon>
								<text>点击上传</text>
							</view>
							<view class="preview-box" v-else>
								<image :src="idImages.front" mode="aspectFill"></image>
								<icon type="clear" size="18" color="#fff" @click.stop="deleteImage('front')"></icon>
							</view>
							<view class="upload-desc">含人像、姓名、身份证号面</view>
						</view>
						
						<view class="id-upload-item">
							<view class="upload-title">身份证反面</view>
							<view class="upload-box" @click="chooseImage('back')" v-if="!idImages.back">
								<icon type="camera" size="24" color="#1890FF"></icon>
								<text>点击上传</text>
							</view>
							<view class="preview-box" v-else>
								<image :src="idImages.back" mode="aspectFill"></image>
								<icon type="clear" size="18" color="#fff" @click.stop="deleteImage('back')"></icon>
							</view>
							<view class="upload-desc">含国徽、有效期面</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 第三步：信息确认 -->
			<view class="form-panel" v-if="currentStep === 2">
				<view class="form-title">认证信息确认</view>
				
				<view class="confirm-card">
					<view class="confirm-section">
						<view class="section-header">账号基本信息</view>
						<view class="confirm-item">
							<view class="item-key">账号名称：</view>
							<view class="item-value">{{ baseInfo.accountName || "未填写" }}</view>
						</view>
						<view class="confirm-item">
							<view class="item-key">联系电话：</view>
							<view class="item-value">{{ maskPhone(baseInfo.phone) || "未填写" }}</view>
						</view>
						<view class="confirm-item">
							<view class="item-key">经营意向：</view>
							<view class="item-value">{{ selectedIntent || "未选择" }}</view>
						</view>
					</view>
					
					<view class="confirm-section">
						<view class="section-header">身份认证信息</view>
						<view class="confirm-item">
							<view class="item-key">真实姓名：</view>
							<view class="item-value">{{ idInfo.realName || "未填写" }}</view>
						</view>
						<view class="confirm-item">
							<view class="item-key">身份证号：</view>
							<view class="item-value">{{ maskIdCard(idInfo.idNumber) || "未填写" }}</view>
						</view>
						<view class="confirm-item">
							<view class="item-key">证件状态：</view>
							<view class="item-value">
								<text v-if="idImages.front && idImages.back" class="status-success">已上传</text>
								<text v-else class="status-error">未完成</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="agreement-section">
					<view class="agreement-title">信息使用授权</view>
					<view class="agreement-content">
						<view class="agreement-item">1. 本人同意将上述认证信息作为账号主体资质，用于店铺入驻审核</view>
						<view class="agreement-item">2. 本人同意发布商品时自动关联认证信息，展示给买家作为信任依据</view>
						<view class="agreement-item">3. 平台承诺对认证信息严格保密，仅用于必要的业务场景展示和验证</view>
						<view class="agreement-item">4. 如后续需修改认证信息，需重新提交审核，期间不影响现有店铺和商品</view>
					</view>
					
					<view class="agreement-check">
						<checkbox v-model="agreeAgreement" color="#1890FF"></checkbox>
						<text>我已阅读并同意上述授权内容，确认所提供信息真实有效</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-buttons">
			<button class="prev-btn" v-if="currentStep > 0" @click="prevStep">上一步</button>
			<button class="next-btn" v-if="currentStep < 2" @click="nextStep">下一步</button>
			<button class="submit-btn" v-if="currentStep === 2" @click="submitAuth" :disabled="!agreeAgreement">
				完成认证，解锁全部功能
			</button>
		</view>

		<!-- 帮助弹窗 -->
		<view class="help-modal" v-if="showHelpModal">
			<view class="modal-wrapper">
				<view class="modal-title">认证相关说明</view>
				<view class="modal-close" @click="showHelpModal = false">
					<icon type="clear" size="20" color="#999"></icon>
				</view>
				
				<view class="modal-content">
					<view class="help-section">
						<view class="help-title">认证后可以做什么？</view>
						<view class="help-text">完成实名认证后，您可以入驻店铺、发布商品，所有操作都会与您的认证信息关联，无需重复提交身份材料。</view>
					</view>
					
					<view class="help-section">
						<view class="help-title">认证信息会展示在哪里？</view>
						<view class="help-text">您的账号名称和认证状态会显示在店铺主页和商品详情页，身份证信息仅用于平台验证，不会完整展示。</view>
					</view>
					
					<view class="help-section">
						<view class="help-title">信息修改会影响已发布的商品吗？</view>
						<view class="help-text">修改认证信息需要重新审核，审核期间已发布的商品仍会显示原认证信息，审核通过后自动更新。</view>
					</view>
					
					<view class="help-section">
						<view class="help-title">认证不通过怎么办？</view>
						<view class="help-text">审核不通过会告知具体原因，您可以根据提示修改信息后重新提交，不影响账号登录，但无法使用店铺和商品功能。</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentStep: 0,
			showHelpModal: false,
			agreeAgreement: false,
			
			// 经营意向选项
			businessIntents: ['农产品种植销售', '生鲜零售', '食品加工销售', '综合农贸', '其他'],
			selectedIntent: '',
			
			// 基本信息
			baseInfo: {
				accountName: '',
				phone: ''
			},
			
			// 身份信息
			idInfo: {
				realName: '',
				idNumber: ''
			},
			
			// 身份证图片
			idImages: {
				front: '',
				back: ''
			}
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
