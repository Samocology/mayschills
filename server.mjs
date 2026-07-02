import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const serverModule = await import('./dist/server/server.js');
const fetchHandler = serverModule.default.fetch || serverModule.default;

const port = process.env.PORT || 10000;
const host = '0.0.0.0';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function serveStatic(pathname) {
  const filePath = join(__dirname, 'dist', 'client', pathname === '/' ? 'index.html' : pathname);
  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    return new Response(data, {
      headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' },
    });
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
    
    // Try serving static files first
    const staticResponse = await serveStatic(url.pathname);
    if (staticResponse) {
      res.writeHead(staticResponse.status, Object.fromEntries(staticResponse.headers));
      if (staticResponse.body) {
        const reader = staticResponse.body.getReader();
        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) { res.end(); return; }
          res.write(value);
          await pump();
        };
        await pump();
      } else {
        res.end();
      }
      return;
    }

    // Fall back to SSR handler
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        const val = Array.isArray(value) ? value.join(', ') : value;
        headers.set(key, val);
      }
    }

    const request = new Request(url.href, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    });

    const response = await fetchHandler(request);
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    res.writeHead(response.status, responseHeaders);

    if (response.body) {
      const reader = response.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) { res.end(); return; }
        res.write(value);
        await pump();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>Internal Server Error</h1>');
  }
});

server.listen(port, host, () => {
  console.log('Server running at http://' + host + ':' + port + '/');
});
