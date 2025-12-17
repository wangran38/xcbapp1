<template>
	<view class="bigBox" @click="close" v-show="show" :animation="animationData">
		<view class="body" v-show="show" @click.stop="">
			<view class="value">

				<text style="font-size: 30rpx;">{{value}}</text>
				<text
					style="position: absolute; left: 20rpx; color: gray;">{{cartItem.commodity_name}}￥{{cartItem.price}}元/{{cartItem.weight_name}}</text>
				<text style="position: absolute; right: 20rpx; color: gray;">{{singleItemPrice}}元</text>

			</view>
			<view class="function">
				<view class="nums">
					<view class="num" v-for="item in keys" :key="item"
						@click.stop="item != '取消' ? inputNum(item): func(item)">
						{{item}}
					</view>
				</view>
				<view class="funs">
					<view class="fun" v-for="item in funs" @click.stop="func(item)">
						{{item}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "inputBox",
		props: {
			// 接收父组件传入的购物车项（必传）
			initialCartItem: {
				type: Object,
				required: true,
				default: () => ({})
			}
		},
		data() {
			return {
				show: false,
				value: '', // 初始值改为空字符串，而非非数字文本
				keys: [
					'1', '2', '3',
					'4', '5', '6',
					'7', '8', '9',
					'0', '.', '取消'
				],
				unit: '',
				funs: ['删除', '清空', '确定'],
				lock: true, // 键盘锁
				animationData: {},
				cartItem: {} // 初始化为空对象，而非数字 0
			};
		},
		watch: {
			value(newValue, oldValue) {
				if (!newValue) return; // 空值直接返回，避免后续计算

				// 1. 检测小数点开头，自动补0
				if (newValue[0] === '.') {
					this.value = '0' + newValue;
					return; // 补0后终止当前逻辑，避免重复处理
				}

				// 2. 限制多个小数点
				const dotCount = (newValue.match(/\./g) || []).length;
				if (dotCount > 1) {
					this.value = oldValue;
					return;
				}

				// 3. 限制开头多个0（仅允许 0 或 0.xx，不允许 00/000）
				if (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') {
					this.value = oldValue;
					return;
				}

				// 4. 限制小数点后最多1位
				const dotIndex = newValue.indexOf('.');
				if (dotIndex > -1 && newValue.length - dotIndex > 2) {
					this.value = oldValue;
					return;
				}

				// 5. 同步到购物车项（空值防护）
				if (this.cartItem && typeof this.cartItem === 'object') {
					const numValue = Number(this.value) || 0;
					this.cartItem.count = numValue;
					this.anyNumber(this.cartItem); // 同步到store
				}
			},

			// 监听数字键盘是否弹起
			show(newValue) {
				if (newValue) {
					// 弹起时初始化购物车项 + 回显数量
					this.cartItem = { ...this.initialCartItem }; // 深拷贝父组件传入的初始值
					this.value = this.getTempCount(this.cartItem.id) + '' || '';
				}
			}
		},
		computed: {
			// 计算单商品总价（空值防护 + Decimal 正确使用）
			singleItemPrice() {
				if (!this.cartItem || !this.cartItem.price || !this.value) return 0;

				// Decimal 容错：确保传入数字类型
				const price = new Decimal(Number(this.cartItem.price) || 0);
				const count = new Decimal(Number(this.value) || 0);
				return price.mul(count).toNumber().toFixed(2); // 保留2位小数
			}
		},
		methods: {
			// 校验是否为数字
			isNumeric(str) {
				return /^\d+(\.\d+)?$/.test(str);
			},

			// 收起键盘
			close() {
				this.show = false;
			},

			// 输入数字
			inputNum(num) {
				// 空值时输入0，直接赋值
				if (this.value === '' && num === '0') {
					this.value = '0';
					return;
				}
				// 非空时拼接
				this.value += num;
			},

			// 功能函数
			func(label) {
				switch (label) {
					case '删除':
						this.remove();
						break;
					case '取消':
						this.close();
						break;
					case '清空':
						this.clear();
						break;
					case '确定':
						this.sure();
						break;
				}
			},

			// 删除最后一位
			remove() {
				if (this.value) {
					this.value = this.value.substring(0, this.value.length - 1);
				}
			},

			// 清空值
			clear() {
				this.value = '';
				// 清空时同步购物车数量为0
				if (this.cartItem) {
					this.cartItem.count = 0;
					this.anyNumber(this.cartItem);
				}
			},

			// 确认提交
			sure() {
				// 空值/非数字处理
				if (!this.value || !this.isNumeric(this.value)) {
					this.cartItem.count = 0;
					this.anyNumber(this.cartItem);
					this.show = false;
					return;
				}

				// 合法数字处理
				const value = Number(this.value);
				this.cartItem.count = value;
				this.anyNumber(this.cartItem);
				this.show = false;
			},

			// 【实现缺失的方法】获取临时数量（示例：从本地/store获取）
			getTempCount(id) {
				// 这里替换为你的实际逻辑，比如从Pinia/本地存储获取
				const cartList = uni.getStorageSync('cartList') || [];
				const item = cartList.find(item => item.id === id);
				return item?.count || 0;
			},

			// 【实现缺失的方法】同步数量到store（示例）
			anyNumber(cartItem) {
				// 这里替换为你的Pinia同步逻辑，比如：
				// const cartStore = useCartStore()
				// cartStore.changeGoodsNum(cartItem.id, cartItem.count)
				uni.setStorageSync('cartList', (uni.getStorageSync('cartList') || []).map(item => {
					if (item.id === cartItem.id) return { ...item, count: cartItem.count };
					return item;
				}));
			}
		}
	}
</script>
<style>
	.bigBox {
		z-index: 100000;
		width: 100%;
		height: 100%;
		position: fixed;
	}

	.body {
		background-color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.function {
		font-size: 30rpx;
		display: flex;
		padding: 10rpx;
		background-color: gainsboro;
	}

	.value {
		border: 1rpx solid black;
		/* background-color:#007aff ; */
		border-radius: 10rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 30rpx;
		height: 80rpx;
	}

	.nums {
		width: 600rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;

	}

	.num {
		margin: 5rpx;
		flex: 1;
		width: calc((100% - 10px) / 2);
		min-width: calc((100% - 10px) / 4);
		max-width: calc((100% - 10px) / 3);
		border-radius: 10rpx;
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
		background-color: white;
	}

	.fun {
		border-radius: 5rpx;
		margin: 5rpx;
		text-align: center;
		line-height: 120rpx;
		width: 180rpx;
		height: 125rpx;
		background-color: #b9bcc4;
	}

	.num:active {
		background-color: gray;
	}

	.fun:active {
		background-color: white;
	}
</style>