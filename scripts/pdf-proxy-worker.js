// Cloudflare Worker: adds CORS + Range support in front of the textbook hosts so pdf.js can render in-app.
// Deploy: `npx wrangler deploy scripts/pdf-proxy-worker.js --name bba-pdf-proxy`, then build the site with
// VITE_PDF_PROXY=https://bba-pdf-proxy.<you>.workers.dev
const ALLOW = new Set(['edu4mm.com', 'books.learnbig.net', 'resources.mmoe.myanmarexam.org'])
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Allow-Headers': 'Range', 'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges' }
export default {
  async fetch(req) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
    const u = new URL(req.url)
    const [, host, ...rest] = u.pathname.split('/')
    if (!ALLOW.has(host)) return new Response('host not allowed', { status: 403, headers: CORS })
    const upstream = `${host.startsWith('resources.') ? 'http' : 'https'}://${host}/${rest.join('/')}${u.search}`
    const headers = new Headers()
    const range = req.headers.get('Range')
    if (range) headers.set('Range', range)
    const res = await fetch(upstream, { method: req.method, headers, cf: { cacheEverything: true, cacheTtl: 86400 } })
    const out = new Headers(res.headers)
    for (const [k, v] of Object.entries(CORS)) out.set(k, v)
    return new Response(res.body, { status: res.status, headers: out })
  },
}
