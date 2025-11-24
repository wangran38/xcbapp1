<template>
	<view class="me-container">
		<view class="title">
			打卡记录
		</view>
		<view class="records">
			<view class="market">
				打卡市场
			</view>
			<!-- <view class="phone">
				手机号码
			</view> -->
			<view class="time">
				时间
			</view>
		</view>
		<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower"
			:style="{ height: 'calc(90vh - 200rpx)'}">
			<view class="record-item" v-for="item in pageData" :key="item.id">
				<view class="market" >
					{{item.marketname}}
				</view>
				<!-- <view class="phone">
					{{formatPhoneNumber(item.phone)}}
				</view> -->
				<view class="time">
					{{formatDate(item.Created)}}
				</view>
			</view>
		</scroll-view>
		<view class="lottery" @click="gotojackpot">
			免费抽奖
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
				const response = await api.signlist(params)
				return response.data		
			},
			formatPhoneNumber(phoneNumber) {
			    if (!phoneNumber) return ''; // 如果电话号码为空，返回空字符串
			    return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			},
			formatDate(dateString) {
			  return dateString.replace(/T/, ' ').replace(/(\+\d{2}:\d{2})/, '');
			},
			gotojackpot() {
				uni.navigateTo({
					url: '/pages/jackpot/jackpot'
				});
			},
			
		}
	}
</script>

<style>
	.me-container {
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 25rpx 0 25rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.title {
		font-size: 35rpx;
		color: black;
		text-align: center;
		margin-top: 50rpx;
	}

	.records {
		width: 100%;
		height: 50rpx;
		margin-top: 30rpx;
		color: black;
		/* background-color: aqua; */
		display: flex;
	}

	.market {
		width: 50%;
		height: 100%;
		/* background-color: bisque; */
		text-align: center;
	}

	/* .phone {
		width: 35%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	} */

	.time {
		flex: 1;
		height: 100%;
		/* background-color: aqua; */
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.record-item {
		width: 100%;
		color: black;
		/* background-color: #D3D3D3; */
	    display: flex;
		margin-top: 10rpx;
	    margin-bottom: 10rpx; /* 记录项之间的间距 */
		border-bottom: 1px solid #ccc;
	}
	
	
	.record-item .market {
	    width: 50%; /* 设置固定宽度 */
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
		overflow: hidden; /* 隐藏超出的内容 */
		white-space: nowrap; /* 强制不换行 */
		text-overflow: ellipsis; /* 显示省略号 */
	}
	
	/* .record-item .phone {
	    width: 30%; 
		height: 120rpx;
		line-height: 120rpx;
		overflow: hidden; 
		white-space: nowrap; 
		text-overflow: ellipsis; 
	} */
	
	.record-item .time {
	    flex: 1; /* 占据剩余空间 */
		height: 120rpx;
		line-height: 120rpx;
		overflow: hidden; /* 隐藏超出的内容 */
		white-space: nowrap; /* 强制不换行 */
		text-overflow: ellipsis; /* 显示省略号 */
	}
	.lottery{
		position: fixed;
		left: 50%;
		bottom: 50rpx;
		width: 90%;
		height: 120rpx;
		color: white;
		background-color: #007aff;
		transform: translateX(-50%);
		border-radius: 20rpx;
		text-align: center;
		line-height: 120rpx;
		font-size: 35rpx;
	}

</style>