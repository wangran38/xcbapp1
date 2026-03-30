<template>
    <scroll-view class="Stallholder" scroll-y="true" @scrolltolower="handleScrollToLower" :style="{ height: '100vh' }" @click="closeTan">
        <inputBoxVue ref="inputBoxVueRef" ></inputBoxVue>
        
        <view class="container">
            <view class="hero-header">
                <image class="hero-bg" :src="shopDetails.logo || 'https://picsum.photos/800/400?random=farm'" mode="aspectFill" />
                <view class="header-overlay">
                    <view class="logo-wrapper">
                        <image class="logo" :src="shopDetails.logo" mode="aspectFill" />
                    </view>
                    <text class="shop-title">{{ shopDetails.title || '摊位名称' }}</text>
                </view>
                <view class="complaint-btn" @click="complaint">
                    <uni-icons type="compose" size="20" color="#fff" />
                    <text>投诉建议</text>
                </view>
            </view>

            <view class="info-card">
                <view class="info-title">摊主信息</view>
                <view class="info-list">
                    <view class="info-item">
                        <uni-icons type="person-filled" size="24" color="#4a90e2" />
                        <text class="info-label">摊主</text>
                        <text class="info-value">{{ shopDetails.contactpeople }}</text>
                    </view>
                    <view class="info-item">
                        <uni-icons type="phone-filled" size="24" color="#4a90e2" />
                        <text class="info-label">电话</text>
                        <text class="info-value">{{ isLogin ? shopDetails.contactphone : hidePhone(shopDetails.contactphone) }}</text>
                    </view>
                    <view class="info-item">
                        <uni-icons type="calendar-filled" size="24" color="#4a90e2" />
                        <text class="info-label">营业时间</text>
                        <text class="info-value">06:00 - 21:00</text>
                    </view>
                    <view class="info-item" @click="openAvater2">
                        <uni-icons type="map-filled" size="24" color="#4a90e2" />
                        <text class="info-label">营业执照</text>
                        <text class="info-value link">点击查看</text>
                    </view>
                    <view class="info-item" @click="openAvater1">
                        <uni-icons type="camera-filled" size="24" color="#4a90e2" />
                        <text class="info-label">摊主照片</text>
                        <text class="info-value link">点击查看</text>
                    </view>
                    <view class="info-item">
                        <uni-icons type="location-filled" size="24" color="#4a90e2" />
                        <text class="info-label">地址</text>
                        <text class="info-value">{{ shopDetails.market_address || '菜市场内' }}</text>
                    </view>
                </view>
            </view>

            <!-- 菜品区 -->
            <view class="dishes">
                <view class="section-header">
                    <text class="section-title">今日精选菜品</text>
                    <!-- <text class="section-subtitle">共 {{ pageData.length }} 款新鲜食材</text> -->
                </view>
                
                <mButtonVue 
                    :isShowbutton2="true" 
                    @btn1="searchCommodity" 
                    @btn2="cancelSearch" 
                    placeholder="搜索菜品名称">
                </mButtonVue>

                <view class="dish-grid">
                    <view v-for="item in pageData" :key="item.id" class="dish-card" >
                        <menuBarVue :item="item"  @showKeyboard="Keyboard"/>
                    </view>
                </view>

                <view class="empty-state" v-if="pageData.length === 0">
                    <uni-icons type="empty" size="80" color="#FF9800" />
                    <text class="empty-text">暂无菜品</text>
                    <text class="empty-sub">换个关键词试试看～</text>
                </view>
            </view>

            <shopItem :shop_id="shop_id" ref="shopitem" />
        </view>
    </scroll-view>
</template>

<script>
import { useCartStore } from '@/store/cart'
import shopItem from '@/components/shop-item/shop-item.vue'
import menuBarVue from '@/components/menuBar.vue'
import inputBoxVue from '@/components/inputBox.vue'
import { api } from '@/api/index'
import usePage from '@/hooks/usePage'
import { myMixin } from '@/utils/public.js'
import mButtonVue from '@/components/public/mButton/mButton.vue'

