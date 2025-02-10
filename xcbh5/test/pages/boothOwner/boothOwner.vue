<template>
	<view class="all">
		<view class="me-container">
			<view class="outlets">
				<view class="title">
					我的摊铺
				</view>
				<view class="content">
					<view class="item" @click="goToapply">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightblue">{{'&#xe61a'}}</uni-icons>
						<view class="add-dishes">
							申请固定摊位
						</view>
					</view>
					<view class="item" @click="gotostalllist">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightgreen">{{'&#xe602;'}}</uni-icons>
						<view class="add-dishes">
							摊位列表
						</view>
					</view>
		
					<view class="item" @click="gotoEditshop">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightblue">{{'&#xe61e;'}}</uni-icons>
						<view class="add-dishes">
							摊位资料补充
						</view>
					</view>
					<!-- <view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view> -->
				</view>
			</view>
			<view class="dishes">
				<view class="title">
					我的菜品
				</view>
				<view class="content">
					<view class="item" @click="goTorelePage">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightblue">{{'&#xe6ee;'}}</uni-icons>
						<view class="add-dishes">
							添加菜品
						</view>
					</view>
					<view class="item" @click="gotopublish">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightgreen">{{'&#xe603;'}}</uni-icons>
						<view class="add-dishes">
							菜品列表
						</view>
					</view>
					<view class="item" @click="gotoListDis">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightgreen">{{'&#xe689;'}}</uni-icons>
						<view class="add-dishes">
							已上架菜品
						</view>
					</view>
					<!-- <view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							菜品朋友圈
						</view>
					</view> -->
					<!-- <view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view> -->
				</view>
		
			</view>
		
			<view class="orders">
				<view class="title" @click="gotoOwneroders(0)">
					我的订单
				</view>
				<view class="content">
					<view class="item" @click="gotoOwneroders(1)">
						<uni-icons fontFamily="CustomFont" :size="26" color="red">{{'&#xe626;'}}</uni-icons>
						<view class="add-dishes">
							待支付
						</view>
					</view>
					<view class="item" @click="gotoOwneroders(3)">
						<uni-icons fontFamily="CustomFont" :size="26" color="red">{{'&#xe600;'}}</uni-icons>
						<view class="add-dishes">
							待收货
						</view>
					</view>
					<view class="item" @click="gotoOwneroders(5)">
						<uni-icons fontFamily="CustomFont" :size="26" color="red">{{'&#xe689;'}}</uni-icons>
						<view class="add-dishes">
							待结算
						</view>
					</view>
					<view class="item" @click="gotoOwneroders(6)">
						<uni-icons fontFamily="CustomFont" :size="26" color="lightgreen">{{'&#xe60f;'}}</uni-icons>
						<view class="add-dishes">
							已结算
						</view>
					</view>
					<!-- <view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view> -->
				</view>
			</view>
			<view class="earnings">
				<view class="title">
					我的收益
				</view>
				<view class="content">
					<view class="item" @click="gotowallet">
						<uni-icons fontFamily="CustomFont" :size="26" color="yellow">{{'&#xe613;'}}</uni-icons>
						<view class="add-dishes">
							钱包
						</view>
					</view>
					<view class="item" @click="gotoPoints">
						<uni-icons fontFamily="CustomFont" :size="26" color="yellow">{{'&#xe673;'}}</uni-icons>
						<view class="add-dishes">
							积分钱包
						</view>
					</view>
					<view class="item" @click="gotoPointspayouts">
						<uni-icons fontFamily="CustomFont" :size="26" color="yellow">{{'&#xe682;'}}</uni-icons>
						<view class="add-dishes">
							积分结算
						</view>
					</view>
		
					<view class="item" @click="gotoBankCard">
						<uni-icons fontFamily="CustomFont" :size="26" color="yellow">{{'&#xe936;'}}</uni-icons>
						<view class="add-dishes">
							银行卡
						</view>
					</view>
					<view class="item" @click="gotoOpenAccountSharing">
						<uni-icons fontFamily="CustomFont" :size="26" color="yellow">{{'&#xe936;'}}</uni-icons>
						<view class="add-dishes">
							开通分账
						</view>
					</view>
					<!-- <view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view>
					<view class="item">
						<uni-icons type="plus" size="30"></uni-icons>
						<view class="add-dishes">
							待开发
						</view>
					</view> -->
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onShow() {

			// if (this.checkToken()){
			// 	uni.navigateTo({
			// 		url:'/pages/login/login'
			// 	})
			// }
		},
		methods: {
			// 检查是否token存在，存在则已登陆
			checkToken() {
				const token = uni.getStorageSync('token');
				if (!token){
					return true
				}
				return false
			},
			gotopublish() {
				uni.navigateTo({
					url: '/pages/publish/publish'
				});
			},
			goTorelePage() {
				uni.navigateTo({
					url: '/pages/release/release'
				});
			},
			goToapply() {
				uni.navigateTo({
					url: '/pages/Apply/Apply'
				});
			},
			gotostalllist() {
				uni.navigateTo({
					url: '/pages/stalllist/stalllist'
				});
			},
			gotoListDis() {
				uni.navigateTo({
					url: '/pages/Listed-Dishes/Listed-Dishes'
				});
			},
			gotoOwneroders(orderStatus) {
				uni.navigateTo({
					url: `/pages/Ownerorders/Ownerorders?orderStatus=${orderStatus}`
				});
			},
			gotowallet() {
				uni.navigateTo({
					url: '/pages/wallet/wallet'
				});
			},
			gotoPoints() {
				uni.navigateTo({
					url: '/pages/Points/Points'
				});
			},
			gotoPointspayouts() {
				uni.navigateTo({
					url: '/pages/pointspayouts/pointspayouts'
				});
			},
			// 补充摊位资料页面
			gotoEditshop() {
				uni.navigateTo({
					url: '/pages/editshop/editshop'
				});
			},
			// 银行卡
			gotoBankCard() {
				uni.navigateTo({
					url: '/pages/bankCard/bankCard'
				});
			},
			gotoOpenAccountSharing(){
				uni.navigateTo({
					url: '/pages/OpenAccountSharing/OpenAccountSharing'
				});
			}
		}
	}
</script>

<style>
	.tip{
		width: 100%;
		height: 100%;
		background-color: white;
		position: fixed;
	}
	.mencheng{
		border-radius: 10rpx;
		background-color: yellowgreen;
		margin-left: 40rpx;
		transition: background-color .8s;
	}
	.items{
		text-align: center;
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
	}
	@font-face {
		font-family: CustomFont;
		src: url('../../static/maicai/iconfont.ttf');
	}

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
		justify-content: center;
		flex: 4;
	}

	.dishes {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.outlets {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.orders {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
	}

	.earnings {
		flex: 1;
		margin-top: 20rpx;
		border-radius: 20rpx;
		background-color: white;
		margin-bottom: 20rpx;
	}

	.title {
		height: 80rpx;
		line-height: 80rpx;
		color: black;
		font-size: 32rpx;
		font-weight: 700;
		margin-left: 20rpx;
	}

	.content {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		gap: 30rpx;
		padding: 10rpx 10rpx;
	}

	.item {
		width: 180rpx;
		height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

	}

	.add-dishes {
		width: 100%;
		color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
</style>