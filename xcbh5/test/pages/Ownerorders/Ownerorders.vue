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
					<!-- <view class="state">交易状态</view> -->
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
				<view class="pay">
					<view class="paydetail">
						<view v-if="item.payway === 1">积分支付 </view>
						<view v-else>其他支付方式</view>
						<view class="Payprice"> {{item.payprice * 10}}</view>
					</view>
				</view>
				<view class="butt">
					<!-- <view class="del">删除订单</view> -->
					<view class="buy">{{ tabs1[tabs1Current] }}</view>
				</view>
			</view>


		</scroll-view>
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
				tabs1: ["全部", "待支付","待收货", "待结算", "已结算"],
				stastatus: [0, 1, 3, 5, 6],
				tabs1Current: 0,
				pageData: [],
			}
		},
		mixins: [usePage],
		// onShow() {
		// 	this.reloadData()
		// },
		 onLoad(options) {
		     // 在页面首次加载时接收参数
		     this.orderStatus = options.orderStatus;
		     
		     // 根据传入的 orderStatus 进行处理（比如更新 tabs1Current）
		     if (this.orderStatus) {
		       // 假设你要根据 orderStatus 来选择 tab 的 index
		       const index = this.stastatus.indexOf(Number(this.orderStatus));
		       if (index !== -1) {
		         this.tabs1Current = index;
		       }
		     }
		     
		     // 初次加载时请求数据
		     this.reloadData();
		   },
		methods: {
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

				const response = await api.shopoder(requestParams);
				return response.data;
			},
		}
	}
</script>

<style>
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
		/* height: 450rpx; */
		margin-top: 20rpx;
		padding: 20rpx 20rpx;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		border-radius: 20rpx;
	}

	.Order-number {
		height: 50rpx;
		line-height: 50rpx;
		color: #007aff;
		/* margin-top: 20rpx; */
	}
	.orderstitle{
		color: black;
		margin-right: 10rpx;
	}

	.title {
		position: absolute;
		right: 0;
		height: 50rpx;
		line-height: 50rpx;
		display: flex;
		flex-direction: row;
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
		flex-direction: row;
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
		height: 60rpx;
		width: 25%;
		text-align: center;
		line-height: 60rpx;
		border: 1px solid #ccc;
		border-radius: 60rpx;
	}
</style>