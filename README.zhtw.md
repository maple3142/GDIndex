# GDIndex

![preview](https://i.imgur.com/ENkZwCU.png)

> GDIndex 是一個類似 [GOIndex](https://github.com/donwa/goindex) 的東西，可以在 CloudFlare Workers 上架設 Google Drive 的目錄，並提供許多功能
>
> 另外，這個並不是從 GOIndex 修改來了，而是直接重寫

[Demo](https://gdindex-demo.maple3142.workers.dev/)

## 和 GOIndex 不同之處

-   前端使用 Vue 完成
-   圖片檢視不用另開新頁面
-   影片播放器支援字幕(目前只有 srt)
-   線上 PDF, EPUB 閱讀器
-   不支援目錄加密(.password)
-   支援 Http Basic Auth
-   支援多雲端硬碟(個人、團隊)，不需要額外改程式設定

## 使用教學

### 簡單、自動的方法

前往 [https://gdindex-code-builder.maple3142.net/](https://gdindex-code-builder.maple3142.net/)(英文) 並遵照它的指示。

### 手動的方法

1. 安裝 [rclone](https://rclone.org/)
2. 設定 Google Drive: https://rclone.org/drive/
3. 執行 `rclone config file` 以找到你的 `rclone.conf`
4. 在 `rclone.conf` 中尋找 `refresh_token` 以及 `root_folder_id` (選擇性)
5. 複製 [worker/dist/worker.js](worker/dist/worker.js) 的內容到 CloudFlare Workers
6. 在腳本頂端填上 `refresh_token`, `root_folder_id` 以及其他的選項
7. 部署!


### 使用服務帳戶

1. 創建一個服務帳戶，一個對應的服務帳戶密鑰，然後從[Google Cloud Platform控制台]獲取JSON（https://cloud.google.com/iam/docs/creating-managing-service-account-keys）
2. 在props對像中，將`service_account_json`值替換為服務帳戶JSON文件的內容，並將`service_account`設置為`true`。
3. 確保所涉及的服務帳戶有權訪問“ root_folder_id”中指定的文件夾
4. 部署