import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Development server with hot reloading and API routes
 */
const serve = async () => {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

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

  // In-memory storage for events (development only)
  const events = new Map();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/events', (req, res) => {
    const eventList = Array.from(events.values());
    res.json(eventList);
  });

  app.get('/api/events/:id', (req, res) => {
    const event = events.get(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  });

  app.post('/api/events', (req, res) => {
    try {
      const eventData = req.body;
      events.set(eventData.id, eventData);
      res.status(201).json(eventData);
    } catch (error) {
      res.status(400).json({ error: 'Invalid event data', details: error });
    }
  });

  app.put('/api/events/:id', (req, res) => {
    const existingEvent = events.get(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    try {
      const eventData = req.body;
      events.set(req.params.id, eventData);
      res.json(eventData);
    } catch (error) {
      res.status(400).json({ error: 'Invalid event data', details: error });
    }
  });

  app.delete('/api/events/:id', (req, res) => {
    const deleted = events.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).send();
  });

  // Serve static files
  app.use('/dist', express.static(path.join(__dirname, 'dist')));

  // Serve index.html for all other routes (SPA fallback)
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
