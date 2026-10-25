# ATOM S3R receiver / ATOM S3R受信機

The ATOM S3R + ATOMIC ECHO BASE can receive messages sent by this web app as audible ggwave sound. The firmware source, build instructions, development history, and third-party notices live in [AtomS3R-Acoustic-Modem, `feature/ggwave`](https://github.com/nuwaa/AtomS3R-Acoustic-Modem/tree/feature/ggwave). See its [README](https://github.com/nuwaa/AtomS3R-Acoustic-Modem/blob/feature/ggwave/README.md) and [development diary](https://github.com/nuwaa/AtomS3R-Acoustic-Modem/blob/feature/ggwave/docs/DEVELOPMENT_DIARY.md).

This repository also records the [2026-10-25 ATOM S3R support history](ATOM_S3R_SUPPORT_HISTORY.md) from the web app's perspective.

## How to try it

For a new ATOM S3R, use the [browser installer](https://nuwaa.github.io/Can-You-Hear-the-Data/install.html) in desktop Chrome or Edge. It is also available in [English](https://nuwaa.github.io/Can-You-Hear-the-Data/install.en.html), [Simplified Chinese](https://nuwaa.github.io/Can-You-Hear-the-Data/install.zh-CN.html), [Traditional Chinese](https://nuwaa.github.io/Can-You-Hear-the-Data/install.zh-TW.html), and [Japanese](https://nuwaa.github.io/Can-You-Hear-the-Data/install.ja.html). It needs an ATOMIC ECHO BASE and a USB data cable; no Arduino setup is needed. Confirm the selected board and understand that flashing replaces its existing firmware and saved settings. The installer ships the 2026-10-26 build as a merged image, with its SHA-256 shown on the page. This build preserves line breaks received from the web app and displays them as separate lines on the ATOM screen. The previous build was confirmed to flash successfully from a browser on an ATOM S3R on 2026-10-26; the updated line-break build still requires hardware confirmation.

For source builds:

1. Build and flash the firmware using ESP32 Arduino core 3.3.2, M5Atomic-EchoBase 1.0.2, M5GFX 0.2.32, ESP32S3 Dev Module, 8 MB flash, Default 8MB partition, OPI PSRAM, and USB CDC On Boot enabled. Check the detected device before flashing.
2. Power on the ATOM S3R. In normal boot mode, it automatically enters the web audio receive mode. Its USB serial console runs at 115200 bps; `ggwave web on` also starts this mode manually, and `ggwave web off` stops it.
3. Open the [web app](https://nuwaa.github.io/Can-You-Hear-the-Data/) on another device. Select a preset or enter a message, then tap **Send with sound**. Place the speaker near the ATOM microphone. The ATOM does not need a browser or a separate receive command.
4. A decoded message appears on the ATOM's 128×128 display and as `GGWAVE WEB RX TEXT:` on USB serial. Line breaks are preserved and CRLF/CR input is normalized to LF. Japanese, Simplified Chinese, narrow half-width kana, and 16×16 color emoji sprites are supported. The web app limits each message to 140 UTF-8 bytes.

This is a receive-only path for the web app's ggwave Audible Normal signal. The ATOM's separate fixed-length DT chat/ACK mode is a different protocol. Sound playback alone is not a delivery acknowledgment. Reception depends on volume, distance, background noise, and browser audio settings.

On 2026-10-25, the user flashed two ATOM S3R devices and confirmed automatic receive mode and display behavior. The user also confirmed that red appears correctly in ❤️ and 🇯🇵 after an RGB565 display fix. Detailed browser sample rates, distances, and success rates were not recorded.

## 日本語

ATOM S3R + ATOMIC ECHO BASEは、このWebアプリが送るggwave Audible Normalの音を受信できます。ファームウェアのコード、ビルド手順、対応履歴、第三者ライセンスは上記の `AtomS3R-Acoustic-Modem` リポジトリにあります。

今回の作業経緯は、このリポジトリの[ATOM S3R対応履歴](ATOM_S3R_SUPPORT_HISTORY.md)にも記録しています。

新しいATOM S3Rへの導入には、デスクトップ版ChromeまたはEdgeの[ブラウザーインストーラー](https://nuwaa.github.io/Can-You-Hear-the-Data/install.ja.html)を利用できます。英語・簡体字・繁体字・日本語のページがあります。ATOMIC ECHO BASEとUSBデータケーブルが必要です。Arduino環境は不要ですが、接続端末を確認してください。既存ファームウェアと保存設定は上書きされます。2026-10-26版はWebアプリから受信した改行をATOM画面で保持します。旧版のブラウザー書き込みは実機確認済みですが、この改行対応版の実機確認は未実施です。

Arduino core 3.3.2、M5Atomic-EchoBase 1.0.2、M5GFX 0.2.32を使い、ESP32S3 Dev Module、Flash 8 MB、Default 8MB partition、OPI PSRAM、USB CDC On Boot有効でビルド・書き込みします。書き込み前に接続端末を確認してください。通常起動すると受信待機に自動で入ります。別の端末で[Webアプリ](https://nuwaa.github.io/Can-You-Hear-the-Data/)を開き、例文を選ぶか改行を含む本文を入力して「音で送信」を押します。復号できた本文は改行を保持してATOMの小画面と115200 bpsのUSBシリアルに表示されます。ATOM側でWebページを開く必要はありません。

この経路はWebアプリからATOMへの受信専用です。ATOM間の固定長DTチャット／ACKとは別の方式で、音の再生完了は受信成功の証明ではありません。音量、距離、騒音、ブラウザの音声設定によって結果が変わります。
