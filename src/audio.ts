import { Codec } from './codec';

export class AudioLink {
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private sink: GainNode | null = null;
  private codec = new Codec();
  private busy = false;
  onMessage: (message: string) => void = () => {};
  onError: (message: string) => void = () => {};
  get active() { return !!this.stream; }
  get spectrum() { return this.analyser; }

  private async ready() {
    if (!this.context || this.context.state === 'closed') {
      this.context = new AudioContext();
      try { await this.codec.init(this.context.sampleRate); }
      catch (error) { await this.context.close(); this.context = null; throw error; }
    }
    await this.context.resume();
    if (this.context.state !== 'running') throw new Error('Audio is suspended. Tap again to start.');
    return this.context;
  }
  async start() {
    if (this.stream) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone requires HTTPS or localhost.');
    const context = await this.ready();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      this.stream = stream;
      this.source = context.createMediaStreamSource(stream);
      this.analyser = context.createAnalyser(); this.analyser.fftSize = 2048;
      this.processor = context.createScriptProcessor(1024, 1, 1);
      this.sink = context.createGain(); this.sink.gain.value = 0;
      this.processor.onaudioprocess = event => {
        event.outputBuffer.getChannelData(0).fill(0);
        if (this.busy) return;
        try {
          const message = this.codec.decode(event.inputBuffer.getChannelData(0));
          if (message) this.onMessage(message);
        } catch (error) { this.onError(String(error)); }
      };
      this.source.connect(this.analyser); this.analyser.connect(this.processor);
      this.processor.connect(this.sink); this.sink.connect(context.destination);
      stream.getAudioTracks().forEach(track => track.onended = () => this.stop());
    } catch (error) { this.stop(); throw error; }
  }
  stop() {
    this.processor?.disconnect(); this.processor && (this.processor.onaudioprocess = null);
    this.analyser?.disconnect(); this.source?.disconnect(); this.sink?.disconnect();
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null; this.source = null; this.processor = null; this.analyser = null; this.sink = null;
  }
  async transmit(text: string, onStart: (seconds: number) => void) {
    if (this.busy) throw new Error('Transmission already in progress');
    const context = await this.ready();
    const samples = this.codec.encode(text);
    const buffer = context.createBuffer(1, samples.length, context.sampleRate);
    buffer.copyToChannel(new Float32Array(samples), 0);
    const source = context.createBufferSource(); source.buffer = buffer; source.connect(context.destination);
    this.busy = true;
    try {
      await new Promise<void>((resolve, reject) => {
        source.onended = () => resolve();
        try { source.start(); onStart(buffer.duration); } catch (error) { reject(error); }
      });
    } finally { source.disconnect(); this.busy = false; }
  }
}
