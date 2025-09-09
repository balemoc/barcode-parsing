import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: './src/index.ts',
    format: ['esm', 'cjs'],
    platform: 'neutral',
    outDir: 'lib',
    dts: true,
    clean: true,
    plugins: [],
});
