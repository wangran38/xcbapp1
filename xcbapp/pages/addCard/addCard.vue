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
			// 返回上一页
			 async customizeBack(){  
			  let canNavBack = await getCurrentPages()
			  if( canNavBack && canNavBack.length>1) {  
			      uni.navigateBack() 
			  } else {  
			      history.back();  
			  }
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
						this.customizeBack()
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
/* 添加银行卡页面样式 */
.bigBox {
  padding: 32rpx;
  background: #f8f9fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.title {
  font-size: 40rpx;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
  padding: 48rpx 0;
  position: relative;
}

.title::after {
  content: "";
  position: absolute;
  bottom: 32rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 8rpx;
  background: #4a90e2;
  border-radius: 8rpx;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(28, 55, 99, 0.06);
}

.item-info > view {
  margin-bottom: 48rpx;
  border-bottom: 2rpx solid #f0f3fa;
  padding-bottom: 24rpx;
}

.name label, 
.cardnum label {
  width: 200rpx;
  flex-shrink: 0;
  font-size: 28rpx;
  color: #666;
  padding-right: 32rpx;
}

input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  padding: 24rpx 0;
  min-height: 96rpx;
}

radio-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

radio {
  /* margin: 16rpx 48rpx 16rpx 0; */
  transform: scale(0.9);
}

radio .wx-radio-input {
  width: 40rpx !important;
  height: 40rpx !important;
  border-color: #c0c4cc !important;
}

radio .wx-radio-input.wx-radio-input-checked {
  background: #4a90e2 !important;
  border-color: #4a90e2 !important;
}

button[type=primary] {
  background: linear-gradient(135deg, #4a90e2, #6ca3f0);
  border-radius: 16rpx;
  font-size: 32rpx;
  height: auto;
  line-height: 1.5;
  padding: 28rpx;
  margin-top: 64rpx;
  transition: all 0.2s;
}

button[type=primary]:active {
  opacity: 0.9;
  transform: translateY(2rpx);
}

/* 输入框聚焦效果 */
input:focus {
  border-bottom-color: #4a90e2;
  caret-color: #4a90e2;
}

/* 错误提示适配 */
uni-toast {
  z-index: 9999 !important;
}
</style>
