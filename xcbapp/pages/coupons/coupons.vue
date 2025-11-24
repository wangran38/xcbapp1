<template>
	<view class="me-container">
		<view class="content">
			<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower"
				:style="{ height: '100vh' }">
				<view class="yhq" :class="item.isUse?'use':''" v-for="item in pageData" :key="item.id" @click="click(item)">
					<view class="left">
						￥{{item.price}}
					</view>
					<view class="right">
						<view class="tit">
							{{item.coupon_name}}
						</view>
						<view class="desc">
							<view class="p">
								<!-- {{item.time}} -->
								有效期至: 2025年10月1日
							</view>
						</view>
					</view>
				</view>
				<view v-if="pageLoading" class="loading">加载中...</view>
				<view v-if="!hasMore" class="loading">没有更多了</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {api} from '@/api'; // 根据你的项目路径引入
	import usePage from '@/hooks/usePage';
	export default {
		data() {
			return {
				pageData: [],
			}
		},
		onShow() {
			// this.token = uni.getStorageSync('token');
			this.reloadData()
		},
		mixins: [usePage],
		methods: {
			async fetchData(params) {
				const response = await api.mycoupon(params)
				return response.data
			
			},
			
			click(item) {
				uni.showToast({
					title: "请在购买时使用优惠券",
					icon: "none"
				})
				item.isUse = true
			}
		}
	}
</script>

<style>
	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 80rpx 40rpx 0 40rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
	}

	.content {
		padding: 20rpx;
	}

	.yhq {
		width: 100%;
		height: 100px;
		margin-top: 15px;
		background-image: linear-gradient(to right, #fa709a 0%, #ff00ff 100%);
		-webkit-mask: radial-gradient(circle at 10px, #0000 10px, blue 0);
		-webkit-mask-position: -10px;
		-webkit-mask-size: 100% 30px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx 30rpx 20rpx 50rpx;
		box-sizing: border-box;
	}

	.use {
		filter: grayscale(1);
	}

	.left {
		width: 20%;
		font-size: 50rpx;
		font-weight: 700;
		color: #fff;
	}

	.right .tit {
		font-size: 33rpx;
		color: #fff;
		font-weight: 600;
	}

	.right .desc .p {
		font-size: 28rpx;
		color: #d8d8d8;
		margin-top: 10rpx;
	}
</style>