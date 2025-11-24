<template>
	<view class="content">
		<text style="font-size: 25rpx; font-weight: bold;">发布时间:{{initTime(createtime)}}</text>
		<!-- <u-parse :content="detailData" /> -->
	</view>
</template>

<script>
	// import uParse from '@/components/gaoyia-parse/parse.vue'
	import {
		myMixin
	} from '@/utils/public.js'
	export default {
		mixins: [myMixin],
		// components:{
		// 	uParse
		// },
		data() {
			return {
				createtime:'',
				detailData: '正在加载中....',
			}
		},
		onLoad({content,createtime}){
			this.createtime = createtime
			/*#ifdef H5*/
			  // 在浏览器端（H5）执行的逻辑
			  this.detailData = content
			/*#endif*/
			
			/*#ifdef MP-WEIXIN*/
			  // 微信小程序端执行的逻辑
			  this.detailData = decodeURIComponent(content)
			/*#endif*/	
			
		},
		methods:{
			
			/**
			 * 去除字符串中的所有空白字符
			 * @param {string} str - 原始字符串
			 * @returns {string} 无空白字符的字符串
			 */
			removeAllSpaces(str) {
			  return String(str).replace(/\s+/g, '');
			}
		}
	}
</script>

<style>
.content {
		padding: 30rpx;
		/* 在这里调整，整体字体大小 */
		font-size: 35upx;
	}
</style>
