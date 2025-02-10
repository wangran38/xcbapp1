<template>
	<!-- <scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower" :style="{ height: '100vh' }"> -->
	<view class="me-container">
		<scroll-view class="Stallholder" scroll-y="true" :style="{ height: '100vh' }">
			<view class="product-details">
				<view class="commodity">
					<view class="content">
						<view class="item" v-for="item in getCartsByShopId(shop_id)" :key="item.id">
							<view class="biaoti">
								<view>{{item.shopTitle}}</view>
								<!-- <uni-icons type="right" size="14"color="#ccc"></uni-icons> -->
								<view><uni-icons type="right" size="14" color="#ccc"></uni-icons></view>
							</view>
							<view class="neirong">
								<view class="left">
									<image class="shopimg" :src="item.imglogo" mode="aspectFill"></image>
								</view>

								<view class="content">
									<!-- <text>标题</text> -->
									<view class="shoptitle">{{item.commodity_name}}</view>
									<!-- <view class="">价格</view> -->
									<view class="shopprice">¥ {{item.price.toFixed(2)}}</view>
								</view>

								<view class="right">
									<view class="btn1" @click="subItem(item)">-</view>
									<view class="count">{{ getTempCount(item.id) }}</view>
									<view class="btn2" @click="addItem(item)">+</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="Payment">
					<text>取菜方式</text>
					<view style="color: #ccc;">摊位自取<uni-icons type="right" size="14" color="#ccc"></uni-icons></view>
				</view>

				<!-- 				<view class="Payment" @click="selectMethod">
					支付方式
					<view style="color: #ccc;">{{paymentMethod}}<uni-icons type="right" size="14"
							color="#ccc"></uni-icons></view>
				</view> -->
				<view class="Payment">
					取货时间
					<uni-datetime-picker type="datetime" :clear-icon="false" v-model="single" return-type="timestamp" />
				</view>
			</view>

			<view class="total">
				<view class="numberpieces">
					<view>合计 ¥ {{ cartTotalByShopId(shop_id) }} </view>
					<view>共 {{ cartsLengthByShopId(shop_id)  }} 件</view>
				</view>
				<view class="submit-order" @click="addorder">提交订单</view>
			</view>
		</scroll-view>
	</view>

