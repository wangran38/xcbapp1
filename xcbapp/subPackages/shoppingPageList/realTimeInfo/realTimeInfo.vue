<template>
	<view class="news-container">
		<!-- 		<view class="search-bar">
			<view class="search-box">
				<uni-icons type="search" size="18" color="#999" />
				<input class="search-input" placeholder="请输入关键词搜索" placeholder-class="placeholder"
					@input="onSearchInput" />
			</view>
		</view> -->
		<mButtonVue @btn1="startSearch" @btn2="stopSearch" :isShowbutton2="true" :placeholder="'输入关键词搜索'"></mButtonVue>

		<scroll-view class="category-nav" scroll-x>
			<view v-for="(item, index) in categories" :key="item.id" class="category-item"
				:class="{ active: activeCategory === index }" @click="switchCategory(index)">
				{{ item.name }}
				<view v-if="activeCategory === index" class="indicator"></view>
			</view>
		</scroll-view>

		<scroll-view class="news-list" scroll-y :style="{ height: scrollHeight + 'px' }" @scrolltolower="changePage">
			<view v-for="news in newsList" :key="news.id" class="news-item" @click="navigateToDetail(news)">
				<image class="news-image"
					:src="news.cover ? news.cover :'https://img0.baidu.com/it/u=3524251599,1183611687&fm=253&fmt=auto&app=138&f=GIF?w=285&h=285'"
					mode="aspectFill" />
				<view class="news-content">
					<text class="news-title">{{ news.title }}</text>
					<text class="news-summary">{{ news.description }}</text>
					<view class="news-meta">
						<text class="meta-item">{{ initTime(news.createtime) }}</text>
						<view class="meta-item">
							<uni-icons type="hand-up" size="14" />
							<text>{{ news.likeCount }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	import {
		myMixin
	} from '@/utils/public.js'
	import mButtonVue from '@/components/public/mButton/mButton.vue'
	export default {
		mixins: [myMixin],
		components: {
			mButtonVue
		},
		data() {
			return {
				activeCategory: 0,
				searchText: '',
				scrollHeight: 0,
				categories: [],
				query: {
					category_name: null, // 分类
					page: 1,
					limit: 10,
				},
				newsList: [

				],
				isNext: false
			}
		},
		mounted() {
			this.calcScrollHeight()
			this.initClassification()
			this.getData()

		},
		watch: {
			activeCategory(newValue, oldValue) {
				// 重置页码
				this.query.page = 1
				// 解除翻页锁
				this.isNext = false

				// 更新数据
				this.query.category_name = this.categories[newValue].name
				this.getData(true)
			}
		},
		methods: {
			// 翻页
			changePage() {
				if (!this.isNext) {
					this.query.page += 1
					this.getData()
				}
			},
			// 分类数据
			async initClassification() {
				let data = await api.classification({})
				if (data.code == 200) {
					let newList = data.data.map((item, index) => {
						return {
							id: index,
							name: item
						}
					})
					console.log(newList)
					this.categories = [{
						id: -1,
						name: '全部'
					}, ...newList]
				}
			},

			async getData(lock = false) {
				let data = await api.informationData(this.query)
				if (data.code == 200) {
					if (!lock) {
						this.newsList = [...this.newsList, ...data.data.listdata]
					} else {
						this.newsList = data.data.listdata
					}
					this.isNext = data.data.listdata.length < this.query.limit ? true : false // 判断是否还能继续翻页
				}
			},
			calcScrollHeight() {
				const systemInfo = uni.getSystemInfoSync()
				this.scrollHeight = systemInfo.windowHeight - 180 // 根据实际高度调整
			},

			// 切换分类
			switchCategory(index) {
				this.activeCategory = index
				this.query.category_name = this.categories[index].name
			},
			onSearchInput(e) {
				this.searchText = e.detail.value.trim()
			},
			navigateToDetail(item) {
				let content = encodeURIComponent(item.content)
				uni.navigateTo({
					url: `/subPackages/shoppingPageList/realTimeInfoDetail/realTimeInfoDetail?content=${content}&createtime=${this.initTime(item.createtime)}`
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.news-container {
		background: #f5f5f5;
	}

	.search-bar {
		padding: 20rpx 30rpx;
		background: #fff;

		.search-box {
			display: flex;
			align-items: center;
			height: 80rpx;
			padding: 0 30rpx;
			background: #f8f8f8;
			border-radius: 40rpx;

			.search-input {
				flex: 1;
				height: 100%;
				margin-left: 20rpx;
				font-size: 28rpx;
			}

			.placeholder {
				color: #999;
			}
		}
	}

	.category-nav {
		margin-top: 10rpx;
		white-space: nowrap;
		background: #fff;
		padding: 20rpx 0;

		.category-item {
			display: inline-block;
			position: relative;
			padding: 0 40rpx;
			font-size: 30rpx;
			color: #666;
			transition: color 0.3s;

			&.active {
				color: #007AFF;
				font-weight: bold;
			}

			.indicator {
				position: absolute;
				bottom: -10rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 6rpx;
				background: #007AFF;
				border-radius: 3rpx;
			}
		}
	}

	.news-list {
		padding: 30rpx;

		.news-item {
			width: 700rpx;
			display: flex;
			margin-bottom: 30rpx;
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.news-image {
				margin: 20rpx;
				width: 250rpx;
				height: 250rpx;
				flex-shrink: 0;
			}

			.news-content {
				flex: 1;
				padding: 20rpx;
				display: flex;
				flex-direction: column;

				.news-title {
					font-size: 32rpx;
					color: #333;
					line-height: 1.4;
				}

				.news-summary {
					margin-top: 16rpx;
					font-size: 26rpx;
					color: #666;
				}

				.news-meta {
					margin-top: auto;
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #999;

					.meta-item {
						margin-right: 30rpx;
						display: flex;
						align-items: center;

						uni-icons {
							margin-right: 8rpx;
						}
					}
				}
			}
		}
	}

	// 文本溢出处理
	@mixin text-overflow($line: 1) {
		@if $line ==1 {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		@else {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: $line;
			overflow: hidden;
		}
	}
</style>