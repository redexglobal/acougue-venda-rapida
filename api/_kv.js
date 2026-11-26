// Armazenamento comum da fila e das contas (24/11/2026).
// 26/11/2026: banco principal = Neon Postgres (integração da Vercel, DATABASE_URL), com os mesmos comandos
// de antes (GET/SET/INCR/listas) numa tabela chave-valor. Upstash fica como alternativa. Sem nenhum: memória (teste local).
import { neon } from '@neondatabase/serverless';
const URL_PG = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = URL_PG ? neon(URL_PG) : null;
export const URL_KV = URL_PG || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_KV = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const semNuvemNaVercel = () => !URL_KV && !!process.env.VERCEL;
const mem = globalThis.__filaMem || (globalThis.__filaMem = new Map());
let pronto = null;
const q = (t, p = []) => sql.query(t, p);
const VIVO = `(kv.exp is null or kv.exp > now())`;
async function pg(op, k, a){
  pronto ||= q(`create table if not exists kv (k text primary key, v jsonb not null, exp timestamptz)`)
    .then(() => q(`create index if not exists kv_exp on kv (exp) where exp is not null`));
  await pronto;
  if (Math.random() < 0.01) q(`delete from kv where exp < now()`).catch(() => {});
  const um = async (t, p) => (await q(t, p))[0];
  switch (op){
    case 'GET': { const r = await um(`select v #>> '{}' as v from kv where k = $1 and ${VIVO}`, [k]); return r ? r.v : null; }
    case 'SET': { const ex = a[1] === 'EX' ? +a[2] : null;
      await q(`insert into kv (k, v, exp) values ($1, to_jsonb($2::text), case when $3::int is null then null else now() + make_interval(secs => $3::int) end)
               on conflict (k) do update set v = excluded.v, exp = excluded.exp`, [k, String(a[0]), ex]); return 'OK'; }
    case 'DEL': { const r = await q(`delete from kv where k = $1 returning k`, [k]); return r.length; }
    case 'EXPIRE': { const r = await q(`update kv set exp = now() + make_interval(secs => $2::int) where k = $1 returning k`, [k, +a[0]]); return r.length; }
    case 'INCR': { const r = await um(`insert into kv (k, v) values ($1, '1'::jsonb) on conflict (k) do update set
        v = case when ${VIVO} then to_jsonb(((kv.v #>> '{}')::bigint + 1)::text) else '"1"'::jsonb end,
        exp = case when ${VIVO} then kv.exp else null end returning (v #>> '{}')::bigint as n`, [k]); return Number(r.n); }
    case 'RPUSH': case 'LPUSH': {
      const novos = JSON.stringify(op === 'LPUSH' ? [...a].reverse() : a);
      const junta = op === 'LPUSH' ? `excluded.v || (case when ${VIVO} then kv.v else '[]'::jsonb end)` : `(case when ${VIVO} then kv.v else '[]'::jsonb end) || excluded.v`;
      const r = await um(`insert into kv (k, v) values ($1, $2::jsonb) on conflict (k) do update set v = ${junta},
        exp = case when ${VIVO} then kv.exp else null end returning jsonb_array_length(v) as n`, [k, novos]); return Number(r.n); }
    case 'LRANGE': case 'LTRIM': {
      const r = await um(`select v from kv where k = $1 and ${VIVO}`, [k]); const l = Array.isArray(r?.v) ? r.v : [];
      const ini = +a[0] < 0 ? Math.max(0, l.length + +a[0]) : +a[0], fim = +a[1] < 0 ? l.length + +a[1] : +a[1];
      const fatia = l.slice(ini, fim + 1).map(String);
      if (op === 'LRANGE') return fatia;
      if (r) await q(`update kv set v = $2::jsonb where k = $1`, [k, JSON.stringify(fatia)]); return 'OK'; }
    case 'LREM': { const r = await um(`update kv set v = coalesce((select jsonb_agg(e order by i) from jsonb_array_elements(kv.v) with ordinality t(e, i) where e <> to_jsonb($2::text)), '[]'::jsonb)
        where k = $1 returning v`, [k, String(a[1])]); return r ? 1 : 0; }
    case 'LPOP': { const r = await um(`update kv set v = kv.v - 0 from (select k, v ->> 0 as primeiro from kv where k = $1 and ${VIVO} for update) o
        where kv.k = o.k returning o.primeiro`, [k]); return r ? r.primeiro : null; }
  }
  throw new Error('comando não suportado: ' + op);
}
export async function redis(...cmd){
  if (sql){ const [op, k, ...a] = cmd; return pg(op, k, a); }
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
