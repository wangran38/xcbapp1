<template>
	<view class="me-container">
		<view class="b-tabs">
			<scroll-view scroll-x>
				<view class="b-tabs-container">
					<view class="b-tabs-item" v-for="(item,index) in tabs1" :key="index"
						:class="{'b-tabs-active':tabs1Current == index}" @click="handleTabChange(index)">
						{{item}}
					</view>
				</view>
			</scroll-view>
		</view>
		<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower"
			:style="{ height: '100vh' }">
			<view class="list" v-for="item in pageData" :key="item.id">
				<view class="Order-number">
					<text class="orderstitle">订单号 </text>
					{{item.out_trade_no}}
				</view>
				<view class="title">
					<view>{{item.shop_name}}</view>
					<uni-icons type="right" size="20"></uni-icons>
				</view>
				<view class="content" v-for="goods in item.list_arr" :key="goods.id">
					<image class="logo" :src="goods.imglogo" mode="aspectFill"></image>
					<view class="info">
						<view class="cgname">{{goods.goodsname}}</view>
						<view class="detail">{{goods.content}}</view>
					</view>
					<view class="amount">
						<view>¥ {{goods.price}}</view>
						<view>× {{goods.goodsnum}}</view>
					</view>
				</view>
				<view class="orderTime">下单时间:{{initTime(item.createtime)}}</view>
				<view class="pay">
					<view class="paydetail">
						<view v-if="item.payway === 1">积分支付 </view>
						<view v-else>其他支付方式</view>
						<view class="Payprice"> {{item.payprice * 10}}</view>
					</view>
				</view>
				<view class="butt">
					<view class="buy" @click="goPay(item)">{{ buyButtonText }}</view>
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="popup" >
			<view style="background-color: white; border: 1rpx; border-radius: 5%; padding: 50rpx;">
				<view style="text-align: center; font-size: 30rpx; padding: 5rpx;">取货核销码</view>
				<view class="card" style="background-color: white; border: 1rpx; border-radius: 5%;">
					<uv-qrcode :value="out_trade_no"></uv-qrcode>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import {
		api
	} from '@/api/index'
	import usePage from '@/hooks/usePage';

	export default {
		data() {
			return {
				tabs1: ["全部", "待支付", "待收货", "已完成"],
				stastatus: [0, 1, 3, 4],
				tabs1Current: 0,
				pageData: [],
				out_trade_no: ''
			}
		},
		mixins: [usePage],
		// onShow() {
		// 	this.reloadData()
		// },
		onLoad(options) {
			this.orderStatus = options.orderStatus;
			if (this.orderStatus) {
				const index = this.stastatus.indexOf(Number(this.orderStatus));
				if (index !== -1) {
					this.tabs1Current = index;
				}
			}

			// 初次加载时请求数据
			this.reloadData();
		},
		computed: {
			buyButtonText() {
				let strtemp = ''
				switch (this.tabs1Current) {
					case 0:
						strtemp = '再买一单'
						break;
					case 1:
						strtemp = '去支付'
						break
					case 2:
						strtemp = '确认收货'
						break;
					case 3:
						strtemp = '已完成'
						break;
				}
				return strtemp;
			}
		},
		methods: {
			goPay(item) {
				this.out_trade_no = item.out_trade_no
				console.log()
				switch (item.status) {
					
					// 全部页面
					case 1:
						if (this.buyButtonText == '再买一单'){
							return ''
						}else{
							uni.navigateTo({
								url: `/subPackages/PaymentModule/collectOnDelivery/collectOnDelivery?out_trade_no=${item.out_trade_no}`
							})
						}
						break;
					case 2:

					case 3: // 确认收货基于订单号生成核销码并弹出
						this.$refs.popup.open('center')
						break

				}
			},
			/**
			 * 格式化时间
			 */
			initTime(str) {
				let timestamp = new Date(str).getTime()
				var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1000) : new Date(parseInt(
					timestamp))
				var y = time.getFullYear() // 年
				var m = time.getMonth() + 1 // 月
				if (m < 10) {
					m = '0' + m
				}
				var d = time.getDate() // 日
				if (d < 10) {
					d = '0' + d
				}
				var h = time.getHours() // 时
				if (h < 10) {
					h = '0' + h
				}
				var mm = time.getMinutes() // 分
				if (mm < 10) {
					mm = '0' + mm
				}
				var s = time.getSeconds() // 秒
				if (s < 10) {
					s = '0' + s
				}
				var timeStr = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
				return timeStr
			},
			handleTabChange(index) {
				this.tabs1Current = index;
				this.reloadData(); // 切换 tab 后重新加载数据
			},
			async fetchData(params) {
				const requestParams = {
					...params
				};

				// 只有 tabs1Current 不为 0 时才添加 status 参数
				if (this.tabs1Current !== 0) {
					requestParams.status = this.stastatus[this.tabs1Current]; // 传递具体状态
				}

				const response = await api.myorders(requestParams);
				return response.data;
			},
		}
	}
