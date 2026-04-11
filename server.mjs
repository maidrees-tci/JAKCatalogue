/**
 * Production static file server for Azure App Service (Node.js).
 * - Listens on process.env.PORT (required by Azure) and 0.0.0.0
 * - Serves Vite build output from ./dist
 * - SPA fallback so React Router routes work on refresh
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dist = path.join(__dirname, 'dist');
const port = Number(process.env.PORT) || 8080;

app.use(express.static(dist, { fallthrough: true }));

app.use((_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`MediCart HQ listening on http://0.0.0.0:${port}`);
});
