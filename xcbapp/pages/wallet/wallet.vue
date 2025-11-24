<template>
	<view class="me-container">
		<view class="asset">
			<view class="card">
				<view class="Total-assets">
					<text>总资产(元)</text>
					<view class="money">
						{{shopmoney}}
					</view>
				</view>
				<view class="bottom">
					<view class="recharge">
						<text>累积收益</text>
						<view class="Cumulative-top-ups">
							0.00
						</view>
					</view>
					<view class="consume">
						<text>可提现</text>
						<view class="Cumulative-top-ups">
							{{shopmoney}}
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="Recording" @click="goToBillRecord">
					<uni-icons custom-prefix="iconfont" type="icon-wodexiaofei" size="30" color="#007aff"></uni-icons>
					<text class="text">账单记录</text>
				</view>
				<view class="Recording">
					<uni-icons custom-prefix="iconfont" type="icon-xiaofeijifenmingxi" size="30" color="#007aff" @click="goToweChatCashwWithdrawal"></uni-icons>
					<text class="text">申请提现</text>
				</view>
<!-- 				<view class="Recording">
					<uni-icons custom-prefix="iconfont" type="icon-xiaofei01" size="30" color="#007aff"></uni-icons>
					<text class="text">账单记录</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {api} from '@/api/index.js'
	export default {
		data() {
			return {
				shopmoney:null,
				mymoney:null
			}
		},
		onLoad(){
			api.mymoney({}).then((({data})=>{
				this.mymoney =  data.mymoney
				this.shopmoney  = data.shopmoney
			}))
		},
		methods: {
			goToBillRecord(){
				uni.navigateTo({
					url:'/subPackages/boothOwner/billRecord/billRecord'
				})
			},
			goToweChatCashwWithdrawal(){
				uni.navigateTo({
					url:'/pages/weChatCashwWithdrawal/weChatCashwWithdrawal'
				})
			}
		}
	}
</script>

<style>
	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 30rpx 0 30rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		/* 从顶部开始布局 */
		position: relative;
		/* 确保子元素的绝对定位是相对于这个容器 */
		height: calc(100vh - 10rpx);
		/* 确保容器占满整个视口高度 */
		color: black;
	}
	.asset{
		box-sizing: border-box;
		/* height: 200rpx; */
		width: 100%;
		padding: 20rpx;
		margin-top: 30rpx;
		border-radius: 20rpx;
		background-color: white;
	}
	.card{
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #007aff;
		border-radius: 20rpx;
		color: white;
	}
	.money{
		font-size: 40rpx;
	}
	.bottom{
		margin-top: 60rpx;
		/* background-color: aliceblue; */
		display: flex;
		justify-content: flex-start;
		margin-bottom: 60rpx;
	}
	.recharge, .consume{
		width: 50%;
		text-align: left;
	}
	.Cumulative-top-ups{
		font-size: 40rpx;
	}
	.item{
		margin-top: 60rpx;
		display: flex;
		justify-content: space-around;
	}
	.Recording{
		display: flex;
		flex-direction: column;
		text-align: center;
	}
	.text{
		color: #cbcbcb;
		margin-top: 10rpx;
	}
</style>
