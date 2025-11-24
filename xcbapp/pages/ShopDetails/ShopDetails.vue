<template>
	<scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower" :style="{ height: '100vh' }"
		@click="closeTan">
		<inputBoxVue ref="inputBoxVueRef"></inputBoxVue>
		<view class="container">

			<view class="StoreName" style="position: relative;">
				<text>{{ shopDetails.title}}</text>
				<image class="logo" :src="shopDetails.logo" mode="aspectFill"></image>
				<view class="complaint-btn" @click="complaint">
					<uni-icons type="compose" size="18" color="#fff"></uni-icons>
					<text>投诉建议</text>
				</view>

			</view>
			
			<uni-collapse class="detail-collapse" border="true">
				<uni-collapse-item title="基本信息" 
					:title-style="{ fontSize: '26rpx', color: '#333', fontWeight: 600, padding: '10rpx 0' }">
					<uni-list>
						<uni-list-item title="摊主名称" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'person-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }" :right-text="shopDetails.contactpeople"></uni-list-item>
						<uni-list-item title="电话" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'phone-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }" :right-text="isLogin ? shopDetails.contactphone : hidePhone(shopDetails.contactphone)"></uni-list-item>
						<uni-list-item title="营业时间" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'calendar-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }" right-text="6:00-21:00"></uni-list-item>
						<uni-list-item title="营业执照" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'map-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }"
							@click="openAvater2" right-text="点击查看摊位营业执照"></uni-list-item>
						<uni-list-item title="地址" :show-extra-icon="true"
							:extra-icon="{color: '#007aff', size: '24', type: 'location-filled'}"
							:style="{ height: '70rpx', fontSize: '22rpx' }" :right-text="shopDetails.market_address ? shopDetails.market_address : ''"></uni-list-item>
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
				
				
				<view class="dish-list">
					<view class="dish-card" v-for="item in pageData" :key="item.id">
						<!-- <menuBarVue :item="item" class="count" @showKeyboard="Keyboard"></menuBarVue> -->
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
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	import shopItem from '@/components/shop-item/shop-item.vue'
	import menuBarVue from '@/components/menuBar.vue';
	import inputBoxVue from '@/components/inputBox.vue';


	import {
		api
	} from '@/api/index'
	import usePage from '@/hooks/usePage';
	import {
		myMixin
	} from '@/utils/public.js'

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
				cart: false, // 购物车初始化弹窗,锁
				show: false,
				isLogin: true,
				showSearch: false,
				commodity_name: '', // 模糊查询菜品名称
				showDetail: false,
				detailHeidht: 0,
				animationData: {}
			}
		},
		mixins: [usePage, myMixin],
		components: {
			shopItem,
			menuBarVue,
			inputBoxVue
		},
		computed: {
			...mapState('cart', ['carts']),
			...mapGetters('cart', ['getTempCount']),
		},
		onShow() {
			const token = uni.getStorageSync('token');
			if (!token) {
				this.isLogin = false
			}
			this.loadPageData()
		},
		onLoad(query) {
			this.shop_id = Number(query.id)
		},
		methods: {
			// 展开详情
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

					// animation.scale(2,2).rotate(45).step()
					animation.height(0).step()

					this.animationData = animation.export()
				}

			},
			// 取消搜索
			async cancelSearch() {
				this.commodity_name = null
				this.pageData = []
				this.showSearch = false
				const res = await this.fetchData({
					page: 1,
					limit: 10,
					isshow: 1
				})
				this.pageData = res.listdata
				this.hasMore = true // 开启下滑加载
			},
			// 搜索菜品
			async searchCommodity() {
				this.pageData = []
				// 默认加载一百条搜索数据，
				let res = await this.fetchData({
					commodity_name: this.commodity_name,
					page: 1,
					limit: 100
				})
				this.pageData = res.listdata
				this.hasMore = false // 禁止下滑加载，
			},
			complaint() {
				uni.navigateTo({
					url: `/pages/merchantComplaints/merchantComplaints?id=${this.shopDetails.id}&title=${this.shopDetails.title}`,
				})
			},
			// 需要调起数字键盘
			Keyboard(value) {
				this.$refs.inputBoxVueRef.show = true
				this.$refs.inputBoxVueRef.cartItem = value
			},
			// 收起购物车
			closeTan() {
				if (this.$refs.shopitem.showCartLayer1) {
					this.$refs.shopitem.showCartLayer1 = false
				}
			},
			// 查看摊主照片
			openAvater1() {
				if (this.urls1[0].length > 1) {
					uni.previewImage({
						count: 1,
						urls: this.urls1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success: (res) => {}
					})
				} else {
					uni.showToast({
						title: '暂无图片',
						icon: 'error'
					})
					// 如果没有图片,则关闭图片预览
					// uni.closePreviewImage()
				}

			},
			// 查看营业执照
			openAvater2() {
				if (this.urls2[0].length > 1) {
					uni.previewImage({
						count: 1,
						urls: this.urls2,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success: (res) => {}
					})
				} else {
					uni.showToast({
						title: '暂无图片',
						icon: 'error'
					})
					// 如果没有图片,则关闭图片预览
					// uni.closePreviewImage()
				}

			},
			...mapMutations('cart', ['addItem', 'subItem']),


			// 首次加载，初始化
			async loadShopDetails() {
				try {
					const response = await api.shopDetail(this.shopId);
					this.shopDetails = response.data.listdata[0];
					this.urls1.push(this.shopDetails.facelogo)
					this.urls2.push(this.shopDetails.businesslogo)
					return response
				} catch (error) {
					console.error('获取摊主详情失败', error);
					uni.showToast({
						title: '获取摊主详情失败',
						icon: 'none'
					});

				}
			},

			async fetchData(params) {
				const res = await this.loadShopDetails();
				const {
					title
				} = res.data.listdata[0]

				params = {
					...params,
					shop_id: this.shop_id || null,
				};
				// console.log(params)
				const response = await api.getmarketCommdityList({
					...params,
					// isshow: 1,
				});

				response.data.listdata = response.data.listdata.map(e => {
					return {
						...e,
						shopTitle: title
					}
				})
				return response.data;
			},


			goTorules() {
				uni.navigateTo({
					url: '/pages/rules/rules'
				});
			},
		}
	}
