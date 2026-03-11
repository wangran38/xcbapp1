<template>
	<view class="container">

		<view class="header-section">
			<view class="location-wrapper" @click="toindex1">
				<view class="loc-content">
					<uni-icons type="location-filled" size="24" color="#ff4d4f" />
					<text class="market-name">{{marketName || '正在定位菜市场...'}}</text>
					<uni-icons type="right" size="14" color="#999" />
				</view>
			</view>
			<view class="scan-entry" @click="scan">
				<view class="scan-icon-box">
					<uni-icons type="scan" size="32" color="#fff" />
				</view>
				
			</view>
		</view>

		<view class="search-container">
			
				<mButtonVue @btn1="settingValue" :placeholder="'输入摊位名称查询'"></mButtonVue>
		</view>

		<view class="main-nav">
			<view class="section-label-row">
				<text class="label-text">快捷服务</text>
			</view>
			<scroll-view class="nav-scroll-view" scroll-x>
				<view class="nav-card-list">
					<view v-for="(item, index) in tabs" :key="item.id" 
						class="nav-item-card" 
						:class="'theme-' + (index % 4)"
						@click="goToshoppingPageList(item)">
						<view class="card-inner">
							<text class="card-title">{{ item.title }}</text>
							<view class="card-circle"></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="category-section">
			<view class="section-label-row">
				<text class="label-text">产品类目</text>
			</view>
			<scroll-view class="cate-bar" scroll-x>
				<view class="cate-wrapper">
					<view v-for="item in categories" :key="item.id" 
						class="cate-pill" 
						:class="{active: item.id === selectedCategoryId}" 
						@click="filterByCategory(item.id)">
						{{ item.title }}
					</view>
				</view>
			</scroll-view>
		</view>

		<scroll-view class="data-list-area" scroll-y @scrolltolower="handleScrollToLower">
			<view class="stall-grid">
				<view v-for="item in pageData" :key="item.id" class="stall-item" @click="navigateToShopDetails(item.id)">
					<view class="image-box">
						<image class="stall-img" :src="item.logo" mode="aspectFill" />
						<view class="type-tag">{{ item.category_name || '优质' }}</view>
					</view>
					<view class="stall-content">
						<text class="stall-name">{{ item.title }}</text>
						<view class="stall-info-row">
							<uni-icons type="map" size="12" color="#bbb" />
							<text class="stall-area">{{ item.area_name }}</text>
						</view>
						<view class="entry-btn">进入店铺</view>
					</view>
				</view>
			</view>
			
			<view class="load-status">
				<view v-if="pageLoading" class="loading-ani">正在加载数据...</view>
				<view v-if="!hasMore" class="no-more-line">
					<view class="line"></view>
					<text>到底啦</text>
					<view class="line"></view>
				</view>
			</view>
		</scroll-view>

		<floatBall />
	</view>
</template>

