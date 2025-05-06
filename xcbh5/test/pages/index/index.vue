<template>
	<view class="container">
		<view class="locating">
			<view class="targeting" @click="toindex1"><uni-icons type="location-filled" size="25"
					color="#007aff"></uni-icons><text>{{marketName? marketName:'暂未选中市场'}}</text></view>
			<view class="current "><uni-icons class="buycar" type="scan" size="75rpx" @click="scan"></uni-icons></view>
		</view>
		<view class="search">
			<view class="sousuokuang">
				<uni-icons type="search" size="20" color="#999" class="search-icon"></uni-icons>
				<input class="uni-input" placeholder="请输入搜索条件" v-model="searchParams.title">
				<button class="searchbt" @click="reloadData">搜索</button>
			</view>

			
		</view>

		<view class="category-nav">
			<scroll-view class="nav-scroll" scroll-x scroll-with-animation>
				<view v-for="item in tabs" :id="'tab'+item.id" :key="item.id" class="nav-item"
					:class="{active: selectedCategoryId === item.id}" @click="goToshoppingPageList(item)">
					<text class="nav-text">{{ item.title }}</text>
				</view>
			</scroll-view>
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
		<floatBall />
	</view>
</template>

<script>
	import {
		api
	} from '../../api/index.js'
	import floatBall from '@/components/float-ball/float-ball.vue'

	import usePage from '@/hooks/usePage';

	export default {
		 components: { floatBall },
		data() {
			return {
				menuItems: [
				],
				tabs: [{
						id: 0,
						title: '附近农户',
						path: '/subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers'
					},
					{
						id: 1,
						title: '预卖菜品', // 扶贫预卖
						path: '/subPackages/shoppingPageList/villageZone/villageZone'
					},
					// {
					// 	id: 2,
					// 	title: '官方直营',
					// 	path: '/subPackages/shoppingPageList/official/official'
					// },
					// {
					// 	id: 3,
					// 	title: '扶贫专区',
					// 	path: '/subPackages/shoppingPageList/agriculturalAssistanceZone/agriculturalAssistanceZone'
					// },
					{
						id: 4,
						title: '种养来历',
						path: '/pages/dynamics/dynamics'
					},
					// {
					// 	id: 5,
					// 	title: '铺面出租',
					// 	path: '/subPackages/shoppingPageList/rentalStorefrontList/rentalStorefrontList'
					// },
					{
						id: 6,
						title: '资讯信息',
						path: '/subPackages/shoppingPageList/realTimeInfo/realTimeInfo'
					},
					{
						id: 7,
						title: '免费买菜',
						path: '/pages/jackpot/jackpot'
					},
					
				],
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
		onLoad() {
			// 初始化页面
			this.initPage()

		},
		async onShow() {
			let res = uni.getStorageSync('userSelection')
			console.log(this.marketName, res.marketName)
			if (this.marketName != res.marketName) {
				this.initPage()
			}
		},
		mixins: [usePage],
		methods: {
			goToshoppingPageList(item) {
				if (item.path) {
					console.log(item.path)
					uni.navigateTo({
						url: item.path
					})
				} else {
					uni.showToast({
						icon: 'error',
						title: `"${item.title}" 暂未开发`
					})
				}
			},
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
					success: async (res) => {
						let data = await api.receiving({
							out_trade_no: res.result
						})
						console.log(data)
						if (data.code == 200) {
							uni.showToast({
								icon: 'success',
								title: '核销成功'
							})
						} else {
							uni.showToast({
								icon: 'error',
								title: '核销失败'
							})
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

<style lang="scss">
	.category-nav {
		margin-top: 30rpx;

		.nav-scroll {
			white-space: nowrap;

			.nav-item {
				display: inline-block;
				padding: 20rpx 40rpx;
				margin-right: 20rpx;
				border-radius: 40rpx;
				background: #fff;
				transition: all 0.3s;

				.nav-text {
					font-size: 28rpx;
					color: #666;
				}
			}
		}
	}

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
		display: flex;
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
		width: 100%;
		/* position: relative; */
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		// border: 1px solid #FF3030;
		background-color: white;
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
		padding: 5rpx;
		color: #1296db;
		border-bottom: 5rpx solid gray;
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