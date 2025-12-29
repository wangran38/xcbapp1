<template>
	<view class="data-list-page">
		<!-- 页面标题区域 -->
		<view class="page-header">
			<view class="header-title">数据中心</view>
			
		</view>

		<view class="list-container">
			<!-- 数据列表 -->
			<view class="data-list">
				<!-- 列表项 -->
				<view class="list-item" v-for="item in dataList" :key="item.id">
					<!-- 左侧：数据基础信息 -->
					<view class="item-left">
						<view class="item-title">{{ item.out_trade_no }}</view>
						<view class="item-desc">{{ item.level2money }}</view>
						<view class="item-time">{{ formatDate(item.createTime) }}</view>
					</view>
					
				
				</view>
			</view>

			<!-- 查看全部/空数据提示 -->
			<view class="list-footer" v-if="dataList.length === 0">
				暂无数据可展示
			</view>
			<view class="list-footer" v-else @click="viewAllData">
				查看全部数据 →
			</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'

	// 日期格式化工具（如果项目中没有全局引入，可保留此简易版）
	function formatDate(dateStr, fmt = 'YYYY-MM-DD HH:mm') {
		if (!dateStr) return ''
		const date = new Date(dateStr)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')

		return fmt.replace('YYYY', year)
			.replace('MM', month)
			.replace('DD', day)
			.replace('HH', hours)
			.replace('mm', minutes)
	}

	export default {
		data() {
			return {
				// 数据列表（通用格式，可根据实际业务调整字段）
				dataList: [],
				query: {
					pagg: 1,
					limit: 10
				}
			}
		},

		onLoad() {
			this.loadDataList()
		},

		methods: {
			// 加载数据列表
			async loadDataList() {
				try {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})

					const res = await api.getpromoneylist(this.query)

					if (res.code === 200) {
						console.log(res.data)
						this.dataList = [...this.dataList, ...res.data.listdata]
					}
				} catch (error) {
					console.error('列表数据加载失败:', error)
					uni.showToast({
						title: '数据加载失败',
						icon: 'none',
						duration: 2000
					})
				} finally {
					uni.hideLoading()
				}
			},

			// 格式化日期
			formatDate(dateStr) {
				return formatDate(dateStr)
			},

			// 状态文本转换
			getStatusText(status) {
				const statusMap = {
					'PENDING': '待处理',
					'PAID': '已完成',
					'SHIPPED': '已执行',
					'COMPLETED': '已归档',
					'CANCELLED': '已作废'
				}
				return statusMap[status] || '未知状态'
			},

			// 查看全部数据
			viewAllData() {
				uni.navigateTo({
					url: '/pages/agent/all-data'
				})
			}
		}
	}
</script>

<style scoped>
	/* 页面基础样式 */
	.data-list-page {
		background-color: #f8f9fa;
		min-height: 100vh;
		font-size: 14px;
		padding-bottom: 30px;
	}

	/* 页面标题 */
	.page-header {
		text-align: center;
		padding: 30px 20px 20px;
	}

	.header-title {
		font-size: 22px;
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 8px;
	}

	.header-subtitle {
		font-size: 13px;
		color: #718096;
	}

	/* 列表容器 */
	.list-container {
		width: 92%;
		margin: 0 auto;
	}

	/* 数据列表 */
	.data-list {
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
		overflow: hidden;
	}

	/* 列表项 */
	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 18px;
		border-bottom: 1px solid #f5f5f5;
	}

	/* 最后一个列表项去掉下边框 */
	.list-item:last-child {
		border-bottom: none;
	}

	/* 左侧信息 */
	.item-left {
		flex: 1;
	}

	.item-title {
		font-size: 15px;
		font-weight: 500;
		color: #2d3748;
		margin-bottom: 4px;
	}

	.item-desc {
		font-size: 12px;
		color: #718096;
		margin-bottom: 4px;
	}

	.item-time {
		font-size: 11px;
		color: #999;
	}

	/* 右侧信息 */
	.item-right {
		text-align: right;
	}

	.item-value {
		font-size: 16px;
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 6px;
	}

	.item-status {
		font-size: 12px;
		padding: 2px 8px;
		border-radius: 12px;
		display: inline-block;
	}

	/* 状态样式 */
	.status-PENDING {
		background-color: rgba(251, 188, 5, 0.1);
		color: #FBBC05;
	}

	.status-PAID {
		background-color: rgba(52, 168, 83, 0.1);
		color: #34A853;
	}

	.status-SHIPPED {
		background-color: rgba(66, 133, 244, 0.1);
		color: #4285F4;
	}

	.status-COMPLETED {
		background-color: rgba(103, 80, 229, 0.1);
		color: #6750E3;
	}

	.status-CANCELLED {
		background-color: rgba(234, 67, 53, 0.1);
		color: #EA4335;
	}

	/* 列表底部 */
	.list-footer {
		text-align: center;
		font-size: 13px;
		margin-top: 16px;
		padding: 8px 0;
	}

	/* 有数据时的查看全部样式 */
	.list-footer:not(:first-child) {
		color: #4285F4;
		cursor: pointer;
	}

	/* 无数据时的提示样式 */
	.list-footer:first-child {
		color: #999;
	}

	/* 响应式调整 */
	@media (min-width: 768px) {
		.list-container {
			width: 60%;
			max-width: 600px;
		}
	}
</style>