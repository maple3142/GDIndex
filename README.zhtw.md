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
-   支援通過 Aria2 下載

## 使用教學

### 簡單、自動的方法

前往 [https://gdindex-code-builder.glitch.me/](https://gdindex-code-builder.glitch.me/)(英文) 並遵照它的指示。

### 手動的方法

1. 安裝 [rclone](https://rclone.org/)
2. 設定 Google Drive: https://rclone.org/drive/
3. 執行 `rclone config file` 以找到你的 `rclone.conf`
4. 在 `rclone.conf` 中尋找 `refresh_token` 以及 `root_folder_id` (選擇性)
5. 複製 [worker/dist/worker.js](worker/dist/worker.js) 的內容到 CloudFlare Workers
6. 在腳本頂端填上 `refresh_token`, `root_folder_id` 以及其他的選項
7. 部署!

### 啟用 Aria2 下載

1. 在 `worker.js` 中添加配置 `download_aria2: true`：
    ```
    default_root_id: '...',
    client_id: '...',
    client_secret: '...',
    refresh_token: '...',
    ...
    download_aria2: true
    ```
2. 重新部署，此時你應該可以在文件列表上方看到“使用 Aria2 下載”以及“Aria2 RPC 配置”兩個按鈕
3. 在“Aria2 RPC 配置”中填寫 Aria2 RPC 連接信息
4. 前往你要下載的文件夾，點擊“使用 Aria2 下載”，開始添加下載任務

### 啟用按需複制

Google Drive 限制了每個用戶分享文件的流量（一般是每天 750GB）。如果你試圖從超出流量限制的用戶處下載一個分享文件，會收到 `403 - forbidden` 錯誤。將文件複製一份可能可以解決此問題，但是在網頁端上一次操作只能複制一個文件。

因此，我們引入了“按需複制”功能。

1. 新建一個用於存放所有復製文件的文件夾。打開“開發者工具”獲得這個文件夾的 ID
2. 添加以下配置到你的 `worker.js`：

```
  ...
  copy_on_forbidden: true,
  copy_parent_id: 'YOUR_COPY_FOLDER_ID' // 替換 YOUR_COPY_FOLDER_ID 為你的文件夾 ID
```

3. 正常開始下載即可，如果 worker 檢測到文件分享流量超出限制，會自動複製一份到之前的文件夾並返回複製的文件給你。該過程是透明的，因此你無需進行額外處理

注意：請在下載完一段時間後刪除複製的文件，否則，隨著複製的文件越多，它們會佔用更多的空間。另外，複製過程中不會檢測是否已有復制的文件，因此多次下載會觸發多次復制動作。