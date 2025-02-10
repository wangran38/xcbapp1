<template>
	<view class="me-container">
		<view class="title">
			通知
		</view>
		<view class="content">
			<view class="one">因春节期间，打卡人数未能达到开奖的最低人数数量，暂时停止开奖赠送积分活动，具体下一次赠送积分活动安排请会员关注乡愁宝小程序等塔岭农贸菜市场市场管理部通知。</view>
		</view>
		<view class="luokuan">
			<view class="bomen">
				塔岭农贸市场办公室
			</view>
			<view class="dateTime">2025.2.02
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		}
</script>

<style>
	.one,.two,.three,.four{
		text-indent: 30rpx;
	}
	.me-container {
		position: relative;
		width: 100%;
		height: 200vh;
		box-sizing: border-box;
		padding: 0rpx 50rpx 00rpx 50rpx;
		color: white;
		z-index: 1;
		background-color: #d1d1d1;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		color: black;
	}

	.title {
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 34rpx;
		/* margin-top: 30rpx; */
		margin-bottom: 30rpx;
		/* background-color: aqua; */
	}
	.fixd{
		height: 100rpx;
		width: 80%;
		color: white;
		font-size: 30rpx;
		position: relative;
		top: 30rpx;
		left: 50%; /* 使元素相对于视口宽度居中 */
		transform: translateX(-50%); /* 将元素向左移动一半的自身宽度，实现居中对齐 */
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #007aff;
		border-radius: 20rpx;
	}
	.luokuan{
		margin-top: 20rpx;
		text-align: right;
		font-size: 25rpx;

	}
</style>