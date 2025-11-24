<template>
	<view class="me-container">
		<!-- 其他内容 -->
		<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower"
			:style="{ height: '100vh' }">
			<view class="disheslist">
				<view class="type" v-for="item in pageData" :key="item.id">
					<image class="type-image" :src="item.imglogo " mode="scaleToFill"></image>

					<view class="regard">
						<view class="typetitle">
							{{item.commodity_name}}
						</view>
						<view class="typetitle">
							{{item.price.toFixed(2)}} 元/斤
						</view>
					</view>
					<view class="function">
						<!-- <view class="rigicon" @click="off(item.id)">下架</view> -->
						<view :class="{'rigicon': true, 'disabled': item.isshow === 0}"
							@click="item.isshow === 1 && off(item.id)">
							{{ item.isshow === 1 ? '下架' : '已下架' }}
						</view>
					</view>
				</view>
				<view v-if="pageLoading" class="loading">加载中...</view>
				<view v-if="!hasMore" class="loading">没有更多了</view>
			</view>


		</scroll-view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index'
	import usePage from '@/hooks/usePage';
	export default {
		data() {
			return {
				pageData: [],
				// token: '',
				shopId: 0,
			}
		},
		onLoad(options) {
			this.token = uni.getStorageSync('token');
			this.shopId = options.id;
			this.reloadData()
		},
		mixins: [usePage],
		methods: {
			async fetchData(params) {
				const response = await api.myShoplist({ ...params,shop_id: Number(this.shopId),isshow: 1 })
				return response.data

			},
			async off(itemId) {
				try {
					// 调用下架菜品接口
					const response = await api.xiajiashop({
						id: itemId,
						isshow: 2, // 2 表示下架
					});

					if (response.code === 200) {
						uni.showToast({
							title: '下架成功',
							icon: 'success'
						});
						// this.reloadData(); // 重新加载数据
						// 更新下架的菜品的状态
						          const itemIndex = this.pageData.findIndex(item => item.id === itemId);
						          if (itemIndex !== -1) {
						            this.pageData[itemIndex].isshow = 0;  // 更新状态为已下架
						          }
								  this.reloadData(); 
					} else {
						uni.showToast({
							title: response.msg || '操作失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
					console.error('下架失败', error);
				}
			},
		}
	}
</script>

<style>
	.me-container {
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 40rpx 0 40rpx;
		color: white;
		z-index: 1;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		/* 从顶部开始布局 */
		position: relative;
		/* 确保子元素的绝对定位是相对于这个容器 */
		height: calc(100vh - 10rpx);
		/* 确保容器占满整个视口高度 */
	}

	.disheslist {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.type {
		height: 12%;
		width: 100%;
		display: flex;
		flex-direction: row;
		background-color: white;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.type-image {
		height: 180rpx;
		width: 30%;
		border-radius: 20rpx;
		background-color: #007aff;
	}

	.regard {
		/* width: 30%; */
		flex: 1;
		height: 180rpx;
		color: black;
		font-size: 30rpx;
		font-weight: 600;
		/* display: flex; */
		/* flex-direction: column; */
		/* background-color: bisque; */
		/* justify-content: space-around; */
		margin-left: 20rpx;
		/* 将子元素放置在容器的顶部和底部 */

	}

	.function {
		display: flex;
		height: 100%;
		width: 100rpx;
		margin-left: auto;
		justify-content: end;
		align-items: center;
	}

	.rigicon {
		height: 50%;
		width: 100rpx;
		background-color: #007aff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30rpx;
	}
	.disabled {
	  background-color: #d3d3d3; /* 灰色背景 */
	  cursor: not-allowed; /* 更改鼠标样式为禁用状态 */
	}
	.loading {
		text-align: center;
		padding: 20rpx;
		color: #999;
	}
</style>