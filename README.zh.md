# GDIndex

![preview](https://i.imgur.com/ENkZwCU.png)

> GDIndex 是一个类似 [GOIndex](https://github.com/donwa/goindex) 的东西，可以在 CloudFlare Workers 上架设 Google Drive 的目录，并提供许多功能
>
> 另外，这个并不是从 GOIndex 修改来了，而是直接重写

[Demo](https://gdindex-demo.maple3142.workers.dev/)

## 和 GOIndex 不同之处

-   前端使用 Vue 完成
-   图片检视不用另开新页面
-   视频播放器支援字幕(目前只有 srt)
-   线上 PDF, EPUB 阅读器
-   不支援目录加密(.password)
-   支援 Http Basic Auth
-   支援多云端硬盘(个人、团队)，不需要额外改程序设定
-   支持导出 Aria2 下载

## 使用教学

### 简单、自动的方法

前往 [https://gdindex-code-builder.glitch.me/](https://gdindex-code-builder.glitch.me/)(英文) 并遵照它的指示。

### 手动的方法

1. 安装 [rclone](https://rclone.org/)
2. 设定 Google Drive: https://rclone.org/drive/
3. 执行 `rclone config file` 以找到你的 `rclone.conf`
4. 在 `rclone.conf` 中寻找 `refresh_token` 以及 `root_folder_id` (选择性)
5. 复制 [worker/dist/worker.js](worker/dist/worker.js) 的内容到 CloudFlare Workers
6. 在脚本顶端填上 `refresh_token`, `root_folder_id` 以及其他的选项
7. 部署!

### 启用 Aria2 下载

1. 在 `worker.js` 中添加配置 `download_aria2: true`：
    ```
	default_root_id: '...',
	client_id: '...',
	client_secret: '...',
	refresh_token: '...',
    ...
	download_aria2: true
    ```
2. 重新部署，此时你应该可以在文件列表上方看到“使用 Aria2 下载”以及“Aria2 RPC 配置”两个按钮
3. 在“Aria2 RPC 配置”中填写 Aria2 RPC 连接信息
4. 前往你要下载的文件夹，点击“使用 Aria2 下载”，开始添加下载任务