<template>
	<view class="all">
		<view class="me-container">
			<view class="outlets">
				<view class="title">
					代理商
				</view>
				<view class="content">
					<view v-if="showStatus==0" class="item"
						@click="goToRouter('/subPackages/agent/cooperation/cooperation')">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightblue">{{'&#xe61a'}}</uni-icons>
						<view class="add-dishes">
							立即申请
						</view>
					</view>
					<view v-if="showStatus==2" class="item"
						@click="goToRouter('/subPackages/agent/datacenter/datacenter')">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightblue">{{'&#xe61a'}}</uni-icons>
						<view class="add-dishes">
							数据中心
						</view>
					</view>
					<view v-if="showStatus==2" class="item"
						@click="goToRouter('/subPackages/agent/AgentRevenue/AgentRevenue')">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightblue">{{'&#xe61a'}}</uni-icons>
						<view class="add-dishes">
							收益
						</view>
					</view>
					
				</view>

			</view>

			<!-- 			<view class="orders">
				<view class="title" @click="gotoOwneroders(0)">
					我的订单
				</view>
				<view class="content">
					<view class="item" @click="gotoOwneroders(1)">
						<uni-icons fontFamily="CustomFont" :size="26" color="red">{{'&#xe626;'}}</uni-icons>
						<view class="add-dishes">
							待支付
						</view>
					</view>
					<view class="item" @click="gotoOwneroders(3)">
						<uni-icons fontFamily="CustomFont" :size="26" color="red">{{'&#xe600;'}}</uni-icons>
						<view class="add-dishes">
							待收货
						</view>
					</view>
					<view class="item" @click="gotoOwneroders(5)">
						<uni-icons fontFamily="CustomFont" :size="26" color="red">{{'&#xe689;'}}</uni-icons>
						<view class="add-dishes">
							待结算
						</view>
					</view>
					<view class="item" @click="gotoOwneroders(6)">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightgreen">{{'&#xe60f;'}}</uni-icons>
						<view class="add-dishes">
							已结算
						</view>
					</view>
				</view>
			</view>
		 -->


		</view>
	</view>

</template>

<script>
	import {
		myMixin
	} from '@/utils/public.js'
	export default {
		mixins: [myMixin],
		data() {
			return {
				showStatus: null,
			}
		},
		onShow() {

		},
		async onLoad() {
			this.showStatus = await this.checkApplyStatus()
			console.log(this.showStatus,'申请状态')
			if (this.showStatus == 1){
				uni.showModal({
				  showCancel: false,
				  content: '申请审核中,请耐心等待',
				}).then(() => {
				  // uni.navigateTo({
				  //   url: '/pages/login/login'
				  // })
				})
			}
		},

		methods: {
			/**
			 * @description 路由跳转
			 */
			goToRouter(url) {
				try {
					uni.navigateTo({
						url
					});
				} catch {
					uni.switchTab({
						url
					});
				}
			},


			gotoOwneroders(orderStatus) {
				uni.navigateTo({
					url: `/pages/Ownerorders/Ownerorders?orderStatus=${orderStatus}`
				});
			},



		}
	}
</script>

<style>
	.tip {
		width: 100%;
		height: 100%;
		background-color: white;
		position: fixed;
	}

	.mencheng {
		border-radius: 10rpx;
		background-color: yellowgreen;
		margin-left: 40rpx;
		transition: background-color .8s;
	}

	.items {
		text-align: center;
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
	}

	@font-face {
		font-family: CustomFont;
		src: url('../../static/maicai/iconfont.ttf');
	}

	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 40rpx 0 40rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 4;
	}

	.dishes {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.outlets {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.orders {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.earnings {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
		margin-bottom: 20rpx;
	}

	.title {
		height: 80rpx;
		line-height: 80rpx;
		color: black;
		font-size: 32rpx;
		font-weight: 700;
		margin-left: 20rpx;
	}

	.content {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		gap: 30rpx;
		padding: 10rpx 10rpx;
	}

	.item {
		width: 180rpx;
		height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

	}

	.add-dishes {
		width: 100%;
		color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
</style>