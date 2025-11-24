"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      // 表单数据
      formData: {
        nickname: "",
        phone: "",
        email: "",
        province: "",
        // 用户代理的省份id
        city: "",
        //  用户代理市县id
        remark: "",
        type: null,
        status: 1
      },
      // 实时错误提示
      errorTips: {},
      // 地区选择
      regionRange: [
        [],
        []
      ],
      provinceMapData: [],
      cityMapData: [],
      regionIndex: [0, 0],
      agentTypeList: [
        [
          "省级",
          "市级"
        ]
      ],
      agentTypeIndex: [
        [0]
      ],
      // 提交状态（原有）
      isSubmitting: false,
      // 提交等待遮罩显示状态（新增）
      isShowLoading: false,
      isSubmit: false,
      key: false
    };
  },
  async onLoad() {
    let data = await api_index.api.getqrcode();
    if (data.code == 200) {
      this.formData.userid = data.data.userid;
    }
    this.initRegion();
  },
  methods: {
    // 获取城市数据
    async getCityData(pid) {
      if (!pid) {
        common_vendor.index.__f__("warn", "at subPackages/agent/cooperation/cooperation.vue:174", "缺少省份ID，无法获取城市数据");
        return;
      }
      this.regionIndex[1] = 0;
      this.cityMapData = [];
      this.regionRange.splice(1, 1, []);
      try {
        const data = await api_index.api.citytree(pid);
        if (data.code === 200 && Array.isArray(data.data)) {
          const cityIds = [];
          const cityNames = [];
          data.data.forEach((item) => {
            cityIds.push(item.id);
            cityNames.push(item.name);
          });
          this.cityMapData = cityIds;
          this.regionRange[1] = cityNames;
        } else {
          common_vendor.index.__f__("warn", "at subPackages/agent/cooperation/cooperation.vue:195", "城市数据返回格式异常", data);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:198", "获取城市数据失败", error);
      } finally {
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    },
    // 初始化地区
    async initRegion() {
      let data = await api_index.api.citylist({
        "level": 1,
        "limit": 100
      });
      if (data.code == 200) {
        data.data.listdata.forEach((item) => {
          this.provinceMapData.push(item.id);
          this.regionRange[0].push(item.name);
        });
      }
      this.getCityData(this.provinceMapData[0]);
    },
    // 导航返回
    navigateBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    // 手机号输入处理
    handlePhoneInput(e) {
      this.formData.phone = e.detail.value.replace(/\D/g, "").slice(0, 11);
    },
    // 地区选择列变化
    onRegionColumnChange({
      detail
    }) {
      common_vendor.index.__f__("log", "at subPackages/agent/cooperation/cooperation.vue:237", detail);
      if (detail.column == 0) {
        this.regionIndex[0] = detail.value;
        this.getCityData(this.provinceMapData[detail.value]);
      }
    },
    onAgentTypeChange({
      detail
    }) {
      this.agentTypeIndex[0] = detail.value[0];
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    // 地区选择确认
    onRegionChange({
      detail
    }) {
      this.regionIndex = detail.value;
    },
    // 单个字段验证
    validateField(field) {
      const val = field === "region" ? this.regionIndex[0] : this.formData[field];
      const tips = {};
      switch (field) {
        case "nickname":
          if (!val)
            tips.nickname = "请输入您的真实姓名";
          break;
        case "phone":
          if (!val)
            tips.phone = "请输入联系电话";
          else if (val.length !== 11)
            tips.phone = "请输入11位有效手机号码";
          break;
        case "email":
          const reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
          if (!val)
            tips.email = "请输入电子邮箱";
          else if (!reg.test(val))
            tips.email = "请输入有效的邮箱格式（例：xxx@xx.com）";
          break;
        case "company":
          if (!val)
            tips.company = "请输入公司名称";
          break;
        case "address":
          if (!val)
            tips.address = "请输入公司详细地址";
          break;
        case "region":
          if (val === null)
            tips.region = "请选择意向代理区域";
          break;
        case "intention":
          if (!val)
            tips.intention = "请描述您的合作意向";
          else if (val.length > 200)
            tips.intention = "合作意向描述不能超过200字";
          break;
      }
      this.$set(this.errorTips, field, tips[field] || "");
      return !tips[field];
    },
    // 整体表单验证
    validateForm() {
      const fields = ["name", "phone", "email", "company", "address", "region", "intention"];
      let isPass = true;
      fields.forEach((field) => {
        const pass = this.validateField(field);
        if (!pass)
          isPass = false;
      });
      return isPass;
    },
    // 提交表单（新增等待遮罩逻辑）
    async submitForm() {
      switch (this.agentTypeList[0][this.agentTypeIndex[0]]) {
        case "省级":
          this.formData.type = 1;
          break;
        case "市级":
          this.formData.type = 2;
          break;
      }
      this.formData.province = this.provinceMapData[this.regionIndex[0]];
      this.formData.city = this.cityMapData[this.regionIndex[1]];
      this.formData.agentType = Number(this.agentTypeIndex[0]) + 1;
      await api_index.api.agentApply(this.formData);
      this.isSubmit = true;
      this.isSubmitting = true;
      this.isShowLoading = true;
      setTimeout(() => {
        this.isShowLoading = false;
        this.isSubmitting = false;
        this.resetForm();
      }, 2500);
    },
    // 重置表单
    resetForm() {
      this.formData = {
        name: "",
        phone: "",
        email: "",
        intention: ""
      };
      this.regionIndex = [null, null];
      this.errorTips = {};
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isSubmit
  }, !$data.isSubmit ? common_vendor.e({
    b: common_vendor.p({
      type: "contact",
      size: "20",
      color: "#4285F4"
    }),
    c: $data.formData.nickname,
    d: common_vendor.o(($event) => $data.formData.nickname = $event.detail.value),
    e: $data.errorTips.name
  }, $data.errorTips.name ? {
    f: common_vendor.t($data.errorTips.name)
  } : {}, {
    g: common_vendor.o([($event) => $data.formData.phone = $event.detail.value, (...args) => $options.handlePhoneInput && $options.handlePhoneInput(...args)]),
    h: $data.formData.phone,
    i: $data.errorTips.phone
  }, $data.errorTips.phone ? {
    j: common_vendor.t($data.errorTips.phone)
  } : {}, {
    k: $data.formData.email,
    l: common_vendor.o(($event) => $data.formData.email = $event.detail.value),
    m: $data.errorTips.email
  }, $data.errorTips.email ? {
    n: common_vendor.t($data.errorTips.email)
  } : {}, {
    o: common_vendor.p({
      type: "map-pin",
      size: "20",
      color: "#FBBC05"
    }),
    p: common_vendor.t($data.regionIndex[0] !== null ? `${$data.regionRange[0][$data.regionIndex[0]]} - ${$data.regionRange[1][$data.regionIndex[1]]}` : "选择区域"),
    q: $data.regionRange,
    r: $data.regionIndex,
    s: common_vendor.o((...args) => $options.onRegionChange && $options.onRegionChange(...args)),
    t: common_vendor.o((...args) => $options.onRegionColumnChange && $options.onRegionColumnChange(...args)),
    v: $data.errorTips.region
  }, $data.errorTips.region ? {
    w: common_vendor.t($data.errorTips.region)
  } : {}, {
    x: common_vendor.t($data.agentTypeIndex[0] !== null ? `${$data.agentTypeList[0][$data.agentTypeIndex[0]]}` : "选择代理级别"),
    y: $data.agentTypeList,
    z: common_vendor.o((...args) => $options.onAgentTypeChange && $options.onAgentTypeChange(...args)),
    A: $data.errorTips.region
  }, $data.errorTips.region ? {
    B: common_vendor.t($data.errorTips.region)
  } : {}, {
    C: $data.formData.remark,
    D: common_vendor.o(($event) => $data.formData.remark = $event.detail.value),
    E: common_vendor.t($data.formData.remark.length),
    F: !$data.isSubmitting
  }, !$data.isSubmitting ? {} : {
    G: common_vendor.p({
      type: "spinner",
      size: "18",
      color: "#fff"
    })
  }, {
    H: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    I: $data.isSubmitting,
    J: $data.isSubmitting
  }, {}) : {}, {
    L: $data.isSubmit
  }, $data.isSubmit ? {
    M: common_vendor.p({
      type: "success-circle",
      size: "60",
      color: "#34A853"
    }),
    N: common_vendor.o((...args) => _ctx.customizeBack && _ctx.customizeBack(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-15a01c95"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/cooperation/cooperation.js.map
