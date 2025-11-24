<template>
	<view class="order-detail-page">
		<!-- 顶部标题栏 -->
		<view class="header">
			<view class="back-btn" @click="goBack"><text class="iconfont icon-fanhui"></text></view>
			<text class="title">订单详情</text>
		</view>
		<!-- 订单基础信息展示区 -->
		<view class="order-base-info">
			<view>
				<text class="info-label">订单编号：</text>
				<text class="order-id">{{out_trade_no}}</text>
			</view>

			<view>
				<text class="info-label">下单时间：</text>
				<text class="order-time">{{initTime(createtime)}}</text>
			</view>

		</view>
		<!-- 菜品信息展示区 -->
		<view class="product-info">
			<view class="product-list">
				<view class="product-item" v-for="(product, index) in productList" :key="index">
					<image :src="product.imglogo" class="product-img"></image>
					<view class="product-details">
						<text class="product-name">{{product.goodsname}}</text>
						<!--  <text class="product-quantity">{{product.goodsnum}}×{{product.price}}</text> -->
						<text class="product-quantity">{{product.price}}￥×{{product.goodsnum}}斤</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单金额信息展示区 -->
		<view class="order-amount-info">
			<view class="total-price">
				<text class="amount-label">菜品总价：</text>
				<text class="price-value">{{totalPrice}} 元</text>
			</view>

			<view class="other-fees">
				<text class="amount-label">其他费用：</text>
				<text class="price-value">{{otherFees}} 元</text>
			</view>
			<view class="total-amount">
				<text class="amount-label">应付总额：</text>
				<text class="price-value amount-total">{{totalAmount}} 元</text>
			</view>
		</view>
		<!-- 支付方式选择区 -->
		<view class="payment-methods">
			<view class="payment-method-item" v-for="(method, index) in paymentMethods" :key="index"
				@click="selectPaymentMethod(method)" :class="{ 'active': selectedPaymentMethod === method.code }">
				<uni-icons fontFamily="MyIconFont" :size="26" v-if="method.title=='积分支付'" color="#ee6770;">
					&#xe614;
				</uni-icons>
				<uni-icons fontFamily="MyIconFont" :size="26" v-if="method.title=='微信支付'" color="#09bb07;">
					&#xe600;
				</uni-icons>

				<uni-icons fontFamily="MyIconFont" :size="26" v-if="method.title=='数字人民币'" color="#ffd345;">
					&#xe78c;
				</uni-icons>
				<text class="payment-name">{{method.title}}</text>
			</view>
		</view>
		<!-- 支付按钮区 -->
		<view class="payment-btn-area">
			<button type="primary" @tap="prepay" :disabled="isTimeOut ||!selectedPaymentMethod"
				open-type="getAuthorize">{{isPayment?'已支付':'立即付款'}}</button>
		</view>
		<!-- 支付提示区 -->
		<view class="payment-tips">
			<text>请在{{countDownTime}}分钟内完成支付，逾期未支付订单将自动取消哦~</text>
		</view>
		<!-- 倒计时展示区 -->
		<view class="countdown-area">
			<text class="countdown-text">剩余时间：{{formattedCountDown}}</text>
		</view>

	</view>
