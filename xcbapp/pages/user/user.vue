<template>
    <view class="me-container">
        <view class="user-card">
            <view class="user-info">
                <view class="user-img">
                    <image :src="userAvatar || 'http://h5.xcbdsc.com/static/morentouxiang.jpg'" mode="aspectFill" />
                </view>

                <view class="user-name">
                    <button v-if="!isLoggedIn" @click="login" class="login-button">点击登录</button>
                    <view v-if="isLoggedIn" class="nickname-container">
                        <text class="nickname">{{ userName || '请到我的信息中填写昵称' }}</text>
                    </view>
                </view>

                <!-- 设置图标 -->
                <uni-icons custom-prefix="iconfont" type="icon-shezhi" size="28" class="settings-icon" @click="GoTOsettings" />
            </view>
        </view>

        <!-- 积分统计卡片（横向三栏，更现代大气） -->
        <view class="integral-card">
            <view class="integral-item">
                <view class="label">现金消费累计</view>
                <view class="value">0元</view>
            </view>
            <view class="integral-item highlight">
                <view class="label">可用积分</view>
                <view class="value">{{score}}分</view>
            </view>
            <view class="integral-item">
                <view class="label">冻结积分</view>
                <view class="value">0分</view>
            </view>
        </view>

        <!-- 功能入口列表（白色大圆角卡片 + 彩色图标圆 + 统一间距） -->
        <view class="function-card">
            <view class="function-item" @click="mypoints">
                <view class="item-left">
                    <view class="icon-circle yellow">
                        <uni-icons type="vip" size="30" color="#fff" />
                    </view>
                    <text class="title">我的积分</text>
                </view>
                <uni-icons type="right" size="20" color="#ccc" />
            </view>

            <view class="function-item" @click="goToprePurchaseOrder">
                <view class="item-left">
                    <view class="icon-circle blue">
                        <uni-icons type="shop-filled" size="30" color="#fff" />
                    </view>
                    <text class="title">我的预购</text>
                </view>
                <uni-icons type="right" size="20" color="#ccc" />
            </view>

            <view class="function-item" @click="toorders">
                <view class="item-left">
                    <view class="icon-circle blue">
                        <uni-icons type="cart" size="30" color="#fff" />
                    </view>
                    <text class="title">我的订单</text>
                </view>
                <uni-icons type="right" size="20" color="#ccc" />
            </view>

            <view class="function-item" @click="GotowholesaleNavigation">
                <view class="item-left">
                    <view class="icon-circle blue">
                        <uni-icons type="list" size="30" color="#fff" />
                    </view>
                    <text class="title">我的批发</text>
                </view>
                <uni-icons type="right" size="20" color="#ccc" />
            </view>

            <view class="function-item" @click="GoTOsettings">
                <view class="item-left">
                    <view class="icon-circle blue">
                        <uni-icons type="gear" size="30" color="#fff" />
                    </view>
                    <text class="title">我的设置</text>
                </view>
                <uni-icons type="right" size="20" color="#ccc" />
            </view>

            <view class="function-item" @click="routerPush('/pages/invitation/invitation')">
                <view class="item-left">
                    <view class="icon-circle purple">
                        <uni-icons type="medal-filled" size="30" color="#fff" />
                    </view>
                    <text class="title">我的推广</text>
                </view>
                <uni-icons type="right" size="20" color="#ccc" />
            </view>

            <view class="function-item" @click="routerPush('/pages/earningsRecord/earningsRecord')">
                <view class="item-left">
                    <view class="icon-circle purple">
                        <uni-icons type="medal-filled" size="30" color="#fff" />
                    </view>
                    <text class="title">我的收益</text>
                </view>
                <uni-icons type="right" size="20" color="#ccc" />
            </view>
        </view>

        <!-- 退出登录按钮（与农链天下“立即逛”按钮同风格，红色警示） -->
        <button type="warn" @click="logout" class="logout-btn">退出登录</button>
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
                score: 0,
                totalnum: 0,
                signTotal: {},
                phone: null
            };
        },
        async onShow() {
            this.checkLoginStatus();
            if (this.isLoggedIn) {
                this.fetchUserProfile();
            }
            this.signlist()
        },
        methods: {
            routerPush(path) {
                try {
                    uni.navigateTo({
                        url: path
                    })
                } catch {

                }
            },
            GotowholesaleNavigation() {
                uni.navigateTo({
                    url: '/subPackages/Wholesale/wholesaleNavigation/wholesaleNavigation'
                })
            },
            GoTOsettings() {
                uni.navigateTo({
                    url: '/pages/settings/settings'
                })
            },
            GoToComplaint() {
                uni.navigateTo({
                    url: '/pages/myComplaint/myComplaint'
                })
            },
            goToprePurchaseOrder() {
                uni.navigateTo({
                    url: `/subPackages/shoppingPageList/prePurchaseOrder/prePurchaseOrder`
                })
            },
            goToUpdatePwd() {
                uni.navigateTo({
                    url: `/pages/updatePwd/updatePwd?phone=${this.phone}`,
                })
            },
            checkLoginStatus() {
                const token = uni.getStorageSync('token');
                if (token) {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                }
            },
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
                    } else {
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
                uni.navigateTo({
                    url: '/pages/login/login'
                });
            },
            lottery() {
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
                uni.navigateTo({
                    url: '/pages/MyPoints-records/MyPoints-records'
                });
            },
            logout() {
                try {
                    uni.removeStorageSync('token');
                    uni.removeStorageSync('nickname');
                } catch (e) {
                    console.error('Failed to remove token or nickname from storage', e);
                }
                this.isLoggedIn = false;
                this.nickname = '';
                this.userName = '';
                uni.redirectTo({
                    url: '/pages/login/login'
                });
            },
            async bindingWechat() {
                let systemInfo = await uni.getSystemInfo()
                if (systemInfo[1].host && systemInfo[1].host.env == 'WeChat') {
                    uni.login({
                        provider: 'true',
                        success: async res => {
                            console.log(res.code, "这是用户唯一标识")
                            let data = await api.bindingOpenid({
                                code: res.code
                            })
                            let msg = data.message
                            if (data.code == 200) {
                                uni.showToast({
                                    title: msg,
                                    icon: 'success'
                                })
                            } else {
                                uni.showToast({
                                    title: msg,
                                    icon: 'error'
                                })
                            }
                        }
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

<style lang="scss" scoped>
    $primary-blue: #2d8cf0;
    $primary-yellow: #ffd600;
    $primary-purple: #9c27b0;

    .me-container {
        min-height: 100vh;
        background: #f8f9fb;
        padding: 32rpx 28rpx 80rpx;
    }

    /* 用户信息卡片 */
    .user-card {
        background: #fff;
        border-radius: 36rpx;
        padding: 40rpx 32rpx;
        box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.06);
        margin-bottom: 36rpx;

        .user-info {
            display: flex;
            align-items: center;
            gap: 28rpx;

            .user-img {
                width: 140rpx;
                height: 140rpx;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);

                image {
                    width: 100%;
                    height: 100%;
                }
            }

            .user-name {
                flex: 1;

                .login-button {
                    background: linear-gradient(135deg, $primary-blue, #5aa8ff);
                    color: #fff;
                    border-radius: 50rpx;
                    font-size: 30rpx;
                    padding: 18rpx 48rpx;
                    box-shadow: 0 6rpx 18rpx rgba(45, 140, 240, 0.3);

                    &::after {
                        border: none;
                    }

                    &:active {
                        transform: scale(0.96);
                    }
                }

                .nickname {
                    font-size: 36rpx;
                    font-weight: 700;
                    color: #2d3436;
                }
            }

            .settings-icon {
                padding: 20rpx;
                color: #999;
                transition: transform 0.2s;

                &:active {
                    transform: rotate(30deg);
                }
            }
        }
    }

    /* 积分卡片 */
    .integral-card {
        background: #fff;
        border-radius: 32rpx;
        display: flex;
        justify-content: space-around;
        padding: 32rpx 20rpx;
        box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.06);
        margin-bottom: 40rpx;

        .integral-item {
            flex: 1;
            text-align: center;
            position: relative;

            &:not(:last-child)::after {
                content: '';
                position: absolute;
                right: 0;
                top: 12rpx;
                bottom: 12rpx;
                width: 1rpx;
                background: #f0f0f0;
            }

            .label {
                font-size: 26rpx;
                color: #8a8f99;
                margin-bottom: 8rpx;
            }

            .value {
                font-size: 38rpx;
                font-weight: 700;
                color: #2d3436;
            }

            &.highlight .value {
                color: #ff6a00;
                font-size: 42rpx;
            }
        }
    }

    /* 功能列表卡片 */
    .function-card {
        background: #fff;
        border-radius: 32rpx;
        overflow: hidden;
        box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.06);
        margin-bottom: 60rpx;

        .function-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 32rpx 36rpx;
            border-bottom: 1rpx solid #f5f5f5;

            &:last-child {
                border-bottom: none;
            }

            &:active {
                background: #f8f9fb;
            }

            .item-left {
                display: flex;
                align-items: center;
                gap: 28rpx;

                .icon-circle {
                    width: 60rpx;
                    height: 60rpx;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

                    &.yellow { background: linear-gradient(135deg, $primary-yellow, #ffeb3b); }
                    &.blue   { background: linear-gradient(135deg, $primary-blue, #5aa8ff); }
                    &.purple { background: linear-gradient(135deg, $primary-purple, #ba68c8); }
                }

                .title {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #2d3436;
                }
            }
        }
    }

    /* 退出登录按钮（与之前页面按钮同风格） */
    .logout-btn {
        background: linear-gradient(135deg, #ff7875, #ff4d4f);
        color: #fff;
        height: 96rpx;
        line-height: 96rpx;
        border-radius: 48rpx;
        font-size: 32rpx;
        font-weight: 700;
        border: none;
        box-shadow: 0 10rpx 30rpx rgba(255, 77, 79, 0.35);
        width: 100%;
        margin-top: 20rpx;

        &:active {
            transform: scale(0.96);
            opacity: 0.95;
        }
		

        &::after {
            border: none;
        }
    }
</style>