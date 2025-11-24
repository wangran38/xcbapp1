"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // buttonLabel:'更新版本',
      latestVersion: "2.0.0",
      currentVersion: "1.0.0",
      downloadPercent: 0,
      updating: false,
      updateContent: [
        "关闭线上调试"
      ],
      downloading: false
    };
  },
  computed: {
    buttonLabel() {
      return this.updating ? `更新中 ${this.downloadPercent}%` : "立即体验新版本";
    },
    progressPhrase() {
      const phrases = [
        "正在连接更新服务器...",
        "发现可用更新包",
        "正在优化性能模块",
        "校验文件完整性",
        "准备就绪"
      ];
      return phrases[Math.min(Math.floor(this.downloadPercent / 25), 4)];
    },
    contentList() {
      return this.updateContent.filter(Boolean).map((item) => item.trim());
    },
    btnText() {
      if (this.updating) {
        return this.downloadPercent === 100 ? "安装中..." : `下载中 ${this.downloadPercent}%`;
      }
      return "立即更新";
    }
  },
  mounted() {
    this.initUpdateManager();
  },
  methods: {
    // 初始化更新管理器
    initUpdateManager() {
      if (!common_vendor.wx$1.canIUse("getUpdateManager"))
        return;
      const updateManager = common_vendor.wx$1.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          this.showUpdatePage = true;
          this.registerListeners(updateManager);
        }
      });
    },
    // 注册更新监听器
    registerListeners(manager) {
      manager.onUpdateReady(() => {
        this.downloadPercent = 100;
        this.applyUpdate(manager);
      });
      manager.onUpdateFailed(() => {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none",
          duration: 2e3
        });
        this.updating = false;
      });
      this.simulateProgress();
    },
    // 处理更新操作
    handleUpdate() {
      this.updating = true;
      this.simulateProgress();
      common_vendor.wx$1.showLoading({
        title: "准备更新",
        mask: true
      });
      if (this.downloadPercent === 100) {
        this.applyUpdate(common_vendor.wx$1.getUpdateManager());
      }
    },
    // 应用更新
    applyUpdate(manager) {
      common_vendor.index.showModal({
        title: "更新提示",
        content: "新版本已就绪，立即重启应用？",
        confirmText: "立即重启",
        success: (res) => {
          if (res.confirm) {
            manager.applyUpdate();
          }
        },
        complete: () => {
          this.updating = false;
          common_vendor.wx$1.hideLoading();
        }
      });
    },
    // 模拟进度（因小程序无真实进度事件）
    simulateProgress() {
      let current = 0;
      const timer = setInterval(() => {
        if (current < 95) {
          current += Math.floor(Math.random() * 15 + 5);
          this.downloadPercent = Math.min(current, 95);
        } else {
          clearInterval(timer);
        }
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$4,
    b: common_vendor.t($data.latestVersion),
    c: common_vendor.f($data.updateContent, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    d: common_assets._imports_1$1,
    e: $data.updating
  }, $data.updating ? common_vendor.e({
    f: $data.downloadPercent + "%",
    g: $data.updating
  }, $data.updating ? {
    h: common_vendor.t($options.progressPhrase)
  } : {}) : {}, {
    i: common_vendor.t($options.buttonLabel),
    j: $data.updating,
    k: common_vendor.o((...args) => $options.handleUpdate && $options.handleUpdate(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-70494371"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/settings/version/version.js.map
