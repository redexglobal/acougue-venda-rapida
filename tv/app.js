
import { desenhar, decodificar, padrao, promoValida, telaFechada, coresDe } from '../painel.js';
const tela = document.getElementById('tela'), aviso = document.getElementById('aviso');
let atual = null, assinatura = '';

// de onde vem a configuração: 1) ?loja= na nuvem  2) #c= no link  3) o que o editor salvou neste aparelho
// 26/11/2026: link curto fixo da TV (o endereço fica igual na TV, sem redirecionar): /tv1, /tv2
const ATALHOS = { '/tv1': ['M6nlpVJr', '1'], '/tv2': ['M6nlpVJr', '2'], '/md1': ['M6nlpVJr', '1'], '/md2': ['M6nlpVJr', '2'] };
const HOSTS = { 'painel-carnes-md1.vercel.app': ['M6nlpVJr', '1'], 'painel-carnes-md2.vercel.app': ['M6nlpVJr', '2'], 'painelcasadecarnesmd1.vercel.app': ['M6nlpVJr', '1'], 'painelcasadecarnesmd2.vercel.app': ['M6nlpVJr', '2'] };
const atalho = ATALHOS[location.pathname.replace(/\/+$/, '').toLowerCase()] || (location.pathname.length <= 1 ? HOSTS[location.hostname] : null);
const q = new URLSearchParams(location.search), conta = q.get('conta') || (atalho && atalho[0]), numTela = q.get('tela') || (atalho && atalho[1]) || '1';
let faixaConta = null, ultimaBoa = null, versao = 0, rapido = false;
// 24/11/2026: TV de cliente pagante (?conta=): preços da nuvem + situação do pagamento
async function ler(){
  if (conta){
    try {
      const r = await fetch(`/api/conta?acao=tv&id=${encodeURIComponent(conta)}&tela=${encodeURIComponent(numTela)}${ultimaBoa ? '&desde=' + versao : ''}`, { cache: 'no-store' });
      const j = await r.json();
      if (r.status === 503){ mostrarAviso('O sistema está sendo ligado. Volte em instantes.'); return null; }
      if (!r.ok){ mostrarAviso(j.erro || 'Painel não encontrado. Confira o link com a Kairós.'); return null; }
      if (j.situacao.codigo === 'suspensa'){ suspensa(j); return null; }
      faixaConta = j.situacao.codigo === 'carencia' ? `Pagamento em atraso: o painel desliga em ${j.situacao.horas} h. Regularize com a Kairós.` : null;
      rapido = !!j.rapido;
      if (j.igual && ultimaBoa) return ultimaBoa;   // nada mudou: não baixa o painel de novo
      versao = j.cfgEm || 0;
      ultimaBoa = { ...padrao(), loja: j.loja, ...(j.cfg || {}) };   // o que faltar vem do padrão: nunca tela em branco
      return ultimaBoa;
    } catch { return ultimaBoa; }   // sem internet: continua mostrando os últimos preços
  }
  const h = location.hash.match(/c=([^&]+)/);
  if (h){ try { return await decodificar(h[1]); } catch { mostrarAviso('Este link da TV está incompleto. Copie de novo no editor do dono.'); return null; } }
  try { const s = localStorage.getItem('acougue-painel'); if (s) return JSON.parse(s); } catch {}
  return padrao();
}
function mostrarAviso(t){ aviso.textContent = t; aviso.style.display = 'grid'; }
function suspensa(j){
  atual?.parar(); assinatura = 'suspensa';
  tela.innerHTML = `<div style="position:absolute;top:0;right:0;bottom:0;left:0;background:#111;color:#eee;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2vh;text-align:center;padding:5vw;font-family:Archivo,system-ui,sans-serif">
    <div style="font-weight:900;font-size:6vh">${esc(j.loja || '')}</div><div style="font-size:3.4vh;opacity:.85">Painel suspenso por falta de pagamento.</div>
    <div style="font-size:2.6vh;opacity:.65">Assim que o pagamento for confirmado, os preços voltam sozinhos.</div></div>`;
}
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// fora do horário de exibição a TV mostra só o nome da loja
function pintarFechada(cfg){
  const cor = coresDe(cfg);
  tela.innerHTML = `<div style="position:absolute;top:0;right:0;bottom:0;left:0;background:${cor.fundo};color:${cor.texto};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;text-align:center;padding:40px;font-family:Archivo,system-ui,sans-serif">
    <div style="font-weight:900;font-size:min(7vh,5.5vw);text-transform:uppercase;letter-spacing:.06em;line-height:1.1">${esc(cfg.loja)}</div>
    ${cfg.horario ? `<div style="font-size:min(3vh,2.4vw);opacity:.85">${esc(cfg.horario)}</div>` : ''}
    ${cfg.horarioTV?.de ? `<div style="font-weight:800;font-size:min(3.4vh,2.8vw);color:${cor.destaque}">Abrimos às ${esc(cfg.horarioTV.de)}</div>` : ''}
  </div>`;
}
async function atualizar(){
  const cfg = await ler(); if (!cfg) return;
  const ass = JSON.stringify(cfg) + (faixaConta || '') + promoValida(cfg) + '|' + telaFechada(cfg) + '|' + new Date().getDay();   // virar o dia liga/desliga a promoção e a tela fechada
  if (ass === assinatura) return;                      // só redesenha quando algo mudou
  assinatura = ass; aviso.style.display = 'none';
  const cr = document.getElementById('carencia'); cr.style.display = faixaConta ? 'block' : 'none'; cr.textContent = faixaConta || '';
  atual?.parar(); atual = null;
  if (telaFechada(cfg)) return void pintarFechada(cfg);
  atual = desenhar(tela, cfg, { forcarMovimento: true });
}
atualizar();
// 26/11/2026: tempo real. Dono com o editor aberto = confere a cada 2,5 s; senão a cada 20 s.
(function ciclo(){ setTimeout(async () => { try { await atualizar(); } catch {} ciclo(); }, conta && rapido ? 2500 : 20000); })();
addEventListener('storage', e => { if (e.key === 'acougue-painel') atualizar(); });   // mesmo aparelho: na hora
addEventListener('hashchange', atualizar);
addEventListener('resize', () => { assinatura = ''; atualizar(); });
if (window.self !== window.top) document.getElementById('cheia').hidden = true;   // dentro do painel admin
document.getElementById('cheia').onclick = () => document.documentElement.requestFullscreen?.();
// tela não apaga sozinha
async function acordado(){ try { await navigator.wakeLock?.request('screen'); } catch {} }
acordado(); document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && acordado());

