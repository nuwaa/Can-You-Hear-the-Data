import './style.css';
import { authorFooter } from './footer';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value = ''): HTMLElementTagNameMap[K] {
  const item = document.createElement(tag); item.className = className; item.textContent = value; return item;
}
function link(label: string, href: string, className = ''): HTMLAnchorElement {
  const item = el('a', className, label); item.href = href; return item;
}

const root = document.querySelector<HTMLDivElement>('#installer')!;
const shell = el('main', 'shell installer-shell'); root.append(shell);
const header = el('header', 'header'); const brand = el('div', 'brand');
brand.append(
  el('div', 'eyebrow', 'CAN YOU HEAR THE DATA? / M5 STACK-CHAN'),
  el('h1', '', 'ｽﾀｯｸﾁｬﾝにインストール'),
  el('p', 'subtitle', 'ggwaveの音を受信して、表情・首振り・吹き出し・音声で反応する完全オフライン版です。'),
);
header.append(brand); shell.append(header);
const navigation = el('p', 'installer-navigation');
navigation.append(link('← Webアプリ', './#lang=ja', 'guide-back'), link('ATOM S3R用インストーラー ↗', './install.ja.html', 'guide-back'));
shell.append(navigation);

const before = el('section', 'panel installer-panel'); before.append(el('h2', '', '準備'));
const steps = el('ol', 'guide-steps');
for (const step of [
  'このファームウェアはM5StackChan用です。',
  'Windows、macOS、LinuxのPC版ChromeまたはEdgeでこのページを開きます。USBデータケーブルでCoreS3を接続し、シリアルモニターを閉じてください。',
  '下の2項目を確認してINSTALLを押し、CoreS3を選びます。書き込み確認画面でも端末を確認してください。',
]) steps.append(el('li', '', step));
before.append(steps);
before.append(el('p', 'installer-warning', 'これはM5ｽﾀｯｸﾁｬﾝ専用です。ATOM S3Rには書き込まないでください。選択した端末の既存ファームウェアは上書きされます。'));
function confirmation(id: string, label: string): HTMLInputElement {
  const wrapper = el('label', 'installer-check'); const input = document.createElement('input');
  input.id = id; input.type = 'checkbox'; wrapper.append(input, document.createTextNode(` ${label}`)); before.append(wrapper); return input;
}
const board = confirmation('confirm-board', '接続した端末はM5ｽﾀｯｸﾁｬﾝです（ATOM S3Rではありません）。');
const overwrite = confirmation('confirm-overwrite', '既存のファームウェアが上書きされることを了承します。');
const status = el('p', 'installer-status'); status.setAttribute('role', 'status'); before.append(status);
const control = el('div', 'installer-control'); control.hidden = true;
const button = document.createElement('esp-web-install-button');
button.setAttribute('manifest', './firmware/stackchan-cores3/manifest.json'); control.append(button); before.append(control); shell.append(before);

const after = el('section', 'panel installer-panel');
after.append(el('h2', '', '書き込み後'), el('p', '', 'USBを接続し直すかCoreS3を再起動してください。既存の本体設定は保持されます。初回の場合は本体の設定画面で「音響リアクション」を選択し、保存して再起動します。Webアプリからggwave Audible Normalで短い言葉を送って反応を確認してください。'));
const version = el('p', ''); version.append(document.createTextNode('ファームウェア: '), link('v0.15.0-alpha.6', 'https://github.com/nuwaa/stackchan-idf/releases/tag/v0.15.0-alpha.6'));
after.append(version);
const source = el('p', ''); source.append(link('ソースコードとビルド手順', 'https://github.com/nuwaa/stackchan-idf/tree/main')); after.append(source);
shell.append(after, authorFooter('ja'));

function update() {
  const supported = window.isSecureContext && 'serial' in navigator;
  control.hidden = !supported || !board.checked || !overwrite.checked;
  status.textContent = !supported
    ? 'Web Serialを利用できません。PC版ChromeまたはEdgeでHTTPSの公開ページを開いてください。'
    : control.hidden ? '端末と上書きを確認するとインストールボタンが表示されます。' : 'INSTALLを押してCoreS3のUSB端末を選んでください。';
}
board.addEventListener('change', update); overwrite.addEventListener('change', update); update();
