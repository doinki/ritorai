import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  env: {
    NODE_ENV: 'production',
  },
  esbuildOptions: (options) => {
    options.sourcemap = true;
  },
  format: ['cjs', 'esm'],
  target: 'es2018',
  treeshake: true,
});
