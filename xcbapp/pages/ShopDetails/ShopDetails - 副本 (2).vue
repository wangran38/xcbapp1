<template>
	<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower" :style="{ height: '100vh', background: '#f5f5f5' }"
		@click="closeTan">
		<inputBoxVue ref="inputBoxVueRef"></inputBoxVue>
		<view class="container">

			<!-- 1. 店铺头部：还原原布局，解决重叠问题 -->
			<view class="StoreName">
				<image class="logo" :src="shopDetails.logo || '/static/default-shop.png'" mode="aspectFill"></image>
				<text class="store-title">{{ shopDetails.title || '未命名店铺' }}</text>
				<view class="complaint-btn" @click="complaint">
					<uni-icons type="compose" size="18" color="#fff"></uni-icons>
					<text>投诉建议</text>
				</view>
			</view>

			<!-- 2. 折叠详情：保留原组件，优化文字/图标比例 -->
			<uni-collapse class="detail-collapse" border="true">
				<uni-collapse-item title="查看详情" 
					:title-style="{ fontSize: '26rpx', color: '#333', fontWeight: 600, padding: '10rpx 0' }">
					<uni-list>
						<uni-list-item title="摊主名称" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'person-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }"></uni-list-item>
						<uni-list-item title="电话" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'phone-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }"></uni-list-item>
						<uni-list-item title="营业时间" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'calendar-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }"></uni-list-item>
						<uni-list-item title="营业执照" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'file-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }"
							@click="openAvater2"></uni-list-item>
						<uni-list-item title="地址" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'location-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }"></uni-list-item>
					</uni-list>
				</uni-collapse-item>
			</uni-collapse>

			<!-- 3. 菜品搜索区：还原原按钮风格，解决大小不一 -->
			<view class="dishes">
				<view class="search-bar">
					<uni-easyinput type="text" :adjust-position="true" v-model="commodity_name" 
						placeholder="请输入菜品名称" :clearable="false"
						placeholder-style="{ color: '#999', fontSize: '24rpx' }"
						class="search-input"></uni-easyinput>
					<view class="search-btn-group">
						<button class="save search-btn" @click="searchCommodity">搜索</button>
						<button class="save reset-btn" @click="cancelSearch">清空</button>
					</view>
				</view>

				<!-- 4. 菜品列表：保留原卡片高度，优化排版 -->
				<view class="dish-list">
					<view class="dish-card" v-for="item in pageData" :key="item.id">
						<menuBarVue :item="item" class="count" @showKeyboard="Keyboard"></menuBarVue>
					</view>
					<view class="empty-state" v-if="pageData.length === 0">
						<uni-icons type="empty" size="40" color="#999"></uni-icons>
						<text>暂无菜品</text>
					</view>
				</view>
			</view>

			<shopItem :shop_id="shop_id" ref="shopitem"></shopItem>
		</view>
	</scroll-view>
</template>


