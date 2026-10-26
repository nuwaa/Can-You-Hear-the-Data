# M5ｽﾀｯｸﾁｬﾝ対応履歴（2026年10月26日）

この文書は、[Can You Hear the Data?](../README.md)のggwave音をM5ｽﾀｯｸﾁｬﾝで受信し、
完全オフラインで反応させる機能と、ブラウザーから導入するためのWebインストーラーを
複数リポジトリにまたがって開発した記録である。

- 受信・表示・音声・サーボ制御: [nuwaa/stackchan-idf](https://github.com/nuwaa/stackchan-idf)
- Web送信・インストーラー: [nuwaa/Can-You-Hear-the-Data](https://github.com/nuwaa/Can-You-Hear-the-Data)
- 方式の参考: [nuwaa/AtomS3R-Acoustic-Modem](https://github.com/nuwaa/AtomS3R-Acoustic-Modem/tree/feature/ggwave)

ATOM S3RとM5ｽﾀｯｸﾁｬﾝは、それぞれ異なるファームウェアとインストーラーを使用する。
既存のATOM S3R向け実装と配布ページは変更せず、M5ｽﾀｯｸﾁｬﾝ向けを別ページとして追加した。

## ファームウェア開発

`stackchan-idf`のCoreS3向けに「音響リアクション」動作モードを追加した。起動時にWi-Fi、
Bluetooth、クラウド会話、カメラを停止し、内蔵マイクをggwave受信処理が専有する。
Webアプリと同じggwave 0.4のAudible Normal（protocol 0）、24 kHz、可変長UTF-8を受信する。
受信中のログで`operation_mode=6`、`AcousticReaction`、`listening: ggwave 0.4 Audible Normal/0`
を確認した。

初期実装では受信タスクがCPUを占有し、タスクウォッチドッグが`IDLE1`を検出した。
受信ループからアイドルタスクへ実行機会を渡すようにした後は、継続受信中もウォッチドッグが
発生せず、マイクレベルとヒープの定期ログが継続することを確認した。

受信語に応じて、表情、発話、吹き出し、うなずき、左右の首振りを組み合わせる。
実機確認をしながら動作量を強調し、うなずきの上側は`-20°`まで使う設定とした。
「こんにちは」「かわいい」「元気」「hello」「hi」「你好」「您好」「故障」「壊れた」などの
既定語に反応する。詳細は
[音響リアクション仕様](https://github.com/nuwaa/stackchan-idf/blob/main/docs/acoustic-reaction.md)を参照。

表示は日本語に加えて半角カタカナ、簡体字、繁体字へフォントフォールバックし、
Unicode 18.0のfully-qualified絵文字を16×16カラー画像で表示する。ユーザーがCoreS3実機で
各文字種と絵文字の表示を確認した。音声応答を聞き取りやすくするため、CoreS3内蔵スピーカーの
増幅率を`4`から`6`へ変更した。

関連する`stackchan-idf`コミットは次のとおり。

- [`b162d34`](https://github.com/nuwaa/stackchan-idf/commit/b162d34): オフラインggwave音響受信とリアクション
- [`28e4653`](https://github.com/nuwaa/stackchan-idf/commit/28e4653): 多言語文字とカラー絵文字
- [`0fd6062`](https://github.com/nuwaa/stackchan-idf/commit/0fd6062): 音量調整とCoreS3リリース
- [`12ee53d`](https://github.com/nuwaa/stackchan-idf/commit/12ee53d): CoreS3専用インストーラー構成

成果物は[`v0.15.0-alpha.6`](https://github.com/nuwaa/stackchan-idf/releases/tag/v0.15.0-alpha.6)
として公開した。今回のalphaリリースにATOM S3R用イメージは含めていない。

## Webインストーラー

M5ｽﾀｯｸﾁｬﾝ専用ページを`Can-You-Hear-the-Data`のGitHub Pages配下へ追加した。
ESP Web ToolsでCoreS3用のブートローダー、パーティションテーブル、boot control、recovery、
拡張テーブル、メインアプリの6イメージを書き込む。manifestは全消去を要求しないため、
既存のNVS設定を保持する。ビルド時には各ファイルのサイズ、SHA-256、書き込みアドレス、
ESP32-S3イメージのmagicを検査する。

- 自動言語選択: <https://nuwaa.github.io/Can-You-Hear-the-Data/install-stackchan.html>
- 日本語: <https://nuwaa.github.io/Can-You-Hear-the-Data/install-stackchan.ja.html>
- English: <https://nuwaa.github.io/Can-You-Hear-the-Data/install-stackchan.en.html>
- 简体中文: <https://nuwaa.github.io/Can-You-Hear-the-Data/install-stackchan.zh-CN.html>
- 繁體中文: <https://nuwaa.github.io/Can-You-Hear-the-Data/install-stackchan.zh-TW.html>

誤書き込みを避けるため、M5ｽﾀｯｸﾁｬﾝでありATOM S3Rではないことと、既存ファームウェアの
上書きを確認するまでINSTALLボタンを表示しない。トップページと使い方ページも、現在選択中の
言語に対応するM5ｽﾀｯｸﾁｬﾝ用ページへリンクする。既存のATOM S3R用ページ、manifest、
ファームウェアは別のまま維持している。

関連する`Can-You-Hear-the-Data`コミットは次のとおり。

- [`628c56f`](https://github.com/nuwaa/Can-You-Hear-the-Data/commit/628c56f): M5ｽﾀｯｸﾁｬﾝ専用インストーラーとファームウェア検査
- [`50b60c8`](https://github.com/nuwaa/Can-You-Hear-the-Data/commit/50b60c8): 日本語表現の調整
- [`cedb493`](https://github.com/nuwaa/Can-You-Hear-the-Data/commit/cedb493): 英語・簡体字・繁体字・日本語ページ
- [`d579952`](https://github.com/nuwaa/Can-You-Hear-the-Data/commit/d579952): トップページからの4言語リンク
- [`53bd11e`](https://github.com/nuwaa/Can-You-Hear-the-Data/commit/53bd11e): 使い方ページからの4言語リンク
- [`3092979`](https://github.com/nuwaa/Can-You-Hear-the-Data/commit/3092979): ATOM S3R日本語リンク表現の統一

## 検証範囲

- ユーザーがM5ｽﾀｯｸﾁｬﾝ実機で音響受信、音声応答、表示、首の動作、多言語文字、絵文字を確認した。
- CoreS3版ファームウェアのビルドとリリースワークフローが成功した。
- Web側の単体テスト、TypeScript型検査、本番ビルド、ファームウェアmanifest検査が成功した。
- ヘッドレスChromeで、デスクトップ・モバイル幅、4言語のトップページ・使い方ページからの
  リンク、各インストーラーの表示を確認した。
- GitHub Pagesの各公開ワークフローが成功した。

通信成功率、会場騒音下での距離別評価、全リアクション語の反復回数は記録していない。
実機確認は今回使用したM5ｽﾀｯｸﾁｬﾝでの機能確認であり、全個体・全ブラウザー環境の保証ではない。
