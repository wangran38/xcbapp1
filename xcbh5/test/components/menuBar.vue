<template>
	<view class="box" @click="show=false">
		<image :src="item.imglogo" mode="aspectFill" @click="openBigImg(item.imglogo)"></image>
		<view class="regard">
			<view class="typetitle">
				<text class="ellipsis">{{item.commodity_name}}</text>
				<uni-icons type="right" size="14" color="#ccc"></uni-icons>
			</view>
			<view class="label">
				<view class="one" @click="goToSuyuan(item)">
					溯源
				</view>
			</view>
			<view class="price">
				<text>¥ {{item.price.toFixed(2)}} 元/{{item.weight_name}}</text>
				<view class="quantity">
					<view class="btn1" @click="reduce">-</view>
					<view class="count1" @click.stop="showInput" :catchtouchmove="null">
						<text v-if="!show">{{getTempCount(item.id)}}</text>
						<textarea :adjust-position="false" v-if="show" v-model="count" @blur="overInput"
							:auto-height="false" fixed class="input" :focus="show" @input="changeTextarea"
							adjust-position="true"></textarea>
					</view>
					<view class="btn2" @click="add">+</view>
				</view>
			</view>
		</view>
		<view v-if="OpenImg" class="dialog-mask-img">
			<view class="showImg">
				<uni-icons mode="scaleToFill" type="closeempty" style="position: absolute; right: 5rpx; top: 10rpx;"
					size="25" @click="OpenImg = false"></uni-icons>
				<image :src="selectImgUrl" mode="scaleToFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	import {
		api
	} from '@/api/index.js'
	export default {
		name: "menuBarVue",
		data() {
			return {
				show: false,
				count: '',
				OpenImg: false,
				selectImgUrl: null
			};
		},
		methods: {
			// 放大图片
			openBigImg(url) {
				this.OpenImg = true
				this.selectImgUrl = url
			},
			changeTextarea(e) {

			},
			// 加一
			add() {
				this.addItem(this.item)
				this.count = ''
			},
			// 减一
			reduce() {
				this.subItem(this.item)
				this.count = ''
			},
			// isNumeric(str) {
			//     return /^\d+$/.test(str);
			// },

			// int float  校验
			isNumeric(str) {
				return /^\d+(\.\d+)?$/.test(str);
			},
			// 结束输入值
			overInput(e) {
				// 判断是否是正确数值
				if (this.isNumeric(e.detail.value)) {
					let value = Number(Number(e.detail.value).toFixed(1))
					this.item.count = value

					this.anyNumber(this.item) // store保存数量
					this.count = value // input表单保存备份
				} else {
					uni.showToast({
						title: '数值有误',
						icon: 'error'
					})
					this.count = ''
				}
				this.show = false
			},


			// 弹出键盘
			showInput() {
				this.$emit('showKeyboard', this.item)
				// this.count = ''
				// this.show = true
			},
			goToSuyuan(item) {
				uni.navigateTo({
					url: `/subPackages/aHouseholder/lookTraceability/lookTraceability?commodity_id=${item.id}`
				})
			},

			...mapMutations('cart', ['addItem', 'subItem', 'anyNumber']),
		},
		props: ['item'],
		computed: {
			...mapState('cart', ['carts']),
			...mapGetters('cart', ['getTempCount']),
		},
	}
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
		display: flex;
		height: 216rpx;
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
		font-size: 30rpx;
		padding: 20rpx;
		width: 18%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0.5rpx solid red;
		color: red;
		margin-right: 10rpx;
		z-index: 10
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
		font-size: 40rpx;
		width: 50rpx;
		height: 50rpx;
		background-color: #007aff;
		color: white;
		text-align: center;
		line-height: 45rpx;
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