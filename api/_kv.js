// Armazenamento comum da fila e das contas (24/11/2026).
// Upstash Redis via REST (variáveis que a integração da Vercel cria). Sem elas: memória, só para teste local.
export const URL_KV = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_KV = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const semNuvemNaVercel = () => !URL_KV && !!process.env.VERCEL;
const mem = globalThis.__filaMem || (globalThis.__filaMem = new Map());
export async function redis(...cmd){
  if (!URL_KV){                       // memória (teste local)
    const [op, k, ...a] = cmd; const v = mem.get(k);
    switch (op){
      case 'GET': return v ?? null;
      case 'SET': mem.set(k, a[0]); return 'OK';
      case 'DEL': mem.delete(k); return 1;
      case 'INCR': { const n = (+v || 0) + 1; mem.set(k, String(n)); return n; }
      case 'EXPIRE': return 1;
      case 'RPUSH': { const l = v || []; l.push(...a); mem.set(k, l); return l.length; }
      case 'LPUSH': { const l = v || []; l.unshift(...a.reverse()); mem.set(k, l); return l.length; }
      case 'LTRIM': { const l = v || []; mem.set(k, l.slice(+a[0], +a[1] + 1)); return 'OK'; }
      case 'LRANGE': { const l = v || []; const fim = +a[1] < 0 ? l.length + +a[1] + 1 : +a[1] + 1; return l.slice(+a[0], fim); }
      case 'LREM': { const l = (v || []).filter(x => x !== a[1]); mem.set(k, l); return 1; }
      case 'LPOP': { const l = v || []; const x = l.shift(); mem.set(k, l); return x ?? null; }
      default: throw new Error('comando ' + op);
    }
  }
  const r = await fetch(URL_KV, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN_KV}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json(); if (j.error) throw new Error(j.error); return j.result;
}
export const getJ = async key => { const v = await redis('GET', key); return v ? JSON.parse(v) : null; };
export const setJ = (key, v, ttl) => ttl ? redis('SET', key, JSON.stringify(v), 'EX', String(ttl)) : redis('SET', key, JSON.stringify(v));
export async function corpo(req){
  if (req.body && typeof req.body === 'object') return req.body;
  let s = ''; for await (const c of req) s += c; try { return JSON.parse(s || '{}'); } catch { return {}; }
}
export function responder(res, status, dados){
  res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(dados));
}
