import { expect, it } from 'vitest';
import { byteCount, validMessage } from './codec';
import { CONVERSATION_PRESETS, M5STACK_PRESETS, STARTER_PRESETS } from './presets';
import type { Lang } from './locale';

it('keeps every localized preset within the acoustic payload limit', () => {
  for (const lang of ['zh', 'zh-TW', 'en', 'ja'] satisfies Lang[]) {
    const choices = [...STARTER_PRESETS, ...CONVERSATION_PRESETS[lang], ...M5STACK_PRESETS[lang]];
    expect(choices).toHaveLength(10);
    expect(new Set(choices).size).toBe(10);
    for (const choice of choices) {
      expect(validMessage(choice), `${lang}: ${choice} (${byteCount(choice)} bytes)`).toBe(true);
    }
  }
});
