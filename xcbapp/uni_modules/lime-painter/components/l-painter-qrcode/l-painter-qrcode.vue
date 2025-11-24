<template>
	<image :src="src" style="position: absolute; top: 180rpx; right: 50rpx; width: 180rpx;height: 180rpx; z-index: 9999;"></image>
</template>

<script>
	import {parent, children} from '../common/relation';
	export default {
		name: 'lime-painter-qrcode',
		mixins:[children('painter')],
		props: {
			id: String,
			css: [String, Object],
			text: String,
			src:String
		},
		onLoad() {
			conosle.log(1111)
		},
		data() {
			return {
				type: 'qrcode',
				el: {
					css: {},
					text: null
				},
			}
		}
	}
</script>

<style>
</style>
