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
					<!-- <uni-easyinput :value="info.banknumber" type="number" placeholder="请填写银行卡号"></uni-easyinput> -->
					<input v-model="info.banknumber" type="text" placeholder="请填写银行卡号" @input="settleCardChange" />
				</view>

				<view class="cardnum">
					<label>默认账户:</label>
					<view>
						<radio-group :value="info.isuse" @change="changeValue">
							<radio value="2"  />是
							<radio value="1"  checked="true"/>否
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
					isuse:1,
				},
			}
		},
		onShow() {
			if (this.checkToken()){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
		},
		methods: {
			// 检查是否token存在，存在则已登陆
			checkToken() {
				const token = uni.getStorageSync('token');
				if (!token){
					return true
				}
				return false
			},
			copyObj(obj){
						let newObj={};
						for(let key in obj){
							if(typeof obj[key] =='object'){//如:key是wife,引用类型,那就递归
								newObj[key] = copyObj(obj[key])
							}else{//基本类型,直接赋值
								newObj[key] = obj[key];
							}
						}
						return newObj;
						
			},
			isNumber(str) {
			    return !isNaN(str) && !isNaN(parseFloat(str));
			},
			settleCardChange(val){
				// if (val.detail.value && this.isNumber(val)){
				// 	this.info.banknumber = parseInt(val.detail.value);
				// }
				
			},
			changeValue(val){
				this.info.isuse = parseInt(val.detail.value)
			},
			async submit(){
				// console.log(this.info)
				// 校验银行卡信息
				if (this.info.bankname && this.info.bankusername && this.info.bankaddress && (this.info.banknumber.toString().length==19 && this.isNumber(this.info.banknumber))){
					let copyObj = this.copyObj(this.info)
					copyObj.banknumber = String(BigInt(copyObj.banknumber))
					let data = await api.addbank(copyObj)
					if(data.code == 200){
						uni.showToast({
							title:'添加成功',
							icon:'success'
						})
					}else{
						uni.showToast({
							title:data.msg,
							icon:'error'
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