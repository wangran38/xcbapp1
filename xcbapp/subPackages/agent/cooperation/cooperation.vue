<template>
	<view class="agent-apply-page">
		<!-- 表单容器 -->
		<view class="form-container">
			<view class="form-header">
				<view class="form-title">代理申请表</view>
				<view class="form-subtitle">请如实填写信息，我们将尽快与您对接</view>
			</view>
			<view class="step-indicator">
				<view class="step-item" :class="{active: currentStep === 1}">
					<view class="step-num">1</view>
					<view class="step-text">代理信息</view>
				</view>
				<view class="step-line" :class="{active: currentStep >= 2}"></view>
				<view class="step-item" :class="{active: currentStep === 2}">
					<view class="step-num">2</view>
					<view class="step-text">个人信息</view>
				</view>
			</view>

			<view class="form-wrapper" v-if="!isSubmit">
				<!-- 第一步：选择代理类型 + 代理区域 -->
				<view class="step-content" v-if="currentStep === 1">
					<view class="form-card step1-card">
						<view class="section-header">
							<view class="section-name">代理信息</view>
						</view>
						
						<!-- 代理类型选择 -->
						<view class="form-group">
							<view class="form-label required">代理级别</view>
							<view class="form-picker">
								<picker mode="selector" :range="agentTypeList[0]" :value="agentTypeIndex[0]"
									@change="onAgentTypeChange">
									<view class="picker-view">
										{{ agentTypeIndex[0] !== null ? agentTypeList[0][agentTypeIndex[0]] : '选择代理级别' }}
									</view>
								</picker>
							</view>
						</view>

						<!-- 代理区域选择（完整三级联动） -->
						<view class="form-group">
							<view class="form-label required">代理区域</view>
							<view class="form-picker">
								<picker mode="multiSelector" :range="multiArray" :value="multiIndex"
									@change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange">
									<view class="compact-picker">
										<view>
											<text class="province">{{ multiArray[0][multiIndex[0]] || '请选择省' }}</text>
											<text class="separator">-</text>
											<text class="city">{{ multiArray[1][multiIndex[1]] || '请选择市' }}</text>
											<text class="separator">-</text>
											<text class="district">{{ multiArray[2][multiIndex[2]] || '请选择区' }}</text>
										</view>
									</view>
								</picker>
							</view>
						</view>

						<!-- 下一步按钮 -->
						<button class="next-btn" @click="toStep2" hover-class="next-btn-hover">
							下一步
						</button>
					</view>
				</view>

				<!-- 第二步：填写个人信息 + 补充说明（展示已选代理信息） -->
				<view class="step-content" v-if="currentStep === 2">
					<form class="agent-form">
						<!-- 已选代理信息展示（不可修改） -->
						<view class="form-card">
							<view class="section-header">
								<view class="section-name">已确认代理信息</view>
							</view>
							<view class="form-group">
								<view class="form-label">代理级别</view>
								<view class="selected-info">
									{{ agentTypeList[0][agentTypeIndex[0]] || '未选择' }}
								</view>
							</view>
							<view class="form-group">
								<view class="form-label">代理区域</view>
								<view class="selected-info">
									{{ `${multiArray[0][multiIndex[0]] || '无'} - ${multiArray[1][multiIndex[1]] || '无'} - ${multiArray[2][multiIndex[2]] || '无'}` }}
								</view>
							</view>
						</view>

						<view class="form-card">
							<view class="section-header">
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
								<view class="section-name">补充说明</view>
							</view>
							<view class="form-group">
								<textarea v-model="formData.remark" placeholder="其他需要说明的信息" class="form-textarea"
									rows="3"></textarea>
								<view class="word-count">{{ formData.remark.length }}/150</view>
							</view>
						</view>


						<view class="btn-group">
							<button class="back-step-btn" @click="toStep1" >
								返回上一步
							</button>
							<button form-type="submit" class="submit-btn" @click="submitForm" :loading="isSubmitting">
								<span v-if="!isSubmitting">提交申请</span>
							</button>
						</view>
					</form>

					<view class="submit-loading-mask" v-if="isShowLoading">
						<view class="loading-container">
							<uni-icons type="spinner" size="40" color="#4285F4" class="loading-icon" />
							<view class="loading-text">提交中，请稍候...</view>
							<view class="loading-desc">此过程约2-3秒，请勿关闭页面</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 提交成功弹窗 -->
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
	import { api } from '@/api/index.js'
	import { myMixin } from '@/utils/public.js'
	export default {
		mixins: [myMixin],
		data() {
			return {
				currentStep: 1, // 1=选择代理信息（类型+区域），2=填写个人信息
				// 表单数据
				formData: {
					nickname: '',
					phone: '',
					email: '',
					province: '', // 代理省份id
					city: '', // 代理市县id
					remark: '',
					type: null,
					status: 1,
					userid: ''
				},
				// 实时错误提示
				errorTips: {},

				multiArray: [
					[], // 省
					[], // 市
					[]  // 区
				],
				provinceList: [], // 省份原始数据（含id）
				cityList: [],     // 城市原始数据（含id）
				districtList: [], // 区县原始数据（含id）
				multiIndex: [0, 0, 0], // 三级选择器默认索引
				agentTypeList: [
					['省级', '市县区级']
				],
				agentTypeIndex: [0], // 代理级别默认选中第一个
				// 提交状态
				isSubmitting: false,
				isShowLoading: false,
				isSubmit: false,
				key: false,
			};
		},
		async onLoad() {
			try {
				let data = await api.getqrcode()
				if (data.code == 200) {
					this.formData.userid = data.data.userid
				}
				await this.initializePicker(); // 初始化省市区选择器
			} catch (error) {
				console.error('页面初始化失败:', error);
			}
		},
		methods: {
			onAgentTypeChange({ detail }) {
				this.agentTypeIndex[0] = detail.value;
				this.$forceUpdate();
			},

			// 省市区选择器相关方法（不变）
			async fetchProvinces() {
				try {
					const response = await api.citylist({ level: 1, limit: 100 });
					if (response.code === 200) {
						this.provinceList = response.data.listdata;
						return this.provinceList;
					}
					throw new Error('获取省份数据失败');
				} catch (error) {
					console.error('获取省份失败:', error);
					return [];
				}
			},
			async fetchCities(provinceId) {
				try {
					const response = await api.citytree(provinceId);
					if (response.code === 200 && Array.isArray(response.data)) return response.data;
					console.error('获取城市数据为空');
					return [];
				} catch (error) {
					console.error('获取城市失败:', error);
					return [];
				}
			},
			async fetchAreas(cityId) {
				try {
					const response = await api.citytree(cityId);
					if (response.code === 200 && Array.isArray(response.data)) return response.data;
					console.error('获取区县数据为空');
					return [];
				} catch (error) {
					console.error('获取区县失败:', error);
					return [];
				}
			},
			bindMultiPickerChange(e) {
				this.multiIndex = e.detail.value;
				// 校验数据存在性，避免报错
				if (!this.provinceList[this.multiIndex[0]] || !this.cityList[this.multiIndex[1]] || !this.districtList[this.multiIndex[2]]) return;

				// 保存选中的省市区ID
				this.formData.province = this.provinceList[this.multiIndex[0]].id;
				this.formData.city = this.districtList[this.multiIndex[2]].id;
			},
			async bindMultiPickerColumnChange(e) {
				const column = e.detail.column;
				const value = e.detail.value;
				this.multiIndex[column] = value;

				// 切换省份（第一列）
				if (column === 0) {
					const provinceId = this.provinceList[value]?.id;
					if (!provinceId) return;
					const cities = await this.fetchCities(provinceId);
					this.cityList = cities;
					this.multiArray[1] = cities.map(item => item.name);
					
					const firstCityId = cities[0]?.id;
					if (firstCityId) {
						const areas = await this.fetchAreas(firstCityId);
						this.districtList = areas;
						this.multiArray[2] = areas.map(item => item.name);
					} else {
						this.districtList = [];
						this.multiArray[2] = [];
					}
					this.multiIndex[1] = 0;
					this.multiIndex[2] = 0;
				} 
				// 切换城市（第二列）
				else if (column === 1) {
					const cityId = this.cityList[value]?.id;
					if (!cityId) return;
					const areas = await this.fetchAreas(cityId);
					this.districtList = areas;
					this.multiArray[2] = areas.map(item => item.name);
					this.multiIndex[2] = 0;
				}

				this.multiIndex = [...this.multiIndex]; // 强制更新视图
			},
			async initializePicker() {
				try {
					// 初始化省份
					const provinces = await this.fetchProvinces();
					if (provinces.length === 0) return;
					this.multiArray[0] = provinces.map(item => item.name);
					
					// 初始化第一个省份的城市
					const firstProvinceId = provinces[0].id;
					const cities = await this.fetchCities(firstProvinceId);
					this.cityList = cities;
					this.multiArray[1] = cities.map(item => item.name);
					
					// 初始化第一个城市的区县
					const firstCityId = cities[0]?.id;
					if (firstCityId) {
						const areas = await this.fetchAreas(firstCityId);
						this.districtList = areas;
						this.multiArray[2] = areas.map(item => item.name);
					}
					
					// 初始化默认选中的省市区ID
					this.formData.province = firstProvinceId;
					this.formData.city = this.districtList[0]?.id || '';
				} catch (error) {
					console.error('选择器初始化失败:', error);
				}
			},

			// 其他原有方法（不变）
			customizeBack() {
				uni.navigateBack({ delta: 1 });
			},
			handlePhoneInput(e) {
				this.formData.phone = e.detail.value.replace(/\D/g, '').slice(0, 11);
			},
			validateField(field) {
				const val = this.formData[field];
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
				}

				this.$set(this.errorTips, field, tips[field] || '');
				return !tips[field];
			},
			validateForm() {
				const fields = ['nickname', 'phone', 'email'];
				let isPass = true;

				fields.forEach(field => {
					const pass = this.validateField(field);
					if (!pass) isPass = false;
				});

				return isPass;
			},
			async submitForm() {
				if (!this.validateForm()) return;

				// 设置代理类型
				switch (this.agentTypeList[0][this.agentTypeIndex[0]]) {
					case '省级': this.formData.type = 1; break;
					case '市县区级': this.formData.type = 2; break;
				}
				this.formData.agentType = Number(this.agentTypeIndex[0]) + 1;

				// 提交逻辑
				this.isSubmitting = true;
				this.isShowLoading = true;
				try {
					const res = await api.agentApply(this.formData);
					if (res.code === 200) {
						this.isShowLoading = false;
						this.isSubmitting = false;
						this.isSubmit = true;
					} else {
						uni.showToast({ title: res.msg || '提交失败', icon: 'none' });
						this.isShowLoading = false;
						this.isSubmitting = false;
					}
				} catch (error) {
					console.error('提交申请失败:', error);
					uni.showToast({ title: '网络错误，提交失败', icon: 'none' });
					this.isShowLoading = false;
					this.isSubmitting = false;
				}
			},
			resetForm() {
				this.formData = {
					nickname: '',
					phone: '',
					email: '',
					province: '',
					city: '',
					remark: '',
					type: null,
					status: 1,
					userid: this.formData.userid
				};
				this.agentTypeIndex = [0];
				this.errorTips = {};
				this.initializePicker();
			},

			// 第一步 → 第二步（核心验证：代理类型+完整区域）
			toStep2() {
				// 验证代理类型是否选择
				if (this.agentTypeIndex[0] === null) {
					uni.showToast({ title: '请选择代理级别', icon: 'none' });
					return;
				}
				// 验证区域是否完整选择（省+市+区都有值）
				if (!this.multiArray[0][this.multiIndex[0]] || !this.multiArray[1][this.multiIndex[1]] || !this.multiArray[2][this.multiIndex[2]]) {
					uni.showToast({ title: '请选择完整的代理区域', icon: 'none' });
					return;
				}
				// 验证区域ID是否存在（避免选择器初始化异常）
				if (!this.formData.province || !this.formData.city) {
					uni.showToast({ title: '区域数据异常，请重新选择', icon: 'none' });
					return;
				}

				// 验证通过，进入第二步
				this.currentStep = 2;
				// 滚动到顶部
				uni.pageScrollTo({ scrollTop: 0, duration: 300 });
			},

			// 第二步 → 第一步（返回修改）
			toStep1() {
				this.currentStep = 1;
				uni.pageScrollTo({ scrollTop: 0, duration: 300 });
			}
		}
	};
