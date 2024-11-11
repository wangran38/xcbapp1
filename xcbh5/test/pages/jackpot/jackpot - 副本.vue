<template>
	<view class="me-container">
		<view class="item">
			<view class="top">
				<view class="consequence">开奖公告</view>
			</view>
			
			<view class="nci" v-for="(data, index) in pagedData" :key="index">
				<view class="draw-time">开奖时间：{{ data.drawTime }}</view>

				<view class="Position">
					<view class="grades">
						<view class="grade"></view>
						<view class="middle">
							<!-- 一等奖：1个号码，左对齐 -->
							<view class="title one">
								<view class="dengji">一等奖</view>
								<view class="pailie">
									<view v-for="item in data.pageData" :key="item.Id" v-if="item.type === 1">
										{{ formatPhoneNumber(item.phone) }}
									</view>
								</view>
							</view>

							<!-- 二等奖：2个号码，使用Grid布局，左和中位置 -->
							<view class="title two">
								<view class="dengji">二等奖</view>
								<view class="pailie grid">
									<view v-for="item in data.pageData" :key="item.Id" v-if="item.type === 2" class="grid-item">
										{{ formatPhoneNumber(item.phone) }}
									</view>
								</view>
							</view>

							<!-- 三等奖：3个号码，左中右对齐 -->
							<view class="title three">
								<view class="dengji">三等奖</view>
								<view class="pailie">
									<view v-for="item in data.pageData" :key="item.Id" v-if="item.type === 3">
										{{ formatPhoneNumber(item.phone) }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { api } from '@/api/index';
	import usePage from '@/hooks/usePage';
	export default {
		data() {
			return {
				pagedData: [],
				totalnum: 0,
				totalPages: 0,
			};
		},
		mixins: [usePage],
		onLoad() {
			this.reloadData();
		},
		methods: {
			async fetchData(params) {
				const { limit, ...otherParams } = params;
				const requestParams = { ...otherParams, type: this.type };
				// const response = await api.lottery({ ...requestParams, page: 0 });
				// this.totalnum = response.data.totalnum;
				this.totalPages = Math.ceil(this.totalnum / 6);
				this.pagedData = []; // 清空之前的数据

				// 创建请求数组
				const requests = [];
				const querList = [
					{page:1,limit:1,type:1},
					{page:1,limit:3,type:2},
					{page:1,limit:8,type:3},
				]
				for (let page = 1; page <= 1; page++) {
					// const pageParams = { ...requestParams, page, limit:12 };
					const pageParams = {page:1, limit:2,};
					requests.push(api.lottery(pageParams));
				}

				// 等待所有请求完成
				const responses = await Promise.all(requests);

				// 处理每个请求的结果
				responses.forEach((response, index) => {
					if (response.data.listdata.length > 0) {
						const drawTime = this.formatDateTime(response.data.listdata[0].Created); // 提取每一页的开奖时间
						this.pagedData.push({
							drawTime,
							pageData: response.data.listdata,
						});
					}
				});
				
				
			},
			formatPhoneNumber(phone) {
				if (!phone) return '';
				return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			},
			formatDateTime(datetime) {
				if (!datetime) return '';
				const date = new Date(datetime);
				return date.toISOString().slice(0, 16).replace('T', ' ').replace(/-/g, '/');
			},
			gotolottery() {
				uni.navigateBack({
					delta: 1 // 关闭当前页面并返回上一个页面
				});
			}
		}
	};
</script>

<style>
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
		justify-content: space-between;
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