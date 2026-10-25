# Can You Hear the Data? — 简体中文

[Languages / 语言 / 語言 / 言語](../README.md)

### 项目简介与使用方法

这是为 Maker Faire Shenzhen 2026 开发的独立声音数据通信网页应用。它使用官方 [ggwave](https://github.com/ggerganov/ggwave) WebAssembly 库，通过扬声器发送简短的 UTF-8 文字，再用麦克风接收。传递消息不需要 Wi-Fi、蓝牙、服务器、账号或数据分析服务；附近的设备也可能收到同一信号。应用和[访客指南](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html)提供英语、简体中文、台湾华语（繁体中文）和日语，指南中有二维码。点击预设消息即可免打字体验。

**项目背景：** 这项工作最初始于 [AtomS3R-Acoustic-Modem](https://github.com/nuwaa/AtomS3R-Acoustic-Modem)。基于多方面的考虑，网页应用后来转到这个独立仓库开发。原仓库仍是 ATOM S3R 接收端及其固件的参考。

**无需安装即可使用：** 在电脑、平板或手机的兼容浏览器中打开 https://nuwaa.github.io/Can-You-Hear-the-Data/ 即可使用，不必在每台设备上安装 npm 或原生 App。

**一人发送，多人接收：** 通信不局限于两台设备。可以由一台电脑播放一次声音，让附近多位访客同时用自己的手机或平板接收。每位接收者都打开[网页应用](https://nuwaa.github.io/Can-You-Hear-the-Data/)，点击**开始接收**并允许使用麦克风；发送方选择预设消息或输入文字，再点击**用声音发送**。访客也可以用自己的设备回复。无需配对或指定接收者；能否收到取决于距离、扬声器输出和环境噪声。播放完毕**不代表**所有设备都已成功解码。

第一次打开需要网络；资源缓存后可以离线收发。麦克风需要 HTTPS。在 iOS 上接收时，请保持页面打开、屏幕点亮。收不到时，请检查发送设备的音量和声音输出，靠近一些并在较安静的地方重试。

### 开发与部署

需要 Node.js 20.19+ 或 22.12+，以及 npm：

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
npm run test:browser # Chromium：/usr/bin/chromium 或 CHROMIUM_PATH
```

这是使用 Vite、TypeScript、Web Audio API、Canvas、ggwave 和 Service Worker 构建的静态应用。`dist/` 可部署到 GitHub Pages、Cloudflare Pages 等 HTTPS 服务，没有写死域名。GitHub Actions 的 `Publish web app` 会测试、构建并发布 `main`；请在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**。音频只在设备上处理，运行时不依赖外部 CDN。

### 协议、验证与限制

- 发送使用 ggwave 0.4.0 的可变长度帧、**Audible Normal 协议 0**，上限为 **140 个 UTF-8 字节**。接收使用浏览器 AudioContext 的实际采样率；收到的内容按纯文本显示，不作为 HTML 执行。
- 自动测试覆盖字节上限、ggwave 编解码、类型检查、正式构建、电脑与手机尺寸的界面、麦克风权限拒绝和离线重新打开。
- **用户报告的实机验证（2026-10-25）：** PC、iPad 和 Android 设备间可以双向通信；也试过三台 PC。未记录浏览器版本、采样率、距离、消息集合和噪声条件，因此不声称已测出成功率。
- **尚未验证：** 会场噪声中系统地测试全部五条预设消息、Klesis ↔ 本应用、本应用 → 现有 ATOM S3R 网页接收模式、iPhone，以及长时间接收、离线和权限恢复测试。

本项目不修改 ATOM S3R 固件，也不使用其独立的固定长度 DT 聊天／ACK 模式。[Klesis](https://github.com/nolimitwaiz/klesis) 仅作为互操作参考；由于未确认其再利用许可，没有复制其代码或素材。ggwave 0.4.0 使用 MIT 许可证，版权 © 2020 Georgi Gerganov；详见 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)。其他依赖保留各自的许可证。本应用自身的许可证尚未选定。
