<template>
  <div class="wholesale-quote-container">
    <!-- 商品信息卡片 -->
    <div class="commodity-card elevation-2">
      <div class="media-container">
        <img :src="product.cover" class="product-image" alt="商品主图">
        <div class="tag-group">
          <span class="tag" v-for="tag in product.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="meta-section">
        <h2 class="product-title">{{ product.name }}</h2>
        <div class="spec-grid">
          <div class="spec-item" v-for="(spec, index) in product.specs" :key="index">
            <span class="spec-label">{{ spec.key }}：</span>
            <span class="spec-value">{{ spec.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 阶梯报价区 -->
    <div class="price-tier-section elevation-1">
      <h3 class="section-title">批量采购价</h3>
      <div class="tier-scroll">
        <div v-for="(tier, index) in priceTiers" 
             :key="index"
             class="tier-card"
             :class="{ 'active-tier': activeTierIndex === index }"
             @click="selectTier(index)">
          <div class="tier-header">
            <span class="tier-quantity">{{ tier.min }}+</span>
            <span class="unit">{{ product.unit }}</span>
          </div>
          <div class="tier-price">
            <span class="currency">¥</span>
            <span class="amount">{{ tier.price.toFixed(2) }}</span>
          </div>
          <div class="tier-save" v-if="tier.saving">立省{{ tier.saving }}%</div>
        </div>
      </div>
    </div>

    <!-- 报价控制区 -->
    <div class="quote-control elevation-1">
      <div class="input-group">
        <label class="input-label">采购数量</label>
        <div class="quantity-control">
          <button class="btn-operator" @click="adjustQuantity(-10)">-</button>
          <input v-model.number="form.quantity" 
                 type="number"
                 class="quantity-input"
                 min="1"
                 @input="validateQuantity">
          <button class="btn-operator" @click="adjustQuantity(10)">+</button>
        </div>
        <span class="unit">{{ product.unit }}</span>
      </div>

      <div class="discount-control">
        <div class="slider-header">
          <span>折扣比例</span>
          <span class="discount-value">{{ form.discount }}%</span>
        </div>
        <el-slider v-model="form.discount" 
                   :max="maxDiscount"
                   :format-tooltip="val => `${val}%`"
                   @change="calculatePrice"/>
      </div>
    </div>

    <!-- 成本计算区 -->
    <div class="calculation-section elevation-2">
      <div class="result-card">
        <div class="result-item">
          <span class="label">商品总价</span>
          <span class="value">¥{{ calculations.grossAmount.toFixed(2) }}</span>
        </div>
        <div class="result-item">
          <span class="label">物流费用</span>
          <span class="value">+ ¥{{ form.logistics.toFixed(2) }}</span>
        </div>
        <div class="result-item highlight">
          <span class="label">报价总额</span>
          <span class="value">¥{{ calculations.netAmount.toFixed(2) }}</span>
        </div>
      </div>
      
      <div class="profit-display" :class="profitStatus">
        <span class="profit-label">预期利润率</span>
        <span class="profit-value">{{ calculations.profitMargin.toFixed(1) }}%</span>
      </div>
    </div>

    <!-- 操作按钮组 -->
    <div class="action-bar">
      <button class="btn secondary" @click="saveDraft">
        <i class="icon-save"></i>
        保存草稿
      </button>
      <button class="btn primary" @click="submitQuote">
        <i class="icon-submit"></i>
        提交报价
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {
        id: 'P2024VIP001',
        name: '特级宁夏枸杞（500g精装）',
        cover: '',
        unit: '箱',
        tags: ['有机认证', '免洗包装', '冷链运输'],
        specs: [
          { key: '等级', value: '特级AAA' },
          { key: '含水量', value: '≤12.5%' },
          { key: '产地', value: '宁夏中宁核心产区' },
          { key: '保质期', value: '18个月' }
        ],
        basePrice: 45.0
      },
      priceTiers: [
        { min: 50, price: 42.8, saving: 5 },
        { min: 100, price: 39.9, saving: 11 },
        { min: 500, price: 35.0, saving: 22 }
      ],
      form: {
        quantity: 100,
        discount: 5,
        logistics: 150.0
      },
      calculations: {
        grossAmount: 0,
        netAmount: 0,
        profitMargin: 0
      },
      activeTierIndex: 1,
      maxDiscount: 15
    }
  },
  computed: {
    profitStatus() {
      const margin = this.calculations.profitMargin
      return {
        'profit-good': margin >= 20,
        'profit-warn': margin < 10,
        'profit-normal': margin >= 10 && margin < 20
      }
    }
  },
  methods: {
    selectTier(index) {
      this.activeTierIndex = index
      this.form.quantity = this.priceTiers[index].min
      this.calculatePrice()
    },
    adjustQuantity(step) {
      this.form.quantity = Math.max(
        this.priceTiers[0].min, 
        this.form.quantity + step
      )
      this.calculatePrice()
    },
    validateQuantity() {
      this.form.quantity = Math.max(
        this.priceTiers[0].min, 
        parseInt(this.form.quantity) || this.priceTiers[0].min
      )
    },
    calculatePrice() {
      const tier = this.priceTiers
        .sort((a,b) => b.min - a.min)
        .find(t => this.form.quantity >= t.min)
      
      const baseAmount = this.form.quantity * tier.price
      const discount = baseAmount * (this.form.discount / 100)
      const totalCost = this.product.basePrice * this.form.quantity + this.form.logistics
      
      this.calculations.grossAmount = baseAmount - discount
      this.calculations.netAmount = this.calculations.grossAmount + this.form.logistics
      this.calculations.profitMargin = 
        ((this.calculations.netAmount - totalCost) / totalCost * 100)
    },
    submitQuote() {
      // 提交逻辑
    }
  },
  mounted() {
    this.calculatePrice()
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #4CD964;
$secondary-color: #2196F3;
$error-color: #FF5252;

.wholesale-quote-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8f9fa;
}

