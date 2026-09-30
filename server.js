const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const FRAMES_DIR = path.join(BASE_DIR, 'ezgif-7ea5ecfd07305554-jpg');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

// Inspect and verify syncable frames
function getValidFrames() {
  if (!fs.existsSync(FRAMES_DIR)) {
    return [];
  }
  const files = fs.readdirSync(FRAMES_DIR);
  const frameList = [];

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
    const fullPath = path.join(FRAMES_DIR, file);
    try {
      const stat = fs.statSync(fullPath);
      // Ensure file is non-empty and accessible
      if (stat.isFile() && stat.size > 1024) {
        frameList.push({
          name: file,
          url: `/ezgif-7ea5ecfd07305554-jpg/${file}`,
          size: stat.size,
        });
      }
    } catch {
      // Ignore unreadable or broken files
    }
  }

  // Sort frames by number
  frameList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  return frameList;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API endpoint to get syncable frames list
  if (pathname === '/api/frames') {
    const frames = getValidFrames();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-cache',
    });
    res.end(JSON.stringify({ total: frames.length, frames }));
    return;
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(BASE_DIR, pathname));

  // Security check to avoid directory traversal
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
    };

    // Aggressive caching for images to ensure maximum smoothness during scroll
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.gif') {
      headers['Cache-Control'] = 'public, max-age=86400, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
