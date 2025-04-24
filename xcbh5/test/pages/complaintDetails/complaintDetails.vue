<template>
	<view class="detail-container">

		<!-- 内容区域 -->
		<scroll-view scroll-y class="content-wrapper">
			<!-- 状态信息 -->
			<view class="status-box">
				<view class="status-tag" :style="[tagStyle(detail.status-1)]">{{ statusTypes[detail.status-1] }}</view>
				<view class="status-info">
					<text class="info-item">提交时间：{{ initTime(detail.createtime) }}</text>
					<text class="info-item">联系电话：{{ detail.phone }}</text>
				</view>
			</view>

			<!-- 投诉内容 -->
			<view class="content-box">
				<view class="section-title">投诉内容</view>
				<view class="content-text">{{ detail.content }}</view>
			</view>

			<!-- 图片凭证 -->
			<view class="image-box">
				<view class="section-title">上传凭证（{{ detail.complaint_img.length }}张）</view>
				
				<view class="image-list">
					<view v-for="(img, index) in detail.complaint_img" :key="index" class="image-item"
						@click="previewImage(index)">
						<image :src="img" mode="aspectFill" class="image" />
						<view class="image-overlay" />
					</view>
				</view>
				<text v-if="detail.complaint_img.length<=0" style="color: gray; font-size: 23rpx;">暂无图片</text>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import {
		myMixin
	} from '@/utils/public.js'
	export default {
		mixins: [myMixin],
		data() {
			return {
				statusTypes: ['处理中', '已受理', '调解中', '已完结'],
				detail: {
					id: "TS20231015001",
					status: 0, // 0-待处理 1-处理中 2-已完成   
					createTime: "2023-10-15 14:30:45",
					phone: "138****1234",
					content: "购买的菜品质量不行，还有商家的态度极差",
					images: []
				},
				processSteps: [{
						title: "处理中",
						time: "2023-10-15 14:30"
					},
					{
						title: "已受理",
						time: "2023-10-15 15:15"
					},
					{
						title: "调解中",
						time: "2023-10-16 09:30"
					},
					{
						title: '已完结',
						time: "2023-10-17 14:00"
					}
				],
				statusColors: ['#FF9F43', '#2E86DE', '#10AC84', '#8395A7'],
			}
		},
		onLoad({
			strJsonData
		}) {
			if (strJsonData) {
				let data = JSON.parse(strJsonData)
				// 处理图片
				if (data.complaint_img) {
					data.complaint_img = data.complaint_img.split(',')
				}
				this.detail = data
			}
		},
		methods: {
			// 标签样式
			tagStyle(status) {
				return {
					background: this.statusColors[status] + '15',
					Color: this.statusColors[status]
				}
			},
			goBack() {
				uni.navigateBack()
			},
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.detail.complaint_img
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-container {
		background: #f8f9fa;
		min-height: 100vh;
	}

	.nav-bar {
		height: 88rpx;
		padding: 0 30rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #eee;

		.title {
			font-size: 34rpx;
			font-weight: 500;
			color: #333;
		}

		.placeholder {
			width: 44rpx;
		}
	}

	.content-wrapper {
		padding: 30rpx;
		height: calc(100vh - 88rpx);
	}

	.status-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		border-left: 8rpx solid orange;

		&.status-pending {
			border-color: #FFB020;

			.status-tag {
				background: orange;
				color: #FFB020;
			}
		}

		&.status-processing {
			border-color: #007AFF;

			.status-tag {
				background: #E6F3FF;
				color: #007AFF;
			}
		}

		&.status-completed {
			border-color: #00C853;

			.status-tag {
				background: #E6F7E6;
				color: #00C853;
			}
		}

		.status-tag {
			display: inline-block;
			padding: 8rpx 20rpx;
			border-radius: 8rpx;
			font-size: 24rpx;
			margin-bottom: 20rpx;
		}

		.status-info {
			font-size: 28rpx;
			color: #666;

			.info-item {
				display: block;
				margin: 12rpx 0;
			}
		}
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 30rpx;
	}

	.content-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;

		.content-text {
			font-size: 28rpx;
			color: #666;
			line-height: 1.6;
		}
	}

	.image-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;

		.image-list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 20rpx;

			.image-item {
				position: relative;
				width: 100%;
				height: 0;
				padding-bottom: 100%;
				border-radius: 8rpx;
				overflow: hidden;

				.image {
					position: absolute;
					width: 100%;
					height: 100%;
				}

				.image-overlay {
					position: absolute;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.02);
				}
			}
		}
	}

	.process-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;

		.timeline {
			position: relative;
			padding-left: 40rpx;

			&::before {
				content: '';
				position: absolute;
				left: 14rpx;
				top: 24rpx;
				bottom: 24rpx;
				width: 2rpx;
				background: #eee;
			}
		}

		.timeline-item {
			position: relative;
			padding: 30rpx 0 30rpx 40rpx;

			&.active {
				.timeline-dot {
					background: #7A9D7E;
					border-color: #7A9D7E;
				}

				.step-title {
					color: #333;
				}
			}

			.timeline-dot {
				position: absolute;
				left: -34rpx;
				top: 40rpx;
				width: 24rpx;
				height: 24rpx;
				border: 4rpx solid #ddd;
				border-radius: 50%;
				background: #fff;
				z-index: 2;
			}

			.timeline-content {
				.step-title {
					font-size: 28rpx;
					color: #999;
					margin-bottom: 10rpx;
				}

				.step-time {
					font-size: 24rpx;
					color: #ccc;
				}
			}
		}
	}
</style>