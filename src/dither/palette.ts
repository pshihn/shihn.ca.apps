import { Color, rgbToLab } from 'cielab-dither/bin/colors';

const Palette16: Color[] = [
  [255, 255, 255],
  [255, 253, 85],
  [238, 111, 46],
  [203, 42, 29],
  [235, 55, 151],
  [44, 19, 147],
  [164, 255, 196],
  [64, 154, 248],
  [0, 0, 0],
  [68, 68, 68],
  [136, 136, 136],
  [187, 187, 187],
  [146, 104, 60],
  [96, 53, 14],
  [43, 100, 25],
  [76, 166, 48]
];

const Palette8: Color[] = [
  [0, 0, 0],
  [255, 255, 255],
  [255, 255, 0],
  [255, 0, 255],
  [0, 255, 255],
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255]
];

const Palette2: Color[] = [
  [0, 0, 0],
  [255, 255, 255]
];

export const LAB16: Color[] = Palette16.map<Color>((rgb) => rgbToLab(rgb));
export const LAB8: Color[] = Palette8.map<Color>((rgb) => rgbToLab(rgb));
export const LAB2: Color[] = Palette2.map<Color>((rgb) => rgbToLab(rgb));