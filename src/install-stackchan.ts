import './style.css';
import { languageOptions, selectLanguage, type Lang } from './locale';
import { authorFooter } from './footer';

type Message = { title: string; intro: string; app: string; atomInstaller: string; before: string; steps: [string, string, string]; warning: string; board: string; overwrite: string; unsupported: string; confirm: string; select: string; after: string; result: string; firmware: string; source: string; language: string };
const messages: Record<Lang, Message> = {
  en: {
    title: 'Install on Stack-chan', intro: 'Install the fully offline firmware that receives ggwave audio and responds with expressions, head movements, speech bubbles, and voice.',
    app: 'Web app', atomInstaller: 'ATOM S3R installer', before: 'Before you start',
    steps: ['This firmware is for M5StackChan.', 'Open this page in desktop Chrome or Edge on Windows, macOS, or Linux. Connect the CoreS3 with a USB data cable and close any serial monitor.', 'Confirm both items below, press INSTALL, select the CoreS3, and review the device again in the flashing confirmation.'],
    warning: 'This firmware is only for M5 Stack-chan. Do not flash it to an ATOM S3R. The selected device’s existing firmware will be replaced.', board: 'The connected device is an M5 Stack-chan, not an ATOM S3R.', overwrite: 'I understand that the existing firmware will be replaced.',
    unsupported: 'Web Serial is unavailable. Open this HTTPS page in desktop Chrome or Edge.', confirm: 'Confirm the device and overwrite to show the install button.', select: 'Press INSTALL and select the CoreS3 USB device.',
    after: 'After installation', result: 'Reconnect USB or restart the CoreS3. Existing device settings are preserved. On a first installation, open the device settings, select Acoustic Reaction, save, and restart. Send a short ggwave Audible Normal message from the web app to test the response.', firmware: 'Firmware', source: 'Source code and build instructions', language: 'Language',
  },
  zh: {
    title: '安装到 M5 Stack-chan', intro: '安装完全离线的固件，通过 ggwave 接收声音，并以表情、摇头、气泡文字和语音作出反应。',
    app: '网页应用', atomInstaller: 'ATOM S3R 安装页面', before: '开始之前',
    steps: ['此固件适用于 M5StackChan。', '在 Windows、macOS 或 Linux 电脑上使用 Chrome 或 Edge 打开此页面。用 USB 数据线连接 CoreS3，并关闭串口监视器。', '确认下方两项后，点击 INSTALL，选择 CoreS3，并在刷写确认画面中再次核对设备。'],
    warning: '此固件仅适用于 M5 Stack-chan。请勿写入 ATOM S3R。所选设备中的现有固件将被覆盖。', board: '连接的设备是 M5 Stack-chan，而不是 ATOM S3R。', overwrite: '我了解现有固件将被覆盖。',
    unsupported: '无法使用 Web Serial。请在电脑上的 Chrome 或 Edge 中打开此 HTTPS 页面。', confirm: '确认设备及覆盖操作后，才会显示安装按钮。', select: '点击 INSTALL 并选择 CoreS3 USB 设备。',
    after: '安装完成后', result: '重新连接 USB 或重启 CoreS3。设备中已有的设置会被保留。首次安装时，请打开设备设置，选择“声学反应”，保存并重启。然后从网页应用发送一条简短的 ggwave Audible Normal 消息，确认设备能够作出反应。', firmware: '固件', source: '源代码与编译说明', language: '语言',
  },
  'zh-TW': {
    title: '安裝到 M5 Stack-chan', intro: '安裝完全離線的韌體，透過 ggwave 接收聲音，並以表情、搖頭、對話框與語音作出反應。',
    app: '網頁 App', atomInstaller: 'ATOM S3R 安裝頁面', before: '開始之前',
    steps: ['此韌體適用於 M5StackChan。', '在 Windows、macOS 或 Linux 電腦上使用 Chrome 或 Edge 開啟此頁面。以 USB 資料線連接 CoreS3，並關閉序列埠監控程式。', '確認下方兩項後，按下 INSTALL，選擇 CoreS3，並在寫入確認畫面再次核對裝置。'],
    warning: '此韌體僅適用於 M5 Stack-chan。請勿寫入 ATOM S3R。所選裝置中的現有韌體將被覆寫。', board: '連接的裝置是 M5 Stack-chan，而不是 ATOM S3R。', overwrite: '我了解現有韌體將被覆寫。',
    unsupported: '無法使用 Web Serial。請在電腦版 Chrome 或 Edge 開啟此 HTTPS 頁面。', confirm: '確認裝置與覆寫操作後，才會顯示安裝按鈕。', select: '按下 INSTALL 並選擇 CoreS3 USB 裝置。',
    after: '安裝完成後', result: '重新連接 USB 或重新啟動 CoreS3。裝置中原有的設定會保留。首次安裝時，請開啟裝置設定，選擇「聲學反應」，儲存並重新啟動。接著從網頁 App 傳送一則簡短的 ggwave Audible Normal 訊息，確認裝置能夠作出反應。', firmware: '韌體', source: '原始碼與編譯說明', language: '語言',
  },
  ja: {
    title: 'ｽﾀｯｸﾁｬﾝにインストール', intro: 'ggwaveの音を受信して、表情・首振り・吹き出し・音声で反応する完全オフライン版です。',
    app: 'Webアプリ', atomInstaller: 'ATOM S3R用インストーラー', before: '準備',
    steps: ['このファームウェアはM5StackChan用です。', 'Windows、macOS、LinuxのPC版ChromeまたはEdgeでこのページを開きます。USBデータケーブルでCoreS3を接続し、シリアルモニターを閉じてください。', '下の2項目を確認してINSTALLを押し、CoreS3を選びます。書き込み確認画面でも端末を確認してください。'],
    warning: 'これはM5ｽﾀｯｸﾁｬﾝ専用です。ATOM S3Rには書き込まないでください。選択した端末の既存ファームウェアは上書きされます。', board: '接続した端末はM5ｽﾀｯｸﾁｬﾝです（ATOM S3Rではありません）。', overwrite: '既存のファームウェアが上書きされることを了承します。',
    unsupported: 'Web Serialを利用できません。PC版ChromeまたはEdgeでHTTPSの公開ページを開いてください。', confirm: '端末と上書きを確認するとインストールボタンが表示されます。', select: 'INSTALLを押してCoreS3のUSB端末を選んでください。',
    after: '書き込み後', result: 'USBを接続し直すかCoreS3を再起動してください。既存の本体設定は保持されます。初回の場合は本体の設定画面で「音響リアクション」を選択し、保存して再起動します。Webアプリからggwave Audible Normalで短い言葉を送って反応を確認してください。', firmware: 'ファームウェア', source: 'ソースコードとビルド手順', language: '言語',
  },
};

