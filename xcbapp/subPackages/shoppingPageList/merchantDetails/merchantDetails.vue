<template>
	<view class="container">
			
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	import {myMixin} from '@/utils/public.js'
	export default {
		mixins:[myMixin],
		data() {
			return {
				merchantInfo: {
					// license: null,
					// company: null,
					// owner: null,
					// contact: null,
					// phone: null,
					// businessHours: null,
					// address: null,
					// lat:null,
					// lng:null,
					// markers:[]
				},
				presaleList: [],
				queryData: {
					page: 1,
					limit: 10
				},
				isLogin:true,
				showDetail:false
			}
		},

		onLoad({query}) {
			this.merchantInfo = JSON.parse(query)
			// console.log(this.merchantInfo)
			console.log(this.merchantInfo.lat)
			this.merchantInfo.lat = this.merchantInfo.lat-0.1
			this.merchantInfo.markers = [{id:1,longitude:this.merchantInfo.lng,latitude:this.merchantInfo.lat,iconPath:'../../../static/selectlocation.png',width:30,height:30}]
			
			this.queryData.farmers_id= parseInt(this.merchantInfo.id)
			this.getPresaleData()
			
			const token = uni.getStorageSync('token');
			if (!token){
				this.isLogin = false
			}
		},
		methods: {
			// 展开/收起商品详情
			toggleDetail() {
				this.showDetail = !this.showDetail
			},
			gotoGoods(id){
				uni.navigateTo({
					url:`/pages/dynamics/dynamics?id=${id}`
				})
			},
			async getPresaleData() {
				let data = await api.presaleList(this.queryData);
				if (data.code == 200){
					this.presaleList = [...this.presaleList,...data.data.listdata]
				}
			},

			goToBuy(data) {
				const copyData = JSON.parse(JSON.stringify(data));
				copyData.cover = null
				let query = JSON.stringify(copyData)
				uni.navigateTo({
					url: `/subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit?query=${query}`
				})
			}
		},
	}
</script>

<style lang="scss">
	.container {
		background: #f8f9fa;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.info-scroll {
		flex: 1;
		padding: 20rpx;
	}

	.license-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;

		.section-title {
			font-size: 32rpx;
			color: #333;
			margin-bottom: 20rpx;
		}

		.license-image {
			width: 100%;
			border-radius: 8rpx;
			margin-bottom: 20rpx;
		}

		.license-info {
			font-size: 28rpx;
			color: #666;
			line-height: 1.6;
		}
	}

	.info-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;

		.info-item {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #eee;

			&:last-child {
				border: none;
			}

			.label {
				color: #666;
				margin: 0 16rpx;
			}
		}
	}

	.cert-section {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		display: flex;
		justify-content: space-around;

		.cert-item {
			display: flex;
			flex-direction: column;
			align-items: center;

			.cert-icon {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 12rpx;
			}

			.cert-text {
				font-size: 24rpx;
				color: #666;
			}
		}
	}

	.presale-section {
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		padding: 24rpx;
		box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;

			.title {
				font-size: 34rpx;
				font-weight: bold;
			}

			.count {
				color: #999;
				font-size: 26rpx;
			}
		}

		.goods-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
		}

		.goods-item {
			background: #fff;
			border-radius: 12rpx;
			overflow: hidden;
			position: relative;

			.presale-tag {
				position: absolute;
				top: 10rpx;
				left: 10rpx;
				background: #ff5a5f;
				color: #fff;
				padding: 4rpx 16rpx;
				border-radius: 8rpx;
				font-size: 24rpx;
				z-index: 2;
			}

			.goods-image {
				width: 100%;
				height: 300rpx;
			}

			.goods-info {
				padding: 20rpx;

				.goods-title {
					font-size: 28rpx;
					color: #333;
					line-height: 1.4;
				}

				.price-row {
					margin: 16rpx 0;
					display: flex;
					align-items: baseline;

					.presale-price {
						color: #ff5a5f;
						font-size: 34rpx;
						font-weight: bold;
						margin-right: 16rpx;
					}

					.original-price {
						color: #999;
						font-size: 24rpx;
						text-decoration: line-through;
					}
				}

				.progress-row {
					margin-bottom: 16rpx;

					.progress-bar {
						height: 8rpx;
						background: #eee;
						border-radius: 4rpx;
						overflow: hidden;

						.progress {
							height: 100%;
							background: #7A9D7E;
							transition: width 0.3s;
						}
					}

					.sold-text {
						font-size: 24rpx;
						color: #666;
						margin-top: 8rpx;
					}
				}

				.countdown {
					display: flex;
					align-items: center;
					color: #999;
					font-size: 24rpx;

					uni-icons {
						margin-right: 8rpx;
					}
				}
			}
		}
	}
</style>