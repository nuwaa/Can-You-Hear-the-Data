import type { Lang } from './locale';

const attribution: Record<Lang, string> = {
  en: 'Made by TOMINAGA',
  zh: '富永制作',
  'zh-TW': '富永製作',
  ja: '富永がつくりました',
};

export function authorFooter(lang: Lang): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.append(document.createTextNode(`${attribution[lang]} · `));
  const x = document.createElement('a');
  x.href = 'https://x.com/4989er';
  x.textContent = 'X @4989er';
  footer.append(x);
  return footer;
}
