<template>
	<view class="product-detail-page">
		<view class="product-images">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500"
				indicator-active-color="#ffffff" :circular="true" :key="swiperKey">
				<swiper-item v-for="img in product.images">
					<image :src="img" mode="widthFix" class="product-img"></image>
				</swiper-item>
				<!-- <view v-if="product.images">
					暂无图片
				</view> -->
			</swiper>
		</view>
		<view class="product-base-info">
			<view class="product-title">{{ product.commodity_name }}</view>
			<view class="product-price">
				<text class="current-price">¥{{ product.price.toFixed(2) }}</text>
				<!-- <text class="original-price" v-if="product.price+20">¥{{ product.price.toFixed(2) }}</text> -->
				<!-- <text class="sales-volume" v-if="product.salesVolume">已售 {{ product.salesVolume }} 件</text> -->
			</view>
			<!-- <view class="product-rating" v-if="product.rating">
				<view class="stars">
					<icon type="star" size="16" color="#FFD700" v-for="(star, i) in 5" :key="i"
						:color="i < Math.floor(product.rating) ? '#FFD700' : '#EEEEEE'"></icon>
				</view>
				<text class="rating-text">{{ product.rating.toFixed(1) }} ({{ product.reviewCount }} 评价)</text>
			</view> -->

		</view>

		<!-- 商品规格选择 -->
		<!--    <view class="product-specs" v-if="product.specs && product.specs.length">
      <view class="section-title">选择规格</view>
      <view class="spec-options">
        <view 
          class="spec-option" 
          v-for="(spec, index) in product.specs" 
          :key="index"
          :class="{ 'active': selectedSpecIndex === index }"
          @click="selectedSpecIndex = index"
        >
          {{ spec }}
        </view>
      </view>
    </view> -->

		<!-- 商品数量选择 -->
		<!--    <view class="product-quantity">
      <view class="section-title">数量</view>
      <view class="quantity-control">
        <button class="quantity-btn" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
        <view class="quantity-value">{{ quantity }}</view>
        <button class="quantity-btn" @click="increaseQuantity">+</button>
      </view>
    </view> -->

		<!-- 商品详情标签页 -->
		<view class="product-tabs">
			<view class="tab-item" v-for="(tab, index) in tabs" :key="index" :class="{ 'active': activeTab === index }"
				@click="activeTab = index">
				{{ tab.name }}
			</view>
		</view>

		<!-- 商品详情内容 -->
		<view class="tab-content">
			<!-- 商品详情 -->
			<view v-if="activeTab === 0" class="detail-content">
				<!-- <view class="section-title">基础信息</view> -->
				<view class="product-description">
					<rich-text :nodes="product.description"></rich-text>
				</view>

			</view>

			<!-- 商品溯源 -->
			<view v-if="activeTab === 1" class="traceability-content">
				<!-- <view class="section-title">溯源信息</view> -->
				<view class="product-description">
					<rich-text :nodes="product.traceability"></rich-text>
				</view>
				<!-- 			<view class="traceability-card">
					<view class="trace-item">
						<view class="trace-label">产品名称</view>
						<view class="trace-value">{{ product.traceability.productName }}</view>
					</view>
					<view class="trace-item">
						<view class="trace-label">生产基地</view>
						<view class="trace-value">{{ product.traceability.productionBase }}</view>
					</view>
					<view class="trace-item">
						<view class="trace-label">生产日期</view>
						<view class="trace-value">{{ product.traceability.manufactureDate }}</view>
					</view>
					<view class="trace-item">
						<view class="trace-label">生产批次</view>
						<view class="trace-value">{{ product.traceability.batchNumber }}</view>
					</view>
					<view class="trace-item">
						<view class="trace-label">质检报告</view>
						<view class="trace-value">
							<button class="report-btn" @click="viewReport">查看报告</button>
						</view>
					</view>
					<view class="trace-item">
						<view class="trace-label">物流信息</view>
						<view class="trace-value">{{ product.traceability.logisticsInfo }}</view>
					</view>
				</view>
			 -->
			</view>

			<!-- 评价 -->
			<view v-if="activeTab === 2" class="reviews-content">
				<!-- 				<view class="section-title">用户评价 ({{ product.reviewCount }})</view>
				<view class="review-item" v-for="(review, index) in product.reviews" :key="index">
					<view class="review-header">
						<view class="review-avatar">
							<image :src="review.avatar" mode="widthFix"></image>
						</view>
						<view class="review-user">
							<view class="user-name">{{ review.userName }}</view>
							<view class="review-stars">
								<icon type="star" size="14" color="#FFD700" v-for="(star, i) in 5" :key="i"
									:color="i < review.rating ? '#FFD700' : '#EEEEEE'"></icon>
							</view>
						</view>
						<view class="review-date">{{ review.date }}</view>
					</view>
					<view class="review-content">{{ review.content }}</view>
					<view class="review-images" v-if="review.images && review.images.length">
						<image :src="img" mode="widthFix" class="review-img" v-for="(img, i) in review.images" :key="i">
						</image>
					</view>
				</view>
				<view class="load-more" @click="loadMoreReviews">加载更多评价</view> -->
			</view>


			<!-- <view v-if="activeTab === 3">种养来历</view> -->
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<button v-if="!showCountInput" class="bar-btn cart-btn" @click="showCountInput = true">
				加入购物车
			</button>

			<!-- 切换后显示数量输入框 -->
			<view v-if="showCountInput" class="count-control">
				<button class="count-btn minus" @click="decreaseQuantity"
					style="display: flex;font-size: 50rpx; align-items: center; justify-content: center;">-</button>
				<input type="number" v-model="count" class="count-input" min="1">
				<button class="count-btn plus" @click="increaseQuantity"
					style="display: flex;font-size: 50rpx; align-items: center; justify-content: center;">+</button>
				<button class="bar-btn confirm-btn" @click="confirmAddToCart">
					确认加入
				</button>
				<button class="bar-btn confirm-btn" style="background-color: #4aff08;" @click="cancelAddToCart">
					考虑一下
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	export default {
		async onLoad({
			query
		}) {
			if (query) {
				this.product = JSON.parse(query)
				this.product.images = []
				// console.log(this.product)
			}
			
			this.initCount()

			let data = await api.traceabilityInfo({
				goods_id: Number(this.product.goods_id)
			})
			let data2 = await api.getManyImages({
				goodsid: Number(this.product.goods_id)
			})
			if (data2.code == 200) {
				data2.data.forEach((item) => {
					this.product.images.push(item.url)
					this.swiperKey++
				})
			}
			// console.log(data.data)
			this.product.description = data.data.content
			this.product.traceability = data.data.fromcontent
		},
		data() {
			return {
				showCountInput: false,
				swiperKey: 0,
				// 商品数据
				product: {
					id: 1,
					title: "有机生态种植红富士苹果 5斤装 新鲜水果 脆甜多汁",
					price: 39.9,
					originalPrice: 59.9,
					salesVolume: null, // 已售
					rating: 4.7,
					reviewCount: 328,
					images: [],
					description: ``,
					traceability: null,
					reviews: []
				},
				// 相关推荐商品
				relatedProducts: [],
				// 标签页
				tabs: [{
						name: "基础信息"
					},
					{
						name: "溯源信息"
					},
					// {
					// 	name: "用户评价"
					// },
					// {
					// 	name: "种养来历"
					// }
				],
				activeTab: 0,
				// 选择的规格索引
				selectedSpecIndex: 0,
				// 是否收藏
				isFavorite: false,
				count:1,
			};
		},
		
		methods: {
			initCount(){
				let oldCount =  this.getTempCount()(this.product.id)
				if (oldCount>1){
					this.count = oldCount
				}
			},
			...mapGetters('cart',['getTempCount']),
			...mapMutations('cart', ['addItem','anyNumber','subItem']),
			// 分享
			onShare() {
			},
			
			// 取消
			cancelAddToCart(){
				this.showCountInput  = false
				uni.showToast({
					icon:'success',
					title:'已取消'
				})
				this.initCount()
			},
			
			// 确定加入购物车
			confirmAddToCart(){
				this.product.count = this.count
				this.anyNumber(this.product)
				uni.showToast({
					icon:'success',
					title:'已加入'
				})
				this.showCountInput = false
			},
			// 减少数量
			decreaseQuantity() {
				if (this.count<=0) return;
				this.count--
			},
			// 增加数量
			increaseQuantity() {
				this.count++
			},
			// 查看质检报告
			viewReport() {
			},
			// 加载更多评价
			loadMoreReviews() {
			},
			// 加入收藏
			addToFavorites() {
			},
			// 联系客服
			contactSeller() {
			},
			// 加入购物车
			addToCart() {
			}
		}
	};