<script>
	// 完全保留你原有的JS逻辑，只修复变量冲突和数据加载顺序
	import { mapState, mapMutations, mapGetters } from 'vuex';
	import shopItem from '@/components/shop-item/shop-item.vue'
	import menuBarVue from '@/components/menuBar.vue';
	import inputBoxVue from '@/components/inputBox.vue';
	import { api } from '@/api/index'
	import usePage from '@/hooks/usePage';
	import { myMixin } from '@/utils/public.js'

	export default {
		data() {
			return {
				cart: [],
				totalPrice: 0,
				showCartLayer: false,
				cartItems: [],
				pageData: [],
				shopDetails: {},
				shop_id: "",
				urls1: [], // 摊主照片
				urls2: [], // 营业执照图片
				cartLock: false, // 修复变量重名问题
				show: false,
				isLogin: true,
				showSearch: false,
				commodity_name: '', // 模糊查询菜品名称
				showDetail: false,
				detailHeidht: 0,
				animationData: {},
				hasMore: true // 补充下拉加载开关
			}
		},
		mixins: [usePage, myMixin],
		components: { shopItem, menuBarVue, inputBoxVue },
		computed: {
			...mapState('cart', ['carts']),
			...mapGetters('cart', ['getTempCount']),
		},
		onShow() {
			const token = uni.getStorageSync('token');
			this.isLogin = !!token;
			// 修复：先加载店铺详情再加载菜品，避免shop_id为空
			this.loadShopDetails().then(() => {
				this.loadPageData();
			});
		},
		methods: {
			// 展开详情（保留你原有的动画逻辑）
			expandDetails() {
				this.showDetail = !this.showDetail
				if (this.showDetail) {
					var animation = uni.createAnimation({
						duration: 2000,
						transformOrigin: "50% 50%",
						timingFunction: "ease",
					})
					this.animation = animation
					animation.height(230).step()
					this.animationData = animation.export()
				} else {
					var animation = uni.createAnimation({
						duration: 2000,
						transformOrigin: "50% 50%",
						timingFunction: "ease",
					})
					this.animation = animation
					animation.height(0).step()
					this.animationData = animation.export()
				}
			},
			// 取消搜索（修复commodity_name赋值为null的问题）
			async cancelSearch() {
				this.commodity_name = '';
				this.pageData = [];
				this.showSearch = false;
				const res = await this.fetchData({ page: 1, limit: 10, isshow: 1 });
				this.pageData = res.listdata;
				this.hasMore = true;
			},
			// 以下完全保留你原有的方法逻辑
			async searchCommodity() {
				this.pageData = []
				let res = await this.fetchData({
					commodity_name: this.commodity_name,
					page: 1,
					limit: 100
				})
				this.pageData = res.listdata
				this.hasMore = false
			},
			complaint() {
				uni.navigateTo({
					url: `/pages/merchantComplaints/merchantComplaints?id=${this.shopDetails.id}&title=${this.shopDetails.title}`,
				})
			},
			Keyboard(value) {
				this.$refs.inputBoxVueRef.show = true
				this.$refs.inputBoxVueRef.cartItem = value
			},
			closeTan() {
				if (this.$refs.shopitem && this.$refs.shopitem.showCartLayer1) {
					this.$refs.shopitem.showCartLayer1 = false
				}
			},
			openAvater1() {
				if (this.urls1.length && this.urls1[0].length > 1) {
					uni.previewImage({ count: 1, urls: this.urls1, sizeType: ['original', 'compressed'] })
				} else {
					uni.showToast({ title: '暂无图片', icon: 'error' })
				}
			},
			openAvater2() {
				if (this.urls2.length && this.urls2[0].length > 1) {
					uni.previewImage({ count: 1, urls: this.urls2, sizeType: ['original', 'compressed'] })
				} else {
					uni.showToast({ title: '暂无图片', icon: 'error' })
				}
			},
			...mapMutations('cart', ['addItem', 'subItem']),
			async loadShopDetails() {
				try {
					const pages = getCurrentPages();
					const currentPage = pages[pages.length - 1];
					const query = currentPage.options;
					const shopId = Number(query.id);
					const response = await api.shopDetail(shopId);
					this.shop_id = shopId;
					this.shopDetails = response.data.listdata[0] || {};
					this.urls1 = [this.shopDetails.facelogo || ''];
					this.urls2 = [this.shopDetails.businesslogo || ''];
					return response;
				} catch (error) {
					console.error('获取摊主详情失败', error);
					uni.showToast({ title: '获取摊主详情失败', icon: 'none' });
				}
			},
			async fetchData(params) {
				const res = await this.loadShopDetails();
				if (!res) return { listdata: [] };
				const { title } = res.data.listdata[0] || {};
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				const query = currentPage.options;
				params = { ...params, shop_id: Number(query.id) || null };
				const response = await api.getmarketCommdityList({ ...params, isshow: 1 });
				response.data.listdata = (response.data.listdata || []).map(e => ({ ...e, shopTitle: title || '' }));
				return response.data;
			},
			async loadPageData() {
				const res = await this.fetchData({ page: 1, limit: 10, isshow: 1 });
				this.pageData = res.listdata;
			},
			goTorules() {
				uni.navigateTo({ url: '/pages/rules/rules' });
			},
			async handleScrollToLower() {
				if (!this.hasMore) return;
				const currentPage = Math.ceil(this.pageData.length / 10) + 1;
				const res = await this.fetchData({ page: currentPage, limit: 10, isshow: 1, commodity_name: this.commodity_name });
				if (res.listdata.length === 0) {
					this.hasMore = false;
					uni.showToast({ title: '已加载全部', icon: 'none' });
					return;
				}
				this.pageData = [...this.pageData, ...res.listdata];
			}
		}
	}