// ---------- 24/11/2026: fila de senhas (cfg.fila.loja) ----------
import('../fila-cliente.js').then(({ api, aoMudar, anunciar }) => {
  let ultimoTs = 0, cfgFila = null, timer = null, somLiberado = false;
  const sTV = document.getElementById('senhaTV'), faixa = document.getElementById('faixaSenha'), somBtn = document.getElementById('somAviso');
  somBtn.onclick = () => { somLiberado = true; somBtn.hidden = true; try { speechSynthesis.speak(new SpeechSynthesisUtterance('')); } catch {} };
  async function cfgAtual(){ try { return await ler(); } catch { return null; } }
  async function checar(){
    const cfg = await cfgAtual(); const lojaFila = cfg?.fila?.loja;
    if (!lojaFila || cfg.fila.ativa === false){ faixa.classList.remove('tem'); document.body.classList.remove('comFila'); return; }
    if (!cfgFila){ const c = coresDe(cfg); document.documentElement.style.setProperty('--dz', c.destaque); document.documentElement.style.setProperty('--fd', c.fundo); document.documentElement.style.setProperty('--tx', c.texto); cfgFila = lojaFila; }
    const r = await api('estado', { loja: lojaFila });
    if (!r.ok || !r.atual){ faixa.classList.remove('tem'); document.body.classList.remove('comFila'); return; }
    document.getElementById('fNum').textContent = r.atual.senha; document.getElementById('fNome').textContent = r.atual.nome || '';
    document.getElementById('fUlt').textContent = (r.ultimos || []).length ? 'antes: ' + r.ultimos.slice(0, 3).map(u => u.senha).join(' · ') : '';
    if (!faixa.classList.contains('tem')){ faixa.classList.add('tem'); document.body.classList.add('comFila'); window.dispatchEvent(new Event('resize')); }
    if (r.atual.ts > ultimoTs){
      const primeira = ultimoTs === 0; ultimoTs = r.atual.ts;
      if (primeira && Date.now() - r.atual.ts > 15000) return;      // ao abrir a TV não repete uma chamada antiga
      document.getElementById('sNum').textContent = r.atual.senha; document.getElementById('sNome').textContent = r.atual.nome || (r.atual.tipo === 'papel' ? 'senha de papel' : '');
      sTV.classList.add('on'); clearTimeout(timer); timer = setTimeout(() => sTV.classList.remove('on'), 9000);
      if (somLiberado || navigator.userActivation?.hasBeenActive) anunciar(r.atual, { voz: cfg.fila.voz !== false }); else somBtn.hidden = false;
    }
  }
  checar(); setInterval(checar, 2500); aoMudar(checar);
});
