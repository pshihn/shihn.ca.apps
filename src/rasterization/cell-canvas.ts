import { LitElement, customElement, html, TemplateResult, property, PropertyValues, svg, query } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import PointerTracker from 'pointer-tracker';
import { Point } from './geometry';

interface Cell {
  x: number;
  y: number;
  filled: boolean;
}

interface Handle {
  id: string;
  x: number;
  y: number;
  cx: number;
  cy: number;
  circle: SVGCircleElement;
}

const SNS = 'http://www.w3.org/2000/svg';

@customElement('cell-canvas')
export class CellCanvas extends LitElement {
  @property({ type: Number }) width = 520;
  @property({ type: Number }) height = 200;
  @property() filler = '';
  @property() handles: Handle[] = [];
  @property() private cells: Cell[] = [];
  @query('#handles') private handlesGroup?: SVGGElement;
  @query('svg') private svg?: SVGSVGElement;
  @query('#drawLayer') private drawLayer?: SVGSVGElement;

  cellSize = 20;
  private cols = 0;
  private rows = 0;

  render(): TemplateResult {
    return html`
    <style>
      :host {
        display: block;
        margin: 0 auto;
      }
      svg {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
      #grid rect {
        fill: hsl(200,20%,90%);
      }
      #grid rect.filled {
        fill: rgba(216, 27, 96, 0.8);
      }
      #handles .handle {
        fill: rgba(255,255,255,0.8);
        stroke: black;
        stroke-width: 0.03px;
        pointer-events: all;
        cursor: move;
        touch-action: none;
      }
      #drawLayer > * {
        stroke: rgba(255,255,255,0.8);
        stroke-width: 1px;
        fill: none;
      }
      text {
        display: none;
      }
      text.filled {
        display: initial;
      }
      #emojiLayer {
        display: none;
      }

      svg.emojify {
        background: hsl(200,20%,90%);
      }
      .emojify #grid {
        display: none;
      }
      .emojify #emojiLayer {
        display: initial;
      }
      .emojify #handles .handle {
        fill: rgba(0,0,255,0.8);
      }
      .emojify #drawLayer > * {
        stroke: rgba(0,0,0,0);
      }
    </style>
    <svg viewBox="0,0,${this.width},${this.height}" class="${this.filler ? 'emojify' : ''}">
      <g id="grid" transform="translate(0.5, 0.5) scale(${this.cellSize}) translate(0.5, 0.5)">
      ${repeat(this.cells, (d) => `${d.x},${d.y}`, (d) => svg`
        <rect class="${d.filled ? 'filled' : ''}" transform="translate(${d.x},${d.y}) translate(-0.5, -0.5)" width="0.95" height="0.95"></rect>
      `)}
      </g>
      <g id="emojiLayer">
      ${repeat(this.cells, (d) => `${d.x},${d.y}`, (d) => svg`
        <text class="${d.filled ? 'filled' : ''}" style="font-size: ${this.cellSize}px;" x="0" y="0" transform="translate(${d.x * 20}, ${d.y * 20 + 18})">${this.filler}</text>
      `)}
      </g>
      <g id="drawLayer"></g>
      <g id="handles"></g>
    </svg>
    `;
  }

  updated(changed: PropertyValues) {
    if (changed.has('width') || changed.has('height')) {
      this.refreshGrid();
    }
  }

  private refreshGrid() {
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.cells = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.cells.push({
          x: j,
          y: i,
          filled: false
        });
      }
    }
  }

  pixelCoords(p: Point): Point {
    return [Math.floor(p[0] / this.cellSize), Math.floor(p[1] / this.cellSize)]
  }

  pixelCoordsInv(p: Point): Point {
    return [(p[0] * this.cellSize) + (this.cellSize / 2), (p[1] * this.cellSize) + (this.cellSize / 2)];
  }

  setPixel(x: number, y: number, value: boolean) {
    const i = (this.cols * y) + x;
    const cell = this.cells[i];
    if (cell && cell.filled !== value) {
      cell.filled = value;
      this.requestUpdate();
    }
  }

  draw<T extends SVGElement>(name: string, map?: Map<string, string>): T {
    const e = this.drawLayer!.ownerDocument!.createElementNS(SNS, name);
    if (map) {
      for (const [key, value] of map) {
        e.setAttribute(key, value);
      }
    }
    this.drawLayer!.appendChild(e);
    return e as T;
  }

  addHandle(id: string, x: number, y: number, xOnly = false, yOnly = false): SVGCircleElement | null {
    if (this.handlesGroup) {
      const [cx, cy] = [(x * this.cellSize) + (this.cellSize / 2), (y * this.cellSize) + (this.cellSize / 2)];
      const circle = this.handlesGroup.ownerDocument!.createElementNS(SNS, 'circle');
      circle.setAttribute('class', 'handle');
      circle.setAttribute('r', '5');
      circle.setAttribute('cx', `${cx}`);
      circle.setAttribute('cy', `${cy}`);
      circle.dataset.id = id;
      this.handlesGroup.appendChild(circle);

      const svg = this.svg!;
      let point = svg.createSVGPoint();
      point.x = cx;
      point.y = cy;
      point = point.matrixTransform(svg.getScreenCTM()!);
      const handle: Handle = {
        id,
        circle,
        x: point.x,
        y: point.y,
        cx, cy
      };
      this.handles.push(handle);
      const [w, h] = [this.width, this.height];
      const fire = () => {
        this.dispatchEvent(new CustomEvent('handle-move', { bubbles: true, composed: true, detail: { handle } }));
      };
      const pt = new PointerTracker(circle as any, {
        move(prev, changed) {
          if (prev.length === 1 && changed.length === 1) {
            const point = svg.createSVGPoint();
            point.x = changed[0].clientX;
            point.y = changed[0].clientY;
            if (xOnly) {
              handle.x = point.x;
              const coords = point.matrixTransform(svg.getScreenCTM()!.inverse());
              handle.cx = Math.max(0, Math.min(w, coords.x));
              circle.setAttribute('cx', `${handle.cx}`);
            } else if (yOnly) {
              handle.y = point.y;
              const coords = point.matrixTransform(svg.getScreenCTM()!.inverse());
              handle.cy = Math.max(0, Math.min(h, coords.y));
              circle.setAttribute('cy', `${handle.cy}`);
            } else {
              handle.x = point.x;
              handle.y = point.y;
              const coords = point.matrixTransform(svg.getScreenCTM()!.inverse());
              [handle.cx, handle.cy] = [Math.max(0, Math.min(w, coords.x)), Math.max(0, Math.min(h, coords.y))];
              circle.setAttribute('cx', `${handle.cx}`);
              circle.setAttribute('cy', `${handle.cy}`);
            }

            fire();
          }
        }
      });
      (circle as any)._tracker = pt;
      return circle;
    }
    return null;
  }
}