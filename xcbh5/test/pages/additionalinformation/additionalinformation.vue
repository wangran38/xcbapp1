<template>
	<view class="container">
		<!-- 浅色背景 -->
		<view class="background-wave"></view>

		<!-- 商品选择 -->
		<view class="product-selector">
			<uni-forms-item label="选择种植商品" label-width="80" label-align="right">
				<uni-data-select v-model="selectedProduct" :localdata="products" @change="generateTimeline"
					placeholder="请选择商品" class="nature-select" />
			</uni-forms-item>
		</view>

		<!-- 时间线容器 -->
		<scroll-view scroll-y class="timeline-container"
			:style="{visibility: timelineData.length ? 'visible' : 'hidden'}">
			<view v-for="(day, index) in timelineData" :key="index" class="timeline-item">
				<!-- 时间线标记 -->
				<view class="timeline-marker">
					<view class="marker-icon">
						<uni-icons type="calendar" size="28" color="#fff" />
					</view>
					<view class="timeline-connector"></view>
				</view>

				<!-- 内容卡片 -->
				<view class="nature-card" @click="handleDayClick(index)">
					<view class="card-header">
						<text class="day-title">第 {{ day.day }} 天</text>
						<text class="date-label">{{ day.date }}</text>
					</view>
					<view class="card-content">
						<image v-if="day.image" :src="day.image" class="content-image" mode="aspectFill" />
						<text class="content-text">{{ day.text || '点击记录生长情况' }}</text>
					</view>
					<view class="status-tag" :class="day.status == 'pending' ? 'pending':'completed'">
						{{ day.status === 'completed' ? '已完成' : '待记录' }}
					</view>
				</view>
			</view>
		</scroll-view>

		<uni-popup ref="editPanel" type="bottom">
			<view class="edit-panel">
				<view class="panel-header">
					<text class="panel-title">{{ currentDate }} 生长记录</text>
					<!-- <uni-icons type="close" size="24" color="#666" @click="closeEditor" /> -->
				</view>
				<view class="panel-body">
					<button class="action-button" @click="selectImage">
						<uni-icons type="camera" size="20" color="#fff" />
						<text>上传照片</text>
					</button>
					<image v-if="tempImage" :src="tempImage" class="image-preview" mode="aspectFit" />
					<textarea v-model="tempText" placeholder="请输入详细记录..." class="record-textarea" />
					<button class="confirm-button" @click="saveContent">保存记录</button>
				</view>
			</view>
		</uni-popup>

		<!-- 空状态 -->
		<view v-if="!timelineData.length" class="empty-state">
			<image src="/static/leaf-icon.png" class="empty-icon" />
			<text class="empty-text">请先选择种植商品</text>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import {
		api,
		UPLOAD_URL
	} from '../../api/index.js';
	import {
		useUpload
	} from "@/hooks/useUpload"

	export default {
		data() {
			return {
				selectedProduct: null,
				products: [{
						value: 1,
						text: '有机菠菜（7天周期）',
						days: 7,
						endDate: '2024-03-25'
					},
					{
						value: 2,
						text: '生态萝卜（14天周期）',
						days: 14,
						endDate: '2024-04-01'
					},
					{
						value: 3,
						text: '绿色生菜（21天周期）',
						days: 21,
						endDate: '2024-04-10'
					}
				],
				timelineData: [],
				activeIndex: -1,
				tempImage: '',
				tempText: '',
				currentDate: '',
				
				formData:{
					page:1,
					limit:30
				}
			}
		},
		async onLoad() {
			// {
			// 		value: 1,
			// 		text: '有机菠菜（7天周期）',
			// 		days: 7,
			// 		endDate: '2024-03-25'
			// 	}
			let data = await api.goodslist(this.formData)
			if (data.code == 200){
				let items  = data.data.listdata.map((item,index)=>{
					let beginTime = item.sellbegintime
					let endTime = item.sellendtime
					let initBeginTime =  `${dayjs(beginTime).$y}-${dayjs(beginTime).month()+1}-${dayjs(beginTime).date()}`
					let initEndTime =  `${dayjs(endTime).$y}-${dayjs(endTime).month()+1}-${dayjs(endTime).date()}`
					// console.log(initBeginTime,initEndTime)
					const date1 = dayjs(initBeginTime)
					const date2 = dayjs(initEndTime)
					let diff = date2.diff(date1,'day')
					console.log(diff)
					return {
						value:index+1,
						text:item.goodsname,
						days:diff,
						endDate:initEndTime
					}
				})
				console.log(items)
				this.products = items
			}
		},
		methods: {
			generateTimeline() {
				if (!this.selectedProduct) {
					this.timelineData = []
					return
				}

				const product = this.products.find(p => p.value === this.selectedProduct)
				this.timelineData = Array.from({
					length: product.days
				}, (_, i) => ({
					day: i + 1,
					date: dayjs(product.endDate).subtract(product.days - i - 1, 'day').format('MM/DD'),
					fullDate: dayjs(product.endDate).subtract(product.days - i - 1, 'day').format(
						'YYYY-MM-DD'),
					image: '',
					text: '',
					status: 'pending'
				}))
			},
			handleDayClick(index) {
				this.activeIndex = index
				this.currentDate = this.timelineData[index].fullDate
				this.tempImage = this.timelineData[index].image
				this.tempText = this.timelineData[index].text
				this.$refs.editPanel.open()
			},
			async selectImage() {
				const [res] = await uni.chooseImage({
					count: 1
				})
				this.tempImage = res.tempFilePaths[0]
			},
			saveContent() {
				const newData = {
					...this.timelineData[this.activeIndex],
					image: this.tempImage,
					text: this.tempText,
					status: this.tempText ? 'completed' : 'pending'
				}
				this.$set(this.timelineData, this.activeIndex, newData)
				this.closeEditor()
			},
			getStatusClass(day) {
				return {
					completed: day.status === 'completed',
					pending: day.status === 'pending'
				}
			},
			closeEditor() {
				this.$refs.editPanel.close()
				this.tempImage = ''
				this.tempText = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 主色调 */
	$primary-color: #55ff7f; // 海绿色
	$secondary-color: #00aaff; // 中绿松石色
	$background-color: #F5FFFA; // 薄荷乳白色

	.container {
		background: $background-color;
		min-height: 100vh;
	}

	.background-wave {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 200rpx;
		background: linear-gradient(160deg, $primary-color 20%, $secondary-color 80%);
		border-radius: 0 0 30% 30%;
		z-index: 0;
	}

	.product-selector {
		padding: 30rpx;
		position: relative;
		z-index: 1;

		/deep/ .uni-forms-item__label {
			font-size: 32rpx;
			color: #333;
		}
	}

	.nature-select {
		/deep/ .uni-select__input {
			font-size: 28rpx;
			color: #333;
			background: #fff;
			border: 2rpx solid $primary-color !important;
			border-radius: 10rpx;
			padding: 20rpx;
		}
	}

	.timeline-container {
		padding: 0 30rpx;
	}

	.timeline-item {
		display: flex;
		margin-bottom: 40rpx;

		.timeline-marker {
			width: 80rpx;
			position: relative;

			.marker-icon {
				width: 60rpx;
				height: 60rpx;
				background: $primary-color;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4rpx 12rpx rgba(46, 139, 87, 0.3);
			}

			.timeline-connector {
				position: absolute;
				left: 50%;
				top: 60rpx;
				bottom: -40rpx;
				width: 4rpx;
				background: #B0E0E6;
				transform: translateX(-50%);
			}
		}
	}

	.nature-card {
		max-width: 550rpx;
		position: relative;
		flex: 1;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-left: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.day-title {
				font-size: 32rpx;
				color: $primary-color;
				font-weight: 500;
			}

			.date-label {
				font-size: 26rpx;
				color: #666;
			}
		}

		.content-image {
			width: 100%;
			height: 300rpx;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			border: 2rpx solid $secondary-color;
		}

		.content-text {
			font-size: 28rpx;
			color: #666;
			line-height: 1.6;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;

			&:empty::before {
				content: '点击记录生长情况';
				color: #999;
			}
		}

		.status-tag {
			position: absolute;
			right: 30rpx;
			top: 90rpx;
			background: rgba(72, 209, 204, 0.1);
			color: red;
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
			font-size: 24rpx;

			&.completed {
				background: rgba(46, 139, 87, 0.1);
				color: $primary-color;
			}
		}
	}

	.edit-panel {
		background: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 40rpx;

		.panel-title {
			font-size: 36rpx;
			color: $primary-color;
			font-weight: 500;
			margin-bottom: 30rpx;
			display: block;
			text-align: center;
		}

		.action-button {
			background: $secondary-color;
			color: #fff;
			border-radius: 50rpx;
			padding: 20rpx;
			font-size: 28rpx;
			display: inline-flex;
			align-items: center;

			uni-icons {
				margin-right: 15rpx;
			}
		}

		.image-preview {
			width: 100%;
			height: 400rpx;
			border-radius: 20rpx;
			margin: 30rpx 0;
			border: 2rpx solid $primary-color;
		}

		.record-textarea {
			width: 100%;
			min-height: 200rpx;
			background: #f8f8f8;
			border-radius: 20rpx;
			padding: 20rpx;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 30rpx;
		}

		.confirm-button {
			background: $primary-color;
			color: #fff;
			border-radius: 50rpx;
			padding: 10rpx;
			font-size: 32rpx;
		}
	}

	.empty-state {
		text-align: center;
		padding-top: 200rpx;

		.empty-icon {
			width: 200rpx;
			height: 200rpx;
			opacity: 0.3;
		}

		.empty-text {
			display: block;
			color: #999;
			font-size: 28rpx;
			margin-top: 30rpx;
		}
	}
</style>