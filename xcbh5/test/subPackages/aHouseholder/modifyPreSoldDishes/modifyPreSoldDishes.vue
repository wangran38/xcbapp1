<template>
	<view class="container">
		<!-- 商品名称展示区 -->
		<view class="product-header">
			<text class="product-name">{{formData.goodsname}}</text>
			<view class="decorative-line"></view>
		</view>

		<!-- 表单主区域 -->
		<view class="form-container">
			<!-- 预售价 -->
			<view class="form-item">
				<view class="item-header">
					<text class="label">预售价</text>
				</view>
				<view class="input-group">
					<text class="currency">¥</text>
					<input type="number" v-model.number="formData.presaleprice" placeholder="请输入价格" class="price-input" />
				</view>
			</view>

			<!-- 库存 -->
			<view class="form-item">
				<view class="item-header">
					<text class="label">预售库存</text>
				</view>
				<input type="number" v-model.number="formData.goodstotal" placeholder="请输入库存量" class="stock-input" />
			</view>

			<!-- 单位选择 -->
			<view class="form-item">
				<view class="item-header">
					<text class="label">商品单位</text>
				</view>
				<input type="text" v-model="formData.unit" placeholder="请输入单位" class="stock-input" />
			</view>

			<!-- 预售开关 -->
			<view class="form-item switch-item">
				<view class="item-header">
					<text class="label">是否预售</text>
					<switch :checked="formData.ispresale == 1 ? false:true" color="#7BCFA9" @change="changeSwitch"/>
				</view>

			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-container">
			<button class="submit-btn" @click="submit">保存修改</button>
		</view>
	</view>
</template>

<script>
	import {api} from '@/api/index.js'
	import {myMixin} from '@/utils/public.js'
	export default {
		data() {
			return {
				formData: {
				}
			}
		},
		mixins:[myMixin],
		methods:{
			submit(){
				uni.showToast({
					icon:'loading',
					title:'正在修改....'
				})
				setTimeout(()=>{
					api.updateDish({
						id:this.formData.id,
						presaleprice:this.formData.presaleprice,
						unit:this.formData.unit,
						goodstotal:this.formData.goodstotal,
						ispresale:this.formData.ispresale,
					}).then((data)=>{
						if(data.code == 200){
							this.customizeBack()
						}
					})
				},2000)
			},
			changeSwitch({detail}){
				this.formData.ispresale = detail.value ? 2 : 1
				console.log(this.formData.ispresale)
			}
		},
		onLoad({
			pramas
		}) {
			if (pramas) {
				this.formData = JSON.parse(pramas)
			}
		},
	}
</script>

<style lang="scss">
	$primary-color: #8DC9B2; // 主色调
	$secondary-color: #E6F4EC; // 辅助色
	$text-primary: #2B593E; // 主要文字色

	.container {
		padding: 32rpx;
		background: #F8FFFC;
		min-height: 100vh;
	}

	.product-header {
		margin-bottom: 48rpx;

		.product-name {
			display: block;
			font-size: 40rpx;
			color: $text-primary;
			font-weight: 600;
			line-height: 1.4;
			margin-bottom: 16rpx;
		}

		.decorative-line {
			width: 80rpx;
			height: 6rpx;
			background: $primary-color;
			border-radius: 3rpx;
		}
	}

	.form-container {
		background: #FFFFFF;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 32rpx rgba(141, 201, 178, 0.1);
		padding: 0 32rpx;
	}

	.form-item {
		padding: 40rpx 0;
		border-bottom: 2rpx solid #F0F7F3;

		&:last-child {
			border-bottom: none;
		}

		.item-header {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;

			.icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}

			.label {
				font-size: 32rpx;
				color: $text-primary;
				font-weight: 500;
			}
		}
	}

	.input-group {
		display: flex;
		align-items: center;
		height: 96rpx;
		background: $secondary-color;
		border-radius: 16rpx;
		padding: 0 32rpx;

		.currency {
			font-size: 40rpx;
			color: $primary-color;
			margin-right: 16rpx;
		}

		.price-input {
			flex: 1;
			font-size: 36rpx;
			color: $text-primary;
			height: 100%;
		}
	}

	.stock-input {
		height: 96rpx;
		background: $secondary-color;
		border-radius: 16rpx;
		padding: 0 32rpx;
		font-size: 32rpx;
		color: $text-primary;
	}

	.unit-picker {
		.picker-content {
			height: 96rpx;
			background: $secondary-color;
			border-radius: 16rpx;
			padding: 0 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 32rpx;
			color: $text-primary;

			.arrow {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.switch-item {
		.item-header {
			margin-bottom: 0;
		}
	}

	.submit-container {
		margin-top: 64rpx;
		padding: 0 32rpx;

		.submit-btn {
			height: 96rpx;
			line-height: 96rpx;
			background: linear-gradient(135deg, $primary-color, #7BCFA9);
			color: white;
			border-radius: 64rpx;
			font-size: 34rpx;
			font-weight: 500;
			box-shadow: 0 8rpx 24rpx rgba(141, 201, 178, 0.3);

			&::after {
				border: none;
			}

			&:active {
				opacity: 0.9;
			}
		}
	}
</style>