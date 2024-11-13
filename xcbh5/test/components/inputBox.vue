<template>
	<view class="bigBox" @click="close">
		<view class="body" v-show="show" @click.stop="">
			<view class="value">
				{{value}}
			</view>
			<view class="function" >
				<view class="nums">
					<view class="num" v-for="item in keys" :key="item"  @click.stop="item != '取消' ? inputNum(item): func(item)">
						{{item}}
					</view>
				</view>
				<view class="funs">
					<view class="fun" v-for="item in funs"  @click.stop="func(item)">
						{{item}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"inputBox",
		data() {
			return {
				show:true,
				value:'请输入',
				keys:
				  [
				  '1', '2', '3',
				  '4', '5', '6', 
				  '7', '8', '9',
				  '0','.','取消'
				],
				funs:[
					'删除',
					'清空',
					'确定',
				],
				lock:true  // 键盘锁
			};
		},
		watch:{
			value(newValue,oldValue){
				// 检测到小数点开头自动补0
				if (newValue[0] == '.'){
					this.value = '0'+ this.value
				}
				let pub = newValue.split('.')
				// 检查是否出现多个小数点,出现则限制输入
				if (newValue.split('.').length-1>1){
					this.value = oldValue
				}
				// 检查开头不能出现两个00
				if (newValue == '00'){
					this.value = oldValue
				}
				// 限制小数点后只能出现一位
				try{
					if (newValue.split('.')[1].length>=2){
						this.value = oldValue
					}
				}
				catch{
					console.log('拦截')
				}

			}
		},
		methods:{
			// 收起键盘
			close(){
				this.show = false
			},
			// 数字
			inputNum(num){
				if (this.lock){
					this.value = num
					this.lock = false
				}else{
					this.value+=num
				}
				
			},
			// 功能函数
			func(lable){
				console.log(lable)
				switch (lable){
					case '删除':
						this.remove()
						break
					case '取消':
						this.close()
						break
					case '清空':
						this.clear()
						break
					case '确定':
						// 确定值之前，需要检测是否为正常数字， 和转换为数字类型
						break
				}
			},
			remove(){
				this.value = this.value.substring(0,this.value.length-1)
			},
			clear(){
				this.value = ''
			}
		}
	}
</script>

<style>
.bigBox{
	width: 100%;
	height: 100%;
	background-color: gray;
	position: absolute;
	transition: opacity .5s;
}
.body{
	background-color: white;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}
.function{
	font-size: 30rpx;
	display: flex;
	padding: 10rpx;
	background-color: gainsboro;
}
.value{
	text-align: center;
	line-height: 80rpx;
	font-size: 30rpx;
	height: 80rpx;
}
.nums{
	width: 600rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	
}
.num{
	margin: 5rpx;
	flex: 1;
	width: calc((100% - 10px) / 2);
	min-width: calc((100% - 10px) / 4);
	max-width: calc((100% - 10px) / 3);
	border-radius: 10rpx;
	text-align: center;
	height: 90rpx;
	line-height: 90rpx;
	background-color: white;
}
.fun{
	border-radius: 5rpx;
	margin: 5rpx;
	text-align: center;
	line-height: 120rpx;
	width: 180rpx;
	height: 125rpx;
	background-color: #b9bcc4;
}
.num:active{
	background-color: gray;
}
.fun:active{
	background-color: white;
}
</style>