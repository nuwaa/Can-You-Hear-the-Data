import './style.css';
import { AudioLink } from './audio';
import { byteCount, MAX_BYTES, validMessage } from './codec';
import { languageOptions, selectLanguage, type Lang } from './locale';
import { STARTER_PRESETS, CONVERSATION_PRESETS, M5STACK_PRESETS } from './presets';

const messages = {
  en: { subtitle:'TEXT TRAVELS THROUGH SOUND', guide:'How to use', language:'Language', spectrum:'AUDIO SPECTRUM / LIVE INPUT', level:'LEVEL', bytes:'UTF-8 bytes', receive:'RECEIVE', transmit:'TRANSMIT', idle:'Microphone off', listening:'Listening for sound…', start:'Start listening', stop:'Stop listening', latest:'Latest message', empty:'Waiting for a message', history:'Recent messages', noHistory:'Nothing received yet', copy:'Copy', compose:'Your message', placeholder:'Type something to send by sound', send:'Send with sound', sending:'Playing audio…', played:'Audio played · delivery unconfirmed', duration:'About', seconds:'seconds', protocol:'Audio mode', normal:'Audible Normal · compatible with ATOM web receiver', presets:'Try a message', starter:'Start here', conversation:'Keep talking', maker:'M5Stack talk', privacy:'Nearby devices can hear this signal. Audio stays on this device.', error:'Audio unavailable', wake:'Keep this screen awake while receiving.', permission:'Allow microphone access to receive.', byteLimit:'Limit: 140 UTF-8 bytes', retry:'Try again in a quieter place.' },
  zh: { subtitle:'让文字通过声音传递', guide:'使用方法', language:'语言', spectrum:'音频频谱 / 实时输入', level:'音量', bytes:'UTF-8 字节', receive:'接收', transmit:'发送', idle:'麦克风已关闭', listening:'正在聆听声音…', start:'开始接收', stop:'停止接收', latest:'最新消息', empty:'等待消息', history:'最近消息', noHistory:'尚未收到消息', copy:'复制', compose:'输入消息', placeholder:'输入要通过声音发送的文字', send:'用声音发送', sending:'正在播放声音…', played:'声音已播放 · 未确认送达', duration:'约', seconds:'秒', protocol:'声音模式', normal:'可听 Normal · 兼容 ATOM 网页接收', presets:'试试这些消息', starter:'先试试看', conversation:'继续聊天', maker:'聊聊 M5Stack', privacy:'附近的设备都可能收到此信号。音频不会上传。', error:'音频不可用', wake:'接收时请保持屏幕常亮。', permission:'请允许使用麦克风以接收消息。', byteLimit:'上限：140 个 UTF-8 字节', retry:'请在较安静的环境重试。' },
  'zh-TW': { subtitle:'讓文字透過聲音傳遞', guide:'使用說明', language:'語言', spectrum:'音訊頻譜 / 即時輸入', level:'音量', bytes:'UTF-8 位元組', receive:'接收', transmit:'傳送', idle:'麥克風已關閉', listening:'正在聆聽聲音…', start:'開始接收', stop:'停止接收', latest:'最新訊息', empty:'等待訊息', history:'接收紀錄', noHistory:'尚未收到訊息', copy:'複製', compose:'輸入訊息', placeholder:'輸入要透過聲音傳送的文字', send:'用聲音傳送', sending:'正在播放聲音…', played:'聲音已播放・尚未確認對方收到', duration:'約', seconds:'秒', protocol:'聲音模式', normal:'Audible Normal・相容 ATOM 網頁接收', presets:'試試這些訊息', starter:'先試試看', conversation:'繼續聊聊', maker:'聊聊 M5Stack', privacy:'附近的裝置也可能收到訊號。音訊不會上傳。', error:'無法使用音訊', wake:'接收時請保持螢幕開啟。', permission:'接收訊息需要允許使用麥克風。', byteLimit:'上限：140 個 UTF-8 位元組', retry:'請移到較安靜的地方再試一次。' },
  ja: { subtitle:'文字を音で届ける', guide:'使い方', language:'言語', spectrum:'音声スペクトル / マイク入力', level:'音量', bytes:'UTF-8バイト', receive:'受信', transmit:'送信', idle:'マイク停止中', listening:'音を待っています…', start:'受信を開始', stop:'受信を停止', latest:'最新のメッセージ', empty:'メッセージを待機中', history:'受信履歴', noHistory:'まだ受信していません', copy:'コピー', compose:'送るメッセージ', placeholder:'音で送る文字を入力', send:'音で送信', sending:'音声を再生中…', played:'再生完了・相手への到達は未確認', duration:'約', seconds:'秒', protocol:'音声モード', normal:'Audible Normal・ATOMのWeb受信と互換', presets:'例文を試す', starter:'まず試す', conversation:'会話する', maker:'M5Stackの話', privacy:'近くの端末も受信できます。音声は外部送信しません。', error:'音声を利用できません', wake:'受信中は画面を点灯させてください。', permission:'受信にはマイクの許可が必要です。', byteLimit:'上限：UTF-8で140バイト', retry:'静かな場所で再試行してください。' }
};
let lang: Lang = selectLanguage(location.hash, navigator.language);
const link = new AudioLink();
const history: { text: string, time: Date }[] = [];
let statusText = '';
let transmitting = false;
let flashUntil = 0;
const app = document.querySelector<HTMLDivElement>('#app')!;
function t() { return messages[lang]; }
function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = ''): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.className = className; node.textContent = text; return node; }
function render() {
  const m = t(); document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  app.replaceChildren();
  const shell = el('main','shell'); app.append(shell);
  const header = el('header','header'); shell.append(header);
  const brand = el('div','brand'); brand.append(el('div','eyebrow','MAKER FAIRE SHENZHEN 2026'),el('h1','', 'Can You Hear the Data?'),el('p','subtitle',m.subtitle)); header.append(brand);
  const language = el('div','language'); language.setAttribute('aria-label',m.language);
  for (const [key,label] of languageOptions) { const b=el('button',key===lang?'selected':'',label); b.type='button'; b.onclick=()=>{lang=key;render();}; language.append(b); } header.append(language);
  const guide=el('a','guide-link',m.guide+' ↗'); guide.href=`./guide.html#lang=${lang}`; shell.append(guide);
  const install=el('a','guide-link','ATOM S3R installer ↗'); install.href='./install.html'; shell.append(install);
  const grid=el('div','grid'); shell.append(grid);
  const rx=el('section','panel receiver'); grid.append(rx);
  const rxHead=el('div','section-head'); rxHead.append(el('span','kicker','01 / '+m.receive),el('span','status '+(link.active?'on':''),statusText|| (link.active?m.listening:m.idle))); rx.append(rxHead);
  const viz=el('div','visualizer'); const canvas=el('canvas'); canvas.setAttribute('aria-label',m.spectrum); viz.append(canvas,el('span','viz-label',m.spectrum)); rx.append(viz);
  const meter=el('div','meter'); meter.append(el('span','', m.level),el('div','meter-track')); meter.lastElementChild!.append(el('div','meter-fill')); rx.append(meter);
  const listen=el('button','primary listen',link.active?m.stop:m.start); listen.type='button'; listen.onclick=async()=>{if(link.active){link.stop();statusText='';render();return;} listen.disabled=true;try{await link.start();statusText='';render();}catch(e){statusText=`${m.error}: ${String(e)}`;render();}}; rx.append(listen);
  rx.append(el('p','hint',m.permission+' '+m.wake));
  const received=el('section','panel received'); grid.append(received);
  received.append(el('div','kicker','02 / '+m.latest)); const latest=el('div','latest',history[0]?.text||m.empty); received.append(latest);
  if(history.length){const copy=el('button','small-button',m.copy);copy.onclick=async()=>{try{await navigator.clipboard.writeText(history[0].text);}catch(e){statusText=String(e);render();}};received.append(copy);}
  received.append(el('h2','subhead',m.history));const list=el('div','history');if(!history.length)list.append(el('p','muted',m.noHistory));
  for(const item of history.slice(0,8)){const row=el('div','history-row');row.append(el('span','',item.text),el('time','',item.time.toLocaleTimeString(lang)));list.append(row);}received.append(list);
  const tx=el('section','panel sender');grid.append(tx);tx.append(el('div','kicker','03 / '+m.transmit));
  const label=el('label','label',m.compose);label.htmlFor='message';tx.append(label);const input=el('textarea');input.id='message';input.rows=3;input.placeholder=m.placeholder;input.value=draft;tx.append(input);
  const count=el('div','byte-count');tx.append(count);const send=el('button','primary send',transmitting?m.sending:m.send);tx.append(send);
  const update=()=>{draft=input.value; const n=byteCount(draft);count.textContent=`${n} / ${MAX_BYTES} ${m.bytes}`;count.classList.toggle('over',n>MAX_BYTES);send.disabled=transmitting||!validMessage(draft);};input.oninput=update;update();
  send.onclick=async()=>{send.disabled=true;transmitting=true;statusText=m.sending;render();try{await link.transmit(draft,seconds=>{statusText=`${m.sending} ${m.duration} ${seconds.toFixed(1)} ${m.seconds}`;document.querySelector('.status')!.textContent=statusText;});statusText=m.played;}catch(e){statusText=`${m.error}: ${String(e)}`;}finally{transmitting=false;render();}};
  tx.append(el('p','hint',m.byteLimit));tx.append(el('div','subhead',m.presets));
  const addPresetGroup=(title:string,values:readonly string[])=>{
    const group=el('div','preset-group');group.append(el('h3','preset-category',title));
    const buttons=el('div','presets');
    for(const value of values){const button=el('button','preset',value);button.type='button';button.onclick=()=>{draft=value;render();};buttons.append(button);}
    group.append(buttons);tx.append(group);
  };
  addPresetGroup(m.starter,STARTER_PRESETS);
  addPresetGroup(m.conversation,CONVERSATION_PRESETS[lang]);
  addPresetGroup(m.maker,M5STACK_PRESETS[lang]);
  const settings=el('section','panel settings');grid.append(settings);settings.append(el('div','kicker','04 / '+m.protocol),el('div','protocol',m.normal),el('p','hint',m.privacy));
  if(statusText && (statusText.includes('Error')||statusText.includes(m.error)))shell.append(el('div','alert',statusText+' '+m.retry));
  draw(canvas);
}
let draft='';
link.onMessage=text=>{history.unshift({text,time:new Date()});if(history.length>20)history.pop();flashUntil=performance.now()+1300;statusText='';render();};
link.onError=message=>{statusText=message;};
function draw(canvas: HTMLCanvasElement) {
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const width=canvas.clientWidth, height=canvas.clientHeight; if(!width||!height)return;
  canvas.width=Math.round(width*devicePixelRatio);canvas.height=Math.round(height*devicePixelRatio);ctx.scale(devicePixelRatio,devicePixelRatio);
  ctx.clearRect(0,0,width,height);ctx.strokeStyle='rgba(49,213,198,.12)';for(let x=0;x<width;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
  const analyser=link.spectrum;let level=0;
  if(analyser){const bins=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(bins);const bars=48;const step=Math.max(1,Math.floor(bins.length/bars));for(let i=0;i<bars;i++){let peak=0;for(let j=0;j<step;j++)peak=Math.max(peak,bins[i*step+j]);level+=peak;const h=Math.max(3,peak/255*(height-28));ctx.fillStyle=performance.now()<flashUntil?'#d7ff75':'#37e6cd';ctx.fillRect(i*width/bars+2,height-h-8,width/bars-4,h);}level/=bars*255;}
  const meter=document.querySelector<HTMLElement>('.meter-fill');if(meter)meter.style.width=`${Math.min(100,level*190)}%`;
  requestAnimationFrame(()=>{if(canvas.isConnected)draw(canvas);});
}
render();
