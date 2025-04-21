<template>
	<view class="container">

			<!-- 基础信息 -->
			<view class="info-card">
				<view class="info-item">
					<uni-icons type="person" size="18" color="#7A9D7E" />
					<text class="label">农户名称：</text>
					<text>{{ merchantInfo.farmersname }}</text>
				</view>

				<view class="info-item">
					<uni-icons type="phone" size="18" color="#7A9D7E" />
					<text class="label">联系电话：</text>
					<text>{{ merchantInfo.phone | hidePhone }}</text>
				</view>

				<!-- <view class="info-item">
          <uni-icons type="shop-filled" size="18" color="#7A9D7E" />
          <text class="label">在线营业时间：</text>
          <text>{{ merchantInfo.businessHours }}</text>
        </view> -->

				<view class="info-item">
					<uni-icons type="location" size="18" color="#7A9D7E" />
					<text class="label">所在地址：</text>
					<text>{{ merchantInfo.address }}</text>
				</view>
			</view>
		</scroll-view>

		<!-- 预售商品 -->
		<view class="presale-section">
			<view class="section-header">
				<text class="title">预售商品</text>
				<text class="count">共{{ presaleList.length }}件</text>
			</view>

			<view class="goods-grid">
				<view class="goods-item" v-for="(item, index) in presaleList" :key="item.id"
					@click="gotoGoods(item.id)">
					<view class="presale-tag">预售中</view>
					<image :src="item.imglogo" class="goods-image" mode="aspectFill" lazy-load />

					<view class="goods-info">
						<text class="goods-title">{{ item.goodsname }}</text>

						<view class="price-row">
							<text class="presale-price">¥{{ item.presaleprice }}</text>
							<text class="original-price">¥{{ item.price }}</text>
						</view>

						<view class="progress-row">
							<view class="progress-bar">
								<progress
									:percent="(	item.goodstotal > 0 ? Math.min((item.selltotal / item.goodstotal) * 100, 100) : 0)"
									stroke-width="4" activeColor="green" />
							</view>
							<text class="sold-text">已售{{ item.selltotal }}/{{ item.goodstotal }}</text>
							<view class="countdown" style="color: red; font-weight: bold;">
								<text>已有0人参与预购</text>
							</view>
						</view>

						<view class="countdown">
							<uni-icons type="calendar" size="14" color="#999" />
							<text>剩余{{ getChineseTimeDiff(Date.now(),item.sellendtime) }}</text>
						</view>


						<view style="background-color: #007aff; text-align: center; border-radius: 5%;
			padding: 10rpx; margin: 20rpx; color: white; font-weight: bold;" @click.stop="goToBuy(item)">立即预购</view>
					</view>
				</view>
			</view>
		</view>
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
					license: 'https://gimg2.baidu.com/image_search/src=https%3A%2F%2Fwww.generalwatertech.com%2Fuploadfiles%2F2020%2F01%2F20200109175314541.jpg%3FMS5qcGc%3D&refer=http%3A%2F%2Fwww.generalwatertech.com&app=2002&size=f10000,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1747797598&t=eef8bf02399dfce855a0cd57101aa19c',
					company: '生生海鲜',
					owner: '王启俊',
					contact: '王启俊',
					phone: '13800138000',
					businessHours: '08:30-22:00',
					address: '海南省定安县塔岭新区北源商贸广场2区10号楼'
				},
				presaleList: [],
				queryData: {
					page: 1,
					limit: 10
				}
			}
		},
		filters: {
			hidePhone(val) {
				return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
			},
			countdown(timestamp) {
				const diff = timestamp - Date.now()
				const days = Math.floor(diff / (1000 * 60 * 60 * 24))
				const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				return `${days}天${hours}小时`
			}
		},
		onLoad({query}) {
			this.merchantInfo = JSON.parse(query)
			
			this.queryData.farmers_id= parseInt(this.merchantInfo.id)
			this.getPresaleData()
		},
		methods: {
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