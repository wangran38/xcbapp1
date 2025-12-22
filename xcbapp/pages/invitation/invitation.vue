<template>
	<view class="invite-page">
		<!-- 1. 顶部标题区 -->
		<view class="invite-header">
			<text class="header-title">邀请好友，共赢福利</text>
			<text class="header-desc">每成功邀请1位好友，双方都能获得奖励</text>
		</view>



		<!-- <posterVue></posterVue> -->
		<!-- 3. 核心邀请区（邀请码+分享按钮） -->
		<view class="invite-core card">
			<view class="core-title">分享你的专属邀请码</view>

			<!-- 邀请码展示 -->
			<!-- 			<view class="invite-code">
				<text class="code-text">{{ inviteCode }}</text>
				<button class="copy-btn" @click="copyCode">
					<text>复制</text>
				</button>
			</view> -->

			<!-- <view class="share-title">或通过以下方式分享</view> -->
			<view class="share-buttons">
				<button class="share-btn" open-type="share" data-share-type="wechat">
					<text>微信好友</text>
				</button>
				<!-- 				<button class="share-btn" open-type="share" data-share-type="moments">
					<text>朋友圈</text>
				</button> -->
				<button class="share-btn" @click="showInvitePoster">
					<text>生成海报</text>
				</button>
			</view>
		</view>

		<!-- 4. 邀请记录区（展示进度，提升积极性） -->
		<view class="invite-record card">
			<view class="record-title">
				<text>邀请记录</text>
				<!-- <text class="record-count">已邀请 {{ inviteRecords.length }} 位好友</text> -->
			</view>

			<!-- 记录列表（无数据时显示空状态） -->
			<scroll-view :scroll-y="true" class="record-list" v-if="inviteRecords.length > 0" @scrolltolower="changePage">
				<view class="record-item" v-for="(item, index) in inviteRecords" :key="index">
					<view class="record-info">
						<text class="friend-name">{{ hidePhone(item.phone) }}</text>
						<text class="invite-time">{{ initTime(item.Created) }}</text>
					</view>
					<text class="record-status" :class="'status-pending'">
						已入驻
					</text>
				</view>
			</scroll-view>
			<view class="empty-record" v-else>
				<uni-icons type="empty" size="48" color="#ccc"></uni-icons>
				<text>还没有邀请记录，快去邀请好友吧～</text>
			</view>
		</view>


		<!-- <view class="invite-record card" style="display: flex; justify-content: space-between;"
			@click="routePush('/pages/earningsRecord/earningsRecord')">

			<view>查看收益</view>
			<uni-icons type="right" size="18" color="#999" />
		</view> -->

		<view class="invite-rules card">
			<uni-collapse>
				<uni-collapse-item title="邀请规则说明" :title-style="{ fontSize: '24rpx', color: '#666' }">
					<view class="rules-content">
						<view class="rule-item">通过自己二维码发展的农户商户获得收益：10%</view>
						<view class="rule-item">通过扫自己二维码发展的消费者会员获得：10%</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>


		<uni-popup ref="posterPopup">

			<view>
				<posterVue @initLoad="loadInviteCode"></posterVue>
			</view>
		</uni-popup>


		<!-- <image :src="tempPath"></image> -->
	</view>
</template>