</script>


<style lang="scss">
	// /deep/ .uni-list-item__extra-text{
	// 	font-size: 28rpx;
	// }
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
		// box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
	}
	
	.search-input {
		flex: 0.9; // 保留原比例
		height: 75rpx !important; // 还原原高度
		// border: 1rpx solid #eee !important;
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
	
	

	.Detail {
		overflow: hidden;
		height: 0px;
		transition: height 0.5s eace;
	}

	.complaint-btn {
		position: absolute;
		left: 10rpx;
		bottom: 10rpx;
		display: flex;
		align-items: center;
		background: #ff7675;
		border-radius: 40rpx;
		padding: 8rpx 24rpx;
		color: #fff;
		font-size: 24rpx;

		text {
			margin-left: 8rpx;
		}
	}

	.container {
		display: flex;
		flex-direction: column;
		margin: 1rpx auto;
		padding: 15rpx;
	}

	.StoreName {
		height: 180rpx;
		padding: 10rpx;
		/* line-height: 60rpx; */
		margin-bottom: 30rpx;
		font-size: 42rpx;
		font-weight: 600;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		height: 150rpx;
		width: 150rpx;
		border-radius: 20rpx;
	}




	.time {
		/* margin-top: 20rpx; */
		height: 60rpx;
		line-height: 60rpx;
		padding: 10rpx;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
	}

	.business-hours {
		color: black;
		font-size: 30rpx;
		font-weight: 600;
		display: flex;
		/* background-color: #007aff; */
	}

	.hour {
		margin-left: 20rpx;
	}

	.phone {
		height: 100%;
		display: flex;
		margin-right: 10rpx;
		box-sizing: border-box;
	}

	.phone>text {
		margin-top: 0rpx;
	}

	.address {
		height: 60rpx;
		line-height: 60rpx;
		padding: 10rpx;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
	}

	.address>text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: black;
		font-size: 30rpx;
		font-weight: 600;
	}

	.notice {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: white;
		margin: 20rpx auto;
		border-radius: 80rpx;
		display: flex;
		/* justify-content: center; */
		align-items: center;
		box-sizing: border-box;
		padding: 0 20rpx;
	}

	.nlef {
		width: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ntext {
		color: #007aff;
		font-weight: 600;
		font-size: 28rpx;
	}

	.nrig {
		width: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ncen {
		height: 100%;
		flex: 1;
	}

	.swiper {
		height: 100%;
		/* background-color: #007aff; */
	}

	.swiitem {
		height: 100%;
		text-align: center;
		font-size: 30rpx;
		color: #666;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.dishes {
		display: flex;
		flex-direction: column;
		/* margin-top: 20rpx; */
		margin-bottom: 180rpx;
	}

	.dishes>.type {
		margin-top: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: start;
		height: 240rpx;
		width: 100%;
		border-radius: 25rpx;
		box-sizing: border-box;
		background-color: white;
	}


	.regard {
		height: 100%;
		width: 71%;
		display: flex;
		flex-direction: column;
	}

	.typetitle {
		height: 100rpx;
		width: 100%;
		line-height: 100rpx;
		color: black;
		font-size: 40rpx;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 10%;
	}

	.label {
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 20rpx;
		color: #007aff;
		/* background-color: #007aff; */
		display: flex;
	}

	.one {
		width: 15%;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		/* background-color: #007aff; */
		border: 0.5rpx solid #007aff;
		margin-right: 10rpx;
	}

	.price {
		height: 50%;
		/* width: 100%; */
		padding: 0 10rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}

	.price>text {
		height: 50rpx;
		width: 50%;
		line-height: 50rpx;
		color: red;
		font-size: 35rpx;
		font-weight: 600;
		margin-bottom: 8rpx;

	}

	.quantity {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10rpx;
	}

	.btn1,
	.btn2 {
		width: 50rpx;
		height: 50rpx;
		background-color: #007aff;
		color: white;
		text-align: center;
		line-height: 50rpx;
		border-radius: 50%;
		margin: 0 10rpx;
	}

	.count {
		width: 100%;
	}

	.fixed {
		height: 100rpx;
		width: 90%;
		background-color: black;
		border-radius: 100rpx;
		position: fixed;
		/* box-sizing: border-box; */
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		z-index: 1000;
	}

	.car {
		/* width: 280rpx; */
		flex: 1;
		height: 100%;
		color: white;
		/* background-color: aqua; */
		border-radius: 100rpx 0 0 100rpx;
		/* padding-left: 30rpx; */
		display: flex;
		justify-content: start;
		align-items: center;
		font-size: 40rpx;
		margin-left: 30rpx;
	}

	.pri {
		margin-left: 30rpx;
	}

	.cart-icon-wrapper {

		position: relative;
		display: inline-block;
	}

	.badge {
		position: absolute;
		top: -10rpx;
		/* Adjust to position the badge vertically */
		right: -10rpx;
		/* Adjust to position the badge horizontally */
		background-color: red;
		color: white;
		border-radius: 50%;
		font-size: 20rpx;
		/* Adjust font size */
		width: 40rpx;
		/* Width of the badge */
		height: 40rpx;
		/* Height of the badge */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sett {
		width: 200rpx;
		height: 100%;
		margin-left: auto;
		background-color: #007aff;
		border-radius: 0 100rpx 100rpx 0;
		color: white;
		font-size: 30rpx;
		text-align: center;
		line-height: 100rpx;
	}

	.overlay {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		transition: opacity 0.3s ease;
		opacity: 0;
		pointer-events: none;
		z-index: 999;
		left: 0;
	}

	.overlay-active {
		opacity: 1;
		pointer-events: auto;
		/* 激活状态下可点击 */
	}

	.cart-layer {

		background-color: white;
		/* padding: 20rpx; */
		padding-top: 0;
		border-radius: 50rpx 50rpx 0 0;
		width: 100%;
		/* max-width: 600rpx; */
		transition: transform 0.3s ease;
		/* 平滑的从底部弹出效果 */
		transform: translateY(100%);
		/* Add any additional styling here */
	}

	.cart-layer-active {
		transform: translateY(0);
		/* 激活状态下弹出层回到视口内 */
	}

	.Topmost {
		height: 50rpx;
		width: 100%;
		line-height: 50rpx;
		border-radius: 50rpx 50rpx 0 0;
		background-color: #007aff;
		color: white;
		text-align: center;
	}

	.shopcontent {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		margin-bottom: 130rpx;
	}

	.top {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		margin: 0rpx auto;
		border-bottom: 1rpx solid #ccc;
	}


	.delete {
		width: 30%;
		height: 70%;
		display: flex;
		margin: auto 0;
		margin-left: auto;
		justify-content: center;
		align-items: center;

	}

	.shopimg {

		width: 100%;
		height: 100%;
		border-radius: 20rpx;

	}

	.shoptitle {
		font-size: 35rpx;
		font-weight: 600;
	}

	.shopprice {
		color: red;
		font-size: 35rpx;
		font-weight: 600;
	}

	.biaoti {
		height: 100rpx;
		width: 100rpx;
		background-color: #007aff;
	}
</style>