import { DitherWorker, PaletteType, WorkerMessage, WorkerMessageResponse } from './worker-api';
import { LAB16, LAB2, LAB8 } from './palette';
import { adoptPaletteFloydSteinbergDither, adoptPaletteNoDither } from 'cielab-dither';

class DitherWorkerImpl implements DitherWorker {
  async process(imageData: ImageData, paletteType: PaletteType, dither: boolean): Promise<ImageData> {
    imageData.data.buffer;
    if (paletteType !== 'All colors') {
      let palette = LAB16;
      switch (paletteType) {
        case '8 colors':
          palette = LAB8;
          break;
        case 'Black & White':
          palette = LAB2;
          break;
        case '16 colors':
          break;
      }
      if (dither) {
        adoptPaletteFloydSteinbergDither(imageData, palette, 'rgb');
      } else {
        adoptPaletteNoDither(imageData, palette);
      }
    }
    return imageData;
  }
}

const worker = new DitherWorkerImpl();

self.onmessage = async (event: MessageEvent) => {
  const msg: WorkerMessage = event.data;
  if (msg.id && msg.buffer && msg.paletteType && (msg.dither !== undefined)) {
    const imageData = new ImageData(new Uint8ClampedArray(msg.buffer), msg.width, msg.height);
    const outData = await worker.process(imageData, msg.paletteType, msg.dither);
    const outBuffer = outData.data.buffer;
    const response: WorkerMessageResponse = {
      id: msg.id,
      width: msg.width,
      height: msg.height,
      buffer: outBuffer
    };
    (self as any as Worker).postMessage(response, [outBuffer]);
  }
};