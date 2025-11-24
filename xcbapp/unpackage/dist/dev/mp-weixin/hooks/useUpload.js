"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
const UPLOAD_CONFIG = {
  // 不同平台的压缩质量配置
  compressQuality: {
    app: 60,
    // App端压缩质量(0-100)
    h5: 0.6,
    // H5端压缩质量(0-1)
    mpWeixin: 30
    // 微信小程序压缩质量(0-100)
  },
  // 提示信息配置
  messages: {
    uploading: "上传中",
    success: "上传成功",
    fail: "上传失败",
    compressFail: "图片压缩失败",
    invalidFile: "无效的文件",
    unsupportedPlatform: "不支持的平台"
  }
};
function getPlatform() {
  return 3;
}
const compressPictures = async (file) => {
  if (!file) {
    throw new Error(UPLOAD_CONFIG.messages.invalidFile);
  }
  const platform = getPlatform();
  const fileSource = file.path || file;
  return new Promise((resolve, reject) => {
    switch (platform) {
      case 1:
        common_vendor.index.compressImage({
          src: fileSource,
          quality: UPLOAD_CONFIG.compressQuality.app,
          success: (res) => resolve(res.tempFilePath),
          fail: (err) => {
            common_vendor.index.__f__("error", "at hooks/useUpload.js:67", "App图片压缩失败:", err);
            reject(new Error(UPLOAD_CONFIG.messages.compressFail));
          }
        });
        break;
      case 2:
        new common_vendor.Compressor(file, {
          quality: UPLOAD_CONFIG.compressQuality.h5,
          convertSize: false,
          success: (result) => {
            const compressedFile = new File(
              [result],
              result.name || "compressed-image.jpg",
              {
                type: result.type || "image/jpeg"
              }
            );
            resolve(compressedFile);
          },
          error: (err) => {
            common_vendor.index.__f__("error", "at hooks/useUpload.js:88", "H5图片压缩失败:", err);
            reject(new Error(UPLOAD_CONFIG.messages.compressFail));
          }
        });
        break;
      case 3:
        common_vendor.index.compressImage({
          src: fileSource,
          quality: UPLOAD_CONFIG.compressQuality.mpWeixin,
          success: (res) => resolve(res.tempFilePath),
          fail: (err) => {
            common_vendor.index.__f__("error", "at hooks/useUpload.js:100", "小程序图片压缩失败:", err);
            reject(new Error(UPLOAD_CONFIG.messages.compressFail));
          }
        });
        break;
      default:
        reject(new Error(UPLOAD_CONFIG.messages.unsupportedPlatform));
    }
  });
};
const createUploadOptions = (platform, uploadPath, compressedFile) => {
  const baseOptions = {
    url: `${api_index.request.UPLOAD_URL}${uploadPath}`,
    name: "file",
    formData: {
      output: "json2"
    }
  };
  if (platform === 2) {
    return {
      ...baseOptions,
      file: compressedFile
    };
  } else {
    return {
      ...baseOptions,
      filePath: compressedFile
    };
  }
};
const useUpload = (opts) => {
  const {
    uploadPath,
    file
  } = opts;
  if (!uploadPath || !file) {
    throw new Error("缺少必要的上传参数(uploadPath或file)");
  }
  const upload = async () => {
    common_vendor.index.showLoading({
      title: UPLOAD_CONFIG.messages.uploading,
      mask: true
    });
    try {
      const platform = getPlatform();
      if (platform === 0) {
        throw new Error(UPLOAD_CONFIG.messages.unsupportedPlatform);
      }
      const compressedFile = await compressPictures(file);
      const uploadOptions = createUploadOptions(platform, uploadPath, compressedFile);
      return new Promise((resolve, reject) => {
        common_vendor.index.uploadFile({
          ...uploadOptions,
          success: (res) => {
            let resultData = res.data;
            try {
              resultData = res.data;
            } catch (e) {
              common_vendor.index.__f__("warn", "at hooks/useUpload.js:194", "上传返回数据不是JSON格式:", res.data);
            }
            common_vendor.index.showToast({
              title: UPLOAD_CONFIG.messages.success
            });
            resolve(resultData);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at hooks/useUpload.js:203", `平台[${platform}]上传失败:`, err);
            reject(new Error(UPLOAD_CONFIG.messages.fail));
          }
        });
      });
    } catch (error) {
      common_vendor.index.showToast({
        title: error.message || UPLOAD_CONFIG.messages.fail,
        icon: "error"
      });
      throw error;
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    upload
  };
};
exports.useUpload = useUpload;
//# sourceMappingURL=../../.sourcemap/mp-weixin/hooks/useUpload.js.map
