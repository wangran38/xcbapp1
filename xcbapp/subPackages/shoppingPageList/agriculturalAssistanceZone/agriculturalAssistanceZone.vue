<template>
	<view class="container"> <!-- 扶贫主题轮播 -->
		<swiper class="banner" autoplay circular indicator-dots> <swiper-item v-for="(item,index) in banners"
				:key="index">
				<image :src="item.img" class="banner-img" mode="aspectFill"></image>
				<view class="banner-label">{{item.title}}</view>
			</swiper-item> </swiper> <!-- 扶贫数据看板 -->
		<view class="dashboard">
			<view class="data-item"> <text class="value">832</text> <text class="label">帮扶农户</text> </view>
			<view class="data-item"> <text class="value">2360万</text> <text class="label">累计销售额</text> </view>
			<view class="data-item"> <text class="value">98%</text> <text class="label">好评率</text> </view>
		</view> <!-- 扶贫商品列表 -->
		<view class="product-list">
			<view v-for="item in products" :key="item.id" class="product-card" @click="viewDetail(item.id)">
				<view class="badge">助农补贴</view>
				<image :src="item.cover" class="cover"></image>
				<view class="info">
					<view class="header"> <text class="title">{{item.title}}</text> <u-tag :text="item.region"
							size="mini" type="warning"></u-tag> </view>
					<view class="farmer-info">
						<image :src="item.farmer.avatar" class="avatar"></image> <text
							class="name">{{item.farmer.name}}</text>
					</view>
					<view class="progress"> <text class="label">助农进度</text> <u-line-progress :percent="item.progress"
							:show-text="false" height="10" active-color="#ff7900"></u-line-progress> <text
							class="percent">{{item.progress}}%</text> </view>
					<view class="footer">
						<view class="price"> <text class="current">¥{{item.price}}</text> <text
								class="original">¥{{item.originalPrice}}</text> </view> <text
							class="sold">已助力{{item.sold}}件</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				banners: [{
					img: "https://img2.baidu.com/it/u=3794887849,1985339825&fm=253&fmt=auto&app=138&f=JPEG?w=537&h=500",
					title: "大山里的希望果园"
				}, {
					img: "https://img.tusij.com/qiantu_assets/user_download_ue/2021-05-17/qt_bb0f4a635fde3dfb99161a1f193df968_39881.jpg?auth_key=2342036953-0-0-5365a15afbb4e023df1aacbbdb5b36de&x-oss-process=image/resize,m_fixed,h_934,w_700/crop,x_0,y_0,w_700,h_476",
					title: "乡村振兴在行动"
				}],
				products: [{
					id: 1,
					cover: "https://img2.baidu.com/it/u=1634565536,1061025085&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067",
					title: "农家自采天然蜂蜜",
					region: "海南琼海",
					progress: 78,
					price: 39.9,
					originalPrice: 58.0,
					sold: 2560,
					farmer: {
						name: "王伟",
						avatar: "https://p2-pro.a.yximgs.com/uhead/AB/2025/04/01/16/BMjAyNTA0MDExNjQyNDZfMTQ1NDAxNDI5MV8yX2hkMTg5XzE1MA==_s.jpg",
					}
				}, ]
			}
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		background: #f8f8f8;
		padding-bottom: 120rpx;
	}

	.banner {
		height: 360rpx;
		position: relative;

		&-img {
			width: 100%;
			height: 100%;
		}

		&-label {
			position: absolute;
			bottom: 30rpx;
			left: 30rpx;
			background: rgba(0, 0, 0, 0.5);
			color: #fff;
			padding: 8rpx 20rpx;
			border-radius: 8rpx;
			font-size: 28rpx;
		}
	}

	.dashboard {
		display: flex;
		justify-content: space-around;
		background: #fff;
		margin: 20rpx;
		padding: 30rpx 0;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

		.data-item {
			display: flex;
			flex-direction: column;
			align-items: center;

			.value {
				color: #ff7900;
				font-size: 40rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}

			.label {
				color: #666;
				font-size: 24rpx;
			}
		}
	}

	.product-list {
		padding: 0 20rpx;

		.product-card {
			background: #fff;
			border-radius: 16rpx;
			margin: 20rpx;
			position: relative;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

			.badge {
				position: absolute;
				top: 20rpx;
				left: 0;
				background: #ff7900;
				color: #fff;
				padding: 6rpx 20rpx;
				border-radius: 0 8rpx 8rpx 0;
				font-size: 24rpx;
				z-index: 2;
			}

			.cover {
				width: 100%;
				height: 300rpx;
			}

			.info {
				padding: 20rpx;

				.header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;

					.title {
						font-size: 30rpx;
						color: #333;
						flex: 1;
						margin-right: 20rpx;
					}
				}

				.farmer-info {
					display: flex;
					align-items: center;
					margin-bottom: 25rpx;

					.avatar {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						margin-right: 12rpx;
					}

					.name {
						color: #666;
						font-size: 26rpx;
					}
				}

				.progress {
					.label {
						color: #888;
						font-size: 24rpx;
						margin-bottom: 10rpx;
					}

					.percent {
						color: #ff7900;
						font-size: 24rpx;
						margin-left: 15rpx;
					}
				}

				.footer {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20rpx;

					.price {
						.current {
							color: #ff7900;
							font-size: 36rpx;
							font-weight: bold;
						}

						.original {
							color: #999;
							font-size: 24rpx;
							text-decoration: line-through;
							margin-left: 12rpx;
						}
					}

					.sold {
						color: #999;
						font-size: 24rpx;
					}
				}
			}
		}
	}

	.story-fab {
		position: fixed;
		right: 40rpx;
		bottom: 120rpx;
		background: #ff7900;
		padding: 16rpx 24rpx;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 8rpx 20rpx rgba(255, 121, 0, 0.3);

		text {
			color: #fff;
			font-size: 26rpx;
			margin-left: 10rpx;
		}
	}
</style>