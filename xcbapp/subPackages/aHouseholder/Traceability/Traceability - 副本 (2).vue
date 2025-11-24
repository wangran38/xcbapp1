<template>
  <view class="traceability-page">
    <!-- 功能描述展示区域 -->
    <view class="function-description">
      <text class="description-title">产品溯源信息录入功能介绍\n</text>
      <text class="description-text">在本APP中，添加产品溯源信息对您的摊位来说意义重大哦！通过完善产品溯源相关内容，像产品的生源地、生产日期、饲料及农药等详细信息，能够让您摊位所售卖的产品信息更加透明、可追溯。这有助于提高客户对产品质量和安全性的信任度，同时平台会根据摊位是否完整准确地添加产品溯源信息，将具备完整溯源信息的摊位优先推荐给客户，使您的摊位在众多摊位中更具竞争力，更易被客户发现和选择，进而提升摊位的经营效益呢，所以请您认真填写以下溯源信息呀。</text>
    </view>
    <uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
      <view class="popup-content">
        <input v-model="TraceabilityInfo[currentInputField]" placeholder="请输入" class="popup-input"
          @confirm="handleInputConfirm" @blur="handleInputBlur" />
      </view>
    </uni-popup>
    <view class="form-container">
      <table class="form-table">
        <tr>
          <th>产品</th>
          <td>
            <picker @change="bindPickerChange" class="input-field" :range="commodityTempLis" :value="index">
              <view>{{commodityLis[index].commodity_name}}</view>
            </picker>
          </td>
        </tr>
        <tr>
          <th>生源地</th>
          <td>
            <view class="input-field" @click="openPopup('Students')">
              {{TraceabilityInfo.Students || '点击输入生源地'}}</view>
          </td>
        </tr>
		
		
        <tr>
          <th>生产日期</th>
          <td>
            <view>
              <uni-datetime-picker type="date" :clear-icon="false"
                v-model="TraceabilityInfo.productionDate" return-type="timestamp" />
            </view>
          </td>
        </tr>
		
<!-- 		<tr>
		  <th>产品分类</th>
		  <td>
		    <picker @change="bindPickerChange" class="input-field" :range="CLASSIFICATION" :value="index">
		      <view>{{CLASSIFICATION[0]}}</view>
		    </picker>
		  </td>
		</tr> -->
		
        <tr>
          <th rowspan="4">养殖类</th>
          <td>
            <view class="input-field" @click="openPopup('feedName')">
              {{TraceabilityInfo.feedName || '点击输入饲料名称'}}</view>
          </td>
        </tr>
        <tr>
          <td>
            <view class="input-field" @click="openPopup('feedSource')">
              {{TraceabilityInfo.feedSource || '点击输入饲料来源'}}</view>
          </td>
        </tr>
        <tr>
          <td>
            <view class="input-field" @click="openPopup('feedFactoryAddress')">
              {{TraceabilityInfo.feedFactoryAddress || '点击输入饲料厂家地址'}}</view>
          </td>
        </tr>
        <tr>
          <td>
            <view class="input-field" @click="openPopup('feedFactoryPhone')">
              {{TraceabilityInfo.feedFactoryPhone || '点击输入饲料厂家电话'}}</view>
          </td>
        </tr>
        <tr>
          <th rowspan="4">种植类</th>
          <td>
            <view class="input-field" @click="openPopup('pesticideName')">
              {{TraceabilityInfo.pesticideName || '点击输入农药名称'}}</view>
          </td>
        </tr>
        <tr>
          <td>
            <view class="input-field" @click="openPopup('pesticideSource')">
              {{TraceabilityInfo.pesticideSource || '点击输入农药来源'}}</view>
          </td>
        </tr>
        <tr>
          <td>
            <view class="input-field" @click="openPopup('storeAddress')">
              {{TraceabilityInfo.storeAddress || '点击输入店铺地址'}}</view>
          </td>
        </tr>
        <tr>
          <td>
            <view class="input-field" @click="openPopup('storePhone')">
              {{TraceabilityInfo.storePhone || '点击输入药店电话'}}</view>
          </td>
        </tr>
        <tr>
			
<!-- 			<tr>
			  <th rowspan="4">加工类</th>
			  <td>
			    <view class="input-field" @click="openPopup('pesticideName')">
			      {{TraceabilityInfo.pesticideName || '点击输入农药名称'}}</view>
			  </td>
			</tr>
			<tr>
			  <td>
			    <view class="input-field" @click="openPopup('pesticideSource')">
			      {{TraceabilityInfo.pesticideSource || '点击输入农药来源'}}</view>
			  </td>
			</tr>
			<tr>
			  <td>
			    <view class="input-field" @click="openPopup('storeAddress')">
			      {{TraceabilityInfo.storeAddress || '点击输入店铺地址'}}</view>
			  </td>
			</tr>
			<tr>
			  <td>
			    <view class="input-field" @click="openPopup('storePhone')">
			      {{TraceabilityInfo.storePhone || '点击输入药店电话'}}</view>
			  </td>
			</tr>
			<tr> -->
				
				
	<!-- 			<tr>
				  <th rowspan="4">其他(工业制品，日常用品)</th>
				  <td>
				    <view class="input-field" @click="openPopup('pesticideName')">
				      {{TraceabilityInfo.pesticideName || '点击输入农药名称'}}</view>
				  </td>
				</tr>
				<tr>
				  <td>
				    <view class="input-field" @click="openPopup('pesticideSource')">
				      {{TraceabilityInfo.pesticideSource || '点击输入农药来源'}}</view>
				  </td>
				</tr>
				<tr>
				  <td>
				    <view class="input-field" @click="openPopup('storeAddress')">
				      {{TraceabilityInfo.storeAddress || '点击输入店铺地址'}}</view>
				  </td>
				</tr>
				<tr>
				  <td>
				    <view class="input-field" @click="openPopup('storePhone')">
				      {{TraceabilityInfo.storePhone || '点击输入药店电话'}}</view>
				  </td>
				</tr>
				<tr> -->
          <th>备注</th>
          <td>
            <view class="input-field" @click="openPopup('storePhone')">
              {{TraceabilityInfo.notes || '点击输入备注信息'}}</view>
          </td>
        </tr>
        <tr>
          <th colspan="2">
            <button class="submit-button" @click="submit">提交信息</button>
          </th>
        </tr>
      </table>
    </view>
  </view>
