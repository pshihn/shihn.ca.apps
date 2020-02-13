import { LitElement, html, TemplateResult, property, customElement, CSSResult, query, PropertyValues } from 'lit-element';
import { paletteTypeList } from './worker-api';
import { flex } from 'soso/bin/styles/flex';
import { RemoteWorker } from './remote';

import 'soso/bin/components/file-button';
import 'soso/bin/components/checkbox';

@customElement('dither-view')
export class DitherView extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: String }) worker = '';
  @property() private processing = true;

  @query('select') private select?: HTMLSelectElement;
  @query('canvas') private canvas?: HTMLCanvasElement;

  private remote?: RemoteWorker;
  private objectUrl?: string;
  private dither = true;

  static get styles(): CSSResult {
    return flex;
  }

  render(): TemplateResult {
    return html`
    <style>
      :host {
        display: block;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
      }
      canvas {
        box-shadow: 0 6px 6px -3px rgba(0, 0, 0, .2), 0 10px 14px 1px rgba(0, 0, 0, .14), 0 4px 18px 3px rgba(0, 0, 0, .12);
        transition: opacity 0.3s ease;
      }
      canvas.processing {
        opacity: 0;
      }
      #controlPanel {
        padding: 32px 0;
        max-width: 300px;
        box-sizing: border-box;
        margin: 0 auto;
      }
      select {
        min-width: 150px;
        font-size: 16px;
        box-sizing: border-box;
        border: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        border-radius: 5px;
        padding: 10px 16px;
        border: 1px solid #e5e5e5;
        background: #fff;
        color: #4e7ab1;
        position: relative;
        outline: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%;
      }
      soso-file-button {
        color: #4e7ab1;
        font-family: inherit;
      }
      soso-checkbox {
        font-size: 15px;
        font-family: sans-serif;
        text-transform: capitalize;
        color: #4e7ab1;
        letter-spacing: 0.5px;
        font-weight: 400;
        --soso-highlight-color: #4e7ab1;
      }
    </style>
    <canvas class="${this.processing ? 'processing' : ''}" width="300" height="300"></canvas>
    <div id="controlPanel">
      <div class="horizontal layout center">
        <select @change="${this.refresh}">
          ${paletteTypeList.map((d) => html`<option value="${d}">${d}</option>`)}
        </select>
        <span class="flex"></span>
        <soso-file-button @file="${this.handleFile}" accept=".jpg, .jpeg, .png">Select image</soso-file-button>
      </div>
      <div class="horizontal layout center" style="margin-top: 10px;">
        <soso-checkbox .checked="${true}" @change="${this.toggleDither}">Dither image</soso-checkbox>
      </div>
    </div>
    `;
  }

  updated(changed: PropertyValues) {
    let refresh = !!(changed.has('src') && this.src);
    if (changed.has('worker') && this.worker) {
      this.remote = new RemoteWorker(this.worker);
      refresh = true;
    }
    if (refresh) {
      this.refresh();
    }
  }

  private toggleDither(e: CustomEvent) {
    this.dither = e.detail.checked;
    this.refresh();
  }

  private async refresh() {
    if (this.select && this.src && this.canvas && this.remote) {
      this.processing = true;

      const image = await this.loadImage(this.src);
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      if (iw && ih) {
        let [w, h] = [iw, ih];
        if (w > 300) {
          w = 300;
          h = (ih / iw) * w;
        }
        w = Math.round(w);
        h = Math.round(h);
        this.canvas.width = w;
        this.canvas.height = h;
        const ctx = this.canvas.getContext('2d')!;
        ctx.drawImage(image, 0, 0, iw, ih, 0, 0, w, h);

        const ptype = paletteTypeList[this.select.selectedIndex];

        const imageData = ctx.getImageData(0, 0, w, h);
        const outData = await this.remote.process(imageData, ptype, this.dither);
        ctx.putImageData(outData, 0, 0);

        this.processing = false;
      } else {
        return;
      }

      // 
    }
  }

  private handleFile(e: CustomEvent) {
    const file: File = e.detail.file;
    if (file) {
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = undefined;
      }
      this.objectUrl = URL.createObjectURL(file);
      this.src = this.objectUrl;
    }
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => {
        resolve(img);
      });
      img.addEventListener('error', () => {
        reject(new Error('Failed to load image'));
      });
      img.addEventListener('abort', () => {
        reject(new Error('Image load aborted'));
      });
      img.src = src;
    });
  }
}