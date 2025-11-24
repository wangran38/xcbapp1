<template>
	<view class="agent-apply-page">
		<!-- 表单容器 -->
		<view class="form-container">
			<!-- 标题区域 -->
			<view class="form-header">
				<view class="form-title">代理申请表</view>
				<view class="form-subtitle">请如实填写信息，我们将尽快与您对接</view>
			</view>

			<view class="form-wrapper" v-if="!isSubmit">
				<form  class="agent-form">
					<view class="form-card">
						<view class="section-header">
							<view class="section-icon">
								<uni-icons type="contact" size="20" color="#4285F4" />
							</view>
							<view class="section-name">个人信息</view>
						</view>
						<view class="form-group">
							<view class="form-label required">姓名</view>
							<input type="text" v-model="formData.nickname" placeholder="请输入您的真实姓名" class="form-input" />
							<view class="error-tip" v-if="errorTips.name">{{ errorTips.name }}</view>
						</view>
						<view class="form-group">
							<view class="form-label required">联系电话</view>
							<input type="number" v-model="formData.phone" placeholder="请输入11位手机号码" class="form-input"
								@input="handlePhoneInput" />
							<view class="error-tip" v-if="errorTips.phone">{{ errorTips.phone }}</view>
						</view>
						<view class="form-group">
							<view class="form-label required">电子邮箱</view>
							<input type="email" v-model="formData.email" placeholder="请输入常用邮箱（例：xxx@xx.com）"
								class="form-input" />
							<view class="error-tip" v-if="errorTips.email">{{ errorTips.email }}</view>
						</view>

					</view>
					<view class="form-card">
						<view class="section-header">
							<view class="section-icon">
								<uni-icons type="map-pin" size="20" color="#FBBC05" />
							</view>
							<view class="section-name">代理信息</view>
						</view>
						<view class="form-group">
							<view class="form-label required">代理区域</view>
							<picker mode="multiSelector" :range="regionRange" :value="regionIndex"
								@change="onRegionChange" @columnchange="onRegionColumnChange" class="form-picker">
								<view class="picker-view">
									{{ regionIndex[0] !== null ? `${regionRange[0][regionIndex[0]]} - ${regionRange[1][regionIndex[1]]}` : '选择区域' }}
								</view>
							</picker>
							<view class="error-tip" v-if="errorTips.region">{{ errorTips.region }}</view>
						</view>
						<view class="form-group">
							<view class="form-label required">代理级别</view>
							<picker mode="multiSelector" class="form-picker" :range="agentTypeList"
								@change="onAgentTypeChange">
								<view class="picker-view">
									{{ agentTypeIndex[0] !== null ? `${agentTypeList[0][agentTypeIndex[0]]}` : '选择代理级别' }}
								</view>
							</picker>
							<view class="error-tip" v-if="errorTips.region">{{ errorTips.region }}</view>
						</view>

						<view class="form-group">
							<view class="form-label">补充说明</view>
							<textarea v-model="formData.remark" placeholder="其他需要说明的信息" class="form-textarea"
								rows="3"></textarea>
							<view class="word-count">{{ formData.remark.length }}/150</view>
						</view>
					</view>

					<!-- 提交按钮 -->
					<button form-type="submit" class="submit-btn" @click="submitForm" :loading="isSubmitting"
						:disabled="isSubmitting" hover-class="submit-btn-hover">
						<span v-if="!isSubmitting">提交申请</span>
						<uni-icons type="spinner" size="18" color="#fff" class="submit-loading" v-else></uni-icons>
					</button>
				</form>

				<view class="submit-loading-mask" v-if="false">
					<view class="loading-container">
						<!-- 旋转加载图标 -->
						<uni-icons type="spinner" size="40" color="#4285F4" class="loading-icon" />
						<!-- 等待提示文字 -->
						<view class="loading-text">提交中，请稍候...</view>
						<!-- 辅助说明（降低用户焦虑） -->
						<view class="loading-desc">此过程约2-3秒，请勿关闭页面</view>
					</view>
				</view>
			</view>

			<view v-if="isSubmit" style="display: flex; justify-content: center;" :animation="true"
				animation-duration="300">
				<view class="popup-content">
					<view class="popup-icon">
						<uni-icons type="success-circle" size="60" color="#34A853" />
					</view>
					<view class="popup-title">申请提交成功！</view>
					<view class="popup-desc">
						我们已收到您的申请，<br>专属客户经理将在3个工作日内与您联系
					</view>
					<button class="popup-btn" @click="customizeBack" hover-class="popup-btn-hover">
						好的
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	import {myMixin}from '@/utils/public.js'
	export default {
		mixins:[myMixin],
		data() {
			return {
				// 表单数据
				formData: {
					nickname: '',
					phone: '',
					email: '',
					province: '', // 用户代理的省份id
					city: '', //  用户代理市县id
					remark: '',
					type:null,
					status:1
				},
				// 实时错误提示
				errorTips: {},
				// 地区选择
				regionRange: [
					[],
					[]
				],
				provinceMapData: [],
				cityMapData: [],
				regionIndex: [0, 0],
				agentTypeList: [
					[
						'省级',
						'市级',
					]
				],
				agentTypeIndex: [
					[0]
				],
				// 提交状态（原有）
				isSubmitting: false,
				// 提交等待遮罩显示状态（新增）
				isShowLoading: false,
				isSubmit: false,
				key: false,
			};
		},
		async onLoad() {
			let data = await api.getqrcode()
			if (data.code == 200){
				this.formData.userid = data.data.userid
			}
			// this.formData.id = data.id
			this.initRegion()
		},
		methods: {
			// 获取城市数据
			async getCityData(pid) {
				// 校验pid有效性，避免无效请求
				if (!pid) {
					console.warn('缺少省份ID，无法获取城市数据');
					return;
				}

				this.regionIndex[1] = 0
				this.cityMapData = [];
				this.regionRange.splice(1, 1, []);
				try {
					const data = await api.citytree(pid);
					if (data.code === 200 && Array.isArray(data.data)) {
						// 批量处理数据，减少响应式更新次数
						const cityIds = [];
						const cityNames = [];
						data.data.forEach(item => {
							cityIds.push(item.id);
							cityNames.push(item.name);
						});
						// 一次性赋值，提升性能并确保响应式
						this.cityMapData = cityIds;
						this.regionRange[1] = cityNames;
					} else {
						console.warn('城市数据返回格式异常', data);
					}
				} catch (error) {
					console.error('获取城市数据失败', error);
				} finally {
					this.$nextTick(() => {
						this.$forceUpdate();
					});
				}
			},
			// 初始化地区
			async initRegion() {
				let data = await api.citylist({
					"level": 1,
					"limit": 100
				})
				if (data.code == 200) {
					data.data.listdata.forEach(item => {
						this.provinceMapData.push(item.id)
						this.regionRange[0].push(item.name)
					})
				}
				this.getCityData(this.provinceMapData[0])
			},
			// 导航返回
			navigateBack() {
				uni.navigateBack({
					delta: 1
				});
			},



			// 手机号输入处理
			handlePhoneInput(e) {
				this.formData.phone = e.detail.value.replace(/\D/g, '').slice(0, 11);
			},

			// 地区选择列变化
			onRegionColumnChange({
				detail
			}) {
				console.log(detail)
				if (detail.column == 0) {
					this.regionIndex[0] = detail.value
					this.getCityData(this.provinceMapData[detail.value])
				}
				// const {
				// 	column,
				// 	value
				// } = e.detail;
				// this.regionIndex[column] = value;
			},
			onAgentTypeChange({
				detail
			}) {
				this.agentTypeIndex[0] = detail.value[0]
				// console.log(this.agentTypeIndex[0]+1)
				this.$nextTick(() => {
					this.$forceUpdate();
				});
			},

			// 地区选择确认
			onRegionChange({
				detail
			}) {
				this.regionIndex = detail.value
			},

			// 单个字段验证
			validateField(field) {
				const val = field === 'region' ? this.regionIndex[0] : this.formData[field];
				const tips = {};

				switch (field) {
					case 'nickname':
						if (!val) tips.nickname = '请输入您的真实姓名';
						break;
					case 'phone':
						if (!val) tips.phone = '请输入联系电话';
						else if (val.length !== 11) tips.phone = '请输入11位有效手机号码';
						break;
					case 'email':
						const reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
						if (!val) tips.email = '请输入电子邮箱';
						else if (!reg.test(val)) tips.email = '请输入有效的邮箱格式（例：xxx@xx.com）';
						break;
					case 'company':
						if (!val) tips.company = '请输入公司名称';
						break;
					case 'address':
						if (!val) tips.address = '请输入公司详细地址';
						break;
					case 'region':
						if (val === null) tips.region = '请选择意向代理区域';
						break;
					case 'intention':
						if (!val) tips.intention = '请描述您的合作意向';
						else if (val.length > 200) tips.intention = '合作意向描述不能超过200字';
						break;
				}

				this.$set(this.errorTips, field, tips[field] || '');
				return !tips[field];
			},

			// 整体表单验证
			validateForm() {
				const fields = ['name', 'phone', 'email', 'company', 'address', 'region', 'intention'];
				let isPass = true;

				fields.forEach(field => {
					const pass = this.validateField(field);
					if (!pass) isPass = false;
				});

				return isPass;
			},

			// 提交表单（新增等待遮罩逻辑）
			async submitForm() {
				
				// if (!this.validateForm()) return
				
				switch (this.agentTypeList[0][this.agentTypeIndex[0]]){
					case '省级':
						this.formData.type = 1
						break
					case '市级':
						this.formData.type = 2
						break
				}
				// console.log(this.formData)
				this.formData.province = this.provinceMapData[this.regionIndex[0]]
				this.formData.city = this.cityMapData[this.regionIndex[1]]
				this.formData.agentType = Number(this.agentTypeIndex[0]) + 1

				let data = await api.agentApply(this.formData)

				this.isSubmit = true
				// if (!this.validateForm()) return;

				// 1. 同时开启按钮加载和等待遮罩（新增）
				this.isSubmitting = true;
				this.isShowLoading = true;

				// 2. 模拟接口请求（实际项目替换为uni.request）
				setTimeout(() => {
					// 3. 请求结束：先关闭遮罩，再显示成功弹窗（避免层级冲突）
					this.isShowLoading = false;
					this.isSubmitting = false;

					this.resetForm();
				}, 2500); // 模拟2.5秒等待，贴近真实接口耗时
			},

			// 重置表单
			resetForm() {
				this.formData = {
					name: '',
					phone: '',
					email: '',

					intention: '',
				};
				this.regionIndex = [null, null];
				this.errorTips = {};
			}
		}
	};
