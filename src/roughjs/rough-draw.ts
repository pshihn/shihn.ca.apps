import PointerTracker from 'pointer-tracker';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { randomSeed } from 'roughjs/bin/math';

export class RoughDraw extends HTMLElement {
  mode = 'line';
  private _rc?: RoughCanvas;
  private _canvas?: HTMLCanvasElement;
  private root: ShadowRoot;
  private data: [number, number, number, number][] = [];
  private datum?: [number, number, number, number];
  private tracker?: PointerTracker;
  private seed = 0;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = `
    <style>
      :host {
        display: block;
        max-width: 600px;
        margin: 0 auto;
      }
      canvas {
        display: block;
        margin: 0 auto;
        touch-action: none;
        border: 1px solid;
      }
      .horizontal {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 8px 4px;
        font-size: 13px;
        font-family: sans-serif;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .flex {
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        flex: 1;
        -webkit-flex-basis: 0.000000001px;
        flex-basis: 0.000000001px;
      }
      input {
        margin: 0 6px;
      }
      button {
        background: #4e7ab1;
        color: white;
        font-size: inherit;
        font-family: inherit;
        letter-spacing: 1px;
        text-transform: inherit;
        padding: 8px 10px;
        border: none;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
      }
    </style>
    <div class="horizontal">
      <label>Roughness</label>
      <input type="range" value="1" min="0" max="3" step="0.1">
      <label id="rvalue">1</label>
      <div class="flex"></div>
      <button>Clear</button>
    </div>
    <canvas></canvas>
    `;
  }

  get canvas(): HTMLCanvasElement {
    if (!this._canvas) {
      this._canvas = this.root.querySelector('canvas')!;
    }
    return this._canvas;
  }

  get rc(): RoughCanvas {
    if (!this._rc) {
      this._rc = new RoughCanvas(this.canvas);
    }
    return this._rc;
  }

  disconnectedCallback() {
    if (this.tracker) {
      this.tracker.stop();
      this.tracker = undefined;
    }
  }

  connectedCallback() {
    this.mode = this.getAttribute('mode') || 'line';

    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.clearShapes();
    if (this.mode === 'line') {
      this.data.push([
        0.2 * this.canvas.width,
        0.6 * this.canvas.height,
        0.8 * this.canvas.width,
        0.5 * this.canvas.height
      ]);
    } else {
      this.data.push([
        0.5 * this.canvas.width,
        0.5 * this.canvas.height,
        0.4 * this.canvas.width,
        0.3 * this.canvas.height
      ]);
    }

    const input = this.root.querySelector('input')!;
    input.addEventListener('input', () => {
      this.root.querySelector('#rvalue')!.textContent = input.value;
      this.asyncRedraw();
    });

    this.root.querySelector('button')!.addEventListener('click', () => this.clearShapes());

    let viewAnchor = [0, 0];
    if (!this.tracker) {
      this.tracker = new PointerTracker(this.canvas, {
        start: (pointer, event) => {
          if (this.datum) {
            return false;
          }
          event.preventDefault();
          const rect = this.canvas.getBoundingClientRect();
          viewAnchor = [rect.left || rect.x, rect.top || rect.y];
          this.datum = [
            pointer.clientX - viewAnchor[0],
            pointer.clientY - viewAnchor[1],
            pointer.clientX - viewAnchor[0],
            pointer.clientY - viewAnchor[1]
          ];
          return true;
        },
        move: (_, changedPointers) => {
          const pointer = changedPointers[0];
          if (pointer && this.datum) {
            this.datum[2] = pointer.clientX - viewAnchor[0];
            this.datum[3] = pointer.clientY - viewAnchor[1];
            this.asyncRedraw();
          }
        },
        end: () => {
          if (this.datum) {
            if (((this.datum[2] - this.datum[0]) !== 0) || ((this.datum[3] - this.datum[1]) !== 0)) {
              this.data.push(this.datum);
            }
            this.datum = undefined;
            this.asyncRedraw();
          }
        }
      });
    }
  }

  private pendingDraw = false;
  private asyncRedraw() {
    if (!this.pendingDraw) {
      window.requestAnimationFrame(() => {
        this.pendingDraw = false;
        this.redraw();
      });
      this.pendingDraw = true;
    }
  }

  private resize() {
    const width = Math.max(300, Math.min(this.getBoundingClientRect().width, 600));
    const height = Math.max(200, width / 1.5);
    this.canvas.width = width;
    this.canvas.height = height;
    this.asyncRedraw();
  }

  private redraw() {
    const ctx = this.canvas.getContext('2d')!;
    const rc = this.rc;
    const roughness = +this.root.querySelector('input')!.value;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    switch (this.mode) {
      case 'line':
        this.data.forEach((d, i) => rc.line(d[0], d[1], d[2], d[3], {
          seed: this.seed + i,
          roughness
        }));
        if (this.datum) {
          rc.line(this.datum[0], this.datum[1], this.datum[2], this.datum[3], {
            seed: this.seed + this.data.length,
            roughness
          });
        }
        break;
      case 'ellipse':
        this.data.forEach((d, i) => {
          const cx = (d[0] + d[2]) / 2;
          const cy = (d[1] + d[3]) / 2;
          const width = Math.abs(d[0] - d[2]);
          const height = Math.abs(d[1] - d[3]);
          rc.ellipse(cx, cy, width, height, {
            seed: this.seed + i,
            roughness
          });
        });
        if (this.datum) {
          const d = this.datum;
          const cx = (d[0] + d[2]) / 2;
          const cy = (d[1] + d[3]) / 2;
          const width = Math.abs(d[0] - d[2]);
          const height = Math.abs(d[1] - d[3]);
          rc.ellipse(cx, cy, width, height, {
            seed: this.seed + this.data.length,
            roughness
          });
        }
        break;
    }
  }

  private clearShapes() {
    this.data = [];
    this.datum = undefined;
    this.seed = randomSeed();
    this.asyncRedraw();
  }
}
customElements.define('rough-draw', RoughDraw);