<template>
	<view class="supply-container">
		<view class="filter-section">
			<view class="search">
				<uni-icons type="search" style="margin: 10rpx; font-size: 33rpx;"></uni-icons>
				<input class="serchInput" type="text" placeholder="请输入关键字">
				<view style="display: flex;">
					<button class="btn" type="primary">搜索</button>
					<button class="btn" type="warn">重置</button>
				</view>
			</view>
			<view class="filter-group">
			
					<picker @change="categoryChange" :range="categories" range-key="label">
						<view class="filter-btn">
							<uni-icons type="tags" size="16" color="#3a7afe" /> 
							<text class="btn-text">{{ categories[selectedCategoryIndex].label }}</text>
							<uni-icons type="arrowdown" size="14" color="#3a7afe" />
						</view>
					</picker>
					
					<picker  :range="distances" range-key="label">
						<view class="filter-btn">
							<uni-icons type="tags" size="16" color="#3a7afe" />
							<text class="btn-text">{{ distances[selectedCategoryIndex].label }}</text>
							<uni-icons type="arrowdown" size="14" color="#3a7afe" />
						</view>
					</picker>
			
				</view>
			
		</view>

		<!-- 商品列表 -->
		<scroll-view 
			class="goods-list" 
			scroll-y 
			@scrolltolower="loadMore"
			:scroll-with-animation="true"
		>
			<view class="goods-grid">
				<view 
					class="goods-card" 
					v-for="item in goodsList" 
					:key="item.id" 
					@click="goDetail(item.id)"
				>
					<view class="image-container">
						<image 
							class="goods-image" 
							:src="item.selllogo" 
							mode="aspectFill" 
							:lazy-load="true"
						/>
						<view v-if="item.tag" class="goods-tag">
							{{ item.tag }}
						</view>
					</view>
					
					<view class="goods-content">
						<text class="goods-title">{{ item.selltitle }}</text>
						
						<view class="price-section">
							<text class="current-price">￥{{ item.marketprice }}</text>
							<text 
								class="original-price" 
								v-if="item.price"
							>￥{{ item.price }}</text>
						</view>
						
						<view class="action-bar">
							<view class="sales-info">
								<uni-icons type="shop" size="12" color="#666" />
								<text>{{ item.stoptime }}人付款</text>
							</view>
							<view class="contact-btn" @click.stop="contactNow">
								<text>询底价</text>
								<uni-icons type="arrow-right" size="14" color="#fff" />
							</view>
						</view>
						
						<view class="location-info">
							<uni-icons type="location" size="12" color="#666" />
							<text>{{ item.selladdress }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="load-status">
				<text v-if="loading" class="loading-text">加载中...</text>
				<text v-else-if="noMore" class="no-more">—— 没有更多了 ——</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { api } from '@/api/index.js'

export default {
	data() {
		return {
			distances:[
				{
					label: '离我最近',
					value: ''
				},
				{
					label: '离我最远',
					value: ''
				},
			],
			categories: [{
				label: '所有分类',
				value: ''
			},
			{
				label: '菜类',
				value: ''
			},
			{
				label: '肉类',
				value: ''
			}
			],
			selectedCategoryIndex:0,
			searchText: '',
			goodsList: [],
			page: 1,
			loading: false,
			noMore: false,
			queryData: {
				page: 1,
				limit: 10
			}
		}
	},
	onLoad() {
		this.loadData()
	},
	methods: {
		async loadData() {
			if (this.loading || this.noMore) return
			
			this.loading = true
			try {
				const res = await api.wholesaleList(this.queryData)
				
				this.goodsList = res.data.listdata
				if (res.data.listdata.length === 0) {
					this.noMore = true
					return
				}
				
				this.page++
			} catch (error) {
				console.log(error)
			} finally {
				this.loading = false
			}
		},
		
		processGoodsData(list) {
			return list.map(item => ({
				...item,
				marketprice: Number(item.marketprice).toFixed(2),
				price: item.price ? Number(item.price).toFixed(2) : null,
			}))
		},
		
		
		handleSearch() {
			this.resetList()
			this.loadData()
		},
		
		loadMore() {
			if (!this.noMore) this.loadData()
		},
		
		resetList() {
			this.goodsList = []
			this.page = 1
			this.noMore = false
		},
		
		contactNow() {
			uni.showToast({ title: '已发送联系请求', icon: 'none' })
		},
		
		goDetail(id) {
			uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
		}
	}
}
</script>

<style lang="scss">
	.search {
		height: 60rpx;
		/* border-radius: 50rpx; */
		padding: 5rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1rpx solid #dcdfe6;
		overflow: hidden;
		border-radius: 15rpx;
	}
	
	.search .btn {
		height: 50%;
		text-align: center;
		margin: 0;
		border-radius: 0;
		margin: 5rpx;
		border-radius: 15rpx;
	}
	
	.search .serchInput {
		color:black;
		font-size: 30rpx;
		margin: 0;
		height: 100%;
		
	}
	
	.filter-group {
		margin:10rpx;
		display: flex;
		gap: 30rpx;
		align-items: center;
		.filter-btn {
			display: flex;
			align-items: center;
			padding: 12rpx 24rpx;
			border-radius: 40rpx;
			background: #f5f7fa;
			border: 1rpx solid #e4e7ed;
		}
	}
.supply-container {
	padding: 20rpx;
	background: #f5f5f5;
	min-height: 100vh;
}

.filter-section {
	margin-bottom: 20rpx;
	
	.search-box {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 48rpx;
		padding: 0 28rpx;
		height: 80rpx;
		
		.search-input {
			flex: 1;
			font-size: 28rpx;
			padding: 0 20rpx;
			color: #333;
		}
	}
}

.goods-list {
	height: calc(100vh - 120rpx);
	
	.goods-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		padding-bottom: 40rpx;
	}
	
	.goods-card {
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
	}
	
	.image-container {
		position: relative;
		aspect-ratio: 1/1;
		
		.goods-image {
			width: 100%;
			height: 100%;
		}
		
		.goods-tag {
			position: absolute;
			top: 10rpx;
			left: 10rpx;
			background: #ff4444;
			color: #fff;
			padding: 4rpx 16rpx;
			border-radius: 8rpx;
			font-size: 22rpx;
		}
	}
	
	.goods-content {
		padding: 20rpx;
		
		.goods-title {
			font-size: 28rpx;
			color: #333;
			line-height: 1.4;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			min-height: 80rpx;
			margin-bottom: 16rpx;
		}
		
		.price-section {
			display: flex;
			align-items: baseline;
			margin-bottom: 20rpx;
			
			.current-price {
				color: #ff4444;
				font-size: 32rpx;
				font-weight: 600;
				margin-right: 12rpx;
			}
			
			.original-price {
				color: #999;
				font-size: 24rpx;
				text-decoration: line-through;
			}
		}
		
		.action-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16rpx;
			
			.sales-info {
				display: flex;
				align-items: center;
				color: #666;
				font-size: 24rpx;
				
				.uni-icons {
					margin-right: 6rpx;
				}
			}
			
			.contact-btn {
				background: linear-gradient(90deg, #2979FF, #00B8FF);
				border-radius: 40rpx;
				padding: 8rpx 24rpx;
				display: flex;
				align-items: center;
				
				text {
					color: #fff;
					font-size: 24rpx;
					margin-right: 8rpx;
				}
			}
		}
		
		.location-info {
			display: flex;
			align-items: center;
			color: #666;
			font-size: 24rpx;
			
			.uni-icons {
				margin-right: 6rpx;
			}
		}
	}
}

.load-status {
	padding: 30rpx 0;
	text-align: center;
	font-size: 26rpx;
	color: #999;
	
	.no-more {
		color: #666;
	}
}
</style>
