<template>
	<scroll-view class="shop-detail" scroll-y :style="{ height: '100vh' }" @scrolltolower="handleScrollToLower">
		<inputBoxVue ref="inputBoxVueRef"></inputBoxVue>
		<view class="container">
			<!-- 商铺头部 -->
			<view class="shop-header">
				<image class="shop-logo" :src="shopDetails.logo" mode="aspectFit"></image>
				<view class="shop-info">
					<text class="shop-title">{{ shopDetails.title}}</text>
					<view class="complaint-btn" @click="complaint">
						<uni-icons type="compose" size="18" color="#fff"></uni-icons>
						<text>投诉建议</text>
					</view>
				</view>
			</view>

			<!-- 商铺信息 -->
			<view class="info-card-group">
				<view class="info-card">
					<uni-icons type="person" size="20" color="#2979FF"></uni-icons>
					<view class="info-content">
						<text class="info-label">摊主名称</text>
						<text class="info-value">{{ shopDetails.contactpeople}}</text>
					</view>
				</view>

				<view class="info-card">
					<uni-icons type="phone" size="20" color="#2979FF"></uni-icons>
					<view class="info-content">
						<text class="info-label">联系电话</text>
						<text class="info-value">{{ shopDetails.contactphone}}</text>
					</view>
				</view>

				<view class="info-card">
					<uni-icons type="time" size="20" color="#2979FF"></uni-icons>
					<view class="info-content">
						<text class="info-label">营业时间</text>
						<text class="info-value">6:00 - 21:00</text>
					</view>
				</view>

				<view class="info-card">
					<uni-icons type="certificate" size="20" color="#2979FF"></uni-icons>
					<view class="info-content">
						<text class="info-label">营业执照</text>
						<text class="info-value link" @click="openAvater2">点击查看</text>
					</view>
				</view>
			</view>

			<!-- 地址 -->
			<view class="address-card">
				<uni-icons type="location" size="20" color="#ff6b6b"></uni-icons>
				<view class="address-content">
					<text class="address-text">{{ shopDetails.market_address || '暂无地址信息' }}</text>
				</view>
			</view>

			<!-- 公告 -->
			<view class="notice-card">
				<view class="notice-header">
					<uni-icons type="sound" size="18" color="#ff9f43"></uni-icons>
					<text class="notice-title">公告</text>
				</view>
				<swiper class="notice-swiper" vertical autoplay interval="1500" circular>
					<swiper-item v-for="item in 4" :key="item" class="swiper-item">
						<text class="notice-text">赠送积分说明 {{ item }}</text>
					</swiper-item>
				</swiper>
				<uni-icons type="right" size="14" color="#999"></uni-icons>
			</view>

			<!-- 菜品展示 -->
			<view class="dishes-section">
				<text class="section-title">菜品种类</text>
				<view class="dishes-grid">
					<view class="dish-item" v-for="item in pageData" :key="item.id">
						<menuBarVue :item="item" @showKeyboard="Keyboard"></menuBarVue>
					</view>
				</view>
			</view>

			<shopItem :shop_id="shop_id" ref="shopitem"></shopItem>
		</view>
	</scroll-view>
</template>

<style lang="scss">
.shop-detail {
	background: #f8f9fa;
	.container {
		padding: 24rpx;
	}
}

/* 商铺头部 */
.shop-header {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);

	.shop-logo {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		margin-right: 24rpx;
	}

	.shop-info {
		flex: 1;
		position: relative;
		
		.shop-title {
			font-size: 36rpx;
			font-weight: 600;
			color: #2d3436;
			line-height: 1.4;
		}

		.complaint-btn {
			position: absolute;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			background: #ff7675;
			border-radius: 40rpx;
			padding: 8rpx 24rpx;
			color: #fff;
			font-size: 24rpx;
			
			text {
				margin-left: 8rpx;
			}
		}
	}
}

/* 信息卡片组 */
.info-card-group {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);

	.info-card {
		display: flex;
		align-items: center;
		padding: 24rpx 0;
		&:not(:last-child) {
			border-bottom: 1rpx solid #eee;
		}

		.info-content {
			margin-left: 24rpx;
			.info-label {
				font-size: 26rpx;
				color: #666;
				display: block;
				margin-bottom: 8rpx;
			}
			.info-value {
				font-size: 28rpx;
				color: #333;
				&.link {
					color: #2979FF;
					text-decoration: underline;
				}
			}
		}
	}
}

/* 地址卡片 */
.address-card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);

	.address-content {
		margin-left: 24rpx;
		.address-text {
			font-size: 28rpx;
			color: #333;
			line-height: 1.4;
		}
	}
}

/* 公告卡片 */
.notice-card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);

	.notice-header {
		display: flex;
		align-items: center;
		margin-right: 24rpx;
		.notice-title {
			font-size: 28rpx;
			color: #333;
			margin-left: 12rpx;
		}
	}

	.notice-swiper {
		flex: 1;
		height: 40rpx;
		.swiper-item {
			display: flex;
			align-items: center;
			.notice-text {
				font-size: 26rpx;
				color: #666;
			}
		}
	}
}

</style>
<!-- 
<style lang="scss">
/* 基础样式 */
.container {
	padding: 20rpx;
	background: #f5f5f5;
	min-height: 100vh;
}