</script>

<style scoped>
	.bottom-bar {
		display: flex;
		padding: 12px 16px;
		background-color: #fff;
		border-top: 1px solid #eee;
	}

	.cart-btn {
		width: 100%;
		background-color: #ff4d4f;
		color: #fff;
	}

	.count-control {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 10px;
	}

	.count-btn {
		width: 44px;
		height: 44px;
		border-radius: 22px;
		background-color: #f5f5f5;
		color: #333;
		font-size: 20px;
		border: none;
	}

	.count-btn.minus:disabled {
		opacity: 0.5;
	}

	.count-input {
		width: 60px;
		height: 44px;
		text-align: center;
		border: 1px solid #eee;
		border-radius: 8px;
		font-size: 16px;
	}

	.confirm-btn {
		flex: 1;
		background-color: #ff4d4f;
		color: #fff;
	}

	/* 全局样式 */
	.product-detail-page {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/* 导航栏 */
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 44px;
		padding: 0 16px;
		background-color: #ffffff;
		border-bottom: 1px solid #eeeeee;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-title {
		font-size: 17px;
		font-weight: 500;
		color: #333333;
	}

	/* 商品图片轮播 */
	.product-images {
		width: 100%;
		background-color: #ffffff;
	}

	.product-img {
		width: 100%;
		height: auto;
	}

	/* 商品基本信息 */
	.product-base-info {
		padding: 16px;
		background-color: #ffffff;
		margin-bottom: 10px;
	}

	.product-title {
		font-size: 18px;
		font-weight: 500;
		color: #333333;
		line-height: 1.4;
		margin-bottom: 10px;
	}

	.product-price {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	.current-price {
		font-size: 22px;
		color: #FF4D4F;
		font-weight: 600;
		margin-right: 10px;
	}

	.original-price {
		font-size: 14px;
		color: #999999;
		text-decoration: line-through;
		margin-right: 10px;
	}

	.sales-volume {
		font-size: 14px;
		color: #999999;
	}

	.product-rating {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	.stars {
		display: flex;
		margin-right: 6px;
	}

	.rating-text {
		font-size: 14px;
		color: #666666;
	}

	.product-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		font-size: 12px;
		color: #FF7A45;
		background-color: #FFF7E6;
		padding: 2px 8px;
		border-radius: 4px;
	}

	/* 商品规格和数量 */
	.product-specs,
	.product-quantity {
		padding: 16px;
		background-color: #ffffff;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section-title {
		font-size: 16px;
		color: #333333;
		font-weight: 500;
	}

	.spec-options {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
		max-width: 70%;
	}

	.spec-option {
		font-size: 14px;
		padding: 6px 12px;
		border: 1px solid #dddddd;
		border-radius: 4px;
		color: #666666;
	}

	.spec-option.active {
		border-color: #FF4D4F;
		color: #FF4D4F;
		background-color: rgba(255, 77, 79, 0.05);
	}

	.quantity-control {
		display: flex;
		align-items: center;
	}

	.quantity-btn {
		width: 30px;
		height: 30px;
		line-height: 30px;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #dddddd;
		background-color: #ffffff;
		border-radius: 4px;
		font-size: 18px;
	}

	.quantity-value {
		width: 40px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 16px;
		border-top: 1px solid #dddddd;
		border-bottom: 1px solid #dddddd;
	}

	/* 标签页 */
	.product-tabs {
		display: flex;
		background-color: #ffffff;
		border-bottom: 1px solid #eeeeee;
		/*  position: sticky;
  top: 44px; */
		z-index: 99;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 14px 0;
		font-size: 16px;
		color: #666666;
		position: relative;
	}

	.tab-item.active {
		color: #FF4D4F;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 2px;
		background-color: #FF4D4F;
		border-radius: 1px;
	}

	/* 标签页内容 */
	.tab-content {
		background-color: #ffffff;
		padding-bottom: 20px;
	}

	.detail-content,
	.traceability-content,
	.reviews-content {
		padding: 16px;
	}

	.product-description {
		margin-top: 10px;
		font-size: 15px;
		color: #666666;
		line-height: 1.6;
	}

	.detail-images {
		margin-top: 10px;
	}

	.detail-img {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
	}

	/* 溯源信息 */
	.traceability-card {
		margin-top: 10px;
		background-color: #F9F9F9;
		border-radius: 8px;
		padding: 16px;
	}

	.trace-item {
		display: flex;
		margin-bottom: 16px;
	}

	.trace-item:last-child {
		margin-bottom: 0;
	}

	.trace-label {
		width: 90px;
		font-size: 15px;
		color: #666666;
		font-weight: 500;
	}

	.trace-value {
		flex: 1;
		font-size: 15px;
		color: #333333;
	}

	.report-btn {
		color: #1890FF;
		background-color: transparent;
		border: none;
		padding: 0;
		font-size: 15px;
		display: inline;
		height: auto;
		line-height: normal;
	}

	/* 评价 */
	.review-item {
		padding: 16px 0;
		border-bottom: 1px solid #eeeeee;
	}

	.review-item:last-child {
		border-bottom: none;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.review-avatar image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.review-user {
		flex: 1;
		margin: 0 12px;
	}

	.user-name {
		font-size: 15px;
		color: #333333;
		margin-bottom: 4px;
	}

	.review-stars {
		display: flex;
	}

	.review-date {
		font-size: 12px;
		color: #999999;
	}

	.review-content {
		font-size: 15px;
		color: #333333;
		line-height: 1.6;
		margin-bottom: 10px;
	}

	.review-images {
		display: flex;
		gap: 8px;
	}

	.review-img {
		width: 80px;
		height: 80px;
		border-radius: 4px;
	}

	.load-more {
		text-align: center;
		padding: 12px 0;
		font-size: 15px;
		color: #1890FF;
	}

	/* 相关推荐 */
	.related-products {
		margin-top: 10px;
		background-color: #ffffff;
		padding: 16px;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		margin-top: 10px;
	}

	.related-product-item {
		display: flex;
		flex-direction: column;
	}

	.related-product-img {
		width: 100%;
		height: 160px;
		object-fit: cover;
		border-radius: 8px;
	}

	.related-product-name {
		font-size: 14px;
		color: #333333;
		margin-top: 8px;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		height: 38px;
	}

	.related-product-price {
		font-size: 16px;
		color: #FF4D4F;
		font-weight: 500;
		margin-top: 5px;
	}

	/* 底部操作栏 */
	.bottom-bar {
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50px;
		background-color: #ffffff;
		border-top: 1px solid #eeeeee;
		z-index: 99;
	}

	.bar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		color: #666666;
	}

	.bar-item icon {
		margin-bottom: 4px;
	}

	.bar-btn {
		flex: 2;
		height: 100%;
		border-radius: 0;
		border: none;
		font-size: 25rpx;
		color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.cart-btn {
		background-color: #FAAD14;
	}

	.buy-btn {
		background-color: #FF4D4F;
	}
</style>