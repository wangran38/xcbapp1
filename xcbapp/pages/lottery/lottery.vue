<template>
	<view class="me-container">
		<view class="first">
			<image class="img" src="http://h5.xcbdsc.com/static/one.jpg" mode=""></image>
			<view class="item">
				<view class="info">
					<view class="title">一等奖 </view>
					<view class="cost">
						价值  <text class="price"> 3000 积分</text>
					</view>
					<view class="time">
						开奖时间：2024/08/04 12：00
					</view>
				</view>
				<view class="draw" @click="jackpot({title: '一等奖 ', image: 'http://h5.xcbdsc.com/static/one.jpg', price: '3000 积分',  type: 1})">
					免费抽
				</view>
			</view>	
		</view>
		<view class="accessit">
			<image class="img" src="http://h5.xcbdsc.com/static/two.jpg" mode=""></image>
			<view class="item">
				<view class="info">
					<view class="title">二等奖 </view>
					<view class="cost">
						价值  <text class="price"> 1000 积分</text>
					</view>
					<view class="time">
						开奖时间：2024/08/04 12：00
					</view>
				</view>
				<view class="draw" @click="jackpot({title: '二等奖 ', image: 'http://h5.xcbdsc.com/static/two.jpg', price: '1000 积分',  type: 2})">
					免费抽
				</view>
			</view>
		</view>
		<view class="third">
			<image class="img" src="http://h5.xcbdsc.com/static/three.jpg" mode=""></image>
			<view class="item">
				<view class="info">
					<view class="title">三等奖 </view>
					<view class="cost">
						价值  <text class="price"> 500 积分</text>
					</view>
					<view class="time">
						开奖时间：2024/08/04 12：00
					</view>
				</view>
				<view class="draw" @click="jackpot({title: '三等奖 ', image: 'http://h5.xcbdsc.com/static/three.jpg', price: '500 积分',  type: 3})">
					免费抽
				</view>
			</view>
		</view>
		<view class="rules-box" @click="rules">
		      <text class="rules-text">规则</text>
		    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			rules() {
				uni.navigateTo({
					url: '/pages/rules/rules'
				});
			},
			jackpot(prize) {
				uni.navigateTo({
					// url: '/pages/jackpot/jackpot'
					url: `/pages/jackpot/jackpot?title=${prize.title}&image=${prize.image}&price=${prize.price}&type=${prize.type}`
				});
			}
		},
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
		background-color: #d1d1d1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: black;
		position: relative;
	}
	.first,.accessit,.third{
		height: 420rpx;
		/* width: 100%; */
		margin-top: 50rpx;
		padding: 20rpx 20rpx;
		border-radius: 10rpx;
		background-color: #fefefc;
	}
	
	
	.img{
		height: 280rpx;
		width: 100%;
		border-radius: 10rpx;
	}
	.item{
		height: 140rpx;
		display: flex;
		flex-direction: row;
	}
	.info{
		display: flex;
		flex-direction: column;
	}
	.title{
		font-size: 36rpx;
	}
	.cost{
		font-size: 26rpx;
		color: #d36a54;
	}
	.price{
		font-size: 36rpx;
		color:#fe4b09;
	}
	.time{
		font-size: 26rpx;
		color: #9c9c9c;
	}
	.draw{
		height: 80rpx;
		width: 200rpx;
		font-size: 32rpx;
		text-align: center;
		line-height: 80rpx;
		margin: auto 0 auto auto;
		color: white;
		border-radius: 40rpx;
		background-color: #ff4b10;
	}
	.rules-box {
	    position: absolute;
		width: 38rpx;
	    right: 1rpx;
	    top: 10%;
		text-align: center;
		display: flex;
		flex-direction: column;
	    /* transform: translateY(-50%); */
	    border-radius: 10rpx;
		background-color: #9c9c9c;
	  }
	  .rules-text {
	    font-size: 26rpx;
	    color: #007aff;
	  }
</style>