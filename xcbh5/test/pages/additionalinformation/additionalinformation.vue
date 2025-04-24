<template>
	<view class="container">
		<!-- 浅色背景 -->
		<view class="background-wave"></view>
		<!-- 商品选择 -->
		<view class="product-selector">
			<uni-forms-item label="选择菜品" label-width="80" label-align="right">
				<uni-data-select v-model="selectedProduct" :localdata="products" placeholder="请选择菜品"
					class="nature-select" />
			</uni-forms-item>
		</view>




		<scroll-view scroll-y="true" class="timeline-container"
			:style="{visibility: timelineData.length ? 'visible' : 'hidden'}">
			<view v-for="(item, index) in timelineData" :key="index" class="timeline-item">
				<view class="timeline-marker">
					<view class="marker-icon">
						<uni-icons type="calendar" size="28" color="#fff" />
					</view>
					<view class="timeline-connector"></view>
				</view>

				<!-- 内容卡片 -->
				<view class="nature-card" @click="handleDayClick(item)">
					<view class="card-header">
						<text class="date-label">{{ initTime(item.created) }}</text>
					</view>
					<view class="card-content">
						<text class="content-text">点击查看生长情况</text>
					</view>
					<view class="status-tag" :class="'completed'">
						已完成
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
						<text>上传照片或视频</text>
					</button>
					<view class="delete-icon" @click="editPanelClosePopup">×</view>

					<scroll-view class="preview-container" scroll-x="true">
						<view v-for="(item, index) in fileList" :key="index" class="preview-item">
							<image
							  v-if="item.fileType === 'image'"
							  :src="item.tempFilePath"
							  mode="aspectFill"
							  class="media-content"  @click="viewImage(item.tempFilePath)"/>
							<video
							  v-else
							  :src="item.tempFilePath"
							  controls
							  class="media-content"
							  objectFit="cover"></video>
							<view class="delete-icon" @click="handleDelete(index)">×</view>
						</view>
					</scroll-view>



					<image v-if="tempImage" :src="tempImage" class="image-preview" mode="aspectFit" />
					<textarea v-model="tempText" placeholder="请输入详细记录..." class="record-textarea"/>
					<button class="confirm-button" @click="saveContent">保存记录</button>
				</view>
			</view>
		</uni-popup>

		<view v-if="!timelineData.length" class="empty-state">
			<text class="empty-text">请先选择种植商品</text>
		</view>

		<uni-popup ref="viewPanel" type="bottom">
			<view class="edit-panel">
				<view class="panel-header">
					<text class="panel-title">{{ currentDate }} 生长记录</text>
				</view>
				<view class="panel-body">
					<view class="delete-icon" @click="viewPanelClosePopup">×</view>

					<scroll-view class="preview-container" scroll-x="true">
						<view v-for="(item, index) in viewImgAndVideo" :key="index" class="preview-item">
							<image
							  v-if="item.fileType === 'image'"
							  :src="item.path"
							  mode="aspectFill"
							  class="media-content" @click="viewImage(item.path)"/>
							<video
							  v-else
							  :src="item.path"
							  controls
							  class="media-content"
							  objectFit="cover"></video>
						</view>
					</scroll-view>

					<image v-if="tempImage" :src="tempImage" class="image-preview" mode="aspectFit" />
					<textarea v-model="tempText" placeholder="" class="record-textarea" disabled/>
					<button class="confirm-button"  style="background-color: red;" @click="removeItem">删除记录</button>
				</view>
			</view>
		</uni-popup>

	 <view class="float-btn" @click="addRecord">
		  <uni-icons type="plusempty" size="30" color="#fff" />
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
	import {
		myMixin
	} from '@/utils/public.js'

	export default {
		data() {
			return {
				selectedProduct: null,
				products: [],
				timelineData: [],
				activeIndex: -1,
				tempImage: '',
				tempText: '',
				currentDate: '',
				formData: {
					page: 1,
					limit: 30
				},
				fileList: [],
				viewImgAndVideo:null,
				openId:null,
			}
		},
		mixins: [myMixin],
		watch: {
			selectedProduct(newValue, oldValue) {
				this.lifeCycleData()
			}
		},
		async onLoad() {
			let data = await api.goodslist(this.formData)
			if (data.code == 200) {
				let items = data.data.listdata.map((item, index) => {
					let beginTime = item.sellbegintime
					let endTime = item.sellendtime
					let initBeginTime =
						`${dayjs(beginTime).$y}-${dayjs(beginTime).month()+1}-${dayjs(beginTime).date()}`
					let initEndTime =
						`${dayjs(endTime).$y}-${dayjs(endTime).month()+1}-${dayjs(endTime).date()}`
					const date1 = dayjs(initBeginTime)
					const date2 = dayjs(initEndTime)
					let diff = date2.diff(date1, 'day')
					return {
						value: item.id,
						text: item.goodsname
					}
				})
				this.products = items
				if (this.products) {
					this.selectedProduct = this.products[0].value
					this.lifeCycleData()
				}
			}
		},
		methods: {
			viewImage(url){
				console.log(url)
				uni.previewImage({
					showmenu:false,
					urls:[url]
				})
			},
			// 删除预卖菜品的生命周期内容
			async removeItem(){
				let res = await api.delMoments({id:this.openId})
				if(res.code == 200){
					uni.showToast({
						icon:'success',
						title:res.message|| res.msg
					}).then(data=>{
						this.initPorp()
						this.lifeCycleData() // 更新数据
					})
				}
			},
			editPanelClosePopup(){
				this.initPorp()
			},
			viewPanelClosePopup(){
				this.initPorp()
			},
			// 获取生命周期数据 
			async lifeCycleData() {
				let data = await api.goodsinfoList({
					page: 1,
					limit: 100,
					farmersgoods_id: this.selectedProduct
				})

				// 处理数据
				let existId = []
				data.data.listdata.forEach((item) => {
					// if (existId.find((chilen)=>{item.id==chilen.id}))
					existId.find((chilen) => {
						// console.log("这是大项", item.user_id, "这是小项", chilen.user_id)
					})
					existId.push(item)
				})
				this.timelineData = data.data.listdata
			},
			// 删除图片或视频
			handleDelete(index) {
				this.fileList.splice(index, 1)
			},
			addRecord() {
				this.$refs.editPanel.open()

			},
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
			handleDayClick(item) {
				this.$refs.viewPanel.open()
				this.tempText = item.content
				if(item.imgs){ // 存在图片就做处理
					let i = []
					i =  item.imgs.split(',')
					let initData =  i.map((anlien)=>{
						if (anlien.slice(anlien.length-3) == 'mp4'){
							return {
								fileType:'video',
								path:anlien
							} 
						}else{
							return {
								fileType:'image',
								path:anlien
							}
						}
					})
					this.viewImgAndVideo = initData
				}
				this.openId = item.id
			},
			saveImage(path) {
				return new Promise((res, rej) => {
					uni.uploadFile({
						url: 'https://image.xcbdsc.com/group1/upload',
						name: 'file',
						filePath: path,
						formData: {
							output: 'json2'
						},
						success: (reponse) => {
							res(JSON.parse(reponse.data))
						},
						fail: (err) => {
							rej(err)
							uni.showToast({
								title: '上传失败',
								icon: 'error'
							});
						}
					})
				})
			},

			initPorp() {
				uni.hideLoading();
				this.$refs.editPanel.close()
				this.$refs.viewPanel.close()
				this.tempText = ''
				this.fileList = []
			},
			async selectImage() {
				// const [res] = await uni.chooseImage({
				// 	count: 1
				// })
				// this.tempImage = res.tempFilePaths[0]
				uni.chooseMedia({
					count: 9,
					mediaType: 'mix',
					sourceType: ['album', 'camera'],
					maxDuration: 30,
					camera: 'back',
					success: (res) => {
						this.fileList = [...this.fileList, ...res.tempFiles]
						// console.log(this.fileList)
					}
				})
			},
			saveContent() {

				if (this.selectedProduct == null) {
					uni.showToast({
						title: '请选择菜品',
						icon: 'error'
					});
					return
				}

				uni.showLoading({
					title: '正在上传中.....'
				});
				// 构建请求包
				const imgUploadPromises = this.fileList.map(item => {
					return this.saveImage(item.tempFilePath)
				})

				// const videoUploadPromises = this.fileList.map(item => {
				// 	if (item.fileType == 'video') {
				// 		return this.saveImage(item.tempFilePath)
				// 	}
				// })



				Promise.all(imgUploadPromises)
					.then(urlList => {
						let imgs = []
						urlList.forEach((item) => {
							if (item) {
								imgs.push(item.data.url)
							}
						})
						let data = {
							'farmersgoods_id': this.selectedProduct,
							'imgs': imgs.join(','),
							'type': 1,
							'content': this.tempText
						}
						api.addinfos(data).then((res) => {
							this.initPorp()
							this.lifeCycleData()
						})
					})
					.catch(err => {
						uni.showToast({
							title: '部分文件上传失败',
							icon: 'none'
						})
					})

				// Promise.all(videoUploadPromises)
				// 	.then(urlList => {
				// 		let imgs = []
				// 		urlList.forEach((item) => {
				// 			if (item) {
				// 				imgs.push(item.data.url)
				// 			}
				// 		})
				// 		if (imgs.length == 0) {
				// 			this.initPorp()
				// 			return
				// 		}
				// 		let data = {
				// 			'farmersgoods_id': this.selectedProduct,
				// 			'imgs': imgs.join(','),
				// 			'type': 2,
				// 			'content': this.tempText
				// 		}
				// 		api.addinfos(data).then((res) => {
				// 			this.initPorp()
				// 		})
				// 	})
				// 	.catch(err => {
				// 		uni.showToast({
				// 			title: '部分视频文件上传失败',
				// 			icon: 'none'
				// 		})
				// 	})

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

<style scoped>
	.media-content {
	  width: 100%;
	  height: 100%;
	}
	.float-btn {
	  position: fixed;
	  bottom: 100rpx;
	  right: 40rpx;
	  width: 100rpx;
	  height: 100rpx;
	  background: linear-gradient(45deg, #FF8E8E, #FF6B6B);
	  border-radius: 50%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  box-shadow: 0 12rpx 24rpx rgba(255,107,107,0.3);
	  transition: transform 0.3s;
	  
	}
	.preview-container {
		white-space: nowrap;
		/* height: 200rpx; */
		display: flex;
		padding: 20rpx;
	}

	.preview-item {
		display: inline-block;
		position: relative;
		width: 320rpx;
		height: 320rpx;
		margin: 10rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background: #f5f5f5;
	}

	.preview-image,
	.preview-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.delete-icon {
		line-height: 40rpx;
		padding: 10rpx;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		width: 40rpx;
		height: 40rpx;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		border-radius: 50%;
		text-align: center;
		font-size: 50rpx;
		z-index: 2;
	}

	.video-wrapper {
		position: relative;
	}


	/* 适配小程序特殊样式 */
	video::-webkit-media-controls-enclosure {
		display: none !important;
	}

	.preview-video {
		-webkit-object-fit: cover;
		object-fit: cover;
	}

	/* 处理小程序边框显示问题 */
	.preview-item::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 200%;
		height: 200%;
		border: 2rpx solid #eee;
		transform-origin: 0 0;
		transform: scale(0.5);
		box-sizing: border-box;
		pointer-events: none;
	}
</style>

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
		height: 80vh;
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
			margin-bottom: 20rpx;
			background: $secondary-color;
			color: #fff;
			border-radius: 50rpx;
			padding: 10rpx;
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