<template>
	<view class="pop" v-show="show">
		<uni-transition ref="ani" custom-class="transition" mode-class="fade" :styles="styles" :show="true">
			<view class="card">
				<view class="bigTitle publicMargin">注册成功,获得大礼包</view>
				<view class="smaillTitle publicMargin">获得由"乡愁宝"官方送出的大礼包</view>
				<view class="money publicMargin">
					<uni-icons fontFamily="CustomFont" :size="26" color="yellow">{{'&#xe673;'}}</uni-icons>
					<view style="color: #f36018;">
						100抵扣金
					</view>
				</view>
				<view class="btn" @click="receive">
					领取
				</view>
			</view>
		</uni-transition>
	</view>
</template>

<script>
	export default {
		name: 'pop',
		data() {
			return {
				show: false,
				styles: {}
			}
		},

		onShow() {},
		methods: {
			receive(){
				console.log(this.$emit('receive'))
				this.show = false
			},
			custom() {
				this.$refs.ani.step({
					translateX: '50px',
					scale: 1.5,
					opacity:0
				}, {
					timingFunction: 'linear',
					duration: 100
				})
				this.$refs.ani.step({
					translateX: '0px',
					scale: 1,
					opacity:1
				}, {
					timingFunction: 'linear',
					duration: 150
				})

				this.$refs.ani.run()
			}

		}
	}
</script>

<style>
	.btn{
		padding: 5rpx;
		width: 380rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		background-color: red;
		margin: 0 auto;
		position: relative;
		top: 100rpx;
		border-radius: 10rpx;
		background-color: #00e897;
		
	}
	.publicMargin {
		margin-top: 15rpx;
	}

	.money {
		display: flex;
		position: absolute;
		left: 140rpx;
		font-size: 35rpx;
	}

	@font-face {
		font-family: CustomFont;
		src: url('../../../static/maicai/iconfont.ttf');
	}

	.card {
/* 		position: relative;
		left: 130rpx;
		top: 400rpx; */
		background-color: white;
		padding: 20rpx 30rpx 30rpx 30rpx;
		width: 450rpx;
		height: 280rpx;
		border-radius: 30rpx;

	}

	.bigTitle {
		font-size: 40rpx;
		font-weight: bold;
		color: #393952;
	}

	.smaillTitle {
		font-size: 25rpx;
	}

	.pop {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;
		opacity: .9;
		background-color: #9c9c9c;
	}
</style>