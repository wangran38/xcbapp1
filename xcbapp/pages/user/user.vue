<template>
  <view class="me-container">
    <!-- 用户信息区域 -->
    <view class="user">
      <view class="user-info">
        <!-- 用户头像 -->
        <view class="user-img">
          <image :src="userAvatar || 'http://h5.xcbdsc.com/static/morentouxiang.jpg'" mode="aspectFill" />
        </view>
        
        <!-- 用户名称 -->
        <view class="user-name">
          <button v-if="!isLoggedIn" @click="login" class="login-button">点击登录</button>
          <view v-if="isLoggedIn" class="nickname-container">
            <view class="nickname-input">{{ userName || '请到我的信息中填写昵称' }}</view>
          </view>
        </view>
        
        <!-- 设置图标 -->
        <uni-icons 
          custom-prefix="iconfont" 
          type="icon-shezhi" 
          size="20" 
          class="settings-icon"
          @click="GoTOsettings"
        />
      </view>
    </view>

    <!-- 积分统计 -->
    <view class="integral-grid">
      <view class="integral-item">
        <text class="label">现金消费累计</text>
        <text class="value">0元</text>
      </view>
      <view class="integral-item highlight">
        <text class="label">可用积分</text>
        <text class="value">{{score}}分</text>
      </view>
      <view class="integral-item">
        <text class="label">冻结积分</text>
        <text class="value">0分</text>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="function-list">
      <!-- 打卡 -->
      <view class="function-item" @click="lottery">
        <view class="item-left">
          <uni-icons type="auth" size="30" color="#00C853" />
          <text class="title">我的打卡</text>
          <text class="subtitle">累计打卡{{totalnum}}次</text>
        </view>
        <uni-icons type="right" size="18" color="#999" />
      </view>

      <!-- 我的积分 -->
      <view class="function-item" @click="mypoints">
        <view class="item-left">
          <uni-icons type="vip" size="30" color="#FFD600" />
          <text class="title">我的积分</text>
        </view>
        <uni-icons type="right" size="18" color="#999" />
      </view>

      <!-- 我的预购 -->
      <view class="function-item" @click="goToprePurchaseOrder">
        <view class="item-left">
          <uni-icons type="shop-filled" size="30" color="#2979FF" />
          <text class="title">我的预购</text>
        </view>
        <uni-icons type="right" size="18" color="#999" />
      </view>
	  
	  <view class="function-item" @click="toorders">
	    <view class="item-left">
	      <uni-icons type="cart" size="30" color="#2979FF" />
	      <text class="title">我的订单</text>
	    </view>
	    <uni-icons type="right" size="18" color="#999" />
	  </view>
	  <view class="function-item" @click="GotowholesaleNavigation">
	    <view class="item-left">
	      <uni-icons type="list" size="30" color="#2979FF" />
	      <text class="title">我的批发</text>
	    </view>
	    <uni-icons type="right" size="18" color="#999" />
	  </view>
	  <view class="function-item" @click="GoTOsettings">
	    <view class="item-left">
	      <uni-icons type="gear" size="30" color="#2979FF" />
	      <text class="title">我的设置</text>
	    </view>
	    <uni-icons type="right" size="18" color="#999" />
	  </view>
	  <view class="function-item" @click="routerPush('/pages/invitation/invitation')">
	    <view class="item-left">
	      <uni-icons type="medal-filled" size="30" color="#2979FF" />
	      <text class="title">我的推广</text>
	    </view>
	    <uni-icons type="right" size="18" color="#999" />
	  </view>
	  
	  <view class="function-item" @click="routerPush('/pages/earningsRecord/earningsRecord')">
	    <view class="item-left">
	      <uni-icons type="medal-filled" size="30" color="#2979FF" />
	      <text class="title">我的收益</text>
	    </view>
	    <uni-icons type="right" size="18" color="#999" />
	  </view>
	  
    </view>
	<button type="warn" @click="logout" style="margin: 20rpx;">退出登录</button>
  </view>
</template>

