import { DitherWorker, PaletteType, WorkerMessage, WorkerMessageResponse } from './worker-api';

export type PromiseResolve = (value?: ImageData | PromiseLike<ImageData> | undefined) => void;

export class RemoteWorker implements DitherWorker {
  private worker: Worker;
  private map = new Map<string, PromiseResolve>();

  constructor(url: string) {
    this.worker = new Worker(url);
    this.worker.addEventListener('message', (event: MessageEvent) => {
      const response: WorkerMessageResponse = event.data;
      if (response.id && this.map.has(response.id)) {
        const imageData = new ImageData(new Uint8ClampedArray(response.buffer), response.width, response.height);
        this.map.get(response.id)!(imageData);
      }
    });
  }

  async process(imageData: ImageData, paletteType: PaletteType, dither: boolean): Promise<ImageData> {
    const msg: WorkerMessage = {
      id: `${Date.now()}-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`,
      dither,
      paletteType,
      width: imageData.width,
      height: imageData.height,
      buffer: imageData.data.buffer
    };
    return new Promise((resolve) => {
      this.map.set(msg.id, resolve);
      this.worker.postMessage(msg, [msg.buffer]);
    });
  }
}