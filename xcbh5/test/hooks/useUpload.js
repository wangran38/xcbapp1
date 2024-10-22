import request, {
	UPLOAD_URL
} from '@/api/index'
import Compressor from 'compressorjs';

export const useUpload = (opts) => {
	const {
		uploadPath,
		tempFilePaths,
		FormData,
		file
	} = opts;
	const upload = () => {
		return new Promise(async (resolve, reject) => {
			uni.showLoading({
				title: '上传中',
				mask: true
			})
			uni.uploadFile({
				url: request.UPLOAD_URL + uploadPath,
				name: 'file',
				file: await compressPictures(file),  // 压缩照片
				filePath: tempFilePaths,
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
		})
	}

	return {
		upload
	}
}



/**
 * 兼容h5的图片压缩
*/
export const compressPictures = (file) => {
	return new Promise((resolve, reject)=>{
		let obj = new Compressor(file, {
		  quality: 0.6, // 压缩质量
		  convertSize:false,
		  success: (result) => {
		    const fileA = new File([result], result.name, { type: result.type })
			resolve(fileA)
		  },
		  error: (error) => {
			reject("图片压缩失败")
		  },
		});
	})
}
				