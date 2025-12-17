<template>
	<view class="box" @click="show=false">
		<image :src="item.imglogo" mode="aspectFill" @click="openBigImg(item.imglogo)"></image>
		<view class="regard">
			<view class="typetitle">
				<view>
					<text class="ellipsis">{{item.commodity_name}}</text>
					<uni-icons type="right" size="14" color="#ccc"></uni-icons>
				</view>
				<view @click="viewDetail" style="color: white; display: flex; align-items: center; justify-content: center; background-color: #ffd100; font-size:30rpx;padding: 30rpx; border-radius: 30rpx; font-weight: 400;">详情</view>
			</view>
			<view class="one" @click.stop="goToSuyuan(item)">溯源</view>
			<view class="price">
				<text>¥ {{item.price.toFixed(2)}} 元/{{item.weight_name}}</text>
				<view class="quantity">
					<view class="btn1" @click.stop="reduce">-</view>
					<view class="count1" @click.stop="showInput" :catchtouchmove="null">
						<text v-if="!show">{{getTempCount(item.id)}}</text>
						<textarea :adjust-position="false" v-if="show" v-model="count" @blur="overInput"
							:auto-height="false" fixed class="input" :focus="show" @input="changeTextarea"
							adjust-position="true"></textarea>
					</view>
					<view class="btn2" @click.stop="add">+</view>
				</view>
			</view>
		</view>
		<view v-if="OpenImg" class="dialog-mask-img" @click="OpenImg = false">
			<view class="showImg">
				<uni-icons mode="scaleToFill" type="closeempty" style="position: absolute; right: 5rpx; top: 10rpx;"
					size="20px" @click="OpenImg = false"></uni-icons>
				<image :src="selectImgUrl" mode="scaleToFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { useCartStore } from '@/store/cart';
	import { api } from '@/api/index.js';

	export default {
		name: "menuBarVue",
		props: ['item'], // 保留原有 props
		data() {
			return {
				show: false,
				count: '',
				OpenImg: false,
				selectImgUrl: null,
				cartStore: null // 2. 初始化 Pinia 实例容器
			};
		},
		created() {
			this.cartStore = useCartStore();
			
			// console.log('这是父组件的传值',this.item)
		},
		computed: {
			getTempCount() {
				return (itemId) => {
					const targetGoods = this.cartStore.carts.find(
						goods => goods.id === itemId && goods.shop_id === this.item.shop_id
					);
					
					return targetGoods ? targetGoods.tempCount:0
				};
			}
		},
		methods: {
			viewDetail() {
				uni.navigateTo({
					url: `/pages/commodityDetail/commodityDetail?query=${JSON.stringify(this.item)}`
				});
			},
			// 放大图片（保留原有逻辑）
			openBigImg(url) {
				// this.OpenImg = true
				// this.selectImgUrl = url
			},
			changeTextarea(e) {},
			add() {
				this.cartStore.addItem(this.item);
				this.count = '';
			},
			reduce() {
				console.log(this.item);
				// 调用 Pinia 的 subItem action（确保 Pinia 中已定义该方法）
				this.cartStore.subItem({
					id: this.item.id,
					shop_id: this.item.shop_id // 传递 shop_id 用于精准匹配
				});
				this.count = '';
			},
			// 数值校验（保留原有逻辑）
			isNumeric(str) {
				return /^\d+(\.\d+)?$/.test(str);
			},
			// 结束输入值：替换原 Vuex 的 anyNumber mutation
			overInput(e) {
				if (this.isNumeric(e.detail.value)) {
					let value = Number(Number(e.detail.value).toFixed(1));
					// 调用 Pinia 的 anyNumber action（更新指定商品的数量）
					this.cartStore.anyNumber({
						...this.item,
						quantity: value // 传入新数量
					});
					this.count = value; // 备份输入值
				} else {
					uni.showToast({
						title: '数值有误',
						icon: 'error'
					});
					this.count = '';
				}
				this.show = false;
			},
			showInput() {
				this.$emit('showKeyboard', this.item);
				// this.count = ''
				// this.show = true
			},
			goToSuyuan(item) {
				uni.navigateTo({
					url: `/subPackages/aHouseholder/lookTraceability/lookTraceability?commodity_id=${item.id}`,
				});
			}
			// 5. 移除原 Vuex 的 mapMutations 扩展（已替换为 Pinia 直接调用）
		}
	};
</script>
<style>
	.showImg {
		position: relative;
		width: 500rpx;
		height: 500rpx;
		margin: 0 auto;
		opacity: 1;
		padding: 16rpx;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		margin: 20px;
		background-color: #fff;
	}

	.showImg image {
		margin-top: 30rpx;
		width: 96%;
		height: 92%;
	}

	.dialog-mask-img {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.input {
		border: 1rpx solid #007aff;
		text-align: center;
		height: 39rpx;
	}

	.box {
		padding: 5rpx;
		background-color: white;
		display: flex;
		height: 216rpx;
		border-radius: 10px;  /* 圆角卡片 */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);/* 阴影效果 */
	}

	image {
		height: 180rpx;
		width: 27%;
		line-height: 180rpx;
		border-radius: 15rpx;
		margin: auto 2%;
	}

	.regard {
		height: 100%;
		width: 71%;
		display: flex;
		flex-direction: column;
	}

	.typetitle {
		display: flex;
		justify-content: space-between;
		/* align-items: center; */
		height: 100rpx;
		width: 100%;
		line-height: 100rpx;
		color: black;
		font-size: 40rpx;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 10%;
	}

	.label {
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 20rpx;
		color: #007aff;
		/* background-color: #007aff; */
		display: flex;
	}

	.one {
		text-align: center;
		width: 70rpx;
		height: 20rpx;
		font-weight: bold;
		font-size: 25rpx;
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #ffd100;
		
		border-color: orange;
		color: #fff;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-top-right-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
	}

	.price {
		height: 50%;
		/* width: 100%; */
		padding: 0 10rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}

	.price>text {
		height: 50rpx;
		width: 50%;
		line-height: 50rpx;
		color: red;
		font-size: 35rpx;
		font-weight: 600;
		margin-bottom: 8rpx;

	}

	.quantity {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10rpx;
	}

	.btn1,
	.btn2 {
		font-size: 60rpx;
		width: 50rpx;
		height: 50rpx;
		background-color: #007aff;
		color: white;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content:center;
		border-radius: 50%;
		margin: 0 10rpx;
	}

	.count1 {
		width: 80rpx;
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
		/* position: fixed; */
		/* box-sizing: border-box; */
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		z-index: 1000;
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

		/* position: relative; */
		display: inline-block;
	}

	.badge {
		/* position: absolute; */
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
		/* position: fixed; */
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		transition: opacity 0.3s ease;
		opacity: 0;
		pointer-events: none;
		z-index: 999;
		left: 0;
	}

	.overlay-active {
		opacity: 1;
		pointer-events: auto;
		/* 激活状态下可点击 */
	}

	.cart-layer {

		background-color: white;
		/* padding: 20rpx; */
		padding-top: 0;
		border-radius: 50rpx 50rpx 0 0;
		width: 100%;
		/* max-width: 600rpx; */
		transition: transform 0.3s ease;
		/* 平滑的从底部弹出效果 */
		transform: translateY(100%);
		/* Add any additional styling here */
	}

	.cart-layer-active {
		transform: translateY(0);
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
		margin-bottom: 130rpx;
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

	.biaoti {
		height: 100rpx;
		width: 100rpx;
		background-color: #007aff;
	}
</style>