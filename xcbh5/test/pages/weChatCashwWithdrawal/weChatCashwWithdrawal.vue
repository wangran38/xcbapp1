<template>
	<view class="container">
		<!-- 账户信息 -->
		<view class="balance-box">
			<text class="title">可提现余额</text>
			<view class="amount">{{ shopmoney }}元</view>
		</view>

		<view class="input-section" style="position: relative;">
			<view style="position: absolute; right: 20rpx; top: 43%; font-size: 26rpx; z-index: 1000;" @click="amount = shopmoney">全部</view>
			<text class="label">提现金额（元）</text>
			<input class="input" type="digit" v-model="amount" placeholder="请输入提现金额" @input="validateAmount" />
			<view class="hint">单笔限额1-50000元</view>
		</view>

		<!-- 提现方式选择 -->
		<view class="method-section">
			<text class="section-title">提现到</text>
			<radio-group @change="selectMethod">
				<label class="method-item" v-for="item in methods" :key="item.value">
					<view style="display: flex; width: 100%; justify-content:space-between">
						<view>
							<uni-icons v-if="item.value == 'wechat'" fontFamily="MyIconFont" :size="26"
								color="#09bb07;">
								&#xe600;
							</uni-icons>
							<uni-icons v-if="item.value == 'card'" fontFamily="MyIconFont" :size="26">
								&#xe605;
							</uni-icons>
							<text
								style="margin: 7rpx 0 0 10rpx; font-size: 30rpx; position: absolute;">{{item.label}}</text>
						</view>
						<view>
							<radio :value="item.value" :checked="method === item.value" />
						</view>
					</view>

				</label>
			</radio-group>
		</view>

		<!-- 提交按钮 -->
		<button class="submit-btn" :disabled="disabled" @click="submitWithdraw">立即提现</button>

		<!-- 温馨提示 -->
		<view class="notice">
			<text class="notice-title">温馨提示：</text>
			<view>
				1. 提现申请将在1-3个工作日内到账;
			</view>
			<!-- 			<view>
				2. 单笔手续费{{ feeRate }}%（最低{{ minFee }}元）
			</view> -->
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	export default {
		data() {
			return {
				amount: null, // 输入金额
				method: 'wechat', // 默认选择微信
				disabled: true,
				methods: [{
						value: 'wechat',
						label: '微信零钱',
					},
					{
						value: 'card',
						label: '银行卡',
					}
				],
				feeRate: 0.1, // 手续费率
				minFee: 1.00, // 最低手续费
				shopmoney: null,   // 需要替换
				mymoney: null   // 需要替换
			}
		},
		onLoad() {
			this.updateMoney()
		},
		watch: {
			amount(newValue, oldValue) {
				// !!!!!!!  需要替换
				if (newValue <= this.shopmoney && newValue >= 1) {
					this.disabled = false
				} else {
					this.disabled = true
				}
			}
		},
		methods: {
			updateMoney(){
				api.mymoney({}).then((({
					data
				}) => {
					this.mymoney = data.mymoney
					this.shopmoney = data.shopmoney
				}))
			},
			// 金额校验
			validateAmount() {
				this.amount = this.amount.replace(/[^\d.]/g, '')
			},

			// 选择提现方式
			selectMethod(e) {
				this.method = e.detail.value
			},

			// 提交申请
			async submitWithdraw() {
				switch (this.method) {
					case 'wechat':
						// 微信支付暂不支持
						uni.showToast({
							icon:'error',
							title:'提现至微信暂不支持'
						})
						return;
					case 'card':
						// 银行卡支付
						break;
				}
				let data = await api.amount({mymoney: parseFloat(this.amount)})
				if(data.code == 200){
					uni.showToast({
						icon:'success',
						title:data.message
					})
					this.updateMoney()
				}else{
					uni.showToast({
						icon:'error',
						title:data.message
					})
				}

			}
		}
	}
</script>

<style scoped>
	@font-face {
		font-family: MyIconFont;
		src: url('../../static/paymentMethodIcon/iconfont.ttf');
	}

	iconfont {
		font-family: "MyIconFont";
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.container {
		padding: 20rpx 30rpx;
		background: #f5f5f5;
		min-height: 100vh;
	}

	.balance-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 40rpx;
		margin-bottom: 30rpx;
	}

	.title {
		font-size: 28rpx;
		color: #999;
	}

	.amount {
		font-size: 40rpx;
		/* color: #07b9b9; */
		font-weight: bold;
	}

	.input-section {
		background: #fff;
		padding: 30rpx;
		border-radius: 16rpx;
	}

	.label {
		font-size: 28rpx;
		color: #333;
	}

	.input {
		height: 100rpx;
		font-size: 40rpx;
		border-bottom: 2rpx solid #eee;
		margin: 20rpx 0;
	}

	.hint {
		font-size: 24rpx;
		color: #999;
	}

	.method-section {
		background: #fff;
		padding: 30rpx;
		border-radius: 16rpx;
		margin-top: 30rpx;
	}

	.section-title {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 30rpx;
	}

	.method-item {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.icon {
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
	}

	.name {
		flex: 1;
		font-size: 32rpx;
	}

	.submit-btn {
		background: #07b9b9;
		color: #fff;
		margin: 50rpx 0;
		border-radius: 50rpx;
	}

	.submit-btn[disabled] {
		background: #ccc;
	}

	.notice {
		padding: 30rpx;
		font-size: 24rpx;
		color: #999;
		line-height: 1.6;
	}
</style>