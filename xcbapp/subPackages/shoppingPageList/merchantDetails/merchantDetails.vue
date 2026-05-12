<template>
	<view class="container">
		<!-- 农户信息卡片 -->
		<view class="info-card">
			<view class="card-title">
				<uni-icons type="info" size="20" color="#3A7AFE" />
				<text>农户信息</text>
			</view>
			
			<view class="info-item">
				<uni-icons type="person" size="18" color="#3A7AFE" />
				<text class="label">农户名称：</text>
				<text>{{ merchantInfo.farmersname }}</text>
			</view>

			<view class="info-item">
				<uni-icons type="phone" size="18" color="#3A7AFE" />
				<text class="label">联系电话：</text>
				<text>{{ isLogin? merchantInfo.phone:hidePhone(merchantInfo.phone) }}</text>
			</view>

			<view class="info-item">
				<uni-icons type="location" size="18" color="#3A7AFE" />
				<text class="label">所在地址：</text>
				<text>{{ merchantInfo.address }}</text>
			</view>
		</view>

		<!-- 地图 -->
		<view class="map-container">
<!-- 			<map :latitude="merchantInfo.lat" :longitude="merchantInfo.lng"
			 style="width: 100%; height: 320rpx;" :markers="merchantInfo.markers"></map> -->
		</view>

		<!-- 菜园监控 功能入口 -->
		<view class="monitor-card" @click="goToMonitor">
			<view class="monitor-left">
				<uni-icons type="video" size="24" color="#00C26E" />
				<text class="monitor-title">菜园实时监控</text>
				<text class="monitor-desc">在线观看种植现场</text>
			</view>
			<uni-icons type="arrowright" size="20" color="#999" />
		</view>

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
							<text class="presale-price">¥{{ item.price }}</text>
							<text class="original-price">¥{{ item.presaleprice }}</text>
						</view>

						<view class="progress-row">
							<view class="progress-bar">
								<progress :percent="(item.goodstotal > 0 ? Math.min((item.selltotal / item.goodstotal) * 100, 100) : 0)"
								 stroke-width="4" activeColor="#00C26E" />
							</view>
							<text class="sold-text">已售{{ item.selltotal }}/{{ item.goodstotal }}</text>
						</view>

						<view class="countdown">
							<uni-icons type="calendar" size="14" color="#999" />
							<text>剩余{{ getChineseTimeDiff(Date.now(),item.sellendtime) }}</text>
						</view>

						<view class="buy-btn" @click.stop="goToBuy(item)">立即预购</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-if="presaleList.length==0" class="empty">
					<uni-icons type="folder" size="60" color="#ddd" />
					<text>该农户暂未上传菜品</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { api } from '@/api/index.js'
	import { myMixin } from '@/utils/public.js'
	export default {
		mixins: [myMixin],
		data() {
			return {
				merchantInfo: {},
				presaleList: [],
				queryData: { page: 1, limit: 10 },
				isLogin: true,
				showDetail: false
			}
		},

		onLoad({ query }) {
			try {
				this.merchantInfo = JSON.parse(query)
				this.merchantInfo.lat = this.merchantInfo.lat - 0.1
				this.merchantInfo.markers = [{
					id: 1,
					longitude: this.merchantInfo.lng,
					latitude: this.merchantInfo.lat,
					iconPath: '../../../static/selectlocation.png',
					width: 30,
					height: 30
				}]

				this.queryData.farmers_id = parseInt(this.merchantInfo.id)
				this.getPresaleData()

				const token = uni.getStorageSync('token');
				if (!token) {
					this.isLogin = false
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		methods: {
			// 进入菜园监控页面
			goToMonitor() {
				uni.navigateTo({
					url: `/subPackages/shoppingPageList/gardenMonitor/gardenMonitor?query=${JSON.stringify(this.merchantInfo)}`
				})
			},
			
			toggleDetail() {
				this.showDetail = !this.showDetail
			},
			
			gotoGoods(id) {
				uni.navigateTo({
					url: `/pages/dynamics/dynamics?id=${id}`
				})
			},
			
			async getPresaleData() {
				let data = await api.presaleList(this.queryData);
				if (data.code == 200) {
					this.presaleList = [...this.presaleList, ...data.data.listdata]
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

<style lang="scss" scoped>
	.container {
		background: #f7f8fa;
		min-height: 100vh;
		padding: 20rpx;
		box-sizing: border-box;
	}

	/* 农户信息卡片 */
	.info-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);

		.card-title {
			display: flex;
			align-items: center;
			gap: 10rpx;
			font-size: 30rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 20rpx;
		}

		.info-item {
			display: flex;
			align-items: center;
			padding: 24rpx 0;
			border-bottom: 1rpx solid #f2f3f5;
			font-size: 28rpx;
			color: #333;

			&:last-child {
				border: none;
			}

			.label {
				margin: 0 16rpx;
				color: #666;
			}
		}
	}

	/* 地图 */
	.map-container {
		border-radius: 24rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	/* 菜园监控入口 */
	.monitor-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.monitor-left {
			display: flex;
			flex-direction: column;
			gap: 8rpx;
		}

		.monitor-title {
			font-size: 30rpx;
			font-weight: 600;
			color: #333;
		}

		.monitor-desc {
			font-size: 24rpx;
			color: #999;
		}
	}

	/* 预售商品 */
	.presale-section {
		background: #fff;
		border-radius: 24rpx;
		padding: 30rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.count {
				color: #999;
				font-size: 26rpx;
			}
		}

		.goods-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 24rpx;
		}

		.goods-item {
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			position: relative;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

			.presale-tag {
				position: absolute;
				top: 10rpx;
				left: 10rpx;
				background: #00C26E;
				color: #fff;
				padding: 6rpx 12rpx;
				border-radius: 8rpx;
				font-size: 22rpx;
				z-index: 2;
			}

			.goods-image {
				width: 100%;
				height: 280rpx;
				object-fit: cover;
			}

			.goods-info {
				padding: 20rpx;

				.goods-title {
					font-size: 26rpx;
					color: #333;
					line-height: 1.4;
					height: 72rpx;
					overflow: hidden;
				}

				.price-row {
					margin: 12rpx 0;
					display: flex;
					align-items: baseline;

					.presale-price {
						color: #00C26E;
						font-size: 30rpx;
						font-weight: bold;
					}

					.original-price {
						color: #999;
						font-size: 22rpx;
						text-decoration: line-through;
						margin-left: 8rpx;
					}
				}

				.progress-row {
					margin-bottom: 12rpx;

					.sold-text {
						font-size: 22rpx;
						color: #666;
						margin-top: 6rpx;
					}
				}

				.countdown {
					display: flex;
					align-items: center;
					color: #999;
					font-size: 22rpx;
					margin-bottom: 16rpx;
				}
			}
		}

		.buy-btn {
			background-color: #3A7AFE;
			text-align: center;
			border-radius: 12rpx;
			padding: 12rpx;
			color: white;
			font-weight: bold;
			font-size: 26rpx;
		}

		.empty {
			grid-column: 1/3;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 60rpx 0;
			color: #999;
			font-size: 26rpx;
			gap: 16rpx;
		}
	}
</style>