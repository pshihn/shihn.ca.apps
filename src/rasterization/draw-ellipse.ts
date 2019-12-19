import { LitElement, customElement, html, TemplateResult, CSSResult, query, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { CellCanvas } from './cell-canvas';
import { Point, Rectangle } from './geometry';

import './cell-canvas';
import 'soso/bin/components/switch';

@customElement('draw-ellipse-canvas')
export class DrawEllipseCanvas extends LitElement {
  @property() emojify = false;
  @property({ type: Boolean }) fill = false;
  @query('cell-canvas') canvas?: CellCanvas;

  private points: Point[] = [];
  private ellipse?: SVGEllipseElement;

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
    <cell-canvas .height="${300}" .filler="${this.emojify ? '😀' : ''}" @handle-move="${this.updateCircle}"></cell-canvas>
    <div id="caption">Move the points to change the ellipse's dimensions</div>
    `;
  }

  firstUpdated() {
    const c = this.canvas!;
    c.updateComplete.then(() => {
      c.addHandle(`a`, 18, 7, true);
      c.addHandle(`b`, 12, 1, false, true);
      this.ellipse = c.draw<SVGEllipseElement>('ellipse');
      this.updateCircle();
    });
  }

  private updateCircle() {
    if (this.ellipse) {
      const c = this.canvas!;
      const handles = c.handles;
      const center: Point = c.pixelCoordsInv([12, 7]);
      let a: Point = [0, 0];
      let b: Point = [0, 0];
      for (const h of handles) {
        if (h.id === 'a') {
          a = [h.cx, h.cy];
        } else if (h.id === 'b') {
          b = [h.cx, h.cy];
        }
      }
      const rx = Math.abs(center[0] - a[0]);
      const ry = Math.abs(center[1] - b[1]);
      this.ellipse.setAttribute('cx', `${center[0]}`);
      this.ellipse.setAttribute('cy', `${center[1]}`);
      this.ellipse.setAttribute('rx', `${rx}`);
      this.ellipse.setAttribute('ry', `${ry}`);

      const rp = c.pixelCoords([rx, ry]);

      this.drawEllipse(12, 7, rp[0], rp[1]);
    }
  }

  private drawEllipse(xc: number, yc: number, a: number, b: number) {
    let x = 0;
    let y = b;

    const a2 = a * a;
    const b2 = b * b;
    const crit1 = -(a2 / 4 + a % 2 + b2);
    const crit2 = -(b2 / 4 + b % 2 + a2);
    const crit3 = -(b2 / 4 + b % 2);
    let t = -a2 * y;
    let dxt = 2 * b2 * x;
    let dyt = -2 * a2 * y;
    const d2xt = 2 * b2;
    const d2yt = 2 * a2;

    const incx = () => {
      x++;
      dxt += d2xt;
      t += dxt;
    };
    const incy = () => {
      y--;
      dyt += d2yt;
      t += dyt;
    };

    const bricks: Point[] = [];

    if (this.fill) {
      const rects: Rectangle[] = [];
      let rx = x;
      let ry = y;
      let width = 1;
      let height = 1;

      const rectPush = (x: number, y: number, width: number, height: number) => {
        if (height < 0) {
          y += height + 1;
          height = Math.abs(height);
        }
        rects.push({ x, y, width, height });
      };

      if (b === 0) {
        rectPush(xc - 1, yc, 2 * a + 1, 1);
      } else {
        while (y >= 0 && x <= a) {
          if ((t + b2 * x <= crit1) || (t + a2 * y <= crit3)) {
            if (height === 1) {
              // do nothing;
            } else if ((ry * 2 + 1) > ((height - 1) * 2)) {
              rectPush(xc - rx, yc - ry, width, height - 1);
              rectPush(xc - rx, yc + ry, width, 1 - height);
              ry -= height - 1;
              height = 1;
            } else {
              rectPush(xc - rx, yc - ry, width, ry * 2 + 1);
              ry -= ry;
              height = 1;
            }
            incx();
            rx++;
            width += 2;
          } else if ((t - a2 * y) > crit2) {
            incy();
            height++;
          } else {
            if ((ry * 2 + 1) > (height * 2)) {
              rectPush(xc - rx, yc - ry, width, height);
              rectPush(xc - rx, yc + ry, width, -height);
            } else {
              rectPush(xc - rx, yc - ry, width, ry * 2 + 1);
            }
            incx();
            incy();
            rx++;
            width += 2;
            ry -= height;
            height = 1;
          }
        }
        if (ry > height) {
          rectPush(xc - rx, yc - ry, width, height);
          rectPush(xc - rx, yc + ry + 1, width, -height);
        } else {
          rectPush(xc - rx, yc - ry, width, ry * 2 + 1);
        }
      }
      rects.forEach((rect) => {
        if (rect.height < 0) {
          rect.y += rect.height + 1;
          rect.height = Math.abs(rect.height);
        }
      });
      rects.sort((a, b) => {
        return a.y - b.y;
      });
      rects.forEach((rect) => {
        const { x, y, width, height } = rect;
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            bricks.push([x + i, y + j]);
          }
        }
      });
    } else {
      while (y >= 0 && x <= a) {
        bricks.push([xc + x, yc + y]);
        if (x !== 0 || y !== 0) {
          bricks.push([xc - x, yc - y]);
        }
        if (x !== 0 && y !== 0) {
          bricks.push([xc + x, yc - y]);
          bricks.push([xc - x, yc + y]);
        }
        if ((t + b2 * x <= crit1) || (t + a2 * y <= crit3)) {
          incx();
        } else if (t - a2 * y > crit2) {
          incy();
        } else {
          incx();
          incy();
        }
      }
    }
    this.drawPoints(bricks);
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