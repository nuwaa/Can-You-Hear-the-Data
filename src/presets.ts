import type { Lang } from './locale';

export const STARTER_PRESETS = ['你好深圳！', '哈囉，台灣！', 'Hello Maker Faire!', 'こんにちは！', '数据传输成功！'] as const;

export const CONVERSATION_PRESETS: Record<Lang, readonly string[]> = {
  zh: ['听得到吗？', '收到了！'],
  'zh-TW': ['聽得到嗎？', '收到了！'],
  en: ['Can you hear the data?', 'Loud and clear!'],
  ja: ['データが聞こえる？', '聞こえたよ！'],
};

export const M5STACK_PRESETS: Record<Lang, readonly string[]> = {
  zh: ['你有 Stack-chan，对吧？', '你用 M5Stack 做过什么？', '我还没有！', '快去入手一个！'],
  'zh-TW': ['你有 Stack-chan，對吧？', '你用 M5Stack 做過什麼？', '我還沒有！', '快去入手一個！'],
  en: ['You have a Stack-chan, right?', 'What have you built with M5Stack?', 'Not yet!', 'Go get one!'],
  ja: ['ｽﾀｯｸﾁｬﾝは持ってますよね？', 'M5Stackで何を作った？', 'まだ持ってない！', '急いでゲットせよ！'],
};
