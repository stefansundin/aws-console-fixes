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
    plugins: [nodeResolve(), terser()],
  },
  {
    input: './bootstrap.js',
    output: {
      file: './dist/bootstrap.esm.bundle.js',
      format: 'es',
      generatedCode: 'es2015',
      esModule: true,
      sourcemap: true,
    },
    plugins: [nodeResolve()],
  },
];