</template>
<script>
	import {
		api
	} from '@/api';
	export default {
		data() {
			return {
				isPayment: false,
				out_trade_no: null, // 这里先写示例编号，实际由后端生成返回
				createtime: null, // 示例下单时间，实际由后端传递
				productList: [],
				totalPrice: 0, // 根据菜品单价和数量计算得出，示例价格
				otherFees: 0, // 其他费用
				totalAmount: 0, // 最终价格
				countDownTime: 15, // 设置倒计时时长，单位为分钟，可根据实际需求调整
				countDown: null, // 存储倒计时定时器实例
				isTimeOut: false, // 是否超时标志
				formattedCountDown: '', // 格式化后的倒计时显示文本
				PaymentTimer: null,
				paymentMethods: [{
						title: '微信支付',
						code: 1
					},
					{
						title: '积分支付',
						code: 2
					},
					{
						title: '数字人民币',
						code: 3
					}
				],
				selectedPaymentMethod: 2, // 用户选择的支付方式
				supportMethod: [1, 2] // 目前支付的支付方式
			};
		},
		mounted() {
			this.startCountDown();
			this.PaymentTimer = setInterval(async () => {
				let {
					data
				} = await api.getorderinfo({
					out_trade_no: this.out_trade_no
				})
				if (data.is_pay == 2 && data.success_time != '') {
					clearInterval(this.PaymentTimer);
					uni.redirectTo({
						url: `/pages/orders/orders?orderStatus=3`
					});
					// 关闭定时器

				}
			}, 2500)

		},
		beforeDestroy() {
			this.clearCountDown();
		},
		async onLoad(value) {
			// 加载订单号
			this.out_trade_no = value.out_trade_no
			let res = await api.myorders(value)
			if (res.code == 200) {
				let data = res.data.listdata[0]
				this.createtime = data.createtime
				this.productList = data.list_arr
				this.totalPrice = data.price
				this.totalAmount = this.totalPrice + this.otherFees
			} else {
				uni.showToast({
					title: res.msg || res.message,

				})
			}

		},
		onUnload() {
			clearInterval(this.PaymentTimer);
		},
		methods: {
			/**
			 * 格式化时间
			 */
			initTime(str) {
				let timestamp = new Date(str).getTime()
				var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1000) : new Date(parseInt(
					timestamp))
				var y = time.getFullYear() // 年
				var m = time.getMonth() + 1 // 月
				if (m < 10) {
					m = '0' + m
				}
				var d = time.getDate() // 日
				if (d < 10) {
					d = '0' + d
				}
				var h = time.getHours() // 时
				if (h < 10) {
					h = '0' + h
				}
				var mm = time.getMinutes() // 分
				if (mm < 10) {
					mm = '0' + mm
				}
				var s = time.getSeconds() // 秒
				if (s < 10) {
					s = '0' + s
				}
				var timeStr = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
				return timeStr
			},
			goBack() {
				// 实现返回上一页的逻辑，例如在uni-app中可以使用uni.navigateBack()
				uni.navigateBack();
			},

			// 选择支付方式
			selectPaymentMethod(method) {
				this.selectedPaymentMethod = method.code;
			},

			// 调用微信支付方法
			async startPayment(out_trade_no) {
				// 获取微信支付需要的参数
				let data = await api.wechatpay({
					out_trade_no: this.out_trade_no
				})
				if (data.code == 200) {
					data.data.timeStamp += ''
					uni.requestPayment({
						...data.data,
					})

				} else if (data.code == 202) { // 未绑定uid就自动绑定并重新支付
					uni.login({
						provider: 'true',
						success: async res => {
							// 绑定openid
							let idReseponse = await api.bindingOpenid({
								code: res.code
							})
							console.log(idReseponse, data)
							if (idReseponse.code == 200) {
								let data = await api.wechatpay({
									out_trade_no: this.out_trade_no
								})
								if (data.code == 200) {
									data.data.timeStamp += ''
									// 重新支付
									uni.requestPayment({
										...data.data,
									})
								} else {
									uni.showToast({
										title: data.message,
										icon: 'error'
									})
								}

							} else {
								uni.showToast({
									title: idReseponse.message,
									icon: 'error'
								})
							}
						},
					});

				} else {
					uni.showToast({
						title: data.msg || data.message,
						icon: 'error'
					})
				}
			},

			// 支付
			async prepay() {
				if (this.supportMethod.includes(this.selectedPaymentMethod)) {
					switch (this.selectedPaymentMethod) {
						// 微信支付
						case 1:
							this.startPayment(this.out_trade_no)
							break;

							// 积分支付
						case 2:
							//#ifdef  MP-WEIXIN
							/**
							 * 
							 * 用户订阅消息
							 */
							uni.getSetting({
								withSubscriptions: true, // 同时获取用户的订阅消息状态
								success: (res) => {
									if (!res.subscriptionsSetting.mainSwitch) {
										// 开启订阅消息
										// uni.requestSubscribeMessage({
										// 	tmplIds: [
										// 		'PN8Vc4Z5rWUHi05A6F-J73TkkpF4iHxkEtA6bIoFUPw'],
										// 	success: (res) => {
										// 		if (res[
										// 				'PN8Vc4Z5rWUHi05A6F-J73TkkpF4iHxkEtA6bIoFUPw'] ==
										// 			'accept') {
										// 		} else {
										// 		}
										// 	},
										// 	fail: (err) => {
										// 		console.log(err)
										// 	},
										// })
										// 如果没有订阅就弹窗提醒用户订阅
										uni.openSetting({
											withSubscriptions: true, // 这里设置为true，以便获取订阅消息的设置状态
											success(res) {
												console.log(res.subscriptionsSetting);
												// 根据res.subscriptionsSetting判断用户是否已经开启了订阅消息
											}
										});
									} else {
										console.log("用户已订阅")
									}

								}
							})
							//#endif


							let response = await api.payscore({
								out_trade_no: this.out_trade_no
							})
							console.log(response)
							if (response.code == 200) {
								uni.showToast({
									title: "支付成功",
									icon: 'success'
								})
								// 设置支付状态，为true
								this.isPayment = true
								this.clearCountDown() // 清空定时器

								clearInterval(this.PaymentTimer);
								uni.redirectTo({
									url: `/pages/orders/orders?orderStatus=3`
								});

							} else {
								uni.showToast({
									title: response.msg || response.message,
									icon: 'error'
								})
							}

							break;
						case 3:
							console.log("数字人民币")
							break;
					}

				} else {
					uni.showToast({
						title: '暂未开通' + this.paymentMethods[this.selectedPaymentMethod - 1].title,
						icon: 'error'
					})
				}

			},
			startCountDown() {
				let totalSeconds = this.countDownTime * 60;
				this.countDown = setInterval(async () => {
					if (totalSeconds <= 0) {
						this.isTimeOut = true;
						this.clearCountDown();
						console.log('订单超时，已自动取消');
						// 这里可以添加实际取消订单的业务逻辑，比如向后端发送请求告知订单取消等
						return;
					}
					const minutes = Math.floor(totalSeconds / 60);
					const seconds = totalSeconds % 60;
					this.formattedCountDown = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
					totalSeconds--;
				}, 1000);
			},
			// 清空定时器
			clearCountDown() {
				if (this.countDown) {
					clearInterval(this.countDown);
				}
			},
			padZero(num) {
				return num < 10 ? `0${num}` : num.toString();
			}
		}
	};
