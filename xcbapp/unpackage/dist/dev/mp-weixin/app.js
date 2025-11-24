"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_log = require("./utils/log.js");
const utils_Share = require("./utils/Share.js");
if (!Math) {
  "./pages/index1/index1.js";
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/select/select.js";
  "./pages/sVegetables/sVegetables.js";
  "./pages/user/user.js";
  "./pages/ShopDetails/ShopDetails.js";
  "./pages/Apply/Apply.js";
  "./pages/Buy/Buy.js";
  "./pages/publish/publish.js";
  "./pages/release/release.js";
  "./pages/stalllist/stalllist.js";
  "./pages/coupons/coupons.js";
  "./pages/lottery/lottery.js";
  "./pages/rules/rules.js";
  "./pages/jackpot/jackpot.js";
  "./pages/orders/orders.js";
  "./pages/Stalls-dishes/Stalls-dishes.js";
  "./pages/Listed-Dishes/Listed-Dishes.js";
  "./pages/usecoupons/usecoupons.js";
  "./pages/Clock/Clock.js";
  "./pages/clock-records/clock-records.js";
  "./pages/MyPoints-records/MyPoints-records.js";
  "./pages/Ownerorders/Ownerorders.js";
  "./pages/wallet/wallet.js";
  "./pages/Points/Points.js";
  "./pages/pointspayouts/pointspayouts.js";
  "./pages/Settrecords/Settrecords.js";
  "./pages/editshop/editshop.js";
  "./pages/bankCard/bankCard.js";
  "./pages/addCard/addCard.js";
  "./pages/onlineBooth/onlineBooth.js";
  "./pages/boothOwner/boothOwner.js";
  "./pages/aHouseholder/aHouseholder.js";
  "./pages/userServiceAgreement/userServiceAgreement.js";
  "./pages/privacyAgreement/privacyAgreement.js";
  "./pages/OpenAccountSharing/OpenAccountSharing.js";
  "./pages/arrangeNotification/arrangeNotification.js";
  "./pages/weChatCashwWithdrawal/weChatCashwWithdrawal.js";
  "./pages/billRecord/billRecord.js";
  "./pages/wholesale/wholesale.js";
  "./pages/prizeDraw/prizeDraw.js";
  "./pages/preSale/preSale.js";
  "./pages/additionalinformation/additionalinformation.js";
  "./pages/Presalemenulist/Presalemenulist.js";
  "./pages/dynamics/dynamics.js";
  "./pages/demo/demo.js";
  "./pages/merchantComplaints/merchantComplaints.js";
  "./pages/myComplaint/myComplaint.js";
  "./pages/complaintDetails/complaintDetails.js";
  "./pages/settings/settings.js";
  "./pages/commodityDetail/commodityDetail.js";
  "./pages/invitation/invitation.js";
  "./pages/earningsRecord/earningsRecord.js";
  "./pages/certification/certification.js";
  "./pages/agent/agent.js";
  "./subPackages/PaymentModule/PaymentMethod/PaymentMethod.js";
  "./subPackages/PaymentModule/collectOnDelivery/collectOnDelivery.js";
  "./subPackages/agent/cooperation/cooperation.js";
  "./subPackages/agent/datacenter/datacenter.js";
  "./subPackages/aHouseholder/additionalInformation/additionalInformation.js";
  "./subPackages/aHouseholder/publishDishes/publishDishes.js";
  "./subPackages/aHouseholder/Traceability/Traceability.js";
  "./subPackages/aHouseholder/lookTraceability/lookTraceability.js";
  "./subPackages/aHouseholder/PreSoldDishesList/PreSoldDishesList.js";
  "./subPackages/aHouseholder/modifyPreSoldDishes/modifyPreSoldDishes.js";
  "./subPackages/aHouseholder/beListed/beListed.js";
  "./subPackages/aHouseholder/alreadyListed/alreadyListed.js";
  "./subPackages/Wholesale/supply/supply.js";
  "./subPackages/Wholesale/purchase/purchase.js";
  "./subPackages/Wholesale/addSupply/addSupply.js";
  "./subPackages/Wholesale/addPurchase/addPurchase.js";
  "./subPackages/Wholesale/wholesaleNavigation/wholesaleNavigation.js";
  "./subPackages/Wholesale/mySupply/mySupply.js";
  "./subPackages/Wholesale/myProcurement/myProcurement.js";
  "./subPackages/Wholesale/quotation/quotation.js";
  "./subPackages/shoppingPageList/villageZone/villageZone.js";
  "./subPackages/shoppingPageList/nearbyFarmers/nearbyFarmers.js";
  "./subPackages/shoppingPageList/agriculturalAssistanceZone/agriculturalAssistanceZone.js";
  "./subPackages/shoppingPageList/official/official.js";
  "./subPackages/shoppingPageList/rentalStorefront/rentalStorefront.js";
  "./subPackages/shoppingPageList/rentalStorefrontList/rentalStorefrontList.js";
  "./subPackages/shoppingPageList/prePurchaseOrder/prePurchaseOrder.js";
  "./subPackages/shoppingPageList/prePurchaseDeposit/prePurchaseDeposit.js";
  "./subPackages/shoppingPageList/merchantDetails/merchantDetails.js";
  "./subPackages/shoppingPageList/realTimeInfo/realTimeInfo.js";
  "./subPackages/shoppingPageList/realTimeInfoDetail/realTimeInfoDetail.js";
  "./subPackages/shoppingPageList/freeGroceryShopping/freeGroceryShopping.js";
  "./subPackages/shoppingPageList/statisticsMap/statisticsMap.js";
  "./subPackages/boothOwner/salesApplication/salesApplication.js";
  "./subPackages/boothOwner/billRecord/billRecord.js";
  "./subPackages/boothOwner/storeSettings/storeSettings.js";
  "./subPackages/settings/user-edit/user-edit.js";
  "./subPackages/settings/updatePwd/updatePwd.js";
  "./subPackages/settings/aboutUs/aboutUs.js";
  "./subPackages/settings/version/version.js";
  "./subPackages/settings/myAddress/myAddress.js";
  "./subPackages/settings/addAddress/addAddress.js";
}
const _sfc_main = {
  data() {
    return {
      jpushModule: null,
      registrationID: "",
      connectStatus: "未连接"
    };
  },
  methods: {
    /** 初始化极光推送 */
    initJPush() {
      try {
        utils_log.saveLog("开始初始化 JPush...");
        this.jpushModule = common_vendor.index.requireNativePlugin("JG-JPush");
        if (!this.jpushModule) {
          utils_log.saveLog("[错误] JPush 初始化失败：无法获取插件实例。");
          return;
        }
        this.jpushModule.initJPushService();
        utils_log.saveLog("✅ JPush 服务已初始化。");
        this.jpushModule.addConnectEventListener((result) => {
          this.connectStatus = result.connectEnable ? "已连接" : "未连接";
          utils_log.saveLog(`📡 JPush 连接状态: ${this.connectStatus}`);
          if (this.connectStatus === "已连接") {
            this.getRegistrationID();
          }
        });
        this.jpushModule.addNotificationListener((result) => {
          utils_log.saveLog("📥 收到 JPush 通知:", result);
        });
        this.checkNotificationPermission();
      } catch (e) {
        utils_log.saveLog(`[错误] JPush 初始化异常: ${e.message}`);
      }
    },
    /** 创建自定义铃声渠道 */
    createCustomRingtoneChannel() {
      try {
        utils_log.saveLog("🚀 [铃声渠道] 函数已执行");
        const main = plus.android.runtimeMainActivity();
        const AndroidVersion = plus.android.importClass("android.os.Build");
        if (AndroidVersion.SDK_INT < 26) {
          utils_log.saveLog("⚠️ [铃声渠道] Android < 8.0，不创建渠道");
          return;
        }
        const NotificationManager = plus.android.importClass("android.app.NotificationManager");
        const NotificationChannel = plus.android.importClass("android.app.NotificationChannel");
        const Uri = plus.android.importClass("android.net.Uri");
        const AudioAttributes = plus.android.importClass("android.media.AudioAttributes");
        const RingtoneManager = plus.android.importClass("android.media.RingtoneManager");
        const manager = main.getSystemService(main.NOTIFICATION_SERVICE);
        const packageName = main.getPackageName();
        const res = main.getResources();
        const channelId = "custom_ringtone";
        const channelName = "订单语音通知";
        const channelDesc = "播放自定义通知铃声";
        const ringtoneResId = res.getIdentifier("custom_ringtone", "raw", packageName);
        utils_log.saveLog("🎵 [铃声渠道] 铃声资源 ID = " + ringtoneResId);
        if (ringtoneResId === 0) {
          utils_log.saveLog("❌ [铃声渠道] 找不到自定义铃声，请检查路径：nativeResources/android/res/raw/custom_ringtone.mp3");
          return;
        }
        const ringtoneUri = Uri.parse(`android.resource://${packageName}/${ringtoneResId}`);
        utils_log.saveLog("🔗 [铃声渠道] 铃声 URI = " + ringtoneUri.toString());
        try {
          const ringtone = RingtoneManager.getRingtone(main, ringtoneUri);
          utils_log.saveLog("🎧 [铃声渠道] 系统解析铃声成功: " + ringtone.getTitle(main));
        } catch (e) {
          utils_log.saveLog("⚠️ [铃声渠道] 系统解析铃声失败: " + e.message);
        }
        let channel = manager.getNotificationChannel(channelId);
        if (!channel) {
          utils_log.saveLog("📢 [铃声渠道] 渠道不存在 → 开始创建");
          const audioAttr = new AudioAttributes.Builder().setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).setUsage(AudioAttributes.USAGE_NOTIFICATION).build();
          channel = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH);
          channel.setDescription(channelDesc);
          channel.enableLights(true);
          channel.enableVibration(true);
          channel.setSound(ringtoneUri, audioAttr);
          manager.createNotificationChannel(channel);
          utils_log.saveLog("✅ [铃声渠道] 渠道创建完成");
        } else {
          utils_log.saveLog("⚠️ [铃声渠道] 渠道已存在（不会更新铃声）。如需更新：卸载重装 App");
        }
        const created = manager.getNotificationChannel(channelId);
        utils_log.saveLog("🔍 [铃声渠道] 最终渠道铃声 = " + created.getSound());
        utils_log.saveLog("🔍 [铃声渠道] 重要性 = " + created.getImportance());
      } catch (e) {
        utils_log.saveLog("❌ [铃声渠道] 异常：" + e.message);
      }
    },
    /** 获取 RegistrationID */
    getRegistrationID() {
      if (!this.jpushModule)
        return;
      this.jpushModule.getRegistrationID((result) => {
        if (result.registerID) {
          this.registrationID = result.registerID;
          common_vendor.index.setStorageSync("registerID", this.registrationID);
          utils_log.saveLog(`✅ 获取 RegistrationID 成功: ${this.registrationID}`);
        } else {
          utils_log.saveLog(`[错误] 获取 RegistrationID 失败: ${result.errMsg}`);
        }
      });
    },
    /** 检查通知权限 */
    checkNotificationPermission() {
      const main = plus.android.runtimeMainActivity();
      plus.android.importClass("android.app.NotificationManager");
      const nm = main.getSystemService(main.NOTIFICATION_SERVICE);
      if (plus.android.invoke(nm, "areNotificationsEnabled")) {
        utils_log.saveLog("🔔 通知权限已开启");
      } else {
        utils_log.saveLog("⚠️ 通知权限未开启");
        this.noticMsgTool();
      }
    },
    /** 提示用户开启通知 */
    noticMsgTool() {
      common_vendor.index.showModal({
        title: "通知权限提醒",
        content: "您还没有开启通知权限，无法接收消息，请前往设置！",
        showCancel: false,
        confirmText: "去设置",
        success: (res) => {
          if (res.confirm) {
            this.openNotificationSettings();
          }
        }
      });
    },
    /** 打开系统通知设置 */
    openNotificationSettings() {
      const main = plus.android.runtimeMainActivity();
      const Intent = plus.android.importClass("android.content.Intent");
      const Build = plus.android.importClass("android.os.Build");
      const Settings = plus.android.importClass("android.provider.Settings");
      const Uri = plus.android.importClass("android.net.Uri");
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
          intent.setData(Uri.parse("package:" + main.getPackageName()));
        }
        main.startActivity(intent);
      } catch (e) {
        utils_log.saveLog(`[错误] 打开通知设置失败: ${e.message}`);
        const intent = new Intent(Settings.ACTION_SETTINGS);
        main.startActivity(intent);
      }
    }
  },
  onLaunch() {
    common_vendor.index.$globalMethods = {
      getRegistrationID: () => this.getRegistrationID()
    };
    try {
      const main = plus.android.runtimeMainActivity();
      const context = main;
      plus.android.importClass(context);
      const resources = context.getResources();
      plus.android.importClass(resources);
      const packageName = context.getPackageName();
      const resId = plus.android.invoke(
        resources,
        "getIdentifier",
        "custom_ringtone",
        "raw",
        packageName
      );
      utils_log.saveLog("铃声资源 ID = " + resId);
      if (!resId) {
        utils_log.saveLog("❌ 资源不存在，请检查是否正确放入 raw 目录");
      }
    } catch (e) {
      utils_log.saveLog("❌ 错误：" + e);
    }
  },
  onShow() {
    const options = {
      title: "开启消息通知",
      content: "开启后可及时收到重要通知，是否前往设置开启？",
      confirmText: "去设置",
      cancelText: "暂不开启",
      successToast: "通知权限已开启，感谢支持！",
      failToast: "您未开启通知权限，可能错过重要消息",
      successCallback: () => {
      },
      failCallback: () => {
      }
    };
    common_vendor.index.getSetting({
      withSubscriptions: true,
      success: (res) => {
        if (!res.subscriptionsSetting.mainSwitch) {
          common_vendor.index.showModal({
            title: options.title,
            content: options.content,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
            success: (res2) => {
              if (res2.confirm) {
                common_vendor.index.openSetting({
                  success: (settingRes) => {
                    if (common_vendor.index.getSystemInfoSync().platform === "wechat") {
                      if (settingRes.authSetting["scope.subscribeMessage"]) {
                        common_vendor.index.showToast({
                          title: options.successToast,
                          icon: "success"
                        });
                      } else {
                        common_vendor.index.showToast({
                          title: options.failToast,
                          icon: "none"
                        });
                      }
                    }
                  },
                  fail: (err) => {
                    common_vendor.index.__f__("error", "at App.vue:292", "打开设置失败", err);
                  }
                });
              } else {
                common_vendor.index.showToast({
                  title: "您可以随时在设置中开启通知",
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at App.vue:305", "显示弹窗失败", err);
            }
          });
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at App.vue:316", "获取设置失败", err);
      }
    });
    const updateManager = common_vendor.index.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          common_vendor.index.showModal({
            title: "更新提示",
            content: "新版本已经准备好，点击确定重启小程序",
            success(res2) {
              if (res2.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });
      }
    });
    updateManager.onUpdateFailed((res) => {
      common_vendor.index.__f__("error", "at App.vue:343", res);
    });
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:352", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.mixin(utils_Share.Share);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
