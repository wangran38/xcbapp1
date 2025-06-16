<template>
	<view class="me-container">
		<view class="item">
			<view class="top">
				<view class="consequence">摇号结果</view>
			</view>
			
			<view class="nci">
				<view class="draw-time">摇号时间：{{initTime(Created)}}</view>
				<view class="Position">
					<view class="grades">
						<view class="grade"></view>
						<view class="middle">
							<!-- 一等奖：1个号码，左对齐 -->
							<view class="title one">
								<view class="dengji">一档幸运号码</view>
								<view class="pailie">
									<view v-for="item in yideng">
										{{ formatPhoneNumber(item.phone) }}
									</view>
								</view>
							</view>

							<!-- 二等奖：2个号码，使用Grid布局，左和中位置 -->
							<view class="title two">
								<view class="dengji">二档幸运号码</view>
								<view class="pailie grid">
									<view v-for="item in erdeng">
										{{ formatPhoneNumber(item.phone) }}
									</view>
								</view>
								
							</view>

							<!-- 三等奖：3个号码，左中右对齐 -->
							<view class="title three">
								<view class="dengji">三档幸运号码</view>
								<view class="pailie">
									<view v-for="item in sandeng">
											{{ formatPhoneNumber(item.phone) }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		

		<button @click="goTofreeGroceryShopping">参与活动说明</button>
	<!-- 	<view class="Notice">
			<view style="text-align: center; font-size: 40rpx;">
				{{getNowDate()}}
			</view>
			<view>今日打卡人次：{{signTotalData.todaynum}} <br>累计打卡人次：{{signTotalData.allnum}}</view>
		</view> -->
	</view>
</template>

<script>
	import { api } from '@/api/index';
	import {myMixin} from '@/utils/public.js'
	export default {
		data() {
			return {
				pagedData: [],
				totalnum: 0,
				totalPages: 0,
				yideng:[],
				erdeng:[],
				sandeng:[],
				Created:'',
				signTotalData:{},
			};
		},
		mixins: [myMixin],
		async onLoad() {
			this.fetchData()
			let res = await api.signTotal()
			this.signTotalData = res.data
		},
		methods: {

			goTofreeGroceryShopping(){
				uni.navigateTo({
					url:'/subPackages/shoppingPageList/freeGroceryShopping/freeGroceryShopping'
				})
				
			},
			
			async fetchData(params) {
				this.totalPages = Math.ceil(this.totalnum / 6);
				this.pagedData = []; // 清空之前的数据
				
				const querList = [
					{page:1,limit:1,type:1},
					{page:1,limit:3,type:2},
					{page:1,limit:8,type:3},
				]
				
				querList.forEach(async (item)=>{
					let {data} = await api.lottery(item)
					let type = data.listdata[0].type
					this.Created = data.listdata[0].Created
					switch (type){
						case 1:
							this.yideng = data.listdata
							break;
						case 2:
							this.erdeng = data.listdata
							break;
						case 3:
							this.sandeng = data.listdata
							break;
					}
				})
				
				
			},
			formatPhoneNumber(phone) {
				if (!phone) return '';
				return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			}
		}
	};
</script>

<style>
	.Notice view{
		padding: 20rpx;
		font-size: 25rpx;
		font-weight: bold;
		background-color: white;
		/* display: inline; */
	}
	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 50rpx 0 50rpx;
		color: white;
		z-index: 1;
		background-color: #f4f4f4;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: black;
	}

	.item {
		display: flex;
		flex-direction: column;
	}

	.top {
		margin-top: 30rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.consequence {
		font-size: 50rpx;
		font-weight: 600;
	}

	.draw-time {
		width: 100%;
		color: #686868;
		/* margin-top: 20rpx; */
		text-align: end;
		margin-bottom: 20rpx;
	}

	.grades {
		margin-bottom: 50rpx;
	}

	.grade {
		width: 100%;
		height: 50rpx;
		text-align: center;
		background-color: #f2510d;
		font-weight: 600;
		font-size: 38rpx;
		border-radius: 20rpx 20rpx 0 0;
	}

	.middle {
		padding: 10rpx 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: start;
		border-radius: 0 0 20rpx 20rpx;
		background-color: #ffffff;
	}

	.dengji {
		width: 100%;
		margin-bottom: 10rpx;
		font-weight: 700;
		color: black;
		/* background-color: #f2510d; */
	}

	.title {
		width: 100%;
		margin-top: 20rpx;
		font-size: 32rpx;
		display: flex;
		flex-direction: column;
	}

	/* Flexbox for general layout */
	.pailie {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}
	.pailie view{
		padding: 5rpx;
	}

	/* Grid layout for二等奖 */
	.pailie.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		/* 将网格分为三列 */
		grid-gap: 10rpx;
		/* 设定列间距 */
	}

	.grid-item:nth-child(1) {
		grid-column: 1;
		/* 占据第一列（左） */
	}

	.grid-item:nth-child(2) {
		grid-column: 2;
		/* 占据第二列（中） */
	}
</style>