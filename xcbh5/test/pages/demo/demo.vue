<template>
	<view>
		<button @click="openMessage">订阅消息</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			openMessage() {
				uni.requestSubscribeMessage({
					tmplIds: ['PN8Vc4Z5rWUHi05A6F-J73TkkpF4iHxkEtA6bIoFUPw'],
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
					},
				})
				
			}

		}
	}
</script>