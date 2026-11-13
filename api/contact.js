const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

// Origines autorisées à appeler l'API
const ALLOWED_ORIGINS = new Set([
  'https://codeaxis.cm',
  'https://www.codeaxis.cm',
  'https://codeaxis.vercel.app',
]);

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  // Vérification d'origine (bloque les appels cross-site non autorisés)
  const origin = req.headers['origin'] || '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'forbidden_origin' });
  }
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    (req.socket && req.socket.remoteAddress) || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'too_many_requests' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'invalid_json' }); }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid_body' });

  // Honeypot : champ company rempli = bot
  if (String(body.company || '').trim()) return res.status(200).json({ ok: true });

  const name    = String(body.name    || '').trim().slice(0, 120);
  const email   = String(body.email   || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 5000);

  if (name.length < 2 || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'invalid_fields' });
  }

  const key  = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to   = process.env.CONTACT_TO || 'contact@codeaxis.cm';
  if (!key || !from) return res.status(503).json({ error: 'unconfigured' });

  const subject = 'Site CODE AXIS : ' + name.replace(/[\r\n]+/g, ' ');
  const text    = 'Nom : ' + name + '\nE-mail : ' + email + '\n\n' + message;

  try {
    // AbortSignal.timeout disponible depuis Node 18+; fallback gracieux sur Node < 18
    const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
      ? AbortSignal.timeout(10000)
      : undefined;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text }),
      signal,
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend', response.status, detail.slice(0, 400));
      return res.status(502).json({ error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    console.error('Contact endpoint', isTimeout ? 'timeout' : error);
    return res.status(isTimeout ? 504 : 502).json({
      error: isTimeout ? 'gateway_timeout' : 'send_failed',
    });
  }
};
