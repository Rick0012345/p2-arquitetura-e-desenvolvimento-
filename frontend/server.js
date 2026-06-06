import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = process.env.PORT || 3000;
const root = fileURLToPath(new URL('.', import.meta.url));

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

const server = http.createServer(async (request, response) => {
  const requestedPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = normalize(join(root, requestedPath));

  if (!filePath.startsWith(normalize(root))) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream'
    });
    response.end(file);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Arquivo nao encontrado');
  }
});

server.listen(port, () => {
  console.log(`frontend running on http://localhost:${port}`);
});
