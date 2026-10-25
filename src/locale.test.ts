import { expect, it } from 'vitest';
import { selectLanguage } from './locale';

it('selects Taiwan Mandarin for Traditional Chinese browser locales and explicit links', () => {
  expect(selectLanguage('', 'zh-TW')).toBe('zh-TW');
  expect(selectLanguage('', 'zh-Hant-TW')).toBe('zh-TW');
  expect(selectLanguage('', 'zh-HK')).toBe('zh-TW');
  expect(selectLanguage('', 'zh-CN')).toBe('zh');
  expect(selectLanguage('#lang=zh-TW', 'en-US')).toBe('zh-TW');
  expect(selectLanguage('#lang=en', 'zh-TW')).toBe('en');
});
