export type PaletteType = 'All colors' | '16 colors' | '8 colors' | 'Black & White';

export const paletteTypeList: PaletteType[] = [
  'All colors', '16 colors', '8 colors', 'Black & White'
];

export interface DitherWorker {
  process(imageData: ImageData, paletteType: PaletteType, dither: boolean): Promise<ImageData>;
}