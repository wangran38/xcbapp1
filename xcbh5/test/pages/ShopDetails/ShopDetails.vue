<template>
	<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower" :style="{ height: '100vh' }"
		@click="closeTan">
		<view class="container">
			<view class="StoreName">
				<text>{{ shopDetails.title}}</text>
				<image class="logo" :src="shopDetails.logo" mode="aspectFill"></image>
			</view>

			<view class="time">
				<view class="business-hours">
					<view>摊主名称:</view>
					<view class="hour">{{ shopDetails.contactpeople}}</view>
				</view>

				<view class="phone">
					<uni-icons type="person-filled" size="20" style="height: 30rpx;" @click="openAvater1"></uni-icons>
					<!-- <text>时间</text> -->
				</view>
			</view>

			<view class="time">
				<view class="business-hours">
					<view @click="handleScrollToLower">电话:</view>
					<view class="hour">{{ shopDetails.contactphone}}</view>
				</view>

				<view class="phone">
					<uni-icons type="phone-filled" size="20" style="height: 30rpx;"></uni-icons>
					<!-- <text>时间</text> -->
				</view>
			</view>

			<view class="time">
				<view class="business-hours">
					<view>营业时间:</view>
					<view class="hour">7.00-12.00</view>
				</view>

				<view class="phone">
					<uni-icons type="calendar-filled" size="20" style="height: 30rpx;"></uni-icons>
				</view>
			</view>

			<view class="time">
				<view class="business-hours">
					<view>营业执照:</view>
					<view class="hour" @click="openAvater2">点击查看摊位营业执照</view>
				</view>

				<view class="phone">
					<uni-icons type="map-filled" size="20" style="height: 30rpx;"></uni-icons>
				</view>
			</view>

			<view class="address">
				<!-- <text>地址：{{ shopDetails.address}}</text> -->
				<text>地址：{{ shopDetails.market_address ? shopDetails.market_address : '' }}</text>
				<uni-icons type="location-filled" size="20" style="margin-right: 10rpx;"></uni-icons>
			</view>

			<view class="notice">
				<view class="nleft">
					<uni-icons type="sound-filled" size="20" color="#007aff"></uni-icons>
					<text class="ntext">公告</text>
				</view>
				<view class="ncen" @click="goTorules">
					<swiper class="swiper" vertical autoplay interval="1500" duration="300" circular>
						<swiper-item class="swiitem" v-for="item in 4" :key="item">赠送积分说明</swiper-item>
					</swiper>
				</view>
				<view class="nrig" @click="goTorules">
					<uni-icons type="right" size="16" color="#333"></uni-icons>
				</view>
			</view>

			<view class="dishes">
				<text>菜品种类</text>
				<view class="type" v-for="item in pageData" :key="item.id">
					<menuVue :item="item" class="count"></menuVue>
				</view>
			</view>
			
				<shopItem :shop_id="shop_id" ref="shopitem"></shopItem>
			
		</view>
		
			
		
		
	</scroll-view>

</template>