<style lang="scss" scoped>
	$primary-color: #ff4d4f; // 更有质感的红
	$bg-color: #f8f9fb;

	.container {
		background-color: $bg-color;
		min-height: 100vh;
		padding: 0 24rpx;
	}

	/* 头部位置与扫码 */
	.header-section {
		display: flex;
		align-items: center;
		padding: 40rpx 0 20rpx;
		justify-content: space-between;
		.location-wrapper {
			background: #fff;
			height: 90rpx;
			border-radius: 45rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
			.loc-content {
				display: flex;
				align-items: center;
				width: 100%;
				.market-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin: 0 12rpx;
					flex: 1;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
		.scan-entry {
			margin-left: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.scan-icon-box {
				width: 90rpx;
				height: 90rpx;
				background: linear-gradient(135deg, #ff7875, #ff4d4f);
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 6rpx 16rpx rgba(255, 77, 79, 0.3);
			}
			text { font-size: 22rpx; color: #666; margin-top: 8rpx; font-weight: bold; }
		}
	}

	/* 搜索框 */
	.search-container {
		margin-bottom: 30rpx;
		.search-inner {
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			border: 2rpx solid #eee;
			transition: all 0.3s;
			&:active { border-color: $primary-color; }
		}
	}

	/* 标题通用样式 */
	.section-label-row {
		display: flex;
		align-items: baseline;
		padding: 20rpx 0;
		.label-text { font-size: 36rpx; font-weight: 800; color: #1a1a1a; }
		.label-sub { font-size: 24rpx; color: #999; margin-left: 15rpx; }
	}

	/* 功能卡片 */
	.nav-scroll-view {
		.nav-card-list {
			display: flex;
			padding: 10rpx 0 20rpx;
			.nav-item-card {
				flex-shrink: 0;
				width: 240rpx;
				height: 100rpx;
				border-radius: 24rpx;
				margin-right: 20rpx;
				position: relative;
				overflow: hidden;
				padding: 24rpx;
				.card-title { color: #fff; font-size: 35rpx; font-weight: bold; position: relative; z-index: 2; }
				.card-circle {
					position: absolute; right: -20rpx; bottom: -20rpx;
					width: 100rpx; height: 100rpx;
					background: rgba(255,255,255,0.2);
					border-radius: 50%;
				}
				&.theme-0 { background: linear-gradient(135deg, #ff9c6e, #ff7875); }
				&.theme-1 { background: linear-gradient(135deg, #b7eb8f, #73d13d); }
				&.theme-2 { background: linear-gradient(135deg, #91d5ff, #40a9ff); }
				&.theme-3 { background: linear-gradient(135deg, #fff566, #ffec3d); .card-title { color: #856a00; } }
			}
		}
	}

	/* 类目筛选 */
	.cate-bar {
		margin-bottom: 20rpx;
		.cate-wrapper { display: flex; align-items: center; }
		.cate-pill {
			flex-shrink: 0;
			padding: 12rpx 36rpx;
			background: #fff;
			color: #666;
			font-size: 28rpx;
			border-radius: 40rpx;
			margin-right: 16rpx;
			border: 1rpx solid #e8e8e8;
			&.active {
				background: $primary-color;
				color: #fff;
				border-color: $primary-color;
				font-weight: bold;
				box-shadow: 0 4rpx 10rpx rgba(255, 77, 79, 0.2);
			}
		}
	}

	/* 列表 */
	.data-list-area {
		height: 850rpx;
		.stall-grid {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.stall-item {
				width: 48.5%;
				background: #fff;
				border-radius: 20rpx;
				margin-bottom: 24rpx;
				box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.03);
				overflow: hidden;
				.image-box {
					position: relative;
					.stall-img { width: 100%; height: 260rpx; background: #eee; }
					.type-tag {
						position: absolute; top: 12rpx; left: 12rpx;
						background: rgba(0,0,0,0.5); color: #fff;
						padding: 4rpx 12rpx; border-radius: 8rpx; font-size: 20rpx;
					}
				}
				.stall-content {
					padding: 20rpx;
					.stall-name { font-size: 30rpx; font-weight: bold; color: #333; display: block; height: 40rpx; overflow: hidden; }
					.stall-info-row {
						display: flex; align-items: center; margin: 12rpx 0;
						.stall-area { font-size: 24rpx; color: #999; margin-left: 6rpx; }
					}
					.entry-btn {
						background: #fff1f0; color: $primary-color;
						text-align: center; padding: 10rpx 0; border-radius: 12rpx;
						font-size: 32rpx; font-weight: bold; border: 1rpx solid #ffa39e;
					}
				}
			}
		}
	}

	/* 弹窗样式优化 */
	.notice-modal {
		position: fixed; inset: 0; z-index: 10001;
		display: flex; align-items: center; justify-content: center;
		&__mask { position: absolute; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
		&__box {
			position: relative; width: 80%; background: #fff; border-radius: 32rpx; overflow: hidden;
			animation: modalShow 0.3s ease-out;
			.notice-header {
				background: linear-gradient(to bottom, #fff1f0, #fff); padding: 40rpx 0 20rpx;
				display: flex; flex-direction: column; align-items: center;
				.icon-bg { width: 100rpx; height: 100rpx; background: $primary-color; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16rpx; box-shadow: 0 8rpx 20rpx rgba(255, 77, 79, 0.2); }
				.notice-modal__title { font-size: 36rpx; font-weight: 800; color: #333; }
			}
			.notice-modal__content {
				max-height: 400rpx; padding: 0 40rpx;
				.notice-text-wrap { .notice-modal__content-text { font-size: 30rpx; color: #444; line-height: 1.8; } }
			}
			.notice-footer-action {
				padding: 40rpx;
				.no-prompt { display: flex; align-items: center; justify-content: center; margin-bottom: 24rpx; text { font-size: 26rpx; color: #999; } }
				.notice-confirm-btn { background: $primary-color; color: #fff; border-radius: 100rpx; font-weight: bold; border: none; }
			}
		}
	}

	@keyframes modalShow { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

	.load-status {
		padding: 40rpx 0;
		.no-more-line {
			display: flex; align-items: center; justify-content: center;
			.line { width: 60rpx; height: 1rpx; background: #ddd; }
			text { font-size: 24rpx; color: #ccc; margin: 0 20rpx; }
		}
	}
</style>

<script>
	// 脚本逻辑保持原有引用和方法，不做任何变动
	import { api } from '../../api/index.js'
	import floatBall from '@/components/float-ball/float-ball.vue'
	import mButtonVue from '@/components/public/mButton/mButton.vue'
	import usePage from '@/hooks/usePage';

	export default {
		components: { floatBall, mButtonVue },
		mixins: [usePage],
		data() {
			return {
				prompt: true,
				tabs: [
					{ id: 0, title: '附近农户', path: '/subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers' },
					{ id: 1, title: '预卖菜品', path: '/subPackages/shoppingPageList/villageZone/villageZone' },
					{ id: 4, title: '种养来历', path: '/pages/dynamics/dynamics' },
					{ id: 6, title: '资讯信息', path: '/subPackages/shoppingPageList/realTimeInfo/realTimeInfo' },
					{ id: 7, title: '免费买菜', path: '/pages/jackpot/jackpot' },
				],
				selectedCategoryId: 0,
				categories: [],
				marketName: '',
				searchParams: { title: '', category_id: '', market_id: '' }
			}
		},
		onLoad() {
			this.initPage();
			uni.getLocation({
				type: 'gcj02',
				success: (res) => { uni.setStorageSync('userlocation', JSON.stringify(res)); }
			})
		},
		async onShow() {
			let res = uni.getStorageSync('userSelection');
			if (this.marketName != res.marketName) { this.initPage(); }
			if (!uni.getStorageSync('prompt')) { this.showNotice = true; }
		},
		methods: {
			settingValue(value) {
				this.searchParams.title = value;
				this.reloadData();
			},
			changePrompt() { this.prompt = !this.prompt; },
			handleClose() {
				this.showNotice = false;
				uni.setStorageSync('prompt', this.prompt);
			},
			goToshoppingPageList(item) {
				if (item.path) { uni.navigateTo({ url: item.path }); }
				else { uni.showToast({ icon: 'none', title: `未开发` }); }
			},
			async fetchData(params) {
				const response = await api.marketShopList(params);
				return response.data;
			},
			initPage() {
				this.selectedCategoryId = 0;
				this.fetchMarketName();
				this.fetchCategories();
				this.setDefaultMarketId();
				this.reloadData();
				
				let res = uni.getStorageSync('userSelection');
				this.marketName = res.marketName;
			},
			setDefaultMarketId() {
				const { market_id } = uni.getStorageSync('userSelection');
				this.searchParams.market_id = market_id;
			},
			async fetchCategories() {
				const response = await api.cglist();
				this.categories = [{ id: 0, title: '全选' }, ...response.data.listdata || []];
			},
			async filterByCategory(id) {
				this.searchParams.category_id = id === 0 ? '' : id;
				this.selectedCategoryId = id;
				this.reloadData();
			},
			async fetchMarketName() {
				const userSelection = uni.getStorageSync('userSelection');
				if (!userSelection) return;
				const { market_id, area_id } = userSelection;
				try {
					const response = await api.marketlist(parseInt(area_id));
					const marketData = response.data.listdata.find(item => item.id === parseInt(market_id));
					if (marketData) this.marketName = marketData.marketname;
				} catch (error) { console.error(error); }
			},
			navigateToShopDetails(id) {
				uni.navigateTo({ url: `/pages/ShopDetails/ShopDetails?id=${id}` });
			},
			toindex1() { uni.switchTab({ url: '/pages/index1/index1' }); },
			scan() {
				uni.scanCode({
					success: async (res) => {
						if (res.result) {
							let data = await api.receiving({ out_trade_no: res.result });
							uni.showToast({ icon: data.code == 200 ? 'success' : 'error', title: data.code == 200 ? '核销成功' : '核销失败' });
						}
					}
				});
			}
		}
	}
</script>