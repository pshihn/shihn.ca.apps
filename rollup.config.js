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
    input: 'bin/rasterization/index.js',
    output: {
      file: `${outFolder}/rasterization.js`,
      format: 'iife'
    },
    onwarn,
    plugins: [resolve(), terser({
      output: {
        comments: false
      }
    })]
  }
];