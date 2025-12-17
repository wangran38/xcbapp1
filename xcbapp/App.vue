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
			};
		},
		methods: {
			/** 初始化极光推送 */
			initJPush() {
				try {
					saveLog('开始初始化 JPush...');
					this.jpushModule = uni.requireNativePlugin('JG-JPush');
					if (!this.jpushModule) {
						saveLog('[错误] JPush 初始化失败：无法获取插件实例。');
						return;
					}
					this.jpushModule.initJPushService();
					saveLog('✅ JPush 服务已初始化。');

					this.jpushModule.addConnectEventListener(result => {
						this.connectStatus = result.connectEnable ? '已连接' : '未连接';
						saveLog(`📡 JPush 连接状态: ${this.connectStatus}`);
						if (this.connectStatus === '已连接') {
							this.getRegistrationID();
						}
					});

					this.jpushModule.addNotificationListener(result => {
						saveLog('📥 收到 JPush 通知:', result);
						// this.playLocalRingtone();
					});

					this.checkNotificationPermission();
				} catch (e) {
					saveLog(`[错误] JPush 初始化异常: ${e.message}`);
				}
			},

			/** 创建自定义铃声渠道 */
			createCustomRingtoneChannel() {
				try {
					saveLog("🚀 [铃声渠道] 函数已执行");

					const main = plus.android.runtimeMainActivity();
					const AndroidVersion = plus.android.importClass('android.os.Build');

					if (AndroidVersion.SDK_INT < 26) {
						saveLog("⚠️ [铃声渠道] Android < 8.0，不创建渠道");
						return;
					}

					const NotificationManager = plus.android.importClass('android.app.NotificationManager');
					const NotificationChannel = plus.android.importClass('android.app.NotificationChannel');
					const Uri = plus.android.importClass('android.net.Uri');
					const AudioAttributes = plus.android.importClass('android.media.AudioAttributes');
					const RingtoneManager = plus.android.importClass('android.media.RingtoneManager');

					const manager = main.getSystemService(main.NOTIFICATION_SERVICE);
					const packageName = main.getPackageName();
					const res = main.getResources();

					// ⚠ 每次升级都必须换新 ID，否则不会更新铃声
					const channelId = "custom_ringtone";
					const channelName = "订单语音通知";
					const channelDesc = "播放自定义通知铃声";

					// ⚠ 必须保证：raw/custom_ringtone.mp3 存在
					const ringtoneResId = res.getIdentifier("custom_ringtone", "raw", packageName);
					saveLog("🎵 [铃声渠道] 铃声资源 ID = " + ringtoneResId);

					if (ringtoneResId === 0) {
						saveLog("❌ [铃声渠道] 找不到自定义铃声，请检查路径：nativeResources/android/res/raw/custom_ringtone.mp3");
						return;
					}

					const ringtoneUri = Uri.parse(`android.resource://${packageName}/${ringtoneResId}`);
					saveLog("🔗 [铃声渠道] 铃声 URI = " + ringtoneUri.toString());

					try {
						const ringtone = RingtoneManager.getRingtone(main, ringtoneUri);
						saveLog("🎧 [铃声渠道] 系统解析铃声成功: " + ringtone.getTitle(main));
					} catch (e) {
						saveLog("⚠️ [铃声渠道] 系统解析铃声失败: " + e.message);
					}

					let channel = manager.getNotificationChannel(channelId);

					if (!channel) {
						saveLog("📢 [铃声渠道] 渠道不存在 → 开始创建");

						const audioAttr = new AudioAttributes.Builder()
							.setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
							.setUsage(AudioAttributes.USAGE_NOTIFICATION)
							.build();

						channel = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH);
						channel.setDescription(channelDesc);
						channel.enableLights(true);
						channel.enableVibration(true);
						channel.setSound(ringtoneUri, audioAttr);

						manager.createNotificationChannel(channel);
						saveLog("✅ [铃声渠道] 渠道创建完成");
					} else {
						saveLog("⚠️ [铃声渠道] 渠道已存在（不会更新铃声）。如需更新：卸载重装 App");
					}

					const created = manager.getNotificationChannel(channelId);
					saveLog("🔍 [铃声渠道] 最终渠道铃声 = " + created.getSound());
					saveLog("🔍 [铃声渠道] 重要性 = " + created.getImportance());

				} catch (e) {
					saveLog("❌ [铃声渠道] 异常：" + e.message);
				}
			},

			/** 获取 RegistrationID */
			getRegistrationID() {
				if (!this.jpushModule) return;
				this.jpushModule.getRegistrationID(result => {
					if (result.registerID) {
						this.registrationID = result.registerID;
						uni.setStorageSync('registerID', this.registrationID);
						saveLog(`✅ 获取 RegistrationID 成功: ${this.registrationID}`);
					} else {
						saveLog(`[错误] 获取 RegistrationID 失败: ${result.errMsg}`);
					}
				});
			},

			/** 检查通知权限 */
			checkNotificationPermission() {
				const main = plus.android.runtimeMainActivity();
				const NotificationManager = plus.android.importClass('android.app.NotificationManager');
				const nm = main.getSystemService(main.NOTIFICATION_SERVICE);
				if (plus.android.invoke(nm, 'areNotificationsEnabled')) {
					saveLog('🔔 通知权限已开启');
				} else {
					saveLog('⚠️ 通知权限未开启');
					this.noticMsgTool();
				}
			},

			/** 提示用户开启通知 */
			noticMsgTool() {
				uni.showModal({
					title: '通知权限提醒',
					content: '您还没有开启通知权限，无法接收消息，请前往设置！',
					showCancel: false,
					confirmText: '去设置',
					success: res => {
						if (res.confirm) {
							this.openNotificationSettings();
						}
					},
				});
			},

			/** 打开系统通知设置 */
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
					saveLog(`[错误] 打开通知设置失败: ${e.message}`);
					const intent = new Intent(Settings.ACTION_SETTINGS);
					main.startActivity(intent);
				}
			},
		},
		onLaunch() {
			// uni.showToast({
			// 	title:'2.3.0'
			// })
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

				const resId = plus.android.invoke(
					resources,
					'getIdentifier',
					'custom_ringtone',
					'raw',
					packageName
				);

				saveLog('铃声资源 ID = ' + resId);

				if (!resId) {
					saveLog('❌ 资源不存在，请检查是否正确放入 raw 目录');
				}
			} catch (e) {
				saveLog('❌ 错误：' + e);
			}

			// #ifdef APP-PLUS
			this.initJPush();
			this.createCustomRingtoneChannel();
			// #endif
		},


		onShow() {
			// #ifdef APP-PLUS
			if (this.jpushModule && !this.registrationID) {
				this.getRegistrationID();
			}
			// #endif
			// 开启线上调试
			// uni.setEnableDebug({
			//     enableDebug: false
			// })

			const options = {
				title: '开启消息通知',
				content: '开启后可及时收到重要通知，是否前往设置开启？',
				confirmText: '去设置',
				cancelText: '暂不开启',
				successToast: '通知权限已开启，感谢支持！',
				failToast: '您未开启通知权限，可能错过重要消息',
				successCallback: () => {},
				failCallback: () => {}
			}
			// #ifdef MP-WEIXIN
			uni.getSetting({
				withSubscriptions: true,
				success: (res) => {
					if (!res.subscriptionsSetting.mainSwitch) {
						// 显示订阅消息引导弹窗
						uni.showModal({
							title: options.title,
							content: options.content,
							confirmText: options.confirmText,
							cancelText: options.cancelText,
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({
										success: (settingRes) => {
											if (uni.getSystemInfoSync()
												.platform === 'wechat') {
												if (settingRes.authSetting[
														'scope.subscribeMessage'
													]) {
													uni.showToast({
														title: options
															.successToast,
														icon: 'success'
													})
													options.successCallback()
												} else {
													uni.showToast({
														title: options
															.failToast,
														icon: 'none'
													})
													options.failCallback()
												}
											}
										},
										fail: (err) => {
											console.error('打开设置失败', err)
											options.failCallback()
										}
									})
								} else {
									uni.showToast({
										title: '您可以随时在设置中开启通知',
										icon: 'none'
									})
									options.failCallback()
								}
							},
							fail: (err) => {
								console.error('显示弹窗失败', err)
								options.failCallback()
							}
						})


					} else {

					}
				},
				fail: (err) => {
					console.error('获取设置失败', err)
				}
			})
				
			// #endif
			
			
			
			
			// #ifdef MP-WEIXIN
			const updateManager = uni.getUpdateManager()
			// 请求完新版本信息的回调
			updateManager.onCheckForUpdate(res => {
				if (res.hasUpdate) {
					// 新版本下载成功
					updateManager.onUpdateReady(() => {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，点击确定重启小程序',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，强制更新
									updateManager.applyUpdate()
								}
							}
						})
					})
				}
			})
			// 新版本下载失败
			updateManager.onUpdateFailed(res => {
				console.error(res)
			})
			
			// #endif

		},
			

		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}

	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	@import "@/static/iconfont.css";



	page {
		background-color: #f5f5f5;
		position: relative;
		top: var(--status-bar-height);
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}

	// 隐藏滚动条
	::-webkit-scrollbar {
		width: 0 !important;
	}

	::-webkit-scrollbar {
		width: 0 !important;
		height: 0;
	}


	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
</style>