</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
	import {
		api
	} from '@/api';
	export default {
		data() {
			return {
				cart: [],
				pageData: [],
				shopDetails: {},
				cartItems: [],
				couponName: '选择优惠卷',
				couponPrice: '0.00',
				cartItemCount: 0,
				totalPrice: '0.00',
				paymentMethod: '请选择',
				score: '',
				inputScore: '',
				isEditingScore: false,
				shop_id: '',
				single: '',
			}
		},
		computed: {
			...mapState('cart', ['carts']),
			...mapGetters('cart', ['cartTotalByShopId', 'getTempCount', 'cartsLengthByShopId', 'getCartsByShopId']),
			// 计算积分金额
			usableScoreAmount() {
				return parseFloat(this.inputScore / 10) || 0; // 使用输入的积分数量作为金额
			},
			// 计算最终支付金额
			finalAmount() {
				const total = this.cartTotalByShopId;
				// const total = this.filteredCarts.reduce((sum, item) => {
				// 	return sum + (this.getTempCount(item.id) * item.price);
				// }, 0);
				const coupon = parseFloat(this.couponPrice) || 0;
				const scoreAmount = this.usableScoreAmount;
				// return total - coupon - scoreAmount < 0 ? 0 : total - coupon - scoreAmount;
				return Math.max(total - coupon - scoreAmount, 0);
			},
			// totalItemCount() {
			// 	return this.filteredCarts.reduce((total, item) => {
			// 		return total + this.getTempCount(item.id);
			// 	}, 0);
			// },
			// 计算显示的支付方式
			displayPaymentMethod() {
				if (this.isEditingScore) {
					return `使用积分 ${this.inputScore}`;
				}
				return this.paymentMethod + (this.paymentMethod.startsWith('积分支付') ? ` (积分余额: ${this.score})` : '');
			},

			currentShopId() {
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				// 从页面查询参数中获取 shop_id
				const query = currentPage.options;
				const shopId = Number(query?.id);
				return shopId;
			},
			// filteredCarts() {
			// 	return this.carts.filter(item => item.shop_id === parseInt(this.currentShopId));
			// },
		},


		mounted() {
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			// 从页面查询参数中获取 shop_id
			const query = currentPage.options;

			this.shop_id = query.id;
			// this.loadCartItems();
			// this.reloadData()
			// this.updateCartData();
			// this.loadShopDetails();
			// console.log('挂载时的 shop_id:', this.currentShopId);
			// this.$nextTick(() => {
			//         if (this.carts && this.carts.length > 0) {
			//             this.$forceUpdate();
			//         }
			//     })
		},


		methods: {
			selectMethod() {
				const method = ['线上支付', '到付'];
				uni.showActionSheet({
					itemList: method,
					success: async (res) => {
						const selectedMethod = method[res.tapIndex]; // 更新为用户选择的支付方式
						this.paymentMethod = selectedMethod;

						// 当支付方式为到付的话需要选择到付时间
						// if (this.paymentMethod == '到付'){
						// 	this.isShowSingle = true
						// }else{
						// 	this.isShowSingle = false
						// }

					},
					fail: (err) => {
						console.log('选择支付方式失败:', err);
					}
				});
			},

			...mapMutations('cart', ['addItem', 'subItem', 'clearCart']),
			clearCart() {
				this.$store.commit('cart/clearCart');
				// console.log('clearCart method called');
			},
			loadCouponData(id) {
				if (!id) {
					this.couponPrice = '';
					this.couponName = '选择优惠卷';
					return;
				}

				let couponData = uni.getStorageSync('coupon');

				// 如果 couponData 是字符串，则尝试解析为对象
				if (typeof couponData === 'string') {
					try {
						couponData = JSON.parse(couponData);
					} catch (error) {
						console.error('解析 coupon 数据失败:', error);
						return;
					}
				}

				// 检查是否有 type: "object" 的包装层
				if (couponData && couponData.type === 'object' && Array.isArray(couponData.data)) {
					couponData = couponData.data;
				}

				// 确保 couponData 是一个数组
				if (Array.isArray(couponData)) {
					const matchedCoupon = couponData.find(item => item.id === parseInt(id));
					if (matchedCoupon) {
						this.couponName = matchedCoupon.coupon_name;
						this.couponPrice = matchedCoupon.price.toFixed(2);
					}
				} else {
					console.error('coupon 数据格式不正确:', couponData);
				}
			},


			async fetchUserProfile() {
				const response = await api.getUserProfile();

				// 仅在成功时更新 score
				if (response.code === 200) {
					const {
						score
					} = response.data;
					this.score = score;
				}
			},



			async addorder(data) {
				const orderItems = this.getCartsByShopId(this.shop_id).map(item => ({
					goods_id: item.id,
					goodsname: item.commodity_name,
					price: item.price,
					goodsnum: item.tempCount
				}));

				if (!orderItems.length) {
					uni.showToast({
						title: '您还未选购商品,无法提交订单!!!!',
						icon: 'error',
						duration: 5000,
					})
					return;
				}




				try {
					//实际支付金额
					const remainingAmount = parseFloat(this.cartTotalByShopId(this.shop_id));
					const Totalpoints = parseFloat(this.score) / 10; //总积分
					// console.log('总积分:', Totalpoints);
					// console.log('实际支付金额:', remainingAmount);
					// console.log('支付方式:', this.paymentMethod);
					
					
					if (!this.single){
						uni.showToast({
							title:"还没选取货时间呢",
							icon:'error'
						})
						return
					}




					// 生成订单数据
					const orderData = {
						pay_time:this.single,
						shop_id: Number(this.shop_id),
						goods_num: this.cartsLengthByShopId(this.shop_id), // 商品数量
						price: Number(this.cartTotalByShopId(this.shop_id)), // 订单合计金额
						payprice: Number(this.cartTotalByShopId(this.shop_id)), // 实际支付金额
						payway: this.payway,
						goods_arr: orderItems // 商品数组
					};




					// // 调用提交订单接口
					
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
									})
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
							title: '订单提交失败: ' + response.msg,
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
			updatePaymentMethodOnBlur() {
				if (this.inputScore) {
					this.paymentMethod = `使用积分: ${this.inputScore}`;
					this.$set(this, 'payway', 1);
				} else {
					this.paymentMethod = '积分支付';
					this.$set(this, 'payway', 1);
				}
				this.isEditingScore = false; // 隐藏输入框
			},
			handlePaymentMethodClick() {
				// if (this.paymentMethod.startsWith('积分支付')) {
				// 	this.isEditingScore = !this.isEditingScore; // 切换输入框显示
				// 	if (!this.isEditingScore && this.inputScore) {
				// 		// 更新支付方式显示
				// 		this.paymentMethod = `使用积分: ${this.inputScore}`;
				// 	}
				// } else {
				this.showActionSheet();
				// }
			},
			showActionSheet() {
				// const paymentMethods = ['积分支付', '微信支付', '支付宝支付'];
				const paymentMethods = ['积分支付'];
				uni.showActionSheet({
					itemList: paymentMethods,
					success: async (res) => {
						// console.log('选择了' + paymentMethods[res.tapIndex] + '支付方式');
						const selectedMethod = paymentMethods[res.tapIndex]; // 更新为用户选择的支付方式
						this.paymentMethod = selectedMethod;
						// 如果用户选择了积分支付，调用 fetchUserProfile
						// 设置对应的 payway 值
						if (selectedMethod === '积分支付') {
							await this.fetchUserProfile(); // 获取积分余额
							this.payway = 1; // 积分支付对应的 payway 值
						} else if (selectedMethod === '微信支付') {
							this.payway = 2; // 微信支付对应的 payway 值
						} else if (selectedMethod === '支付宝支付') {
							this.payway = 3; // 支付宝支付对应的 payway 值
						}
						// 更新支付方式，并显示积分余额
						console.log('更新后的支付方式:', this.paymentMethod);
						this.paymentMethod += (selectedMethod === '积分支付' ? ` (积分余额: ${this.score})` : '');
					},
					fail: (err) => {
						console.log('选择支付方式失败:', err);
					}
				});
			},
			gotousecou() {
				uni.redirectTo({
					url: '/pages/usecoupons/usecoupons'
				});
			},
		}
	}
