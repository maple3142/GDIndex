# GDIndex

![preview](https://i.imgur.com/ENkZwCU.png)

> GDIndex 是一个类似 [GOIndex](https://github.com/donwa/goindex) 的东西，可以在 CloudFlare Workers 上架设 Google Drive 的目录，并提供许多功能
>
> 另外，这个并不是从 GOIndex 修改来了，而是直接重写

[Demo](https://gdindex-demo.maple3142.workers.dev/)

## 和 GOIndex 不同之处

-   前端使用 Vue 完成
-   查看图片不用另开新窗口
-   视频播放器支持字幕(目前只支持 srt)
-   支持在线阅读 PDF, EPUB
-   不支持目录加密(.password)
-   支持 Http Basic Auth
-   无需修改程序，即可接入多个云端硬盘(个人、团队)

## 使用教学

### 简单、自动的方法

前往 [https://gdindex-code-builder.maple3142.net/](https://gdindex-code-builder.maple3142.net/)(英文) 并遵照它的指示。

### 手动的方法

1. 安装 [rclone](https://rclone.org/)
2. 设定 Google Drive: https://rclone.org/drive/
3. 执行 `rclone config file` 以找到你的 `rclone.conf`
4. 在 `rclone.conf` 中寻找 `refresh_token` 以及 `root_folder_id` (可选)
5. 复制 [worker/dist/worker.js](worker/dist/worker.js) 的内容到 CloudFlare Workers
6. 在脚本顶端填上 `refresh_token`, `root_folder_id` 以及其他的选项
7. 部署!

### 使用服务帐户

1. 创建一个服务帐户，一个相应的服务帐户密钥，然后从[Google Cloud Platform控制台]获取JSON（https://cloud.google.com/iam/docs/creating-managing-service-account-keys）
2. 在props对象中，将`service_account_json`值替换为服务帐户JSON文件的内容，并将`service_account`设置为`true`。
3. 确保所涉及的服务帐户有权访问“ root_folder_id”中指定的文件夹
4. 部署
