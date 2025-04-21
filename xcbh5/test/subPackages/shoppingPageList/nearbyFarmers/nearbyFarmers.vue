<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<uni-search-bar placeholder="搜索农户姓名或地址" v-model="searchKey" @confirm="handleSearch" @clear="clearSearch"
				bgColor="#f5f5f5" radius="40" />
		</view>

		<!-- 农户列表 -->
		<scroll-view class="list-container" scroll-y :refresher-enabled="true" @refresherrefresh="onRefresh"
			:refresher-triggered="isRefreshing">
			<view class="farmer-list">
				<view v-for="(farmer, index) in farmers" :key="farmer.id" class="farmer-card">
					<view class="card-header">

						<view class="header-info">
							<text class="name">{{farmer.name}}</text>
							<text class="location">
								<uni-icons type="location" size="16" color="#666" />
								{{farmer.address}}
							</text>
						</view>
					</view>

					<view class="card-body">
						<view class="info-item">
							<text class="label">农户名称:</text>
							<text class="value">{{farmer.farmersname}}</text>
						</view>
						<view class="info-item">
							<text class="label">加入时间：</text>
							<text class="value">{{initDate(farmer.Created)}}</text>
						</view>
						<view class="info-item">
							<text class="label">所售类目：</text>
							<text class="value">{{farmer.type}}</text>
						</view>
<!-- 						<view class="info-item">
							<text class="label">认证状态：</text>
							<uni-tag :text="farmer.certified ? '已认证' : '未认证'"
								:type="farmer.certified ? 'success' : 'default'" size="small" />
						</view> -->
					</view>

					<view class="card-footer">
						<button class="contact-btn" @click="handleContact(farmer)" style="background-color: #007aff;">
							<uni-icons type="phone" size="18" color="#fff" />
							联系农户
						</button>
						<button class="detail-btn" @click="navigateToDetail(farmer)" style="border-color: #007aff; color: #007aff;">
							查看详情
						</button>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-if="farmers.length === 0" class="empty-container">
					<image src="/static/empty-farmer.png" class="empty-image" />
					<text class="empty-text">暂无相关农户信息</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js';
	import {
		myMixin
	} from '@/utils/public.js'
	
	export default {
		mixins:[myMixin],
		data() {
			return {
				searchKey: '',
				isRefreshing: false,
				farmers: [
				],
				formdata:{
					page:1,
					limit:100
				}
			}
		},
		async onLoad() {
			let data = await api.farmersList(this.formdata)
			
			if (data.code = 200){
				this.farmers = data.data.listdata
				console.log(this.farmers)
			}
		},
		computed: {
		},
		methods: {
			formatDate(date) {
				// return this.$dayjs(date).format('YYYY-MM-DD')
			},
			handleSearch() {
				uni.pageScrollTo({
					scrollTop: 0
				})
			},
			clearSearch() {
				this.searchKey = ''
			},
			onRefresh() {
				this.isRefreshing = true
				setTimeout(() => {
					this.isRefreshing = false
					uni.showToast({
						title: '刷新成功'
					})
				}, 1000)
			},
			handleContact(farmer) {
				uni.makePhoneCall({
					phoneNumber: farmer.phone
				})
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
	.container {
		background: #f8f8f8;
		min-height: 100vh;
	}

	.search-bar {
		padding: 20rpx 30rpx;
		background: #fff;
	}

	.farmer-list {
		padding: 20rpx 30rpx;
	}

	.farmer-card {
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

		.card-header {
			display: flex;
			align-items: center;
			padding: 24rpx;
			border-bottom: 1rpx solid #eee;

			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 24rpx;
			}

			.header-info {
				display: flex;
				flex-direction: column;

				.name {
					font-size: 32rpx;
					color: #333;
					font-weight: 500;
					margin-bottom: 8rpx;
				}

				.location {
					font-size: 26rpx;
					color: #666;
					display: flex;
					align-items: center;
				}
			}
		}

		.card-body {
			padding: 24rpx;

			.info-item {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;
				font-size: 28rpx;

				.label {
					color: #666;
					min-width: 140rpx;
				}

				.value {
					color: #333;
					flex: 1;
				}
			}
		}

		.card-footer {
			display: flex;
			padding: 24rpx;
			border-top: 1rpx solid #eee;

			button {
				flex: 1;
				margin: 0 12rpx;
				height: 72rpx;
				line-height: 72rpx;
				font-size: 28rpx;
				border-radius: 40rpx;

				&::after {
					border: none;
				}

				&.contact-btn {
					background: #7A9D7E;
					color: #fff;
				}

				&.detail-btn {
					background: #fff;
					color: #7A9D7E;
					border: 1rpx solid #7A9D7E;
				}
			}
		}
	}

	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 0;

		.empty-image {
			width: 300rpx;
			height: 300rpx;
			margin-bottom: 40rpx;
		}

		.empty-text {
			color: #999;
			font-size: 28rpx;
		}
	}
</style>