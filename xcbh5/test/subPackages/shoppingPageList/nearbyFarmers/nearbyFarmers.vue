<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view
				style="display: flex;  background-color: rgb(245, 245, 245); align-items: center; border-radius: 20rpx;">
				<view style="padding: 20rpx;"><uni-icons color="#999999" size="20" type="search" /></view>
				<input type="text" placeholder="搜索农户姓名或地址" v-model="formdata.farmersname" />
			</view>
			<view
				style="background-color: #007aff; color: white; width: 120rpx; height: 80rpx; line-height: 80rpx; text-align: center; border-radius: 10rpx; margin: 10rpx;" @click="startSearch">
				搜索</view>
			<view
				style="background-color: red; color: white;width: 120rpx; height: 80rpx; line-height: 80rpx; text-align: center; border-radius: 10rpx; margin: 10rpx;" @click="stopSearch">
				清空</view>

		</view>

		<!-- 农户列表 -->
		<scroll-view class="list-container" scroll-y :refresher-triggered="isRefreshing">
			<view class="farmer-list">
				<view v-for="(farmer, index) in farmers" :key="farmer.id" class="farmer-card">
					<view class="card-header">

						<view class="header-info">
							<text class="name">{{farmer.name}}</text>
							<view class="location">
								<uni-icons type="location" size="16" color="#666" />
								{{farmer.address}}
							</view>
						</view>
					</view>

					<view class="card-body">
						<view class="info-item">
							<text class="label">农户名称:</text>
							<text class="value">{{farmer.farmersname}}</text>
						</view>
						<view class="info-item">
							<text class="label">所属地区：</text>
							<text class="value">{{farmer.area_name}}</text>
						</view>
						<view class="info-item">
							<text class="label">加入时间：</text>
							<text class="value">{{initDate(farmer.createtime)}}</text>
						</view>
						<view class="info-item">
							<text class="label">所售类目：</text>
							<text class="value">{{farmer.category_name}}</text>
						</view>
					</view>

					<view class="card-footer">
						<button class="contact-btn" @click="handleContact(farmer)" style="background-color: #007aff;">
							<uni-icons type="phone" size="18" color="#fff" />
							联系农户
						</button>
						<button class="detail-btn" @click="navigateToDetail(farmer)"
							style="border-color: #007aff; color: #007aff;">
							查看详情
						</button>
					</view>
				</view>

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
		mixins: [myMixin],
		data() {
			return {
				searchKey: '',
				isRefreshing: false,
				farmers: [],
				formdata: {
					page: 1,
					limit: 100,
					farmersname: null // 农户名称模糊查询
				},
				isSearch: false // 是否在搜索状态
			}
		},
		async onLoad() {
			this.getData()
		},
		computed: {},
		methods: {
			intiQuery(){
				this.formdata =  {
					page: 1,
					limit: 100,
					farmersname: null // 农户名称模糊查询
				}
			},
			// 开始搜索
			startSearch(){
				this.farmers = [] // 清空原来的数据
				this.getData()
			},
			// 结束搜索
			stopSearch(){
				this.farmers = [] // 清空原来的数据
				this.intiQuery()
				this.getData()
			},
			
			
			
			async getData() {
				let data = await api.farmersList(this.formdata)
				if (data.code = 200) {
					this.farmers = [...this.farmers,...data.data.listdata]
				}
				console.log(this.farmers)
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
		display: flex;
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