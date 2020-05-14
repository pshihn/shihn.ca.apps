import { StippleCanvas } from './stipple-canvas';

export function canvas(canvas: HTMLCanvasElement, worker: string, n = 5000, animationDuration = 1000) {
  return new StippleCanvas(canvas, worker, n, animationDuration);
}