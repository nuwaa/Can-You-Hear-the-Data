import { describe, expect, it } from 'vitest';
import { byteCount, Codec, MAX_BYTES, validMessage } from './codec';

describe('UTF-8 payload limit', () => {
  it('counts encoded bytes, including multibyte text', () => {
    expect(byteCount('你好')).toBe(6);
    expect(validMessage('a'.repeat(MAX_BYTES))).toBe(true);
    expect(validMessage('a'.repeat(MAX_BYTES+1))).toBe(false);
    expect(validMessage('你'.repeat(46))).toBe(true);
    expect(validMessage('你'.repeat(47))).toBe(false);
    expect(validMessage('')).toBe(false);
  });
});

describe('ggwave modem', () => {
  it('encodes and decodes Audible Normal UTF-8 audio', async () => {
    const sender = new Codec(); const receiver = new Codec();
    await sender.init(48000); await receiver.init(48000);
    try {
      const message = '你好深圳！\nHello Maker Faire!';
      const samples = sender.encode(message);
      expect(samples.length).toBeGreaterThan(48000);
      let text: string | null = null;
      for(let offset=0;offset<samples.length;offset+=1024) {
        const chunk = new Float32Array(1024); chunk.set(samples.subarray(offset,offset+1024));
        text = receiver.decode(chunk) ?? text;
      }
      for(let i=0;i<20 && !text;i++) text=receiver.decode(new Float32Array(1024)) ?? text;
      expect(text).toBe(message);
    } finally { sender.dispose();receiver.dispose(); }
  }, 30000);
});
