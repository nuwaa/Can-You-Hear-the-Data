import './style.css';
import QRCode from 'qrcode';

type Lang = 'zh' | 'en' | 'ja';
const copy = {
  zh: {
    title:'用声音发送文字', intro:'打开这个网页，就能用手机或电脑的扬声器和麦克风传递短消息。无需安装应用。', open:'开始体验', receive:'接收消息', receiveSteps:['在自己的设备上打开此网页。','点按「开始接收」，并允许使用麦克风。','请对方点按「用声音发送」。收到的文字会显示在「最新消息」中。'], send:'发送消息', sendSteps:['在应用主页面选择示例消息，无需打字；也可以输入自己的短消息。','点按「用声音发送」，保持扬声器开启。','请接收方查看屏幕。声音播放完毕不代表对方已收到。'], easy:'免打字示例', easyBody:'在主页面点按「你好深圳！」或其他示例，再点按「用声音发送」。', tips:'收不到时', tipsSteps:['确认接收方已经点按「开始接收」，并允许了麦克风。','检查发送设备的音量、静音状态和扬声器输出。','靠近一点，在较安静的地方重试。接收时保持屏幕点亮。'], notes:'使用须知', notesBody:'周围其他设备也可能收到声音消息。音频不会上传到服务器。第一次打开页面需要网络；页面缓存后，发送和接收无需网络。麦克风功能需要 HTTPS。', language:'语言', back:'返回应用', scan:'扫码在手机上打开' },
  en: {
    title:'Send text through sound', intro:'Open this page on a phone or computer to exchange short messages using only a speaker and microphone. No app installation needed.', open:'Start the demo', receive:'Receive a message', receiveSteps:['Open this website on your own device.','Tap “Start listening” and allow microphone access.','Ask someone to tap “Send with sound”. The text appears under “Latest message”.'], send:'Send a message', sendSteps:['On the main screen, choose a sample message—no typing needed—or enter your own short text.','Tap “Send with sound” and keep your speaker on.','Ask the receiver to check their screen. Finished playback does not confirm delivery.'], easy:'Try without typing', easyBody:'On the main screen, tap “Hello Maker Faire!” or another sample, then tap “Send with sound”.', tips:'If nothing arrives', tipsSteps:['Check that the receiver tapped “Start listening” and allowed the microphone.','Check the sender’s volume, mute setting, and speaker output.','Move closer and retry in a quieter spot. Keep the receiving screen awake.'], notes:'Good to know', notesBody:'Other nearby devices may hear the message. Audio is never uploaded. Internet is needed for the first load; once cached, sending and receiving work offline. Microphone access requires HTTPS.', language:'Language', back:'Back to app', scan:'Scan to open on your phone' },
  ja: {
    title:'文字を音で送ろう', intro:'スマートフォンやPCでこのページを開くだけ。スピーカーとマイクで短いメッセージをやり取りできます。アプリのインストールは不要です。', open:'体験を始める', receive:'メッセージを受信', receiveSteps:['自分の端末でこのWebサイトを開きます。','「受信を開始」を押し、マイクの利用を許可します。','相手が「音で送信」を押すと、「最新のメッセージ」に文字が表示されます。'], send:'メッセージを送信', sendSteps:['アプリのメイン画面で例文を選べば入力不要です。短い文章を自分で入力することもできます。','「音で送信」を押し、スピーカーから音を出します。','相手の画面を確認してください。再生完了は到達確認ではありません。'], easy:'入力せずに試す', easyBody:'メイン画面で「こんにちは！」などの例文を押し、「音で送信」を押します。', tips:'受信できないとき', tipsSteps:['受信側で「受信を開始」を押し、マイクを許可したか確認します。','送信側の音量、ミュート、音声出力先を確認します。','端末を近づけ、静かな場所で再試行します。受信中は画面を点灯したままにしてください。'], notes:'知っておきたいこと', notesBody:'近くのほかの端末にもメッセージが届くことがあります。音声はサーバーに送信されません。初回表示にはインターネットが必要ですが、キャッシュ後の送受信はオフラインで使えます。マイクにはHTTPSが必要です。', language:'言語', back:'アプリに戻る', scan:'QRコードでスマートフォンに開く' }
};
const queryLang = new URLSearchParams(location.hash.slice(1)).get('lang');
let lang: Lang = queryLang === 'zh' || queryLang === 'en' || queryLang === 'ja' ? queryLang : navigator.language.toLowerCase().startsWith('zh') ? 'zh' : navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
const root = document.querySelector<HTMLDivElement>('#guide')!;
function node<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text: string): HTMLElementTagNameMap[K] { const value=document.createElement(tag);value.className=className;value.textContent=text;return value; }
function section(number: string, heading: string, steps: string[]): HTMLElement {
  const panel=node('section','panel guide-panel','');panel.append(node('div','kicker',number),node('h2','',heading));
  const list=node('ol','guide-steps','');for(const step of steps)list.append(node('li','',step));panel.append(list);return panel;
}
function render() {
  const m=copy[lang];document.documentElement.lang=lang==='zh'?'zh-CN':lang;document.title=`${m.title} · Can You Hear the Data?`;
  const shell=node('main','shell guide-shell','');root.replaceChildren(shell);
  const header=node('header','header','');const brand=node('div','brand','');brand.append(node('div','eyebrow','CAN YOU HEAR THE DATA? / GUIDE'),node('h1','',m.title),node('p','subtitle guide-intro',m.intro));header.append(brand);
  const languages=node('nav','language','');languages.setAttribute('aria-label',m.language);
  for(const [key,label] of [['zh','中文'],['en','EN'],['ja','日本語']] as const){const button=node('button',key===lang?'selected':'',label);button.type='button';button.onclick=()=>{lang=key;history.replaceState(null,'',`#lang=${lang}`);render();};languages.append(button);}header.append(languages);shell.append(header);
  const open=node('a','primary guide-cta',m.open+' →');open.href=`./#lang=${lang}`;shell.append(open);
  const grid=node('div','guide-grid','');shell.append(grid);
  grid.append(section('01',m.receive,m.receiveSteps),section('02',m.send,m.sendSteps));
  const easy=node('section','panel guide-panel','');easy.append(node('div','kicker','03'),node('h2','',m.easy),node('p','',m.easyBody));grid.append(easy);
  grid.append(section('04',m.tips,m.tipsSteps));
  const notes=node('section','panel guide-panel guide-notes','');notes.append(node('div','kicker','05'),node('h2','',m.notes),node('p','',m.notesBody));shell.append(notes);
  if(location.protocol==='https:') { const qr=node('section','panel guide-qr','');qr.append(node('h2','',m.scan));const canvas=node('canvas','qr-canvas','');qr.append(canvas);shell.append(qr);QRCode.toCanvas(canvas,new URL('./guide.html',location.href).href,{width:210,margin:2,color:{dark:'#07131b',light:'#ffffff'}}).catch(()=>qr.remove()); }
  const back=node('a','guide-back',m.back+' →');back.href=`./#lang=${lang}`;shell.append(back);
}
render();
