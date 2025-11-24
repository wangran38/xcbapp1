"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
const myMixin = {
  methods: {
    /**
     * 检查账号代理商申请状态
     */
    async checkApplyStatus() {
      let data = await api_index.api.getqrcode();
      let res = await api_index.api.viewAgentInfo({
        userid: data.data.userid
      });
      if (res.code == 200) {
        return res.data.listdata[0].status;
      } else {
        return 0;
      }
    },
    // 手机号隐藏处理
    hidePhone(val) {
      return val.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    },
    // 获取今天日期
    getNowDate() {
      return this.initDate(Date.now());
    },
    // 计算时间间隔
    getChineseTimeDiff(t1, t2) {
      const diff = Math.abs(t1 - t2);
      const units = [
        {
          value: 864e5,
          name: "天"
        },
        {
          value: 36e5,
          name: "小时"
        }
      ];
      let remaining = diff;
      const result = units.map((unit) => {
        const val = Math.floor(remaining / unit.value);
        remaining %= unit.value;
        return {
          val,
          name: unit.name
        };
      });
      const output = result.filter((item) => item.val > 0).map((item) => `${item.val}${item.name}`).join("");
      return output || "0秒";
    },
    /**
     * 返回上一页
     */
    async customizeBack() {
      let canNavBack = await getCurrentPages();
      if (canNavBack && canNavBack.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        history.back();
      }
    },
    /**
     *
     * 时间格式化
     * {parmars} str   utc时间
     * {returns} timeStr   格式化后的时间
     */
    initTime(str) {
      let timestamp = new Date(str).getTime();
      var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1e3) : new Date(parseInt(
        timestamp
      ));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      if (m < 10) {
        m = "0" + m;
      }
      var d = time.getDate();
      if (d < 10) {
        d = "0" + d;
      }
      var h = time.getHours();
      if (h < 10) {
        h = "0" + h;
      }
      var mm = time.getMinutes();
      if (mm < 10) {
        mm = "0" + mm;
      }
      var s = time.getSeconds();
      if (s < 10) {
        s = "0" + s;
      }
      var timeStr = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
      return timeStr;
    },
    // 年月日
    initDate(str) {
      let timestamp = new Date(str).getTime();
      var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1e3) : new Date(parseInt(
        timestamp
      ));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      if (m < 10) {
        m = "0" + m;
      }
      var d = time.getDate();
      if (d < 10) {
        d = "0" + d;
      }
      time.getHours();
      time.getMinutes();
      time.getSeconds();
      var timeStr = y + "-" + m + "-" + d;
      return timeStr;
    }
  }
};
exports.myMixin = myMixin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/public.js.map
