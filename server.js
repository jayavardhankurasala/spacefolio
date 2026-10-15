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
  '.xml': 'application/xml; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

// Security headers applied to all responses
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self'; frame-ancestors 'self';",
};

function getValidFrames() {
  if (!fs.existsSync(FRAMES_DIR)) {
    return [];
  }
  try {
    const files = fs.readdirSync(FRAMES_DIR);
    const frameList = [];

    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
      const fullPath = path.join(FRAMES_DIR, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && stat.size > 1024) {
          frameList.push({
            name: file,
            url: `/ezgif-7ea5ecfd07305554-jpg/${file}`,
            size: stat.size,
          });
        }
      } catch {
        // Skip unreadable files
      }
    }

    frameList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    return frameList;
  } catch {
    return [];
  }
}

const server = http.createServer((req, res) => {
  // Reject unsafe HTTP methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=UTF-8', ...SECURITY_HEADERS });
    res.end('Method Not Allowed');
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API endpoint for frames
  if (pathname === '/api/frames') {
    const frames = getValidFrames();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-cache',
      ...SECURITY_HEADERS,
    });
    res.end(JSON.stringify({ total: frames.length, frames }));
    return;
  }

  // Routing
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin.html';
  }

  const safePath = path.normalize(path.join(BASE_DIR, pathname));

  // Directory traversal prevention
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8', ...SECURITY_HEADERS });
    res.end('Access Denied');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8', ...SECURITY_HEADERS });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Cosmic Void | Page Not Found</title>
  <style>
    body { background: #030407; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 20px; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; max-width: 480px; backdrop-filter: blur(20px); }
    h1 { font-size: 4rem; margin: 0 0 10px; color: #a78bfa; }
    p { color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 24px; }
    a { display: inline-block; background: #fff; color: #030407; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 600; font-size: 0.9rem; transition: transform 0.2s; }
    a:hover { transform: scale(1.04); }
  </style>
</head>
<body>
  <div class="card">
    <h1>404</h1>
    <h2>Cosmic Void</h2>
    <p>The coordinate you navigated to does not exist in this galaxy sector.</p>
    <a href="/">Return to Spacefolio</a>
  </div>
</body>
</html>`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      ...SECURITY_HEADERS,
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
    };

    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.gif') {
      headers['Cache-Control'] = 'public, max-age=86400, immutable';
    } else if (ext === '.html' || ext === '.json') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    } else {
      headers['Cache-Control'] = 'public, max-age=3600';
    }

    res.writeHead(200, headers);
    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