</script>

<style scoped>
	.uni-date-x {
		background-color: red !important;
	}

	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 20rpx 0 20rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* height: calc(100vh - 100rpx); */
	}

	.top {
		width: 100%;
		height: 100rpx;
		margin-top: 30rpx;
		border-radius: 15rpx;
		background-color: #007aff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.name {
		height: 50%;
		width: 50%;
		font-size: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #007aff;
		background-color: white;
		border-radius: 20rpx;
	}

	.product-details {
		height: auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-top: 30rpx;
		border: 1px solid #ccc;
		/* background-color: aqua; */
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.commodity {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 10rpx 20rpx;
		/* border-bottom: 1px solid #ccc; */
	}

	.shopimg {
		height: 140rpx;
		width: 160rpx;
		border-radius: 10%;
		background-color: antiquewhite;
	}

	.item {
		/* position: relative; */
		width: 100%;
		height: 220rpx;
		padding: 5rpx;
		/* background-color: aqua; */
		display: flex;
		flex-direction: column;
		border-bottom: 1rpx solid #ccc;
	}

	.right {
		width: 25%;
		height: 100%;
		/* background-color: cadetblue; */
		display: flex;
		justify-content: flex-end;
		/* 将子元素推到容器底部 */
		align-items: flex-end;
		/* 水平居中对齐 */
	}

	.btn1,
	.btn2 {
		width: 50rpx;
		height: 50rpx;
		background-color: #007aff;
		color: white;
		text-align: center;
		line-height: 50rpx;
		border-radius: 50%;
		margin: 0 10rpx;
	}

	.price {
		font-size: 32rpx;
		font-weight: 800;
		color: black;
	}

	.quantity {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.count {
		width: 20rpx;
		font-size: 30rpx;
		color: black;
		margin: 0 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.Payment {
		padding-left: 10rpx;
		height: 80rpx;
		/* background-color: chartreuse; */
		margin: 20rpx 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-radius: 20rpx;
		color: black;
		border: 1px solid #ccc;
	}

	.Payment:last-child {
		margin-bottom: 40rpx;
		/* 只对最后一个Payment元素增加底部的50rpx外边距 */
	}


	.numberpieces {
		color: black;
		display: flex;
		flex-direction: column;
		height: 80rpx;
		/* background-color: aqua; */
	}

	.submit-order {
		position: absolute;
		right: 10rpx;
		width: 25%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background-color: #007aff;
		border-radius: 50rpx;
	}

	.shopimg {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.shoptitle {
		color: black;
		font-size: 35rpx;
		font-weight: 600;
	}

	.shopprice {
		color: red;
		font-size: 35rpx;
		font-weight: 600;
	}

	.total {

		height: 100rpx;
		padding: 20rpx;
		border: 1px solid #ccc;
		border-radius: 20rpx;
		display: flex;
		position: absolute;
		left: 10rpx;
		right: 10rpx;
		bottom: 20rpx;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.biaoti {
		color: black;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-weight: 600;
		/* padding: 10rpx; */
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		/* background-color: #007aff; */
	}

	.neirong {
		width: 100%;
		height: 160rpx;
		display: flex;
		align-items: end;
	}

	.left {
		width: 55%;
		height: 100%;
		margin-right: 2%;
	}

	.inputjf {
		color: black;
		/* background-color: #007aff; */
		text-align: end;
	}

	.payment-method {
		color: black;
		/* 显示积分时的字体颜色 */
	}
</style>