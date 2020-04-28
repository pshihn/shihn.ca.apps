import { LitElement, customElement, html, TemplateResult, CSSResult, query, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { CellCanvas } from './cell-canvas';
import { Point, Line, EdgeEntry, ActiveEdgeEntry } from './geometry';

import './cell-canvas';
import 'soso/bin/components/switch';

@customElement('draw-polygon-canvas')
export class DrawPolygonCanvas extends LitElement {
  @property() emojify = false;
  @property({ type: Boolean }) fill = false;
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
        display: none;
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
    <div class="bar">
      <div class="flex"></div>
      <label>Draw using emoji</label>
      <soso-switch @change="${(e: CustomEvent) => this.emojify = e.detail.checked}"></soso-switch>
    </div>
    <cell-canvas .height="${300}" .filler="${this.emojify ? '😀' : ''}" @handle-move="${this.updateLines}"></cell-canvas>
    `;
  }

  firstUpdated() {
    const c = this.canvas!;
    c.updateComplete.then(() => {
      const vertices: Point[] = [
        [1, 9],
        [20, 13],
        [24, 2],
        [14, 5],
        [7, 1]
      ];
      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        c.addHandle(`v-${i}`, v[0], v[1]);
      }

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
      const vertices: Point[] = [];
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
        vertices.push(c.pixelCoords([x1, y1]));
      }
      const bricks: Point[] = [];
      this.renderLines(linesToDraw, bricks);
      if (this.fill) {
        this.fillPolygon(vertices, bricks);
      }
      this.drawPoints(bricks);
    }
  }

  private fillPolygon(points: Point[], bricks: Point[]) {
    const vertices = [...points];
    if (vertices[0].join(',') !== vertices[vertices.length - 1].join(',')) {
      vertices.push([vertices[0][0], vertices[0][1]]);
    }

    // Create sorted edges table
    const edges: EdgeEntry[] = [];
    for (let i = 0; i < vertices.length - 1; i++) {
      const p1 = vertices[i];
      const p2 = vertices[i + 1];
      if (p1[1] !== p2[1]) {
        const ymin = Math.min(p1[1], p2[1]);
        edges.push({
          ymin,
          ymax: Math.max(p1[1], p2[1]),
          x: ymin === p1[1] ? p1[0] : p2[0],
          islope: (p2[0] - p1[0]) / (p2[1] - p1[1])
        });
      }
    }
    edges.sort((e1, e2) => {
      if (e1.ymin < e2.ymin) {
        return -1;
      }
      if (e1.ymin > e2.ymin) {
        return 1;
      }
      if (e1.x < e2.x) {
        return -1;
      }
      if (e1.x > e2.x) {
        return 1;
      }
      if (e1.ymax === e2.ymax) {
        return 0;
      }
      return (e1.ymax - e2.ymax) / Math.abs((e1.ymax - e2.ymax));
    });

    let activeEdges: ActiveEdgeEntry[] = [];
    let y = edges[0].ymin;
    while (activeEdges.length || edges.length) {
      if (edges.length) {
        let ix = -1;
        for (let i = 0; i < edges.length; i++) {
          if (edges[i].ymin > y) {
            break;
          }
          ix = i;
        }
        const removed = edges.splice(0, ix + 1);
        removed.forEach((edge) => {
          activeEdges.push({ s: y, edge });
        });
      }
      activeEdges = activeEdges.filter((ae) => {
        if (ae.edge.ymax === y) {
          return false;
        }
        return true;
      });
      activeEdges.sort((ae1, ae2) => {
        if (ae1.edge.x === ae2.edge.x) {
          return 0;
        }
        return (ae1.edge.x - ae2.edge.x) / Math.abs((ae1.edge.x - ae2.edge.x));
      });

      // fill between the edges
      if (activeEdges.length > 1) {
        for (let i = 0; i < activeEdges.length; i = i + 2) {
          const nexti = i + 1;
          if (nexti >= activeEdges.length) {
            break;
          }
          const ce = activeEdges[i].edge;
          const ne = activeEdges[nexti].edge;
          bricks.push(...this.linePoints(Math.round(ce.x), y, Math.round(ne.x), y));
        }
      }

      y++;
      activeEdges.forEach((ae) => {
        ae.edge.x = ae.edge.x + ae.edge.islope;
      });
    }
  }

  private linePoints(x1: number, y1: number, x2: number, y2: number): Point[] {
    const points: Point[] = [];
    const dy = y2 - y1;
    const dx = x2 - x1;
    const n = Math.max(Math.abs(dx), Math.abs(dy));
    const ninv = n === 0 ? 0 : 1 / n;
    const xStep = dx * ninv;
    const yStep = dy * ninv;
    let x = x1;
    let y = y1;
    points.push([Math.round(x), Math.round(y)]);
    for (let step = 0; step < n; step++) {
      x += xStep;
      y += yStep;
      points.push([Math.round(x), Math.round(y)]);
    }
    return points;
  }

  private renderLines(lines: Line[], bricks: Point[]) {
    for (const line of lines) {
      const [p1, p2] = line;
      const [x1, y1, x2, y2] = [...p1, ...p2];
      bricks.push(...this.linePoints(x1, y1, x2, y2));
    }
  }

  private drawPoints(points: Point[]) {
    const c = this.canvas!;
    for (const p of this.points) {
      c.setPixel(p[0], p[1], false);
    }
    for (const p of points) {
      c.setPixel(p[0], p[1], true);
    }
    this.points = points;
  }
}