import request, {
	UPLOAD_URL
} from '@/api/index'
import Compressor from 'compressorjs';

// 上传配置常量，
const UPLOAD_CONFIG = {
	// 不同平台的压缩质量配置
	compressQuality: {
		app: 60, // App端压缩质量(0-100)
		h5: 0.6, // H5端压缩质量(0-1)
		mpWeixin: 30 // 微信小程序压缩质量(0-100)
	},
	// 提示信息配置
	messages: {
		uploading: '上传中',
		success: '上传成功',
		fail: '上传失败',
		compressFail: '图片压缩失败',
		invalidFile: '无效的文件',
		unsupportedPlatform: '不支持的平台'
	}
};

/**
 * 获取当前运行平台
 * @returns {Number} 1:App, 2:H5, 3:微信小程序, 0:未知
 */
export function getPlatform() {
	/*#ifdef APP-PLUS*/
	return 1;
	/*#endif*/

	/*#ifdef H5*/
	return 2;
	/*#endif*/

	/*#ifdef MP-WEIXIN*/
	return 3;
	/*#endif*/

	return 0;
}

/**
 * 图片压缩处理，适配多平台
 * @param {Object|String} file - 文件对象或文件路径
 * @returns {Promise<Object|String>} 压缩后的文件对象或路径
 */
export const compressPictures = async (file) => {
	// 参数校验
	if (!file) {
		throw new Error(UPLOAD_CONFIG.messages.invalidFile);
	}

	const platform = getPlatform();
	const fileSource = file.path || file; // 统一获取文件源

	return new Promise((resolve, reject) => {
		switch (platform) {
			case 1: // App端
				uni.compressImage({
					src: fileSource,
					quality: UPLOAD_CONFIG.compressQuality.app,
					success: (res) => resolve(res.tempFilePath),
					fail: (err) => {
						console.error('App图片压缩失败:', err);
						reject(new Error(UPLOAD_CONFIG.messages.compressFail));
					}
				});
				break;

			case 2: // H5端
				new Compressor(file, {
					quality: UPLOAD_CONFIG.compressQuality.h5,
					convertSize: false,
					success: (result) => {
						// 转换为标准File对象
						const compressedFile = new File(
							[result],
							result.name || 'compressed-image.jpg', {
								type: result.type || 'image/jpeg'
							}
						);
						resolve(compressedFile);
					},
					error: (err) => {
						console.error('H5图片压缩失败:', err);
						reject(new Error(UPLOAD_CONFIG.messages.compressFail));
					}
				});
				break;

			case 3: // 微信小程序端
				uni.compressImage({
					src: fileSource,
					quality: UPLOAD_CONFIG.compressQuality.mpWeixin,
					success: (res) => resolve(res.tempFilePath),
					fail: (err) => {
						console.error('小程序图片压缩失败:', err);
						reject(new Error(UPLOAD_CONFIG.messages.compressFail));
					}
				});
				break;

			default:
				reject(new Error(UPLOAD_CONFIG.messages.unsupportedPlatform));
		}
	});
};

/**
 * 创建上传参数配置
 * @param {Number} platform - 平台类型
 * @param {String} uploadPath - 上传路径
 * @param {Object|String} compressedFile - 压缩后的文件
 * @returns {Object} 上传配置
 */
const createUploadOptions = (platform, uploadPath, compressedFile) => {
	const baseOptions = {
		url: `${request.UPLOAD_URL}${uploadPath}`,
		name: 'file',
		formData: {
			output: 'json2'
		}
	};

	// 根据平台添加不同的文件参数
	if (platform === 2) {
		// H5端使用file参数
		return {
			...baseOptions,
			file: compressedFile
		};
	} else {
		// App和小程序端使用filePath参数
		return {
			...baseOptions,
			filePath: compressedFile
		};
	}
};

/**
 * 图片上传Hook
 * @param {Object} opts - 上传参数
 * @param {String} opts.uploadPath - 上传接口路径
 * @param {Object|String} opts.file - 待上传的文件对象或路径
 * @returns {Object} 包含upload方法的对象
 */
export const useUpload = (opts) => {
	// 解构并校验必要参数
	const {
		uploadPath,
		file
	} = opts;
	if (!uploadPath || !file) {
		throw new Error('缺少必要的上传参数(uploadPath或file)');
	}

	/**
	 * 执行上传操作
	 * @returns {Promise<Object>} 上传结果
	 */
	const upload = async () => {
		// 显示加载状态
		uni.showLoading({
			title: UPLOAD_CONFIG.messages.uploading,
			mask: true
		});

		try {
			const platform = getPlatform();
			if (platform === 0) {
				throw new Error(UPLOAD_CONFIG.messages.unsupportedPlatform);
			}

			// 压缩图片
			const compressedFile = await compressPictures(file);

			// 创建上传配置
			const uploadOptions = createUploadOptions(platform, uploadPath, compressedFile);

			// 执行上传
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					...uploadOptions,
					success: (res) => {
						// 处理返回数据，尝试解析JSON
						let resultData = res.data;
						try {
							resultData = res.data
						} catch (e) {
							console.warn('上传返回数据不是JSON格式:', res.data);
						}

						uni.showToast({
							title: UPLOAD_CONFIG.messages.success
						});
						resolve(resultData);
					},
					fail: (err) => {
						console.error(`平台[${platform}]上传失败:`, err);
						reject(new Error(UPLOAD_CONFIG.messages.fail));
					}
				});
			});
		} catch (error) {
			uni.showToast({
				title: error.message || UPLOAD_CONFIG.messages.fail,
				icon: 'error'
			});
			throw error; // 继续抛出错误，让调用者可以捕获
		} finally {
			// 确保加载状态始终关闭
			uni.hideLoading();
		}
	};

	return {
		upload
	};
};