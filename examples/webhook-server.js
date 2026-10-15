import http from 'node:http';
import { verifyWebhookSignature } from '../src/index.js';

const secret = process.env.PLUSVIBE_WEBHOOK_SECRET || '';

http.createServer(async (req, res) => {
  if (req.method !== 'POST') { res.writeHead(405).end(); return; }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks);

  if (secret) {
    const signature = req.headers.signature || '';
    const valid = await verifyWebhookSignature(raw, String(signature), secret);
    if (!valid) { res.writeHead(401).end('invalid signature'); return; }
  }

  const event = JSON.parse(raw.toString('utf8'));
  console.log(event);
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
}).listen(3000);
