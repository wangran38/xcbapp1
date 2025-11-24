"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    menuList: {
      type: Array,
      default: () => [
        {
          path: "/pages/myComplaint/myComplaint",
          label: "我的投诉"
        },
        {
          path: "/pages/orders/orders",
          label: "我的订单"
        }
      ]
    }
  },
  data() {
    return {
      isShowItem: false,
      position: {
        x: 0,
        y: 0
      },
      isExpanded: false,
      systemInfo: {},
      startY: 0,
      isDragging: false
    };
  },
  computed: {
    containerStyle() {
      return {
        width: `${this.systemInfo.windowWidth}px`,
        height: `${this.systemInfo.windowHeight}px`
      };
    }
  },
  mounted() {
    this.initPosition();
  },
  methods: {
    initPosition() {
      this.systemInfo = common_vendor.index.getSystemInfoSync();
      const savedPos = common_vendor.index.getStorageSync("floatPos") || {
        x: this.systemInfo.windowWidth - 80,
        y: this.systemInfo.windowHeight * 0.7
      };
      this.position = savedPos;
    },
    handleTouchStart(e) {
      this.startY = e.touches[0].clientY;
      this.isDragging = false;
    },
    // handleDrag(e) {
    // 	// 判断是否为有效拖拽（Y轴移动超过5px）
    // 	if (Math.abs(e.touches[0].clientY - this.startY) > 5) {
    // 		this.isDragging = true
    // 		this.position = {
    // 			x: e.detail.x,
    // 			y: e.detail.y
    // 		}
    // 	}
    // },
    handleTouchEnd() {
      if (!this.isDragging)
        return;
      this.autoDock();
      common_vendor.index.setStorageSync("floatPos", this.position);
    },
    autoDock() {
      const {
        windowWidth
      } = this.systemInfo;
      this.position.x = this.position.x > windowWidth / 2 ? windowWidth - 60 : 20;
    },
    toggleMenu() {
      this.isShowItem = !this.isShowItem;
      common_vendor.index.__f__("log", "at components/float-ball/float-ball.vue:103", this.isShowItem);
      if (this.isDragging)
        return;
      this.isExpanded = !this.isExpanded;
    },
    navigateTo(path) {
      this.isExpanded = false;
      this.isShowItem = false;
      common_vendor.index.navigateTo({
        url: path
      });
    },
    // containerStyle() {
    // 	return {
    // 		width: `${this.systemInfo.windowWidth}px`,
    // 		height: `${this.systemInfo.windowHeight}px`
    // 	}
    // },
    layoutParams() {
      const count = this.menuList.length;
      const minRadius = 60;
      const itemSize = 80;
      const radius = minRadius + Math.min(count, 6) * 8;
      const angleStep = Math.max(360 / count, 30);
      return {
        radius,
        angleStep,
        itemSize
      };
    },
    getSubStyle(index) {
      if (!this.isExpanded)
        return {
          opacity: 0
        };
      const {
        radius,
        angleStep,
        itemSize
      } = this.layoutParams;
      const angle = (-90 + angleStep * index) * Math.PI / 180;
      const diameter = itemSize / 2;
      return {
        transform: `translate(
			          ${Math.cos(angle) * radius - diameter}px,
			          ${Math.sin(angle) * radius - diameter}px
			        )`,
        width: `${itemSize}px`,
        height: `${itemSize}px`,
        transitionDelay: `${index * 30}ms`,
        opacity: 1,
        zIndex: this.menuList.length - index
        // 层级控制
      };
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.isExpanded ? "×" : "+"),
    b: $data.isExpanded ? 1 : "",
    c: common_vendor.o((...args) => $options.toggleMenu && $options.toggleMenu(...args)),
    d: common_vendor.f($props.menuList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: item.path,
        c: common_vendor.s($options.getSubStyle(index)),
        d: common_vendor.o(($event) => $options.navigateTo(item.path), item.path)
      };
    }),
    e: $data.isShowItem,
    f: $data.position.x,
    g: $data.position.y,
    h: common_vendor.o((...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
    i: common_vendor.o((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args)),
    j: $data.isExpanded,
    k: common_vendor.s($options.containerStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cb34b40c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/float-ball/float-ball.js.map
