<template>
	<view class="container">
		<view class="particle-bg">
			<view v-for="i in 30" :key="i" class="particle" :style="{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: i * 0.2 + 's'
      }"></view>
		</view>

		<view class="search-bar">
		  <uni-icons type="search" size="20" color="#999" />
		  <input 
		    class="search-input" 
		    placeholder="搜索产品" 
		    placeholder-class="placeholder-style"
		  />
		</view>
		<view class="uni-margin-wrap">
			<scroll-view class="category-nav" scroll-x="true">
				<view v-for="(item,index) in categories" :key="item.id" class="swiper-item"
					:class="['nav-item', selectedCategoryId===index?'active':'']">
					<view class="item-title" @click="switchClass(index)">
						<text
							:class="['classify', { 'selected': item.id === selectedCategoryId }]">{{ item.title }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<scroll-view class="goods-scroll" scroll-y @scrolltolower="loadMore">
			<view class="goods-waterfall">
				<view v-for="(item,index) in goodsData" :key="index" class="goods-card"
					:style="{animationDelay:index % 10 * 0.1 + 's'}">
					<!-- 商品主图 -->
					<view class="card-header" @click="goToDynamics(item)">
						<image :src="item.imglogo" class="goods-image" mode="aspectFill" />
						<view class="ribbon" v-if="item.tag">
							<text>{{item.tag}}</text>
							<view class="ribbon-tail"></view>
						</view>
						<view class="sales-progress">
							<progress :percent="(	item.goodstotal > 0 ? Math.min((item.selltotal / item.goodstotal) * 100, 100) : 0)" stroke-width="4"
								activeColor="#ff6b6b" />
							<text>已售{{item.selltotal}}/{{item.goodstotal}}{{item.unit}}</text>
						</view>
					</view>

					<view class="card-body">
						<view class="title-row">
							<text class="title">{{item.goodsname}}</text>
							<uni-icons v-if="item.organic" type="star-filled" color="#ffd700" size="18" />
						</view>
						<view class="price-section">
							<text class="current">¥{{item.price}}</text>
							<text class="original">¥{{item.presaleprice}}</text>
							<text class="discount">{{calcDiscount(item)}}折</text>
							<view class="title">上市时间:{{initDate(item.sellbegintime)}}</view>
						</view>
					</view>

					<view class="card-footer">
						<button class="cart-btn" @click="addToCart(item)">
							点击预购
						</button>
					</view>
				</view>
			</view>

			<view class="loading-state">
				<uni-load-more :status="isLoading ? 'loading' : noMore ? 'noMore' : 'more'" :contentText="{
            contentdown: '上拉显示更多',
            contentrefresh: '正在加载',
            contentnomore: '没有更多了'
          }" />
			</view>
		</scroll-view>

		<!-- 悬浮购物车 -->
		<!-- 		<view class="float-cart" @click="gotoCart">
			<uni-icons type="cart" size="28" color="#fff" />
			<text v-if="cartCount>0" class="badge">{{cartCount}}</text>
		</view> -->
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js';
	import {myMixin} from '@/utils/public.js'
	export default {
		mixins:[myMixin],
		data() {
			return {
				selectedCategoryId: 0,
				activeCategory: 0,
				categories: [],
				goodsData: [],
				cartCount: 0,
				queryData: {
					page: 1,
					limit: 5
				},
				isLoading: false,
				isRefreshing: false,
				noMore: false,
				isRefresh: null
			}
		},
		onLoad() {
			this.getGoodsData()
			this.fetchCategories()
		},
		methods: {
			goToDynamics(item){
				uni.navigateTo({
					url:`/pages/dynamics/dynamics?id=${item.id}`
				})
			},
			switchClass(index) {
				this.selectedCategoryId = index
				console.log(index)
			},
			async fetchCategories() {
				const response = await api.cglist()
				this.categories = response.data.listdata
				// console.log(this.categories)
			},
			async getGoodsData(isRefresh = false) {
				if (this.isLoading || (!isRefresh && this.noMore)) return;

				this.isLoading = true;
				try {
					const {
						code,
						data
					} = await api.presaleList(this.queryData);
					if (code === 200) {
						const list = data.listdata.map(item => ({
							...item,
							goodsname: item.goodsname || '新品预售',
							imglogo: item.imglogo || '/static/default-goods.png',
							presaleprice: item.presaleprice || 10,
							price: item.price || 0,
							sold: item.sold || 1, // 进度
							// stock: item.stock || 100, // 库存
							unit: item.unit || '件',
							organic: !!item.organic
						}));

						this.goodsData = [...this.goodsData, ...list];
						this.noMore = list.length < this.queryData.limit;
					}
				} finally {
					this.isLoading = false;
					this.isRefreshing = false;
				}
			},
			particleStyle(i) {
				return 1
			},

			calcDiscount(item) {
				return ((item.price/item.presaleprice)*10).toFixed(1)
			},
			addToCart(item) {
				// uni.showToast({
				// 	icon: 'success',
				// 	title: '加入成功'
				// })
				// console.log()	
				uni.navigateTo({
					url: `/subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit?query=${JSON.stringify(item)}`
				})
			},
			loadMore() {
				if (!this.noMore) {
					this.queryData.page++;
					this.getGoodsData();
				}
			},
			gotoCart() {
				uni.navigateTo({
					url: '/pages/cart/index'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-bar {
		margin: 10rpx;
	  background: #FFF;
	  height: 80rpx;
	  border-radius: 40rpx;
	  display: flex;
	  align-items: center;
	  padding: 0 30rpx;
	  margin-bottom: 30rpx;
	  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
	  
	  .search-input {
	    flex: 1;
	    height: 100%;
	    font-size: 28rpx;
	    margin-left: 20rpx;
	  }
	  
	  .placeholder-style {
	    color: #CCC;
	  }
	}
	
	.container {
		background: linear-gradient(160deg, #f5fff0 0%, #e3f0da 100%);
		min-height: 100vh;
		position: relative;
	}

	.particle-bg {
		position: fixed;
		width: 100%;
		height: 100%;
		pointer-events: none;

		.particle {
			position: absolute;
			width: 8rpx;
			height: 8rpx;
			background: rgba(126, 191, 80, 0.3);
			border-radius: 50%;
			animation: particle 3s infinite;

			@keyframes particle {
				0% {
					transform: translateY(0);
					opacity: 0
				}

				50% {
					opacity: 1
				}

				100% {
					transform: translateY(-300rpx);
					opacity: 0
				}
			}
		}
	}

	.category-nav {
		white-space: nowrap;
		padding: 20rpx 0;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		position: sticky;
		top: 0;
		z-index: 10;

		.nav-item {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			padding: 0 40rpx;
			font-size: 26rpx;
			color: #666;
			transition: all 0.3s;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				width: 0;
				height: 4rpx;
				background: #007aff;
				transition: width 0.3s;
			}

			&.active {
				color: #007aff;
				transform: scale(1.1);

				text {
					font-weight: bold;
				}

				&::after {
					width: 60%;
				}
			}
		}
	}

	.goods-scroll {
		height: calc(100vh - 120rpx);
		box-sizing: border-box;
	}

	.goods-waterfall {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		padding: 30rpx;
	}

	.goods-card {
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		opacity: 0;
		transform: translateY(50rpx);
		animation: cardEnter 0.6s forwards;

		@keyframes cardEnter {
			to {
				opacity: 1;
				transform: translateY(0)
			}
		}
	}

	.card-header {
		position: relative;

		.goods-image {
			width: 100%;
			height: 300rpx;
		}

		.ribbon {
			position: absolute;
			top: 20rpx;
			right: -40rpx;
			background: #ff6b6b;
			color: #fff;
			padding: 8rpx 50rpx;
			transform: rotate(45deg);

			text {
				font-size: 24rpx;
			}

			&-tail {
				position: absolute;
				right: -10rpx;
				bottom: -10rpx;
				border-width: 10rpx;
				border-style: solid;
				border-color: transparent #c00 #c00 transparent;
			}
		}

		.sales-progress {
			position: absolute;
			bottom: 20rpx;
			left: 20rpx;
			right: 20rpx;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 40rpx;
			padding: 12rpx;
			color: #fff;
			font-size: 24rpx;

			progress {
				margin-bottom: 8rpx;
			}
		}
	}

	.card-body {
		padding: 20rpx;

		.title-row {
			display: flex;
			align-items: center;

			.title {
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
				margin-right: 10rpx;
			}
		}

		.price-section {
			margin-top: 15rpx;

			.current {
				color: #ff6b6b;
				font-size: 36rpx;
				font-weight: bold;
			}

			.original {
				color: #999;
				font-size: 24rpx;
				text-decoration: line-through;
				margin: 0 15rpx;
			}

			.discount {
				background: #fff0f0;
				color: #ff6b6b;
				padding: 4rpx 12rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
			}
		}
	}

	.card-footer {
		padding: 20rpx;

		.cart-btn {
			background-color: #007aff;
			color: #fff;
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 70rpx;
			font-size: 28rpx;

			.btn-icon {
				width: 36rpx;
				height: 36rpx;
				margin-right: 10rpx;
			}
		}
	}

	.float-cart {
		position: fixed;
		right: 40rpx;
		bottom: 100rpx;
		width: 90rpx;
		height: 90rpx;
		background: #7EBF50;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 20rpx rgba(126, 191, 80, 0.3);

		.badge {
			position: absolute;
			top: -10rpx;
			right: -10rpx;
			background: #ff6b6b;
			color: #fff;
			min-width: 36rpx;
			height: 36rpx;
			border-radius: 18rpx;
			font-size: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 8rpx;
		}
	}

	.loading-state {
		padding: 30rpx;
	}
</style>