</script>

<style scoped>
	/* 原有样式不变，仅新增/调整以下样式 */
	/* 第一步卡片样式：适配代理类型+区域两个选择器 */
	.step1-card {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	/* 已选信息展示样式 */
	.selected-info {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 14px;
		color: #2d3748;
		box-sizing: border-box;
		background-color: #f8f9fa;
	}
	/* 步骤指示器文字调整（适配新步骤名称） */
	.step-text {
		font-size: 13px;
	}
	/* 其他原有样式保持不变... */

	.form-wrapper {
		position: relative;
	}
	.submit-loading-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.85);
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.loading-container {
		text-align: center;
		padding: 30px 20px;
		border-radius: 12px;
		background-color: #fff;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
	}
	.loading-icon {
		animation: spin 1.2s linear infinite;
		margin-bottom: 15px;
	}
	.loading-text {
		font-size: 16px;
		color: #333;
		font-weight: 500;
		margin-bottom: 8px;
	}
	.loading-desc {
		font-size: 12px;
		color: #999;
	}
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
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
	.step-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24px;
		gap: 20px;
	}
	.step-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.step-num {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #e2e8f0;
		color: #a0aec0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-weight: 500;
		transition: all 0.3s;
	}
	.step-item.active .step-num {
		background-color: #4285F4;
		color: #fff;
	}
	.step-item.active .step-text {
		color: #4285F4;
		font-weight: 500;
	}
	.step-line {
		width: 40px;
		height: 2px;
		background-color: #e2e8f0;
		transition: all 0.3s;
	}
	.step-line.active {
		background-color: #4285F4;
	}
	.next-btn {
		width: 100%;
		height: 52px;
		line-height: 52px;
		background: linear-gradient(90deg, #4285F4 0%, #4285F4 100%);
		color: #fff;
		font-size: 16px;
		font-weight: 500;
		border-radius: 12px;
		border: none;
		margin-top: 10px;
		transition: all 0.3s;
	}
	.next-btn-hover {
		opacity: 0.9;
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(66, 133, 244, 0.2);
	}
	.btn-group {
		display: flex;
		gap: 12px;
		margin-top: 12px;
	}
	.back-step-btn {
		width: 40%;
		height: 52px;
		line-height: 52px;
		background-color: #aa0000;
		color: #fff;
		font-size: 16px;
		font-weight: 500;
		border-radius: 12px;
		transition: all 0.3s;
	}

	.submit-btn {
		color:#fff;
		background-color: #4285F4;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60%;
		margin-top: 0;
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
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}
	.popup-icon {
		margin-bottom: 20px;
		animation: iconBounce 0.5s ease;
	}
	@keyframes iconBounce {
		0% { transform: scale(0); }
		70% { transform: scale(1.2); }
		100% { transform: scale(1); }
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