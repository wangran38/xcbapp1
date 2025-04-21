<template>
  <view class="purchase-container">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-group">
        <picker @change="categoryChange" :range="categories" range-key="label">
          <view class="filter-btn">
            <text class="btn-text">{{ selectedCategory.label }}</text>
            <uni-icons type="arrowdown" size="14" color="#3a7afe" />
          </view>
        </picker>
        <view class="divider"></view>
<!--        <picker @change="sortChange" :range="sortOptions" range-key="label">
          <view class="filter-btn">
            <text class="btn-text">{{ selectedSort.label }}</text>
            <uni-icons type="arrowdown" size="14" color="#3a7afe" />
          </view>
        </picker> -->
      </view>
    </view>

    <!-- 采购列表 -->
    <scroll-view class="purchase-list" scroll-y @scrolltolower="loadMore">
      <view 
        class="purchase-card"
        v-for="(item, index) in purchaseList"
        :key="index"
        @click="viewDetail(item.id)"
      >
        <!-- 卡片头部 -->
        <view class="card-header">
          <view class="header-left">
            <!-- <uni-icons type="hand-up" size="20" color="#3a7afe" /> -->
            <text class="title">{{ item.infotitle }}</text>
          </view>
          <!-- <view class="status-badge" :class="item.status">
            <text>{{ item.statusText }}</text>
            <view class="pulse-dot"></view>
          </view> -->
        </view>

        <!-- 采购详情 -->
        <view class="detail-row">
          <view class="detail-item">
            <uni-icons type="balance" size="18" color="#999" />
            <text class="detail-text">数量:{{ item.infonumber }}{{ item.unit }}</text>
          </view>
        </view>

        <!-- 公司信息 -->
       <view class="company-info">
          <!-- <image class="company-logo" :src="item.company.logo" /> -->
          <view class="company-detail">
            <text class="company-name">{{ item.buyaddress }}</text>
<!--            <view class="verify-tag" v-if="item.company.verified">
              <uni-icons type="checkmark" size="12" color="#fff" />
              <text>认证企业</text>
            </view> -->
          </view>
        </view>

        <!-- 底部信息 -->
        <view class="card-footer">
          <view class="deadline">
            <uni-icons type="calendar" size="16" color="#666" />
            <text>{{ initDate(item.stoptime) }} 截止</text>
          </view>
          <view class="action-btn" @click.stop="contactSupplier(item.id)">
            <text>立即联系</text>
            <uni-icons type="arrow-right" size="14" color="#fff" />
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="load-status">
        <text v-if="loading" class="loading-text">加载中...</text>
        <text v-else-if="noMore" class="no-more">- 已显示全部内容 -</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
	import {api} from '@/api/index.js'
	import {myMixin} from '@/utils/public.js'