</script>

<style>
	.card {
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 400rpx;
		height: 400rpx;
		background-color: white;
	}

	.orderTime {
		z-index: 1;
		display: inline-block;
		position: relative;
		right: 0;
		top: 150rpx;
		font-size: 25rpx;
	}

	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 50rpx 0 50rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: black;
	}

	.b-tabs-container {
		height: 100rpx;
		line-height: 100rpx;
		/* background-color: aqua; */
		display: flex;
		justify-content: space-between;
	}

	.b-tabs-item {
		padding: 0 20rpx;
		font-size: 32rpx;
		color: black;
	}

	.b-tabs-active {
		color: #007aff;
		border-bottom: 2rpx solid #007aff;
		font-weight: bold;
	}

	.list {
		position: relative;
		/* height: 450rpx; */
		margin-top: 20rpx;
		padding: 20rpx 20rpx;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		background-color: #ffffff;
		border-radius: 20rpx;
	}

	.Order-number {
		height: 50rpx;
		line-height: 50rpx;
		color: #007aff;
		/* margin-top: 20rpx; */
	}

	.orderstitle {
		color: black;
		margin-right: 10rpx;
	}

	.title {
		height: 50rpx;
		line-height: 50rpx;
		display: flex;
		justify-content: flex-end;
	}

	.state {
		margin-left: auto;
		/* margin-right: 10rpx; */
	}

	.content {
		/* height: 160rpx; */
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
	}

	.logo {
		height: 160rpx;
		width: 190rpx;
		border-radius: 20rpx;
	}

	.info {
		margin-left: 20rpx;
		width: 50%;
		display: flex;
		flex-direction: column;
	}

	.amount {
		margin-left: auto;
		color: red;
		/* margin-right: 10rpx; */
		/* padding-right: 10rpx; */
	}

	.pay {
		height: 80rpx;
		/* line-height: 80rpx; */
		font-size: 34rpx;
		margin-top: 10rpx;
		/* text-align: end; */
		display: flex;
		align-items: center;
		justify-content: flex-end;
		/* padding-right: 10rpx; */
	}

	.paydetail {
		font-size: 28rpx;
		text-align: end;
		display: flex;
	}

	.Payprice {
		color: red;
		margin-left: 10rpx;
	}

	.butt {
		height: 80rpx;
		margin-top: 10rpx;
		/* padding: 0 10rpx; */
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.del {
		height: 60rpx;
		width: 25%;
		text-align: center;
		line-height: 60rpx;
		border: 1px solid #ccc;
		margin-right: 10rpx;
		border-radius: 60rpx;
	}

	.buy {
		z-index: 1;
		height: 60rpx;
		width: 25%;
		text-align: center;
		line-height: 60rpx;
		border: 1px solid #ccc;
		border-radius: 60rpx;
	}
</style>