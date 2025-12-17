<template>
	<view class="shoplist">
		<!-- #ifdef MP-WEIXIN -->
		<view class="overlay1" v-if="showCartLayer1">
		<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="overlay1" v-if="showCartLayer1">
			<!-- #endif -->

				<scroll-view class="Stallholder1" scroll-y :style="{ height: '53vh' }">
					<view ref="cartLayer" @click.stop>
						<view class="Topmost1">农链天下</view>
						<view class="shopcontent1">
							<view class="top1">
								<view class="delete1" @click="clearCart">
									<uni-icons type="trash" size="40rpx"></uni-icons>
									<view class="clear">清空购物车</view>
								</view>
							</view>
							<view class="content1">
								<view class="item" v-for="item in getCartsByShopId" :key="item.id">
									<view class="biaoti1">
										<view>{{item.shopTitle}}</view>
										<view><uni-icons type="right" size="14" color="#ccc"></uni-icons></view>
									</view>
									<view class="neirong1">
										<view class="left">
											<image class="shopimg1" :src="item.imglogo" mode="aspectFill"></image>
										</view>
										<view class="content1">
											<view class="shoptitle1">{{item.commodity_name}}</view>
											<view class="shopprice1">¥ {{item.price.toFixed(2)}}</view>
										</view>
										<view class="right">
											<view class="btn1" @click="subItem(item)">-</view>
											<view class="count1">{{ cartStore.getTempCount(item.id) }}</view>
											<view class="btn2" @click="addItem(item)">+</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<view class="fixed">
				<view class="car" @click.stop="clickCart">
					<view class="cart-icon-wrapper">
						<uni-icons type="cart" size="40" color="white"></uni-icons>
						<view class="badge">{{ cartsLengthByShopId }}</view>
					</view>
					<view class="pri">¥ {{ cartTotalByShopId }}</view>
				</view>
				<view class="sett" @click="goToBuyPage">
					去结算
				</view>
			</view>
		</view>
</template>

<script>
	import {
		useCartStore
	} from '@/store/cart';
	// 2. 导入 Vue 计算属性（用于映射 Pinia 状态）
	import {
		computed
	} from 'vue';

	export default {
		name: "shop-item",
		props: {
			shop_id: {
				type: [Number, String],
				default: ''
			}
		},
		data() {
			return {
				showCartLayer1: false,
				// 3. 初始化 cartStore 实例（选项式 API 中挂载到实例）
				cartStore: null
			};
		},
		created() {
			// 4. 在创建钩子中获取 Pinia 实例（确保组件生命周期内可访问）
			this.cartStore = useCartStore();
		},
		computed: {
			// 5. 替换 mapState('cart', ['carts'])：直接访问 Pinia 状态
			carts() {
				return this.cartStore.carts; // Pinia 状态直接访问
			},
			getCartsByShopId() {
				return this.carts.filter(item => item.shop_id === this.shop_id);
			},
			// 商品总价
			cartTotalByShopId() {
				// console.log("数值发生变化", this.carts);
				// 空值防护 + reduce 简化计算
				if (!Array.isArray(this.carts)) return 0;
				const total = this.carts.reduce((sum, item) => {
					// 容错：item 不存在/价格/数量为空时，按 0 计算
					const price = Number(item?.price) || 0;
					const count = Number(item?.tempCount) || 0;
					return sum + price * count;
				}, 0);
				// 保留 2 位小数（电商场景必备）
				return Number(total.toFixed(2));
			},
			cartsLengthByShopId() {
				// 计算当前店铺的购物车商品总数（按数量累加）
				return this.getCartsByShopId.reduce((count, item) => {
					return count + (item.tempCount || 1);
				}, 0);
			},
			getTempCount() {
				// 封装：根据商品 ID 获取数量（对应原 Vuex 的 getTempCount）
				return (itemId) => {
					const item = this.carts.find(i => i.id === itemId);
					return item ? item.quantity || 1 : 0;
				};
			}
		},
		methods: {
			addItem(item) {
				this.cartStore.addItem(item);
			},
			subItem(item) {
				this.cartStore.subItem(item);
			},
			clearCart() {
				// 清空当前店铺的购物车（而非全部）
				// 方案 A：如果 Pinia 有 clearCartByShopId 方法（推荐）
				// this.cartStore.clearCartByShopId(this.shop_id);

				// 方案 B：组件内过滤（如果 Pinia 未定义）
				this.cartStore.carts = this.cartStore.carts.filter(
					item => item.shop_id !== this.shop_id
				);
				console.log('当前店铺购物车已清空');
			},
			// 原有交互方法不变
			clickCart() {
				console.log(this.showCartLayer1);
				this.showCartLayer1 = !this.showCartLayer1;
			},
			goToBuyPage() {
				uni.navigateTo({
					url: `/pages/Buy/Buy?id=${this.shop_id}`
				});
			}
		}
	};