<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	import shopItem from '@/components/shop-item/shop-item.vue'
	import menuVue from '../../components/menu.vue';
	import {
		api
	} from '@/api/index'
	import usePage from '@/hooks/usePage';
	import ShopDetailsVue from './ShopDetails.vue';

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
			shopItem,
			menuVue
		},
		computed: {
			...mapState('cart', ['carts']),
			...mapGetters('cart', ['getTempCount']),
		},
		onShow() {
			this.loadPageData()
		},
		methods: {
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


<style>
	.container {
		display: flex;
		flex-direction: column;
		margin: 1rpx auto;
		padding: 15rpx;
	}

	.StoreName {
		height: 180rpx;
		padding: 10rpx;
		/* line-height: 60rpx; */
		margin-bottom: 30rpx;
		font-size: 42rpx;
		font-weight: 600;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		height: 150rpx;
		width: 150rpx;
		border-radius: 20rpx;
	}




	.time {
		/* margin-top: 20rpx; */
		height: 60rpx;
		line-height: 60rpx;
		padding: 10rpx;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
	}

	.business-hours {
		color: black;
		font-size: 30rpx;
		font-weight: 600;
		display: flex;
		/* background-color: #007aff; */
	}

	.hour {
		margin-left: 20rpx;
	}

	.phone {
		height: 100%;
		display: flex;
		margin-right: 10rpx;
		box-sizing: border-box;
	}

	.phone>text {
		margin-top: 0rpx;
	}

	.address {
		height: 60rpx;
		line-height: 60rpx;
		padding: 10rpx;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
	}

	.address>text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: black;
		font-size: 30rpx;
		font-weight: 600;
	}

	.notice {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: white;
		margin: 20rpx auto;
		border-radius: 80rpx;
		display: flex;
		/* justify-content: center; */
		align-items: center;
		box-sizing: border-box;
		padding: 0 20rpx;
	}

	.nlef {
		width: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ntext {
		color: #007aff;
		font-weight: 600;
		font-size: 28rpx;
	}

	.nrig {
		width: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ncen {
		height: 100%;
		flex: 1;
	}

	.swiper {
		height: 100%;
		/* background-color: #007aff; */
	}

	.swiitem {
		height: 100%;
		text-align: center;
		font-size: 30rpx;
		color: #666;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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
		height: 200rpx;
		width: 100%;
		border-radius: 25rpx;
		box-sizing: border-box;
		background-color: white;
	}


	.regard {
		height: 100%;
		width: 71%;
		display: flex;
		flex-direction: column;
	}

	.typetitle {
		height: 100rpx;
		width: 100%;
		line-height: 100rpx;
		color: black;
		font-size: 40rpx;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 10%;
	}

	.label {
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 20rpx;
		color: #007aff;
		/* background-color: #007aff; */
		display: flex;
	}

	.one {
		width: 15%;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		/* background-color: #007aff; */
		border: 0.5rpx solid #007aff;
		margin-right: 10rpx;
	}

	.price {
		height: 50%;
		/* width: 100%; */
		padding: 0 10rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}

	.price>text {
		height: 50rpx;
		width: 50%;
		line-height: 50rpx;
		color: red;
		font-size: 35rpx;
		font-weight: 600;
		margin-bottom: 8rpx;

	}

	.quantity {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10rpx;
	}

	.btn1,
	.btn2 {
		width: 50rpx;
		height: 50rpx;
		background-color: #007aff;
		color: white;
		text-align: center;
		line-height: 50rpx;
		border-radius: 50%;
		margin: 0 10rpx;
	}

	.count {
		width: 100%;
	}
	.fixed {
		height: 100rpx;
		width: 90%;
		background-color: black;
		border-radius: 100rpx;
		position: fixed;
		/* box-sizing: border-box; */
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		z-index: 1000;
	}

	.car {
		/* width: 280rpx; */
		flex: 1;
		height: 100%;
		color: white;
		/* background-color: aqua; */
		border-radius: 100rpx 0 0 100rpx;
		/* padding-left: 30rpx; */
		display: flex;
		justify-content: start;
		align-items: center;
		font-size: 40rpx;
		margin-left: 30rpx;
	}

	.pri {
		margin-left: 30rpx;
	}

	.cart-icon-wrapper {

		position: relative;
		display: inline-block;
	}

	.badge {
		position: absolute;
		top: -10rpx;
		/* Adjust to position the badge vertically */
		right: -10rpx;
		/* Adjust to position the badge horizontally */
		background-color: red;
		color: white;
		border-radius: 50%;
		font-size: 20rpx;
		/* Adjust font size */
		width: 40rpx;
		/* Width of the badge */
		height: 40rpx;
		/* Height of the badge */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sett {
		width: 200rpx;
		height: 100%;
		margin-left: auto;
		background-color: #007aff;
		border-radius: 0 100rpx 100rpx 0;
		color: white;
		font-size: 30rpx;
		text-align: center;
		line-height: 100rpx;
	}

	.overlay {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		transition: opacity 0.3s ease;
		opacity: 0;
		pointer-events: none;
		z-index: 999;
		left: 0;
	}

	.overlay-active {
		opacity: 1;
		pointer-events: auto;
		/* 激活状态下可点击 */
	}

	.cart-layer {

		background-color: white;
		/* padding: 20rpx; */
		padding-top: 0;
		border-radius: 50rpx 50rpx 0 0;
		width: 100%;
		/* max-width: 600rpx; */
		transition: transform 0.3s ease;
		/* 平滑的从底部弹出效果 */
		transform: translateY(100%);
		/* Add any additional styling here */
	}

	.cart-layer-active {
		transform: translateY(0);
		/* 激活状态下弹出层回到视口内 */
	}

	.Topmost {
		height: 50rpx;
		width: 100%;
		line-height: 50rpx;
		border-radius: 50rpx 50rpx 0 0;
		background-color: #007aff;
		color: white;
		text-align: center;
	}

	.shopcontent {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		margin-bottom: 130rpx;
	}

	.top {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		margin: 0rpx auto;
		border-bottom: 1rpx solid #ccc;
	}


	.delete {
		width: 30%;
		height: 70%;
		display: flex;
		margin: auto 0;
		margin-left: auto;
		justify-content: center;
		align-items: center;

	}

	.shopimg {

		width: 100%;
		height: 100%;
		border-radius: 20rpx;

	}

	.shoptitle {
		font-size: 35rpx;
		font-weight: 600;
	}

	.shopprice {
		color: red;
		font-size: 35rpx;
		font-weight: 600;
	}

	.biaoti {
		height: 100rpx;
		width: 100rpx;
		background-color: #007aff;
	}
</style>