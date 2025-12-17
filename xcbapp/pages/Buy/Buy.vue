<template>
	<view class="me-container">
		<scroll-view class="Stallholder" scroll-y="true" :style="{ height: '100vh' }">
			<view class="product-details">
				<!-- 商品列表 -->
				<view class="commodity">
					<view class="content">
						<view v-if="!cartList.length" class="empty-tip">暂无选购商品</view>
						<view class="item" v-for="(item, index) in cartList" :key="index">
							<view class="biaoti">
								<view>{{ item.shopTitle }}</view>
							</view>
							<view class="neirong">
								<view class="left">
									<image class="shopimg" :src="item.imglogo" mode="aspectFill"></image>
								</view>
								<view class="content">
									<view class="shoptitle">{{ item.commodity_name }}</view>
									<view class="shopprice">¥ {{ item.price }}</view>
								</view>
								<view class="right">
									<view class="btn1" @click="subItem(item)">-</view>
									<view class="count">{{ item.tempCount }}</view>
									<view class="btn2" @click="addItem(item)">+</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 取菜方式 -->
				<view class="Payment">
					<view style="width: 150rpx;">取菜方式</view>
					<uni-data-picker :localdata="methodItems" v-model="selectMethod" @change="onChangeMethod"
						:multiple="false"></uni-data-picker>
					<!-- <view>摊位自取<uni-icons type="right" size="14"></uni-icons></view> -->
				</view>

				<!-- 取货时间 -->
				<view class="Payment">
					<view style="width: 150rpx;">取货时间</view>
					<uni-datetime-picker type="datetime" :clear-icon="false" v-model="single" return-type="timestamp"
						@confirm="handleTimeConfirm" />
				</view>
			</view>

			<!-- 合计栏 -->
			<view class="total">
				<view class="numberpieces">
					<view>合计 ¥ {{ finalAmount }}</view>
					<view>共 {{ cartList.length }} 件</view>
				</view>
				<view class="submit-order" @click="addorder">提交订单</view>
			</view>
		</scroll-view>
	</view>
</template>


