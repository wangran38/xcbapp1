<template>
	<view class="bigBox" @click="close" v-show="show">
		<view class="body" v-show="show" @click.stop="">
			<view class="value">
				{{value}}
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
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	export default {
		name: "inputBox",
		data() {
			return {
				show: false,
				value: '等待输入......',
				keys: [
					'1', '2', '3',
					'4', '5', '6',
					'7', '8', '9',
					'0', '.', '取消'
				],
				funs: [
					'删除',
					'清空',
					'确定',
				],
				lock: true // 键盘锁
			};
		},
		watch: {
			value(newValue, oldValue) {
				// 检测到小数点开头自动补0
				if (newValue[0] == '.') {
					this.value = '0' + this.value
				}
				let pub = newValue.split('.')
				// 检查是否出现多个小数点,出现则限制输入
				if (newValue.split('.').length - 1 > 1) {
					this.value = oldValue
				}
				// 检查开头不能出现两个00
				if (newValue == '00') {
					this.value = oldValue
				}
				// 限制小数点后只能出现一位
				try {
					if (newValue.split('.')[1].length >= 2) {
						this.value = oldValue
					}
				} catch {}

			},
			show(newValue, oldValue) {
				if (newValue) {
					this.value = this.getTempCount(this.cartItem.id) + ''
				}
			}
		},
		computed: {
			...mapGetters('cart', ['getTempCount']),
		},
		methods: {
			// state购物车自定义数量
			...mapMutations('cart', ['anyNumber']),
			isNumeric(str) {
				return /^\d+(\.\d+)?$/.test(str);
			},
			// 收起键盘
			close() {
				this.show = false
			},

			// 数字
			inputNum(num) {
				if (this.value == '0'){
					this.value = num
				}else{
					this.value += num
				}

			},
			// 功能函数
			func(lable) {
				console.log(lable)
				switch (lable) {
					case '删除':
						this.remove()
						break
					case '取消':
						this.close()
						break
					case '清空':
						this.clear()
						break
					case '确定':
						this.sure()
						// 确定值之前，需要检测是否为正常数字， 和转换为数字类型
						break
				}
			},
			remove() {
				this.value = this.value.substring(0, this.value.length - 1)
			},

			// 清空值
			clear() {
				this.value = ''
			},

			// 确认提交
			sure() {
				if (!this.value){
					this.cartItem.count = 0
					this.anyNumber(this.cartItem) // store保存数量
					this.show = false
				}
				// 判断是否为数字
				if (this.isNumeric(this.value)) {
					let value = Number(Number(this.value))
					this.cartItem.count = value
					this.anyNumber(this.cartItem) // store保存数量
					this.show = false
				} else {
				}
			},
		}
	}
</script>

<style>
	.bigBox {
		z-index: 100000;
		width: 100%;
		height: 100%;
		position: fixed;
		transition: opacity .5s;
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