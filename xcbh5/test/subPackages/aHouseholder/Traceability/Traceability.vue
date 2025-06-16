<template>
  <view class="traceability-page">
    <!-- 顶部状态与标题 -->
    <view class="header-container">
      <view class="progress-bar">
        <view class="progress-value" :style="{ width: formCompletionRate + '%' }"></view>
      </view>
      <view class="header-content">
        <text class="header-title">菜品溯源信息</text>
        <text class="header-subtitle">填写越完整，消费者越放心</text>
      </view>
    </view>
    
    <!-- 消费视角提示 -->
    <view class="consumer-tip">
      <text class="tip-text">消费者最关心：产地环境、种植/养殖方式、农药/饲料使用、检测报告</text>
    </view>
    
    <!-- 表单容器 -->
    <view class="form-container">
      <!-- 产品基本信息 -->
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">基本信息</text>
          <text class="section-desc">消费者必看</text>
        </view>
        
        <view class="form-item">
          <view class="item-label">产品名称 <text class="required-mark">*</text></view>
          <view class="item-content">
           <!-- <picker @change="bindPickerChange" :range="commodityTempLis" :value="index">
              <view class="picker-text">
                {{commodityLis[index].commodity_name || '请选择产品'}}
              </view>
            </picker> -->
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">产品分类 <text class="required-mark">*</text></view>
          <view class="item-content">
            <picker @change="changeClassification" :range="CLASSIFICATION" :value="classificationIndex">
              <view class="picker-text">
                {{CLASSIFICATION[classificationIndex] || '请选择分类'}}
              </view>
            </picker>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">产地 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="location-picker" @click="openLocationPicker">
              <text class="location-text">{{TraceabilityInfo.Students || '点击选择产地'}}</text>
              <icon type="location" size="16" color="#36a3ff" v-if="TraceabilityInfo.Students"></icon>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">生产日期 <text class="required-mark">*</text></view>
          <view class="item-content">
            <uni-datetime-picker type="date" :clear-icon="false"
              v-model="TraceabilityInfo.productionDate" return-type="timestamp" 
              class="date-picker" placeholder="选择生产日期" />
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">批次号</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('batchNumber')">
              <text class="input-text">{{TraceabilityInfo.batchNumber || '点击输入批次号'}}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 种植类详情 -->
      <view class="form-section" v-if="classificationIndex === 0">
        <view class="section-header">
          <text class="section-title">种植信息</text>
          <text class="section-desc">消费者最关心农药使用</text>
        </view>
        
        <view class="form-item">
          <view class="item-label">农药名称 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('pesticideName')">
              <text class="input-text">{{TraceabilityInfo.pesticideName || '点击输入农药名称'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">农药使用次数</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('pesticideTimes')">
              <text class="input-text">{{TraceabilityInfo.pesticideTimes || '点击输入使用次数'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">最后施药日期</view>
          <view class="item-content">
            <uni-datetime-picker type="date" :clear-icon="false"
              v-model="TraceabilityInfo.lastPesticideDate" return-type="timestamp" 
              class="date-picker" placeholder="选择日期" />
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">农残检测报告 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="upload-container">
              <view class="upload-box" v-for="(item, index) in pesticideCertImages" :key="index">
                <image :src="item" mode="aspectFill" class="upload-image"></image>
                <view class="delete-btn" @click="deleteCertificate(index, 'pesticide')">
                  <icon type="cancel" size="16" color="#fff"></icon>
                </view>
              </view>
              <view class="upload-box add-box" @click="choosePesticideCertificate">
                <icon type="camera" size="24" color="#999"></icon>
                <text class="upload-text">上传报告</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">灌溉水源</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('irrigationWater')">
              <text class="input-text">{{TraceabilityInfo.irrigationWater || '点击输入灌溉水源'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">种植周期(天)</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('plantingCycle')">
              <text class="input-text">{{TraceabilityInfo.plantingCycle || '点击输入种植周期'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">土壤类型</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('soilType')">
              <text class="input-text">{{TraceabilityInfo.soilType || '点击输入土壤类型'}}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 养殖类详情 -->
      <view class="form-section" v-if="classificationIndex === 1">
        <view class="section-header">
          <text class="section-title">养殖信息</text>
          <text class="section-desc">消费者最关心饲料与养殖环境</text>
        </view>
        
        <view class="form-item">
          <view class="item-label">饲料名称 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('feedName')">
              <text class="input-text">{{TraceabilityInfo.feedName || '点击输入饲料名称'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">饲料来源 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('feedSource')">
              <text class="input-text">{{TraceabilityInfo.feedSource || '点击输入饲料来源'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">饲料检测报告 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="upload-container">
              <view class="upload-box" v-for="(item, index) in feedCertImages" :key="index">
                <image :src="item" mode="aspectFill" class="upload-image"></image>
                <view class="delete-btn" @click="deleteCertificate(index, 'feed')">
                  <icon type="cancel" size="16" color="#fff"></icon>
                </view>
              </view>
              <view class="upload-box add-box" @click="chooseFeedCertificate">
                <icon type="camera" size="24" color="#999"></icon>
                <text class="upload-text">上传报告</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">养殖周期(天)</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('breedingCycle')">
              <text class="input-text">{{TraceabilityInfo.breedingCycle || '点击输入养殖周期'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">防疫记录</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('epidemicPrevention')">
              <text class="input-text">{{TraceabilityInfo.epidemicPrevention || '点击输入防疫情况'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">养殖环境描述</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('breedingEnvironment')">
              <text class="input-text">{{TraceabilityInfo.breedingEnvironment || '点击输入环境描述'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">养殖方式</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('breedingMethod')">
              <text class="input-text">{{TraceabilityInfo.breedingMethod || '点击输入养殖方式'}}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加工类详情 -->
      <view class="form-section" v-if="classificationIndex === 2">
        <view class="section-header">
          <text class="section-title">加工信息</text>
          <text class="section-desc">消费者最关心添加剂与卫生情况</text>
        </view>
        
        <view class="form-item">
          <view class="item-label">加工原料 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('processingMaterials')">
              <text class="input-text">{{TraceabilityInfo.processingMaterials || '点击输入加工原料'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">食品添加剂</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('foodAdditives')">
              <text class="input-text">{{TraceabilityInfo.foodAdditives || '点击输入添加剂信息'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">加工工艺</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('processingTechnology')">
              <text class="input-text">{{TraceabilityInfo.processingTechnology || '点击输入加工工艺'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">加工环境检测</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('processingEnvironment')">
              <text class="input-text">{{TraceabilityInfo.processingEnvironment || '点击输入检测结果'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">加工设备编号</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('processingEquipment')">
              <text class="input-text">{{TraceabilityInfo.processingEquipment || '点击输入设备编号'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">加工卫生许可证</view>
          <view class="item-content">
            <view class="upload-container">
              <view class="upload-box" v-for="(item, index) in processingCertImages" :key="index">
                <image :src="item" mode="aspectFill" class="upload-image"></image>
                <view class="delete-btn" @click="deleteCertificate(index, 'processing')">
                  <icon type="cancel" size="16" color="#fff"></icon>
                </view>
              </view>
              <view class="upload-box add-box" @click="chooseProcessingCertificate">
                <icon type="camera" size="24" color="#999"></icon>
                <text class="upload-text">上传证书</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 其他类详情 -->
      <view class="form-section" v-if="classificationIndex === 3">
        <view class="section-header">
          <text class="section-title">产品信息</text>
          <text class="section-desc">消费者最关心材质与安全性</text>
        </view>
        
        <view class="form-item">
          <view class="item-label">产品材质 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('productMaterial')">
              <text class="input-text">{{TraceabilityInfo.productMaterial || '点击输入产品材质'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">生产厂家 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('manufacturer')">
              <text class="input-text">{{TraceabilityInfo.manufacturer || '点击输入生产厂家'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">生产地址 <text class="required-mark">*</text></view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('manufacturerAddress')">
              <text class="input-text">{{TraceabilityInfo.manufacturerAddress || '点击输入生产地址'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">联系方式</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('manufacturerPhone')">
              <text class="input-text">{{TraceabilityInfo.manufacturerPhone || '点击输入联系电话'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">产品认证</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('productCertification')">
              <text class="input-text">{{TraceabilityInfo.productCertification || '点击输入认证信息'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">安全检测报告</view>
          <view class="item-content">
            <view class="upload-container">
              <view class="upload-box" v-for="(item, index) in otherCertImages" :key="index">
                <image :src="item" mode="aspectFill" class="upload-image"></image>
                <view class="delete-btn" @click="deleteCertificate(index, 'other')">
                  <icon type="cancel" size="16" color="#fff"></icon>
                </view>
              </view>
              <view class="upload-box add-box" @click="chooseOtherCertificate">
                <icon type="camera" size="24" color="#999"></icon>
                <text class="upload-text">上传报告</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 通用信息 -->
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">通用信息</text>
          <text class="section-desc">消费者关注的附加信息</text>
        </view>
        
        <view class="form-item">
          <view class="item-label">运输方式</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('transportMethod')">
              <text class="input-text">{{TraceabilityInfo.transportMethod || '点击输入运输方式'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">储存条件</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('storageConditions')">
              <text class="input-text">{{TraceabilityInfo.storageConditions || '点击输入储存条件'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">保质期(天)</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('shelfLife')">
              <text class="input-text">{{TraceabilityInfo.shelfLife || '点击输入保质期'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">营养价值</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('nutritionValue')">
              <text class="input-text">{{TraceabilityInfo.nutritionValue || '点击输入营养价值'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">食用方法</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('cookingMethod')">
              <text class="input-text">{{TraceabilityInfo.cookingMethod || '点击输入食用方法'}}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">溯源凭证</view>
          <view class="item-content">
            <view class="upload-container">
              <view class="upload-box" v-for="(item, index) in certificateImages" :key="index">
                <image :src="item" mode="aspectFill" class="upload-image"></image>
                <view class="delete-btn" @click="deleteCertificate(index, 'general')">
                  <icon type="cancel" size="16" color="#fff"></icon>
                </view>
              </view>
              <view class="upload-box add-box" @click="chooseCertificateImage">
                <icon type="camera" size="24" color="#999"></icon>
                <text class="upload-text">上传凭证</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="item-label">备注信息</view>
          <view class="item-content">
            <view class="input-field" @click="openPopup('notes')">
              <text class="input-text">{{TraceabilityInfo.notes || '点击输入备注信息'}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-container">
      <button class="submit-button" @click="submit" :disabled="isSubmitting">
        {{isSubmitting ? '提交中...' : '提交溯源信息'}}
      </button>
    </view>
    
    <!-- 底部提示 -->
    <view class="footer-tip">
      <text>注：<text class="required-mark">*</text> 为必填项，完整填写可提升消费者信任度</text>
    </view>
    
    <!-- 弹出层 -->
    <uni-popup ref="popup" type="bottom" border-radius="12rpx 12rpx 0 0">
      <view class="popup-content">
        <input v-model="currentInputValue" placeholder="请输入" class="popup-input"
          @confirm="handleInputConfirm" @blur="handleInputBlur" />
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import { api } from '@/api/index.js'
  
  export default {
    data() {
      return {
        TraceabilityInfo: {
          Students: "", // 产地
          productionDate: "", // 生产日期
          batchNumber: "", // 批次号
          // 种植类
          pesticideName: "", // 农药名称
          pesticideTimes: "", // 农药使用次数
          lastPesticideDate: "", // 最后一次使用日期
          irrigationWater: "", // 灌溉水源
          plantingCycle: "", // 种植周期
          soilType: "", // 土壤类型
          // 养殖类
          feedName: "", // 饲料名称
          feedSource: "", // 饲料来源
          breedingCycle: "", // 养殖周期
          epidemicPrevention: "", // 防疫记录
          breedingEnvironment: "", // 养殖环境描述
          breedingMethod: "", // 养殖方式
          // 加工类
          processingMaterials: "", // 加工原料
          foodAdditives: "", // 食品添加剂
          processingTechnology: "", // 加工工艺
          processingEnvironment: "", // 加工环境检测
          processingEquipment: "", // 加工设备编号
          // 其他类
          productMaterial: "", // 产品材质
          manufacturer: "", // 生产厂家
          manufacturerAddress: "", // 生产地址
          manufacturerPhone: "", // 联系电话
          productCertification: "", // 产品认证
          // 通用
          transportMethod: "", // 运输方式
          storageConditions: "", // 储存条件
          shelfLife: "", // 保质期
          nutritionValue: "", // 营养价值
          cookingMethod: "", // 食用方法
          notes: "" // 备注
        },
        CLASSIFICATION: ['种植', '养殖', '加工', '其他'],
        classificationIndex: 0, // 产品分类索引
        index: 0,
        commodityLis: [], // 已上架的菜品
        commodityTempLis: [], // 临时展示的上架菜品
        currentInputValue: "", // 临时输入值
        currentInputField: "",
        isSubmitting: false, // 提交状态
        // 证书图片
        certificateImages: [], // 通用凭证图片
        feedCertImages: [], // 饲料检测报告
        pesticideCertImages: [], // 农残检测报告
        processingCertImages: [], // 加工卫生许可证
        otherCertImages: [] // 其他类安全检测报告
      };
    },
    computed: {
      // 表单完成率
      formCompletionRate() {
        const requiredFields = [
          'Students', 'productionDate', 
          {key: 'feedName', show: this.classificationIndex === 1},
          {key: 'pesticideName', show: this.classificationIndex === 0},
          {key: 'processingMaterials', show: this.classificationIndex === 2},
          {key: 'productMaterial', show: this.classificationIndex === 3},
          // 证书检查
          {key: 'feedCertImages', show: this.classificationIndex === 1, check: () => this.feedCertImages.length > 0},
          {key: 'pesticideCertImages', show: this.classificationIndex === 0, check: () => this.pesticideCertImages.length > 0},
          {key: 'processingCertImages', show: this.classificationIndex === 2, check: () => this.processingCertImages.length > 0},
          {key: 'otherCertImages', show: this.classificationIndex === 3, check: () => this.otherCertImages.length > 0}
        ];
        
        let completed = 0;
        let total = 0;
        
        requiredFields.forEach(field => {
          if (field.show === undefined || field.show) {
            total++;
            if (field.check) {
              completed += field.check() ? 1 : 0;
            } else {
              completed += this.TraceabilityInfo[field.key] ? 1 : 0;
            }
          }
        });
        
        return Math.round((completed / total) * 100);
      }
    },
    onLoad() {
      this.loadCommodityList();
    },
    methods: {
      // 加载商品列表
      loadCommodityList() {
        api.myShoplist({
          isshow: 1
        }).then((data) => {
          this.commodityLis = data.data.listdata || [];
          this.commodityTempLis = this.commodityLis.map((item) => item.commodity_name);
        }).catch(err => {
          console.error('加载商品列表失败', err);
        });
      },
      
      // 产品分类选择
      changeClassification(e) {
        this.classificationIndex = e.detail.value;
      },
      
      // 打开地图选择地址
      openLocationPicker() {
        wx.chooseLocation({
          success: (res) => {
            this.TraceabilityInfo.Students = res.name + res.address;
            wx.showToast({
              title: '已选择地址',
              icon: 'success',
              duration: 1500
            });
          }
        });
      },
      
      // 选择各类证书图片
      chooseFeedCertificate() {
        wx.chooseImage({
          count: 3 - this.feedCertImages.length,
          success: (res) => {
            this.feedCertImages = this.feedCertImages.concat(res.tempFilePaths);
          }
        });
      },
      
      choosePesticideCertificate() {
        wx.chooseImage({
          count: 3 - this.pesticideCertImages.length,
          success: (res) => {
            this.pesticideCertImages = this.pesticideCertImages.concat(res.tempFilePaths);
          }
        });
      },
      
      chooseProcessingCertificate() {
        wx.chooseImage({
          count: 3 - this.processingCertImages.length,
          success: (res) => {
            this.processingCertImages = this.processingCertImages.concat(res.tempFilePaths);
          }
        });
      },
      
      chooseOtherCertificate() {
        wx.chooseImage({
          count: 3 - this.otherCertImages.length,
          success: (res) => {
            this.otherCertImages = this.otherCertImages.concat(res.tempFilePaths);
          }
        });
      },
      
      chooseCertificateImage() {
        wx.chooseImage({
          count: 3 - this.certificateImages.length,
          success: (res) => {
            this.certificateImages = this.certificateImages.concat(res.tempFilePaths);
          }
        });
      },
      
      // 删除证书图片
      deleteCertificate(index, type) {
        if (type === 'feed') {
          this.feedCertImages.splice(index, 1);
        } else if (type === 'pesticide') {
          this.pesticideCertImages.splice(index, 1);
        } else if (type === 'processing') {
          this.processingCertImages.splice(index, 1);
        } else if (type === 'other') {
          this.otherCertImages.splice(index, 1);
        } else {
          this.certificateImages.splice(index, 1);
        }
      },
      
      // 提交表单
      submit() {
        // 基础验证
        if (!this.TraceabilityInfo.Students) {
          wx.showToast({ title: '请填写产地', icon: 'none' });
          return;
        }
        
        if (!this.TraceabilityInfo.productionDate) {
          wx.showToast({ title: '请选择生产日期', icon: 'none' });
          return;
        }
        
        // 分类验证
        if (this.classificationIndex === 1) {
          if (!this.TraceabilityInfo.feedName) {
            wx.showToast({ title: '请填写饲料名称', icon: 'none' });
            return;
          }
          if (!this.TraceabilityInfo.feedSource) {
            wx.showToast({ title: '请填写饲料来源', icon: 'none' });
            return;
          }
          if (this.feedCertImages.length === 0) {
            wx.showToast({ title: '请上传饲料检测报告', icon: 'none' });
            return;
          }
        }
        
        if (this.classificationIndex === 0) {
          if (!this.TraceabilityInfo.pesticideName) {
            wx.showToast({ title: '请填写农药名称', icon: 'none' });
            return;
          }
          if (this.pesticideCertImages.length === 0) {
            wx.showToast({ title: '请上传农残检测报告', icon: 'none' });
            return;
          }
        }
        
        if (this.classificationIndex === 2) {
          if (!this.TraceabilityInfo.processingMaterials) {
            wx.showToast({ title: '请填写加工原料', icon: 'none' });
            return;
          }
          if (this.processingCertImages.length === 0) {
            wx.showToast({ title: '请上传加工卫生许可证', icon: 'none' });
            return;
          }
        }
        
        if (this.classificationIndex === 3) {
          if (!this.TraceabilityInfo.productMaterial) {
            wx.showToast({ title: '请填写产品材质', icon: 'none' });
            return;
          }
          if (!this.TraceabilityInfo.manufacturer) {
            wx.showToast({ title: '请填写生产厂家', icon: 'none' });
            return;
          }
          if (!this.TraceabilityInfo.manufacturerAddress) {
            wx.showToast({ title: '请填写生产地址', icon: 'none' });
            return;
          }
          if (this.otherCertImages.length === 0) {
            wx.showToast({ title: '请上传安全检测报告', icon: 'none' });
            return;
          }
        }
        
        this.isSubmitting = true;
        
        // 构建参数并提交
        const params = {
          ...this.TraceabilityInfo,
          commodity_id: this.commodityLis[this.index].commodity_id,
          classification: this.classificationIndex,
          formCompletionRate: this.formCompletionRate
        };
        
        // 上传图片
        const uploadTasks = [];
        
        if (this.certificateImages.length > 0) {
          uploadTasks.push(this.uploadImages(this.certificateImages, 'certificate'));
        }
        
        if (this.classificationIndex === 0 && this.pesticideCertImages.length > 0) {
          uploadTasks.push(this.uploadImages(this.pesticideCertImages, 'pesticide'));
        }
        
        if (this.classificationIndex === 1 && this.feedCertImages.length > 0) {
          uploadTasks.push(this.uploadImages(this.feedCertImages, 'feed'));
        }
        
        if (this.classificationIndex === 2 && this.processingCertImages.length > 0) {
          uploadTasks.push(this.uploadImages(this.processingCertImages, 'processing'));
        }
        
        if (this.classificationIndex === 3 && this.otherCertImages.length > 0) {
          uploadTasks.push(this.uploadImages(this.otherCertImages, 'other'));
        }
        
        // 等待所有图片上传完成后提交表单
        Promise.all(uploadTasks).then(results => {
          // 处理上传结果
          results.forEach(result => {
            if (result.type === 'certificate') {
              params.certificateUrls = result.urls;
            } else if (result.type === 'pesticide') {
              params.pesticideCertUrls = result.urls;
            } else if (result.type === 'feed') {
              params.feedCertUrls = result.urls;
            } else if (result.type === 'processing') {
              params.processingCertUrls = result.urls;
            } else if (result.type === 'other') {
              params.otherCertUrls = result.urls;
            }
          });
          
          // 提交表单数据
          api.submitTraceabilityInfo(params).then(res => {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            });
            
            // 返回上一页
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
          }).catch(err => {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000
            });
            console.error('提交失败', err);
          }).finally(() => {
            this.isSubmitting = false;
          });
        }).catch(err => {
          wx.showToast({
            title: '图片上传失败',
            icon: 'none',
            duration: 2000
          });
          console.error('图片上传失败', err);
          this.isSubmitting = false;
        });
      },
      
      // 上传图片
      uploadImages(filePaths, type) {
        return new Promise((resolve, reject) => {
          const urls = [];
          let uploadedCount = 0;
          
          filePaths.forEach((filePath, index) => {
            wx.uploadFile({
              url: 'https://your-api-domain.com/upload', // 替换为实际的上传接口
              filePath: filePath,
              name: 'file',
              formData: {
                type: type
              },
              success: (res) => {
                const data = JSON.parse(res.data);
                if (data.code === 0) {
                  urls.push(data.data.url);
                } else {
                  reject(new Error(`图片上传失败: ${data.msg}`));
                }
              },
              fail: (err) => {
                reject(err);
              },
              complete: () => {
                uploadedCount++;
                if (uploadedCount === filePaths.length) {
                  resolve({ type: type, urls: urls });
                }
              }
            });
          });
        });
      },
      
      // 打开弹出层
      openPopup(field) {
        this.currentInputField = field;
        this.currentInputValue = this.TraceabilityInfo[field] || '';
        this.$refs.popup.open();
      },
      
      // 处理输入确认
      handleInputConfirm() {
        if (this.currentInputField) {
          this.TraceabilityInfo[this.currentInputField] = this.currentInputValue;
        }
        this.$refs.popup.close();
      }
    }
  };
</script>

<style>
/* 页面整体样式 */
.traceability-page {
  padding: 30rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 顶部状态与标题 */
.header-container {
  margin-bottom: 30rpx;
}

.progress-bar {
  height: 12rpx;
  background-color: #e5e9f2;
  border-radius: 6rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.progress-value {
  height: 100%;
  background-color: #36a3ff;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.header-content {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.header-subtitle {
  font-size: 26rpx;
  color: #666;
}

/* 消费视角提示 */
.consumer-tip {
  background-color: #fffbeb;
  border-radius: 12rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 30rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #8c6d31;
  line-height: 1.5;
}

/* 表单容器 */
.form-container {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

/* 表单分区 */
.form-section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-desc {
  font-size: 24rpx;
  color: #999;
  padding: 4rpx 12rpx;
  background-color: #f5f7fa;
  border-radius: 8rpx;
}

/* 表单项目 */
.form-item {
  margin-bottom: 30rpx;
}

.item-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.required-mark {
  color: #ff4d4f;
  margin-left: 4rpx;
}

.item-content {
  position: relative;
}

/* 选择器样式 */
.picker-text {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eee;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.picker-text::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24rpx;
  height: 24rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23999' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
}

/* 位置选择器 */
.location-picker {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eee;
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.location-text {
  flex: 1;
}

/* 输入字段 */
.input-field {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eee;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.input-field::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24rpx;
  height: 24rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23999' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
}

/* 上传容器 */
.upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.upload-box {
  width: calc(33.33% - 14rpx);
  height: 200rpx;
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
  background-color: #f5f7fa;
  border: 1rpx dashed #ddd;
}

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-text {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #999;
}

/* 提交按钮 */
.submit-container {
  margin: 40rpx 0;
}

.submit-button {
  width: 100%;
  height: 90rpx;
  background-color: #36a3ff;
  color: #fff;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(54, 163, 255, 0.3);
  transition: all 0.3s ease;
}

.submit-button:active {
  background-color: #1890ff;
  box-shadow: 0 4rpx 12rpx rgba(54, 163, 255, 0.3);
}

.submit-button:disabled {
  background-color: #e6f7ff;
  color: #36a3ff;
  box-shadow: none;
  cursor: not-allowed;
}

/* 底部提示 */
.footer-tip {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-bottom: 40rpx;
}

/* 弹出层样式 */
.popup-content {
  padding: 40rpx 30rpx;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
}

.popup-input {
  width: 100%;
  height: 88rpx;
  border: none;
  border-bottom: 1rpx solid #eee;
  font-size: 32rpx;
  color: #333;
  outline: none;
}
</style>