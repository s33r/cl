import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Development server with hot reloading
 */
const serve = async () => {
  const app = express();
  const PORT = 3000;

  // Build contexts for watching
  const commonContext = await esbuild.context({
    entryPoints: ['source/common/index.ts'],
    bundle: true,
    platform: 'neutral',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/common/index.js',
    sourcemap: true,
  });

  const serverContext = await esbuild.context({
    entryPoints: ['source/server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/server/index.js',
    external: ['express'],
    sourcemap: true,
  });

  const clientContext = await esbuild.context({
    entryPoints: ['source/client/index.tsx'],
    bundle: true,
    platform: 'browser',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/client/bundle.js',
    sourcemap: true,
    plugins: [
      sassPlugin({
        type: 'css',
      }),
    ],
  });

  // Watch all contexts
  await Promise.all([
    commonContext.watch(),
    serverContext.watch(),
    clientContext.watch(),
  ]);

  console.log('Watching for changes...');

  // Serve static files
  app.use('/dist', express.static(path.join(__dirname, 'dist')));

  // Serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Development server running at http://localhost:${PORT}`);
  });
};

serve().catch((error) => {
  console.error('Failed to start dev server:', error);
  process.exit(1);
});
