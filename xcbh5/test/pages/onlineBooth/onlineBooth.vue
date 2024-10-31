<template>
	<view class="bixBox">
		<view class="title">
			轻松三步，成为农户
		</view>
		<uni-steps :options="options" :active="active" class="steps"></uni-steps>
		<view class="one" v-show="active == 0">
			<view class="tip">
				建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议
			</view>
			<view class="info">
				<view class="input">
					<view class="label">
						给你的摊位起个名字吧
					</view>
					<uni-easyinput class="uni-easyinput" placeholder="请输入摊位名称"></uni-easyinput>
				</view>
			</view>
		</view>
		
		
		<view class="two" v-show="active == 1">
			<view class="tip">
				建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议
			</view>
			<view class="title" style="text-align: left; color: black; font-weight: 100;">
				店主身份
			</view>
			<view class="form">
				<view class="card">
					<view class="label">
						真实姓名
					</view>
					<input type="text" placeholder="请输入真实姓名"/>
				</view>
				<view class="hr">
				</view>
				<view class="card">
					<view class="label">
						身份证号
					</view>
					<input type="text" placeholder="请输入身份证号">
				</view>
			</view>
		</view>
		
		<view class="three" v-show="active == 2">
			<view class="tip">
				建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议建议
			</view>
			<view class="title" style="text-align: left; color: black; font-weight: 100;">
				领取福利
			</view>
			
		</view>
		<button class="btn" @click="next">下一步</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options:[{title: '创建摊位'}, {title: '用户信息'}, {title: '领取福利'}],
				active:0
			}
		},
		methods: {
			next(){
				this.active+=1
			}
		}
	}
</script>

<style scoped>
	.bixBox{
		padding: 20rpx 20rpx 20rpx 20rpx;
		text-align: center;
	}
	.title{
		font-weight: 700;
		font-size: 30rpx;
		color: limegreen;
	}
	.steps{
		margin-top: 20rpx;
	}
	.tip{
/* 		text-indent: 30rpx; */
		font-weight: 800;
		text-align: left;
		margin: 20rpx 0 20rpx 0;
		height: 200rpx;
		border-radius: 10rpx;
		background-color: white;
	}
	.info{
		margin-top: 30rpx;
	}
	
	.label{
		font-weight: 300;
		font-size: 25rpx;
		margin-bottom: 20rpx;
	}
	.btn{
		background-color: lightgreen;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.uni-easyinput{
		height: 500rpx;
	}
	.hr{
		background-color: #e8e8e8;
		height: 1rpx;
		
	}
	
	.form{
		background-color: white;
		position: relative;
		text-align: left;
		line-height: 30rpx;
		border: 1rpx solid #e8e8e8;
		padding: 20rpx 0rpx 20rpx 0rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
	}
	.form input{
		position: absolute;
		left: 150rpx;
		font-size: 30rpx;
	}
	.form .label{
		line-height: 40rpx;
		font-size: 30rpx;
		font-weight: 600;
	}
	.form .card{
		padding: 10rpx 10rpx 10rpx 10rpx;
		display: flex;
	}

</style>
