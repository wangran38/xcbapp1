<template>
	<view class="me-container">
		<!-- 页面标题 -->
		<view class="page-title">积分结算记录</view>
		
		<!-- 表格容器 -->
		<view class="table-container">
			<!-- 表头 -->
			<view class="table-header">
				<view class="table-col time-col">时间</view>
				<view class="table-col amount-col">金额</view>
				<view class="table-col status-col">状态</view>
			</view>
			
			<!-- 内容滚动区 -->
			<scroll-view 
				class="table-body" 
				scroll-y="true" 
				@scrolltolower="handleScrollToLower"
				:style="{ height: 'calc(100vh - 200rpx)'}"
			>
				<!-- 加载状态 -->
				<view v-if="isLoading" class="loading">
					<view class="spinner"></view>
					<text>加载中...</text>
				</view>
				
				<!-- 空状态 -->
				<view v-if="!isLoading && pageData.length === 0" class="empty-state">
					<image src="/static/empty.png" mode="widthFix" class="empty-img"></image>
					<text>暂无结算记录</text>
				</view>
				
				<!-- 数据列表 -->
				<view class="table-row" v-for="(item, index) in pageData" :key="item.id">
					<view class="table-col time-col">
						<text class="date">{{ formatDate(item.Created).split(' ')[0] }}</text>
						<text class="time">{{ formatDate(item.Created).split(' ')[1] }}</text>
					</view>
					<view class="table-col amount-col">
						<text class="amount">{{ item.shopscore/10 }}</text>
						<text class="unit">元</text>
					</view>
					<view class="table-col status-col">
						<view class="status-tag" :class="item.status === 1 ? 'pending' : 'completed'">
							{{ getStatusLabel(item.status) }}
						</view>
					</view>
				</view>
				
				<!-- 加载更多 -->
				<view v-if="hasMore" class="load-more">
					<view class="spinner small"></view>
					<text>加载更多...</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {api} from '@/api';
	import usePage from '@/hooks/usePage';
	export default {
		data() {
			return {
				pageData: [],
				isLoading:false
			}
		},
		onShow() {
			this.reloadData()
		},
		mixins: [usePage],
		methods: {
			async fetchData(params) {
				const response = await api.shopsorcelist(params)
				return response.data		
			},
			formatDate(dateString) {
			  return dateString.replace(/T/, ' ').replace(/(\+\d{2}:\d{2})/, '');
			},
			getStatusLabel(status) {
			        switch (status) {
			            case 1:
			                return '申请中';
			            case 2:
			                return '已结算';
			            default:
			                return '';
			        }
			    },
		}
	}
</script>

<style>
	/* 基础样式 */
	.me-container {
		width: 100%;
		min-height: 100vh;
		background-color: #f7f8fa;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	
	/* 页面标题 */
	.page-title {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 36rpx;
		color: #333;
		font-weight: 500;
		border-bottom: 1px solid #eee;
		background-color: #fff;
		margin-bottom: 20rpx;
	}
	
	/* 表格容器 */
	.table-container {
		width: 100%;
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
	}
	
	/* 表头样式 */
	.table-header {
		display: flex;
		height: 80rpx;
		background-color: #fafafa;
		border-bottom: 1px solid #eee;
	}
	
	/* 列样式（核心对齐控制） */
	.table-col {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}
	
	/* 固定列宽比例，确保表头与内容对齐 */
	.time-col {
		width: 40%;
		padding: 0 20rpx;
		justify-content: flex-start !important; /* 时间列左对齐 */
	}
	
	.amount-col {
		width: 30%;
		justify-content: center !important; /* 金额列居中 */
	}
	
	.status-col {
		width: 30%;
		justify-content: center !important; /* 状态列居中 */
	}
	
	/* 表头文字样式 */
	.table-header .table-col {
		color: #666;
		font-weight: 500;
	}
	
	/* 表格内容区 */
	.table-body {
		width: 100%;
	}
	
	/* 数据行样式 */
	.table-row {
		display: flex;
		height: 120rpx;
		border-bottom: 1px solid #f5f5f5;
		transition: background-color 0.2s;
	}
	
	.table-row:last-child {
		border-bottom: none;
	}
	
	.table-row:active {
		background-color: #f9f9f9;
	}
	
	/* 时间列内容样式 */
	.time-col .date {
		color: #333;
		font-size: 28rpx;
		display: block;
	}
	
	.time-col .time {
		color: #999;
		font-size: 24rpx;
		display: block;
	}
	
	/* 金额列内容样式 */
	.amount-col .amount {
		color: #e53e3e;
		font-size: 30rpx;
		font-weight: 500;
	}
	
	.amount-col .unit {
		color: #666;
		font-size: 26rpx;
		margin-left: 5rpx;
	}
	
	/* 状态标签样式 */
	.status-tag {
		padding: 8rpx 24rpx;
		border-radius: 20rpx;
		font-size: 26rpx;
	}
	
	.status-tag.pending {
		background-color: #fff1f0;
		color: #cf1322;
	}
	
	.status-tag.completed {
		background-color: #f0fff4;
		color: #137333;
	}
	
	/* 加载状态 */
	.loading, .load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
		color: #999;
		font-size: 26rpx;
	}
	
	.spinner {
		width: 28rpx;
		height: 28rpx;
		border: 3rpx solid rgba(0,0,0,0.1);
		border-radius: 50%;
		border-top-color: #666;
		animation: spin 1s linear infinite;
		margin-right: 15rpx;
	}
	
	.spinner.small {
		width: 24rpx;
		height: 24rpx;
	}
	
	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 150rpx 0;
		color: #999;
		font-size: 28rpx;
	}
	
	.empty-img {
		width: 180rpx;
		height: 180rpx;
		margin-bottom: 30rpx;
		opacity: 0.5;
	}
	
	/* 动画 */
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>