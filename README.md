# GDIndex

![preview](https://i.imgur.com/ENkZwCU.png)

[繁體中文](README.zhtw.md)
[简体中文](README.zh.md)

> GDIndex is similar to [GOIndex](https://github.com/donwa/goindex).
> It allows you to deploy a "Google Drive Index" on CloudFlare Workers along with many extra features
>
> By the way, instead of modify from GOIndex, this is a total rewrite

[Demo](https://gdindex-demo.maple3142.workers.dev/)

## Difference between GOIndex and GDIndex

-   Frontend is based on Vue.js
-   Image viewer doesn't require opening new page
-   Video player support subtitles(Currently only srt is supported)
-   Online PDF, EPUB reader
-   No directory-level password protection(.password)
-   Support Http Basic Auth
-   Support multiple drives(personal, team) without changing server's code

## Usage

### Simple and automatic way

Go [https://gdindex-code-builder.glitch.me/](https://gdindex-code-builder.glitch.me/), and follow its instructions.

### Manual way

1. Install [rclone](https://rclone.org/)
2. Setup your Google Drive: https://rclone.org/drive/
3. Run `rclone config file` to find your `rclone.conf` location
4. Find `refresh_token` in your `rclone.conf`, and `root_folder_id` too(optionally).
5. Copy the content of [worker/dist/worker.js](worker/dist/worker.js) to CloudFlare Workers.
6. Fill `refresh_token`, `root_folder_id` and other options on the top of the script.
7. Deploy!

## Lite mode

This mode will serve a simple nginx-like directory listing, and it only work with one drive. `upload` will be ignored in this mode.

On the top of the script, change `lite: false` into `lite: true`, than thats all.

[Lite mode demo](https://gdindex-demo-lite.maple3142.workers.dev/)
