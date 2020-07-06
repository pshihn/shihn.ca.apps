import { LitElement, TemplateResult, html, property, customElement } from 'lit-element';
import PointerTracker, { Pointer } from 'pointer-tracker';

export type Size = [number, number];
export type Position = [number, number];
type Bounds = [number, number, number, number];
type TrackState = 'default' | 'rotating' | 'resize-br' | 'moving';
interface TrackData {
  layerInitialPosition?: [number, number];
  layerInitialSize?: [number, number];
  initialRotation?: number;
  initial?: [number, number];
  pointerId?: number;
}

function rotate(x: number, y: number, cx: number, cy: number, angle: number): [number, number] {
  return [
    (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx,
    (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy,
  ];
}

function degToRad(angle: number): number {
  return (Math.PI / 180) * angle;
}

function radToDeg(angle: number): number {
  return (180 * angle) / Math.PI;
}

function rectangleHit(x: number, y: number, bounds: Bounds, tolerance: number, rotation: number, rotationCenter?: [number, number]): boolean {
  const x1 = bounds[0] - tolerance;
  const y1 = bounds[1] - tolerance;
  const x2 = bounds[0] + bounds[2] + (2 * tolerance);
  const y2 = bounds[1] + bounds[3] + (3 * tolerance);
  if (rotation) {
    if (!rotationCenter) {
      rotationCenter = [(x1 + x2) / 2, (y1 + y2) / 2];
    }
    [x, y] = rotate(x, y, rotationCenter[0], rotationCenter[1], degToRad(-rotation));
  }
  return (
    x > x1 &&
    x < x2 &&
    y > y1 &&
    y < y2
  );
}

function boundsFromQP(newPP: Position, newQQ: Position, angle: number): Bounds {
  const newC = [
    (newPP[0] + newQQ[0]) / 2,
    (newPP[1] + newQQ[1]) / 2
  ];
  const newP = rotate(newPP[0], newPP[1], newC[0], newC[1], -angle);
  const newQ = rotate(newQQ[0], newQQ[1], newC[0], newC[1], -angle);
  let [x, y, w, h] = [newP[0], newP[1], newQ[0] - newP[0], newQ[1] - newP[1]];
  if (w < 0) {
    w = Math.abs(w);
    x = x - w;
  }
  if (h < 0) {
    h = Math.abs(h);
    y = y - h;
  }
  return [Math.round(x), Math.round(y), Math.round(w), Math.round(h)];
}

function resizeRectangleFixedTL(pos: Position, size: Size, dq: Position, degrees: number): Bounds {
  const angle = degToRad(degrees);
  const c = [
    pos[0] + size[0] / 2,
    pos[1] + size[1] / 2
  ];
  const pp = rotate(pos[0], pos[1], c[0], c[1], angle); // top left after rotation
  const qq = rotate(pos[0] + size[0], pos[1] + size[1], c[0], c[1], angle); // bottom right after rotation
  const newQQ: Position = [qq[0] + dq[0], qq[1] + dq[1]]; // new bottom right after rotation

  // pp is fixed, find new center
  const newPP = pp;
  return boundsFromQP(newPP, newQQ, angle);
}

@customElement('resize-canvas')
export class ResizeCanvas extends LitElement {
  @property({ type: Boolean }) broken = false;

  private trackState: TrackState = 'default';
  private element: Bounds = [100, 100, 150, 150];
  private elementRotation = 0;
  private tracker?: PointerTracker;
  private trackData: TrackData = {};
  private renderPending = false;
  private overlayHitAreas = new Map<TrackState, Bounds>();
  private cursor = 'default';

  render(): TemplateResult {
    return html`
    <style>
      :host {
        display: block;
        max-width: 600px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
      }
      canvas {
        display: block;
        width: 100%;
        box-sizing: border-box;
        cursor: var(--canvas-cursor);
      }
    </style>
    <canvas width="600" height="400"></canvas>
    `;
  }

  firstUpdated() {
    this.attachTracker();
    this.requestRender();
  }

  private requestRender() {
    if (!this.renderPending) {
      this.renderPending = true;
      requestAnimationFrame(() => {
        if (this.renderPending) {
          this.renderPending = false;
          this._renderCanvas();
        }
      });
    }
  }

  private _renderCanvas() {
    const canvas = this.shadowRoot!.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 600, 400);

      const [x, y, w, h] = this.element;

      ctx.save();
      if (this.elementRotation) {
        const [cx, cy] = [
          x + w / 2,
          y + h / 2
        ];
        ctx.translate(cx, cy);
        ctx.rotate(degToRad(this.elementRotation));
        ctx.translate(-cx, -cy);
      }

      // draw rectangle
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      this.overlayHitAreas.clear();

      // draw rotate
      ctx.beginPath();
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.arc(x + w / 2, y - 30, 5, 0, Math.PI * 2);
      ctx.moveTo(x + w / 2, y - 25);
      ctx.lineTo(x + w / 2, y);
      ctx.stroke();
      ctx.closePath();
      this.overlayHitAreas.set('rotating', [x + (w / 2) - 5, y - 35, 10, 10]);

      // draw br
      this.overlayHitAreas.set('resize-br', [x + w - 10, y + h - 10, 20, 20]);
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(x + w, y + h, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      ctx.restore();

    }
  }

  private attachTracker() {
    if (this.tracker) {
      this.tracker.stop();
    }
    const canvas = this.shadowRoot!.querySelector('canvas')!;
    this.tracker = new PointerTracker(canvas, {
      start: (pointer, event) => {
        return this.handleTrackStart(pointer, event);
      },
      move: (_prev: Pointer[], changed: Pointer[]) => {
        this.handleTrackMove(changed);
      },
      end: (pointer: Pointer) => {
        this.handleTrackEnd(pointer);
      }
    });
    canvas.addEventListener('mousemove', this.overlayMouseMove.bind(this), { passive: true });
  }

  private canvasCoordsFromPointer(pointer: Pointer): [number, number] {
    const canvas = this.shadowRoot!.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, pointer.clientX - (rect.x || rect.left));
    const y = Math.max(0, pointer.clientY - (rect.y || rect.top));
    return this.normalizeCoords(canvas, x, y, rect);
  }

  private normalizeCoords(canvas: HTMLCanvasElement, x: number, y: number, rect: DOMRect): [number, number] {
    return [
      Math.round(x * (canvas.width / rect.width)),
      Math.round(y * (canvas.height / rect.height))
    ];
  }

  private getHitSeleectionLayer(x: number, y: number): TrackState | null {
    for (const key of this.overlayHitAreas.keys()) {
      const bounds = this.overlayHitAreas.get(key)!;
      const isHit = rectangleHit(x, y, bounds, 2, this.elementRotation, [
        this.element[0] + this.element[2] / 2,
        this.element[1] + this.element[3] / 2
      ]);
      if (isHit) {
        return key;
      }
    }
    return null;
  }

  private handleTrackStart(pointer: Pointer, event: Event): boolean {
    if (this.trackState === 'default') {
      const [x, y] = this.canvasCoordsFromPointer(pointer);
      const selectionHit = this.getHitSeleectionLayer(x, y);
      if (selectionHit) {
        event.preventDefault();
        this.trackState = selectionHit;
        this.trackData.pointerId = pointer.id;
        this.trackData.initial = [x, y];
        this.trackData.initialRotation = this.elementRotation;
        this.trackData.layerInitialSize = [this.element[2], this.element[3]];
        this.trackData.layerInitialPosition = [this.element[0], this.element[1]];
        return true;
      } else {
        const rectHit = rectangleHit(x, y, this.element, 3, this.elementRotation);
        if (rectHit) {
          event.preventDefault();
          this.trackState = 'moving';
          this.trackData.pointerId = pointer.id;
          this.trackData.initial = [x, y];
          this.trackData.initialRotation = this.elementRotation;
          this.trackData.layerInitialSize = [this.element[2], this.element[3]];
          this.trackData.layerInitialPosition = [this.element[0], this.element[1]];
          return true;
        }
      }
    }
    return false;
  }

  private handleTrackEnd(pointer: Pointer) {
    if (pointer.id === this.trackData.pointerId) {
      let updated = false;
      const [w, h] = [this.element[2], this.element[3]];
      if (w < 0) {
        this.element[0] += w;
        this.element[2] = Math.abs(w);
        updated = true;
      }
      if (h < 0) {
        this.element[1] += h;
        this.element[3] = Math.abs(h);
        updated = true;
      }
      if (updated) {
        this.requestRender();
      }
    }
    // clear Tracker State
    this.trackState = 'default';
    this.trackData = {};
  }

  private handleTrackMove(pointers: Pointer[]) {

    for (const pointer of pointers) {
      if (pointer.id === this.trackData.pointerId) {
        const [x, y] = this.canvasCoordsFromPointer(pointer);
        const [x0, y0] = this.trackData.initial!;
        const [dx, dy] = [x - x0, y - y0];

        if (dx || dy) {
          const [lx, ly] = this.trackData.layerInitialPosition!;
          const [lw, lh] = this.trackData.layerInitialSize!;
          let elementUpdated = true;

          switch (this.trackState) {
            case 'moving':
              this.element[0] = lx + dx;
              this.element[1] = ly + dy;
              break;
            case 'resize-br': {
              if (this.broken) {
                this.element[2] = lw + dx;
                this.element[3] = lh + dy;
              } else {
                const bounds = resizeRectangleFixedTL([lx, ly], [lw, lh], [dx, dy], this.elementRotation);
                this.element = bounds;
              }
              break;
            }
            case 'rotating': {
              const center = [lx + lw / 2, ly + lh / 2];
              const a1 = Math.atan2(y0 - center[1], x0 - center[0]);
              const a2 = Math.atan2(y - center[1], x - center[0]);
              let angle = Math.round(radToDeg(a2 - a1));
              if (angle < 0) {
                angle += 360;
              }
              angle = ((this.trackData.initialRotation || 0) + angle) % 360;
              this.elementRotation = angle;
              break;
            }
            default:
              elementUpdated = false;
              break;
          }

          // update element
          if (elementUpdated) {
            this.requestRender();
          }
        }
        break;
      }
    }
  }

  private overlayMouseMove(event: MouseEvent) {
    if (this.trackState === 'default') {
      const canvas = this.shadowRoot!.querySelector('canvas')!;
      const rect = canvas.getBoundingClientRect();
      let x = Math.max(0, (event.x || event.clientX) - (rect.x || rect.left));
      let y = Math.max(0, (event.y || event.clientY) - (rect.y || rect.top));
      [x, y] = this.normalizeCoords(canvas, x, y, rect);

      const selectionHit = this.getHitSeleectionLayer(x, y);
      if (selectionHit) {
        let cursor = 'default';
        switch (selectionHit) {
          case 'resize-br':
            cursor = 'nwse-resize';
            break;
          case 'rotating':
            cursor = 'grab';
            break;
          default:
            'default';
            break;
        }
        this.setCursor(cursor);
      } else if (rectangleHit(x, y, this.element, 3, this.elementRotation)) {
        this.setCursor('move');
      } else {
        this.setCursor('default');
      }
    }
  }

  private setCursor(cursor: string) {
    if (this.cursor !== cursor) {
      this.cursor = cursor;
      if (cursor === 'default') {
        this.style.removeProperty('--canvas-cursor');
      } else {
        this.style.setProperty('--canvas-cursor', cursor);
      }
    }
  }
}