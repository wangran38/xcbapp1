<template>
    <view class="wholesale-container">
       <!-- <view class="brand-header">
            <view class="brand-title">批发大厅</view>
            <view class="brand-subtitle">供应采购 · 一站搞定</view>
        </view> -->

        <!-- 主内容卡片（与地区选择页完全一致的大圆角 + 立体阴影容器） -->
        <view class="region-card">
            <!-- 供应大厅卡片 -->
            <view class="nav-card supply-card" :style="{height: cardHeight}" @click="goToSupply">
                <view class="card-inner">
                    <uni-icons type="shop-filled" size="64" color="#fff" />
                    <text class="card-title">供应大厅</text>
                    <text class="card-desc">浏览最新货源信息</text>
                </view>
            </view>

            <!-- 采购大厅卡片 -->
            <view class="nav-card purchase-card" :style="{height: cardHeight}" @click="goToPurchase">
                <view class="card-inner">
                    <uni-icons type="cart-filled" size="64" color="#fff" />
                    <text class="card-title">采购大厅</text>
                    <text class="card-desc">发布采购需求</text>
                </view>
            </view>

            <!-- 统计面板（与地区选择页输入框同质感） -->
            <view class="stats-panel">
                <view class="stats-item">
                    <uni-icons type="shop-filled" size="36" color="#2d8cf0" />
                    <text class="stats-value">{{selltotalnum}}</text>
                    <text class="stats-label">供应量</text>
                </view>
                <view class="stats-item">
                    <uni-icons type="cart-filled" size="36" color="#ff6a00" />
                    <text class="stats-value">{{buytotalnum}}</text>
                    <text class="stats-label">采购量</text>
                </view>
            </view>

            <!-- 发布按钮（与“立即逛”按钮完全一致的质感：大圆角 + 悬浮阴影 + 按压反馈） -->
            <view class="action-bar" @click="toggle('bottom')">
                <button class="save-btn">
                    <uni-icons type="plusempty" size="42" color="#fff" style="margin-right: 12rpx;" />
                    <text>我要发布</text>
                </button>
            </view>
        </view>

      

        <!-- 发布弹窗（与地区选择页弹层同风格：大圆角 + 阴影） -->
        <uni-popup ref="popup" style="padding-bottom: 0;">
            <view class="popup-sheet">
                <view class="popup-option purchase-option" @click="goToAddPurchase">
                    <uni-icons type="cart-filled" size="56" color="#ff4d4f" />
                    <view class="option-title">发采购</view>
                    <view class="label">让百万供应商为你报价</view>
                </view>

                <view class="vertical-divider"></view>

                <view class="popup-option supply-option" @click="goToAddSupply">
                    <uni-icons type="shop-filled" size="56" color="#2d8cf0" />
                    <view class="option-title">发商品</view>
                    <view class="label">千万采购商找到你</view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import {
        api
    } from '@/api/index.js'
    export default {
        data() {
            return {
                cardHeight: '380rpx',
                selltotalnum: 0,
                buytotalnum: 0
            };
        },
        onLoad() {
            this.calculateLayout();
            this.getData()
        },
        methods: {
            async getData() {
                let data = await api.buysellTotal()
                if (data.code == 200) {
                    this.selltotalnum = data.data.selltotalnum
                    this.buytotalnum = data.data.buytotalnum
                }
            },
            goToAddPurchase() {
                uni.navigateTo({
                    url: '/subPackages/Wholesale/addPurchase/addPurchase'
                })
            },
            goToAddSupply() {
                uni.navigateTo({
                    url: '/subPackages/Wholesale/addSupply/addSupply'
                })
            },
            toggle(type) {
                this.type = type
                this.$refs.popup.open(type)
            },
            goToPurchase() {
                uni.navigateTo({
                    url: '/subPackages/Wholesale/purchase/purchase'
                })
            },
            goToSupply() {
                uni.navigateTo({
                    url: '/subPackages/Wholesale/supply/supply'
                })
            },
            calculateLayout() {
                const systemInfo = uni.getSystemInfoSync();
                this.cardHeight = `${systemInfo.windowHeight * 0.28}px`;
            }
        }
    };
</script>

