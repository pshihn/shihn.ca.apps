export type PaletteType = 'All colors' | '16 colors' | '8 colors' | 'Black & White';

export const paletteTypeList: PaletteType[] = [
  'All colors', '16 colors', '8 colors', 'Black & White'
];

export interface DitherWorker {
  process(imageData: ImageData, paletteType: PaletteType, dither: boolean): Promise<ImageData>;
}

export interface WorkerMessage {
  id: string;
  paletteType: PaletteType;
  dither: boolean;
  width: number;
  height: number;
  buffer: ArrayBuffer;
}

export interface WorkerMessageResponse {
  id: string;
  width: number;
  height: number;
  buffer: ArrayBuffer;
}