</script>


<style lang="scss">
	// 完全贴合你原有的样式风格，只做「精致化调整」
	.page {
		background-color: #f5f5f5;
	}

	// 主容器：保留原间距
	.container {
		display: flex;
		flex-direction: column;
		margin: 1rpx auto;
		padding: 15rpx;
	}

	// 1. 店铺头部：修复重叠，保留原尺寸比例
	.StoreName {
		height: 180rpx;
		padding: 10rpx;
		margin-bottom: 30rpx;
		font-size: 42rpx;
		font-weight: 600;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative; // 用于定位投诉按钮
		border-radius: 20rpx; // 补充圆角，避免生硬
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05); // 轻微阴影，提升质感
	}

	.logo {
		height: 150rpx;
		width: 150rpx;
		border-radius: 20rpx;
		object-fit: cover; // 修复图片拉伸
		margin-right: 20rpx; // 与标题拉开距离，避免重叠
	}

	.store-title {
		max-width: 60%; // 防止标题过长挤压logo
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	// 投诉按钮：保留原红色，调整位置不遮挡内容
	.complaint-btn {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		display: flex;
		align-items: center;
		background: #ff7675;
		border-radius: 40rpx;
		padding: 8rpx 24rpx;
		color: #fff;
		font-size: 24rpx;
	}

	.complaint-btn text {
		margin-left: 8rpx;
	}

	// 2. 折叠详情：保留原边框，优化内边距
	.detail-collapse {
		background-color: white;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		overflow: hidden; // 避免圆角和边框冲突
	}

	// 3. 搜索区：还原原按钮风格，解决大小不一
	.dishes {
		display: flex;
		flex-direction: column;
		margin-bottom: 180rpx;
	}

	.search-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10rpx 0;
		background-color: white;
		padding: 10rpx;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
	}

	.search-input {
		flex: 0.9; // 保留原比例
		height: 75rpx !important; // 还原原高度
		border: 1rpx solid #eee !important;
		border-radius: 20rpx !important;
		padding-left: 20rpx !important;
		font-size: 24rpx !important;
	}

	.search-btn-group {
		display: flex;
		gap: 10rpx; // 按钮间距，避免拥挤
	}

	// 完全还原你原有的按钮样式，只修复大小不一致
	.save {
		font-weight: bold;
		background: transparent;
		border: none;
		color: white;
		font-size: 34rpx; // 还原原字号
		height: 75rpx;    // 还原原高度
		line-height: 80rpx;
		text-align: center;
		border-radius: 20rpx;
		background-color: #007aff;
		margin: 5rpx;
	}

	.save::after {
		border: none; // 清除默认边框
	}

	// 清空按钮：保留原红色，避免刺眼
	.reset-btn {
		background-color: #ff7675;
	}

	// 4. 菜品列表：保留原高度，优化排版
	.dish-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx; // 菜品间距，避免拥挤
	}

	.dish-card {
		height: 240rpx; // 保留原高度
		width: 100%;
		border-radius: 25rpx;
		box-sizing: border-box;
		background-color: white;
		padding: 15rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05); // 轻微阴影，提升层次
	}

	.count {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}

	// 空状态：简洁提示，不突兀
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
		color: #999;
		font-size: 24rpx;
	}

	.empty-state uni-icons {
		margin-bottom: 15rpx;
	}
</style>