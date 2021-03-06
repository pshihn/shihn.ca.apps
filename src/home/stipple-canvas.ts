import { createProgram, resizeCanvasToDisplaySize } from './gl-utils';
import { m3 } from './m3.js';
import { StippleInfo } from 'stipple/lib/stipple';
import { loadImageData } from './image-utils';
import { StippleRequest } from './stippler';

const vs = `
attribute vec2 a_src;
attribute vec2 a_dst;

uniform vec2 u_resolution;
uniform mat3 u_smatrix;
uniform mat3 u_dmatrix;
uniform float u_time;

void main() {
  vec2 src = (u_smatrix * vec3(a_src, 1)).xy;
  vec2 dst = (u_dmatrix * vec3(a_dst, 1)).xy;
  vec2 position = src + ((dst - src) * u_time);
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  gl_PointSize = 6.0;
}
`;

const fs = `
precision mediump float;

void main() {
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r = dot(cxy, cxy);
  float alpha = 1.0 - smoothstep(0.1, 0.5, r);
  if (r > 1.0) {
    discard;
  }
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * alpha;
}
`;

export class StippleCanvas {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private srcLoc = -1;
  private dstLoc = -1;
  private resolutionLoc: WebGLUniformLocation | null;
  private srcMatrixLoc: WebGLUniformLocation | null;
  private dstMatrixLoc: WebGLUniformLocation | null;
  private timeLoc: WebGLUniformLocation | null;
  private srcBuffer: WebGLBuffer;
  private dstBuffer: WebGLBuffer;

  private n: number;
  private animationDuration: number;
  private dstPoints?: Float32Array;
  private srcMatrix = m3.identity();
  private dstMatrix = m3.identity();

  private animationTimeStart = 0;
  private animating = false;
  private currentImage = '';

  private worker: Worker;

  constructor(canvas: HTMLCanvasElement, workerUrl: string, n: number, animationDuration: number) {
    this.canvas = canvas;
    this.animationDuration = animationDuration;
    this.n = n;
    const gl = this.canvas.getContext('webgl');
    if (gl === null) {
      throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.');
    }
    this.gl = gl;
    this.program = createProgram(gl, vs, fs);

    // locations
    this.dstLoc = gl.getAttribLocation(this.program, 'a_dst');
    this.srcLoc = gl.getAttribLocation(this.program, 'a_src');
    this.resolutionLoc = gl.getUniformLocation(this.program, 'u_resolution');
    this.srcMatrixLoc = gl.getUniformLocation(this.program, 'u_smatrix');
    this.dstMatrixLoc = gl.getUniformLocation(this.program, 'u_dmatrix');
    this.timeLoc = gl.getUniformLocation(this.program, 'u_time');

    // create buffers
    this.srcBuffer = gl.createBuffer()!;
    this.dstBuffer = gl.createBuffer()!;

    // initialize worker
    this.worker = new Worker(workerUrl);
    this.worker.addEventListener('message', this.messageHandler.bind(this));
  }

  private updatePoints(points: Float32Array, dst: boolean) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, dst ? this.dstBuffer : this.srcBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);
    if (dst) {
      this.dstPoints = points;
    }
  }

  async start() {
    // TOOD do this in worker
    const n = this.n;
    const { width, height } = this.canvas;
    const srcPoints = new Float32Array(n * 2);
    const points = new Float32Array(n * 2);
    for (let i = 0; i < this.n; i++) {
      points[i * 2] = Math.floor(Math.random() * width);
      points[i * 2 + 1] = Math.floor(Math.random() * height);
      srcPoints[i * 2] = srcPoints[i * 2 + 1] = 0;
    }
    this.updatePoints(srcPoints, false);
    this.updatePoints(points, true);

    this.animationTimeStart = 0;
    this.nextTic();
  }

  private nextTic() {
    requestAnimationFrame((time: number) => this.tic(time));
  }

  private tic(time: number) {
    let t = 1;
    if (this.animating) {
      if (!this.animationTimeStart) {
        this.animationTimeStart = time;
      }
      t = Math.min(1, (time - this.animationTimeStart) / this.animationDuration);
    }

    const gl = this.gl;
    resizeCanvasToDisplaySize(this.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);

    // bind src
    gl.bindBuffer(gl.ARRAY_BUFFER, this.srcBuffer);
    gl.enableVertexAttribArray(this.srcLoc);
    gl.vertexAttribPointer(this.srcLoc, 2, gl.FLOAT, false, 0, 0);

    // bind dst
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dstBuffer);
    gl.enableVertexAttribArray(this.dstLoc);
    gl.vertexAttribPointer(this.dstLoc, 2, gl.FLOAT, false, 0, 0);

    // set uniforms
    gl.uniform2f(this.resolutionLoc, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(this.timeLoc, t);
    gl.uniformMatrix3fv(this.srcMatrixLoc, false, this.srcMatrix);
    gl.uniformMatrix3fv(this.dstMatrixLoc, false, this.dstMatrix);

    // Draw!
    gl.drawArrays(gl.POINTS, 0, this.n);

    if (t < 1) {
      this.nextTic();
    } else if (this.animating) {
      this.animating = false;
    }
  }

  private update(info: StippleInfo) {
    // update points
    if (this.dstPoints) {
      this.updatePoints(this.dstPoints, false);
    }
    this.updatePoints(info.points, true);

    // update matrices
    this.srcMatrix = this.dstMatrix;
    const scale = Math.min(this.canvas.width / info.width, this.canvas.height / info.height);
    const tx = (this.canvas.width - (info.width * scale)) / 2;
    const ty = (this.canvas.height - (info.height * scale)) / 2;
    this.dstMatrix = m3.multiply(m3.translation(tx, ty), m3.scaling(scale, scale));

    this.animationTimeStart = 0;
    if (!this.animating) {
      this.animating = true;
      this.nextTic();
    }
  }

  async drawImage(url: string, force: boolean) {
    if (force || (this.currentImage !== url)) {
      this.currentImage = url;
      const imageData = await loadImageData(url);
      if (this.currentImage !== url) {
        return;
      }
      if (imageData.width && imageData.height) {
        const request: StippleRequest = {
          buffer: imageData.data.buffer,
          height: imageData.height,
          width: imageData.width,
          pointCount: this.n,
          name: url
        };
        this.worker.postMessage(request, [imageData.data.buffer]);
      }
    }
  }

  private async messageHandler(event: MessageEvent) {
    const info = event.data as StippleInfo;
    this.update(info);
  }
}