/* 商铺头部 */
.StoreName {
	background: #fff;
	padding: 30rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	position: relative;
	
	.logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	
	.shop-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
		vertical-align: middle;
	}
	
	.complaint-btn {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		background: #f8f9fa;
		padding: 10rpx 20rpx;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		
		text {
			font-size: 24rpx;
			margin-left: 8rpx;
		}
	}
}

/* 信息区块 */
.info-section {
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	
	.time {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
		
		.info-item {
			flex: 1;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			
			.info-content {
				margin-left: 20rpx;
				
				.info-label {
					font-size: 26rpx;
					color: #666;
				}
				
				.info-value {
					font-size: 28rpx;
					color: #333;
					
					&.link {
						color: #2979ff;
						text-decoration: underline;
					}
				}
			}
		}
	}
}

/* 地址 */
.address {
	background: #fff;
	padding: 25rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	
	.address-text {
		font-size: 28rpx;
		color: #333;
		margin-left: 15rpx;
	}
}

/* 公告 */
.notice {
	background: #fff;
	padding: 25rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	
	.nleft {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
		
		.ntext {
			font-size: 28rpx;
			color: #333;
			margin-left: 10rpx;
		}
	}
	
	.ncen {
		flex: 1;
		.swiper {
			height: 40rpx;
			
			.swiitem {
				font-size: 26rpx;
				color: #666;
				line-height: 40rpx;
			}
		}
	}
}

.dishes {
		display: flex;
		flex-direction: column;
		/* margin-top: 20rpx; */
		margin-bottom: 180rpx;
	}

	.dishes>text {
		color: black;
		font-size: 30rpx;
		font-weight: 600;
	}

	.dishes>.type {
		margin-top: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: start;
		height: 240rpx;
		width: 100%;
		border-radius: 25rpx;
		box-sizing: border-box;
		background-color: white;
	}
</style>
 -->

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	import shopItem from '@/components/shop-item/shop-item.vue'
	import menuBarVue from '../../components/menuBar.vue';
	import inputBoxVue from '../../components/inputBox.vue';
	
	
	import {
		api
	} from '@/api/index'
	import usePage from '@/hooks/usePage';

	export default {
		data() {
			return {
				cart: [],
				totalPrice: 0,
				showCartLayer: false,
				cartItems: [],
				pageData: [],
				shopDetails: {},
				shop_id: "",
				urls1: [], // 摊主照片
				urls2: [], // 营业执照图片
				cart: false, // 购物车初始化弹窗,锁
				show: false
			}
		},
		mixins: [usePage],
		components: {
			'shopItem':shopItem,
			'menuBarVue':menuBarVue,
			'inputBoxVue':inputBoxVue
		},
		computed: {
			...mapState('cart', ['carts']),
			...mapGetters('cart', ['getTempCount']),
		},
		onShow() {
			this.loadPageData()
		},
		methods: {
			complaint(){
				uni.navigateTo({
					url:`/pages/merchantComplaints/merchantComplaints?id=${this.shopDetails.id}&title=${this.shopDetails.title}`,
				})
			},
			// 需要调起数字键盘
			Keyboard(value){
				this.$refs.inputBoxVueRef.show = true
				this.$refs.inputBoxVueRef.cartItem = value
			},
			// 收起购物车
			closeTan() {
				if (this.$refs.shopitem.showCartLayer1) {
					this.$refs.shopitem.showCartLayer1 = false
				}
			},
			// 查看摊主照片
			openAvater1() {
				if (this.urls1[0].length > 1) {
					uni.previewImage({
						count: 1,
						urls: this.urls1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success: (res) => {}
					})
				} else {
					uni.showToast({
						title: '暂无图片',
						icon: 'error'
					})
					// 如果没有图片,则关闭图片预览
					// uni.closePreviewImage()
				}

			},
			// 查看营业执照
			openAvater2() {
				if (this.urls2[0].length > 1) {
					uni.previewImage({
						count: 1,
						urls: this.urls2,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success: (res) => {}
					})
				} else {
					uni.showToast({
						title: '暂无图片',
						icon: 'error'
					})
					// 如果没有图片,则关闭图片预览
					// uni.closePreviewImage()
				}

			},
			...mapMutations('cart', ['addItem', 'subItem']),


			// 首次加载，初始化
			async loadShopDetails() {
				try {
					// 获取当前页面
					const pages = getCurrentPages();
					const currentPage = pages[pages.length - 1];
					// 从页面查询参数中获取 shop_id
					const query = currentPage.options;
					const shopId = Number(query.id);
					const response = await api.shopDetail(shopId);
					this.shop_id = shopId;
					this.shopDetails = response.data.listdata[0];
					this.urls1.push(this.shopDetails.facelogo)
					this.urls2.push(this.shopDetails.businesslogo)
					return response
				} catch (error) {
					console.error('获取摊主详情失败', error);
					uni.showToast({
						title: '获取摊主详情失败',
						icon: 'none'
					});

				}
			},

			async fetchData(params) {
				const res = await this.loadShopDetails();
				const {
					title
				} = res.data.listdata[0]
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				const query = currentPage.options;


				params = {
					...params,
					shop_id: Number(query.id) || null,
				};

				const response = await api.getmarketCommdityList({
					...params,
					isshow: 1,
				});

				response.data.listdata = response.data.listdata.map(e => {
					return {
						...e,
						shopTitle: title
					}
				})
				return response.data;
			},


			goTorules() {
				uni.navigateTo({
					url: '/pages/rules/rules'
				});
			},
		}
	}
</script>
