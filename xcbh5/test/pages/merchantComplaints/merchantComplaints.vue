<template>
	<view class="complaint-container">
		<!-- 头部 -->
		<view class="complaint-header">
			<text class="title">提交投诉</text>
			<text class="subtitle">请补充投诉“{{query.title}}”的具体依据</text>
		</view>

		<!-- 表单主体 -->
		<view class="complaint-form">
			<!-- 投诉类型 -->
			<view class="form-item">
				<text class="item-label">投诉标题<text class="required">*</text></text>
				<input v-model="formData.title" placeholder="请简述一下您遇到的问题"
					style="background-color: #F8F9FA; padding: 30rpx; font-size: 28rpx;" />

			</view>

			<!-- 投诉描述 -->
			<view class="form-item">
				<text class="item-label">投诉描述<text class="required">*</text></text>
				<textarea v-model="formData.content" placeholder="请详细描述遇到的问题（建议包含时间、地点、具体经过）" class="content-input"
					maxlength="500" />
				<view class="word-counter">
					{{ formData.content.length }}/500
				</view>
			</view>

			<!-- 上传凭证 -->
			<view class="form-item">
				<text class="item-label">上传凭证</text>
				<view class="upload-area">
					<view class="upload-card" @click="selectImage">
						<uni-icons type="plusempty" size="36" color="#7A9D7E" />
						<text class="upload-tip">请选择上传图片</text>
						<text class="upload-subtip">最多6张图片</text>
					</view>
					<!-- 					<uni-file-picker v-model="formData.files" fileMediatype="image" limit="6"
						@select="handleFileSelect">
					</uni-file-picker> -->

					<view class="preview-grid" v-if="fileList.length > 0">
						<view v-for="(file, index) in fileList" :key="index" class="preview-item">
							<image :src="file.data.url" class="preview-image" mode="aspectFill" />
							<uni-icons type="close" size="18" class="delete-icon" @click="removeFile(index)" />
						</view>
					</view>
				</view>
			</view>

			<!-- 联系电话 -->
			<view class="form-item">
				<text class="item-label">联系电话<text class="required">*</text></text>
				<view class="phone-input">
					<uni-icons type="phone" size="20" color="#7A9D7E" />
					<input v-model="formData.phone" type="number" placeholder="请输入您的手机号码" maxlength="11" />
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-area">
			<button class="submit-btn" @click="handleSubmit">
				立即提交
			</button>
			<text class="agreement-tip">提交之后工作人员将在两个小时之后联系您，请保持通话正常</text>
		</view>
	</view>
</template>

<script>
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
		mixins:[myMixin],
		data() {
			return {
				formData: {
					title: '',
					content: '',
					phone: ''
				},
				fileList: [],
				query: null, // 上个页面传来的数据
			}

		},
		computed: {

		},
		onLoad(query) {
			console.log(query)
			this.query = query
		},
		methods: {
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
			async selectImage() {
				uni.chooseMedia({
					count: 6,
					mediaType: 'mix',
					sourceType: ['album', 'camera'],
					maxDuration: 30,
					camera: 'back',
					success: (res) => {
						const imgUploadPromises = res.tempFiles.map(item => {
							return this.saveImage(item.tempFilePath)
						})
						Promise.all(imgUploadPromises)
							.then(urlList => {
								this.fileList = [...this.fileList, ...urlList]
							})
					}
				})
			},

			removeFile(index) {
				this.fileList.splice(index, 1)
			},
			async handleSubmit() {
				this.formData.shop_id  = parseInt(this.query.id)
				let ImgList = this.fileList.map(item=>{
					return item.data.url
				})
				this.formData.complaint_img = ImgList.join(',')
				// 构建数据包
				uni.showToast({
					icon:'loading',
					title:'正在提交'
				})
				api.submitComplaint(this.formData).then((data)=>{
					if (data.code == 200){
						uni.showToast({
							icon:'success',
							title:'投诉成功'
						})
					}else{
						uni.showToast({
							icon:'error',
							title:data.msg
						})
						return
					}
					setTimeout(()=>{
						this.customizeBack()
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.complaint-container {
		background: linear-gradient(180deg, #F8FFF9 0%, #FFFFFF 100%);
		min-height: 100vh;
		padding: 40rpx 30rpx;
	}

	.complaint-header {
		margin-bottom: 48rpx;

		.title {
			display: block;
			font-size: 44rpx;
			font-weight: 600;
			color: #2C3E50;
			margin-bottom: 16rpx;
		}

		.subtitle {
			font-size: 26rpx;
			color: #7A9D7E;
		}
	}

	.complaint-form {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(122, 157, 126, 0.08);
	}

	.form-item {
		margin-bottom: 48rpx;

		.item-label {
			display: block;
			font-size: 30rpx;
			color: #34495E;
			margin-bottom: 24rpx;

			.required {
				color: #FF5A5F;
				margin-left: 8rpx;
			}
		}
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24rpx;

		.type-item {
			background: #F8FFF9;
			border: 2rpx solid #E8F5E9;
			border-radius: 16rpx;
			padding: 32rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			transition: all 0.3s;

			&.active {
				border-color: #7A9D7E;
				background: rgba(122, 157, 126, 0.1);

				uni-icons {
					color: #7A9D7E;
				}
			}

			uni-icons {
				color: #95A5A6;
				margin-bottom: 16rpx;
			}

			text {
				font-size: 28rpx;
				color: #2C3E50;
			}
		}
	}

	.content-input {
		width: 100%;
		height: 240rpx;
		padding: 24rpx;
		background: #F8F9FA;
		border-radius: 16rpx;
		font-size: 28rpx;
		line-height: 1.6;
	}

	.word-counter {
		text-align: right;
		font-size: 24rpx;
		color: #95A5A6;
		margin-top: 16rpx;
	}

	.upload-area {
		.upload-card {
			background: #F8FFF9;
			border: 2rpx dashed #7A9D7E;
			border-radius: 16rpx;
			padding: 48rpx 0;
			display: flex;
			flex-direction: column;
			align-items: center;

			.upload-tip {
				color: #7A9D7E;
				font-size: 28rpx;
				margin-top: 16rpx;
			}

			.upload-subtip {
				color: #BDC3C7;
				font-size: 24rpx;
				margin-top: 8rpx;
			}
		}
	}

	.preview-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
		margin-top: 24rpx;

		.preview-item {
			position: relative;
			border-radius: 12rpx;
			overflow: hidden;

			.preview-image {
				width: 100%;
				height: 200rpx;
			}

			.delete-icon {
				position: absolute;
				right: 8rpx;
				top: 8rpx;
				background: white;
				color: black;
				border-radius: 50%;
				padding: 4rpx;
			}
		}
	}

	.phone-input {
		display: flex;
		align-items: center;
		background: #F8F9FA;
		border-radius: 16rpx;
		padding: 24rpx;

		uni-icons {
			margin-right: 16rpx;
		}

		input {
			flex: 1;
			font-size: 28rpx;
		}
	}

	.submit-area {
		margin-top: 64rpx;

		.submit-btn {
			background: #007aff;
			;
			color: white;
			height: 96rpx;
			border-radius: 64rpx;
			font-size: 32rpx;
			transition: opacity 0.3s;


		}

		.agreement-tip {
			display: block;
			text-align: center;
			color: #7A9D7E;
			font-size: 24rpx;
			margin-top: 24rpx;
		}
	}
</style>