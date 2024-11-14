<template>
	<view class="container">
		<view class="header">登录</view>
		<view class="yanz">
			<uni-forms ref="form" :modelValue="form" :rules="rules" class="form">
				<uni-forms-item name="username">
					<uni-easyinput v-model="form.username" prefixIcon="person" placeholder="请输入手机号码"></uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="password">
					<uni-easyinput v-model="form.password" type="password" prefixIcon="locked"
						placeholder="请输入密码"></uni-easyinput>
				</uni-forms-item>
			</uni-forms>
		</view>

		<view class="button-group">
			<button class="login-button" @click="login">登录</button>
		</view>

		<view class="bottom">
			<navigator url="/pages/register/register" style="margin: 30rpx 0;color: deepskyblue;">前往注册</navigator>
			<navigator url="/pages/updatePwd/updatePwd" style="margin: 30rpx 0;color: deepskyblue;">忘记了密码?</navigator>
		</view>

	</view>
</template>

<script>
	import uniForms from '@dcloudio/uni-ui/lib/uni-forms/uni-forms.vue';
	import uniFormsItem from '@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.vue';
	import uniEasyinput from '@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.vue';
	import {
		api
	} from '../../api/index.js'; // 确保路径正确

	export default {
		components: {
			uniForms,
			uniFormsItem,
			uniEasyinput
		},
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: {
						rules: [{
								required: true,
								errorMessage: '请输入手机号码'
							},
							{
								minLength: 11,
								maxLength: 11,
								errorMessage: '手机号码长度应为11位'
							},
							{
								pattern: "^1[3-9]\\d{9}$",
								errorMessage: '请输入有效的手机号码'
							}
						]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: '请输入密码'
						}]
					}
				}
			};
		},
		onLoad() {
			console.log("%c小伙子我看你天赋异禀，快来加入我们吧 17788430977@qq.com投递你的简历", "color: green; font-bold: 600; font-size: 16px;")
		},
		methods: {
			async login() {
				try {
					const valid = await this.$refs.form.validate(); // 等待验证完成
					console.log('表单数据信息：', valid);

					const response = await api.login(this.form.username, this.form.password);
					if (response.code === 200) {
						const token = response.data.token;
						// 保存token
						uni.setStorageSync('token', token);
						uni.switchTab({
							url: '/pages/index/index'
						});
					} else {
						uni.showToast({
							title: response.msg || response.messagex,
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '登录请求失败',
						icon: 'none'
					});
					console.error('Login error:', error);
				}
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40rpx;
	}

	.form {
		width: 100%;
		margin-bottom: 40rpx;
	}

	.yanz {
		width: 90%;
		/* background-color: #007aff; */
	}

	.header {
		font-size: 48rpx;
		margin-bottom: 40rpx;
		text-align: center;
	}

	.input-group {
		width: 100%;
		margin-bottom: 40rpx;
		display: flex;
		justify-content: center;
	}

	.button-group {
		width: 90%;
		text-align: center;
	}

	.login-button {
		width: 100%;
		padding: 10rpx;
		background-color: #007aff;
		color: white;
		font-size: 28rpx;
		border: none;
		border-radius: 10rpx;
		cursor: pointer;
	}

	.login-button:active {
		background-color: darkblue;
	}

	.login-wxbutton {
		width: 90%;
		padding: 10rpx;
		background-color: blue;
		color: white;
		font-size: 28rpx;
		border: none;
		border-radius: 10rpx;
		cursor: pointer;
	}

	.bottom {
		font-size: 30rpx;
		width: 350rpx;
		display: flex;
		justify-content: space-between;
	}
</style>