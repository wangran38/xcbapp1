<template>
  <view class="container">
    <view class="dynamic-header">
      <text class="header-title">菜品朋友圈</text>
      <view class="header-gradient"></view>
    </view>

    <scroll-view 
      class="smart-feed" 
      scroll-y 
	  @scrolltolower="loadMore"
	  >
      <view 
        v-for="(post, index) in posts" 
        :key="index"
        class="neo-card">
        <view class="user-header">
          <view class="user-meta">
			<view class="post-time">发布时间:{{initTime(post.created)}}</view>
            <view class="username">{{post.farmersgoodsname}}</view>
            
          </view>
        </view>

        <scroll-view 
          class="media-scroller"
          scroll-x
          :scroll-with-animation="true"
          :show-scrollbar="false">
          <view class="media-container">
            <view 
              v-for="(item, idx) in post.imgs"
              :key="idx"
              class="media-item">
              <image 
                v-if="item.fileType === 'image'"
                :src="item.path"
                mode="aspectFill"
                class="media-content" @click="viewImage(item.path)"/>
              <video
                v-else
                :src="item.path"
                controls
                class="media-content"
                objectFit="cover"></video>
            </view>
          </view>
        </scroll-view>

        <!-- 内容区域 -->
        <view class="content-section">
          <text class="post-content">{{post.content}}</text>
          <view class="interaction-panel">
            <view 
              class="action-btn"
              @click="toggleReaction(index)">
              <uni-icons
                :type="post.liked ? 'heart-filled' : 'heart'"
                :color="post.liked ? '#FF6B6B' : '#7A9D7E'"
                size="20" />
              <text class="count">{{post.likes}}</text>
            </view>
            <view class="action-btn">
              <uni-icons 
                type="chat" 
                color="#7A9D7E"
                size="20" />
              <text class="count">{{post.comments}}</text>
            </view>
          </view>
        </view>
      </view>
	  <view v-if="posts.length<=0" style="text-align: center; line-height: 300rpx; font-size: 30rpx; font-weight: bold;">暂无数据</view>
    </scroll-view>
  </view>
</template>


<script>
	import {
		api
	} from '@/api/index.js'
	import {myMixin} from '@/utils/public.js'
	export default {
		mixins:[myMixin],
		data() {
			return {
				posts: [
				],
				queryData: {
					page: 1,
					limit: 10
				}
			}
		},
		
		async onLoad(pramas) {
			if(pramas.id){
				this.queryData.farmersgoods_id = parseInt(pramas.id)
			}
			this.getData()
		},
		methods: {
			viewImage(url){
				uni.previewImage({
					showmenu:false,
					urls:[url]
				})
			},
			async getData(){
				let data = await api.dynamicsDataList(this.queryData)
				if (data.code == 200){
					// 处理图片
					let newList = data.data.listdata.map(item=>{
						item['imgs'] = item['imgs'].split(',')
						let initData =  item['imgs'].map((anlien)=>{
							if (anlien.slice(anlien.length-3) == 'mp4'){
								return {
									fileType:'video',
									path:anlien
								} 
							}else{
								return {
									fileType:'image',
									path:anlien
								}
							}
						})
						item['imgs'] = initData
						return item
					})
					this.posts = [...this.posts,...newList]
					this.noMore = newList.length < this.queryData.limit;
				}
			},
			loadMore() {
				if (!this.noMore) {
					this.queryData.page++;
					this.getData()
				}
			},
			toggleReaction(index) {
				const post = this.posts[index]
				post.liked = !post.liked
				post.likes += post.liked ? 1 : -1
			},
			previewMedia(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			createPost() {
				uni.navigateTo({
					url: '/pages/post/create'
				})
			}
		}
	}
</script>

<<style lang="scss" scoped>
/* 设计变量 */
$primary-color: #7A9D7E;
$text-primary: #2D4030;
$text-secondary: #8C9B8E;

.container {
  background: #f8faf7;
  min-height: 100vh;
}

/* 渐变标题栏 */
.dynamic-header {
  padding: 48rpx 32rpx 64rpx;
  position: relative;
  
  .header-title {
    position: relative;
    z-index: 2;
    font-size: 44rpx;
    font-weight: 600;
    color: $text-primary;
    letter-spacing: 2rpx;
  }
  
  .header-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 160rpx;
    background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-color, 0.05) 100%);
    transform: skewY(-2deg);
  }
}

/* 动态卡片 */
.neo-card {
  background: #fff;
  border-radius: 24rpx;
  margin: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(122,157,126,0.08);
  overflow: hidden;
  
  .user-header {
    padding: 32rpx;
    
    .user-meta {
      .username {
		margin-top: 20rpx;
        font-size: 30rpx;
        color: gray;
        font-weight: 500;
      }
      
      .post-time {
        font-size: 30rpx;
        color: black;
		font-weight: bold;
        margin-top: 8rpx;
      }
    }
  }

  .media-scroller {
    padding: 0 0 32rpx;
    
    .media-container {
      display: flex;
      padding: 0 32rpx;
      width: max-content;
      
      .media-item {
        width: 560rpx;
        height: 420rpx;
        border-radius: 16rpx;
        overflow: hidden;
        margin-right: 24rpx;
        box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
        
        .media-content {
          width: 100%;
          height: 100%;
        }
        
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .content-section {
    padding: 0 32rpx 32rpx;
    
    .post-content {
      font-size: 28rpx;
      color: $text-primary;
      line-height: 1.6;
      margin-bottom: 24rpx;
    }
    
    .interaction-panel {
      display: flex;
      gap: 48rpx;
      border-top: 1rpx solid rgba($primary-color, 0.1);
      padding-top: 24rpx;
      
      .action-btn {
        display: flex;
        align-items: center;
        transition: transform 0.2s ease;
        
        &:active {
          transform: scale(0.95);
        }
        
        .count {
          color: $primary-color;
          font-size: 28rpx;
          margin-left: 12rpx;
        }
      }
    }
  }
}
</style>