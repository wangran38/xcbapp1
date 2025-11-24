<template>
	<view>
		<view v-show="show" class="modal-backdrop" :class="{ 'backdrop-active': show }" @click="handleBackdropClick">

			<view class="modal-container" :class="{ 'container-active': show }">
				<view class="modal-card">
					<!-- 头部 -->
					<view class="modal-header">
						<text class="header-title">{{ title }}</text>
						<view style="display: flex;"><uni-icons type="info-filled" size="30"></uni-icons>注意！请详细阅读说明
						</view>
					</view>

					<scroll-view class="content-wrapper" scroll-y :scroll-with-animation="true">
						<text v-if="content" class="content-text">{{ content }}</text>
					</scroll-view>
					<view class="action-buttons">
						<button class="btn cancel-btn" @click="handleCancel">
							{{ cancelText }}
						</button>
						<button class="btn confirm-btn" :style="{ backgroundColor: confirmColor }"
							@click="handleConfirm">
							{{ confirmText }}
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: Boolean,
			title: {
				type: String,
				default: '说明'
			},
			content: String,
			steps: Array,
			agreement: String,
			cancelText: {
				type: String,
				default: '不同意'
			},
			confirmText: {
				type: String,
				default: '同意'
			},
			cancelColor: {
				type: String,
				default: '#666'
			},
			confirmColor: {
				type: String,
				default: '#2196F3'
			},
			showIcon: {
				type: Boolean,
				default: true
			},
			requireAgreement: Boolean
		},
		data() {
			return {
				isAgreed: false
			}
		},
		methods: {
			handleConfirm() {
				this.$emit('agree')
			},
			handleCancel() {
				this.$emit('disagree')
			},

			// 点击模态框关闭
			handleBackdropClick() {
				this.$emit('disagree')
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* Material Design 配色 */
	$primary-blue: #2196F3;
	$text-primary: rgba(0, 0, 0, 0.87);
	$text-secondary: rgba(0, 0, 0, 0.6);
	$divider-color: rgba(0, 0, 0, 0.12);

	.modal-backdrop {
		z-index: 10000;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		opacity: 0;
		transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		// z-index: 1000;

		&.backdrop-active {
			opacity: 1;
		}
	}

	.modal-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -48%) scale(0.9);
		width: 85%;
		max-width: 560px;
		opacity: 0;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1001;

		&.container-active {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	.modal-card {
		background: #FFFFFF;
		border-radius: 8px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.modal-header {
		padding: 24px;
		border-bottom: 1px solid $divider-color;

		.header-icon {
			margin-bottom: 16px;

			.default-icon {
				width: 48px;
				height: 48px;
				filter: drop-shadow(0 2px 4px rgba(33, 150, 243, 0.2));
			}
		}

		.header-title {
			font-size: 20px;
			font-weight: 500;
			color: $text-primary;
			line-height: 1.3;
		}
	}

	.content-wrapper {
		height: 200rpx;
		padding: 24px;

		.content-text {
			font-size: 14px;
			line-height: 1.6;
			color: $text-secondary;
			margin-bottom: 24px;
		}
	}

	.step-item {
		display: flex;
		align-items: center;
		margin-bottom: 16px;

		.step-badge {
			width: 24px;
			height: 24px;
			background: $primary-blue;
			color: white;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 16px;
			font-size: 12px;
			font-weight: 500;
		}

		.step-text {
			flex: 1;
			font-size: 14px;
			color: $text-primary;
		}
	}

	.agreement-box {
		margin-top: 24px;
		border: 1px solid $divider-color;
		border-radius: 4px;

		.agreement-scroll {
			max-height: 120px;
			padding: 16px;
		}

		.agreement-text {
			font-size: 12px;
			line-height: 1.5;
			color: $text-secondary;
			white-space: pre-wrap;
		}

		.agree-check {
			display: flex;
			align-items: center;
			padding: 12px 16px;
			border-top: 1px solid $divider-color;

			.checkmark {
				width: 18px;
				height: 18px;
				border: 2px solid rgba(0, 0, 0, 0.24);
				border-radius: 4px;
				margin-right: 8px;
				transition: all 0.2s;

				&.checked {
					background: $primary-blue;
					border-color: $primary-blue;

					.check-icon {
						width: 14px;
						height: 14px;
					}
				}
			}

			.agree-text {
				font-size: 12px;
				color: $text-primary;
			}
		}
	}

	.action-buttons {
		display: flex;
		justify-content: flex-end;
		padding: 16px 24px;
		border-top: 1px solid $divider-color;
		gap: 16px;

		.btn {
			min-width: 88px;
			height: 36px;
			border-radius: 4px;
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 0.5px;
			transition: all 0.2s;

			&::after {
				border: none;
			}

			&.cancel-btn {
				background: #000000;
				color: white;

				&:active {
					background: rgba(0, 0, 0, 0.08);
				}
			}

			&.confirm-btn {
				color: white;
				box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);

				&:disabled {
					background: rgba(0, 0, 0, 0.12);
					box-shadow: none;
					color: rgba(0, 0, 0, 0.26);
				}

				&:active:not(:disabled) {
					transform: translateY(1px);
				}
			}
		}
	}
</style>