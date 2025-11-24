<template>
	<view class="me-container">
		<view class="content">
			<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower"
				:style="{ height: '100vh' }">
				<view class="yhq" :class="item.isUse ? 'use' : ''" v-for="item in pageData" :key="item.id"
					@click="toggleSelection(item)">
					<view class="left">
						￥{{item.price}}
					</view>
					<view class="right">
						<view class="tit">
							{{item.coupon_name}}
						</view>
						<view class="desc">
							<view class="p">
								有效期至: 2025年10月1日
							</view>
						</view>
					</view>
					<checkbox :checked="selectedCoupon === item.id" @change="toggleSelection(item)"></checkbox>
				</view>
				<view v-if="pageLoading" class="loading">加载中...</view>
				<view v-if="!hasMore" class="loading">没有更多了</view>
			</scroll-view>
		</view>
		<view class="ent" @click="gotobuy">
			确认
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api'; // 根据你的项目路径引入
	import usePage from '@/hooks/usePage';
	export default {
		data() {
			return {
				pageData: [],
				selectedCoupon: null // 当前选中的优惠券的索引
			};
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
			toggleSelection(item) {
				// 如果点击的优惠券已经是选中的，取消选中；否则，选中该优惠券
				if (this.selectedCoupon === item.id) {
					this.selectedCoupon = null; // 取消选中
					uni.removeStorageSync('coupon');
				} else {
					this.selectedCoupon = item.id; // 选中新的
					uni.setStorageSync('coupon', [item]);
				}
			},
			gotobuy() {
				// 使用 selectedCoupon 作为选中的优惠券 ID
				if (this.selectedCoupon !== null) {
					uni.redirectTo({
						url: `/pages/Buy/Buy?id=${this.selectedCoupon}`
					});
				} else {
					uni.showToast({
						title: '请选择优惠券',
						icon: 'none'
					});
				}
			}
		}
	};
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
		width: 30%;
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

	.ent {

		height: 100rpx;
		width: 90%;
		background-color: #007aff;
		border-radius: 20rpx;
		position: fixed;
		bottom: 40rpx;
		left: 50%;
		font-size: 40rpx;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
</style>