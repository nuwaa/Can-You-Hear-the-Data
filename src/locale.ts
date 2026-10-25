export type Lang = 'zh' | 'zh-TW' | 'en' | 'ja';

export function selectLanguage(hash: string, browserLanguage: string): Lang {
  const requested = new URLSearchParams(hash.replace(/^#/, '')).get('lang');
  if (requested === 'zh' || requested === 'zh-TW' || requested === 'en' || requested === 'ja') return requested;
  const language = browserLanguage.toLowerCase();
  if (/^zh-(tw|hant|hk|mo)(-|$)/.test(language)) return 'zh-TW';
  if (language.startsWith('zh')) return 'zh';
  if (language.startsWith('ja')) return 'ja';
  return 'en';
}

export const languageOptions = [['zh', '简体'], ['zh-TW', '繁體'], ['en', 'EN'], ['ja', '日本語']] as const;