</script>

<style>
	@font-face {
		font-family: MyIconFont;
		src: url('../../../static/paymentMethodIcon/iconfont.ttf');
	}

	.iconfont {
		font-family: "MyIconFont";
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.order-detail-page {
		background-color: #f8f8f8;
		padding: 0;
		margin: 0;
		min-height: 100vh;
	}

	.header {
		background-color: #007bff;
		color: white;
		padding: 20rpx;
		display: flex;
		align-items: center;
	}

	.back-btn {
		text-decoration: none;
		color: white;
		margin-right: 20rpx;
	}

	.title {
		font-size: 40rpx;
		margin: 0;
	}

	.order-base-info {
		background-color: white;
		padding: 40rpx;
		margin: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

	}

	.info-label {
		font-size: 32rpx;
		color: #666;
		margin-right: 20rpx;
	}

	.order-id {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.order-time {
		font-size: 32rpx;
		color: #333;
	}

	.product-info {
		background-color: white;
		padding: 40rpx;
		margin: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	}

	.product-list {
		margin-bottom: 40rpx;
	}

	.product-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.product-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.product-details {
		flex: 1;
	}

	.product-name {
		font-size: 32rpx;
		margin: 0;
	}

	.product-spec {
		font-size: 28rpx;
		color: #666;
		margin: 0;
	}

	.product-quantity {
		font-weight: bold;
		font-size: 28rpx;
	}

	.order-amount-info {
		background-color: white;
		padding: 40rpx;
		margin: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	}

	.order-amount-info div {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.amount-label {
		font-size: 28rpx;
		color: #666;
	}

	.price-value {
		font-weight: bold;
		font-size: 32rpx;
	}

	.amount-total {
		color: red;
		font-size: 40rpx;
	}

	.payment-methods {
		background-color: white;
		padding: 40rpx;
		margin: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-around;
	}

	.payment-method-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		padding: 20rpx;
	}

	.payment-method-item.active {
		border: 4rpx solid #007bff;
		border-radius: 10rpx;
	}

	.payment-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}

	.payment-name {
		font-size: 28rpx;
		color: #333;
	}


	.payment-btn-area {
		margin: 40rpx;
		text-align: center;
	}

	.payment-tips {
		background-color: white;
		padding: 40rpx;
		margin: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.countdown-area {
		background-color: white;
		padding: 40rpx;
		margin: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.countdown-text {
		font-size: 32rpx;
		color: #333;
	}

	.shipping-info {
		background-color: white;
		padding: 40rpx;
		margin: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	}

	.shipping-address {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.receiver {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.phone {
		font-size: 32rpx;
		color: #333;
	}
</style>