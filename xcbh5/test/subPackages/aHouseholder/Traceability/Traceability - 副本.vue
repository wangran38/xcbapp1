<template>
  <view class="traceability-page">
    <uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
      <view class="popup-content">
        <input v-model="TraceabilityInfo[currentInputField]" placeholder="请输入" class="popup-input" @confirm="handleInputConfirm"
          @blur="handleInputBlur"  maxlength="30" />
      </view>
    </uni-popup>
    <view class="form-container">
<!--      <view class="page-title">产品溯源信息录入</view> -->
      <view class="form-item">
        <view style="color: red;">*</view>
        <text class="label">产品:</text>
		<picker @change="bindPickerChange" class="input-field" :range="commodityTempLis" :value="index">
				<view>{{commodityLis[index].commodity_name}}</view>
		</picker>
        <!-- <view class="input-field">{{ '公鸡' }}</view> -->
      </view>
      <!-- 生源地 -->
      <view class="form-item">
        <view style="color: red;">*</view>
        <text class="label">生源地:</text>
        <view class="input-field" @click="openPopup('Students')">{{TraceabilityInfo.Students || '点击输入生源地'}}</view>
      </view>
      <!-- 生产日期 -->
      <view class="form-item">
        <view style="color: red;">*</view>
        <text class="label">生产日期:</text>
        <view class="input-field">
          <uni-datetime-picker type="date" :clear-icon="false" v-model="TraceabilityInfo.productionDate" return-type="timestamp"  />
		  </view>
      </view>
      <view class="form-item">
        <text class="label">饲料名称:</text>
        <view class="input-field" @click="openPopup('feedName')">{{TraceabilityInfo.feedName || '点击输入饲料名称'}}
        </view>
      </view>
      <view class="form-item">
        <text class="label">饲料来源:</text>
        <view class="input-field" @click="openPopup('feedSource')">{{TraceabilityInfo.feedSource || '点击输入饲料来源'}}
        </view>
      </view>
      <view class="form-item">
        <text class="label">饲料厂家地址:</text>
        <view class="input-field" @click="openPopup('feedFactoryAddress')">
          {{TraceabilityInfo.feedFactoryAddress || '点击输入饲料厂家地址'}}</view>
      </view>
      <view class="form-item">
        <text class="label">饲料厂家电话:</text>
        <view class="input-field" @click="openPopup('feedFactoryPhone')">
          {{TraceabilityInfo.feedFactoryPhone || '点击输入饲料厂家电话'}}</view>
      </view>
      <view class="form-item">
        <text class="label">农药名称:</text>
        <view class="input-field" @click="openPopup('pesticideName')">
          {{TraceabilityInfo.pesticideName || '点击输入农药名称'}}</view>
      </view>
      <view class="form-item">
        <text class="label">农药来源:</text>
        <view class="input-field" @click="openPopup('pesticideSource')">
          {{TraceabilityInfo.pesticideSource || '点击输入农药来源'}}</view>
      </view>
      <view class="form-item">
        <text class="label">店铺地址:</text>
        <view class="input-field" @click="openPopup('storeAddress')">
          {{TraceabilityInfo.storeAddress || '点击输入店铺地址'}}</view>
      </view>
      <view class="form-item">
        <text class="label">药店电话:</text>
        <view class="input-field" @click="openPopup('storePhone')">{{TraceabilityInfo.storePhone || '点击输入药店电话'}}
        </view>
      </view>
	  <view class="form-item">
	    <text class="label">备注:</text>
	    <view class="input-field" @click="openPopup('storePhone')">{{TraceabilityInfo.notes || '点击输入备注信息'}}
	    </view>
	  </view>
      <button class="submit-button" @click="submit">提交信息</button>
    </view>
  </view>
</template>

<script>
	import {api} from '@/api/index.js'
  export default {
    data() {
      return {
        TraceabilityInfo: {
          Students: "",   // 生源地
          productionDate: "", // 生产日期
          feedName: "", // 饲料名称
          feedSource: "",  // 饲料来源
          feedFactoryAddress: "", // 饲料厂家地址
          feedFactoryPhone: "", // 饲料厂家电话
          pesticideName: "", // 农药名称
          pesticideSource: "", // 农药来源
		  storePhone:'',   // 药店电话
		  storeAddress:'',  //店铺地址
		  notes:''
        },
		index:0,
		commodityLis:[], // 已上架的菜品
		commodityTempLis:[], // 临时展示的上架菜品
        currentInputValue: "",  // 临时变量
        currentInputField: ""
      };
    },
	onLoad() {
		api.myShoplist({
			isshow:1
		}).then((data)=>{
			this.commodityLis = data.data.listdata
			this.commodityTempLis = this.commodityLis.map((item)=>item.commodity_name)
		})
	},
    methods: {
		bindPickerChange(e){
			this.index = e.detail.value
		},
		submit(){
			// 构建请求参数
			api.addTraceability({
				commodity_id:this.commodityLis[this.index].id,
				baddress:this.TraceabilityInfo.Students,
				btime:this.TraceabilityInfo.productionDate,
				fodder:this.TraceabilityInfo.feedName,
				fodderfrom:this.TraceabilityInfo.feedSource,
				fodderaddress:this.TraceabilityInfo.feedFactoryAddress,
				fodderphone:this.TraceabilityInfo.feedFactoryPhone,
				pesticide:this.TraceabilityInfo.pesticideName,
				pesticidefrom:this.TraceabilityInfo.pesticideSource,
				pesticideaddress:this.TraceabilityInfo.storeAddress,
				pesticidephone:this.TraceabilityInfo.storePhone,
			}).then((data)=>{
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

.form-container {
    width: 100%;
    max-width: 600px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

.page-title {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
  }

.form-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }

.label {
    width: 320rpx;
    font-size: 22px;
    color: #666;
  }

.picker-text {
    background-color: gray;
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: center;
  }

.input-field {
    width: 100%;
    border: 1px solid #ccc;
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