</template>

<script>
  import { api } from '@/api/index.js'
  import {
  	myMixin
  } from '@/utils/public.js'
  export default {
    data() {
      return {
        TraceabilityInfo: {
          Students: "", // 生源地
          productionDate: "", // 生产日期
          feedName: "", // 饲料名称
          feedSource: "", // 饲料来源
          feedFactoryAddress: "", // 饲料厂家地址
          feedFactoryPhone: "", // 饲料厂家电话
          pesticideName: "", // 农药名称
          pesticideSource: "", // 农药来源
          storePhone: '', // 药店电话
          storeAddress: '', // 店铺地址
          notes: ''
        },
		CLASSIFICATION:['种植','养殖','加工','其他'],
        index: 0,
        commodityLis: [], // 已上架的菜品
        commodityTempLis: [], // 临时展示的上架菜品
        currentInputValue: "", // 临时变量
        currentInputField: ""
      };
    },
    onLoad() {
      api.myShoplist({
        isshow: 1
      }).then((data) => {
        this.commodityLis = data.data.listdata
        this.commodityTempLis = this.commodityLis.map((item) => item.commodity_name)
      })
    },
    methods: {
      bindPickerChange(e) {
        this.index = e.detail.value
      },
      submit() {
        // 构建请求参数
        api.addTraceability({
          commodity_id: this.commodityLis[this.index].id,
          baddress: this.TraceabilityInfo.Students,
          btime: this.TraceabilityInfo.productionDate,
          fodder: this.TraceabilityInfo.feedName,
          fodderfrom: this.TraceabilityInfo.feedSource,
          fodderaddress: this.TraceabilityInfo.feedFactoryAddress,
          fodderphone: this.TraceabilityInfo.feedFactoryPhone,
          pesticide: this.TraceabilityInfo.pesticideName,
          pesticidefrom: this.TraceabilityInfo.pesticideSource,
          pesticideaddress: this.TraceabilityInfo.storeAddress,
          pesticidephone: this.TraceabilityInfo.storePhone,
        }).then((data) => {
          console.log(data)
        })
      },
      // 打开蒙层
      openPopup(field) {
        this.currentInputField = field;
        this.$refs.popup.open();
      },
      handleInputBlur() {
        // 失去焦点时也关闭弹框
        this.$refs.popup.close();
      }
    }
  };
</script>

<style>
  ::v-deep .uni-date__x-input {
    font-size: 22px !important;
  }

.traceability-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f8f8;
    padding: 30px;
    box-sizing: border-box;
  }

.function-description {
    width: 100%;
    max-width: 600px;
    background-color: #fdfdfd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
  }

 .description-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

 .description-text {
    font-size: 18px;
    color: #666;
    line-height: 1.5;
  }

 .form-container {
    width: 100%;
    max-width: 600px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

 .form-table {
    width: 100%;
    border-collapse: collapse;
  }

 .form-table tr {
    border: 1px solid #ccc;
    border-bottom: none;
    /* 去掉默认的下边框，避免重复 */
  }

 .form-table tr:last-child {
    border-bottom: 1px solid #ccc;
    /* 最后一行保留下边框 */
  }

 .form-table th,
 .form-table td {
    padding: 15px;
    text-align: left;
  }

 .form-table th {
    /* width: 30%; */
    font-size: 30rpx;
	font-weight: bold;
    color: #666;
  }

 .form-table td {
    width: 70%;
  }

 .input-field {
    width: 100%;
    border-bottom: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 20px;
    cursor: pointer;
  }

 .submit-button {
    width: 100%;
    background-color: #007aff;
    color: white;
    border-radius: 5px;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    margin-top: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

 .submit-button:hover {
    background-color: #005580;
  }

 .input-field:focus {
    border-color: #007aff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 122, 255, 0.4);
  }

  /* 弹出层相关样式优化 */
 .uni-popup {
    display: flex;
    justify-content: center;
    align-items: center;
  }

 .popup-content {
    width: 80%;
    text-align: center;
  }

  /* 弹出层内 input 框样式优化 */
 .popup-input {
    text-align: left;
    width: 100%;
    padding: 20px;
    border: none;
    font-size: 20px;
    color: #333;
    transition: all 0.3s ease;
    background-color: transparent;
  }

 .popup-input:focus {
    border-bottom-color: #005580;
    outline: none;
    box-shadow: 0 3px 8px rgba(0, 85, 128, 0.4);
  }

  /* 新增弹出层背景样式 */
 .popup-content:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px 10px 0 0;
    z-index: -1;
  }
</style>