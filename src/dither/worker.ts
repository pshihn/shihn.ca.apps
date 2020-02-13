import { DitherWorker, PaletteType } from './worker-api';
import { LAB16, LAB2, LAB8 } from './palette';
import { adoptPaletteFloydSteinbergDither, adoptPaletteNoDither } from 'cielab-dither';

export class Worker implements DitherWorker {
  async process(imageData: ImageData, paletteType: PaletteType, dither: boolean): Promise<ImageData> {
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
        adoptPaletteFloydSteinbergDither(imageData, palette);
      } else {
        adoptPaletteNoDither(imageData, palette);
      }
    }
    return imageData;
  }
}