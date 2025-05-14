<template>
	<view class="bank-card-container">
		<!-- 标题区域 -->
		<view class="header-section">
			<text class="title">我的银行卡</text>
			<text class="count">({{cardList.length}}张)</text>
		</view>

		<!-- 银行卡列表 -->
		<view class="card-list">
			<bCard 
				v-for="(item,index) in cardList" 
				:ref="index" 
				:key="index"  
				:info="item" 
				@remove="getCardDataList"
				class="card-item"
			/>
			
			<!-- 添加银行卡 -->
			<view class="add-card" @click="gotoAddCard">
				<uni-icons type="plusempty" size="24" color="#2979FF" />
				<text class="add-text">添加银行卡</text>
			</view>
		</view>
	</view>
</template>

<style lang="scss">
.bank-card-container {
	padding: 32rpx;
	background: #f5f6fa;
	min-height: 100vh;
}

/* 标题样式 */
.header-section {
	display: flex;
	align-items: baseline;
	margin-bottom: 48rpx;
	
	.title {
		font-size: 40rpx;
		font-weight: 600;
		color: #2d3436;
		margin-right: 16rpx;
	}
	
	.count {
		font-size: 28rpx;
		color: #a4a9b3;
	}
}

/* 卡片列表 */
.card-list {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	
	/* 银行卡组件容器 */
	.card-item {
		// background: linear-gradient(135deg, #6b5fff, #2979ff);
		border-radius: 24rpx;
		box-shadow: 0 8rpx 24rpx rgba(43, 76, 215, 0.15);
		transition: transform 0.2s ease;
		
		&:active {
			transform: scale(0.98);
		}
	}
}

/* 添加银行卡按钮 */
.add-card {
	height: 240rpx;
	background: #fff;
	border: 2rpx dashed #e0e3e9;
	border-radius: 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 32rpx;
	transition: all 0.2s ease;
	
	&:active {
		background: #f8f9fb;
	}
	
	.add-text {
		font-size: 28rpx;
		color: #2979FF;
		margin-top: 16rpx;
	}
}

/* 过渡动画优化 */
.fade-enter-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-leave-active {
	transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-20rpx);
}
</style>


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
		onShow(){
			this.getCardDataList()
		},
		methods: {
			// 任意点击关闭解除绑定
			handleTouch(event) {
				// 当解除按钮弹出才能触发关闭
				// 适配三端
				
				if ((event.type === 'touchstart' || event.type === 'click' || event.type === 'tap')) {
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
					status:2,
					page:1,
					limit:100
				}
				let {data} = await api.mybank(params)
				this.cardList = data.listdata
			}
		}
	}
</script>

