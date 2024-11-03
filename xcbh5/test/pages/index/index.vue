<template>
	<view class="container">
		<view class="locating">
			<view class="targeting" @click="toindex1"><uni-icons type="location-filled" size="25"
					color="#007aff"></uni-icons></view>
			<view class="current ">{{marketName? marketName:'暂未选中市场'}}</view>
		</view>
		<view class="search">
			<view class="sousuokuang">
				<uni-icons type="search" size="20" color="#999" class="search-icon"></uni-icons>
				<input class="uni-input" placeholder="请输入搜索条件" v-model="searchParams.title">
				<button class="searchbt" @click="reloadData">搜索</button>
			</view>

			<uni-icons class="buycar" type="scan" size="75rpx" @click="scan"></uni-icons>
		</view>

		<view class="uni-margin-wrap">
			<scroll-view class="swiper" scroll-x="true" scroll-y="false" show-scrollbar="false">
				<view v-for="item in categories" :key="item.id" class="swiper-item" @click="filterByCategory(item.id)">
					<view class="item-title">
						<text
							:class="['classify', { 'selected': item.id === selectedCategoryId }]">{{ item.title }}</text>
					</view>
				</view>
			</scroll-view>
		</view>




		<scroll-view class="Stallholder" scroll-y="true" scroll-x="false" @scrolltolower="handleScrollToLower">
			<view class="Stallholder-content">
				<view v-for="item in pageData" :key="item.id" class="Stallholder-item"
					@click="navigateToShopDetails(item.id)">
					<image class="standimg" v-if="isloaded" lazy-load
						:src="item.logo?item.logo:'../../static/defaultLogo.png'" mode="aspectFill"></image>
					<view class="standtitle">地区名称：{{ item.area_name }}</view>
					<view class="standtitle">摊位名称：{{ item.title }}</view>
					<view class="standtitle">所售类目：{{ item.category_name || '未知类目' }}</view>
				</view>
			</view>
			<view v-if="pageLoading" class="loading">加载中...</view>
			<view v-if="!hasMore" class="loading">没有更多了</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		api
	} from '../../api/index.js'

	import usePage from '@/hooks/usePage';
	import {
		mapMutations,
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				selectedCategoryId: '',
				categories: [],
				pageData: [], // 
				currentMarketName: '', // 当前菜市场名称
				searchParams: {
					title: '',
					category_id: '',
					market_id: ''
				},
				isloaded: false,
				marketName: '', // 市场名
				initReques: false
			}
		},
		computed: {
			...mapState('location', ['selectStatus']),
		},
		onLoad() {
			// 初始化页面
			this.initPage()
		},
		async onShow() {
			if (this.selectStatus) {
				this.initPage()
				this.setStatus()
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		mixins: [usePage],
		methods: {
			...mapMutations('location', ['setStatus']),
			async fetchData(params) {
				const response = await api.marketShopList(params)
				return response.data

			},
			initPage() {
				this.isloaded = true;
				// 默认是全选
				this.selectedCategoryId = 0;
				this.fetchMarketName();
				this.fetchCategories()
				// 先设置 marketId
				this.setDefaultMarketId();
				this.reloadData()

				// 选中市场
				let res = uni.getStorageSync('userSelection')
				this.marketName = res.marketName
			},
			setDefaultMarketId() {
				const {
					market_id
				} = uni.getStorageSync('userSelection');
				this.searchParams.market_id = market_id
			},
			async fetchCategories() {
				const response = await api.cglist()
				// this.categories = response.data.listdata || []
				this.categories = [{
					id: 0, // 特殊值表示全选
					title: '全选'
				}, ...response.data.listdata || []]
				// console.log(this.categories)
			},
			async filterByCategory(categoryId) {
				this.searchParams.category_id = categoryId;
				this.selectedCategoryId = categoryId;
				this.reloadData()
			},
			async fetchMarketName() {
				try {
					// 从 storage 中获取 userSelection
					const userSelection = uni.getStorageSync('userSelection');

					if (!userSelection) {
						console.warn('未找到 userSelection');
						return;
					}

					// 解析 userSelection 中的 market_id 和 area_id
					const {
						market_id,
						area_id
					} = userSelection;

					if (!market_id || !area_id) {
						console.warn('未找到市场 ID 或区域 ID');
						return;
					}

					// 调用 marketlist 接口
					const response = await api.marketlist(parseInt(area_id));
					const marketData = response.data.listdata.find(item => item.id === parseInt(market_id));

					if (marketData) {
						this.currentMarketName = marketData.marketname || '未知市场';
					} else {
						console.warn('未找到对应的市场');
						this.currentMarketName = '未知市场';
					}
				} catch (error) {
					console.error('获取市场名称失败:', error);
				}
			},
			navigateToShopDetails(id) {
				uni.navigateTo({
					url: `/pages/ShopDetails/ShopDetails?id=${id}`
				})
			},
			toindex1() {
				uni.switchTab({
					url: '/pages/index1/index1'
				});
			},
			scan() {
				// 只允许通过相机扫码
				uni.scanCode({
					onlyFromCamera: false,
					success: function(res) {

						// 检查是否是 URL，如果是 URL，则跳转
						const scannedUrl = res.result;
						if (scannedUrl.startsWith('http')) {
							console.log('这是一个有效的 URL');
							// 解码 URL
							const decodedUrl = decodeURIComponent(scannedUrl);
							console.log('解码后的 URL:', decodedUrl);
							// 提取 hash 部分（即 # 后面的部分）
							const hashIndex = decodedUrl.indexOf('#');
							if (hashIndex !== -1) {
								const pagesPath = decodedUrl.substring(hashIndex +
								1); // 例如 "/pages/Clock/Clock?time=1725806224"
								console.log('提取到的页面路径:', pagesPath);
								// 执行页面跳转
								uni.navigateTo({
									url: '/'+pagesPath // 跳转到指定页面并带上参数
								});
							} else {
								console.warn('未能解析到有效的页面路径');
							}
						} else {
							// 处理非 URL 的结果
							console.warn('扫码结果不是有效的链接:', scannedUrl);
						}
					},
					fail: function(error) {
						console.error('扫码失败:', error);
					}
				});
			}

		}
	}
</script>

<style>
	.container {
		overflow: hidden;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
		margin: 2rpx 10rpx;
	}

	.locating {
		height: 70rpx;
		margin: 10rpx 0;
		display: flex;
		flex-direction: row;
		font-size: 28rpx;
		font-weight: 600;
		line-height: 70rpx;
	}

	.targeting {
		margin-left: 30rpx;
		color: #1296db;
	}

	.current {
		margin-left: auto;
		color: black;
		margin-right: 30rpx;
	}

	.search {
		width: 100%;
		/* position: relative; */
		display: flex;
		align-items: center;
	}

	.sousuokuang {
		width: 86%;
		/* position: relative; */
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border: 1px solid #FF3030;
		border-radius: 20rpx;
		padding: 10rpx 10rpx;
	}

	.search-icon {
		height: 60rpx;
		width: 10%;
		line-height: 60rpx;
		/* position: absolute; */
		left: 10rpx;
		/* background-color: #1296db; */
	}

	.uni-input {
		width: 70%;
		height: 60rpx;
		line-height: 60rpx;
		/* height: 80rpx; */
		/* padding-left: 60rpx; */
		padding-right: 100rpx;
		/* box-sizing: border-box; */
		/* background-color: #FF3030; */
	}

	.searchbt {

		height: 60rpx;
		/* line-height: 60rpx; */
		text-align: center;
		width: 150rpx;
		border: none;
		background-color: #FF3030;
		color: white;
		border-radius: 25rpx;
		font-size: 24rpx;
	}

	.buycar {
		flex: 1;
		/* width: 100rpx; */
		/* margin: 0 10rpx; */
		margin-left: auto;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.uni-margin-wrap {
		/* height: 110rpx; */
	}

	.swiper {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100%;
		white-space: nowrap;
	}

	.swiper-item {
		display: inline-block;
		height: 100%;
		width: 120rpx;
		margin: 0 20rpx;
		text-align: center;
		vertical-align: middle;
	}

	.item-title {
		display: inline-block;
		box-sizing: border-box;
		vertical-align: middle;
		line-height: 120rpx;
	}

	.classify {
		margin-top: 10%;
		font-size: 35rpx;
		font-weight: 600;
	}

	.classify.selected {
		color: #1296db;
	}

	.Stallholder {
		/* background-color: red; */
		display: flex;
		flex-direction: column;
		height: 75vh;
		/* overflow-y: auto; */
	}

	.Stallholder-content {
		padding: 10rpx;
		box-sizing: border-box;
		column-count: 2;
		column-gap: 20rpx;
	}

	.Stallholder-item {
		width: 100%;
		height: 480rpx;
		break-inside: avoid;
		margin-bottom: 20rpx;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.Stallholder-content .Stallholder-item:nth-child(2n+1) {
		height: 510rpx;
	}

	.Stallholder-content .Stallholder-item:nth-child(3n+1) {
		height: 540rpx;
	}

	.standimg {
		/* height: 300rpx; */
		width: 100%;
		border-radius: 20rpx;
		/* background-color: #1296db; */
	}

	.standtitle {
		width: 90%;
		height: 100rpx;
		line-height: 70rpx;
		/* background-color: white; */
		/* background-color: antiquewhite; */
		overflow: hidden;
		/* 隐藏超出的内容 */
		white-space: nowrap;
		/* 强制不换行 */
		text-overflow: ellipsis;
		/* 显示省略号 */
		font-size: 30rpx;
		/* background-color: aqua; */

	}

	.loading {
		text-align: center;
		padding: 20rpx;
		color: #999;
	}
</style>