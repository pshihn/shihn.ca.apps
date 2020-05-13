import { StippleCallback } from 'stipple/lib/stipple';
import { Voronoi } from 'stipple/lib/voronoi';

export interface StippleRequest {
  name: string;
  buffer: ArrayBuffer;
  width: number;
  height: number;
  pointCount: number;
  iterations?: number[];
}

function grayValue(i: number, rgba: Uint8ClampedArray): number {
  const offset = i * 4;
  return 1 - (0.299 * rgba[offset] + 0.587 * rgba[offset + 1] + 0.114 * rgba[offset + 2]) / 254;
}

export class Stippler {
  private callback: StippleCallback;
  private pendingRequest?: StippleRequest;
  private currentRequest?: StippleRequest;

  constructor(callback: StippleCallback) {
    this.callback = callback;
  }

  process(request: StippleRequest) {
    if (this.currentRequest) {
      this.pendingRequest = request;
    } else {
      this.pendingRequest = undefined;
      this.currentRequest = request;
      this.stipple();
    }
  }

  private pushPending(): boolean {
    if (this.pendingRequest) {
      this.currentRequest = this.pendingRequest;
      this.pendingRequest = undefined;
      setTimeout(() => this.stipple());
      return true;
    }
    return false;
  }

  private stipple() {
    if (!this.currentRequest) {
      return;
    }
    const { pointCount, width, height, buffer } = this.currentRequest;
    const iterations = this.currentRequest.iterations || [40];
    const n = pointCount || (width * height / 50);
    const highestIteration = Math.max(...iterations);
    const points = new Float32Array(n * 2);
    const rgba = new Uint8ClampedArray(buffer);
    const c = new Float64Array(n * 2);
    const s = new Float64Array(n);

    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < 60; ++j) {
        const x = points[i * 2] = Math.floor(Math.random() * width);
        const y = points[i * 2 + 1] = Math.floor(Math.random() * height);
        if (Math.random() < grayValue(y * width + x, rgba)) break;
      }
    }

    if (this.pushPending()) {
      return;
    }

    const voronoi = new Voronoi(points, [0, 0, width, height]);
    for (let k = 0; k <= highestIteration; ++k) {
      if (this.pushPending()) {
        return;
      }
      c.fill(0);
      s.fill(0);
      for (let y = 0, i = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          const w = grayValue(y * width + x, rgba);
          i = voronoi.find(x + 0.5, y + 0.5, i);
          s[i] += w;
          c[i * 2] += w * (x + 0.5);
          c[i * 2 + 1] += w * (y + 0.5);
        }
      }
      // Relax the diagram by moving points to the weighted centroid.
      // Wiggle the points a little bit so they don’t get stuck.
      const w = Math.pow(k + 1, -0.8) * 10;
      for (let i = 0; i < n; ++i) {
        const x0 = points[i * 2], y0 = points[i * 2 + 1];
        const x1 = s[i] ? c[i * 2] / s[i] : x0, y1 = s[i] ? c[i * 2 + 1] / s[i] : y0;
        points[i * 2] = x0 + (x1 - x0) * 1.8 + (Math.random() - 0.5) * w;
        points[i * 2 + 1] = y0 + (y1 - y0) * 1.8 + (Math.random() - 0.5) * w;
      }
      voronoi.update();
      if (iterations.indexOf(k) >= 0) {
        this.callback({ points, width, height, iteration: k });
      }
    }
    this.currentRequest = undefined;
    this.pushPending();
  }
}