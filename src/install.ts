import './style.css';
import { languageOptions, selectLanguage, type Lang } from './locale';

type Message = {
  title: string; intro: string; app: string; guide: string; before: string;
  steps: [string, string, string]; warning: string; board: string; overwrite: string;
  unsupported: string; confirm: string; select: string; after: string; result: string;
  download: string; source: string; language: string;
};
const messages: Record<Lang, Message> = {
  en: {
    title: 'Install the ATOM S3R receiver', intro: 'Flash the receiver firmware from your browser. No Arduino setup is needed.',
    app: 'Web app', guide: 'How to use', before: 'Before you start',
    steps: ['Attach an ATOMIC ECHO BASE to your ATOM S3R.',
      'Open this page in desktop Chrome or Edge on Windows, macOS, or Linux. Connect the ATOM S3R with a USB data cable and close any serial monitor.',
      'Confirm both items below, press INSTALL, select your ATOM S3R, and review the flashing confirmation.'],
    warning: 'This replaces the selected device’s firmware and saved settings. This firmware is for ATOM S3R only.',
    board: 'The connected device is an ATOM S3R.', overwrite: 'I understand that existing firmware and saved settings will be replaced.',
    unsupported: 'Web Serial is unavailable. Open this HTTPS page in desktop Chrome or Edge.',
    confirm: 'Confirm the device and overwrite to show the install button.', select: 'Press INSTALL and select the USB device.',
    after: 'After installation', result: 'Reconnect or restart the ATOM S3R. It will automatically listen for ggwave Audible Normal messages from this web app. Send a short message and check the ATOM S3R display.',
    download: 'Download firmware', source: 'Source code and build instructions', language: 'Language'
  },
  zh: {
    title: '安装 ATOM S3R 接收端', intro: '直接在浏览器中刷入接收固件，无需配置 Arduino 开发环境。',
    app: '网页应用', guide: '使用方法', before: '开始之前',
    steps: ['在 ATOM S3R 上安装 ATOMIC ECHO BASE。',
      '在 Windows、macOS 或 Linux 电脑上使用 Chrome 或 Edge 打开此页面。用 USB 数据线连接 ATOM S3R，并关闭串口监视器。',
      '确认下方两项后，点击 INSTALL，选择你的 ATOM S3R，并再次核对刷写确认信息。'],
    warning: '此操作会覆盖所选设备中现有的固件和已保存的设置。此固件仅适用于 ATOM S3R。',
    board: '连接的设备是 ATOM S3R。', overwrite: '我了解现有固件和已保存的设置将被覆盖。',
    unsupported: '无法使用 Web Serial。请在电脑上的 Chrome 或 Edge 中打开此 HTTPS 页面。',
    confirm: '确认设备及覆盖操作后，才会显示安装按钮。', select: '点击 INSTALL 并选择 USB 设备。',
    after: '安装完成后', result: '重新连接 USB 或重启 ATOM S3R。它会自动进入接收状态，等待来自此网页应用的 ggwave Audible Normal 消息。发送一条短消息，并查看 ATOM S3R 的屏幕。',
    download: '下载固件', source: '源代码与编译说明', language: '语言'
  },
  'zh-TW': {
    title: '安裝 ATOM S3R 接收端', intro: '直接透過瀏覽器寫入接收韌體，不必設定 Arduino 開發環境。',
    app: '網頁 App', guide: '使用說明', before: '開始之前',
    steps: ['將 ATOMIC ECHO BASE 裝到 ATOM S3R 上。',
      '在 Windows、macOS 或 Linux 電腦上，使用 Chrome 或 Edge 開啟此頁面。以 USB 資料線連接 ATOM S3R，並關閉序列埠監控程式。',
      '確認下方兩項後，按下 INSTALL，選擇你的 ATOM S3R，並再次核對寫入確認資訊。'],
    warning: '此操作會覆寫所選裝置原有的韌體與已儲存的設定。此韌體僅適用於 ATOM S3R。',
    board: '連接的裝置是 ATOM S3R。', overwrite: '我了解原有韌體與已儲存的設定將被覆寫。',
    unsupported: '無法使用 Web Serial。請在電腦版 Chrome 或 Edge 開啟此 HTTPS 頁面。',
    confirm: '確認裝置與覆寫操作後，才會顯示安裝按鈕。', select: '按下 INSTALL 並選擇 USB 裝置。',
    after: '安裝完成後', result: '重新連接 USB 或重新啟動 ATOM S3R。它會自動進入接收狀態，等待來自此網頁 App 的 ggwave Audible Normal 訊息。傳送一則短訊息，並查看 ATOM S3R 的螢幕。',
    download: '下載韌體', source: '原始碼與編譯說明', language: '語言'
  },
  ja: {
    title: 'ATOM S3R受信機をインストール', intro: 'Arduino開発環境を用意せず、ブラウザーから受信ファームウェアを書き込めます。',
    app: 'Webアプリ', guide: '使い方', before: '準備',
    steps: ['ATOM S3RにATOMIC ECHO BASEを装着します。',
      'Windows、macOS、LinuxのPC版ChromeまたはEdgeでこのページを開きます。USBデータケーブルでATOM S3Rを接続し、シリアルモニターを閉じてください。',
      '下の2項目を確認してINSTALLを押し、ATOM S3Rを選びます。書き込み確認画面でも端末を確認してください。'],
    warning: '選択した端末の既存ファームウェアと保存設定は上書きされます。このファームウェアはATOM S3R専用です。',
    board: '接続した端末はATOM S3Rです。', overwrite: '既存のファームウェアと保存設定が上書きされることを了承します。',
    unsupported: 'Web Serialを利用できません。PC版ChromeまたはEdgeでHTTPSの公開ページを開いてください。',
    confirm: '端末と上書きを確認するとインストールボタンが表示されます。', select: 'INSTALLを押してUSB端末を選んでください。',
    after: '書き込み後', result: 'USBを接続し直すか再起動すると、Webアプリのggwave Audible Normalの受信待機に自動で入ります。短い文章を送信して、ATOM S3Rの画面を確認してください。',
    download: 'ファームウェアをダウンロード', source: 'ソースコードとビルド手順', language: '言語'
  }
};

