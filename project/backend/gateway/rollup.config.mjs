import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import nodeResolve from '@rollup/plugin-node-resolve';
// import terser from '@rollup/plugin-terser';

export default {
  input: 'compile/main.js',
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
    "fsevents",
    "@nestjs/apollo",
    "@nestjs/common",
    "@nestjs/core",
    "@nestjs/graphql",
    "@nestjs/platform-express",
  ],
};
