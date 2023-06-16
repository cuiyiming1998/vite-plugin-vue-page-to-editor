import type { Options } from 'tsup'

export const tsup: Options = {
  treeshake: 'safest',
  splitting: false,
  sourcemap: false,
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  external: ['vite'],
  dts: true,
  clean: true,
  minify: true,
}
