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

### Enabling file copy on forbidden

Google Drive limited each users' file sharing bandwidth(about 750GB per day). If you try pulling a shared file from who exceed this limit, you will receive a `403 - forbidden` error. Copying file to your may solve this problem, but it hurts because you can only copy a file once a time.

That's why "Copy on forbidden" comes in.

1. Create a folder, which will be used to store your copied files, crawl its id from network requests(normally you can get it from Developer Tools)
2. Add following config to your `worker.js`:

```
  ...
  copy_on_forbidden: true,
  copy_parent_id: 'YOUR_COPY_FOLDER_ID' // replace YOUR_COPY_FOLDER_ID to your copy folder's ID
```

3. Just do normal download, if this file exceed limits, worker will make a copy and return copied one to you. This process is transparent so you won't need to deal other things.

Note: Be sure to delete all you copied files after a while, as more files get copied, it will consumer more space on you drive. Besides, this feature will NOT detect existing copies, multiple downloads will leads multiple copies.
