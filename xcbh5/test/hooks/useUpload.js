import request, {
	UPLOAD_URL
} from '@/api/index'
import Compressor from 'compressorjs';

export const useUpload = (opts) => {
	const {
		uploadPath,
		tempFilePaths,
		FormData,
		file,
	} = opts;
	const upload = () => {
		return new Promise(async (resolve, reject) => {
			uni.showLoading({
				title: '上传中',
				mask: true
			})
			switch (getPlatform()){
				case 1:
					break
				case 2:
				    // h5上传file对象
					uni.uploadFile({
						url: request.UPLOAD_URL + uploadPath,
						name: 'file',
						file: await compressPictures(file),  // 压缩照片
						formData: {
							output: 'json2'
						},
						success: (res) => {
							uni.showToast({
								title: '上传成功',
							});
							uni.hideLoading();
							resolve(res?.data)
						},
						fail: (err) => {
							console.log(err);
							uni.showToast({
								title: '上传失败',
								icon: 'error'
							});
							uni.hideLoading();
						}
					})
					break
				case 3:
					// 小程序上传临时地址
					uni.uploadFile({
						url: request.UPLOAD_URL + uploadPath,
						name: 'file',
						filePath: await compressPictures(file),
						formData: {
							output: 'json2'
						},
						success: (res) => {
							uni.showToast({
								title: '上传成功',
							});
							uni.hideLoading();
							resolve(res?.data)
						},
						fail: (err) => {
							console.log(err);
							uni.showToast({
								title: '上传失败',
								icon: 'error'
							});
							uni.hideLoading();
						}
					})
					break
				}
			
		})
	}
	return {
		upload
	}
}

export function getPlatform() {
	/*#ifdef APP-PLUS*/
	  // App端特有的逻辑
	  return 1
	/*#endif*/
	
	/*#ifdef H5*/
	  // 在浏览器端（H5）执行的逻辑
	  return 2
	/*#endif*/
	
	/*#ifdef MP-WEIXIN*/
	  // 微信小程序端执行的逻辑
	  return 3
	/*#endif*/
}

/**
 * 同时兼容h5和小程序的图片压缩
*/
export const compressPictures = (file) => {
	// 判断是h5端还是小程序端
	switch (getPlatform()){
		case 1:
			break
		case 2:
			return new Promise((resolve, reject)=>{
				let obj = new Compressor(file, {
				  quality: 0.6, // 压缩质量
				  convertSize:false,
				  success: (result) => {
				    const fileA = new File([result], result.name, { type: result.type })
					console.log(fileA)
					resolve(fileA)
				  },
				  error: (error) => {
					reject("图片压缩失败")
				  },
				});
			})
			break
		case 3:
			return new Promise((resolve, reject)=>{
				uni.compressImage({
					src:file.path,
					quality:30,
					success(res) {
						// console.log(res.tempFilePath,"压缩完毕")
						resolve(res.tempFilePath)
					}
				})
			})
	}

}
				