<template>
	<view class="container">
		<!-- 分类导航 -->
<!-- 		<view class="nav-bar">
			<view v-for="(item, index) in navItems" :key="index"
				:class="['nav-item', activeNav === index ? 'active' : '']" @click="switchNav(index)">
				{{item}}
			</view>
		</view> -->

		<!-- 农产品列表 -->
		<scroll-view class="list-container" scroll-y>
			<!-- 蔬菜列表 -->
			<view v-if="activeNav === 0" class="product-list">
				<view v-for="(item, index) in vegetables" :key="item.id" class="product-card veg-card">
					<image :src="item.imglogo" class="product-image" mode="aspectFill" />
					<view class="product-info">
						<view class="info-header">
							<text class="product-name">{{item.goodsname}}</text>
						</view>
						<!-- <view class="info-detail">
							<view class="detail-item">
								开始时间:
								<text>{{initDate(item.sellbegintime)}}</text>
							</view>
							<view class="detail-item">
								结束时间
								<text>{{initDate(item.sellbegintime)}}</text>
							</view>
						</view> -->
<!-- 						<view style="font-size: 28rpx;color: red;">市场价:<text
								style="text-decoration:line-through">{{item.price}}</text></view>
						<view style="font-size: 28rpx;">预卖价:{{item.presaleprice}}</view> -->
						<view class="action-bar" v-if="!formData.id" style="text-align: center;">
							<view >
								<button class="delete-btn" @click="showDeleteConfirm(item.id)">
									<uni-icons type="trash" size="18" color="#fff" />
								</button>
								删除
							</view>
							<view>
								<button class="delete-btn" @click="beListed(item)" style="background-color: #32ff13;">
									<uni-icons type="upload" size="18" color="#fff" />
								</button>
								上市
							</view>

<!-- 							<view>
								<button class="delete-btn" @click="editItem(item)" style="background-color: #55ffff;">
									<uni-icons type="compose" size="18" color="#fff" />
								</button>
								编辑
							</view> -->



						</view>

					</view>
				</view>
			</view>

			<!-- 禽畜列表 -->
			<view v-if="activeNav === 1" class="product-list">
				<view v-for="(item, index) in livestock" :key="item.id" class="product-card animal-card">
				</view>
			</view>
		</scroll-view>

		<!-- 删除确认弹窗 -->
		<uni-popup ref="deletePopup" type="dialog">
			<uni-popup-dialog mode="base" title="确认删除" content="确定要删除这个预卖菜品？" @confirm="confirmDelete"
				@cancel="cancelDelete"></uni-popup-dialog>
		</uni-popup>
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
		data() {
			return {
				activeNav: 0,
				navItems: ['预卖菜品列表'],
				deleteId: null,
				vegetables: [],
				livestock: [
					// 禽畜数据
				],
				formData: {
					page: 1,
					limit: 30
				},
			}
		},
		mixins: [myMixin],
		onLoad({
			query
		}) {
			if (query) {
				this.formData.id = query
			}
			this.getData()
		},
		methods: {
			beListed(item) {
				let jsondata = JSON.stringify(item)
				uni.navigateTo({
					url: "/subPackages/aHouseholder/beListed/beListed?pramas=" + jsondata
				})
			},
			editItem(item) {
				let jsondata = JSON.stringify(item)
				uni.navigateTo({
					url: "/subPackages/aHouseholder/modifyPreSoldDishes/modifyPreSoldDishes?pramas=" + jsondata
				})
			},
			switchNav(index) {
				this.activeNav = index
			},
			async getData() {
				let data = await api.goodslist(this.formData)
				if (data.code == 200) {
					this.vegetables = data.data.listdata
					// console.log(this.vegetables)
				}
			},
			getStatusStyle(status) {
				const styles = {
					'生长中': {
						background: '#E8F5E9',
						color: '#4CAF50'
					},
					'已采收': {
						background: '#F5F5F5',
						color: '#9E9E9E'
					}
				}
				return styles[status] || {}
			},
			showDeleteConfirm(id) {
				this.deleteId = id
				this.$refs.deletePopup.open()
			},
			confirmDelete() {
				api.delDishes({
					id: this.deleteId
				}).then((data) => {
					console.log(data)
					if (data.code == 200) {
						this.getData()
						uni.showToast({
							title: data.message,
							icon: 'success'
						})
					}
				})


				this.$refs.deletePopup.close()
			},
			cancelDelete() {
				this.deleteId = null
				this.$refs.deletePopup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #F8FAF8;
		min-height: 100vh;
	}

	.nav-bar {
		display: flex;
		padding: 20rpx 30rpx;
		background: #FFF;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

		.nav-item {
			flex: 1;
			text-align: center;
			padding: 20rpx 0;
			color: #7A9D7E;
			font-size: 30rpx;
			position: relative;

			&.active {
				color: #2D4A3A;
				font-weight: 600;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 60rpx;
					height: 4rpx;
					background: #8EB448;
				}
			}
		}
	}

	.product-list {
		padding: 20rpx;
	}

	.product-card {
		background: #FFF;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(122, 157, 126, 0.1);

		.product-image {
			width: 100%;
			height: 300rpx;
		}

		.product-info {
			padding: 24rpx;

			.info-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;

				.product-name {
					font-size: 32rpx;
					color: #2D4A3A;
					font-weight: 600;
				}

				.status-tag {
					padding: 8rpx 20rpx;
					border-radius: 40rpx;
					font-size: 24rpx;
				}
			}

			.info-detail {
				display: flex;
				gap: 30rpx;
				margin-bottom: 24rpx;

				.detail-item {
					display: flex;
					align-items: center;
					color: #7A9D7E;
					font-size: 26rpx;

					uni-icons {
						margin-right: 10rpx;
					}
				}
			}

			.action-bar {
				display: flex;
				justify-content: space-around;
				align-items: center;
				border-top: 1rpx solid #EEE;
				padding-top: 20rpx;

				.farmer {
					color: #666;
					font-size: 26rpx;
				}

				.delete-btn {
					background: #FF6B6B;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.2);
					transition: transform 0.2s;

					&:active {
						transform: scale(0.9);
					}
				}
			}
		}
	}
</style>