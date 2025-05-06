<template>
	<view class="me-container">
		<view class="title">
			喜讯
		</view>
		<view class="content">
			<view class="one">为了营造一个轻松,愉悦,有趣味的购物消费场景,我们塔岭农贸市场管理处从2024年11月1日开始,开展购物消费，系统随机摇号产生幸运者,获赠消费积分活动.具体规定如下:</view>
			<view class="one">一、凡是到塔岭农贸市场购物消费的市民,都可以扫打卡二维码,同一个电话号码一天可以扫码打卡两次：上午一次.时间:6:00-12:00,下午一次.时间:12:00-21:00。</view>
			<view class="one">
				二、每周日晚上23.00,根据市民上一周每一次的打卡记录信息,自动随机摇号抽选出一、二、三档共十二名幸运者。打卡次数越多,选中的几率越大。
				一档：1名,获赠1000个积分。
				二档：3名,分别获赠500个积分。
				三档：8名,分别获赠300个分。
			</view>
			<view class="one">三、1个积分等同于0.1元现金价值.积分不能兑换现金.也不能转赠,获赠积分的凭被抽选中的手机号,在塔岭农贸市场购物消费使用(由于系统还在建设升级的原因，仅限在“乡愁宝”小程序加盟商户进行消费使用)。</view>
			<view class="one">四、积分可以单独使用,也可以和现金同时使用。</view>
			<view class="one">五、积分有效期为180个日历天数,从获赠积分即时算起，超时不使用，剩余的积分全部清零。</view>
			<view class="one">
				六、每次抽选结果及个人积分信息，在“乡愁宝”小程序中都可以查询。
			</view>
			<view class="one">
				七、参与积分活动的行为都属于个人自愿行为，无任何强迫因素在内。
			</view>
			<view class="one">
				八.本活动的解释权由塔岭农贸市场管理处负责。
			</view>
		</view>
		<view class="luokuan">
			<view class="bomen">
				塔岭农贸市场办公室
			</view>
			<view class="dateTime">2024.11.01
			</view>

		</view>
<!-- 		<view class="fixd" @click="scan">
			<view >立即签到</view>
		</view> -->

		<view class="Notice">
			<view style="font-size: 30rpx; font-weight: bold;">
				{{getNowDate()}}
			</view>
			<view>今日打卡人次：{{signTotalData.todaynum}} <br>累计打卡人次：{{signTotalData.allnum}}</view>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js';
	import {myMixin} from '@/utils/public.js'
	export default {
		mixins:[myMixin],
		data() {
			return {
				signTotalData:{},
				
			}
		},
		async mounted() {
			let res = await api.signTotal()
			this.signTotalData = res.data
		},
		methods: {
			getNowDate(){
				return this.initDate(Date.now())
			},
			scan() {
			  // 只允许通过相机扫码
			  uni.scanCode({
			    onlyFromCamera: true,
			    success: function (res) {
				  console.log(1);
			      console.log('条码类型：' + res.scanType);
			      console.log('条码内容：' + res.result);
			
			      // 检查是否是 URL，如果是 URL，则跳转
			      const scannedUrl = res.result;
			      if (scannedUrl.startsWith('http')) {
					  console.log('这是一个有效的 URL');
			        // 解码 URL
			        const decodedUrl = decodeURIComponent(scannedUrl);
					console.log('解码后的 URL:', decodedUrl);
			        // 提取 hash 部分（即 # 后面的部分）
			        const hashIndex = decodedUrl.indexOf('#');
			        if (hashIndex !== -1) {
			          const pagesPath = decodedUrl.substring(hashIndex + 1); // 例如 "/pages/Clock/Clock?time=1725806224"
						console.log('提取到的页面路径:', pagesPath);
			          // 执行页面跳转
			          uni.navigateTo({
			            url: pagesPath // 跳转到指定页面并带上参数
			          });
			        } else {
			          console.warn('未能解析到有效的页面路径');
			        }
			      } else {
			        // 处理非 URL 的结果
			        console.warn('扫码结果不是有效的链接:', scannedUrl);
			      }
			    },
			    fail: function (error) {
			      console.error('扫码失败:', error);
			    }
			  });
			}
		}
	}
</script>

<style>
	.Notice view{
		font-size: 25rpx;
		font-weight: bold;
		background-color: white;
		/* display: inline; */
	}
	.one,.two,.three,.four{
		text-indent: 30rpx;
	}
	.me-container {
		position: relative;
		width: 100%;
		height: 200vh;
		box-sizing: border-box;
		padding: 0rpx 50rpx 00rpx 50rpx;
		color: white;
		z-index: 1;
		background-color: #d1d1d1;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		color: black;
	}

	.title {
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 34rpx;
		/* margin-top: 30rpx; */
		margin-bottom: 30rpx;
		/* background-color: aqua; */
	}
	.fixd{
		height: 100rpx;
		width: 80%;
		color: white;
		font-size: 30rpx;
		position: relative;
		top: 30rpx;
		left: 50%; /* 使元素相对于视口宽度居中 */
		transform: translateX(-50%); /* 将元素向左移动一半的自身宽度，实现居中对齐 */
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #007aff;
		border-radius: 20rpx;
	}
	.luokuan{
		margin-top: 20rpx;
		text-align: right;
		font-size: 25rpx;
		font-weight: bold;
	}
</style>