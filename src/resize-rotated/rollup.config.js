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
    input: 'bin/resize-rotated/resize-canvas.js',
    output: {
      file: `${outFolder}/resize-rotated/resize-canvas.js`,
      format: 'iife',
      name: 'ResizeCanvas'
    },
    onwarn,
    plugins: [resolve(), terser({
      output: {
        comments: false
      }
    })]
  }
];