export function saveLog(...args) {
	const message = args.map(arg =>
		typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
	).join(' ');
	try {
		const timeStr = new Date().toLocaleString();
		const logEntry = `[${timeStr}] ${message}\n`;
		const logPath = '_doc/jpush_log.txt';

		// console.log('📄 [saveLog] 准备写入日志:', logEntry);

		plus.io.requestFileSystem(
			plus.io.PRIVATE_DOC,
			fs => {
				fs.root.getFile(
					logPath, {
						create: true
					},
					fileEntry => {
						fileEntry.createWriter(
							writer => {
								writer.onwrite = () => {
									// console.log('✅ [saveLog] 写入成功');
								};
								writer.onerror = err => {
									// console.log('❌ [saveLog] 写入失败:', err);
								};

								writer.seek(writer.length || 0);
								writer.write(logEntry);
							},
							err => {
								// console.log('❌ createWriter 失败:', err);
							}
						);
					},
					err => {
						// console.log('❌ getFile 失败:', err);
					}
				);
			},
			err => {
				// console.log('❌ requestFileSystem 失败:', err);
			}
		);
	} catch (e) {
		// console.error('❌ 保存日志异常:', e);
	}
}