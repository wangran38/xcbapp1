<template>
	<view class="me-container">
		<!-- 输入区域 -->
		<view class="input-section">
			<view class="input-box">
				<input class="input-field" type="number" v-model.number="displayValue"
					:placeholder="'可提现总积分为 ' + (pagedata.hasmoney.toFixed(1) || '0')" inputmode="numeric" />
				<text class="withdraw-all" @click="handleWithdrawAll">提现全部</text>
			</view>
		</view>

		<!-- 转换金额显示 -->
		<view class="amount-display">
			<text class="amount-label">积分转换后的额度(元)</text>
			<view class="amount-value">{{displayValueConvert}}</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-section">
			<view class="submit-btn" @click="submitSettlement">申请结算</view>
		</view>

		<!-- 结算记录 -->
		<view class="record-section" @click="gotoSettrecords">
			<text class="record-text">积分结算记录</text>
			<uni-icons type="arrowright" size="16" color="#666" />
		</view>
	</view>
</template>

<style lang="scss">
	.me-container {
		padding: 40rpx;
		min-height: 100vh;
		background: #f8f8f8;
	}

	/* 输入区域 */
	.input-section {
		margin-bottom: 40rpx;

		.input-box {
			display: flex;
			align-items: center;
			background: #fff;
			border-radius: 12rpx;
			padding: 0 28rpx;
			height: 96rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

			.input-field {
				flex: 1;
				font-size: 32rpx;
				color: #333;
				height: 100%;

				&::placeholder {
					color: #999;
				}
			}

			.withdraw-all {
				color: #2979FF;
				font-size: 28rpx;
				margin-left: 20rpx;
				padding: 8rpx 16rpx;
				border-radius: 8rpx;
				background: rgba(41, 121, 255, 0.1);
			}
		}
	}

	/* 金额显示 */
	.amount-display {
		background: #fff;
		border-radius: 12rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

		.amount-label {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 16rpx;
			display: block;
		}

		.amount-value {
			font-size: 48rpx;
			color: #ff6b6b;
			font-weight: 600;
		}
	}

	/* 操作按钮 */
	.action-section {
		margin-bottom: 40rpx;

		.submit-btn {
			background: linear-gradient(135deg, #2979FF, #00B8FF);
			color: #fff;
			height: 96rpx;
			border-radius: 48rpx;
			font-size: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: opacity 0.2s;

			&:active {
				opacity: 0.9;
			}
		}
	}

	/* 结算记录 */
	.record-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		padding: 28rpx;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

		.record-text {
			font-size: 28rpx;
			color: #333;
		}
	}
</style>


<script>
	import {
		api
	} from '@/api/index'
	export default {
		data() {
			return {
				pagedata: {
					hasmoney: 0 // 给 truemoney 设置一个默认值
				},
				displayValue: '' // 需要提现的积分
			}
		},
		mounted() {
			this.fetchData(); // 在页面加载时调用接口
		},
		computed: {
			displayValueConvert: function() {
				return (this.displayValue/10).toFixed(1) || 0
			}
		},
		methods: {
			// 提取全部
			handleWithdrawAll() {
				this.displayValue = this.pagedata.hasmoney.toFixed(1)
			},
			async fetchData() {
				try {
					const response = await api.mysorce(); // 请求接口
					this.pagedata = response.data; // 将接口返回的数据保存到 pagedata 中
				} catch (error) {
					console.error("获取积分数据失败：", error); // 错误处理
				}
			},
			async submitSettlement() {
				if (!this.displayValue || isNaN(this.displayValue) || Number(this.displayValue) <= 0) {
					// 检查输入值是否有效
					uni.showToast({
						title: '请输入有效的积分数',
						icon: 'none'
					});
					return;
				}
				const shopscore = Number(this.displayValue);

				// 检查积分是否大于100
				if (shopscore < 100) {
					uni.showToast({
						title: '积分必须大于100',
						icon: 'none'
					});
					return;
				}
				try {
					const response = await api.settlement({
						shopscore
					});
					if (response.code === 200) {
						// 积分结算成功
						uni.showToast({
							title: '积分结算申请成功',
							icon: 'success'
						});
					} else {
						// 处理返回的错误信息
						uni.showToast({
							title: response.message || '积分结算失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error("提交请求失败", error); // 错误处理
					uni.showToast({
						title: '提交请求失败，请稍后重试',
						icon: 'none'
					});
				}
			},
			gotoSettrecords() {
				uni.navigateTo({
					url: '/pages/Settrecords/Settrecords'
				});
			},
		}
	}
</script>