<style lang="scss" scoped>
    $primary-red: #ff4d4f;

    .wholesale-container {
        min-height: 100vh;
        background: #fcfcfc;
        background-image:
            radial-gradient(at 0% 0%, rgba(255, 77, 79, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(24, 144, 255, 0.05) 0px, transparent 50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 40rpx;
    }

    /* 品牌头部（与农链天下页面 100% 一致） */
    .brand-header {
        margin-top: 120rpx;
        text-align: center;

        .brand-title {
            font-size: 88rpx;
            font-weight: 900;
            background: linear-gradient(135deg, #333 0%, #666 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 4rpx;
        }

        .brand-subtitle {
            font-size: 26rpx;
            color: #999;
            letter-spacing: 10rpx;
            margin-top: 10rpx;
        }
    }

    /* 核心大卡片（与地区选择页完全一致的圆角 + 阴影） */
    .region-card {
        width: 100%;
        margin-top: 80rpx;
        background: #ffffff;
        border-radius: 40rpx;
        box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.06);
        padding: 40rpx;
        box-sizing: border-box;
    }

    /* 供应/采购卡片（垂直堆叠，更大气舒适，解决你说的布局问题） */
    .nav-card {
        border-radius: 40rpx;
        margin-bottom: 32rpx;
        overflow: hidden;
        box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);
        transition: transform 0.25s ease;

        &:active {
            transform: scale(0.98);
        }

        .card-inner {
            padding: 52rpx 36rpx;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            height: 100%;

            .card-title {
                font-size: 44rpx;
                margin: 28rpx 0 12rpx;
                font-weight: 700;
                letter-spacing: 2rpx;
            }

            .card-desc {
                font-size: 28rpx;
                opacity: 0.92;
            }
        }

        &.supply-card {
            background: linear-gradient(135deg, #2d8cf0, #5aa8ff);
        }

        &.purchase-card {
            background: linear-gradient(135deg, #ff6a00, #ff8f33);
        }
    }

    /* 统计面板（与地区选择页输入行同质感） */
    .stats-panel {
        background: #f7f8fa;
        border-radius: 28rpx;
        padding: 36rpx 24rpx;
        display: flex;
        justify-content: space-around;
        margin: 20rpx 0 40rpx;
        box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

        .stats-item {
            text-align: center;
            flex: 1;

            .stats-value {
                display: block;
                font-size: 52rpx;
                font-weight: 700;
                color: #2d3436;
            }

            .stats-label {
                font-size: 26rpx;
                color: #7f8c8d;
                margin-top: 8rpx;
            }
        }
    }

    /* 发布按钮（与“立即逛”按钮 100% 同风格） */
    .action-bar {
        .save-btn {
            background: #4a90e2;
            color: #fff;
            height: 110rpx;
            line-height: 110rpx;
            border-radius: 55rpx;
            font-size: 36rpx;
            font-weight: bold;
            border: none;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            &:active {
                transform: scale(0.98);
                opacity: 0.92;
            }
        }
    }

    /* 弹窗（与地区选择页同风格） */
    .popup-sheet {
        height: 30vh;
        border-radius: 40rpx 40rpx 0 0;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 -12rpx 40rpx rgba(0, 0, 0, 0.1);
        padding: 0 20rpx;
    }

    .popup-option {
        flex: 1;
        text-align: center;
        padding: 0 30rpx;
    }

    .vertical-divider {
        width: 2rpx;
        height: 120rpx;
        background: linear-gradient(to bottom, transparent, #e0e0e0, transparent);
        align-self: center;
    }

    .option-title {
        font-size: 34rpx;
        font-weight: 700;
        color: #2d3436;
        margin: 20rpx 0 6rpx;
    }

    .label {
        color: #8a8f99;
        font-size: 24rpx;
    }

    /* 底部提示 */
    .footer-tips {
        margin-top: 60rpx;
        display: flex;
        justify-content: center;

        .tip-item {
            display: flex;
            align-items: center;
            background: rgba(82, 196, 26, 0.08);
            padding: 10rpx 24rpx;
            border-radius: 30rpx;

            text {
                font-size: 24rpx;
                color: #666;
                margin-left: 8rpx;
            }
        }
    }
</style>