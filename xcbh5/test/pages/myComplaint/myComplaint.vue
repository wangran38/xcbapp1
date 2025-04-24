<template>
	<view class="container">
		<!-- 数据概览 -->
		<view class="data-panel">
			<view class="stats-card gradient-purple">
				<text class="stats-number">{{ total }}</text>
				<text class="stats-label">总投诉量</text>
			</view>
		</view>

		<!-- 投诉记录 -->
		<scroll-view scroll-y class="record-list" @scrolltolower="changePageAndGetData">
			<view v-for="(item, index) in records" :key="item.id" class="record-card" :class="'status-' + item.status"
				  :style="cardStyle[index]"  @click="viewDetail(item)">

				<view class="card-content">
					<text class="title">{{ item.title }}</text>

					<view class="info-row">
						<view class="time-info">
							<uni-icons type="calendar" size="16" color="#999" />
							<text>{{ initTime(item.created) }}</text>
						</view>
						<view class="status-tag" :style="[tagStyle(item.status-1)]">
							{{ statusLabels[item.status-1] }}
						</view>
					</view>

					<view class="progress-bar">
						<view class="progress-fill" :style="{width: progressWidth(item.status)}"></view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="records.length === 0" class="empty-state">
				<image src="/static/empty-state.svg" class="empty-image" />
				<text class="empty-text">暂无投诉记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		myMixin
	} from '@/utils/public.js'
	import {
		api
	} from '@/api/index.js'
	export default {
		mixins: [myMixin],
		data() {
			return {
				total: null,
				processing: 3,
				records: [],
				query: {
					page: 1,
					limit: 10
				},
				lock:false,
				statusLabels: ['处理中', '已受理', '调解中', '已完结'],
				statusColors: ['#FF9F43', '#2E86DE', '#10AC84', '#8395A7'],
				cardStyle: {}
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			viewDetail(item){
				// console.log(item)
				let strJsonData =  JSON.stringify(item)
				uni.navigateTo({
					url:`/pages/complaintDetails/complaintDetails?strJsonData=${strJsonData}`
				})
			},
			changePageAndGetData(){
				if (!this.lock){
					this.query.page+=1
					this.getData()
				}

			},
			async getData() {
				let data = await api.mylist(this.query)
				if (data.code == 200) {
					if (data.data.listdata<this.query.limit){
						this.lock = true
					}
					this.total  = data.data.totalnum
					this.records = [...this.records, ...data.data.listdata]
				}

			},
			// 进度条宽度
			progressWidth(status) {
				return ['30%', '60%', '100%', '0%'][status - 1]
			},
			// 标签样式
			tagStyle(status) {
				return {
					background: this.statusColors[status] + '15',
					Color: this.statusColors[status]
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 容器布局 */
	.container {
		background: linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%);
		min-height: 100vh;
		padding: 30rpx;
	}

	/* 数据面板 */
	.data-panel {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 20rpx;
		margin-bottom: 40rpx;

		.stats-card {
			padding: 40rpx;
			border-radius: 20rpx;
			text-align: center;

			.stats-number {
				display: block;
				font-size: 56rpx;
				font-weight: 700;
				margin-bottom: 10rpx;
			}

			.stats-label {
				font-size: 28rpx;
				color: rgba(255, 255, 255, 0.9);
			}

			&.gradient-purple {
				background: linear-gradient(135deg, #A569BD 0%, #6C5CE7 100%);
			}

			&.gradient-blue {
				background: linear-gradient(135deg, #2E86DE 0%, #54A0FF 100%);
			}
		}
	}

	/* 投诉卡片 */
	.record-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		position: relative;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);

		.status-flag {
			position: absolute;
			top: -12rpx;
			right: -12rpx;
			background: #fff;
			border-radius: 50%;
			padding: 8rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		}

		.card-content {
			.title {
				font-size: 32rpx;
				color: #2D3436;
				line-height: 1.4;
				margin-bottom: 20rpx;
			}

			.info-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24rpx;

				.time-info {
					display: flex;
					align-items: center;
					color: #999;
					font-size: 26rpx;

					uni-icons {
						margin-right: 8rpx;
					}
				}

				.status-tag {
					padding: 6rpx 24rpx;
					border-radius: 40rpx;
					font-size: 26rpx;
					font-weight: 500;
				}
			}

			.progress-bar {
				height: 8rpx;
				background: #eee;
				border-radius: 4rpx;
				overflow: hidden;

				.progress-fill {
					height: 100%;
					border-radius: 4rpx;
					transition: width 0.6s ease;
				}
			}
		}

		// 动态进度条颜色
		&.status-0 .progress-fill {
			background: #FF9F43;
		}

		&.status-1 .progress-fill {
			background: #2E86DE;
		}

		&.status-2 .progress-fill {
			background: #10AC84;
		}

		&.status-3 .progress-fill {
			background: #8395A7;
		}
	}

	/* 空状态 */
	.empty-state {
		text-align: center;
		padding: 100rpx 0;

		.empty-image {
			width: 400rpx;
			height: 400rpx;
			opacity: 0.8;
			margin-bottom: 40rpx;
		}

		.empty-text {
			color: #666;
			font-size: 32rpx;
			letter-spacing: 2rpx;
		}
	}
</style>