// Cliente da fila de senhas: fala com /api/fila. Se a nuvem ainda não estiver ligada (resposta 503),
// cai no MODO DEMONSTRAÇÃO: a fila mora neste navegador (localStorage) e as abas se falam por BroadcastChannel.
// Serve para mostrar ao cliente com celular, balcão e TV abertos no mesmo aparelho; não serve para a loja de verdade.
let modoDemo = false;
const canal = 'BroadcastChannel' in window ? new BroadcastChannel('fila-demo') : null;
const ouvintes = new Set();
canal && (canal.onmessage = () => ouvintes.forEach(f => f()));
export const emDemo = () => modoDemo;
export const aoMudar = f => { ouvintes.add(f); return () => ouvintes.delete(f); };

export async function api(acao, dados = {}, metodo){
  const m = metodo || (['estado', 'minha', 'painel'].includes(acao) ? 'GET' : 'POST');
  if (!modoDemo){
    try {
      const url = '/api/fila' + (m === 'GET' ? '?' + new URLSearchParams({ acao, ...dados }) : '');
      const r = await fetch(url, m === 'GET' ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ acao, ...dados }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 503 && j.semNuvem) modoDemo = true;
      else if (r.status === 404 && !j.erro) modoDemo = true;                 // site estático sem a função (teste local simples)
      else return { ok: r.ok, status: r.status, ...j };
    } catch { modoDemo = true; }
  }
  return demo(acao, dados);
}

// ---------- modo demonstração (mesma regra do servidor) ----------
const ler = () => { try { return JSON.parse(localStorage.getItem('fila-demo')) || {}; } catch { return {}; } };
const gravar = d => { localStorage.setItem('fila-demo', JSON.stringify(d)); canal?.postMessage(1); };
const rid = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => b.toString(36).padStart(2, '0')).join('').slice(0, n * 2);
const curto = nome => { const p = nome.split(' ').filter(Boolean); return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : (p[0] || ''); };
const rotulo = t => t.tipo === 'papel' ? String(t.n).padStart(3, '0') : 'Q' + String(t.n).padStart(3, '0');
function demo(acao, b){
  const d = ler();
  const L = d[b.loja] || null;
  const pub = L => ({ ok: true, loja: L.nome, atual: L.atual, ultimos: L.chamados.slice(L.atual ? 1 : 0, 5), esperando: L.espera.length, modo: 'demonstracao' });
  const chamar = t => { const reg = { senha: rotulo(t), nome: t.nome ? curto(t.nome) : '', tipo: t.tipo, ts: Date.now(), id: t.id || null };
    L.atual = reg; L.chamados.unshift(reg); L.chamados = L.chamados.slice(0, 10); if (t.id && L.t[t.id]) L.t[t.id].status = 'chamado'; return reg; };
  const fim = (x) => { gravar(d); return { ok: true, ...x }; };
  if (acao === 'criar'){
    const loja = 'demo-' + rid(3), chave = rid(6);
    d[loja] = { nome: b.nome || 'Loja', chave, seq: 0, papel: 0, espera: [], chamados: [], atual: null, t: {}, pausada: false };
    return fim({ loja, chave, modo: 'demonstracao' });
  }
  if (!L) return { ok: false, status: 404, erro: 'Fila não encontrada neste aparelho (modo demonstração).' };
  if (acao === 'estado') return pub(L);
  if (acao === 'pegar'){
    if (L.pausada) return { ok: false, status: 423, erro: 'A fila do QR está pausada agora. Peça a senha no balcão.' };
    const nome = String(b.nome || '').replace(/[^\p{L}\p{M}' .-]/gu, '').trim().slice(0, 30);
    if (nome.length < 2) return { ok: false, status: 400, erro: 'Digite seu nome.' };
    if (!b.aceite) return { ok: false, status: 400, erro: 'Confirme que concorda em mostrar seu primeiro nome na TV.' };
    const t = { id: rid(6), n: ++L.seq, tipo: 'qr', nome, status: 'esperando', ts: Date.now(), tk: rid(6) };
    L.t[t.id] = t; L.espera.push(t.id); return fim({ id: t.id, tk: t.tk, senha: rotulo(t), nome: curto(nome) });
  }
  if (acao === 'minha'){ const t = L.t[b.id]; if (!t || t.tk !== b.tk) return { ok: false, status: 404, erro: 'Senha não encontrada.' };
    const pos = L.espera.indexOf(t.id); return { ok: true, senha: rotulo(t), nome: curto(t.nome), status: t.status, aFrente: pos < 0 ? 0 : pos, atual: L.atual }; }
  if (acao === 'desistir'){ const t = L.t[b.id]; if (!t || t.tk !== b.tk) return { ok: false, status: 404, erro: 'Senha não encontrada.' };
    L.espera = L.espera.filter(x => x !== t.id); t.status = 'saiu'; return fim({}); }
  if (b.chave !== L.chave) return { ok: false, status: 403, erro: 'Chave do balcão inválida.' };
  if (acao === 'painel') return { ...pub(L), fila: L.espera.map(id => L.t[id]).map(t => ({ id: t.id, senha: rotulo(t), nome: t.nome, ts: t.ts })), papel: L.papel, pausada: L.pausada };
  if (acao === 'proxima'){ const id = L.espera.shift(); return id ? fim({ chamado: chamar(L.t[id]) }) : fim({ chamado: null, aviso: 'Ninguém esperando pelo QR.' }); }
  if (acao === 'papel'){ let n = parseInt(b.numero, 10); if (!(n >= 0 && n <= 9999)) n = L.papel + 1; L.papel = n; return fim({ chamado: chamar({ n, tipo: 'papel' }) }); }
  if (acao === 'id'){ const t = L.t[b.id]; if (!t) return { ok: false, status: 404, erro: 'Senha não encontrada.' }; L.espera = L.espera.filter(x => x !== t.id); return fim({ chamado: chamar(t) }); }
  if (acao === 'rechamar'){ if (L.atual){ L.atual = { ...L.atual, ts: Date.now(), rechamada: true }; } return fim({ chamado: L.atual }); }
  if (acao === 'pausar'){ L.pausada = !!b.pausar; return fim({ pausada: L.pausada }); }
  if (acao === 'zerar'){ Object.assign(L, { seq: 0, papel: 0, espera: [], chamados: [], atual: null, t: {} }); return fim({}); }
  return { ok: false, status: 400, erro: 'Ação desconhecida.' };
}

// voz e som da chamada (TV e balcão)
export function anunciar(reg, { voz = true } = {}){
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[880, 0], [660, .28]].forEach(([f, t]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(.0001, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(.4, ctx.currentTime + t + .02); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + t + .26);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + .3); });
  } catch {}
  if (voz && 'speechSynthesis' in window){
    const numero = reg.senha.replace(/^Q/, '').replace(/^0+/, '') || '0';
    const u = new SpeechSynthesisUtterance(`Senha ${reg.tipo === 'qr' ? 'Q ' : ''}${numero}${reg.nome ? ', ' + reg.nome : ''}`);
    u.lang = 'pt-BR'; u.rate = .95; setTimeout(() => speechSynthesis.speak(u), 650);
  }
}