export default {
    data() {
        return {
            shopDetails: {},
            shop_id: "",
            urls1: [],
            urls2: [],
            pageData: [],
            isLogin: true,
            commodity_name: ''
        }
    },
    mixins: [usePage, myMixin],
    components: { shopItem, menuBarVue, inputBoxVue, mButtonVue },
    setup() {
        const cartStore = useCartStore()
        return { cartStore }
    },
    onLoad(query) { 
        this.shop_id = Number(query.id) 
    },
    onShow() {
        this.isLogin = !!uni.getStorageSync('token')
        this.loadPageData()
    },
    methods: {
        complaint() {
            uni.navigateTo({ 
                url: `/pages/merchantComplaints/merchantComplaints?id=${this.shopDetails.id}&title=${this.shopDetails.title}` 
            })
        },
        Keyboard(item) {
            this.$refs.inputBoxVueRef.show = true
            this.$refs.inputBoxVueRef.cartItem = item
        },
        closeTan() {
            if (this.$refs.shopitem?.showCartLayer1) this.$refs.shopitem.showCartLayer1 = false
        },
        openAvater1() {
            if (this.urls1.length) {
                uni.previewImage({ urls: this.urls1 })
            } else {
                uni.showToast({ title: '暂无摊主照片', icon: 'none' })
            }
        },
        openAvater2() {
            if (this.urls2.length) {
                uni.previewImage({ urls: this.urls2 })
            } else {
                uni.showToast({ title: '暂无营业执照', icon: 'none' })
            }
        },

        async loadShopDetails() {
            try {
                const res = await api.shopDetail(this.shop_id)
                this.shopDetails = res.data.listdata[0] || {}
                this.urls1 = this.shopDetails.facelogo ? [this.shopDetails.facelogo] : []
                this.urls2 = this.shopDetails.businesslogo ? [this.shopDetails.businesslogo] : []
            } catch (e) {
                uni.showToast({ title: '店铺信息加载失败', icon: 'none' })
            }
        },

        async fetchData(params) {
            if (!this.shopDetails.title) await this.loadShopDetails()
            const res = await api.getmarketCommdityList({ ...params, shop_id: this.shop_id })
            const title = this.shopDetails.title || ''
            res.data.listdata = res.data.listdata.map(item => ({ ...item, shopTitle: title }))
            return res.data
        },

        async searchCommodity(value) {
            this.commodity_name = value
            this.pageData = []
            const res = await this.fetchData({ commodity_name: value, page: 1, limit: 100 })
            this.pageData = res.listdata
            this.hasMore = false
        },

        async cancelSearch() {
            this.commodity_name = ''
            this.pageData = []
            this.hasMore = true
            const res = await this.fetchData({ page: 1, limit: 10 })
            this.pageData = res.listdata
        }
    }
}
</script>

<style lang="scss" scoped>
$primary:#4a90e2;
$accent: #FF5722;

.container {
    // background: linear-gradient(180deg, #FFF5F0 0%, #FFFFFF 65%);
    min-height: 100vh;
    padding-bottom: 180rpx;
}

/* 超大英雄头部 */
.hero-header {
    position: relative;
    height: 380rpx;
    overflow: hidden;
    margin-bottom: 40rpx;
    border-radius: 0 0 40rpx 40rpx;
    // box-shadow: 0 20rpx 40rpx rgba(255, 152, 0, 0.18);
}
.hero-bg {
    width: 100%;
    height: 100%;
    filter: brightness(0.88);
}
.header-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40rpx 30rpx 30rpx;
    // background: linear-gradient(to top, rgba(0,0,0,0.62), transparent);
    display: flex;
    align-items: flex-end;
    gap: 30rpx;
}
.logo-wrapper {
    width: 160rpx;
    height: 160rpx;
    border-radius: 30rpx;
    overflow: hidden;
    border: 8rpx solid #fff;
    box-shadow: 0 15rpx 30rpx rgba(0,0,0,0.28);
}
.logo {
    width: 100%;
    height: 100%;
}
.shop-title {
    font-size: 52rpx;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 4rpx 12rpx rgba(0,0,0,0.45);
    line-height: 1.2;
    flex: 1;
}

/* 投诉按钮 */
.complaint-btn {
    position: absolute;
    top: 40rpx;
    right: 30rpx;
    background: linear-gradient(90deg, #FF5722, #FF8A65);
    padding: 14rpx 32rpx;
    border-radius: 50rpx;
    color: #fff;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
    box-shadow: 0 10rpx 25rpx rgba(255, 87, 34, 0.35);
}

/* 信息卡片（纯白大圆角，与截图卡片风格一致） */
.info-card {
    background: #fff;
    margin: 0 24rpx 40rpx;
    border-radius: 32rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 15rpx 40rpx rgba(0,0,0,0.07);
}
.info-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #222;
    margin-bottom: 30rpx;
    padding-left: 10rpx;
    border-left: 6rpx solid $primary;
}
.info-list {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
}
.info-item {
    display: flex;
    align-items: center;
    gap: 24rpx;
    padding: 10rpx 0;
}
.info-label {
    font-size: 28rpx;
    color: #666;
    width: 120rpx;
}
.info-value {
    font-size: 28rpx;
    color: #333;
    flex: 1;
}
.link {
    color: $primary;
    font-weight: 600;
}

/* 菜品区 */
.dishes {
    padding: 0 24rpx;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20rpx;
}
.section-title {
    font-size: 38rpx;
    font-weight: 700;
    color: #222;
}
.section-subtitle {
    font-size: 26rpx;
    color: #999;
}

.dish-grid {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
	margin-top: 20rpx;
}
.dish-card {
    background: #fff;
    border-radius: 32rpx;
    overflow: hidden;
    box-shadow: 0 15rpx 40rpx rgba(0,0,0,0.09);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}


/* 空状态 */
.empty-state {
    text-align: center;
    padding: 120rpx 0 80rpx;
}
.empty-text {
    font-size: 34rpx;
    margin-top: 20rpx;
    font-weight: 600;
}
.empty-sub {
    font-size: 26rpx;
    color: #999;
    margin-top: 10rpx;
}
</style>