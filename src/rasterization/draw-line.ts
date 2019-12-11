import { LitElement, customElement, html, TemplateResult, CSSResult, query, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { CellCanvas } from './cell-canvas';
import { Point } from './geometry';

import './cell-canvas';
import 'soso/bin/components/switch';

@customElement('draw-line-canvas')
export class DrawLineCanvas extends LitElement {
  @property() emojify = false;
  @query('cell-canvas') canvas?: CellCanvas;

  private line?: SVGLineElement;
  private points: Point[] = [];

  static get styles(): CSSResult {
    return flex;
  }

  render(): TemplateResult {
    return html`
    <style>
      :host {
        display: block;
        --soso-highlight-color: var(--highlight-blue);
      }
      .bar {
        padding: 6px 8px;
      }
      label {
        font-size: 13px;
        font-family: sans-serif;
        text-transform: capitalize;
        color: #808080;
        letter-spacing: 0.5px;
        font-weight: 400;
        margin-right: 12px;
      }
      #caption {
        padding: 8px;
        text-align: center;
        font-style: italic;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #555;
      }
    </style>
    <div class="bar horizontal layout center">
      <div class="flex"></div>
      <label>Draw using emoji</label>
      <soso-switch @change="${(e: CustomEvent) => this.emojify = e.detail.checked}"></soso-switch>
    </div>
    <cell-canvas .filler="${this.emojify ? '😀' : ''}" @handle-move="${this.updateLine}"></cell-canvas>
    <div id="caption">Move the endpoints to change the line</div>
    `;
  }

  firstUpdated() {
    const c = this.canvas!;
    c.updateComplete.then(() => {
      c.addHandle('a', 4, 4);
      c.addHandle('b', 10, 4);
      this.line = c.draw<SVGLineElement>('line');
      this.updateLine();
    });
  }

  private updateLine() {
    if (this.line) {
      const c = this.canvas!;
      const handles = c.handles;
      const [x1, y1, x2, y2] = [handles[0].cx, handles[0].cy, handles[1].cx, handles[1].cy];
      this.line.setAttribute('x1', `${x1}`);
      this.line.setAttribute('y1', `${y1}`);
      this.line.setAttribute('x2', `${x2}`);
      this.line.setAttribute('y2', `${y2}`);
      this.drawLine(c.pixelCoords([x1, y1]), c.pixelCoords([x2, y2]));
    }
  }

  private drawLine(p1: Point, p2: Point) {
    const c = this.canvas!;
    for (const p of this.points) {
      c.setPixel(p[0], p[1], false);
    }
    const [x1, y1, x2, y2] = [...p1, ...p2];
    this.points = [];
    const dy = y2 - y1;
    const dx = x2 - x1;
    const n = Math.max(Math.abs(dx), Math.abs(dy));
    const ninv = n === 0 ? 0 : 1 / n;
    const xStep = dx * ninv;
    const yStep = dy * ninv;
    let x = x1;
    let y = y1;
    this.points.push([Math.round(x), Math.round(y)]);
    for (let step = 0; step < n; step++) {
      x += xStep;
      y += yStep;
      this.points.push([Math.round(x), Math.round(y)]);
    }
    for (const p of this.points) {
      c.setPixel(p[0], p[1], true);
    }
  }
}