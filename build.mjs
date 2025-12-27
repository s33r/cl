import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import * as fs from 'fs';
import * as path from 'path';

const isDev = process.argv.includes('--dev');

/**
 * Build configuration for the common module
 */
const buildCommon = async () => {
  await esbuild.build({
    entryPoints: ['source/common/index.ts'],
    bundle: true,
    platform: 'neutral',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/common/index.js',
    sourcemap: isDev,
    minify: !isDev,
  });
  console.log('✓ Common module built');
};

/**
 * Build configuration for the server
 */
const buildServer = async () => {
  await esbuild.build({
    entryPoints: ['source/server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/server/index.js',
    external: ['express'],
    sourcemap: isDev,
    minify: !isDev,
  });
  console.log('✓ Server built');
};

/**
 * Build configuration for the client
 */
const buildClient = async () => {
  await esbuild.build({
    entryPoints: ['source/client/index.tsx'],
    bundle: true,
    platform: 'browser',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/client/bundle.js',
    sourcemap: isDev,
    minify: !isDev,
    plugins: [
      sassPlugin({
        type: 'css',
      }),
    ],
  });
  console.log('✓ Client built');
};

/**
 * Main build function
 */
const build = async () => {
  console.log('Building project...');

  try {
    await Promise.all([buildCommon(), buildServer(), buildClient()]);
    console.log('✓ Build complete');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

build();
