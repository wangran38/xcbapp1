<template>
	<view class="bigBox">
		<view class="title">
			添加银行卡
		</view>
		<view class="card">
			<view class="item-info">
				<view class="name">
					<label>账号名称:</label>
					<input v-model="info.bankusername" type="text" placeholder="请填写账号名称" />
				</view>
				<view class="name">
					<label>开户银行:</label>
					<input v-model="info.bankname" type="text" placeholder="请填写开户银行" />
				</view>

				<view class="name">
					<label>银行地址:</label>
					<input v-model="info.bankaddress" type="text" placeholder="请填写银行地址" />
				</view>
				<view class="cardnum">
					<label>银行卡号:</label>
					<input v-model.number="info.banknumber" type="text" placeholder="请填写银行卡号" />
				</view>

				<view class="cardnum">
					<label>默认账户:</label>
					<view>
						<radio-group :value="info.isuse" @change="changeValue">
							<radio value="2" checked="true" />是
							<radio value="1" />否
						</radio-group>
					</view>
				</view>
			</view>

			<button type="primary" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import {api} from '../../api/index.js'
	export default {
		data() {
			return {
				// 银行卡信息
				info: {
					bankusername: '', // 开户人 
					banknumber: '', // 卡号
					bankname: '', // 开户行
					bankaddress: '', // 开户行地址
					isuse:2,
				},
			}
		},
		methods: {
			changeValue(val){
				this.info.isuse = parseInt(val.detail.value)
			},
			async submit(){
				// 校验银行卡信息
				if (this.info.bankname && this.info.bankusername && this.info.bankaddress && (this.info.banknumber.toString().length==19)){
					let {data} = await api.addbank(this.info)
					if(data.code == 200){
						uni.showToast({
							title:'添加成功',
							icon:'success'
						})
					}
				}else{
					uni.showToast({
						title:'填写信息有误',
						icon:'error'
					})
				}

			}
		}
	}
</script>

<style>
	radio{
		margin-left: 30rpx;
	}
	.bigBox {
		padding: 10rpx 10rpx 0 10rpx;
	}

	.title {
		padding-top: 10rpx;
		text-align: center;
		font-size: 40rpx;
	}

	.card {
		margin: 20rpx 5rpx 5rpx 5rpx;
		height: 550rpx;
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		padding: 20px;
		color: black;
		font-family: Arial, sans-serif;
	}

	.name,
	.phone,
	.cardnum {
		padding: 10rpx 10rpx 10rpx 3rpx;
		display: flex;
		font-size: 35rpx;
		font-weight: bold;
		text-align: left;
	}


	input {
		font-size: 35rpx;
	}

	label {
		display: inline-block;
		width: 250rpx;
		text-align: justify;
		text-align-last: justify;
		margin-right: 10px;
	}

	button {
		margin-top: 20rpx;
		font-size: 35rpx;
	}
</style>