# GDIndex

![preview](https://i.imgur.com/4DgDmFI.png)

[繁體中文](README.zhtw.md)
[简体中文](README.zh.md)

> GDIndex is similar to [GOIndex](https://github.com/donwa/goindex).
> It allows you to deploy a "Google Drive Index" on CloudFlare Workers along with many extra features
>
> By the way, instead of modify from GOIndex, this is a total rewrite

[Demo](https://gdindex-demo.maple3142.workers.dev/)

## Difference between GOIndex and GDIndex

* Frontend is based on Vue.js
* Image viewer doesn't require opening new page
* Video player support subtitles(Currently only srt is supported)
* Online EPUB reader
* No directory-level password protection(.password)
* Support Http Basic Auth
* Support multiple drives(personal, team) without changing server's code

## Usage

Follow [GOIndex's instructions](https://github.com/donwa/goindex) to get `refresh_token`, then copy the content of [worker/dist/worker.js](worker/dist/worker.js), and paste your `refresh_token` to the correspond field. That's all!