const pages: Record<Lang, string> = { en: 'install-stackchan.en.html', zh: 'install-stackchan.zh-CN.html', 'zh-TW': 'install-stackchan.zh-TW.html', ja: 'install-stackchan.ja.html' };
const requested = document.documentElement.dataset.language;
const lang: Lang = requested === 'en' || requested === 'zh' || requested === 'zh-TW' || requested === 'ja' ? requested : selectLanguage(location.hash, navigator.language);
const m = messages[lang];
document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
document.title = `${m.title} · Can You Hear the Data?`;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value = ''): HTMLElementTagNameMap[K] { const item = document.createElement(tag); item.className = className; item.textContent = value; return item; }
function link(label: string, href: string, className = ''): HTMLAnchorElement { const item = el('a', className, label); item.href = href; return item; }
const root = document.querySelector<HTMLDivElement>('#installer')!;
const shell = el('main', 'shell installer-shell'); root.append(shell);
const header = el('header', 'header'); const brand = el('div', 'brand');
brand.append(el('div', 'eyebrow', 'CAN YOU HEAR THE DATA? / M5 STACK-CHAN'), el('h1', '', m.title), el('p', 'subtitle', m.intro)); header.append(brand); shell.append(header);
const languages = el('nav', 'language installer-languages'); languages.setAttribute('aria-label', m.language);
for (const [key, label] of languageOptions) { const item = link(label, `./${pages[key]}`, key === lang ? 'selected' : ''); if (key === lang) item.setAttribute('aria-current', 'page'); languages.append(item); }
shell.append(languages);
const atomPage = lang === 'en' ? 'install.en.html' : lang === 'zh' ? 'install.zh-CN.html' : lang === 'zh-TW' ? 'install.zh-TW.html' : 'install.ja.html';
const navigation = el('p', 'installer-navigation'); navigation.append(link(`← ${m.app}`, `./#lang=${lang}`, 'guide-back'), link(`${m.atomInstaller} ↗`, `./${atomPage}`, 'guide-back')); shell.append(navigation);
const before = el('section', 'panel installer-panel'); before.append(el('h2', '', m.before));
const steps = el('ol', 'guide-steps'); for (const step of m.steps) steps.append(el('li', '', step)); before.append(steps, el('p', 'installer-warning', m.warning));
function confirmation(id: string, label: string): HTMLInputElement { const wrapper = el('label', 'installer-check'); const input = document.createElement('input'); input.id = id; input.type = 'checkbox'; wrapper.append(input, document.createTextNode(` ${label}`)); before.append(wrapper); return input; }
const board = confirmation('confirm-board', m.board); const overwrite = confirmation('confirm-overwrite', m.overwrite);
const status = el('p', 'installer-status'); status.setAttribute('role', 'status'); before.append(status);
const control = el('div', 'installer-control'); control.hidden = true; const button = document.createElement('esp-web-install-button'); button.setAttribute('manifest', './firmware/stackchan-cores3/manifest.json'); control.append(button); before.append(control); shell.append(before);
const after = el('section', 'panel installer-panel'); after.append(el('h2', '', m.after), el('p', '', m.result));
const version = el('p', ''); version.append(document.createTextNode(`${m.firmware}: `), link('v0.15.0-alpha.6', 'https://github.com/nuwaa/stackchan-idf/releases/tag/v0.15.0-alpha.6')); after.append(version);
const source = el('p', ''); source.append(link(m.source, 'https://github.com/nuwaa/stackchan-idf/tree/main')); after.append(source); shell.append(after, authorFooter(lang));
function update() { const supported = window.isSecureContext && 'serial' in navigator; control.hidden = !supported || !board.checked || !overwrite.checked; status.textContent = !supported ? m.unsupported : control.hidden ? m.confirm : m.select; }
board.addEventListener('change', update); overwrite.addEventListener('change', update); update();
