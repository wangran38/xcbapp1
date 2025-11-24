<template>
	<view style="width: 100%; height: 100vh;">
		<map style="width: 100%;  height: 100vh;"  :markers="markers" :latitude="location.latitude" :longitude="location.longitude" :callout="{content:'111'}"></map>
	</view>
</template>

<script>
	import {
		api
	} from '@/api/index.js';
	export default {
		data() {
			return {
				markers:[],
				location: {
					latitude: null,
					longitude: null,
				},
				formdata:{
					page:1,
					limit:1000
				}
			}
		},
		onLoad(options) {
			// api.addressResolution({
			// 	address: '海南省琼海市会山镇大缴村'
			// }).then(data => {
			// 	console.log(data)
			// })
			uni.getLocation({
				altitude: true,
				isHighAccuracy: true,
				highAccuracy: true,
				type: 'gcj02',
				success:(res)=> {
					this.location.longitude = res.longitude
					// 确保能看到标记点
					this.location.latitude = res.latitude
					
					this.mapKey = true
					
					console.log(this.location)
					this.markers.push({id:1,label:{content:'当前位置',fontSize:25},longitude:this.location.longitude,latitude:this.location.latitude,iconPath:'../../../static/selectlocation.png',width:30,height:30})
					// console.log(this.markers)
					this.getData()
				},
				fail(e) {
					console.log(e)
				}
			})
		},
		methods: {
			async getData() {
				let data = await api.farmersList(this.formdata)
				if (data.code = 200) {
					let dataArray = data.data.listdata.map((item,index)=>{
						return {id:index+2,longitude:item.lng,latitude:item.lat,iconPath:'../../../static/selectlocation.png',width:30,height:30,label:{content:item.farmersname,fontSize:25}}
					})
					this.markers = [...this.markers,...dataArray]
				}
			},
		}
	}
</script>

<style>

</style>
