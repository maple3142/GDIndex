# GDIndex

![preview](https://i.imgur.com/4DgDmFI.png)

> GDIndex 是一個類似 [GOIndex](https://github.com/donwa/goindex) 的東西，可以在 CloudFlare Workers 上架設 Google Drive 的目錄，並提供許多功能
>
> 另外，這個並不是從 GOIndex 修改來了，而是直接重寫

[Demo](https://gdindex-demo.maple3142.workers.dev/)

## 和 GOIndex 不同之處

* 前端使用 Vue 完成
* 圖片檢視不用另開新頁面
* 影片播放器支援字幕(目前只有 srt)
* 線上 EPUB 閱讀器
* 不支援目錄加密(.password)
* 支援 Http Basic Auth
* 支援多雲端硬碟(個人、團隊)，不需要額外改程式設定

## 使用教學

先參考 [GOIndex 的教學](https://github.com/donwa/goindex)取得 `refresh_token`，然後複製 [worker/dist/worker.js](worker/dist/worker.js) 的內容，把原本就有的 `refresh_token` 貼上到對應的欄位就可以了
