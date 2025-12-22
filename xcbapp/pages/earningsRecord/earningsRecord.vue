<template>
  <view class="reward-page">
<!--    <view class="navbar">
      <text class="nav-title">邀请奖励记录</text>
    </view> -->

    <view class="overview-card">
      <view class="overview-item">
        <text class="overview-label">累计邀请奖励 (积分)</text>
        <text class="overview-value"> {{totalMoney.toFixed(2)}}</text>
      </view>
      <view class="overview-item">
        <text class="overview-label">本月新增奖励 (积分)</text>
        <text class="overview-value today-value"> 0</text>
      </view>
    </view>

    <!-- 说明文字 -->
    <view class="explanation">
      <text>奖励规则：被邀请人消费后，您将获得相应比例奖励</text>
    </view>

    <!-- 收益明细列表 -->
    <scroll-view class="reward-list" scroll-y>
      <view class="list-item" v-for="(item, index) in rewardRecords" :key="index">
        <view class="item-left">
          <view class="invite-icon">
            <text class="icon-text">邀</text>
          </view>
          <view class="item-info">
            <text class="item-time">{{ initTime(item.createtime) }}</text>
            <text class="item-from">来自：推广个人收益</text>
          </view>
        </view>
        <text class="item-amount">+¥{{ item.level6money.toFixed(2) }}</text>
      </view>

      <!-- 空状态提示 -->
      <view class="empty-state" v-if="rewardRecords.length === 0">
        <text class="empty-text">暂无邀请奖励记录</text>
        <text class="empty-hint">被邀请人消费后，奖励将显示在这里</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
	import {myMixin} from '@/utils/public.js'
	import {api} from '@/api/index.js'
export default {
	mixins:[myMixin],
  data() {

    return {
      rewardRecords: [
        // { 
        //   title: '被邀请人消费返佣', 
        //   amount: 35.50, 
        //   time: '2024-09-22 15:35',
        //   invitee: '张三'
        // }
      ],
	  totalMoney:0,
	  query:{
		  page:1,
		  limit:20
	  }
    };
  },
  onLoad() {
  	this.getdata()
  },
  methods:{
	  async getdata(){
		  let data = await api.userRevenue(this.query)
		  // console.log(data)
		  if (data.code == 200){
			  this.totalMoney = data.data.totalMoney
			  this.rewardRecords = [...this.rewardRecords,...data.data.listdata]
			  console.log(data)
		  }
	  }
  }
};
</script>

<style scoped>
/* 页面容器 */
.reward-page {
  background-color: #f5f5f7;
  min-height: 100vh;
  font-size: 14px;
}

/* 导航栏 */
.navbar {
  height: 48px;
  background-color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.nav-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
}

/* 收益概览卡片 */
.overview-card {
  background-color: #ffffff;
  margin: 15px;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.overview-item {
  flex: 1;
  text-align: center;
}
.overview-label {
  color: #666666;
  font-size: 14px;
}
.overview-value {
  color: #333333;
  font-size: 22px;
  font-weight: bold;
  display: block;
  margin-top: 8px;
}
.today-value {
  color: #409EFF;
}

/* 说明文字 */
.explanation {
  padding: 0 15px 10px;
  color: #666666;
  font-size: 13px;
}

/* 奖励明细列表 */
.reward-list {
  margin-top: 10px;
  height: calc(100vh - 48px - 130px - 30px);
}
.list-item {
  background-color: #ffffff;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}
.item-left {
  display: flex;
  align-items: center;
}
.invite-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #ffffff;
  font-weight: bold;
  background-color: #52c41a;
}
.item-info {
  display: flex;
  flex-direction: column;
}
.item-title {
  color: #333333;
  font-size: 15px;
  margin-bottom: 4px;
}
.item-time, .item-from {
  color: #999999;
  font-size: 12px;
  line-height: 1.5;
}

.item-amount {
  color: #f5222d;
  font-size: 16px;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999999;
  padding: 0 20px;
  text-align: center;
}
.empty-text {
  font-size: 15px;
  margin-bottom: 8px;
}
.empty-hint {
  font-size: 13px;
  line-height: 1.5;
}
</style>
