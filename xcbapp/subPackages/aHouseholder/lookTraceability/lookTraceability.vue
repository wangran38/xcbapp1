<template>
	<view class="traceability-view-page">

		<view class="form-container" v-if="!dataIsNull">
			<view class="page-title">产品溯源信息查看</view>
			<view class="form-item">
				<text class="label">产品:</text>
				<view class="input-field">{{ productInfo.commodity_name }}</view>
			</view>
			<view class="form-item">
				<text class="label">生源地:</text>
				<view class="input-field">{{ productInfo.baddress }}</view>
			</view>
			<view class="form-item">
				<text class="label">生产日期:</text>
				<view class="input-field">{{ initDate(productInfo.btime) }}</view>
			</view>
			<view class="form-item">
				<text class="label">饲料名称:</text>
				<view class="input-field">{{ productInfo.fodder }}</view>
			</view>
			<view class="form-item">
				<text class="label">饲料来源:</text>
				<view class="input-field">{{ productInfo.fodderfrom }}</view>
			</view>
			<view class="form-item">
				<text class="label">饲料厂家地址:</text>
				<view class="input-field">{{ productInfo.fodderaddress }}</view>
			</view>
			<view class="form-item">
				<text class="label">饲料厂家电话:</text>
				<view class="input-field">{{ productInfo.fodderphone }}</view>
			</view>
			<view class="form-item">
				<text class="label">农药名称:</text>
				<view class="input-field">{{ productInfo.pesticide }}</view>
			</view>
			<view class="form-item">
				<text class="label">农药来源:</text>
				<view class="input-field">{{ productInfo.pesticidefrom }}</view>
			</view>
			<view class="form-item">
				<text class="label">店铺地址:</text>
				<view class="input-field">{{ productInfo.pesticideaddress }}</view>
			</view>
			<view class="form-item">
				<text class="label">药店电话:</text>
				<view class="input-field">{{ productInfo.pesticidephone }}</view>
			</view>
		</view>
		<view v-else>
			<view style="font-size: 30rpx; font-weight: bold;">该商品暂未上传溯源信息</view>
<!-- 			<view style="text-align: center; margin: 40rpx; border: 1rpx solid #2979ff;background-color: #2979ff; color: white;
			padding: 10rpx;" @click="submitFeedback">点击提交反馈</view> -->
		</view>
	</view>
</template>

<script>
	import {myMixin} from '@/utils/public.js'
	import {
		api
	} from '@/api/index.js';
	export default {
		data() {
			return {
				productInfo: {},
				dataIsNull: false
			};
		},
		mixins:[myMixin],
		onLoad(prop) {
			api.lookTraceability({
				commodity_id: parseInt(prop.commodity_id)
			}).then((data) => {
				// 如果有溯源信息就保存数据渲染页面
				if (data.code == 200) {
					this.productInfo = data.data
				} else {
					this.dataIsNull = true
				}

			})
		},
		methods: {
			/**
			 * 提交反馈
			 */
			submitFeedback() {
				// 模拟提交
				uni.showLoading({
					title:'正在提交....',
					success:()=> {
						setTimeout(()=>{
							uni.hideLoading()
							uni.showToast({
								icon:'success',
								title:'提交成功',
								success:()=> {
									setTimeout(()=>this.customizeBack(),1000)
									
								}
							})
							
						},1000)
					}
				})
			},
			
		}
	};
</script>

<style>
	/* 整体页面容器样式 */
	.traceability-view-page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f4f4f4;
		/* 更柔和的背景色 */
		padding: 30px;
		box-sizing: border-box;
		font-family: Arial, sans-serif;
		/* 设置通用字体，提升整体美观度 */
	}

	/* 表单容器样式 */
	.form-container {
		width: 100%;
		max-width: 600px;
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		/* 更细腻的阴影效果 */
		padding: 30px;
		overflow: hidden;
		transition: box-shadow 0.3s ease;
		/* 为阴影添加过渡效果，增强交互感 */
	}

	/* 表单容器鼠标悬停时的样式 */
	.form-container:hover {
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
		/* 悬停时加深阴影 */
	}

	/* 页面标题样式 */
	.page-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30px;
		text-align: center;
		text-transform: uppercase;
		/* 将标题文字转为大写，更显正式 */
		letter-spacing: 1px;
		/* 增加字符间距，提升美观度 */
	}

	/* 每个表单项目的样式 */
	.form-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20px;
		padding: 15px 0;
		/* 适当增加上下内边距，让每行更舒展 */
		border-bottom: 1px solid #e5e5e5;
		/* 更淡的底部边框颜色 */
		transition: background-color 0.3s ease;
		/* 为背景色添加过渡效果，用于交互时的样式变化 */
	}

	/* 表单项目鼠标悬停时的样式 */
	.form-item:hover {
		background-color: #f9f9f9;
		/* 悬停时的背景色变化，增强交互提示 */
	}

	/* 标签文本样式 */
	.label {
		width: 320rpx;
		font-size: 30rpx;
		color: #666;
		margin-right: 15px;
		font-weight: 500;
		/* 稍微加粗标签文字，使其更突出 */
	}

	/* 输入框样式 */
	.input-field {
		width: 100%;
		border: none;
		/* 去除原有的边框，使用下面的伪元素来模拟边框效果 */
		border-radius: 5px;
		padding: 10px;
		font-size: 30rpx;
		cursor: pointer;
		background-color: transparent;
		/* 透明背景，让整体更简洁 */
		color: #333;
		position: relative;
		/* 为下面的伪元素定位做准备 */
	}

	/* 输入框伪元素模拟底部边框样式 */
	.input-field::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: #ccc;
		/* 模拟的底部边框颜色 */
		transition: background-color 0.3s ease;
		/* 为边框颜色添加过渡效果 */
	}

	/* 输入框获取焦点时伪元素模拟底部边框样式变化 */
	.input-field:focus::after {
		background-color: #007aff;
		/* 聚焦时边框颜色变化，增强交互提示 */
	}

	/* 输入框禁用状态下的样式 */
	.input-field:disabled {
		cursor: not-allowed;
		color: #999;
		/* 禁用时文字颜色变灰 */
	}

	/* 输入框禁用状态下伪元素模拟底部边框样式变化 */
	.input-field:disabled::after {
		background-color: #e5e5e5;
		/* 禁用时边框颜色变灰 */
	}
</style>