<script>
	import posterVue from '@/components/poster.vue'
	import {
		api
	} from '@/api/index.js'
	import {myMixin} from '@/utils/public.js'

	export default {
		components: {
			posterVue
		},
		mixins:[myMixin],
		data() {
			return {
				// 邀请码（实际项目中从接口获取当前用户的专属邀请码）
				inviteCode: 'INV8866',
				// 邀请记录（模拟数据，实际替换为接口数据）
				inviteRecords: [
				],
				query: {
					page: 1,
					limit: 10
				},
				turnThePage:true,
			};
		},
		onLoad() {
			this.getFromuserlist()
		},
		methods: {
			// 获取用户id
			loadInviteCode(uid){
				this.inviteCode = uid
				// console.log(uid,"主组件")
			},
			changePage(){
				if (!this.turnThePage) return;
				this.query.page++
				this.getFromuserlist()
			},
			async getFromuserlist() {
				let data = await api.fromuserlist(this.query)
				if (data.code == 200) {
					
					this.inviteRecords = [...this.inviteRecords, ...data.data.data]
					this.turnThePage = data.data.data.length < this.query.limit ? false:true
				}
			},
			routePush(path) {
				uni.navigateTo({
					url: path
				})
			},
			// copyCode() {
			// 	uni.setClipboardData({
			// 		data: this.inviteCode,
			// 		success: () => {
			// 			uni.showToast({
			// 				title: '邀请码复制成功',
			// 				icon: 'success',
			// 				duration: 1500
			// 			});
			// 		},
			// 		fail: () => {
			// 			uni.showToast({
			// 				title: '复制失败，请重试',
			// 				icon: 'none',
			// 				duration: 1500
			// 			});
			// 		}
			// 	});
			// },

			// 显示邀请海报弹窗
			async showInvitePoster() {
				this.$refs.posterPopup.open();
			},



			// 朋友圈分享
			onShareTimeline(options) {
				return {
					title: '好友邀请你加入平台，注册即得20元券，我还能得现金奖励',
					query: `/pages/register/register?scene=${this.inviteCode}`, // 好友注册页，携带邀请码
					success: () => {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						});
					},
				}
			},

			// 微信好友（对接小程序分享API）
			onShareAppMessage(options) {
				const title = '我在这个平台发现了好东西，邀请你一起加入～'
				return {
					title: title,
					path: `/pages/register/register?scene=${this.inviteCode}`, // 好友注册页，携带邀请码
					imageUrl: '/static/favicon.ico', // 分享图标
					success: () => {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						});
					}
				};
			}
		}
	};
</script>

