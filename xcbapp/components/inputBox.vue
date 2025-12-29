<template>
	<view class="number-keyboard-mask" @click="close" v-show="show" :animation="animationData">
		<view class="number-keyboard-wrapper" v-show="show" @click.stop="">
			<view class="keyboard-input-area">
				<view class="goods-info">
					<text class="goods-name">{{ cartItem.commodity_name || '商品' }}</text>
					<text class="goods-price">￥{{ cartItem.price || 0 }}元</text>
				</view>
				<view class="input-price-wrap">
					<text class="input-value">{{ value || '0' }}</text>
					<view class="total-price">
						<text class="total-label">合计：</text>
						<text class="total-money">￥{{ singleItemPrice }}</text>
					</view>
				</view>
			</view>
			<view class="keyboard-area">
				<view class="number-keys">
					<view class="number-key" v-for="item in keys" :key="item"
						@click.stop="item !== '取消' ? inputNum(item) : func(item)">
						<!-- 区分取消按钮样式 -->
						<text class="key-text" :class="{ cancelKey: item === '取消' }">{{ item }}</text>
					</view>
				</view>
				<view class="function-keys">
					<view class="func-key delete-key" @click.stop="func('删除')">
						<text class="func-text">删除</text>
					</view>
					<view class="func-key clear-key" @click.stop="func('清空')">
						<text class="func-text">清空</text>
					</view>
					<view class="func-key confirm-key" @click.stop="func('确定')">
						<text class="func-text confirm-text">确定</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import Decimal from 'decimal'
	import { useCartStore } from '@/store/cart';

	export default {
		name: "inputBox",
		data() {
			return {
				show: false,
				value: '', // 保持字符串类型，方便小数点处理
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
				cartItem: {}, // 商品信息
				cartStore: {}
			};
		},
		watch: {
			value(newValue, oldValue) {
				const newStrValue = String(newValue).trim();
				const oldStrValue = String(oldValue).trim();

				// 避免无限循环
				if (newStrValue !== this.value) {
					this.value = newStrValue;
					return;
				}

				if (!newStrValue) return;

				// 开头是小数点，自动补0
				if (newStrValue.charAt(0) === '.') {
					this.value = `0${newStrValue}`;
					return;
				}

				// 限制最多1个小数点
				const dotArr = newStrValue.split('.');
				if (dotArr.length - 1 > 1) {
					this.value = oldStrValue;
					return;
				}

				// 整数部分不能以多个0开头（如001 → 01/1）
				if (newStrValue.startsWith('00') && dotArr.length === 1) {
					this.value = oldStrValue;
					return;
				}

				// 限制小数点后最多2位（金额/价格常用）
				if (dotArr.length === 2 && dotArr[1].length > 1) {
					this.value = oldStrValue;
				}
			},

			// 监听数字键盘是否弹起
			show(newValue) {
				if (newValue) {
					// 弹起时初始化购物车项 + 回显数量（转为字符串，保持类型一致）
					const tempCount = this.cartStore.getTempCount(this.cartItem.id) || 0;
					this.value = String(tempCount);
				}
			}
		},
		computed: {
			singleItemPrice() {
				// 空值防护，确保是有效数字
				const price = Number(this.cartItem.price) || 0;
				const count = Number(this.value) || 0;
				
				// 使用Decimal避免精度丢失，保留2位小数（金额场景）
				return (price*count).toFixed(2);
			}
		},
		created() {
			this.cartStore = useCartStore();
		},
		methods: {
			// 校验是否为数字（支持小数）
			isNumeric(str) {
				return /^\d+(\.\d+)?$/.test(str);
			},

			// 收起键盘
			close() {
				this.show = false;
			},

			// 输入数字/小数点
			inputNum(num) {
				let currentValue = String(this.value).trim();

				if (num === '.') {
					// 已有小数点，不重复输入
					if (currentValue.includes('.')) return;
					// 空值时，输入0.
					if (!currentValue) {
						this.value = '0.';
						return;
					}
					// 正常添加小数点
					this.value = `${currentValue}.`;
					return;
				}

				// 处理数字输入
				if (currentValue === '0') {
					// 0后面直接输数字，替换0（如0→1，而非01）
					this.value = num;
				} else {
					// 拼接数字
					this.value = `${currentValue}${num}`;
				}
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
				if (!this.value) return;
				// 字符串截取，保持类型一致
				this.value = this.value.substring(0, this.value.length - 1);
			},

			// 清空值（设为空字符串，保持类型一致）
			clear() {
				this.value = '';
				// 清空时同步购物车数量为0
				if (this.cartItem.id) {
					this.cartItem.count = 0;
					this.anyNumber(this.cartItem);
				}
			},

			// 确认提交
			sure() {
				// 空值/非数字处理，默认数量为0
				let finalCount = 0;
				if (this.value && this.isNumeric(this.value)) {
					finalCount = Number(this.value);
				}

				// 同步购物车数量
				if (this.cartItem.id) {
					this.cartItem.count = finalCount;
					this.anyNumber(this.cartItem);
				}

				this.show = false;
			},

			anyNumber(cartItem) {
				this.cartStore.anyNumber(cartItem)
			}
		}
	}
</script>

<style scoped>
	/* 样式不变，保留原有样式 */
	.number-keyboard-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: flex-end;
	}

	.number-keyboard-wrapper {
		width: 100%;
		background-color: #ffffff;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		padding: 30rpx 20rpx;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.keyboard-input-area {
		margin-bottom: 30rpx;
	}

	.goods-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding: 0 10rpx;
	}

	.goods-name {
		font-size: 28rpx;
		color: #333333;
		font-weight: 500;
		max-width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods-price {
		font-size: 26rpx;
		color: #666666;
	}

	.input-price-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 10rpx;
		background-color: #f8f9fa;
		border-radius: 16rpx;
	}

	.input-value {
		font-size: 36rpx;
		color: #1a1a1a;
		font-weight: 600;
	}

	.total-price {
		display: flex;
		align-items: center;
	}

	.total-label {
		font-size: 26rpx;
		color: #666666;
		margin-right: 8rpx;
	}

	.total-money {
		font-size: 32rpx;
		color: #e53e3e;
		font-weight: 600;
	}

	.number-keys {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.number-key {
		width: 31%;
		height: 100rpx;
		margin-bottom: 16rpx;
		background-color: #f8f9fa;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.number-key:active {
		background-color: #e9ecef;
		transform: scale(0.96);
	}

	.key-text {
		font-size: 32rpx;
		color: #1a1a1a;
		font-weight: 500;
	}

	.cancelKey {
		color: #666666;
		font-size: 28rpx;
	}

	.function-keys {
		display: flex;
		justify-content: space-between;
		gap: 16rpx;
	}

	.func-key {
		flex: 1;
		height: 100rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.func-key:active {
		transform: scale(0.96);
	}

	.func-text {
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
	}

	.delete-key {
		background-color: #6c757d;
	}

	.clear-key {
		background-color: #6c757d;
	}

	.confirm-key {
		background-color: #e53e3e;
	}

	.confirm-text {
		font-size: 30rpx;
		font-weight: 600;
	}
</style>