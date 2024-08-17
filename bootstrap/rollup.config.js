import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: './bootstrap.js',
    output: {
      file: './dist/bootstrap.esm.bundle.min.js',
      format: 'es',
      generatedCode: 'es2015',
      esModule: true,
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      terser({
        format: {
          preamble: '/* eslint-disable */ // @ts-nocheck',
        },
      }),
    ],
  },
  {
    input: './bootstrap.js',
    output: {
      file: './dist/bootstrap.esm.bundle.js',
      format: 'es',
      generatedCode: 'es2015',
      esModule: true,
      sourcemap: true,
      banner: '/* eslint-disable */ // @ts-nocheck',
    },
    plugins: [nodeResolve()],
  },
];
