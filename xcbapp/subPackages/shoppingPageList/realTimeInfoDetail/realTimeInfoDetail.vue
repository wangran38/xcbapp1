<template>
	<view class="content">
		<text style="font-size: 25rpx; font-weight: bold;">发布时间:{{initTime(createtime)}}</text>
		<uv-parse :content="detailData"></uv-parse>
	</view>
</template>

<script>
	import {
		myMixin
	} from '@/utils/public.js'
	export default {
		mixins: [myMixin],
		data() {
			return {
				createtime: '',
				detailData: '正在加载中....',
			}
		},
		onLoad({
			content,
			createtime
		}) {
			this.createtime = createtime
			this.detailData = decodeURIComponent(content)
		},
	}
</script>

<style>
	.content {
		padding: 30rpx;
		/* 在这里调整，整体字体大小 */
		font-size: 35upx;
	}
</style>