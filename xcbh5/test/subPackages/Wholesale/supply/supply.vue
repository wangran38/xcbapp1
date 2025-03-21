<template>
	<view class="supply-container">
		<view class="filter-section">
			<view class="search-box">
				<uni-icons type="search" size="18" color="#999" />
				<input placeholder="输入商品关键词" v-model="searchText" @confirm="handleSearch" class="search-input" />
			</view>

			<view class="filter-row">
				<picker class="filter-select" @change="categoryChange" :range="categories" range-key="label">
					<view class="select-box">
						<text>{{ selectedCategory.label }}</text>
						<uni-icons type="arrowdown" size="14" color="#666" />
					</view>
				</picker>

				<picker class="filter-select" @change="sortChange" :range="sortOptions" range-key="label">
					<view class="select-box">
						<text>{{ selectedSort.label }}</text>
						<uni-icons type="arrowdown" size="14" color="#666" />
					</view>
				</picker>
			</view>
		</view>

		<!-- 商品列表 -->
		<scroll-view class="goods-list" scroll-y @scrolltolower="loadMore">
			<view class="goods-card" v-for="item in goodsList" :key="item.id" @click="goDetail(item.id)">
				<image class="goods-image" :src="item.image" mode="aspectFill" />
				<view class="goods-info">
					<text class="goods-title">{{ item.title }}</text>
					<view class="price-section">
						<text class="current-price">￥{{ item.price }}</text>
						<text class="original-price" v-if="item.originalPrice">￥{{ item.originalPrice }}</text>
					</view>
					<view class="tags">
						<text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
					</view>
					<view class="meta-info">
						<text class="sales">{{ item.sales }}人付款</text>
						<text class="location">{{ item.location }}</text>
					</view>
				</view>
			</view>

			<view class="load-status">
				<text v-if="loading" class="loading-text">加载中...</text>
				<text v-else-if="noMore" class="no-more">没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				categories: [{
						label: '全部分类',
						value: 'all'
					},
					{
						label: '工业原料',
						value: 'industry'
					},
					{
						label: '农产品',
						value: 'agriculture'
					},
					{
						label: '电子元件',
						value: 'electronics'
					}
				],
				sortOptions: [{
						label: '综合排序',
						value: 'default'
					},
					{
						label: '价格从低到高',
						value: 'price_asc'
					},
					{
						label: '价格从高到低',
						value: 'price_desc'
					},
					{
						label: '销量优先',
						value: 'sales'
					}
				],
				selectedCategory: {
					label: '全部分类',
					value: 'all'
				},
				selectedSort: {
					label: '综合排序',
					value: 'default'
				},
				goodsList: [],
				page: 1,
				loading: false,
				noMore: false
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			async loadData() {
				// 模拟数据加载
				const mockData = Array.from({
					length: 10
				}, (_, i) => ({
					id: this.page * 10 + i,
					title: `定安黑山猪 ${this.page * 10 + i}`,
					price: (Math.random() * 1000 + 50).toFixed(2),
					originalPrice: (Math.random() * 1200 + 100).toFixed(2),
					image: `https://img1.baidu.com/it/u=2670186960,2836929917&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500`,
					tags: ['七天退换', '48小时发货', '品质保证'].slice(0, Math.floor(Math.random() * 3)),
					sales: Math.floor(Math.random() * 1000),
					location: ['广东', '浙江', '江苏'][i % 3]
				}))

				this.goodsList = [...this.goodsList, ...mockData]
				this.page++
				this.noMore = this.page > 3
			},
			categoryChange(e) {
				this.selectedCategory = this.categories[e.detail.value]
				this.refreshList()
			},
			sortChange(e) {
				this.selectedSort = this.sortOptions[e.detail.value]
				this.refreshList()
			},
			refreshList() {
				this.page = 1
				this.goodsList = []
				this.noMore = false
				this.loadData()
			},
			loadMore() {
				if (!this.noMore) this.loadData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	$primary-color: #3a7afe;
	$border-color: #e0e0e0;

	.supply-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f8f9fb;

		.filter-section {
			background: #fff;
			padding: 20rpx 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);

			.search-box {
				display: flex;
				align-items: center;
				background: #f5f6fa;
				border-radius: 48rpx;
				padding: 20rpx 32rpx;
				margin-bottom: 24rpx;

				.search-input {
					flex: 1;
					font-size: 28rpx;
					margin-left: 20rpx;
					color: #333;
				}
			}

			.filter-row {
				display: flex;
				gap: 30rpx;

				.filter-select {
					flex: 1;

					.select-box {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 20rpx 32rpx;
						background: #f5f6fa;
						border-radius: 48rpx;
						font-size: 28rpx;
						color: #333;
					}
				}
			}
		}

		.goods-list {
			flex: 1;
			padding: 30rpx;

			.goods-card {
				width: 93%;
				background: #fff;
				border-radius: 24rpx;
				margin-bottom: 30rpx;
				box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.03);
				overflow: hidden;
				transition: transform 0.2s;

				&:active {
					transform: scale(0.98);
				}

				.goods-image {
					width: 100%;
					height: 360rpx;
				}

				.goods-info {
					padding: 24rpx;

					.goods-title {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						font-size: 32rpx;
						line-height: 1.4;
						color: #333;
					}

					.price-section {
						margin: 20rpx 0;
						display: flex;
						align-items: baseline;

						.current-price {
							color: #ff4444;
							font-size: 36rpx;
							font-weight: 600;
						}

						.original-price {
							color: #999;
							font-size: 24rpx;
							text-decoration: line-through;
							margin-left: 16rpx;
						}
					}

					.tags {
						display: flex;
						gap: 12rpx;
						margin-bottom: 20rpx;

						.tag {
							padding: 6rpx 16rpx;
							background: rgba($primary-color, 0.1);
							color: $primary-color;
							border-radius: 8rpx;
							font-size: 24rpx;
						}
					}

					.meta-info {
						width: 90%;
						display: flex;
						justify-content: space-between;
						color: #999;
						font-size: 30rpx;
					}
				}
			}

			.load-status {
				text-align: center;
				padding: 40rpx;
				color: #999;
				font-size: 26rpx;
			}
		}
	}
</style>