<template>
	<view class="search-container">
		<view class="search-bar">
			<uni-icons type="search" size="18" color="#b2b2b2" />
			<input v-model="value" class="search-input" :placeholder="placeholder"
				placeholder-class="placeholder-style" />
			<button class="search-btn" @click="btn1">{{buttonText1}}</button>
			<button v-if="isShowbutton2" class="search-btn" @click="btn2" style="background-color: red;">{{buttonText2}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'mButton',
		data() {
			return {
				value: null
			}
		},
		methods: {
			/**
			 * 触发父组件事件
			 */
			btn1() {
				this.$emit('btn1',this.value)
			},
			btn2() {
				this.value = ''
				this.$emit('btn2',this.value)
			}
		},
		props: {
			placeholder: {
				required: false,
				default: '请输入关键字'
			}, // 提示词
			buttonText1: {
				required: false,
				default: '搜索'
			}, // 按钮文字
			buttonText2: {
				required: false,
				default: '清空',
			},
			isShowbutton2: {
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-container {
		.search-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			border-radius: 48rpx;
			// padding: 0 24rpx;
			padding: 10rpx 10rpx 10rpx 24rpx;
			height: 80rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

			.search-input {
				flex: 1;
				font-size: 28rpx;
				padding: 0 20rpx;
				color: #333;
			}

			.search-btn {
				font-size: 28rpx;
				color: #fff;
				background: #4a90e2;
				border-radius: 36rpx;
				padding: 0 36rpx;
				height: 64rpx;
				line-height: 64rpx;

				&::after {
					border: none
				}
			}
		}
	}
</style>