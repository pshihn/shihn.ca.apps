import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

const outFolder = 'dist';

function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED')
    return;
  console.error(warning.message);
}

export default [
  {
    input: 'bin/home/worker.js',
    output: {
      file: `${outFolder}/home/worker.js`,
      format: 'iife'
    },
    onwarn,
    plugins: [resolve(), terser({
      output: {
        comments: false
      }
    })]
  },
  {
    input: 'bin/home/stipple-canvas.js',
    output: {
      file: `${outFolder}/home/stipple-canvas.js`,
      format: 'iife',
      name: 'StippleCanvasGL'
    },
    onwarn,
    plugins: [resolve(), terser({
      output: {
        comments: false
      }
    })]
  },
];