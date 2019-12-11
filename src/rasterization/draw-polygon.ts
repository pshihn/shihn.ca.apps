import { LitElement, customElement, html, TemplateResult, CSSResult, query, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { CellCanvas } from './cell-canvas';
import { Point, Line } from './geometry';

import './cell-canvas';
import 'soso/bin/components/switch';

@customElement('draw-polygon-canvas')
export class DrawPolygonCanvas extends LitElement {
  @property() emojify = false;
  @query('cell-canvas') canvas?: CellCanvas;

  private lines: SVGLineElement[] = [];
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
    <cell-canvas .height="${300}" .filler="${this.emojify ? '😀' : ''}" @handle-move="${this.updateLines}"></cell-canvas>
    <div id="caption">Move the vertices to change the polygon</div>
    `;
  }

  firstUpdated() {
    const c = this.canvas!;
    c.updateComplete.then(() => {
      c.addHandle('a', 1, 9);
      c.addHandle('b', 20, 13);
      c.addHandle('c', 24, 2);
      c.addHandle('d', 14, 5);
      c.addHandle('e', 7, 1);

      this.lines = [];
      const map = new Map();
      for (let i = 0; i < 5; i++) {
        this.lines.push(c.draw<SVGLineElement>('line', map));
      }
      this.updateLines();
    });
  }

  private updateLines() {
    if (this.lines && this.lines.length) {
      const c = this.canvas!;
      const handles = c.handles;
      const linesToDraw: Line[] = [];
      for (let i = 0; i < this.lines.length; i++) {
        let j = i + 1;
        if (j >= this.lines.length) {
          j = 0;
        }
        const [x1, y1, x2, y2] = [handles[i].cx, handles[i].cy, handles[j].cx, handles[j].cy];
        const line = this.lines[i];
        line.setAttribute('x1', `${x1}`);
        line.setAttribute('y1', `${y1}`);
        line.setAttribute('x2', `${x2}`);
        line.setAttribute('y2', `${y2}`);
        linesToDraw.push([c.pixelCoords([x1, y1]), c.pixelCoords([x2, y2])]);
      }
      this.renderLines(linesToDraw);
    }
  }

  private renderLines(lines: Line[]) {
    const c = this.canvas!;
    for (const p of this.points) {
      c.setPixel(p[0], p[1], false);
    }
    this.points = [];
    for (const line of lines) {
      const [p1, p2] = line;
      const [x1, y1, x2, y2] = [...p1, ...p2];
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
    }
    for (const p of this.points) {
      c.setPixel(p[0], p[1], true);
    }
  }
}