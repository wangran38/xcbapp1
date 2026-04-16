// utils/push.js
let jpushModule = null;

// 初始化推送（只在同意隐私后调用）
export function initPush() {
	try {
		jpushModule = uni.requireNativePlugin('JG-JPush');
		if (jpushModule && jpushModule.setPrivacyAuthorization) {
			jpushModule.setPrivacyAuthorization(true);
		}
		if (jpushModule) {
			jpushModule.initJPushService();
		}

		// 读取用户开关状态并设置
		const enabled = getPushSetting();
		setPushEnabled(enabled);
	} catch (e) {}
}

// 获取开关状态（默认开启）
export function getPushSetting() {
	const val = uni.getStorageSync('push_enabled');
	return val === '' ? true : val;
}

// 设置推送开关（核心！）
export function setPushEnabled(enabled) {
	uni.setStorageSync('push_enabled', enabled);
	if (!jpushModule) return;

	try {
		if (enabled) {
			// 开启推送
			jpushModule.resumePush();
			console.log('✅ 推送已开启');
		} else {
			// 关闭推送
			jpushModule.stopPush();
			console.log('❌ 推送已关闭');
		}
	} catch (e) {}
}



function createCustomRingtoneChannel() {
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
}
function getRegistrationID() {
	if (!this.jpushModule || !this.isPrivacyAgreed) return;
	this.jpushModule.getRegistrationID(result => {
		if (result.registerID) {
			this.registrationID = result.registerID;
			uni.setStorageSync('registerID', this.registrationID);
		}
	});
}