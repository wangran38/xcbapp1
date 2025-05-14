<template>
	<view class="bigBox">
		<view class="title">
			请选择方式
		</view>
		<view style="display: flex; margin: 30rpx; justify-content: center; justify-content: space-around;">
			<view v-for="(item,index) in typeList" class="typeItem" @click="selectItem(item,index)"
				:style="[item.active?{background:'linear-gradient(135deg, #2d8cf0, #53a1f3)',color:'white'}:{}]">
				{{item.name}}
			</view>
		</view>

		<one-vue v-show="selectIndex == 0" @open="Open" ref="oneRef"></one-vue>
		<two-vue v-show="selectIndex == 1" @open="Open" ref="twoRef"></two-vue>
		<three-vue v-show="selectIndex == 2" @open="Open" ref="threeRef"></three-vue>
		<describe-vue :show="show" :content="content" @agree="agree" @disagree="disagree"></describe-vue>
	</view>
</template>


<style>
	.typeItem {
		width: 120rpx;
		height: 120rpx;
		font-size: 30rpx;
		background-color: white;
		text-align: center;
		line-height: 120rpx;
		border-radius: 20rpx;
		border: 1rpx solid gray;
		box-shadow: 10px 10px 10px -4px rgba(128, 128, 128, 0.5);
	}

	.title {
		margin: 10rpx;
		border-radius: 20rpx 200rpx;
		padding: 30rpx;
		font-size: 35rpx;
		font-weight: bold;
		color: white;
		background: linear-gradient(135deg, #ff6a00, #ff8229);
	}

	.bigBox {
		/* height: 100vh; */
	}
</style>


<script>
	import {
		myMixin
	} from '@/utils/public.js'
	import oneVue from './componment/one.vue'
	import twoVue from './componment/two.vue'
	import threeVue from './componment/three.vue'
	import describeVue from './componment/describe.vue'
	import {
		api
	} from '@/api/index.js'
	export default {
		mixins: [myMixin],
		components: {
			oneVue,
			twoVue,
			threeVue,
			describeVue
		},
		data() {
			return {
				show: false,
				content: `
				第一
				第二
				第三
				第四
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				第五
				`,
				selectIndex: 0,
				typeList: [{
						id: 1,
						name: '自销',
						active: true,
						refName: 'oneRef'
					},
					{
						id: 2,
						name: '提货点',
						active: false,
						refName: 'twoRef'
					},
					{
						id: 2,
						name: '批发',
						active: false,
						refName: 'threeRef'
					}
				],
				dishId: null
			}

		},
		// 加载菜品id
		onLoad({
			pramas
		}) {
			this.dishId = JSON.parse(pramas).id
		},
		methods: {

			/**
			 * 
			 * @description 自定义事件回调函数,启动窗口
			 */
			Open(value) {
				this.show = true
			},
			Close() {
				this.show = false
			},

			/**
			 * @param formData
			 */
			agree(formData) {
				// 同意之后的回调函数，父组件需要主动拿去子组件的数据
				uni.showToast({
					icon: 'loading',
					title: '正在处理......'
				})
				this.typeList.filter(item => {
					setTimeout(async () => {
						if (item.active) {
							// 获取子组件的formData数据集合
							let formData = this.$refs[item.refName].formData
							formData.farmersgoods_id = this.dishId
							formData.market_id = this.$refs[item.refName]['marketIdMap'][this.$refs[
								item.refName].marketList[this.$refs[item.refName]
								.selectedMarketIndex]]
							formData.area_id = this.$refs[item.refName]['area_id']
							
							formData = {...formData,isshow:2,ispresale:2}
							console.log(formData)
							let res = await api.foodOnSale(formData)
							if (res.code == 200) {
								uni.showToast({
									icon: 'success',
									title: '提交成功'
								})
								setTimeout(()=>{
									this.customizeBack()
								},1000)
							}else{
								setTimeout(()=>{
									uni.showToast({
										icon: 'error',
										title: '提交异常！！！！'
									})
								},1000)
								
							}
						}
					}, 1000)

				})
				this.Close()
			},
			// 不同意
			disagree() {
				this.Close()
			},
			selectItem(item, index) {
				this.typeList.filter(item => {
					item.active = false
				})
				this.selectIndex = index
				item.active = true
			}
		}
	}
</script>