<template>
	<view class="me-container">
		<view class="asset">
			<view class="card">
				<view class="Total-assets">
					<text>总积分</text>
					<view class="money">
						{{ pagedata.score }}
					</view>
				</view>
				<view class="bottom">
					<view class="recharge">
						<text>累积收益</text>
						<view class="Cumulative-top-ups">
							0
						</view>
					</view>
					<view class="consume">
						<text>可提现</text>
						<view class="Cumulative-top-ups">
							{{ pagedata.truemoney  }}
						</view>
					</view>
					<view class="Not-received">
						<text>已结算</text>
						<view class="Cumulative-top-ups">
							{{ pagedata.paymoney }}
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="Recording" @click="goTopagesSettrecords">
					<uni-icons custom-prefix="iconfont" type="icon-wodexiaofei" size="30" color="#007aff"></uni-icons>
					<text class="text">账单记录</text>
				</view>
				<view class="Recording" @click="gotoPointspayouts">
					<uni-icons custom-prefix="iconfont" type="icon-xiaofeijifenmingxi" size="30" color="#007aff"></uni-icons>
					<text class="text">积分结算</text>
				</view>
				<!-- <view class="Recording">
					<uni-icons custom-prefix="iconfont" type="icon-xiaofei01" size="30" color="#007aff"></uni-icons>
					<text class="text">账单记录</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index'
	export default {
		data() {
			return {
				pagedata: {}
			}
		},
		mounted() {
			this.fetchData(); // 在页面加载时调用接口
		},
		methods: {
			goTopagesSettrecords(){
				uni.navigateTo({
					url: '/pages/Settrecords/Settrecords'
				});
			},
			// 请求摊主积分接口
			async fetchData() {
				try {
					const response = await api.mysorce(); // 请求接口
					this.pagedata = response.data; // 将接口返回的数据保存到 pagedata 中
				} catch (error) {
					console.error("获取积分数据失败：", error); // 错误处理
				}
			},
			gotoPointspayouts() {
				uni.navigateTo({
					url: '/pages/pointspayouts/pointspayouts'
				});
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
		height: calc(100vh -10rpx);
		/* 确保容器占满整个视口高度 */
		color: black;
	}

	.asset {
		box-sizing: border-box;
		/* height: 200rpx; */
		width: 100%;
		padding: 20rpx;
		margin-top: 30rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.card {
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #007aff;
		border-radius: 20rpx;
		color: white;
	}

	.money {
		font-size: 40rpx;
	}

	.bottom {
		margin-top: 60rpx;
		/* background-color: aliceblue; */
		display: flex;
		justify-content: space-between;
		margin-bottom: 60rpx;
	}

	.recharge,
	.consume,
	.Not-received {
		width: 33%;
		text-align: left;
	}

	.Cumulative-top-ups {
		font-size: 40rpx;
	}

	.item {
		margin-top: 60rpx;
		display: flex;
		justify-content: space-around;
	}

	.Recording {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.text {
		color: #cbcbcb;
		margin-top: 10rpx;
		text-align: center;
	}
</style>