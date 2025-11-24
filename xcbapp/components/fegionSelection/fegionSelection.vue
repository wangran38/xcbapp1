<template>
	<view>
		<picker mode="multiSelector"  :value="areaIndex" :range="areaData" @columnchange="bindPickerChange">
			<view class="uni-input">{{areaData[0]}}-{{areaData[1][areaIndex[1]]}}-{{areaData[2][areaIndex[2]]}}</view>
		</picker>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js'
	export default {
		name: "fegionSelection",
		data() {
			return {
				areaData:[
					[],
					[],
					[]
				],
				areaIndex:[
					0,0,0
				],
				provinceList:[],
				cityLevelList:[]
			};
		},
			
		mounted(){
			this.initPicker()
		},
		methods:{
			bindPickerChange({detail}){
				switch (detail.column){
					case 0:
						 //省级切换
						// console.log(this.provinceList[detail.value])
						// console.log(this.provinceList[detail.value].id)
						console.log(this.provinceList[detail.value],'索引')
						this.getCitytreeData(this.provinceList[detail.value].id)
						break
				}
				// console.log(detail)
			},
			async getCitytreeData(pid){
				let res =  await api.citytree(pid)
				if (res.code  == 200){
					this.cityLevelList = res.data
					this.areaData[1] = this.cityLevelList.map(item=>item.name)

				}
				// console.log(res)
			},
			async initPicker(){
				
				try {
					const response = await api.citylist({
						level: 1,
						limit: 100
					});
					if (response.code === 200) {
						this.provinceList = response.data.listdata;
						this.areaData[0] = this.provinceList.map(item=>item.shortname)
						return this.provinceList;
					}
					throw new Error('Failed to fetch provinces');
				} catch (error) {
					console.error('Failed to fetch provinces:', error);
					throw error;
				}
				
			},

		}
	}
</script>

<style>

</style>