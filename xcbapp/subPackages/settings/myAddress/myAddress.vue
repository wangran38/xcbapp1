<template>
	<view class="address-page">
		<view class="app-bar">
			<text class="title">我的地址</text>
		</view>

		<!-- 地址列表 -->
		<scroll-view scroll-y class="address-list">
			<!-- 地址卡片 -->
			<view v-for="item in addressData" :key="item.Id" class="address-card"
				:class="{ 'default-card': item.isshow==2 }">
				<view class="card-content">
					<!-- 地址头 -->
					<view class="card-header">
						<text class="contact">{{ item.phonename }}</text>
						<view class="header-right">
							<text v-if="item.isshow == 2" class="default-badge">默认</text>
							<text class="phone">{{ item.phone }}</text>
						</view>
					</view>

					<!-- 地址详情 -->
					<view class="address-detail">
						<text class="region">{{ item.area_id}}</text>
						<text class="detail">{{ item.address }}</text>
					</view>

					<!-- 操作按钮 -->
					<view class="action-bar">
						<!-- <view class="action-btn" @click="toggleDefault(index)">
							<uni-icons :type="item.isDefault ? 'star-filled' : 'star'" size="18" />
							<text>{{ item.isDefault ? '默认地址' : '设为默认' }}</text>
						</view> -->
						<view class="divider"></view>
						<view class="action-btn" @click="editAddress(item)">
							<uni-icons type="compose" size="18" />
							<text>编辑</text>
						</view>
						<view class="divider"></view>
						<view class="action-btn delete" @click="deleteAddress(item)">
							<uni-icons type="trash" size="18" />
							<text>删除</text>
						</view>
						<!-- <view class="divider"></view> -->
						<!-- <view class="action-btn">
							<uni-icons type="link" size="18" />
							<text>复制</text>
						</view> -->
					</view>
				</view>
			</view>
			<!-- 空状态 -->
			<view v-if="addressData.length === 0" class="empty-state">
				<text class="empty-text">还没有收货地址哦</text>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<button class="add-btn" @click="addNewAddress">
				<uni-icons type="plus" size="20" color="#fff" />
				<text>新增地址</text>
			</button>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	export default {
		data() {
			return {
				addressData: [
				],
				formData:{
					page:1,
					limit:10
				}
			};
		},
		onShow() {
			this.getAddressData()
		},
		
		methods: {
			async getAddressData(){
				let res = await api.myaddressData(this.formData)
				if (res.code  == 200){
					this.addressData = res.data.listdata
				}
			},
			addNewAddress() {
				uni.navigateTo({
					url: '/subPackages/settings/addAddress/addAddress?isEdit=false'
				});
			},
			editAddress(item) {
				console.log(item)
				let jsonData = JSON.stringify(item)
				
				uni.navigateTo({
					url: `/subPackages/settings/addAddress/addAddress?isEdit=true&jsonData=${jsonData}`
				});
			},
			deleteAddress(item) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个地址吗？',
					success: async (res) => {
						console.log(res)
						if (res.confirm){
							let data = await api.delMyAddress({id:item.Id})
							console.log(data)
							if (data.code == 200){
								uni.showToast({
									icon:'success',
									title:data.message || data.msg
								})
								this.getAddressData()
							}else{
								uni.showToast({
									icon:'error',
									title:data.message || data.msg
								})
							}
						}
					}
				});
			},
			toggleDefault(index) {
				this.addressData.forEach(item => item.isDefault = false);
				this.addressData[index].isDefault = true;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.address-page {
		background: #f8f9fb;
		min-height: 100vh;

		.app-bar {
			padding: 48rpx 32rpx 24rpx;
			background: #fff;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

			.title {
				font-size: 38rpx;
				font-weight: 600;
				color: #2d3742;
			}
		}

		.address-list {
			padding: 32rpx;
			padding-bottom: 120rpx;
		}

		.address-card {
			width: 700rpx;
			background: #fff;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			transition: all 0.2s ease;

			&.default-card {
				border: 1px solid #e1f0ff;
				background: #fbfff3;
			}

			.card-content {
				padding: 32rpx;
			}

			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24rpx;

				.contact {
					font-size: 32rpx;
					font-weight: 500;
					color: #2d3742;
				}

				.header-right {
					display: flex;
					align-items: center;

					.default-badge {
						background: #e1f0ff;
						color: #1a73e8;
						font-size: 24rpx;
						padding: 4rpx 12rpx;
						border-radius: 6rpx;
						margin-right: 16rpx;
					}

					.phone {
						color: #666;
						font-size: 28rpx;
					}
				}
			}

			.address-detail {
				color: #4a5568;
				font-size: 28rpx;
				line-height: 1.6;

				.region {
					margin-right: 16rpx;
				}
			}

			.action-bar {
				display: flex;
				align-items: center;
				margin-top: 32rpx;
				padding-top: 24rpx;
				border-top: 1px solid #eee;

				.action-btn {
					display: flex;
					align-items: center;
					color: #666;
					font-size: 26rpx;
					padding: 0 24rpx;

					&.delete {
						color: #ef4444;
					}

					uni-icons {
						margin-right: 8rpx;
					}
				}

				.divider {
					width: 1px;
					height: 28rpx;
					background: #ddd;
				}
			}
		}

		.empty-state {
			text-align: center;
			padding: 20vh 0;

			.empty-image {
				width: 300rpx;
				height: 300rpx;
				opacity: 0.9;
			}

			.empty-text {
				display: block;
				color: #a0aec0;
				font-size: 28rpx;
				margin-top: 24rpx;
			}
		}

		.bottom-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background: #fff;
			padding: 24rpx 32rpx;
			box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.04);

			.add-btn {
				background: #1a73e8;
				color: #fff;
				height: 96rpx;
				border-radius: 48rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				uni-icons {
					margin-right: 12rpx;
				}
			}
		}
	}

	@media (min-width: 768px) {
		.address-page {
			.address-list {
				max-width: 1200px;
				margin: 0 auto;
			}

			.address-card {
				margin-bottom: 32rpx;
			}
		}
	}
</style>