</script>
<style scoped>
	.delete1 {
		font-size: 33rpx;
	}

	.shoplist {

		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 99;
	}

	.item {
		width: 100%;
		height: 220rpx;
		padding: 5rpx;
		display: flex;
		flex-direction: column;
		border-bottom: 1rpx solid #ccc;
	}

	.Stallholder1 {
		margin-bottom: 150rpx;
	}

	.biaoti1 {
		color: black;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-weight: 600;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
	}

	.neirong1 {
		width: 100%;
		height: 160rpx;
		display: flex;
		align-items: end;
	}

	.left {
		width: 45%;
		height: 100%;
		margin-right: 2%;
	}

	.img {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.content1 {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.right {
		width: 25%;
		height: 100%;
		display: flex;
		justify-content: flex-end;
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

	.count1 {
		position: relative;
		top: -8rpx;
		width: 20rpx;
		font-size: 30rpx;
		color: black;
		margin: 0 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fixed {
		height: 100rpx;
		width: 90%;
		background-color: black;
		border-radius: 100rpx;
		position: fixed;
		/* box-sizing: border-box; */
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;

		z-index: 101;
	}

	.car {
		/* width: 280rpx; */
		flex: 1;
		height: 100%;
		color: white;
		/* background-color: aqua; */
		border-radius: 100rpx 0 0 100rpx;
		/* padding-left: 30rpx; */
		display: flex;
		justify-content: start;
		align-items: center;
		font-size: 40rpx;
		margin-left: 30rpx;
	}

	.pri {
		margin-left: 30rpx;
	}

	.cart-icon-wrapper {

		position: relative;
		display: inline-block;
	}

	.badge {
		position: absolute;
		top: -10rpx;
		/* Adjust to position the badge vertically */
		right: -10rpx;
		/* Adjust to position the badge horizontally */
		background-color: red;
		color: white;
		border-radius: 50%;
		font-size: 20rpx;
		/* Adjust font size */
		width: 40rpx;
		/* Width of the badge */
		height: 40rpx;
		/* Height of the badge */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sett {
		width: 200rpx;
		height: 100%;
		margin-left: auto;
		background-color: #007aff;
		border-radius: 0 100rpx 100rpx 0;
		color: white;
		font-size: 30rpx;
		text-align: center;
		line-height: 100rpx;
	}

	.overlay1 {
		position: fixed;
		width: 100%;
		border-radius: 30rpx 30rpx 0 0;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		transition: opacity 0.3s ease;
		z-index: 100;
		left: 0;
		bottom: 0;

	}

	.overlay-active {
		opacity: 1;
		pointer-events: auto;
		/* 激活状态下可点击 */
	}


	.Topmost1 {
		height: 50rpx;
		width: 100%;
		line-height: 50rpx;
		border-radius: 30rpx 30rpx 0 0;
		background-color: #007aff;
		color: white;
		text-align: center;
		position: fixed;
		z-index: 1000;
	}

	.shopcontent1 {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;

	}

	.top1 {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		margin: 0rpx auto;
		border-bottom: 1rpx solid #ccc;
	}


	.delete1 {
		width: 30%;
		height: 70%;
		display: flex;
		margin: auto 0;
		margin-left: auto;
		justify-content: center;
		align-items: center;

	}

	.shopimg1 {

		width: 100%;
		height: 100%;
		border-radius: 20rpx;

	}

	.shoptitle1 {
		font-size: 35rpx;
		font-weight: 600;
	}

	.shopprice1 {
		color: red;
		font-size: 35rpx;
		font-weight: 600;
	}

	.item {
		width: 100%;
		height: 220rpx;
		padding: 5rpx;
		display: flex;
		flex-direction: column;
		border-bottom: 1rpx solid #ccc;
	}
</style>