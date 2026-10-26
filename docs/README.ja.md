# Can You Hear the Data? — 日本語

[Languages / 语言 / 語言 / 言語](../README.md)

### 概要と使い方

Maker Faire Shenzhen 2026に向けた、独立した音響データ通信Webアプリです。公式の[ggwave](https://github.com/ggerganov/ggwave) WebAssemblyパッケージを使い、短いUTF-8文字列をスピーカーから送り、マイクで受け取ります。メッセージの伝送にWi-Fi、Bluetooth、サーバー、アカウント、アクセス解析は不要です。近くにいるほかの端末にも同じ信号が届く場合があります。アプリと[来場者向けガイド](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html)は4言語に対応し、ガイドのQRコードから自分のスマートフォンで開けます。例文を選べば入力せずに試せます。

**プロジェクトの経緯：** この取り組みは、もともと[AtomS3R-Acoustic-Modem](https://github.com/nuwaa/AtomS3R-Acoustic-Modem)で始まりました。その後、さまざまな事情からWebアプリの開発を独立したこのリポジトリへ移しました。元のリポジトリは引き続きATOM S3R受信側とそのファームウェアの参照先です。

**ATOM S3Rでも受信できます：** 対応ファームウェアを入れたATOM S3R + ATOMIC ECHO BASEは、通常起動すると受信待機に入り、このWebアプリから送った音の本文を小画面に表示します。[接続・ビルド手順と検証記録](ATOM_S3R_RECEIVER.md)を参照してください。

**ATOM S3Rのブラウザーインストーラー：** https://nuwaa.github.io/Can-You-Hear-the-Data/install.ja.html

**M5ｽﾀｯｸﾁｬﾝのブラウザーインストーラー：** https://nuwaa.github.io/Can-You-Hear-the-Data/install-stackchan.ja.html

開発・実機確認・4言語版公開の経緯は[M5ｽﾀｯｸﾁｬﾝ対応履歴](STACKCHAN_SUPPORT_HISTORY.md)に記録しています。

**インストール不要で利用できます：** PC・タブレット・スマートフォンの対応ブラウザで https://nuwaa.github.io/Can-You-Hear-the-Data/ を開くだけで使えます。各端末にnpmやネイティブアプリを入れる必要はありません。

例文は**まず試す**、**会話する**、**M5Stackの話**に分けています。会話とM5Stackの例文は表示言語に合わせて切り替わり、文字を入力せずに質問と返事を送れます。

**1台から複数の端末へ：** 通信は2台の間に限りません。人間の会話と同じように、音が届き、端末が復号できる範囲なら、相手を指定せず誰とでも文字をやり取りできます。1台のPCから一度音を流し、近くにいる複数の来場者がそれぞれのスマートフォンやタブレットで同時に受信できます。受信する人は[Webアプリ](https://nuwaa.github.io/Can-You-Hear-the-Data/)を開いて**受信を開始**を押し、マイクを許可します。送信側は例文を選ぶか文字を入力して**音で送信**を押します。来場者が自分の端末から返信することもできます。ペアリングや宛先の指定は不要です。受信できるかどうかは距離、スピーカーの出力、周囲の騒音に左右され、再生完了は**全端末への送達確認ではありません**。

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
- **未検証：** 会場の騒音下での全例文の系統的な試験、Klesis ↔ 本アプリ、ATOM S3Rとの通信成功率、iPhone、長時間受信・オフライン・権限復帰の試験。

ATOM S3Rの対応ファームウェアは[別リポジトリ](https://github.com/nuwaa/AtomS3R-Acoustic-Modem/tree/feature/ggwave)で管理しています。このWebアプリはATOM側の固定長DTチャット／ACKモードを使用しません。[Klesis](https://github.com/nolimitwaiz/klesis)は相互運用性の参考にしましたが、再利用ライセンスが確認できなかったためコードや素材はコピーしていません。ggwave 0.4.0はMITライセンス、著作権© 2020 Georgi Gerganovです。詳細は[THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)を参照してください。他の依存関係には各ライセンスが適用されます。本アプリ自体のライセンスは未選定です。