const pages: Record<Lang, string> = { en: 'install.en.html', zh: 'install.zh-CN.html', 'zh-TW': 'install.zh-TW.html', ja: 'install.ja.html' };
const requested = document.documentElement.dataset.language;
const lang: Lang = requested === 'en' || requested === 'zh' || requested === 'zh-TW' || requested === 'ja'
  ? requested : selectLanguage(location.hash, navigator.language);
const m = messages[lang];
document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
document.title = `${m.title} · Can You Hear the Data?`;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value = ''): HTMLElementTagNameMap[K] {
  const item = document.createElement(tag); item.className = className; item.textContent = value; return item;
}
function link(label: string, href: string, className = ''): HTMLAnchorElement {
  const item = el('a', className, label); item.href = href; return item;
}
const root = document.querySelector<HTMLDivElement>('#installer')!;
const shell = el('main', 'shell installer-shell'); root.append(shell);
const header = el('header', 'header'); const brand = el('div', 'brand');
brand.append(el('div', 'eyebrow', 'CAN YOU HEAR THE DATA? / ATOM S3R'), el('h1', '', m.title), el('p', 'subtitle', m.intro));
header.append(brand); shell.append(header);
const languages = el('nav', 'language installer-languages'); languages.setAttribute('aria-label', m.language);
for (const [key, label] of languageOptions) {
  const item = link(label, `./${pages[key]}`, key === lang ? 'selected' : '');
  if (key === lang) item.setAttribute('aria-current', 'page');
  languages.append(item);
}
shell.append(languages);
const navigation = el('p', 'installer-navigation');
navigation.append(link(`← ${m.app}`, `./#lang=${lang}`, 'guide-back'), link(`${m.guide} ↗`, `./guide.html#lang=${lang}`, 'guide-back'));
shell.append(navigation);
const before = el('section', 'panel installer-panel'); before.append(el('h2', '', m.before));
const steps = el('ol', 'guide-steps'); for (const step of m.steps) steps.append(el('li', '', step)); before.append(steps);
before.append(el('p', 'installer-warning', m.warning));
function confirmation(id: string, label: string): HTMLInputElement {
  const wrapper = el('label', 'installer-check'); const input = document.createElement('input');
  input.id = id; input.type = 'checkbox'; wrapper.append(input, document.createTextNode(` ${label}`)); before.append(wrapper); return input;
}
const board = confirmation('confirm-board', m.board);
const overwrite = confirmation('confirm-overwrite', m.overwrite);
const status = el('p', 'installer-status'); status.setAttribute('role', 'status'); before.append(status);
const control = el('div', 'installer-control'); control.hidden = true;
const button = document.createElement('esp-web-install-button'); button.setAttribute('manifest', './firmware/atom-s3r/manifest.json');
control.append(button); before.append(control); shell.append(before);
const after = el('section', 'panel installer-panel'); after.append(el('h2', '', m.after), el('p', '', m.result));
const download = el('p', ''); const firmware = link(m.download, './firmware/atom-s3r/atoms3r-2026-10-25-merged.bin');
firmware.download = 'atoms3r-2026-10-25-merged.bin';
const integrity = el('small', '', '2026-10-25 · SHA-256 ');
integrity.append(el('code', '', 'cb56a9d5905437ce034bc71c88ffb731ab5c09648e004527efa2989a855b6960'));
download.append(firmware, document.createElement('br'), integrity); after.append(download);
const source = el('p', ''); source.append(link(m.source, 'https://github.com/nuwaa/AtomS3R-Acoustic-Modem/tree/feature/ggwave'));
after.append(source); shell.append(after);
function update() {
  const supported = window.isSecureContext && 'serial' in navigator;
  control.hidden = !supported || !board.checked || !overwrite.checked;
  status.textContent = !supported ? m.unsupported : control.hidden ? m.confirm : m.select;
}
board.addEventListener('change', update); overwrite.addEventListener('change', update); update();
