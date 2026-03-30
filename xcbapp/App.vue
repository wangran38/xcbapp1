<script>
	import {api} from '@/api/index.js'
	import {saveLog} from '@/utils/log.js'
	import Vue from 'vue'

	export default {
		data() {
			return {
				jpushModule: null,
				registrationID: '',
				connectStatus: '未连接',
				isPrivacyAgreed: false
			};
		},

		onLaunch() {
			this.isPrivacyAgreed = uni.getStorageSync('isPrivacyAgreed') || false;

			uni.$globalMethods = {
				getRegistrationID: () => this.getRegistrationID()
			}

			try {
				const main = plus.android.runtimeMainActivity();
				const context = main;
				plus.android.importClass(context);
				const resources = context.getResources();
				plus.android.importClass(resources);
				const packageName = context.getPackageName();
				const resId = plus.android.invoke(resources, 'getIdentifier', 'custom_ringtone', 'raw', packageName);
				saveLog('铃声资源 ID = ' + resId);
			} catch (e) {
				saveLog('❌ 错误：' + e);
			}

			// #ifdef APP-PLUS
			if (!this.isPrivacyAgreed) {
				this.showPrivacyDialog();
			} else {
				this.initJPush();
				this.createCustomRingtoneChannel();
			}
			// #endif
		},

		methods: {
			// ====================
			// 真正正确的隐私弹窗
			// ====================
			showPrivacyDialog() {
				uni.showModal({
					title: "隐私政策提示",
					content: "欢迎使用农链天下！我们将严格保护您的个人信息，未经允许不会收集AndroidID、OAID、设备信息、位置等数据。请阅读并同意隐私政策后使用。",
					confirmText: "去阅读",
					cancelText: "拒绝退出",
					maskClick: false,
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: "/pages/privacyAgreement/privacyAgreement"
							});
							this.waitForBack();
						} else {
							plus.runtime.quit();
						}
					}
				});
			},

			// 监听返回动作
			waitForBack() {
				console.log("执行了")
				const oldLen = getCurrentPages().length;
				const timer = setInterval(() => {
					const nowLen = getCurrentPages().length;
					if (nowLen < oldLen) {
						clearInterval(timer);
						this.askAgree();
					}
				}, 300);
			},

			// 返回后弹出
			askAgree() {
				uni.showModal({
					title: "确认同意",
					content: "您已阅读完毕，是否同意《隐私政策》",
					confirmText: "同意",
					cancelText: "拒绝退出",
					maskClick: false,
					success: (res) => {
						if (res.confirm) {
							this.userAgreePrivacy();
						} else {
							plus.runtime.quit();
						}
					}
				});
			},

			// 同意后初始化
			userAgreePrivacy() {
				this.isPrivacyAgreed = true;
				uni.setStorageSync('isPrivacyAgreed', true);
				// #ifdef APP-PLUS
				this.initJPush();
				this.createCustomRingtoneChannel();
				// #endif
			},

			// ====================
			// 以下全部不变
			// ====================
			initJPush() {
				try {
					if (!this.isPrivacyAgreed) return;

					saveLog('开始初始化 JPush...');
					this.jpushModule = uni.requireNativePlugin('JG-JPush');
					if (!this.jpushModule) {
						saveLog('[错误] JPush 初始化失败');
						return;
					}

					if (this.jpushModule.setPrivacyAuthorization) {
						this.jpushModule.setPrivacyAuthorization(true);
					}

					this.jpushModule.initJPushService();
					saveLog('✅ JPush 服务已初始化');

					this.jpushModule.addConnectEventListener(result => {
						this.connectStatus = result.connectEnable ? '已连接' : '未连接';
						if (this.connectStatus === '已连接') {
							this.getRegistrationID();
						}
					});

					this.jpushModule.addNotificationListener(result => {
						saveLog('📥 收到通知');
					});

					this.checkNotificationPermission();
				} catch (e) {
					saveLog(`[错误] JPush 初始化异常: ${e.message}`);
				}
			},

			createCustomRingtoneChannel() {
				try {
					const main = plus.android.runtimeMainActivity();
					const AndroidVersion = plus.android.importClass('android.os.Build');
					if (AndroidVersion.SDK_INT < 26) return;

					const NotificationManager = plus.android.importClass('android.app.NotificationManager');
					const NotificationChannel = plus.android.importClass('android.app.NotificationChannel');
					const Uri = plus.android.importClass('android.net.Uri');
					const AudioAttributes = plus.android.importClass('android.media.AudioAttributes');
					const RingtoneManager = plus.android.importClass('android.media.RingtoneManager');

					const manager = main.getSystemService(main.NOTIFICATION_SERVICE);
					const packageName = main.getPackageName();
					const res = main.getResources();
					const channelId = "custom_ringtone";
					const ringtoneResId = res.getIdentifier("custom_ringtone", "raw", packageName);
					const ringtoneUri = Uri.parse(`android.resource://${packageName}/${ringtoneResId}`);
					let channel = manager.getNotificationChannel(channelId);

					if (!channel) {
						const audioAttr = new AudioAttributes.Builder()
							.setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
							.setUsage(AudioAttributes.USAGE_NOTIFICATION)
							.build();

						channel = new NotificationChannel(channelId, "订单语音通知", NotificationManager.IMPORTANCE_HIGH);
						channel.setDescription("播放自定义通知铃声");
						channel.enableLights(true);
						channel.enableVibration(true);
						channel.setSound(ringtoneUri, audioAttr);
						manager.createNotificationChannel(channel);
					}
				} catch (e) {}
			},

			getRegistrationID() {
				if (!this.jpushModule || !this.isPrivacyAgreed) return;
				this.jpushModule.getRegistrationID(result => {
					if (result.registerID) {
						this.registrationID = result.registerID;
						uni.setStorageSync('registerID', this.registrationID);
					}
				});
			},

			checkNotificationPermission() {
				const main = plus.android.runtimeMainActivity();
				const NotificationManager = plus.android.importClass('android.app.NotificationManager');
				const nm = main.getSystemService(main.NOTIFICATION_SERVICE);
			},

			openNotificationSettings() {
				const main = plus.android.runtimeMainActivity();
				const Intent = plus.android.importClass('android.content.Intent');
				const Build = plus.android.importClass('android.os.Build');
				const Settings = plus.android.importClass('android.provider.Settings');
				const Uri = plus.android.importClass('android.net.Uri');

				try {
					const intent = new Intent();
					if (Build.VERSION.SDK_INT >= 26) {
						intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
						intent.putExtra(Settings.EXTRA_APP_PACKAGE, main.getPackageName());
					} else if (Build.VERSION.SDK_INT >= 21) {
						intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
						intent.putExtra("app_package", main.getPackageName());
						intent.putExtra("app_uid", main.getApplicationInfo().uid);
					} else {
						intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
						intent.setData(Uri.parse('package:' + main.getPackageName()));
					}
					main.startActivity(intent);
				} catch (e) {
					const intent = new Intent(Settings.ACTION_SETTINGS);
					main.startActivity(intent);
				}
			}
		},

		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	@import "@/static/iconfont.css";
	page {
		background-color: #f5f5f5;
		position: relative;
		top: var(--status-bar-height);
	}
	/* #endif */

	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
	::-webkit-scrollbar {
		width: 0 !important;
		height: 0;
	}
</style>