</script>

<style scoped>
	/* 原有样式不变，新增以下样式 */
	/* 表单包裹层：用于定位加载遮罩 */
	.form-wrapper {
		position: relative;
	}

	/* 提交等待遮罩：覆盖整个表单区域，防止用户操作 */
	.submit-loading-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.85);
		/* 半透明白色遮罩，不遮挡页面色调 */
		z-index: 10;
		/* 高于表单，低于成功弹窗 */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 加载内容容器：居中显示 */
	.loading-container {
		text-align: center;
		padding: 30px 20px;
		border-radius: 12px;
		background-color: #fff;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
	}

	/* 加载图标：旋转动画 */
	.loading-icon {
		animation: spin 1.2s linear infinite;
		margin-bottom: 15px;
	}

	/* 加载提示文字 */
	.loading-text {
		font-size: 16px;
		color: #333;
		font-weight: 500;
		margin-bottom: 8px;
	}

	/* 加载辅助说明：浅色调降低焦虑 */
	.loading-desc {
		font-size: 12px;
		color: #999;
	}

	/* 旋转动画关键帧（复用按钮加载动画，保持统一） */
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	/* 原有其他样式... */
	.agent-apply-page {
		background-color: #f8f9fa;
		min-height: 100vh;
		font-size: 14px;
		padding-bottom: 30px;
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 48px;
		background-color: #fff;
		padding: 0 18px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		position: sticky;
		top: 0;
		z-index: 99;
	}

	.nav-back-icon {
		cursor: pointer;
		transition: transform 0.2s;
	}

	.nav-back-icon:active {
		transform: scale(0.9);
	}

	.nav-title {
		font-size: 18px;
		font-weight: 500;
		color: #333;
	}

	.nav-empty {
		width: 22px;
	}

	.form-container {
		width: 92%;
		margin: 18px auto 0;
	}

	.form-header {
		text-align: center;
		margin-bottom: 22px;
	}

	.form-title {
		font-size: 22px;
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 8px;
	}

	.form-subtitle {
		font-size: 13px;
		color: #718096;
	}

	.form-card {
		background-color: #fff;
		border-radius: 12px;
		padding: 20px 18px;
		margin-bottom: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
		transition: box-shadow 0.3s;
	}

	.form-card:active {
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
	}

	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 18px;
	}

	.section-icon {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background-color: rgba(66, 133, 244, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.form-card:nth-child(2) .section-icon {
		background-color: rgba(52, 168, 83, 0.1);
	}

	.form-card:nth-child(3) .section-icon {
		background-color: rgba(251, 188, 5, 0.1);
	}

	.section-name {
		font-size: 16px;
		font-weight: 500;
		color: #2d3748;
	}

	.form-group {
		margin-bottom: 22px;
		position: relative;
	}

	.form-label {
		font-size: 14px;
		color: #2d3748;
		margin-bottom: 8px;
		display: flex;
		align-items: center;
	}

	.required::before {
		content: '*';
		color: #e53e3e;
		margin-right: 4px;
		font-size: 16px;
	}

	.form-input {
		width: 91%;
		padding: 14px 16px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 25rpx;
		color: #2d3748;
		/* box-sizing: border-box; */
		transition: all 0.2s;
	}

	.form-input::placeholder {
		color: #a0aec0;
		font-size: 13px;
	}

	.input-focus {
		border-color: #4285F4;
		box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
		transform: translateY(-1px);
	}

	.form-picker {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 14px;
		color: #2d3748;
		box-sizing: border-box;
		position: relative;
		cursor: pointer;
		transition: all 0.2s;
	}

	.form-picker:active {
		border-color: #4285F4;
		box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
	}

	.picker-view {
		color: #2d3748;
	}

	.form-picker::after {
		content: '';
		position: absolute;
		right: 16px;
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
		width: 10px;
		height: 10px;
		border-top: 2px solid #a0aec0;
		border-right: 2px solid #a0aec0;
		transition: all 0.2s;
	}

	.form-picker:active::after {
		border-color: #4285F4;
	}

	.form-textarea {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 14px;
		color: #2d3748;
		box-sizing: border-box;
		min-height: 110px;
		resize: none;
		transition: all 0.2s;
	}

	.form-textarea::placeholder {
		color: #a0aec0;
		font-size: 13px;
	}

	.form-textarea.input-focus {
		border-color: #4285F4;
		box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
	}

	.word-count {
		font-size: 12px;
		color: #a0aec0;
		text-align: right;
		margin-top: 6px;
	}

	.error-tip {
		font-size: 12px;
		color: #e53e3e;
		margin-top: 6px;
		display: flex;
		align-items: center;
	}

	.error-tip::before {
		content: '';
		width: 12px;
		height: 12px;
		background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e53e3e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>') no-repeat center;
		background-size: 100%;
		margin-right: 4px;
	}

	.submit-btn {
		width: 100%;
		height: 52px;
		line-height: 52px;
		background: linear-gradient(90deg, #4285F4 0%, #4285F4 100%);
		color: #fff;
		font-size: 16px;
		font-weight: 500;
		border-radius: 12px;
		border: none;
		margin-top: 12px;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.submit-btn-hover {
		opacity: 0.9;
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(66, 133, 244, 0.2);
	}

	.submit-loading {
		animation: spin 1s linear infinite;
		margin-right: 8px;
	}

	.popup-content {
		width: 85%;
		max-width: 320px;
		background-color: #fff;
		border-radius: 16px;
		padding: 30px 20px;
		text-align: center;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		animation: popupIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes popupIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}

		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.popup-icon {
		margin-bottom: 20px;
		animation: iconBounce 0.5s ease;
	}

	@keyframes iconBounce {
		0% {
			transform: scale(0);
		}

		70% {
			transform: scale(1.2);
		}

		100% {
			transform: scale(1);
		}
	}

	.popup-title {
		font-size: 20px;
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 12px;
	}

	.popup-desc {
		font-size: 14px;
		color: #718096;
		line-height: 1.6;
		margin-bottom: 28px;
	}

	.popup-btn {
		width: 140px;
		height: 46px;
		line-height: 46px;
		background-color: #34A853;
		color: #fff;
		font-size: 16px;
		border-radius: 23px;
		border: none;
		transition: all 0.2s;
	}

	.popup-btn-hover {
		background-color: #2d9749;
		transform: scale(1.05);
	}

	@media (min-width: 768px) {
		.form-container {
			width: 60%;
			max-width: 500px;
		}
	}
</style>