<script>
	import {
		useCartStore
	} from '@/store/cart';
	import {
		api
	} from '@/api';

	export default {
		data() {
			return {
				methodItems: [{
					"value": 1,
					"text": "摊位自取"
				}, {
					"value": 2,
					"text": "送货上门",
					"disable": true
				}], // 取菜方式列表
				selectMethod: null, // 已选择取菜方式

				totalCount: 0,
				cartList: [],
				pageData: [],
				shopDetails: {},
				cartItems: [],
				couponName: '选择优惠卷',
				couponPrice: '0.00',
				cartItemCount: 0,
				totalPrice: '0.00',
				paymentMethod: '请选择', // 初始值明确
				score: '',
				inputScore: '',
				isEditingScore: false,
				shop_id: '',
				single: 0, // 取货时间初始化为数字（timestamp）
				payway: 0, // 初始化支付方式标识，保证响应式
				cartStore: null // 提前初始化cartStore
			};
		},
		computed: {
			// 计算积分抵扣金额
			usableScoreAmount() {
				return parseFloat(this.inputScore / 10) || 0;
			},
			// 计算最终支付金额
			finalAmount() {
				// 修复：调用cartStore的方法，且统一shop_id类型
				const total = this.cartStore?.cartTotalByShopId(Number(this.shop_id)) || 0;
				const coupon = parseFloat(this.couponPrice) || 0;
				const scoreAmount = this.usableScoreAmount;
				return Math.max(total - coupon - scoreAmount, 0);
			},
			// 计算显示的支付方式（优化重复拼接问题）
			displayPaymentMethod() {
				if (this.isEditingScore) {
					return `使用积分 ${this.inputScore || 0}`;
				}
				// 避免重复拼接积分余额
				const baseText = this.paymentMethod;
				if (baseText.startsWith('积分支付') && this.score) {
					return baseText.includes('积分余额') ? baseText : `${baseText} (积分余额: ${this.score})`;
				}
				return baseText;
			},
			
			cartList(){
				return this.cartStore.getCartsByShopId(this.shop_id)
			}
		},
		created() {
			this.cartStore = useCartStore();
		},
		onLoad(query) {
			// 统一shop_id为数字类型
			this.shop_id = Number(query.id) || 0;
			// 初始化加载优惠券（可选）
			// this.loadCouponData();
			this.totalCount = this.cartStore.cartTotalByShopId(this.shop_id)
			// this.cartList = this.cartStore.getCartsByShopId(this.shop_id)
		},
		methods: {
			onChangeMethod({detail}) {
				this.selectMethod = detail.value[0].value
			},
			// 实现缺失的减少商品数量方法
			subItem(item) {
				// if (!item) return;
				// const currentCount = this.cartStore.getTempCount(item.id) || 1;
				// if (currentCount <= 1) return; // 数量最小为1
				// this.cartStore.changeGoodsNum(item.id, currentCount - 1);
				this.cartStore.subItem(item);
			},
			// 实现缺失的增加商品数量方法
			addItem(item) {
				this.cartStore.addItem(item);
				// if (!item) return;
				// const currentCount = this.cartStore.getTempCount(item.id) || 0;
				// this.cartStore.changeGoodsNum(item.id, currentCount + 1);
			},
			// 选择支付方式
			selectMethod() {
				const method = ['线上支付', '到付'];
				uni.showActionSheet({
					itemList: method,
					success: (res) => {
						this.paymentMethod = method[res.tapIndex];
					},
					fail: (err) => {
						console.log('选择支付方式失败:', err);
					}
				});
			},
			clearCart() {
				this.cartStore.clearCart(); // 替换为Pinia的清空方法
			},
			// 加载优惠券数据
			loadCouponData(id) {
				const couponData = uni.getStorageSync('coupon');
				if (!couponData) {
					this.couponPrice = '0.00';
					this.couponName = '选择优惠卷';
					return;
				}

				// 统一解析优惠券数据
				let parsedCoupon = couponData;
				if (typeof parsedCoupon === 'string') {
					try {
						parsedCoupon = JSON.parse(parsedCoupon);
					} catch (error) {
						console.error('解析优惠券失败:', error);
						return;
					}
				}

				// 兼容包装层数据
				if (parsedCoupon?.type === 'object' && Array.isArray(parsedCoupon.data)) {
					parsedCoupon = parsedCoupon.data;
				}

				if (Array.isArray(parsedCoupon)) {
					const matchedCoupon = parsedCoupon.find(item => item.id === parseInt(id));
					if (matchedCoupon) {
						this.couponName = matchedCoupon.coupon_name;
						this.couponPrice = matchedCoupon.price.toFixed(2);
					}
				}
			},
			// 获取用户积分
			async fetchUserProfile() {
				try {
					const response = await api.getUserProfile();
					if (response.code === 200) {
						this.score = response.data.score || 0;
					}
				} catch (error) {
					console.error('获取用户积分失败:', error);
					uni.showToast({
						title: '获取积分失败',
						icon: 'none'
					});
				}
			},
			// 取货时间确认
			handleTimeConfirm(e) {
				this.single = e.value; // 同步选择的时间戳
			},
			// 提交订单
			async addorder() {


				// 1. 获取当前店铺的购物车商品
				const orderItems = this.cartStore.getCartsByShopId(Number(this.shop_id)).map(item => ({
					goods_id: item.id,
					goodsname: item.commodity_name,
					price: item.price,
					goodsnum: item.tempCount || 0
				}));

				// 2. 校验商品为空
				if (!orderItems.length) {
					uni.showToast({
						title: '您还未选购商品,无法提交订单!!!!',
						icon: 'error',
						duration: 5000
					});
					return;
				}
				
				// 2. 校验商品为空
				if (!this.selectMethod) {
					uni.showToast({
						title: '您还未选择取菜方式',
						icon: 'error',
						duration: 5000
					});
					return;
				}

				// 校验取货时间
				if (!this.single || this.single === 0) {
					uni.showToast({
						title: '请选择取货时间',
						icon: 'error'
					});
					return;
				}


				try {
					// 组装订单数据    
					const shopId = Number(this.shop_id);
					const totalPrice = Number(this.cartStore.cartTotalByShopId(shopId));
					const goodsNum = this.cartStore.cartsLengthByShopId(shopId);

					const orderData = {
						pay_time: this.single, // 时间戳（后端若需字符串可转换：new Date(this.single).toLocaleString()）
						shop_id: shopId,
						goods_num: goodsNum, // 修复：调用cartStore的方法
						price: totalPrice,
						payprice: this.finalAmount, // 使用最终抵扣后的金额
						payway: this.payway,
						goods_arr: orderItems
					};

					// 6. 调用提交订单接口
					const response = await api.addorder(orderData);
					if (response.code === 200) {
						uni.showToast({
							title: '订单提交成功',
							icon: 'success',
							duration: 1500,
							complete: () => {
								setTimeout(() => {
									this.clearCart();
									uni.redirectTo({
										url: `/subPackages/PaymentModule/collectOnDelivery/collectOnDelivery?out_trade_no=${response.data.out_trade_no}`
									});
								}, 1500);
							}
						});
					} else if (response.code === 201) {
						uni.showToast({
							title: response.msg || '积分余额不足',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: '订单提交失败: ' + (response.msg || '未知错误'),
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('创建订单失败:', error);
					uni.showToast({
						title: '订单创建失败',
						icon: 'none'
					});
				}
			},
			// 积分输入失焦处理
			updatePaymentMethodOnBlur() {
				if (this.inputScore) {
					this.paymentMethod = `使用积分: ${this.inputScore}`;
					Vue.set(this, 'payway', 1); // 确保响应式
				} else {
					this.paymentMethod = '积分支付';
					Vue.set(this, 'payway', 1);
				}
				this.isEditingScore = false;
			},
			// 支付方式点击处理
			handlePaymentMethodClick() {
				this.showActionSheet();
			},
			// 显示支付方式选择面板
			showActionSheet() {
				const paymentMethods = ['积分支付'];
				uni.showActionSheet({
					itemList: paymentMethods,
					success: async (res) => {
						const selectedMethod = paymentMethods[res.tapIndex];
						this.paymentMethod = selectedMethod;

						if (selectedMethod === '积分支付') {
							await this.fetchUserProfile();
							Vue.set(this, 'payway', 1); // 响应式赋值
							// 拼接积分余额（仅一次）
							this.paymentMethod = `${selectedMethod} (积分余额: ${this.score})`;
						}
					},
					fail: (err) => {
						console.log('选择支付方式失败:', err);
					}
				});
			},
			// 跳转到优惠券页面
			gotousecou() {
				uni.redirectTo({
					url: '/pages/usecoupons/usecoupons'
				});
			}
		}
	};
</script>

<style scoped>
	.me-container {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		background-color: #f5f5f5;
	}

	.Stallholder {
		width: 100%;
		box-sizing: border-box;
	}

	.empty-tip {
		text-align: center;
		padding: 50rpx 0;
		color: #999;
		font-size: 28rpx;
	}

	.product-details {
		padding: 10rpx 20rpx;
	}

	.commodity .item {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 15rpx;
	}

	.biaoti {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
		font-size: 30rpx;
		font-weight: 500;
	}

	.neirong {
		display: flex;
		align-items: center;
	}

	.left .shopimg {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
	}

	.content {
		flex: 1;
		margin: 0 20rpx;
	}

	.shoptitle {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.shopprice {
		color: #ff4400;
		font-size: 30rpx;
		font-weight: 600;
	}

	.right {
		display: flex;
		align-items: center;
	}

	.right .btn1,
	.right .btn2 {
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1px solid #eee;
		border-radius: 6rpx;
		background-color: #fff;
		font-size: 30rpx;
	}

	.right .count {
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.Payment {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 12rpx;
		margin-bottom: 15rpx;
		font-size: 28rpx;
		color: #333;
	}

	.total {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
		border-top: 1px solid #eee;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.numberpieces {
		font-size: 28rpx;
		color: #333;
	}

	.numberpieces view:first-child {
		font-weight: 600;
		color: #ff4400;
		margin-bottom: 5rpx;
	}

	.submit-order {
		background-color: #ff4400;
		color: #fff;
		padding: 15rpx 40rpx;
		border-radius: 30rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.btn1:active,
	.btn2:active {
		background-color: #f5f5f5;
	}

	.submit-order:active {
		background-color: #e63e00;
	}
</style>