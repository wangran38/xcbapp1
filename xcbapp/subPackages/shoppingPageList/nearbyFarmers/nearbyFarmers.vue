<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<mButtonVue
				@btn1="startSearch"
				@btn2="stopSearch"
				:isShowbutton2="true"
				:placeholder="'搜索农户姓名或地址'"
			></mButtonVue>
			
			<view class="filter-group">
				<picker @change="categoryChange" :range="categories" range-key="label">
					<view class="filter-btn">
						<uni-icons type="tags" size="16" color="#3A7AFE" />
						<text class="btn-text">{{ categories[selectedCategoryIndex].label }}</text>
						<uni-icons type="arrowdown" size="14" color="#3A7AFE" />
					</view>
				</picker>

				<picker :range="distances" range-key="label">
					<view class="filter-btn">
						<uni-icons type="location" size="16" color="#3A7AFE" />
						<text class="btn-text">{{ distances[selectedCategoryIndex].label }}</text>
						<uni-icons type="arrowdown" size="14" color="#3A7AFE" />
					</view>
				</picker>
				
				<!-- <view class="map-btn" @click="goToRouter('/subPackages/shoppingPageList/statisticsMap/statisticsMap')">
					<uni-icons type="map" size="16" color="#fff" />
					<text>地图查看</text>
				</view> -->
			</view>
			<fegionSelectionVue />
		</view>

		<scroll-view class="list-container" scroll-y :refresher-triggered="isRefreshing">
			<view class="farmer-list">
				<view 
					v-for="(farmer, index) in farmers"
					:key="farmer.id"
					class="farmer-card"
				>
					<view class="card-header">
						<view class="header-info">
							<text class="name">{{farmer.name}}</text>
							<view class="location">
								<uni-icons type="location" size="16" color="#888" />
								{{farmer.address}}
							</view>
						</view>
					</view>

					<view class="card-body">
						<view class="info-wrapper">
							<view class="info-item">
								<text class="label">农户名称</text>
								<text class="value">{{farmer.farmersname}}</text>
							</view>
							<view class="info-item">
								<text class="label">所属地区</text>
								<text class="value">{{farmer.area_name}}</text>
							</view>
							<view class="info-item">
								<text class="label">加入时间</text>
								<text class="value">{{initDate(farmer.createtime)}}</text>
							</view>
							<view class="info-item">
								<text class="label">所售类目</text>
								<text class="value">{{farmer.category_name}}</text>
							</view>
							<view class="info-item">
								<text class="label">所售商品</text>
								<text class="value">5个</text>
							</view>
							<view class="info-item">
								<text class="label">距离</text>
								<text class="value">{{farmer.distance.toFixed(1) || '' }}km</text>
							</view>
						</view>
						
						<image
							class="farmer-logo"
							:src="farmer.logo || 'https://b0.bdstatic.com/0df6c8c7f109aa7b67e7cb15e6f8d025.jpg@h_1280'"
							mode="aspectFill"
						></image>
					</view>

					<view class="card-footer">
						<button class="detail-btn" @click="navigateToDetail(farmer)">
							<uni-icons type="paperplane" size="17" color="#3A7AFE" />
							查看详情
						</button>
					</view>
				</view>

				<view v-if="farmers.length === 0" class="empty-container">
					<uni-icons type="folder" size="80" color="#dcdcdc" />
					<text class="empty-text">暂无相关农户信息</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { api } from '@/api/index.js';
	import { myMixin } from '@/utils/public.js'
	import mButtonVue from '@/components/public/mButton/mButton.vue'
	import fegionSelectionVue from '@/components/fegionSelection/fegionSelection.vue'

	export default {
		components: {
			mButtonVue,
			fegionSelectionVue
		},
		mixins: [myMixin],
		data() {
			return {
				distances: [
					{ label: '离我最近', value: '' },
					{ label: '离我最远', value: '' },
				],
				categories: [
					{ label: '菜品最多', value: '' },
					{ label: '菜品最少', value: '' },
				],
				selectedCategoryIndex: 0,
				searchKey: '',
				isRefreshing: false,
				farmers: [],
				formdata: {
					page: 1,
					limit: 100,
					farmersname: null
				},
				isSearch: false
			}
		},
		onLoad() {
			let res = uni.getStorageSync('userlocation');
			if (res) {
				let { longitude, latitude } = JSON.parse(res)
				this.formdata.lat = latitude
				this.formdata.lng = longitude
			}
			this.getData()
		},
		methods: {
			goToRouter(url){
				uni.navigateTo({ url })
			},
			intiQuery() {
				this.formdata = {
					page: 1,
					limit: 100,
					farmersname: null
				}
			},
			startSearch(value) {
				this.formdata.farmersname = value
				this.farmers = []
				this.getData()
			},
			stopSearch() {
				this.farmers = []
				this.intiQuery()
				this.getData()
			},
			async getData() {
				let data = await api.farmersList(this.formdata)
				if (data.code == 200) {
					this.farmers = [...this.farmers, ...data.data.listdata]
				}
			},
			handleContact(farmer) {
				uni.makePhoneCall({ phoneNumber: farmer.phone })
			},
			navigateToDetail(item) {
				uni.navigateTo({
					url: `/subPackages/shoppingPageList/merchantDetails/merchantDetails?query=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 全局容器 */
	.container {
		background-color: #f7f8fa;
		min-height: 100vh;
		box-sizing: border-box;
	}

	/* 搜索栏 */
	.search-bar {
		background: #fff;
		padding: 20rpx 30rpx;
		border-radius: 0 0 20rpx 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.04);
	}

	/* 筛选组 */
	.filter-group {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		gap: 20rpx;
		position: relative;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 16rpx 24rpx;
		background: #f5f7fa;
		border-radius: 50rpx;
		font-size: 26rpx;
		color: #333;
		border: 1rpx solid #eaeef5;
		transition: all 0.2s;
		
		&:active {
			background: #eaf3ff;
			transform: scale(0.96);
		}
	}

	.btn-text {
		font-size: 26rpx;
		color: #333;
	}

	/* 地图按钮 */
	.map-btn {
		position: absolute;
		right: 0;
		display: flex;
		align-items: center;
		gap: 6rpx;
		background-color: #3A7AFE;
		padding: 14rpx 20rpx;
		color: #fff;
		border-radius: 50rpx;
		font-size: 26rpx;
		box-shadow: 0 4rpx 10rpx rgba(58,122,254,0.2);
	}

	/* 列表容器 */
	.list-container {
		margin-top: 10rpx;
		padding-bottom: 40rpx;
	}

	.farmer-list {
		padding: 20rpx 30rpx;
	}

	/* 农户卡片 */
	.farmer-card {
		background: #fff;
		border-radius: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.05);
		overflow: hidden;
		transition: all 0.2s;
		
		&:active {
			transform: scale(0.98);
		}
	}

	.card-header {
		padding: 30rpx;
		border-bottom: 1rpx solid #f2f3f5;

		.header-info {
			.name {
				font-size: 34rpx;
				font-weight: 600;
				color: #222;
				margin-bottom: 10rpx;
			}
			.location {
				font-size: 26rpx;
				color: #888;
				display: flex;
				align-items: center;
				gap: 6rpx;
			}
		}
	}

	.card-body {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		align-items: flex-start;
	}

	.info-wrapper {
		flex: 1;
	}

	.info-item {
		display: flex;
		margin-bottom: 18rpx;
		font-size: 27rpx;
		align-items: center;

		.label {
			width: 130rpx;
			color: #666;
			font-weight: 500;
		}
		.value {
			color: #333;
			flex: 1;
		}
	}

	.farmer-logo {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
		object-fit: cover;
		box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
	}

	.card-footer {
		padding: 0 30rpx 30rpx;
	}

	.detail-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 16rpx;
		background: #f5f9ff;
		color: #3A7AFE;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		
		&::after {
			border: none;
		}
	}

	/* 空状态 */
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 120rpx 0;
		color: #ccc;
	}
	.empty-text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #999;
	}
</style>