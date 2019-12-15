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

### 启用按需复制

Google Drive 限制了每个用户分享文件的流量（一般是每天 750GB）。如果你试图从超出流量限制的用户处下载一个分享文件，会收到 `403 - forbidden` 错误。将文件复制一份可能可以解决此问题，但是在网页端上一次操作只能复制一个文件。

因此，我们引入了“按需复制”功能。

1. 新建一个用于存放所有复制文件的文件夹。打开“开发者工具”获得这个文件夹的 ID
2. 添加以下配置到你的 `worker.js`：

```
  ...
  copy_on_forbidden: true,
  copy_parent_id: 'YOUR_COPY_FOLDER_ID' // 替换 YOUR_COPY_FOLDER_ID 为你的文件夹 ID
```

3. 正常开始下载即可，如果 worker 检测到文件分享流量超出限制，会自动复制一份到之前的文件夹并返回复制的文件给你。该过程是透明的，因此你无需进行额外处理

注意：请在下载完一段时间后删除复制的文件，否则，随着复制的文件越多，它们会占用更多的空间。另外，复制过程中不会检测是否已有复制的文件，因此多次下载会触发多次复制动作。
