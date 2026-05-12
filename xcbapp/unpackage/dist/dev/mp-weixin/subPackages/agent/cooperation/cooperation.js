"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_public = require("../../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      currentStep: 1,
      // 1=选择代理信息（类型+区域），2=填写个人信息
      // 表单数据
      formData: {
        nickname: "",
        phone: "",
        email: "",
        province: "",
        // 代理省份id
        city: "",
        // 代理市县id
        remark: "",
        type: null,
        status: 1,
        userid: ""
      },
      // 实时错误提示
      errorTips: {},
      multiArray: [
        [],
        // 省
        [],
        // 市
        []
        // 区
      ],
      provinceList: [],
      // 省份原始数据（含id）
      cityList: [],
      // 城市原始数据（含id）
      districtList: [],
      // 区县原始数据（含id）
      multiIndex: [0, 0, 0],
      // 三级选择器默认索引
      agentTypeList: [
        ["省级", "市县区级"]
      ],
      agentTypeIndex: [0],
      // 代理级别默认选中第一个
      // 提交状态
      isSubmitting: false,
      isShowLoading: false,
      isSubmit: false,
      key: false
    };
  },
  async onLoad() {
    try {
      let data = await api_index.api.getqrcode();
      if (data.code == 200) {
        this.formData.userid = data.data.userid;
      }
      await this.initializePicker();
    } catch (error) {
      common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:216", "页面初始化失败:", error);
    }
  },
  methods: {
    onAgentTypeChange({ detail }) {
      this.agentTypeIndex[0] = detail.value;
      this.$forceUpdate();
    },
    // 省市区选择器相关方法（不变）
    async fetchProvinces() {
      try {
        const response = await api_index.api.citylist({ level: 1, limit: 100 });
        if (response.code === 200) {
          this.provinceList = response.data.listdata;
          return this.provinceList;
        }
        throw new Error("获取省份数据失败");
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:235", "获取省份失败:", error);
        return [];
      }
    },
    async fetchCities(provinceId) {
      try {
        const response = await api_index.api.citytree(provinceId);
        if (response.code === 200 && Array.isArray(response.data))
          return response.data;
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:243", "获取城市数据为空");
        return [];
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:246", "获取城市失败:", error);
        return [];
      }
    },
    async fetchAreas(cityId) {
      try {
        const response = await api_index.api.citytree(cityId);
        if (response.code === 200 && Array.isArray(response.data))
          return response.data;
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:254", "获取区县数据为空");
        return [];
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:257", "获取区县失败:", error);
        return [];
      }
    },
    bindMultiPickerChange(e) {
      this.multiIndex = e.detail.value;
      if (!this.provinceList[this.multiIndex[0]] || !this.cityList[this.multiIndex[1]] || !this.districtList[this.multiIndex[2]])
        return;
      this.formData.province = this.provinceList[this.multiIndex[0]].id;
      this.formData.city = this.districtList[this.multiIndex[2]].id;
    },
    async bindMultiPickerColumnChange(e) {
      var _a, _b, _c;
      const column = e.detail.column;
      const value = e.detail.value;
      this.multiIndex[column] = value;
      if (column === 0) {
        const provinceId = (_a = this.provinceList[value]) == null ? void 0 : _a.id;
        if (!provinceId)
          return;
        const cities = await this.fetchCities(provinceId);
        this.cityList = cities;
        this.multiArray[1] = cities.map((item) => item.name);
        const firstCityId = (_b = cities[0]) == null ? void 0 : _b.id;
        if (firstCityId) {
          const areas = await this.fetchAreas(firstCityId);
          this.districtList = areas;
          this.multiArray[2] = areas.map((item) => item.name);
        } else {
          this.districtList = [];
          this.multiArray[2] = [];
        }
        this.multiIndex[1] = 0;
        this.multiIndex[2] = 0;
      } else if (column === 1) {
        const cityId = (_c = this.cityList[value]) == null ? void 0 : _c.id;
        if (!cityId)
          return;
        const areas = await this.fetchAreas(cityId);
        this.districtList = areas;
        this.multiArray[2] = areas.map((item) => item.name);
        this.multiIndex[2] = 0;
      }
      this.multiIndex = [...this.multiIndex];
    },
    async initializePicker() {
      var _a, _b;
      try {
        const provinces = await this.fetchProvinces();
        if (provinces.length === 0)
          return;
        this.multiArray[0] = provinces.map((item) => item.name);
        const firstProvinceId = provinces[0].id;
        const cities = await this.fetchCities(firstProvinceId);
        this.cityList = cities;
        this.multiArray[1] = cities.map((item) => item.name);
        const firstCityId = (_a = cities[0]) == null ? void 0 : _a.id;
        if (firstCityId) {
          const areas = await this.fetchAreas(firstCityId);
          this.districtList = areas;
          this.multiArray[2] = areas.map((item) => item.name);
        }
        this.formData.province = firstProvinceId;
        this.formData.city = ((_b = this.districtList[0]) == null ? void 0 : _b.id) || "";
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:332", "选择器初始化失败:", error);
      }
    },
    // 其他原有方法（不变）
    customizeBack() {
      common_vendor.index.navigateBack({ delta: 1 });
    },
    handlePhoneInput(e) {
      this.formData.phone = e.detail.value.replace(/\D/g, "").slice(0, 11);
    },
    validateField(field) {
      const val = this.formData[field];
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
      }
      this.$set(this.errorTips, field, tips[field] || "");
      return !tips[field];
    },
    validateForm() {
      const fields = ["nickname", "phone", "email"];
      let isPass = true;
      fields.forEach((field) => {
        const pass = this.validateField(field);
        if (!pass)
          isPass = false;
      });
      return isPass;
    },
    async submitForm() {
      if (!this.validateForm())
        return;
      switch (this.agentTypeList[0][this.agentTypeIndex[0]]) {
        case "省级":
          this.formData.type = 1;
          break;
        case "市县区级":
          this.formData.type = 2;
          break;
      }
      this.formData.agentType = Number(this.agentTypeIndex[0]) + 1;
      this.isSubmitting = true;
      this.isShowLoading = true;
      try {
        const res = await api_index.api.agentApply(this.formData);
        if (res.code === 200) {
          this.isShowLoading = false;
          this.isSubmitting = false;
          this.isSubmit = true;
        } else {
          common_vendor.index.showToast({ title: res.msg || "提交失败", icon: "none" });
          this.isShowLoading = false;
          this.isSubmitting = false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at subPackages/agent/cooperation/cooperation.vue:401", "提交申请失败:", error);
        common_vendor.index.showToast({ title: "网络错误，提交失败", icon: "none" });
        this.isShowLoading = false;
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        nickname: "",
        phone: "",
        email: "",
        province: "",
        city: "",
        remark: "",
        type: null,
        status: 1,
        userid: this.formData.userid
      };
      this.agentTypeIndex = [0];
      this.errorTips = {};
      this.initializePicker();
    },
    // 第一步 → 第二步（核心验证：代理类型+完整区域）
    toStep2() {
      if (this.agentTypeIndex[0] === null) {
        common_vendor.index.showToast({ title: "请选择代理级别", icon: "none" });
        return;
      }
      if (!this.multiArray[0][this.multiIndex[0]] || !this.multiArray[1][this.multiIndex[1]] || !this.multiArray[2][this.multiIndex[2]]) {
        common_vendor.index.showToast({ title: "请选择完整的代理区域", icon: "none" });
        return;
      }
      if (!this.formData.province || !this.formData.city) {
        common_vendor.index.showToast({ title: "区域数据异常，请重新选择", icon: "none" });
        return;
      }
      this.currentStep = 2;
      common_vendor.index.pageScrollTo({ scrollTop: 0, duration: 300 });
    },
    // 第二步 → 第一步（返回修改）
    toStep1() {
      this.currentStep = 1;
      common_vendor.index.pageScrollTo({ scrollTop: 0, duration: 300 });
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
    a: $data.currentStep === 1 ? 1 : "",
    b: $data.currentStep >= 2 ? 1 : "",
    c: $data.currentStep === 2 ? 1 : "",
    d: !$data.isSubmit
  }, !$data.isSubmit ? common_vendor.e({
    e: $data.currentStep === 1
  }, $data.currentStep === 1 ? {
    f: common_vendor.t($data.agentTypeIndex[0] !== null ? $data.agentTypeList[0][$data.agentTypeIndex[0]] : "选择代理级别"),
    g: $data.agentTypeList[0],
    h: $data.agentTypeIndex[0],
    i: common_vendor.o((...args) => $options.onAgentTypeChange && $options.onAgentTypeChange(...args)),
    j: common_vendor.t($data.multiArray[0][$data.multiIndex[0]] || "请选择省"),
    k: common_vendor.t($data.multiArray[1][$data.multiIndex[1]] || "请选择市"),
    l: common_vendor.t($data.multiArray[2][$data.multiIndex[2]] || "请选择区"),
    m: $data.multiArray,
    n: $data.multiIndex,
    o: common_vendor.o((...args) => $options.bindMultiPickerChange && $options.bindMultiPickerChange(...args)),
    p: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    q: common_vendor.o((...args) => $options.toStep2 && $options.toStep2(...args))
  } : {}, {
    r: $data.currentStep === 2
  }, $data.currentStep === 2 ? common_vendor.e({
    s: common_vendor.t($data.agentTypeList[0][$data.agentTypeIndex[0]] || "未选择"),
    t: common_vendor.t(`${$data.multiArray[0][$data.multiIndex[0]] || "无"} - ${$data.multiArray[1][$data.multiIndex[1]] || "无"} - ${$data.multiArray[2][$data.multiIndex[2]] || "无"}`),
    v: $data.formData.nickname,
    w: common_vendor.o(($event) => $data.formData.nickname = $event.detail.value),
    x: $data.errorTips.name
  }, $data.errorTips.name ? {
    y: common_vendor.t($data.errorTips.name)
  } : {}, {
    z: common_vendor.o([($event) => $data.formData.phone = $event.detail.value, (...args) => $options.handlePhoneInput && $options.handlePhoneInput(...args)]),
    A: $data.formData.phone,
    B: $data.errorTips.phone
  }, $data.errorTips.phone ? {
    C: common_vendor.t($data.errorTips.phone)
  } : {}, {
    D: $data.formData.email,
    E: common_vendor.o(($event) => $data.formData.email = $event.detail.value),
    F: $data.errorTips.email
  }, $data.errorTips.email ? {
    G: common_vendor.t($data.errorTips.email)
  } : {}, {
    H: $data.formData.remark,
    I: common_vendor.o(($event) => $data.formData.remark = $event.detail.value),
    J: common_vendor.t($data.formData.remark.length),
    K: common_vendor.o((...args) => $options.toStep1 && $options.toStep1(...args)),
    L: !$data.isSubmitting
  }, !$data.isSubmitting ? {} : {}, {
    M: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    N: $data.isSubmitting,
    O: $data.isShowLoading
  }, $data.isShowLoading ? {
    P: common_vendor.p({
      type: "spinner",
      size: "40",
      color: "#4285F4"
    })
  } : {}) : {}) : {}, {
    Q: $data.isSubmit
  }, $data.isSubmit ? {
    R: common_vendor.p({
      type: "success-circle",
      size: "60",
      color: "#34A853"
    }),
    S: common_vendor.o((...args) => $options.customizeBack && $options.customizeBack(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-15a01c95"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subPackages/agent/cooperation/cooperation.js.map
