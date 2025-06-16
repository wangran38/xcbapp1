<template>
	<movable-area class="float-container" :style="[containerStyle]">
<!-- 		<movable-view class="main-ball" :x="position.x" :y="position.y" direction="all" inertia out-of-bounds="false"
			@change="handleDrag" @touchstart="handleTouchStart" @touchend="handleTouchEnd" :disabled="isExpanded"> -->
			<movable-view class="main-ball" :x="position.x" :y="position.y" direction="all" inertia out-of-bounds="false"
				 @touchstart="handleTouchStart" @touchend="handleTouchEnd" :disabled="isExpanded">
			<view class="ball-core" :class="{ expanded: isExpanded }" @click.stop="toggleMenu">
				{{ isExpanded ? '×' : '+' }}
			</view>

			<view  v-show="isShowItem" v-for="(item, index) in menuList" :key="item.path" class="sub-item" :style="[getSubStyle(index)]"
				@tap.stop="navigateTo(item.path)">
				{{ item.label }}
			</view>
		</movable-view>
	</movable-area>
</template>

<script>
	export default {
		props: {
			menuList: {
				type: Array,
				default: () => [
					{
					path: '/pages/myComplaint/myComplaint',
					label: '我的投诉'
				},{
					path:'/pages/orders/orders',
					label:'我的订单'
				}
				]
			}
		},
		data() {
			return {
				isShowItem:false,
				position: {
					x: 0,
					y: 0
				},
				isExpanded: false,
				systemInfo: {},
				startY: 0,
				isDragging: false
			}
		},
		computed: {
			containerStyle() {
				return {
					width: `${this.systemInfo.windowWidth}px`,
					height: `${this.systemInfo.windowHeight}px`
				}
			}
		},
		mounted() {
			this.initPosition()
		},
		methods: {
			initPosition() {
				this.systemInfo = uni.getSystemInfoSync()
				const savedPos = uni.getStorageSync('floatPos') || {
					x: this.systemInfo.windowWidth - 80,
					y: this.systemInfo.windowHeight * 0.7
				}
				this.position = savedPos
			},

			handleTouchStart(e) {
				this.startY = e.touches[0].clientY
				this.isDragging = false
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
				if (!this.isDragging) return
				this.autoDock()
				uni.setStorageSync('floatPos', this.position)
			},

			autoDock() {
				const {
					windowWidth
				} = this.systemInfo
				this.position.x = this.position.x > windowWidth / 2 ?
					windowWidth - 60 :
					20
			},
			
			
			toggleMenu() {
				this.isShowItem = !this.isShowItem
				console.log(this.isShowItem)
				if (this.isDragging) return
				this.isExpanded = !this.isExpanded
			},

			navigateTo(path) {
				this.isExpanded = false
				uni.navigateTo({
					url: path
				})
			},
			// containerStyle() {
			// 	return {
			// 		width: `${this.systemInfo.windowWidth}px`,
			// 		height: `${this.systemInfo.windowHeight}px`
			// 	}
			// },
			layoutParams() {
				const count = this.menuList.length
				const minRadius = 60 // 基础半径
				const itemSize = 80 // 子项直径

				// 动态半径公式：R = 基础半径 + 数量系数
				const radius = minRadius + Math.min(count, 6) * 8

				// 动态角度间隔：保证最小间隔30度
				const angleStep = Math.max(360 / count, 30)

				return {
					radius,
					angleStep,
					itemSize
				}
			},
			getSubStyle(index) {
				if (!this.isExpanded) return {
					opacity: 0
				}

				// 极坐标计算
				const {
					radius,
					angleStep,
					itemSize
				} = this.layoutParams
				const angle = (-90 + angleStep * index) * Math.PI / 180
				const diameter = itemSize / 2

				return {
					transform: `translate(
			          ${Math.cos(angle) * radius - diameter}px,
			          ${Math.sin(angle) * radius - diameter}px
			        )`,
					width: `${itemSize}px`,
					height: `${itemSize}px`,
					transitionDelay: `${index * 30}ms`,
					opacity: 1,
					zIndex: this.menuList.length - index // 层级控制
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	$primary: #007aff;
	$secondary: #007aff;
	$text-dark: #2B593E;

	.float-container {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 9999;
	}

	.main-ball {
		width: 120rpx;
		height: 120rpx;
		pointer-events: auto;
		z-index: 9999;
	}

	.ball-core {
		opacity: .8;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: $primary;
		box-shadow: 10rpx 8rpx 24rpx rgba(141, 201, 178, 0.3);
		text-align: center;
		line-height: 120rpx;
		color: white;
		font-size: 40rpx;
		transition: all 0.3s;
	}

	.sub-item {
		color: white;
		text-align: center;
		line-height: 120rpx;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: $primary;
		font-size: 25rpx
	}
</style>