<style scoped lang="scss">
	/* 全局样式：统一卡片、间距、配色 */
	$primary-color: #FF7A45; // 主色（橙色，突出福利感）
	$secondary-color: #007aff; // 辅助色（青色，用于按钮/图标）
	$text-primary: #333; // 主文本色
	$text-secondary: #666; // 次文本色
	$text-tertiary: #999; // 辅助文本色
	$bg-card: #fff; // 卡片背景色
	$bg-page: #F5F7FA; // 页面背景色
	$border-radius: 20rpx; // 统一圆角
	$spacing: 20rpx; // 统一间距

	.invite-page {
		background-color: $bg-page;
		min-height: 100vh;
		padding: $spacing;
		box-sizing: border-box;
	}

	/* 卡片通用样式 */
	.card {
		background-color: $bg-card;
		border-radius: $border-radius;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		padding: $spacing;
		margin-bottom: $spacing;
	}

	/* 1. 顶部标题区 */
	.invite-header {
		text-align: center;
		margin-bottom: $spacing;
		padding-top: 10rpx;

		.header-title {
			font-size: 36rpx;
			font-weight: 600;
			color: $text-primary;
			display: block;
			margin-bottom: 10rpx;
		}

		.header-desc {
			font-size: 24rpx;
			color: $text-secondary;
		}
	}

	/* 2. 邀请福利区 */
	.invite-reward {
		.reward-title {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			font-weight: 500;
			color: $text-primary;
			margin-bottom: $spacing;

			text {
				margin-left: 10rpx;
			}
		}

		.reward-list {
			.reward-item {
				display: flex;
				margin-bottom: 15rpx;
				font-size: 24rpx;

				.reward-tag {
					width: 160rpx;
					color: $primary-color;
					font-weight: 500;
				}

				.reward-content {
					color: $text-secondary;
					flex: 1;
				}
			}

			.reward-item:last-child {
				margin-bottom: 0;
			}
		}
	}

	/* 3. 核心邀请区 */
	.invite-core {
		.core-title {
			font-size: 28rpx;
			font-weight: 500;
			color: $text-primary;
			text-align: center;
			margin-bottom: $spacing;
		}

		// 邀请码样式
		.invite-code {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: $spacing;

			.code-text {
				font-size: 36rpx;
				font-weight: 700;
				color: $primary-color;
				letter-spacing: 10rpx;
				padding: 15rpx 30rpx;
				background-color: rgba(255, 122, 69, 0.1);
				border-radius: 10rpx;
			}

			.copy-btn {
				margin-left: 20rpx;
				background-color: $primary-color;
				color: #fff;
				font-size: 24rpx;
				// padding: 10rpx 25rpx;
				border-radius: 10rpx;
			}
		}

		// 分享方式
		.share-title {
			font-size: 24rpx;
			color: $text-secondary;
			text-align: center;
			margin-bottom: 15rpx;
		}

		.share-buttons {
			display: flex;
			justify-content: space-between;

			.share-btn {
				flex: 1;
				margin: 0 10rpx;
				background-color: $secondary-color;
				color: #fff;
				font-size: 22rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 15rpx 0;
				border-radius: 10rpx;

				uni-icons {
					margin-bottom: 10rpx;
				}
			}
		}
	}

	/* 4. 邀请记录区 */
	.invite-record {
		.record-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: $spacing;

			text {
				font-size: 28rpx;
				font-weight: 500;
				color: $text-primary;
			}

			.record-count {
				font-size: 24rpx;
				color: $primary-color;
			}
		}

		// 记录列表
		.record-list {
			height: 500rpx;

			.record-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 15rpx 0;
				border-bottom: 1rpx solid #eee;

				&:last-child {
					border-bottom: none;
				}

				.record-info {
					.friend-name {
						font-size: 24rpx;
						color: $text-primary;
						margin-bottom: 5rpx;
						display: block;
					}

					.invite-time {
						font-size: 20rpx;
						color: $text-tertiary;
					}
				}

				.record-status {
					font-size: 22rpx;
					padding: 5rpx 15rpx;
					border-radius: 8rpx;
				}

				.status-success {
					color: #52C41A;
					background-color: rgba(82, 196, 26, 0.1);
				}

				.status-pending {
					color: #FAAD14;
					background-color: rgba(250, 173, 20, 0.1);
				}
			}
		}

		// 空状态
		.empty-record {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 60rpx 0;
			color: $text-tertiary;
			font-size: 24rpx;

			uni-icons {
				margin-bottom: 20rpx;
			}
		}
	}

	/* 5. 邀请规则区 */
	.invite-rules {
		.rules-content {
			padding: 10rpx 0;
			font-size: 22rpx;
			color: $text-secondary;

			.rule-item {
				margin-bottom: 15rpx;
				line-height: 36rpx;
			}

			.rule-item:last-child {
				margin-bottom: 0;
			}
		}
	}

	/* 邀请海报弹窗 */
	.poster-popup {
		width: 600rpx;
		background-color: #fff;
		border-radius: $border-radius;
		padding: $spacing;
		box-sizing: border-box;

		.popup-title {
			display: block;
			font-size: 28rpx;
			font-weight: 500;
			color: $text-primary;
			text-align: center;
			margin-bottom: $spacing;
		}

		.poster-container {
			display: flex;
			justify-content: center;
			margin-bottom: $spacing;

			.poster-img {
				width: 400rpx;
				height: auto;
				border-radius: 10rpx;
			}
		}

		.save-poster-btn {
			background-color: $primary-color;
			color: #fff;
			font-size: 24rpx;
			width: 100%;
			padding: 15rpx 0;
			margin-bottom: 15rpx;
			border-radius: 10rpx;
		}

		.close-popup-btn {
			background-color: #eee;
			color: $text-secondary;
			font-size: 24rpx;
			width: 100%;
			padding: 15rpx 0;
			border-radius: 10rpx;
		}
	}
</style>