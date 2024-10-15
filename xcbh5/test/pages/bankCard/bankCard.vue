<template>
	<view class="bigBox" @tap="handleTouch">
		<view class="myCard">
			<text>我的卡</text>
			<text>({{cardList.length}}张)</text>
		</view>
		<bCard v-for="(item,index) in cardList" :ref="index" :key="index"  :info="item"></bCard>

		<view class="card add" @click="gotoAddCard">
			<uni-icons type="plusempty" size="20"></uni-icons>
			<view class="card-title">添加银行卡</view>
		</view>
	</view>
</template>

<script>
	import {api} from '../../api/index.js'
	import bCard from '../../components/bCard.vue'
	export default {
		data() {
			return {
				cardList:[
					]
			}
		},
		components: {
			'bCard': bCard
		},
		onLoad(){
			this.getCardDataList()
		},
		methods: {
			// 任意点击关闭解除绑定
			handleTouch(event) {
				// 当解除按钮弹出才能触发关闭
				// 适配三端
				
				if ((event.type === 'touchstart' || event.type === 'click' || event.type === 'tap')) {
					// 循环将所有组件的状态修改
					// this.moreStatus = false
					
					let count = 0
					let ele = this.$refs[count]
					while (ele){
						// 自增查询
						ele[0].moreStatus = false
						ele = this.$refs[++count]
					}
				}
			},
			// 跳转至添加银行卡页面
			gotoAddCard() {
				uni.navigateTo({
					url: '/pages/addCard/addCard'
				})
			},
			
			// 获取当前账号所有的银行卡信息
			async getCardDataList(){
				let params = {
					page:1,
					limit:100
				}
				let {data} = await api.mybank(params)
				this.cardList = data.listdata
			}
		}
	}
</script>

<style>
	.bigBox {
		min-height: 2000rpx;
		/* background: white; */
		margin: 15rpx 0 0 10rpx;
	}

	.myCard>text:first-child {
		font-weight: 500;
		font-size: 35rpx;
	}

	.myCard>text:last-child {
		color: darkgrey;
		font-size: 30rpx;
	}

	.card {
		margin: 10rpx 10rpx 10rpx 0;
		height: 100rpx;
		/* background: linear-gradient(to right, #ff8418, #fe3d3d); */
		background-color: red;
		border-radius: 15px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		display: flex;
		padding: 20px;
		color: white;
		font-family: Arial, sans-serif;
		position: relative;
	}

	.card-icon image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.card-title {
		font-size: 25rpx;
		margin: 3rpx 0 0 10rpx;
		flex: 1;
	}

	.edit {
		right: 30rpx;
		top: 110rpx;
		position: absolute;
	}

	.lift {
		position: absolute;
		color: black;
		right: 90rpx;
		top: 110rpx;
		background-color: white;
		border-radius: 15px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		padding: 10rpx;
		font-size: 26rpx;
	}


	.num {
		display: flex;
	}

	.num>view:first-child {
		margin-top: 5rpx;
		font-size: 30rpx;
		color: gainsboro;
	}

	.num>view:last-child {
		font-size: 30rpx;
		color: white;
	}

	.add {
		line-height: 18rpx;
		height: 20rpx;
		background-color: white;
		color: black;
		font-size: 20rpx;
		font-family: 'Courier New', Courier, monospace;
	}


	/* 过渡效果 */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>