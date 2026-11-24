// Fila de senhas do balcão (24/11/2026).
// O cliente lê o QR, digita o nome e recebe a senha no celular; a TV chama "nome + número" um por um;
// o açougueiro chama pelo balcão, misturando com a senha de papel que já usa.
//
// Armazenamento: Upstash Redis pela API REST (KV_REST_API_URL / KV_REST_API_TOKEN, que a integração da
// Vercel cria sozinha). Sem essas variáveis usa memória: serve para teste local, NÃO para produção
// (cada servidor da Vercel teria a sua própria fila).
//
// Privacidade: guarda só o primeiro nome digitado, apaga tudo em 24 h, a TV mostra nome + inicial.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const SAL = process.env.PIN_SAL || 'sal-de-teste-local';
const DIA = 86400;

import { redis, URL_KV, corpo, responder } from './_kv.js';
const k = (loja, x) => `fila:${loja}:${x}`;
const getJ = async key => { const v = await redis('GET', key); return v ? JSON.parse(v) : null; };
const setJ = (key, v, ttl = DIA) => redis('SET', key, JSON.stringify(v), 'EX', String(ttl));

// ---------- utilidades ----------
const hash = t => createHash('sha256').update(SAL + ':' + t).digest('hex');
const igual = (a, b) => { const x = Buffer.from(a || ''), y = Buffer.from(b || ''); return x.length === y.length && timingSafeEqual(x, y); };
const limpaLoja = s => String(s || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
function limpaNome(s){
  const t = String(s || '').normalize('NFC').replace(/[^\p{L}\p{M}' .-]/gu, '').replace(/\s+/g, ' ').trim();
  return t.slice(0, 30);
}
const curto = nome => { const p = nome.split(' ').filter(Boolean); return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : (p[0] || ''); };
const rotulo = t => t.tipo === 'papel' ? String(t.n).padStart(3, '0') : 'Q' + String(t.n).padStart(3, '0');
const ip = req => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'x';


async function estadoPublico(loja){
  const cfg = await getJ(k(loja, 'cfg'));
  if (!cfg) return null;
  const [atual, ultimos, espera] = await Promise.all([getJ(k(loja, 'atual')), redis('LRANGE', k(loja, 'chamados'), '0', '4'), redis('LRANGE', k(loja, 'espera'), '0', '-1')]);
  return { loja: cfg.nome, atual, ultimos: (ultimos || []).map(x => JSON.parse(x)).slice(atual ? 1 : 0), esperando: (espera || []).length,
    modo: URL_KV ? 'nuvem' : 'memoria' };
}
async function auth(loja, chave){ const cfg = await getJ(k(loja, 'cfg')); return cfg && igual(hash(chave), cfg.chave) ? cfg : null; }
async function chamar(loja, t){
  const reg = { senha: rotulo(t), nome: t.nome ? curto(t.nome) : '', tipo: t.tipo, ts: Date.now(), id: t.id || null };
  await setJ(k(loja, 'atual'), reg);
  await redis('LPUSH', k(loja, 'chamados'), JSON.stringify(reg)); await redis('LTRIM', k(loja, 'chamados'), '0', '9');
  await redis('EXPIRE', k(loja, 'chamados'), String(DIA));
  if (t.id){ const tk = await getJ(k(loja, 't:' + t.id)); if (tk){ tk.status = 'chamado'; tk.chamadoEm = Date.now(); await setJ(k(loja, 't:' + t.id), tk); } }
  return reg;
}

export default async function handler(req, res){
  try {
    const url = new URL(req.url, 'http://x'), q = Object.fromEntries(url.searchParams);
    const b = req.method === 'POST' ? await corpo(req) : {};
    // na Vercel sem banco ligado, a fila em memória enganaria (cada servidor teria a sua): avisa o navegador
    if (!URL_KV && process.env.VERCEL) return responder(res, 503, { semNuvem: true, erro: 'Fila na nuvem ainda não ligada: usando modo demonstração neste aparelho.' });
    const acao = q.acao || b.acao, loja = limpaLoja(q.loja || b.loja);

    // ---- criar a fila de uma loja (devolve a chave do balcão UMA vez) ----
    if (acao === 'criar' && req.method === 'POST'){
      const nome = String(b.nome || '').slice(0, 40).trim(); if (!nome) return responder(res, 400, { erro: 'Informe o nome da loja.' });
      const id = (nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'loja') + '-' + randomBytes(3).toString('hex');
      const chave = randomBytes(12).toString('base64url');
      await redis('SET', k(id, 'cfg'), JSON.stringify({ nome, chave: hash(chave), criada: Date.now() }));   // sem prazo: a loja fica
      return responder(res, 200, { loja: id, chave, modo: URL_KV ? 'nuvem' : 'memoria' });
    }
    if (!loja) return responder(res, 400, { erro: 'Loja não informada.' });

    // ---- TV e celular: estado público ----
    if (acao === 'estado'){ const e = await estadoPublico(loja); return e ? responder(res, 200, e) : responder(res, 404, { erro: 'Fila não encontrada.' }); }

    // ---- cliente: pega a senha pelo QR ----
    if (acao === 'pegar' && req.method === 'POST'){
      const cfg = await getJ(k(loja, 'cfg')); if (!cfg) return responder(res, 404, { erro: 'Fila não encontrada.' });
      if (cfg.pausada) return responder(res, 423, { erro: 'A fila do QR está pausada agora. Peça a senha no balcão.' });
      const nome = limpaNome(b.nome); if (nome.length < 2) return responder(res, 400, { erro: 'Digite seu nome.' });
      if (!b.aceite) return responder(res, 400, { erro: 'Confirme que concorda em mostrar seu primeiro nome na TV.' });
      const lim = await redis('INCR', k(loja, 'ip:' + hash(ip(req)).slice(0, 16)));
      if (lim === 1) await redis('EXPIRE', k(loja, 'ip:' + hash(ip(req)).slice(0, 16)), '600');
      if (lim > 3) return responder(res, 429, { erro: 'Muitas senhas deste aparelho. Aguarde alguns minutos ou peça no balcão.' });
      const n = await redis('INCR', k(loja, 'seq')); if (n === 1) await redis('EXPIRE', k(loja, 'seq'), String(DIA));
      const id = randomBytes(8).toString('base64url'), tk = randomBytes(10).toString('base64url');
      const t = { id, n, tipo: 'qr', nome, status: 'esperando', ts: Date.now(), tk: hash(tk) };
      await setJ(k(loja, 't:' + id), t);
      await redis('RPUSH', k(loja, 'espera'), id); await redis('EXPIRE', k(loja, 'espera'), String(DIA));
      return responder(res, 200, { id, tk, senha: rotulo(t), nome: curto(nome) });
    }

    // ---- cliente: acompanha a própria senha ----
    if (acao === 'minha'){
      const tt = await getJ(k(loja, 't:' + String(q.id || '').replace(/[^A-Za-z0-9_-]/g, '')));
      if (!tt || !igual(hash(q.tk || ''), tt.tk)) return responder(res, 404, { erro: 'Senha não encontrada (vale só por hoje).' });
      const espera = await redis('LRANGE', k(loja, 'espera'), '0', '-1');
      const pos = (espera || []).indexOf(tt.id);
      return responder(res, 200, { senha: rotulo(tt), nome: curto(tt.nome), status: tt.status, aFrente: pos < 0 ? 0 : pos, atual: await getJ(k(loja, 'atual')) });
    }
    if (acao === 'desistir' && req.method === 'POST'){
      const tt = await getJ(k(loja, 't:' + String(b.id || '').replace(/[^A-Za-z0-9_-]/g, '')));
      if (!tt || !igual(hash(b.tk || ''), tt.tk)) return responder(res, 404, { erro: 'Senha não encontrada.' });
      await redis('LREM', k(loja, 'espera'), '0', tt.id); tt.status = 'saiu'; await setJ(k(loja, 't:' + tt.id), tt);
      return responder(res, 200, { ok: true });
    }

    // ---- balcão (precisa da chave) ----
    const cfg = await auth(loja, b.chave || q.chave);
    if (!cfg) return responder(res, 403, { erro: 'Chave do balcão inválida.' });

    if (acao === 'painel'){
      const ids = await redis('LRANGE', k(loja, 'espera'), '0', '-1') || [];
      const fila = (await Promise.all(ids.map(id => getJ(k(loja, 't:' + id))))).filter(Boolean).map(t => ({ id: t.id, senha: rotulo(t), nome: t.nome, ts: t.ts }));
      return responder(res, 200, { ...(await estadoPublico(loja)), fila, papel: +(await redis('GET', k(loja, 'papel')) || 0), pausada: !!cfg.pausada });
    }
    if (acao === 'proxima'){   // próxima senha do QR, na ordem de chegada
      let id; while ((id = await redis('LPOP', k(loja, 'espera')))){ const t = await getJ(k(loja, 't:' + id)); if (t && t.status === 'esperando') return responder(res, 200, { chamado: await chamar(loja, t) }); }
      return responder(res, 200, { chamado: null, aviso: 'Ninguém esperando pelo QR.' });
    }
    if (acao === 'papel'){     // senha de papel: número digitado ou o próximo da sequência
      let n = parseInt(b.numero, 10);
      if (!(n >= 0 && n <= 9999)) n = +(await redis('GET', k(loja, 'papel')) || 0) + 1;
      await redis('SET', k(loja, 'papel'), String(n), 'EX', String(DIA));
      return responder(res, 200, { chamado: await chamar(loja, { n, tipo: 'papel' }) });
    }
    if (acao === 'id'){        // chamar uma senha do QR específica (fora da ordem)
      const t = await getJ(k(loja, 't:' + String(b.id || '').replace(/[^A-Za-z0-9_-]/g, ''))); if (!t) return responder(res, 404, { erro: 'Senha não encontrada.' });
      await redis('LREM', k(loja, 'espera'), '0', t.id); return responder(res, 200, { chamado: await chamar(loja, t) });
    }
    if (acao === 'rechamar'){ const a = await getJ(k(loja, 'atual')); if (!a) return responder(res, 200, { chamado: null }); a.ts = Date.now(); a.rechamada = true; await setJ(k(loja, 'atual'), a); return responder(res, 200, { chamado: a }); }
    if (acao === 'pausar'){ cfg.pausada = !!b.pausar; await redis('SET', k(loja, 'cfg'), JSON.stringify(cfg)); return responder(res, 200, { pausada: cfg.pausada }); }
    if (acao === 'zerar'){
      for (const x of ['seq', 'espera', 'chamados', 'atual', 'papel']) await redis('DEL', k(loja, x));
      return responder(res, 200, { ok: true });
    }
    return responder(res, 400, { erro: 'Ação desconhecida.' });
  } catch (e){
    return responder(res, 500, { erro: 'A fila não respondeu agora. Use a senha de papel e tente de novo em instantes.', detalhe: String(e.message || e).slice(0, 120) });
  }
}
