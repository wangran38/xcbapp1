<template>
	<view>
		<view class="payCard">
			<view class="title">支付订单</view>
			<view class="money">￥{{remainingAmount}}</view>

			<view>
				<view class="prompt">
					订单应付￥{{remainingAmount}}
				</view>
				<view class="prompt">
					订单号：{{OrderNo}}
				</view>
				<view>
					<view class="option" v-for="(item) in playmenthodList" :key="item.code">
						<uni-icons fontFamily="MyIconFont" :size="26" v-if="item.title=='积分支付'" color="#ee6770;">
							&#xe614;
						</uni-icons>
						<uni-icons fontFamily="MyIconFont" :size="26" v-if="item.title=='微信支付'"  color="#09bb07;">
							&#xe600;
						</uni-icons>
						
						<uni-icons fontFamily="MyIconFont" :size="26" v-if="item.title=='数字人名币'" color="#ffd345;">
							&#xe78c;
						</uni-icons>
						
						<view>{{item.title}}</view>
						<view class="btn" @click="select(item.code)" :class="selectCode == item.code ? 'select' : ''">
						</view>
					</view>
				</view>

			</view>
			<view class="payBtn">
				支付 ￥{{remainingAmount}}
			</view>
		</view>
	</view>
</template>

<script>
	import {api} from '@/api';
	export default {
		data() {
			return {
				playmenthodList:[
					{title:'积分支付',code:0},
					{title:'微信支付',code:1},
					{title:'数字人名币',code:2},
				],
				selectCode:0,
				remainingAmount:'',
				OrderNo:''
			}
		},
		onLoad(value) {
			let {OrderNo,remainingAmount} = value;
			this.OrderNo = OrderNo;
			this.remainingAmount = remainingAmount
		},
		methods: {
			
			// 选择支付方式
			select(code){
				this.selectCode = code
				console.log(this.playmenthodList[code])
			}
		}
	}
</script>

<style>
	text{
		color: '';
	}
	@font-face {
		font-family: MyIconFont;
		src: url('../../../static/paymentMethodIcon/iconfont.ttf');
	}
	.iconfont {
	  font-family: "MyIconFont";
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	.payBtn {
		font-size: 30rpx;
		color: white;
		line-height: 80rpx;
		text-align: center;
		border-radius: 48rpx;
		width: 420rpx;
		height: 80rpx;
		background-color: #ff8c00;
		position: absolute;
		bottom: 20rpx;
		left: 60rpx;
	}
	
	.select{
		background-color: #ff8c00;
	}
	.btn {
		right: 100rpx;
		position: absolute;
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		border: 1rpx solid gray;
		text-align: center;
		line-height: 30rpx;
		color: red;
		font-size: 30rpx;
	}

	.prompt {
		color: #aeaabb;
		margin-bottom: 20rpx;
	}

	.option {
		position: relative;
		margin-top: 30rpx;
		padding-bottom: 10rpx;
		display: flex;
		border-bottom: 1rpx solid gainsboro;
	}

	.option view {
		margin-left: 10rpx;
	}


	page {
		overflow: hidden;
		background-color: #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.payCard {
		position: relative;
		padding: 20rpx;
		box-shadow: 1rpx 1rpx 12rpx 4rpx gainsboro;
		border-radius: 10rpx;
		margin: 150rpx;
		width: 500rpx;
		height: 600rpx;
		background-color: white;
	}

	.title {
		font-weight: bold;
		font-size: 35rpx;
	}

	.money {
		margin-top: 30rpx;
		font-size: 33rpx;
	}

	.title,
	.money {
		text-align: center;
	}
</style>