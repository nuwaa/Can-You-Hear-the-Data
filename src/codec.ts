import factory from 'ggwave';

export const MAX_BYTES = 140;
export const PROTOCOL_AUDIBLE_NORMAL = 0;
export const PRESETS = ['你好深圳！', '你好，台灣！', 'Hello Maker Faire!', 'こんにちは！', '数据传输成功！'];
export const byteCount = (text: string) => new TextEncoder().encode(text).length;
export function validMessage(text: string): boolean { return byteCount(text) > 0 && byteCount(text) <= MAX_BYTES; }

type Wave = Awaited<ReturnType<typeof factory>>;
export class Codec {
  private wave: Wave | null = null;
  private instance: number | null = null;
  async init(sampleRate: number) {
    this.dispose();
    const wave = await factory();
    const params = wave.getDefaultParameters();
    params.sampleFormatInp = wave.SampleFormat.GGWAVE_SAMPLE_FORMAT_F32;
    params.sampleFormatOut = wave.SampleFormat.GGWAVE_SAMPLE_FORMAT_F32;
    params.sampleRateInp = sampleRate;
    params.sampleRateOut = sampleRate;
    params.sampleRate = sampleRate;
    const instance = wave.init(params);
    if (instance < 0) throw new Error('ggwave initialization failed');
    for (let id = 0; id < 6; id++) wave.rxToggleProtocol(id, id < 3 ? 1 : 0);
    this.wave = wave;
    this.instance = instance;
  }
  encode(text: string, volume = 10): Float32Array {
    if (!validMessage(text)) throw new Error(`Message must be 1–${MAX_BYTES} UTF-8 bytes`);
    if (!this.wave || this.instance === null) throw new Error('Audio engine is not ready');
    const bytes = this.wave.encode(this.instance, text, PROTOCOL_AUDIBLE_NORMAL, volume);
    if (!bytes.length || bytes.byteLength % 4) throw new Error('ggwave could not encode message');
    const copy = new Uint8Array(bytes.byteLength); copy.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
    return new Float32Array(copy.buffer);
  }
  decode(samples: Float32Array): string | null {
    if (!this.wave || this.instance === null) return null;
    const bytes = new Int8Array(samples.buffer, samples.byteOffset, samples.byteLength);
    const result = this.wave.decode(this.instance, bytes);
    if (!result?.length) return null;
    return new TextDecoder('utf-8', { fatal: true }).decode(result);
  }
  dispose() { if (this.wave && this.instance !== null) this.wave.free(this.instance); this.instance = null; }
}
