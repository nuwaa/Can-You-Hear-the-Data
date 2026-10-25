# Can You Hear the Data? — 繁體中文／台灣華語

[Languages / 语言 / 語言 / 言語](../README.md)

### 專案簡介與使用方式

這是為 Maker Faire Shenzhen 2026 製作的獨立聲音資料傳輸網頁 App。它使用官方 [ggwave](https://github.com/ggerganov/ggwave) WebAssembly 套件，透過喇叭傳送簡短的 UTF-8 文字，再用麥克風接收。傳送訊息不需要 Wi-Fi、藍牙、伺服器、帳號或流量分析；附近的裝置也可能收到同一段聲音訊號。App 與[訪客使用說明](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html)支援英文、簡體中文、台灣華語及日文，說明頁提供 QR Code。選擇範例訊息就能不用打字直接體驗。

**專案背景：** 這項工作最初從 [AtomS3R-Acoustic-Modem](https://github.com/nuwaa/AtomS3R-Acoustic-Modem) 開始。基於多方面的考量，網頁 App 後來改在這個獨立儲存庫開發。原儲存庫仍是 ATOM S3R 接收端及其韌體的參考。

**免安裝即可使用：** 在電腦、平板或手機的相容瀏覽器開啟 https://nuwaa.github.io/Can-You-Hear-the-Data/ 即可使用，不必在每台裝置安裝 npm 或原生 App。

**一人傳送、多人接收：** 通訊不受限於兩台裝置。可以由一台電腦播放一次聲音，讓附近多位訪客同時用自己的手機或平板接收。每位接收者都開啟[網頁 App](https://nuwaa.github.io/Can-You-Hear-the-Data/)，點選**開始接收**並允許使用麥克風；傳送者選擇範例訊息或輸入文字，再點選**用聲音傳送**。訪客也可以用自己的裝置回傳訊息。不需要配對或指定接收者；能否收到取決於距離、喇叭輸出及環境噪音。播放完畢**不代表**所有裝置都已成功解碼。

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

本專案不修改 ATOM S3R 韌體，也不使用其獨立的固定長度 DT 聊天／ACK 模式。[Klesis](https://github.com/nolimitwaiz/klesis) 僅作為互通性參考；因為沒有確認其重複使用授權，本專案未複製其程式碼或素材。ggwave 0.4.0 採 MIT 授權，著作權 © 2020 Georgi Gerganov；詳見 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)。其他相依套件保留各自的授權。本 App 本身的授權尚未決定。
