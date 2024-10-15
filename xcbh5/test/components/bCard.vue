<template>
	<view>
		<view class="card" >
			<view class="card-title">{{info.bankname}}</view>
			<view class="num">
				<view>{{info.banknumber}}</view>
			</view>
			<uni-tag text="默认" type="success"  class="tag" v-show="info.isuse" inverted="true"/>
			<view class="edit">
				<uni-icons type="more-filled" size="20" @click.native.stop="onLift"></uni-icons>
			</view>
			<transition name="fade">
				<view class="lift" v-show="moreStatus" @click.native.stop="unbind">
					解除绑定
				</view>
			</transition>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"bCard",
		data() {
			return {
				moreStatus: false, // 控制解除绑定按钮是否显示
			}
		},
		props:['info'],
		methods:{
			// 打开解除绑定
			onLift() {
				this.moreStatus = !this.moreStatus
			},
			
			// 解除绑定
			unbind(){
				uni.showModal({
					title:"真的要解除绑定吗??",
					cancelText:'否',
					confirmText:'是',
					success:(res)=>{
						if (res.confirm){
							// 发送解绑接口
						}else{
							this.moreStatus = false
						}
					},
				})
			}
		}
	}
</script>

<style>
	.tag{
		position: absolute;
		bottom: 10rpx;
	}
	.card {
		background-color: indianred;
		margin: 10rpx 10rpx 10rpx 0;
		height: 100rpx;
		border-radius: 15px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		display: flex;
		padding: 20px;
		color: white;
		font-family: Arial, sans-serif;
		position: relative;
	}

	.card-icon image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.card-title {
		font-size: 35rpx;
		margin: 3rpx 0 0 10rpx;
		flex: 1;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	.edit {
		right: 30rpx;
		top: 110rpx;
		position: absolute;
	}

	.lift {
		position: absolute;
		color: black;
		right: 90rpx;
		top: 110rpx;
		background-color: white;
		border-radius: 15px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		padding: 10rpx;
		font-size: 26rpx;
	}


	.num {
		display: flex;
	}

	.num>view:first-child {
		margin-top: 5rpx;
		font-size: 30rpx;
		color: gainsboro;
	}

	.num>view:last-child {
		font-size: 30rpx;
		color: white;
	}

	.add {
		line-height: 18rpx;
		height: 20rpx;
		background-color: white;
		color: black;
		font-size: 20rpx;
		font-family: 'Courier New', Courier, monospace;
	}


	/* 过渡效果 */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>