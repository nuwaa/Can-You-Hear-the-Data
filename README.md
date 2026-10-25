# Can You Hear the Data?

**Can You Hear the Data? · 你能听见数据吗？ · 你聽得見資料嗎？ · データが聞こえる！**

[English](#english) · [简体中文](#简体中文) · [繁體中文／台灣華語](#繁體中文台灣華語) · [日本語](#日本語)

<a id="english"></a>
## English

An independent, static acoustic data communication web app for Maker Faire Shenzhen 2026. It sends UTF-8 text through a speaker and receives it through a microphone using the official [ggwave](https://github.com/ggerganov/ggwave) WebAssembly package. No Wi-Fi, Bluetooth, server, account, or analytics is used for message delivery. Nearby receivers can hear the same signal.

**Web app:** https://nuwaa.github.io/Can-You-Hear-the-Data/

**Visitor guide:** https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html

## Development

Requires Node.js 20.19+ or 22.12+ and npm. Run from this repository:

```sh
npm ci
npm run dev
```

Open the Vite URL shown in the terminal. For a phone, deploy the static build over HTTPS; browser microphones generally require a secure context. Do not assume a LAN HTTP URL will have microphone access.

```sh
npm run build
npm test
npm run preview
npm run test:browser # requires Chromium at /usr/bin/chromium, or CHROMIUM_PATH
```

The `dist/` directory can be hosted as a static site on GitHub Pages, Cloudflare Pages, or another HTTPS host. Vite uses relative asset paths, so no domain is hard coded. After the first online load, the service worker caches the HTML, JavaScript, CSS, manifest, icon, and ggwave code for offline use. Reopen once while online before relying on offline mode.

### Install-free access on other devices

The repository includes a GitHub Pages workflow that tests, builds, and deploys the app on every push to `main`. A repository administrator must select **Settings → Pages → Build and deployment → Source: GitHub Actions** once. After a successful `Publish web app` run, use the HTTPS URL shown in the deployment job. The expected URL for the current repository is `https://nuwaa.github.io/Can-You-Hear-the-Data/`; verify that it responds before distributing it or making a QR code. Visitors only need a modern browser—no Node.js or npm installation. The first load requires internet; subsequent loads can use the cached app offline. For microphone access, keep the HTTPS origin and grant browser permission.

The app links to a short [visitor guide](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html) in Simplified Chinese, Taiwan Mandarin (Traditional Chinese), English, and Japanese. It explains receiving, sending, microphone permission, and troubleshooting. The guide includes a QR code for visitors to open it on their own phones. Visitors can use the preset messages without typing. The guide and its QR code are part of the static build and do not contact a third-party service.

## How it works

- The transmitter uses official ggwave 0.4.0, variable-length framing, **Audible Normal protocol 0**, and a 140 UTF-8 byte limit. It shows playback completion, which is **not** a delivery acknowledgment.
- The receiver asks for microphone permission only after tapping Start listening. It decodes locally, shows recent messages, and lets the visitor copy the newest message. The spectrum and level meter use live microphone analysis.
- The Web Audio context's actual sample rate is passed to ggwave for both input and output. The ATOM S3R web receiver uses its own 24 kHz input path for a 48 kHz browser source; this app does not add another framing format or modify its firmware.
- English, Simplified Chinese, Taiwan Mandarin (Traditional Chinese), and Japanese UI are included. Browser language selects the initial UI language, including `zh-TW`/`zh-Hant` for Traditional Chinese.

This targets current Android Chrome, iOS Safari, and desktop Chromium/Safari/Firefox with WebAssembly, Web Audio, microphone permission, and service worker support. iOS may suspend audio when the page is backgrounded or the screen locks; keep the app open and the display awake during reception. In noisy environments, move devices closer and retry at a comfortable volume.

## Compatibility and testing

The design follows ggwave's public API and the documented Audible Normal mode in [AtomS3R-Acoustic-Modem](https://github.com/nuwaa/AtomS3R-Acoustic-Modem). [Klesis](https://github.com/nolimitwaiz/klesis) was consulted for interoperability behavior only; no Klesis source, styles, or assets were copied. Its reuse license was not established.

Automated tests cover the 140-byte UTF-8 boundary, an actual ggwave Audible Normal encode/decode round trip, production build, mobile and desktop browser UI, microphone denial, and offline reload. These tests do **not** prove over-the-air delivery.

**User-reported physical check (2026-10-25):** The published site displayed and bidirectional acoustic messaging worked among PCs, an iPad, and an Android device. The user also reported successful testing with three PCs. Browser versions, sample rates, distances, message set, and noise level were not recorded, so these results do not establish a measured success rate or coverage of every browser.

The following physical-device checks remain **unverified** for this app:

1. This app → this app: systematically send all five preset messages between devices and compare exact UTF-8 text, including repeated trials in venue noise.
2. Klesis → this app and this app → Klesis: use Audible Normal on both sides and compare exact text.
3. This app → existing ATOM S3R web receiver: enable its `ggwave web on` mode, send the presets from a 48 kHz browser, and compare its display / `GGWAVE WEB RX TEXT:` output.
4. Browser-specific coverage on Android Chrome and iOS Safari, including offline use, permission restart, different sample rates, venue noise, and long listening sessions. iPhone testing has not been reported.

No ATOM S3R firmware is changed here. The ATOM's separate fixed-length DT chat/ACK mode is not the target of this web app. A played sound is not proof that any receiver decoded it.

## License notices

ggwave 0.4.0 is MIT licensed, copyright © 2020 Georgi Gerganov. Its license is included in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Other dependencies retain their respective license terms in npm package metadata. A project license for the new app has not yet been selected.

<a id="简体中文"></a>
## 简体中文

### 项目简介与使用方法

这是为 Maker Faire Shenzhen 2026 开发的独立声音数据通信网页应用。它使用官方 [ggwave](https://github.com/ggerganov/ggwave) WebAssembly 库，通过扬声器发送简短的 UTF-8 文字，再用麦克风接收。传递消息不需要 Wi-Fi、蓝牙、服务器、账号或数据分析服务；附近的设备也可能收到同一信号。应用和[访客指南](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html)提供英语、简体中文、台湾华语（繁体中文）和日语，指南中有二维码。点击预设消息即可免打字体验。

1. 在两台设备上打开[网页应用](https://nuwaa.github.io/Can-You-Hear-the-Data/)，无需安装 npm 或 App。
2. 接收方点击**开始接收**，并允许使用麦克风。
3. 发送方选择预设消息或输入文字，再点击**用声音发送**。请在接收方屏幕上确认文字；播放完毕**不代表**对方已经收到。

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

本项目不修改 ATOM S3R 固件，也不使用其独立的固定长度 DT 聊天／ACK 模式。[Klesis](https://github.com/nolimitwaiz/klesis) 仅作为互操作参考；由于未确认其再利用许可，没有复制其代码或素材。ggwave 0.4.0 使用 MIT 许可证，版权 © 2020 Georgi Gerganov；详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。其他依赖保留各自的许可证。本应用自身的许可证尚未选定。

<a id="繁體中文台灣華語"></a>
## 繁體中文／台灣華語

### 專案簡介與使用方式

這是為 Maker Faire Shenzhen 2026 製作的獨立聲音資料傳輸網頁 App。它使用官方 [ggwave](https://github.com/ggerganov/ggwave) WebAssembly 套件，透過喇叭傳送簡短的 UTF-8 文字，再用麥克風接收。傳送訊息不需要 Wi-Fi、藍牙、伺服器、帳號或流量分析；附近的裝置也可能收到同一段聲音訊號。App 與[訪客使用說明](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html)支援英文、簡體中文、台灣華語及日文，說明頁提供 QR Code。選擇範例訊息就能不用打字直接體驗。

1. 在兩台裝置上開啟[網頁 App](https://nuwaa.github.io/Can-You-Hear-the-Data/)，不需要安裝 npm 或 App。
2. 接收者點選**開始接收**，並允許使用麥克風。
3. 傳送者選擇範例訊息或輸入文字，再點選**用聲音傳送**。請在接收者畫面確認文字；播放完畢**不代表**對方已收到。

第一次開啟需要網路；資源完成快取後可離線收發。使用麥克風需要 HTTPS。在 iOS 接收時，請保持網頁開啟、螢幕亮著。若收不到訊息，請檢查傳送端的音量與聲音輸出，把裝置靠近一點，並在較安靜的地方再試一次。

### 開發與部署

需要 Node.js 20.19+ 或 22.12+，以及 npm：

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
npm run test:browser # Chromium：/usr/bin/chromium 或 CHROMIUM_PATH
```

這個靜態 App 使用 Vite、TypeScript、Web Audio API、Canvas、ggwave 與 Service Worker。`dist/` 可部署到 GitHub Pages、Cloudflare Pages 等 HTTPS 網站，程式沒有寫死網域。GitHub Actions 的 `Publish web app` 工作流程會測試、建置並發布 `main`；請在儲存庫 Settings → Pages 將 Source 設為 **GitHub Actions**。音訊只在裝置上處理，執行時不依賴外部 CDN。

### 協定、驗證與限制

- 傳送使用 ggwave 0.4.0 的可變長度影格、**Audible Normal 協定 0**，上限為 **140 個 UTF-8 位元組**。接收依照瀏覽器 AudioContext 的實際取樣率運作；收到的內容只會顯示為文字，不會當成 HTML 執行。
- 自動測試涵蓋位元組上限、ggwave 編解碼、型別檢查、正式建置、電腦與手機尺寸的畫面、拒絕麥克風權限，以及離線重新開啟。
- **使用者回報的實機驗證（2026-10-25）：** PC、iPad 和 Android 裝置之間已完成雙向通訊，也試過三台 PC。未記錄瀏覽器版本、取樣率、距離、訊息組合或噪音條件，因此沒有量測成功率。
- **尚未驗證：** 在展場噪音下系統性測試五則範例訊息、Klesis ↔ 本 App、本 App → 現有 ATOM S3R 網頁接收模式、iPhone，以及長時間接收、離線與權限恢復測試。

本專案不修改 ATOM S3R 韌體，也不使用其獨立的固定長度 DT 聊天／ACK 模式。[Klesis](https://github.com/nolimitwaiz/klesis) 僅作為互通性參考；因為沒有確認其重複使用授權，本專案未複製其程式碼或素材。ggwave 0.4.0 採 MIT 授權，著作權 © 2020 Georgi Gerganov；詳見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。其他相依套件保留各自的授權。本 App 本身的授權尚未決定。

<a id="日本語"></a>
## 日本語

### 概要と使い方

Maker Faire Shenzhen 2026に向けた、独立した音響データ通信Webアプリです。公式の[ggwave](https://github.com/ggerganov/ggwave) WebAssemblyパッケージを使い、短いUTF-8文字列をスピーカーから送り、マイクで受け取ります。メッセージの伝送にWi-Fi、Bluetooth、サーバー、アカウント、アクセス解析は不要です。近くにいるほかの端末にも同じ信号が届く場合があります。アプリと[来場者向けガイド](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html)は4言語に対応し、ガイドのQRコードから自分のスマートフォンで開けます。例文を選べば入力せずに試せます。

1. 2台の端末で[Webアプリ](https://nuwaa.github.io/Can-You-Hear-the-Data/)を開きます。npmやアプリのインストールは不要です。
2. 受信側で**受信を開始**を押し、マイクを許可します。
3. 送信側で例文を選ぶか文字を入力し、**音で送信**を押します。受信側の画面で文字を確認してください。再生完了は**送達確認ではありません**。

初回表示にはインターネットが必要ですが、資産がキャッシュされればオフラインで送受信できます。マイクの利用にはHTTPSが必要です。iOSで受信するときはページを開き、画面を点灯したままにしてください。受信できない場合は、端末を近づけ、送信側の音量と音声出力先を確認し、静かな場所で再試行してください。

### 開発と公開

Node.js 20.19以降または22.12以降とnpmが必要です。

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
npm run test:browser # Chromium: /usr/bin/chromium または CHROMIUM_PATH
```

Vite、TypeScript、Web Audio API、Canvas、ggwave、Service Workerで構成した静的アプリです。`dist/` はGitHub PagesやCloudflare PagesなどのHTTPS環境で配信でき、ドメイン名を固定していません。GitHub Actionsの`Publish web app`が`main`をテスト・ビルド・公開します。リポジトリのSettings → PagesでSourceを**GitHub Actions**に設定してください。音声処理は端末内で完結し、実行時に外部CDNへ依存しません。

### 通信方式・検証・制約

- 送信はggwave 0.4.0の可変長フレーム、**Audible Normalプロトコル0**を使い、上限は**UTF-8で140バイト**です。受信にはブラウザのAudioContextの実際のサンプルレートを使います。受信文字列はHTMLとして実行せず、テキストとして表示します。
- 自動テストではバイト数の上限、ggwaveのエンコード・デコード、型チェック、本番ビルド、PC・スマートフォン幅の画面、マイク拒否時の表示、オフライン再読み込みを確認しています。
- **ユーザーによる実機確認（2026-10-25）：** PC、iPad、Android端末間の双方向通信を確認しました。PC3台でも試しています。ブラウザのバージョン、サンプルレート、距離、メッセージの組み合わせ、騒音条件は記録していないため、成功率の数値は示していません。
- **未検証：** 会場の騒音下での例文5件の系統的な試験、Klesis ↔ 本アプリ、本アプリ → 既存ATOM S3RのWeb受信モード、iPhone、長時間受信・オフライン・権限復帰の試験。

ATOM S3Rのファームウェアは変更していません。ATOM側の固定長DTチャット／ACKモードも使用しません。[Klesis](https://github.com/nolimitwaiz/klesis)は相互運用性の参考にしましたが、再利用ライセンスが確認できなかったためコードや素材はコピーしていません。ggwave 0.4.0はMITライセンス、著作権© 2020 Georgi Gerganovです。詳細は[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)を参照してください。他の依存関係には各ライセンスが適用されます。本アプリ自体のライセンスは未選定です。
