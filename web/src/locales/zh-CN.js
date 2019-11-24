import $vuetify from 'vuetify/es5/locale/zh-Hans'

export default {
	fileName: '文件名称',
	modifiedTime: '修改时间',
	fileSize: '文件大小',
	mainDrive: '主要硬盘',
	search: '搜寻',
	save: '保存',
	close: '关闭',
	start: '开始',
	fileUpload: '文件上传',
	urlUpload: '从网址上传',
	upload: '上传',
	fileToUpload: '要上传的文件',
	uploading: '上傳中...',
	serverProcessing: '服务器正在处里文件',
	bigFileUploadWarning:
		'由于 CloudFlare Workers 的限制，上传大档案可能会随机失败',
	$vuetify,
	aria2Download: '使用 Aria2 下载',
	aria2DownloadRecursive: '包含子文件夹',
	aria2FetchingFiles:
		'正在获取文件，还剩 {remainingFolderCount} 个文件夹待获取',
	aria2DownloadStats:
		'将会下载 {folderCount} 个文件夹中的 {fileCount} 个文件，总计大小 {totalDownloadSize}',
	aria2DownloadProgress: '正在添加下载任务，还剩 {remainingFileCount} 个文件',
	aria2DownloadSuccess: '已添加所有文件下载',
	aria2DownloadFailed: '添加下载任务失败，原因：{failReason}',
	aria2FetchFileFailed: '获取文件列表失败，原因：{failReason}',
	aria2RPCSettings: 'Aria2 RPC 配置',
	aria2RPCHost: '主机',
	aria2RPCPort: '端口',
	aria2RPCPath: '路径',
	aria2RPCToken: '密码',
	aria2RPCDownloadPath: '下载路径',
	aria2TestConnection: '测试连接',
	aria2Testing: '正在尝试连接',
	aria2TestFailed: '连接失败，原因：{reason}',
	aria2TestSucceed: '连接成功，Aria2 版本：{version}'
}
