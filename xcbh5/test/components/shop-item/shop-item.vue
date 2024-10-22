<template>
	<view class="shoplist">
		<view class="fixed">
			<view class="car" @click="clickCart">
				<view class="cart-icon-wrapper">
					<uni-icons type="cart" size="40" color="white"></uni-icons>
					<view class="badge">{{ cartsLengthByShopId(shop_id) }}</view>
				</view>
				<view class="pri">¥ {{ cartTotalByShopId(shop_id) }}</view>
			</view>
			<view class="sett" @click="goToBuyPage">
				去结算
			</view>
		</view>

		<view class="overlay" v-if="showCartLayer">
			<scroll-view class="Stallholder" scroll-y @click.stop :style="{ height: '53vh' }">
				<view class="cart-layer" ref="cartLayer" @click.stop>
					<view class="Topmost">乡愁宝大市场</view>

					<view class="shopcontent">
						<view class="top">
							<view class="delete" @click="clearCart">
								<uni-icons type="trash" size="20"></uni-icons>
								<view class="">清空购物车</view>
							</view>
						</view>

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

				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
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
				showCartLayer: false
			};
		},
		computed: {
			...mapState('cart', ['carts']),
			...mapGetters('cart', ['cartTotalByShopId', 'getTempCount', 'cartsLengthByShopId','getCartsByShopId']),
		},
		methods: {
			...mapMutations('cart', ['addItem', 'subItem', 'clearCart']),
			clickCart() {
				this.showCartLayer = !this.showCartLayer
			},
			goToBuyPage() {
				uni.navigateTo({
					url: `/pages/Buy/Buy?id=${this.shop_id}`
				});
			},
			
			// 清空购物车
			clearCart() {
				// this.clearCart();
				this.$store.commit('cart/clearCart');
				console.log('clearCart method called');
			}
		}

	}
</script>

<style scoped>
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

	.Stallholder {
		margin-bottom: 150rpx;
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
		width: 45%;
		height: 100%;
		margin-right: 2%;
	}

	.img {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
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

	.count {
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

	.overlay {
		position: fixed;
		width: 100%;
		/* height: 100vh; */
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

	.cart-layer {}

	.cart-layer-active {
		/* transform: translateY(0); */
		/* 激活状态下弹出层回到视口内 */
	}

	.Topmost {
		height: 50rpx;
		width: 100%;
		line-height: 50rpx;
		border-radius: 50rpx 50rpx 0 0;
		background-color: #007aff;
		color: white;
		text-align: center;
	}

	.shopcontent {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.top {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		margin: 0rpx auto;
		border-bottom: 1rpx solid #ccc;
	}


	.delete {
		width: 30%;
		height: 70%;
		display: flex;
		margin: auto 0;
		margin-left: auto;
		justify-content: center;
		align-items: center;

	}

	.shopimg {

		width: 100%;
		height: 100%;
		border-radius: 20rpx;

	}

	.shoptitle {
		font-size: 35rpx;
		font-weight: 600;
	}

	.shopprice {
		color: red;
		font-size: 35rpx;
		font-weight: 600;
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
</style>