export default {
	mixins:[myMixin],
  data() {
    return {
      categories: [
        { label: '全部采购', value: 'all' },
        { label: '肉类', value: 'material' },
        { label: '蔬菜', value: 'equipment' },
        { label: '蛋类', value: 'service' }
      ],
      sortOptions: [
        { label: '智能排序', value: 'default' },
        { label: '预算最高', value: 'budget_desc' },
        { label: '最新发布', value: 'newest' }
      ],
      selectedCategory: { label: '全部采购', value: 'all' },
      selectedSort: { label: '智能排序', value: 'default' },
      purchaseList: [],
      page: 1,
      loading: false,
      noMore: false,
	  query:{
		  area_id:null,
		  stoptime:null,
		  page:1,
		  limit:20
	  }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      if (this.loading || this.noMore) return
      
      this.loading = true
      try {
        // 模拟API请求
		 let data = await api.buyinfoList(this.query)
        // const mockData = Array.from({length: 5}, (_, i) => ({
        //   id: this.page * 10 + i,
        //   title: `采购${['鸡蛋', '槟榔苗', '蜂蜜', '猪肉'][i%4]}`,
        //   quantity: Math.floor(Math.random() * 1000),
        //   unit: ['个', '枝', '斤', '斤'][i%4],
        //   budget: (Math.random() * 500 + 50).toFixed(1),
        //   deadline: this.generateDeadline(),
        //   status: ['processing', 'urgent'][i%2],
        //   statusText: ['招标中', '紧急采购'][i%2],
        //   company: {
        //     name: `企业${String.fromCharCode(65 + i%26)}`,
        //     logo: `https://picsum.photos/40/40?c=${i}`,
        //     verified: i%3 === 0
        //   }
        // }))
        
        this.purchaseList = [...this.purchaseList, ...data.data.listdata]
		console.log(this.purchaseList)
        this.page++
        this.noMore = this.page > 2
      } finally {
        this.loading = false
      }
    },

    // 生成截止日期
    generateDeadline() {
      const date = new Date()
      date.setDate(date.getDate() + Math.floor(Math.random() * 7 + 3))
      return `${date.getMonth()+1}月${date.getDate()}日`
    },

    // 分类改变
    categoryChange(e) {
      this.selectedCategory = this.categories[e.detail.value]
      this.resetList()
    },

    // 排序改变
    sortChange(e) {
      this.selectedSort = this.sortOptions[e.detail.value]
      this.resetList()
    },

    // 重置列表
    resetList() {
      this.page = 1
      this.purchaseList = []
      this.noMore = false
      this.loadData()
    },

    // 查看详情
    viewDetail(id) {
      uni.navigateTo({
        url: `/pages/purchase/detail?id=${id}`
      })
    },

    // 联系供应商
    contactSupplier(id) {
      uni.showActionSheet({
        items: ['在线沟通', '电话联系', '邮件联系'],
        success: res => console.log('联系方式:', res.tapIndex)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	
.purchase-container {
  background: #f8f9fb;
  min-height: 100vh;
  .filter-bar {
    padding: 24rpx 32rpx;
    background: #fff;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);

    .filter-group {
      display: flex;
      align-items: center;
      background: rgba(#3a7afe, 0.05);
      border-radius: 12rpx;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 1px;
        height: 60%;
        background: rgba(#3a7afe, 0.1);
      }

      .filter-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8rpx;
        padding: 16rpx;
        
        .btn-text {
          font-size: 28rpx;
          color: #3a7afe;
          font-weight: 500;
        }
      }
    }
  }

  /* 采购列表样式 */
  .purchase-list {
    padding: 32rpx;

    .purchase-card {
		width: 84%;
      background: #fff;
      border-radius: 16rpx;
      padding: 32rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
      transition: transform 0.2s;

      &:active {
        transform: scale(0.98);
      }

      /* 卡片头部 */
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;
        padding-bottom: 24rpx;
        border-bottom: 1px solid rgba(#3a7afe, 0.1);

        .header-left {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .title {
            font-size: 32rpx;
            font-weight: 600;
            color: #2d3436;
            line-height: 1.4;
          }
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8rpx;
          padding: 8rpx 20rpx;
          border-radius: 32rpx;
          font-size: 24rpx;

          &[class*="processing"] {
            background: rgba(#00c853, 0.08);
            color: #00c853;
          }

          &[class*="urgent"] {
            background: rgba(#ff4444, 0.08);
            color: #ff4444;
          }

          .pulse-dot {
            width: 12rpx;
            height: 12rpx;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }
        }
      }

      /* 采购详情 */
      .detail-row {
        display: flex;
        gap: 48rpx;
        margin-bottom: 32rpx;

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8rpx;

          .detail-text {
            font-size: 26rpx;
            color: #666;
          }
        }
      }

      /* 公司信息 */
      .company-info {
        display: flex;
        align-items: center;
        gap: 16rpx;
        margin-bottom: 32rpx;

        .company-logo {
          width: 64rpx;
          height: 64rpx;
          border-radius: 8rpx;
        }

        .company-detail {
          flex: 1;

          .company-name {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 8rpx;
          }

          .verify-tag {
			  margin: 0 0 0 10rpx;
            display: inline-flex;
            align-items: center;
            gap: 4rpx;
            padding: 4rpx 12rpx;
            background: #3a7afe;
            border-radius: 8rpx;
            color: #fff;
            font-size: 22rpx;
          }
        }
      }

      /* 底部信息 */
      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 24rpx;
        border-top: 1px solid #eee;

        .deadline {
          display: flex;
          align-items: center;
          gap: 8rpx;
          color: #666;
          font-size: 26rpx;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8rpx;
          padding: 12rpx 32rpx;
          background: #3a7afe;
          color: #fff;
          border-radius: 48rpx;
          font-size: 26rpx;
        }
      }
    }

    /* 加载状态 */
    .load-status {
      text-align: center;
      padding: 40rpx;
      color: #999;
      font-size: 26rpx;
    }
  }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
