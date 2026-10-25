declare module 'ggwave' {
  const factory: () => Promise<{
    SampleFormat: { GGWAVE_SAMPLE_FORMAT_F32: number };
    getDefaultParameters(): Record<string, number>;
    init(params: Record<string, number>): number;
    free(instance: number): void;
    encode(instance: number, text: string, protocol: number, volume: number): Int8Array;
    decode(instance: number, samples: Int8Array): Int8Array | null;
    rxToggleProtocol(protocol: number, enabled: number): void;
  }>;
  export default factory;
}