<script>
	import {
		api
	} from '../../api/index.js';
	import {
		getPlatform
	} from '../../hooks/useUpload.js'
	export default {
		data() {
			return {
				isLoggedIn: false,
				userName: '',
				userAvatar: '',
				score: '',
				// 添加你需要的数据属性
				totalnum: 0,
				signTotal: {},
				phone:null // 用户手机号
			};
		},
		async onShow() {			
			// 检查是否登录
			this.checkLoginStatus();
			if (this.isLoggedIn) {
				// 获取当前用户信息
				this.fetchUserProfile();
			}
			this.signlist()
		},
		methods: {
			routerPush(path){
				try{
					uni.navigateTo({
						url:path
					})
				}catch{
					
				}
			},
			GotowholesaleNavigation(){
				uni.navigateTo({
					 url: '/subPackages/Wholesale/wholesaleNavigation/wholesaleNavigation'
				})
			},
			GoTOsettings(){
				uni.navigateTo({
					 url: '/pages/settings/settings'
				})
			},
			GoToComplaint(){
				uni.navigateTo({
					 url: '/pages/myComplaint/myComplaint'
				})
			},
			goToprePurchaseOrder(){
				uni.navigateTo({
					 url: `/subPackages/shoppingPageList/prePurchaseOrder/prePurchaseOrder`
				})
			},
			goToUpdatePwd(){
				uni.navigateTo({
					url: `/pages/updatePwd/updatePwd?phone=${this.phone}`,
				})
			},

			/**
			 * 检查登录状态
			 */
			checkLoginStatus() {
				const token = uni.getStorageSync('token');
				if (token) {
					this.isLoggedIn = true;
				} else {
					this.isLoggedIn = false;
				}
			},
			/**
			 * 获取用户个人信息
			 */
			async fetchUserProfile() {
				try {
					const response = await api.getUserProfile();
					if (response.code === 200) {
						const {
							name,
							Headimgurl,
							score,
							phone
						} = response.data;
						this.userName = name;
						this.userAvatar = Headimgurl;
						this.score = score;
						this.phone = phone
						// if (!this.userName){
						// 	uni.showModal({
						// 		title:'个人信息不完整',
						// 		showCancel:false,
						// 		content:'系统检测到您的个人信息中缺少用户名，为了不影响后续的业务开展，请前往个人页面对个人信息进行补充',
						// 		success() {
						// 			setTimeout(()=>{
						// 				uni.navigateTo({
						// 					url:'/pages/user-edit/user-edit'
						// 				})
						// 			},100)
						// 		}
						// 	})
						// }
					} else {
						// 处理获取用户信息失败的情况
						uni.showToast({
							title: '获取用户信息失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('Error fetching user profile:', error);
					uni.showToast({
						title: '获取用户信息失败',
						icon: 'none'
					});
				}
			},
			async signlist(data) {
				const token = uni.getStorageSync('token');
				const response = await api.signlist(token);
				this.totalnum = response.data.totalnum
			},
			login() {
				// 跳转到登录页面
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			lottery() {
				// 跳转到用户抽奖页面
				uni.navigateTo({
					url: '/pages/clock-records/clock-records'
				});
			},
			toorders(orderStatus) {
				uni.navigateTo({
					url: `/pages/orders/orders?orderStatus=${orderStatus}`
				});
			},
			mypoints() {
				// 跳转到用户抽奖页面
				uni.navigateTo({
					url: '/pages/MyPoints-records/MyPoints-records'
				});
			},
			logout() {
				// 清除存储中的用户数据
				try {
					uni.removeStorageSync('token');
					uni.removeStorageSync('nickname');
					console.log('Token and nickname removed from storage');
				} catch (e) {
					console.error('Failed to remove token or nickname from storage', e);
				}
				// 设置登录状态为未登录
				this.isLoggedIn = false;
				this.nickname = '';
				this.userName = '';
				// 跳转到登录页面
				uni.redirectTo({
					url: '/pages/login/login'
				});
			},
			// 绑定微信
			async bindingWechat() {
				let systemInfo = await uni.getSystemInfo()
				// 判断是否是小程序端，如果不是就提示用户到小程序端进行绑定
				if (systemInfo[1].host && systemInfo[1].host.env == 'WeChat') {
					uni.login({
						provider: 'true',
						success: async res => {
							console.log(res.code, "这是用户唯一标识")
							let data = await api.bindingOpenid({
								code: res.code
							})
							let msg = data.message
							if (data.code == 200){
								uni.showToast({
									title:msg,
									icon:'success'
								})
							}else{
								uni.showToast({
									title:msg,
									icon:'error'
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					uni.showToast({
						title: '浏览器不支持调用api,请前往小程序端进行账号绑定',
						duration: 3000,
						icon: 'error'
					})
				}
			}
		}
	};
</script>


<style lang="scss">
.me-container {
  padding: 32rpx;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 用户信息 */
.user {
  margin-bottom: 48rpx;
  .user-info {
    display: flex;
    align-items: center;
    gap: 24rpx;
    
    .user-img {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .user-name {
      flex: 1;
      .login-button {
        background: #2979FF;
        color: white;
        border-radius: 48rpx;
        font-size: 28rpx;
        padding: 16rpx 32rpx;
        &::after { border: none; }
      }
      
      .nickname-input {
        font-size: 32rpx;
        color: #333;
      }
    }

    .settings-icon {
      padding: 16rpx;
    }
  }
}

/* 积分统计 */
.integral-grid {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.05);

  .integral-item {
    padding: 32rpx;
    background: #fff;
    text-align: center;
    
    .label {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 8rpx;
    }
    
    .value {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
    }

    &.highlight .value {
      color: #2979FF;
    }
  }
}

/* 功能列表 */
.function-list {
  margin-top: 48rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.05);

  .function-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #eee;
    
    &:last-child {
      border: none;
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 24rpx;
      
      .title {
        font-size: 30rpx;
        color: #333;
      }
      
      .subtitle {
        font-size: 24rpx;
        color: #999;
        margin-left: 24rpx;
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 480px) {
  .me-container {
    padding: 24rpx;
  }
  
  .user-info {
    .user-img {
      width: 96rpx !important;
      height: 96rpx !important;
    }
    
    .nickname-input {
      font-size: 28rpx !important;
    }
  }

  .integral-grid {
    grid-template-columns: 1fr;
    .integral-item {
      padding: 24rpx;
    }
  }
}
</style>