.commodity-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .media-container {
    position: relative;
    .product-image {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }
    .tag-group {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      .tag {
        background: rgba($primary-color, 0.9);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        margin-right: 8px;
      }
    }
  }
  
  .meta-section {
    padding: 1.5rem;
    .product-title {
      margin: 0 0 1rem;
      color: #333;
    }
    .spec-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      .spec-item {
        background: #f5f6fa;
        padding: 8px 12px;
        border-radius: 6px;
        .spec-label {
          color: #666;
          margin-right: 8px;
        }
      }
    }
  }
}

.price-tier-section {
  margin-top: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  
  .tier-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 8px;
    
    .tier-card {
      flex: 0 0 200px;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.3s;
      
      &.active-tier {
        border-color: $primary-color;
        background: rgba($primary-color, 0.05);
      }
      
      .tier-price {
        font-size: 1.5rem;
        color: #333;
        .currency {
          font-size: 0.8em;
        }
      }
      .tier-save {
        color: $primary-color;
        font-weight: 500;
      }
    }
  }
}

.quote-control {
  margin-top: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  
  .quantity-control {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
    
    .btn-operator {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f6fa;
      border: none;
      cursor: pointer;
    }
    
    .quantity-input {
      width: 100px;
      text-align: center;
      padding: 8px;
      border: 1px solid #eee;
      border-radius: 6px;
    }
  }
}

.calculation-section {
  margin-top: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  
  .result-item {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    &.highlight {
      font-weight: 600;
      color: $primary-color;
    }
  }
  
  .profit-display {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    
    &.profit-good { background: rgba($primary-color, 0.1); }
    &.profit-normal { background: rgba(#FFA726, 0.1); }
    &.profit-warn { background: rgba($error-color, 0.1); }
  }
}

.action-bar {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  
  .btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    
    &.primary {
      background: $primary-color;
      color: white;
    }
    &.secondary {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
    }
  }
}

@media (max-width: 768px) {
  .wholesale-quote-container {
    padding: 1rem;
  }
  
  .spec-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
