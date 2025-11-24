<template>
	<view class="container">
		<!-- 1. 商品轮播图 -->
		<view class="carousel-container">
			<swiper class="product-swiper" indicator-dots autoplay interval="3000" duration="500" circular
				@change="onSwiperChange">
				<swiper-item v-for="(img, index) in productImages" :key="index">
					<image :src="img" mode="aspectFill" class="carousel-image"></image>
				</swiper-item>
			</swiper>
			<!-- 轮播图页码 -->
			<view class="carousel-counter">
				{{ currentSwiperIndex + 1 }}/{{ productImages.length }}
			</view>
		</view>

		<!-- 2. 商品基础信息 -->
		<view class="product-base-info">
			<text class="product-name">{{ product.goodsname || '未命名商品' }}</text>



			<!-- 价格与销量 -->
			<view class="price-section">
				<text class="current-price">¥{{ product.price || 0 }}</text>
				<text class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</text>
				<text class="product-unit">{{ product.unit }}</text>
				<view class="sales-volume">已售 {{ product.sales || 0 }} 件</view>
			</view>
		</view>

		<!-- 3. 商品溯源卡片 -->
		<view class="traceability-card" @click="showTraceability = true">
			<view class="traceability-header">
				<text class="trace-title">基础信息</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="trace-content">
				<view class="detail-text">
					{{product.content || '暂无信息'}}
				</view>
			</view>
		</view>

		<!-- 4. 商品详情折叠面板 -->
		<view class="detail-panel">
			<view class="panel-header" @click="toggleDetail">
				<text class="panel-title">溯源信息</text>
				<uni-icons type="down" size="18" color="#999" :class="{ 'rotate': showDetail }"></uni-icons>
			</view>
			<view class="panel-content" v-if="showDetail">
				<view class="detail-text">
					{{product.fromcontent || '暂无信息'}}
				</view>
			</view>
		</view>

		<!-- 5. 购买区域 -->
		<view class="purchase-card">
			<!-- 购买数量 -->
			<view class="form-group quantity-group">
				<text class="form-label">购买数量</text>
				<view class="quantity-selector">
					<button class="quantity-btn minus" :class="{'disabled': fromData.goods_num <= 1}"
						@click="minusGoods_num">
						<uni-icons type="minus" size="20"></uni-icons>
					</button>
					<input class="quantity-input" type="digit" v-model="fromData.goods_num" @input="onKeyInput"
						placeholder="请输入数量" />
					<button class="quantity-btn plus" @click="addGoods_num">
						<uni-icons type="plus" size="20"></uni-icons>
					</button>
				</view>
			</view>

			<!-- 提货点选择 -->
			<!-- 			<view class="form-group pickup-group">
				<text class="form-label">提货点</text>
				<view class="pickup-list">
					<view 
						v-for="(point, index) in deliveryPoints" 
						:key="index" 
						class="pickup-item"
						:class="{'selected': selectedPoint === point.id}" 
						@click="selectPoint(point.id)">
						<view class="point-info">
							<text class="point-name">{{ point.name }}</text>
							<text class="point-address">{{ point.address }}</text>
							<text class="point-time">{{ point.pickupTime }}</text>
						</view>
						<view class="pickup-check" v-if="selectedPoint === point.id">
							<uni-icons type="check" size="24" color="#1890FF"></uni-icons>
						</view>
					</view>
					<view v-if="!deliveryPoints.length" class="no-point">
						<uni-icons type="empty" size="40" color="#ccc"></uni-icons>
						<text>暂无可用提货点</text>
					</view>
				</view>
			</view>
		 -->


		</view>

		<!-- 6. 预售规则 -->
		<view class="rules-card">
			<text class="section-title">预售规则</text>
			<view class="rules-list">
				<view v-for="(rule, index) in shortRules" :key="index" class="rule-item">
					<uni-icons type="circle" size="12" color="#1890FF" class="rule-icon"></uni-icons>
					<text class="rule-text">{{ rule }}</text>
				</view>
				<view class="view-more" @click="showFullRules = true">
					<text>查看全部规则</text>
					<uni-icons type="right" size="14" color="#1890FF"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 7. 底部操作栏 -->
		<view class="footer">
			<view class="total-info">
				<text class="total-label">总计：</text>
				<text class="total-amount">¥{{ totalAmount.toFixed(2) }}</text>
			</view>
			<button class="submit-btn" @click="handleSubmit" :disabled="!selectedPoint">
				立即预订
			</button>
		</view>

		<!-- 8. 溯源弹窗 -->
		<uni-popup v-model="showTraceability" mode="bottom" class="trace-popup">
			<view class="popup-header">
				<text class="popup-title">商品全程溯源</text>
				<uni-icons type="close" size="22" color="#999" @click="showTraceability = false"></uni-icons>
			</view>
			<view class="trace-detail">
				<!-- 溯源二维码 -->
				<view class="trace-qrcode">
					<image src="/static/images/trace-qrcode.png" mode="widthFix"></image>
					<text>扫码查看完整溯源信息</text>
				</view>
				<!-- 生长周期 -->
				<view class="trace-process">
					<text class="process-title">生长周期</text>
					<view class="process-steps">
						<view class="process-step active">
							<view class="step-dot"></view>
							<view class="step-line"></view>
							<view class="step-info">
								<text class="step-time">3月15日</text>
								<text class="step-desc">播种育苗</text>
							</view>
						</view>
						<view class="process-step active">
							<view class="step-dot"></view>
							<view class="step-line"></view>
							<view class="step-info">
								<text class="step-time">5月20日</text>
								<text class="step-desc">开花结果</text>
							</view>
						</view>
						<view class="process-step active">
							<view class="step-dot"></view>
							<view class="step-line"></view>
							<view class="step-info">
								<text class="step-time">6月30日</text>
								<text class="step-desc">成熟采收</text>
							</view>
						</view>
						<view class="process-step active">
							<view class="step-dot"></view>
							<view class="step-info">
								<text class="step-time">7月1日</text>
								<text class="step-desc">质检包装</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 生产者信息 -->
				<view class="farmer-info">
					<text class="farmer-title">生产者信息</text>
					<view class="farmer-card">
						<image src="/static/images/farmer-avatar.png" mode="widthFix" class="farmer-avatar"></image>
						<view class="farmer-details">
							<text class="farmer-name">{{ product.trace && product.trace.farmer || '张建国' }}</text>
							<text class="farmer-cert">已认证种植户</text>
							<text class="farmer-experience">15年种植经验 | 绿色种植认证</text>
						</view>
						<view class="verify-tag">
							<uni-icons type="verified" size="18" color="#1890FF"></uni-icons>
							<text>已实名认证</text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 9. 完整规则弹窗 -->
		<uni-popup v-model="showFullRules" mode="center" class="rules-popup">
			<view class="rules-popup-header">
				<text>预售规则详情</text>
				<uni-icons type="close" size="22" color="#999" @click="showFullRules = false"></uni-icons>
			</view>
			<view class="rules-popup-content">
				<view class="full-rule-item" v-for="(rule, index) in fullRules" :key="index">
					<text class="rule-number">{{ index + 1 }}.</text>
					<text class="rule-content">{{ rule }}</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// 1. 引入依赖（确保项目已安装对应包）
	import Decimal from 'decimal'
	import {
		myMixin
	} from '@/utils/public.js'
	import {
		api
	} from '@/api/index.js'

	export default {
		// 4. 混入公共方法
		mixins: [myMixin],
		// 5. 数据定义
		data() {
			return {
				product: {}, // 从上一页传递的商品数据
				productImages: [], // 商品轮播图（默认3张占位图）
				currentSwiperIndex: 0, // 当前轮播图索引
				showDetail: false, // 是否展开商品详情
				showTraceability: false, // 是否显示溯源弹窗
				showFullRules: false, // 是否显示完整规则

				selectedPoint: null, // 选中的提货点ID
				deliveryPoints: [ // 提货点列表
					{
						id: 1,
						name: '绿鲜社区店',
						address: '朝阳区光华路8号底商',
						pickupTime: '09:00-21:00'
					},
					{
						id: 2,
						name: '智慧生活超市',
						address: '海淀区中关村大街12号',
						pickupTime: '08:30-22:00'
					},
					{
						id: 3,
						name: '生鲜便利店',
						address: '西城区西单北大街109号',
						pickupTime: '10:00-20:00'
					}
				],

				// 规则文本
				shortRules: [
					'定金支付后不可退换',
					'提货时需出示订单二维码',
					'预售商品到货后统一配送'
				],
				fullRules: [
					'定金支付后不可退换，如商品未按约定时间到货，系统将自动退款并补偿5元优惠券',
					'提货时需出示订单二维码，核对身份信息后方可提货，代提需提供双方有效证件',
					'预售商品到货后将统一配送到您选择的提货点，到货后会通过短信通知，请在3天内提货',
					'预订商品数量有限，每个用户ID限购5份，超出部分将按原价结算，不享受预售优惠',
					'商品保质期为到货后3天，请在保质期内提货并食用，逾期未提视为自动放弃',
					'如对商品质量有异议，请在提货后24小时内联系客服处理，逾期将不再受理'
				],

				// 提交表单数据
				fromData: {
					farmer_id: '',
					goods_num: 1, // 默认购买1件
					price: 0,
					payprice: 0,
					payway: 2, // 支付方式：2=微信支付
					goods_arr: [],
					money: 0 // 商品单价
				},
				query: {
					farmersgoods_id: null,
					page: 1,
					limit: 10
				},
			}
		},


		// 6. 页面加载时初始化
		onLoad({
			query
		}) {
			// 解析上一页传递的商品参数（兼容字符串/JSON）
			const jsonQuery = typeof query === 'string' ? JSON.parse(query) : query
			this.product = jsonQuery || {}

			this.query.farmersgoods_id = jsonQuery.farmersgoods_id

			this.getData()

			// console.log(this.product)

			// 初始化表单基础数据
			this.fromData.farmer_id = this.product.id || ''
			this.fromData.money = parseFloat(this.product.price) || 0

			// 默认选中第一个提货点
			if (this.deliveryPoints.length > 0) {
				this.selectedPoint = this.deliveryPoints[0].id
			}

		},
		// 7. 计算属性（总金额）
		computed: {
			totalAmount() {
				// 避免NaN，确保金额计算合法
				if (isNaN(this.fromData.money) || isNaN(this.fromData.goods_num) || this.fromData.goods_num < 1) {
					return 0
				}
				return new Decimal(this.fromData.money).mul(this.fromData.goods_num).toNumber()
			}
		},
		// 8. 方法定义
		methods: {
			async getData() {
				let data = await api.goodsinfoList(this.query)
				this.productImages = [this.product.imglogo]
				data.data.listdata.forEach(item => {
					if (item.imgs.split(',').length > 1 && this.productImages.length < 10) {
						console.log(item.imgs.split(','))
						this.productImages = [...this.productImages, ...item.imgs.split(',')]
					}
				})
			},
			// 轮播图切换事件
			onSwiperChange(e) {
				this.currentSwiperIndex = e.detail.current
			},

			// 展开/收起商品详情
			toggleDetail() {
				this.showDetail = !this.showDetail
			},

			// 选择提货点
			selectPoint(id) {
				this.selectedPoint = id
			},

			// 数量输入框变化（限制正整数）
			onKeyInput(e) {
				const inputVal = e.detail.value.trim()
				const num = parseInt(inputVal)
				this.fromData.goods_num = isNaN(num) || num < 1 ? 1 : num
			},

			// 减少购买数量
			minusGoods_num() {
				if (this.fromData.goods_num > 1) {
					this.fromData.goods_num--
				}
			},

			// 增加购买数量
			addGoods_num() {
				this.fromData.goods_num++
			},

			// 加入购物车（模拟）
			addToCart() {
				uni.showToast({
					title: '已加入购物车',
					icon: 'success',
					duration: 1500
				})
				// 实际项目需调用购物车接口，此处省略
			},

			// 提交预售订单
			async handleSubmit() {
				// 基础验证
				if (!this.selectedPoint) {
					uni.showToast({
						title: '请选择提货点',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (this.fromData.goods_num < 1) {
					uni.showToast({
						title: '购买数量不能小于1',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (this.fromData.money <= 0) {
					uni.showToast({
						title: '商品价格异常，请刷新',
						icon: 'none',
						duration: 2000
					})
					return
				}

				// 组装提交数据
				this.fromData.price = this.totalAmount
				this.fromData.payprice = this.totalAmount
				this.fromData.goods_arr = [{
					goods_id: this.product.id || '',
					goodsname: this.product.goodsname || '',
					goodsnum: this.fromData.goods_num,
					price: this.fromData.price,
					pay_time: Date.now()
				}]

				// 调用接口提交
				try {
					const res = await api.prePurchaseOrder(this.fromData)
					if (res.code === 200 && res.data?.out_trade_no) {
						// 提交成功，发起支付
						this.startPayment(res.data.out_trade_no)
					} else {
						uni.showToast({
							title: res.msg || '订单提交失败',
							icon: 'error',
							duration: 2000
						})
						this.fromData.goods_arr = []
					}
				} catch (err) {
					console.error('提交订单异常：', err)
					uni.showToast({
						title: '网络异常，请稍后重试',
						icon: 'error',
						duration: 2000
					})
					this.fromData.goods_arr = []
				}
			},

			// 发起微信支付
			async startPayment(out_trade_no) {
				try {
					// 获取支付参数
					const payRes = await api.wechatpay({
						out_trade_no
					})

					if (payRes.code === 200 && payRes.data) {
						// 格式化支付参数（微信要求timeStamp为字符串）
						const payParams = {
							...payRes.data,
							timeStamp: payRes.data.timeStamp.toString(),
							nonceStr: payRes.data.nonceStr || '',
							package: payRes.data.package || '',
							signType: payRes.data.signType || 'MD5',
							paySign: payRes.data.paySign || ''
						}

						// 调用微信支付
						uni.requestPayment({
							...payParams,
							success: () => {
								uni.showToast({
									title: '预订成功',
									icon: 'success',
									duration: 2000
								})
								// 支付成功返回上一页
								setTimeout(() => uni.navigateBack({
									delta: 1
								}), 2000)
							},
							fail: () => {
								uni.showToast({
									title: '支付已取消',
									icon: 'none',
									duration: 2000
								})
							},
							complete: () => {
								this.fromData.goods_arr = []
							}
						})
					} else if (payRes.code === 202) {
						// 未绑定OpenID，自动绑定后重试
						await this.bindOpenIDAndPay(out_trade_no)
					} else {
						uni.showToast({
							title: payRes.msg || '获取支付参数失败',
							icon: 'error',
							duration: 2000
						})
					}
				} catch (err) {
					console.error('支付异常：', err)
					uni.showToast({
						title: '支付服务异常',
						icon: 'error',
						duration: 2000
					})
				}
			},

			// 绑定OpenID并重新支付
			async bindOpenIDAndPay(out_trade_no) {
				try {
					// 获取微信登录Code
					const loginRes = await new Promise((resolve, reject) => {
						uni.login({
							provider: 'weixin',
							success: resolve,
							fail: reject
						})
					})

					if (loginRes.code) {
						// 调用绑定接口
						const bindRes = await api.bindingOpenid({
							code: loginRes.code
						})
						if (bindRes.code === 200) {
							// 绑定成功，重新支付
							await this.startPayment(out_trade_no)
						} else {
							uni.showToast({
								title: '账号绑定失败',
								icon: 'none',
								duration: 2000
							})
						}
					} else {
						uni.showToast({
							title: '获取微信登录信息失败',
							icon: 'none',
							duration: 2000
						})
					}
				} catch (err) {
					console.error('绑定OpenID异常：', err)
					uni.showToast({
						title: '绑定服务异常',
						icon: 'none',
						duration: 2000
					})
				}
			}
		}
	}
</script>

<style scoped>
	/* 基础容器 */
	.container {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background-color: #f5f7fa;
		min-height: 100vh;
		padding-bottom: 120rpx;
		/* 给底部操作栏留空间 */
	}

	/* 1. 轮播图样式 */
	.carousel-container {
		position: relative;
		width: 100%;
	}

	.product-swiper {
		width: 100%;
		height: 450rpx;
	}

	.carousel-image {
		width: 100%;
		height: 100%;
	}

	.carousel-counter {
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 24rpx;
		padding: 6rpx 12rpx;
		border-radius: 14rpx;
		z-index: 10;
	}

	/* 2. 商品基础信息 */
	.product-base-info {
		background: #fff;
		padding: 24rpx;
	}

	.product-name {
		font-size: 34rpx;
		color: #333;
		font-weight: 500;
		line-height: 1.4;
		margin-bottom: 16rpx;
		display: block;
	}

	.product-tags {
		display: flex;
		gap: 12rpx;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}

	.primary-tag {
		background: #fff0f0;
		color: #e53e3e;
	}

	.origin-tag {
		background: #e6fff0;
		color: #22c55e;
		border: 1px solid #b8e986;
	}

	.fresh-tag {
		background: #e6f7ff;
		color: #1890ff;
	}

	.price-section {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.current-price {
		font-size: 40rpx;
		color: #e53e3e;
		font-weight: 600;
	}

	.original-price {
		font-size: 28rpx;
		color: #999;
		text-decoration: line-through;
	}

	.product-unit {
		font-size: 28rpx;
		color: #666;
	}

	.sales-volume {
		font-size: 26rpx;
		color: #999;
		margin-left: auto;
	}

	/* 3. 溯源卡片 */
	.traceability-card {
		background: #fff;
		margin: 16rpx;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.traceability-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.trace-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.trace-content {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.trace-logo {
		width: 120rpx;
		height: 120rpx;
		flex-shrink: 0;
	}

	.trace-info {
		flex: 1;
	}

	.trace-item {
		display: flex;
		margin-bottom: 10rpx;
	}

	.trace-label {
		font-size: 26rpx;
		color: #666;
		width: 140rpx;
		flex-shrink: 0;
	}

	.trace-value {
		font-size: 26rpx;
		color: #333;
		flex: 1;
	}

	/* 4. 商品详情面板 */
	.detail-panel {
		background: #fff;
		margin: 0 16rpx 16rpx;
		border-radius: 16rpx;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx;
	}

	.panel-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.rotate {
		transform: rotate(180deg);
		transition: transform 0.3s;
	}

	.panel-content {
		padding: 0 24rpx 24rpx;
	}

	.detail-image {
		width: 100%;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
	}

	.detail-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
	}

	.detail-section {
		margin-bottom: 24rpx;
	}

	.detail-section-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 12rpx;
		display: block;
	}

	/* 5. 购买区域 */
	.purchase-card {
		background: #fff;
		margin: 0 16rpx 16rpx;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.form-group {
		margin-bottom: 30rpx;
	}

	.form-group:last-child {
		margin-bottom: 0;
	}

	.form-label {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 16rpx;
		display: block;
	}

	/* 数量选择器 */
	.quantity-selector {
		display: flex;
		align-items: center;
		width: 300rpx;
	}

	.quantity-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f5f5;
		color: #333;
		font-size: 36rpx;
	}

	.quantity-btn.minus.disabled {
		background: #f1f1f1;
		color: #ccc;
	}

	.quantity-input {
		width: 140rpx;
		height: 80rpx;
		text-align: center;
		font-size: 30rpx;
		border-top: 1px solid #f5f5f5;
		border-bottom: 1px solid #f5f5f5;
	}

	/* 提货点选择 */
	.pickup-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.pickup-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border: 1px solid #e5e5e5;
		border-radius: 12rpx;
		transition: all 0.2s;
	}

	.pickup-item.selected {
		border-color: #1890FF;
		background: #f0f7ff;
	}

	.point-info {
		flex: 1;
	}

	.point-name {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		display: block;
		margin-bottom: 4rpx;
	}

	.point-address {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-bottom: 4rpx;
	}

	.point-time {
		font-size: 22rpx;
		color: #999;
		display: block;
	}

	.no-point {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 20rpx;
		color: #999;
		font-size: 26rpx;
	}

	.no-point text {
		margin-top: 20rpx;
	}

	/* 6. 预售规则 */
	.rules-card {
		background: #fff;
		margin: 0 16rpx 16rpx;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.section-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 20rpx;
		display: block;
	}

	.rules-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.rule-item {
		display: flex;
		align-items: flex-start;
		font-size: 26rpx;
		color: #666;
		line-height: 1.5;
	}

	.rule-icon {
		margin-right: 12rpx;
		margin-top: 6rpx;
	}

	.view-more {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #1890FF;
		margin-top: 10rpx;
		padding: 10rpx 0;
	}

	/* 7. 底部操作栏 */
	.footer {
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 120rpx;
		background: #fff;
		border-top: 1px solid #f0f0f0;
		padding: 0 24rpx;
	}

	.cart-btn {
		width: 140rpx;
		height: 70rpx;
		background: #f5f5f5;
		color: #333;
		border-radius: 35rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		gap: 8rpx;
		margin-right: 20rpx;
	}

	.total-info {
		flex: 1;
	}

	.total-label {
		font-size: 28rpx;
		color: #666;
	}

	.total-amount {
		font-size: 36rpx;
		color: #e53e3e;
		font-weight: 600;
	}

	.submit-btn {
		width: 280rpx;
		height: 80rpx;
		background: #1890FF;
		color: #fff;
		border-radius: 40rpx;
		font-size: 30rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.submit-btn:disabled {
		background: #a0cfff;
	}

	/* 8. 溯源弹窗 */
	.trace-popup {
		padding-bottom: 0;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.popup-title {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	.trace-detail {
		padding: 24rpx;
		max-height: 580rpx;
		overflow-y: auto;
	}

	.trace-qrcode {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 30rpx;
		border-bottom: 1px dashed #f0f0f0;
	}

	.trace-qrcode image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 16rpx;
	}

	.trace-qrcode text {
		font-size: 26rpx;
		color: #666;
	}

	.trace-process {
		margin-bottom: 30rpx;
	}

	.process-title {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 20rpx;
		display: block;
	}

	.process-steps {
		position: relative;
		padding-left: 30rpx;
	}

	.process-steps::before {
		content: '';
		position: absolute;
		left: 14rpx;
		top: 0;
		bottom: 0;
		width: 2rpx;
		background: #e5e5e5;
	}

	.process-step {
		position: relative;
		padding-bottom: 30rpx;
	}

	.process-step:last-child {
		padding-bottom: 0;
	}

	.step-dot {
		position: absolute;
		left: -30rpx;
		top: 0;
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		background: #e5e5e5;
	}

	.process-step.active .step-dot {
		background: #1890FF;
	}

	.step-line {
		position: absolute;
		left: -24rpx;
		top: 30rpx;
		width: 2rpx;
		height: calc(100% - 30rpx);
		background: #e5e5e5;
	}

	.process-step.active .step-line {
		background: #1890FF;
	}

	.step-info {
		padding-left: 10rpx;
	}

	.step-time {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-bottom: 4rpx;
	}

	.step-desc {
		font-size: 26rpx;
		color: #333;
	}

	.farmer-info {}

	.farmer-title {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 20rpx;
		display: block;
	}

	.farmer-card {
		display: flex;
		align-items: center;
		background: #fafafa;
		border-radius: 12rpx;
		padding: 20rpx;
	}

	.farmer-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.farmer-details {
		flex: 1;
	}

	.farmer-name {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		display: block;
		margin-bottom: 6rpx;
	}

	.farmer-cert {
		font-size: 24rpx;
		color: #1890FF;
		display: block;
		margin-bottom: 6rpx;
	}

	.farmer-experience {
		font-size: 22rpx;
		color: #666;
	}

	.verify-tag {
		display: flex;
		align-items: center;
		gap: 6rpx;
		font-size: 24rpx;
		color: #1890FF;
		background: #e6f7ff;
		padding: 6rpx 12rpx;
		border-radius: 4rpx;
	}

	/* 9. 规则弹窗 */
	.rules-popup {
		border-radius: 16rpx;
	}

	.rules-popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.rules-popup-header text {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.rules-popup-content {
		max-height: 500rpx;
		overflow-y: auto;
		padding: 24rpx;
	}

	.full-rule-item {
		display: flex;
		margin-bottom: 20rpx;
		line-height: 1.6;
	}

	.full-rule-item:last-child {
		margin-bottom: 0;
	}

	.rule-number {
		font-size: 26rpx;
		color: #1890FF;
		font-weight: 500;
		margin-right: 12rpx;
		flex-shrink: 0;
	}

	.rule-content {
		font-size: 26rpx;
		color: #666;
		flex: 1;
	}

	/* 响应式调整（小屏幕适配） */
	@media (max-width: 375px) {
		.product-swiper {
			height: 380rpx;
		}

		.footer {
			height: 100rpx;
		}

		.submit-btn {
			width: 220rpx;
			height: 70rpx;
			font-size: 28rpx;
		}

		.id-upload-area {
			flex-direction: column;
		}
	}
</style>