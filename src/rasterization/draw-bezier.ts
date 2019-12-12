import { LitElement, customElement, html, TemplateResult, CSSResult, query, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { CellCanvas } from './cell-canvas';
import { Point } from './geometry';
import { Bezier } from './bezier';

import './cell-canvas';
import 'soso/bin/components/switch';

@customElement('draw-bezier-canvas')
export class DrawBezierCanvas extends LitElement {
  @property() emojify = false;
  @property({ type: Boolean }) fill = false;
  @query('cell-canvas') canvas?: CellCanvas;

  private points: Point[] = [];
  private path?: SVGPathElement;
  private line1?: SVGLineElement;
  private line2?: SVGLineElement;

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
    <cell-canvas .height="${400}" .filler="${this.emojify ? '😀' : ''}" @handle-move="${this.updateCircle}"></cell-canvas>
    <div id="caption">Move the end and control points to adjust the curve</div>
    `;
  }

  firstUpdated() {
    const c = this.canvas!;
    c.updateComplete.then(() => {
      c.addHandle(`a`, 1, 18);
      c.addHandle(`b`, 24, 11);
      const c1 = c.addHandle(`p1`, 10, 1);
      const c2 = c.addHandle(`p2`, 24, 1);
      this.line1 = c.draw<SVGLineElement>('line');
      this.line2 = c.draw<SVGLineElement>('line');
      this.path = c.draw<SVGPathElement>('path');
      this.line1.style.stroke = 'rgba(21, 101, 192, 0.8)';
      this.line2.style.stroke = 'rgba(21, 101, 192, 0.8)';
      c1!.style.fill = 'rgba(21, 101, 192, 0.8)';
      c2!.style.fill = 'rgba(21, 101, 192, 0.8)';
      this.updateCircle();
    });
  }

  private updateCircle() {
    if (this.path && this.line1 && this.line2) {
      const c = this.canvas!;
      const handles = c.handles;
      let a: Point = [0, 0];
      let b: Point = [0, 0];
      let p1: Point = [0, 0];
      let p2: Point = [0, 0];
      for (const h of handles) {
        if (h.id === 'a') {
          a = [h.cx, h.cy];
        } else if (h.id === 'b') {
          b = [h.cx, h.cy];
        } else if (h.id === 'p1') {
          p1 = [h.cx, h.cy];
        } else if (h.id === 'p2') {
          p2 = [h.cx, h.cy];
        }
      }
      this.line1.setAttribute('x1', `${a[0]}`);
      this.line1.setAttribute('y1', `${a[1]}`);
      this.line1.setAttribute('x2', `${p1[0]}`);
      this.line1.setAttribute('y2', `${p1[1]}`);
      this.line2.setAttribute('x1', `${b[0]}`);
      this.line2.setAttribute('y1', `${b[1]}`);
      this.line2.setAttribute('x2', `${p2[0]}`);
      this.line2.setAttribute('y2', `${p2[1]}`);
      this.path.setAttribute('d', `M ${a[0]} ${a[1]} C ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${b[0]} ${b[1]}`);
      this.drawCurve(c.pixelCoords(a), c.pixelCoords(p1), c.pixelCoords(p2), c.pixelCoords(b));
    }
  }

  private drawCurve(a: Point, p1: Point, p2: Point, b: Point) {
    const bezier = new Bezier(a, p1, p2, b);
    const luts = bezier.getLUT(bezier.length() * 2).map<Point>((p) => [Math.round(p[0]), Math.round(p[1])]);
    luts.push(b);
    this.drawPoints(luts);
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