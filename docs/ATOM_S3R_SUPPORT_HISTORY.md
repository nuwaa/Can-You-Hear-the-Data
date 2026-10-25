# ATOM S3R対応履歴（2026年10月25〜26日）

このページは、[Can You Hear the Data?](../README.md) の音をATOM S3Rで受信・表示できるようにした今回の作業を記録する。ファームウェアの実装と詳細な開発日記は [AtomS3R-Acoustic-ModemのPR #2](https://github.com/nuwaa/AtomS3R-Acoustic-Modem/pull/2) にあり、このリポジトリにはWebアプリから見た経緯を残す。

## 経緯

1. **Arduino環境と2台の確認。** ESP32 Arduino core 3.3.2、M5Atomic-EchoBase 1.0.2、M5GFX 0.2.32を使い、Flash 8 MB、Default 8MB partition、OPI PSRAM、USB CDC On Bootを設定した。COM5・COM6のATOM S3Rを確認してから書き込み、両方の115200 bpsシリアル起動ログを確認した。初期のAX.25ファームウェアでは端末間の設定・通信を確認した。
2. **ggwave方式の切り分け。** 既存のATOM間チャットは固定長DTフレームと独自のACKを使うため、Webアプリの可変長ggwave Audible Normalとは音も形式も異なる。Webアプリの音を受ける専用の `ggwave web` 受信経路を使い、通常起動で自動的に受信待機へ入るようにした。送信側Webアプリのコードや伝送形式は変更していない。
3. **多言語の小画面表示。** 日本語・簡体字に加え、半角カナを8ピクセル幅で表示するようにした。最初は半角カナが全角幅になったが、修正後にユーザーが両端末で表示を確認した。
4. **絵文字表示。** Unicode 18.0のfully-qualified絵文字3,963種について、Noto Emojiから生成した16×16・32色画像をファームウェアに追加した。最初の実機表示は全体的に青く、❤️と🇯🇵の赤が出なかった。M5GFXへ渡すRGB565画像の型を修正して再ビルド・両端末へ書き込み、ユーザーが赤を確認した。

## 確認できた範囲

- 最終ファームウェアは上記構成でビルド成功。スケッチは3,013,335 / 3,342,336バイト（90%）、グローバル変数は131,460 / 327,680バイト（40%）だった。ビルド済みバイナリのSHA256は `A4EB341E1EEC0346B470E9C9A37FCB6CDF599B15600E15CDABA88EEBD92AD4EA`。
- COM5・COM6の両ATOM S3Rへ書き込み後、ユーザーが起動時受信状態、文字表示、絵文字の赤色表示を確認した。絵文字の生成データは5,143個のUTF-8入力キーで照合した。
- ブラウザのサンプルレート、端末間距離、騒音条件、各メッセージの成功率は記録していない。再生完了はATOMでの復号成功や送達確認を意味しない。

利用手順と現在の制約は[ATOM S3R受信ガイド](ATOM_S3R_RECEIVER.md)を参照。

## 2026年10月26日 — ブラウザーから導入できるようにする

Arduino開発環境を構築せずにATOM S3Rへ導入できるよう、[PR #4](https://github.com/nuwaa/Can-You-Hear-the-Data/pull/4)で[ESP Web Tools](https://esphome.github.io/esp-web-tools/)を使う[インストーラー](https://nuwaa.github.io/Can-You-Hear-the-Data/install.html)を追加した。対象はATOM S3R + ATOMIC ECHO BASE。PC版ChromeまたはEdgeからUSB接続し、機種と既存ファームウェア・保存設定の上書きを確認してから端末を選ぶ。ブラウザーがESP32-S3を検出してもATOM S3Rと断定はできないため、端末の確認を利用者に求める構成にした。

配布するのは10月25日に実機で確認したアプリ、ブートローダー、パーティションを含むESP32-S3用統合イメージ。Arduinoの8 MB統合ファイルの末尾にあった未使用の `0xFF` 領域だけを除いて3,080,192バイトにした。配布ファイルのSHA-256は `cb56a9d5905437ce034bc71c88ffb731ab5c09648e004527efa2989a855b6960`。この値は上記のアプリ単体バイナリのSHA-256とは異なる。ビルド時にサイズ、ハッシュ、ブートローダー・パーティション・アプリの配置を検査し、GitHub Pagesから配信されたファイルのハッシュも照合した。

公開後、ユーザーがブラウザー経由でATOM S3Rへ書き込み、正常に動作したことを確認した。書き込みを試した台数、PCのOS・ブラウザー版、所要時間、失敗率は記録していない。今回の実機確認はブラウザー書き込みとその後の動作についてであり、4言語版それぞれから書き込む試験とは区別する。

[PR #5](https://github.com/nuwaa/Can-You-Hear-the-Data/pull/5)では、インストーラーの[英語](https://nuwaa.github.io/Can-You-Hear-the-Data/install.en.html)、[簡体字](https://nuwaa.github.io/Can-You-Hear-the-Data/install.zh-CN.html)、[繁体字](https://nuwaa.github.io/Can-You-Hear-the-Data/install.zh-TW.html)、[日本語](https://nuwaa.github.io/Can-You-Hear-the-Data/install.ja.html)の固定URLを追加した。従来の `install.html` はブラウザー言語に合わせる入口として残し、Webアプリ・来場者ガイド・各言語のREADMEから対応ページへ移動できるようにした。既存テスト4件と本番ビルドを通し、4ページの言語・リンク・manifest参照・書き込み前の2項目確認をヘッドレスChromeで確認した。ファームウェアとmanifestはPR #5で変更していない。デプロイ後、4ページがGitHub Pagesから配信されることも確認した。

## 2026年10月26日 — 改行対応ファームウェア

Webアプリ側で保持されるようになった改行をATOM S3R単体画面でも表示するため、受信ファームウェアを更新した。ggwave Web受信ではCRLFとCRをLFへ正規化し、UTF-8本文中のLFを許可して画面描画時に明示的な改行として扱う。ATOM間の固定長DTチャットは従来どおり単一行制限を維持する。

Arduino core 3.3.2と既存の固定依存関係でビルドし、スケッチは3,013,427 / 3,342,336バイト（90%）、グローバル変数は131,460 / 327,680バイト（40%）。配布用統合イメージは3,080,192バイト、SHA-256は `da4da02dca2d090aabdb711bfee97cd1ddd3445b35e045b3de36bf6ec296a47c`。ネイティブ改行検証、Python 20件、ファームウェア全体ビルドは通過した。Webインストーラーからの書き込みと、音響経路を通したATOM画面の2行表示は実機確認待ち。
