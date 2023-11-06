import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import nodeResolve from '@rollup/plugin-node-resolve';
// import terser from '@rollup/plugin-terser';

export default {
  input: 'compile/index.js',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    // terser(),
    commonjs(),
    json(),
    nodeResolve(),
  ],
  external: [
    "graphql",
  ],
};
