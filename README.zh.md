# GDIndex

![preview](https://i.imgur.com/4DgDmFI.png)

> GDIndex 是一个类似 [GOIndex](https://github.com/donwa/goindex) 的东西，可以在 CloudFlare Workers 上架设 Google Drive 的目录，并提供许多功能
>
> 另外，这个并不是从 GOIndex 修改来了，而是直接重写

[Demo](https://gdindex-demo.maple3142.workers.dev/)

## 和 GOIndex 不同之处

* 前端使用 Vue 完成
* 图片检视不用另开新页面
* 视频播放器支援字幕(目前只有 srt)
* 线上 EPUB 阅读器
* 不支援目录加密(.password)
* 支援 Http Basic Auth
* 支援多云端硬盘(个人、团队)，不需要额外改程序设定

## 使用教学

先参考 [GOIndex 的教学](https://github.com/donwa/goindex)取得 `refresh_token`，然后复制 [worker/dist/worker.js](worker/dist/worker.js) 的内容，把原本就有的 `refresh_token` 贴上到对应的字段就可以了
