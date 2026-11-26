// Motor do painel de carnes (21/11/2026). Desenha a tela da TV a partir de uma configuração (cfg).
// Usado pela TV (tv/) e pela prévia do editor do dono (dono/). Sem dependências.

export const TEMAS = {
  brasa:   { nome: 'Brasa',    fundo: '#170d0a', texto: '#fff1ea', destaque: '#ff6a3d', preco: '#ffd166', faixa: '#2a1410' },
  creme:   { nome: 'Creme',    fundo: '#f6efe6', texto: '#2b1610', destaque: '#b3341f', preco: '#7a1c0c', faixa: '#eadccb' },
  campo:   { nome: 'Campo',    fundo: '#0f2219', texto: '#e8f7ee', destaque: '#7bd389', preco: '#ffe08a', faixa: '#173327' },
  noite:   { nome: 'Noite',    fundo: '#0b0f17', texto: '#eef2f8', destaque: '#4fd1c5', preco: '#ffffff', faixa: '#141b27' },
  classico:{ nome: 'Clássico', fundo: '#7d0f0f', texto: '#fff8ec', destaque: '#ffd84d', preco: '#ffffff', faixa: '#5e0a0a' },
  quadro:  { nome: 'Quadro-negro', fundo: '#1f2420', texto: '#f3f1e7', destaque: '#f2c14e', preco: '#f3f1e7', faixa: '#2a302b' },
};

export const ARRANJOS = {
  'promo-esq':   'Promoção à esquerda, preços à direita',
  'promo-dir':   'Preços à esquerda, promoção à direita',
  'promo-cima':  'Promoção em cima, preços embaixo',
  'promo-baixo': 'Preços em cima, promoção embaixo',
  'so-precos':   'Só a tabela de preços',
  'so-promo':    'Só a promoção (tela cheia)',
};
export const MOVIMENTOS = {
  parado: 'Parado (cabe tudo)', cima: 'Rolando para cima', baixo: 'Rolando para baixo',
  lado: 'Deslizando para o lado', paginas: 'Páginas que trocam',
};
import { ESTILOS, CATEGORIAS_TODAS } from './modelos.js';
export const CATEGORIAS = CATEGORIAS_TODAS;   // Bovinos, Premium, Suínos, Aves, Cordeiro, Linguiças, Embutidos, Peixes, Exóticos, Kits, Outros

export function padrao(){
  return {
    versao: 1,
    loja: 'Casa de Carnes do Bairro', subtitulo: 'Carne fresca todo dia',
    tema: 'brasa', cores: null,                       // cores: null = usa o tema; objeto = personalizado
    logo: null, logoPos: { canto: 'se', x: 3, y: 4 }, logoTam: 14,   // x/y em % da tela; canto: se|sd|ie|id
    relogio: true, data: true, horario: 'Seg a Sáb 7h às 19h · Dom 7h às 12h',
    horarioTV: { ativa: false, de: '07:00', ate: '22:00' },   // fora disso a TV mostra a tela fechada
    promo: { ativa: true, titulo: 'Promoção da semana', foto: null, item: 'Alcatra', preco: 49.9, unidade: 'kg', validade: 'até sábado' },
    arranjo: 'promo-esq', divisao: 42,                // divisao = % da promoção
    orientacao: 'paisagem',
    movimento: 'cima', velocidade: 40, tamFonte: 100, agruparCategoria: true, faixaRodape: 'Aceitamos Pix · Peça pelo WhatsApp',
    itens: [
      { n: 'Picanha', c: 'Bovinos', p: 79.9, u: 'kg', of: false, esg: false },
      { n: 'Alcatra', c: 'Bovinos', p: 49.9, u: 'kg', of: true, esg: false },
      { n: 'Contrafilé', c: 'Bovinos', p: 52.9, u: 'kg', of: false, esg: false },
      { n: 'Fraldinha', c: 'Bovinos', p: 46.9, u: 'kg', of: false, esg: false },
      { n: 'Costela', c: 'Bovinos', p: 29.9, u: 'kg', of: false, esg: false },
      { n: 'Acém', c: 'Bovinos', p: 34.9, u: 'kg', of: false, esg: false },
      { n: 'Patinho moído', c: 'Bovinos', p: 39.9, u: 'kg', of: false, esg: false },
      { n: 'Lombo suíno', c: 'Suínos', p: 26.9, u: 'kg', of: false, esg: false },
      { n: 'Bisteca suína', c: 'Suínos', p: 22.9, u: 'kg', of: false, esg: false },
      { n: 'Pernil', c: 'Suínos', p: 21.9, u: 'kg', of: false, esg: false },
      { n: 'Coxa e sobrecoxa', c: 'Aves', p: 14.9, u: 'kg', of: false, esg: false },
      { n: 'Peito de frango', c: 'Aves', p: 19.9, u: 'kg', of: false, esg: false },
      { n: 'Linguiça toscana', c: 'Linguiças', p: 24.9, u: 'kg', of: false, esg: false },
      { n: 'Kit churrasco 2 kg', c: 'Kits e combos', p: 109.9, u: 'un', of: false, esg: false },
    ],
  };
}

export function promoValida(cfg, agora = new Date()){
  const p = cfg.promo || {}; if (!p.ativa) return false;
  // data LOCAL do aparelho (UTC erraria no Brasil: o dia mudaria 3 h depois)
  const dd = n => String(n).padStart(2, '0');
  const local = x => `${x.getFullYear()}-${dd(x.getMonth() + 1)}-${dd(x.getDate())}`;
  const hoje = local(agora);
  return (!p.inicio || hoje >= p.inicio) && (!p.fim || hoje <= p.fim);
}

// hora local em minutos
const emMinutos = x => x.getHours() * 60 + x.getMinutes();

// TV liga/desliga no horário: fora da janela [de, ate) a TV mostra a tela fechada.
// se ate < de a janela atravessa a meia-noite (ex.: 20:00 a 02:00)
export function telaFechada(cfg, agora = new Date()){
  const h = cfg.horarioTV || {}; if (!h.ativa || !h.de || !h.ate) return false;
  const [dh, dm] = String(h.de).split(':').map(Number);
  const [ah, am] = String(h.ate).split(':').map(Number);
  const de = dh * 60 + (dm || 0), ate = ah * 60 + (am || 0);
  if (de === ate) return false;
  const m = emMinutos(agora);
  return de < ate ? (m < de || m >= ate) : (m >= ate && m < de);
}
export const coresDe = cfg => ({ ...TEMAS[cfg.tema] || TEMAS.brasa, ...(cfg.cores || {}) });
const brl = v => Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// contraste WCAG entre duas cores hex
export function contraste(a, b){
  const lum = h => { const n = parseInt(h.replace('#', ''), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05);
}

const CSS = `
.pn{position:relative;width:100%;height:100%;overflow:hidden;font-family:Archivo,Inter,system-ui,sans-serif;container-type:size}
.pn *{box-sizing:border-box}
.pn .topo{position:absolute;left:0;right:0;top:0;height:13cqh;display:flex;align-items:center;justify-content:center;flex-direction:column;z-index:2}
.pn .loja{font-weight:900;font-size:min(6cqh,6.2cqw);max-width:70cqw;text-align:center;text-transform:uppercase;letter-spacing:.06em;line-height:1}
.pn .sub{font-size:min(2.3cqh,3.4cqw);opacity:.85;margin-top:.6cqh}
.pn .hora{position:absolute;top:3cqh;font-weight:800;font-size:min(3.6cqh,4cqw);text-align:right;line-height:1.1}
.pn .hora small{display:block;font-size:.56em;font-weight:600;opacity:.85}
.pn .corpo{position:absolute;left:2cqw;right:2cqw;top:14cqh;bottom:8cqh;display:flex;gap:1.6cqw}
.pn .corpo.col{flex-direction:column;gap:1.6cqh}
.pn .promo{position:relative;border-radius:2cqh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;min-width:0;min-height:0}
.pn .promo .foto{position:absolute;inset:0;background-size:cover;background-position:center}
.pn .promo .semfoto{position:absolute;inset:0;display:grid;place-items:center;font-size:2.4cqh;opacity:.6;text-align:center;padding:4cqh}
.pn .promo .cx{position:relative;padding:2.6cqh 2.4cqh;background:linear-gradient(0deg,rgba(0,0,0,.82),rgba(0,0,0,.35) 70%,transparent);color:#fff}
.pn .promo .rot{display:inline-block;font-weight:900;font-size:2.4cqh;text-transform:uppercase;letter-spacing:.08em;padding:.5cqh 1.4cqh;border-radius:1cqh}
.pn .promo .pit{font-weight:900;font-size:min(6cqh,9cqw);line-height:1;margin-top:1cqh}
.pn .promo .pr{font-weight:900;font-size:min(9cqh,13cqw);line-height:1}
.pn .promo .pr small{font-size:3cqh}
.pn .promo .val{font-size:2.3cqh;opacity:.9;margin-top:.6cqh}
.pn .lista{position:relative;flex:1;min-width:0;min-height:0;overflow:hidden;border-radius:2cqh}
.pn .trilho{position:absolute;left:0;right:0;top:0;will-change:transform}
.pn .trilho.lado{display:flex;height:100%;align-items:center;gap:2cqw;width:max-content}
.pn .cat{font-weight:900;text-transform:uppercase;letter-spacing:.1em;padding:1.2cqh 1.4cqh .4cqh}
.pn .li{display:flex;align-items:baseline;justify-content:space-between;gap:1.4cqh;padding:.9cqh 1.4cqh;margin:.5cqh 0;border-radius:1.2cqh;font-weight:800}
.pn .li .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pn .li .pp{font-weight:900;white-space:nowrap}
.pn .li .pp small{font-size:.5em;font-weight:700;opacity:.8;margin-left:.3em}
.pn .li.of{outline:.35cqh solid}
.pn .li .nmw{display:flex;flex-wrap:wrap;align-items:center;column-gap:.6em;min-width:0}
.pn .li .selo{font-size:.42em;font-weight:900;padding:.18em .55em;border-radius:.4em;letter-spacing:.04em;white-space:nowrap;flex:none}
.pn .li .desc{flex-basis:100%;font-size:.5em;font-weight:600;opacity:.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:.1em}
.pn .li.combo{align-items:center}
.pn .li.esg{opacity:.45}.pn .li.esg .pp{text-decoration:line-through}
.pn .trilho.lado .li{margin:0;padding:2cqh 2.4cqh;flex-direction:column;align-items:flex-start;min-width:28cqw}
.pn .rod{position:absolute;left:0;right:0;bottom:0;height:7cqh;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:min(2.8cqh,2.9cqw);gap:3cqw;flex-wrap:wrap;text-align:center;padding:0 2cqw;line-height:1.2}
.pn .logo{position:absolute;z-index:3;cursor:default;touch-action:none}
.pn .logo.topo-l img{max-height:min(9cqh,calc(13cqh - var(--ly,4cqh)));width:auto;max-width:100%}
.pn .logo img{width:100%;height:auto;display:block;filter:drop-shadow(0 .6cqh 1.4cqh rgba(0,0,0,.35))}
.pn.editavel .hora{cursor:grab;outline:.3cqh dashed rgba(255,255,255,.45);outline-offset:.4cqh;border-radius:.6cqh}
.pn.editavel .logo{cursor:grab;outline:.3cqh dashed rgba(255,255,255,.55);outline-offset:.4cqh}
.pn .div{position:absolute;z-index:4;background:rgba(255,255,255,.0)}
.pn.editavel .div{background:rgba(255,255,255,.25);border-radius:1cqh}
.pn.editavel .div:hover{background:rgba(255,255,255,.55)}

/* ---- 23/11/2026: estilos, halo, moldura, colunas, fotos ---- */
.pn{--d:#ff6a3d;--ft:Archivo;--fx:Archivo}
.pn .loja{font-family:var(--ft)}
.pn .li,.pn .cat,.pn .rod,.pn .hora,.pn .promo .cx{font-family:var(--fx)}
.pn .promo .pit,.pn .promo .pr{font-family:var(--ft)}
.pn .li .dots{display:none;flex:1;border-bottom:.35cqh dotted currentColor;opacity:.45;margin:0 .4em .25em;min-width:.4em}
.pn .li .ft{width:1.9em;height:1.9em;border-radius:.4em;object-fit:cover;flex:none;margin-right:.5em;align-self:center}
.pn .li .esq{display:flex;align-items:center;min-width:0;flex:0 1 auto}
.pn .li .pp{flex:none}
.pn .li .dots{flex:1 1 0}
.pn.comFotos .li{align-items:center}
.pn .trilho.col2,.pn .trilho .col2{column-count:2;column-gap:1.4cqw}.pn .trilho.col3,.pn .trilho .col3{column-count:3;column-gap:1.2cqw}
.pn .trilho .col2 .li,.pn .trilho .col3 .li,.pn .trilho.col2 .li,.pn .trilho.col3 .li,.pn .trilho.col2 .cat,.pn .trilho.col3 .cat,.pn .trilho .col2 .cat,.pn .trilho .col3 .cat{break-inside:avoid}
/* forma das linhas */
.pn.l-pontilhado .li{background:none!important;border-radius:0;padding:.55cqh 1.2cqh;margin:.2cqh 0}
.pn.l-pontilhado .li .dots{display:block}
.pn.l-tabela .li{border-radius:0;margin:0;padding:.75cqh 1.4cqh;border-bottom:.15cqh solid rgba(127,127,127,.25)}
.pn.l-tabela .li:nth-child(even){background:rgba(127,127,127,.08)!important}
.pn.l-tabela .li:nth-child(odd){background:none!important}
.pn.l-etiqueta .li{background:rgba(255,255,255,.1)!important;border-radius:.6cqh}
.pn.l-etiqueta .li .pp{color:var(--dt)!important;background:var(--d);padding:.1em .45em;border-radius:.2em;transform:rotate(-2deg);box-shadow:.25cqh .35cqh 0 rgba(0,0,0,.35)}
.pn.l-lousa .li{background:none!important;padding:.5cqh 1.2cqh;margin:.15cqh 0}
.pn.l-lousa .li .dots{display:block;border-bottom-style:dashed}
.pn.l-lousa .li .nm,.pn.l-lousa .li .pp{text-shadow:0 0 .08em currentColor;letter-spacing:.02em}
.pn.l-brilho .li{background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.03) 55%,rgba(0,0,0,.12))!important;border:.15cqh solid rgba(255,255,255,.12);position:relative;overflow:hidden}
.pn.l-brilho .li::before{content:'';position:absolute;top:0;bottom:0;width:30%;left:-40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent);animation:pnBrilho 5.5s infinite}
.pn.l-brilho .li:nth-child(3n)::before{animation-delay:1.8s}.pn.l-brilho .li:nth-child(3n+1)::before{animation-delay:3.6s}
@keyframes pnBrilho{0%{left:-40%}35%,100%{left:120%}}
/* halo (brilho em volta) liga/desliga */
.pn.halo .loja{text-shadow:0 0 .35em var(--d),0 0 1.1em var(--d)}
.pn.halo .pp{text-shadow:0 0 .45em currentColor}
.pn.halo .li.of{box-shadow:0 0 2cqh var(--d),inset 0 0 1cqh var(--d)}
.pn.halo .promo{box-shadow:0 0 3cqh -0.5cqh var(--d)}
/* moldura */
.pn.moldura::before{content:'';position:absolute;inset:1.1cqh;border:.45cqh double var(--d);border-radius:1.4cqh;pointer-events:none;z-index:5;opacity:.85}
.pn.moldura::after{content:'';position:absolute;inset:2.1cqh;border:.15cqh solid var(--d);border-radius:1cqh;pointer-events:none;z-index:5;opacity:.35}
/* texturas */
.pn.t-madeira{background-image:repeating-linear-gradient(92deg,rgba(0,0,0,.18) 0 .3cqw,transparent .3cqw 2.2cqw,rgba(255,255,255,.035) 2.2cqw 2.5cqw,transparent 2.5cqw 5.6cqw),repeating-linear-gradient(180deg,rgba(0,0,0,.28) 0 .35cqh,transparent .35cqh 16cqh)}
.pn.t-lousa{background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.07),transparent 60%),radial-gradient(ellipse at 80% 90%,rgba(255,255,255,.05),transparent 55%)}
.pn.t-azulejo{background-image:linear-gradient(90deg,rgba(0,0,0,.07) .2cqh,transparent .2cqh),linear-gradient(0deg,rgba(0,0,0,.07) .2cqh,transparent .2cqh);background-size:9cqh 9cqh}
.pn.t-kraft{background-image:radial-gradient(rgba(0,0,0,.06) 1px,transparent 1px),radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px);background-size:5px 5px,7px 7px;background-position:0 0,2px 3px}
.pn.t-linho{background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.025) 0 2px,transparent 2px 6px)}
.pn.t-marmore{background-image:linear-gradient(115deg,transparent 40%,rgba(120,110,95,.12) 41%,transparent 44%),linear-gradient(160deg,transparent 60%,rgba(120,110,95,.09) 61%,transparent 63%),linear-gradient(35deg,transparent 20%,rgba(120,110,95,.07) 21%,transparent 23%),radial-gradient(ellipse at 70% 30%,rgba(0,0,0,.04),transparent 60%)}
.pn.t-grade{background-image:linear-gradient(rgba(255,43,214,.08) .15cqh,transparent .15cqh),linear-gradient(90deg,rgba(77,252,255,.07) .15cqh,transparent .15cqh);background-size:6cqh 6cqh}
.pn.t-brasa{background-image:radial-gradient(ellipse at 50% 120%,rgba(255,90,31,.45),transparent 60%),radial-gradient(ellipse at 10% 110%,rgba(255,160,40,.25),transparent 45%)}
/* foto da loja no fundo */
.pn .fundoLoja{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0}
.pn .fundoLoja::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.72),rgba(0,0,0,.55) 40%,rgba(0,0,0,.78))}
.pn .topo,.pn .corpo,.pn .rod,.pn .hora{z-index:2}
.pn.comFundo .lista{background:rgba(0,0,0,.35)!important;backdrop-filter:blur(2px)}
@media (prefers-reduced-motion:reduce){.pn.l-brilho .li::before{animation:none;display:none}}
/* ---- 24/11/2026: Natal, madeira nobre, tecnológico, cromo ---- */
.pn.t-natal .topo{background:radial-gradient(circle at 12px 9px,#ff4d4d 0 .5cqh,transparent .6cqh) 0 .6cqh/5cqh 2cqh repeat-x,radial-gradient(circle at 37px 13px,#ffd34d 0 .5cqh,transparent .6cqh) 0 .6cqh/5cqh 2cqh repeat-x,radial-gradient(circle at 25px 11px,#4dff88 0 .5cqh,transparent .6cqh) 0 .6cqh/5cqh 2cqh repeat-x}
.pn.t-natal .topo::before{content:'';position:absolute;left:0;right:0;top:.4cqh;height:1.6cqh;border-bottom:.25cqh solid rgba(40,90,40,.9);border-radius:0 0 50% 50%/0 0 100% 100%;opacity:.8}
.pn.t-natal{background-image:radial-gradient(rgba(255,255,255,.55) .18cqh,transparent .22cqh),radial-gradient(rgba(255,255,255,.35) .12cqh,transparent .16cqh);background-size:9cqh 9cqh,5cqh 5cqh;background-position:0 0,2cqh 3cqh;animation:pnNeve 18s linear infinite}
@keyframes pnNeve{to{background-position:0 9cqh,2cqh 8cqh}}
.pn.t-madeira2{background-image:repeating-linear-gradient(90deg,rgba(255,220,170,.06) 0 .25cqw,transparent .25cqw 3.2cqw),repeating-linear-gradient(90deg,rgba(0,0,0,.14) 0 .12cqw,transparent .12cqw 1.3cqw),linear-gradient(180deg,rgba(255,255,255,.05),rgba(0,0,0,.25))}
.pn.t-holo{background-image:radial-gradient(ellipse at 15% 0%,rgba(80,160,255,.28),transparent 55%),radial-gradient(ellipse at 90% 100%,rgba(200,80,255,.22),transparent 55%),repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 .12cqh,transparent .12cqh .5cqh)}
.pn.t-cromo{background-image:linear-gradient(160deg,rgba(255,255,255,.08),transparent 35%,rgba(255,255,255,.05) 60%,transparent 80%)}
.pn.l-vidro .li{background:rgba(255,255,255,.06)!important;border:.15cqh solid rgba(120,200,255,.35);box-shadow:inset 0 0 1.4cqh rgba(120,200,255,.12);backdrop-filter:blur(3px)}
.pn.l-vidro .li .pp{letter-spacing:.03em}
.pn.l-cromo .li{background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.02) 50%,rgba(0,0,0,.25))!important;border:.15cqh solid rgba(255,255,255,.18)}
.pn.l-cromo .li .pp,.pn.l-cromo .loja{background:linear-gradient(180deg,#ffffff 0%,#d9dde3 35%,#8a929c 55%,#f4f6f8 75%,#b9c0c8 100%);-webkit-background-clip:text;background-clip:text;color:transparent!important}
.pn.l-natal .li{background:rgba(255,255,255,.06)!important;border-left:.6cqh solid var(--d);border-radius:.6cqh}
@media (prefers-reduced-motion:reduce){.pn.t-natal{animation:none}}

`;
let cssPosto = false;
function porCss(){ if (cssPosto) return; const s = document.createElement('style'); s.textContent = CSS; document.head.append(s); cssPosto = true; }

// desenha; devolve { parar() } para cancelar animações

// ---------- 24/11/2026: selos de destaque, combos e painel da semana ----------
export const SELOS = {
  oferta:   { txt: 'OFERTA',          bg: null,      fg: null },        // usa a cor de destaque do modelo
  natal:    { txt: 'OFERTA DE NATAL', bg: '#b3261e', fg: '#fff6d6', borda: '#e8c35a' },
  ceia:     { txt: 'PARA A CEIA',     bg: '#14532d', fg: '#fff6d6', borda: '#e8c35a' },
  combo:    { txt: 'COMBO',           bg: '#1d4ed8', fg: '#ffffff' },
  novidade: { txt: 'NOVIDADE',        bg: '#7c3aed', fg: '#ffffff' },
  maisVendido: { txt: 'MAIS VENDIDO', bg: '#e8b04b', fg: '#1a1208' },
  ultimas:  { txt: 'ÚLTIMAS PEÇAS',   bg: '#dc2626', fg: '#ffffff' },
  leveMais: { txt: 'LEVE 2 PAGUE MENOS', bg: '#16a34a', fg: '#ffffff' },
  fimSemana:{ txt: 'SÓ NO FIM DE SEMANA', bg: '#ea580c', fg: '#ffffff' },
  premium:  { txt: 'PREMIUM',         bg: '#111111', fg: '#e8c35a', borda: '#e8c35a' },
  queima:   { txt: 'QUEIMA TOTAL',    bg: '#facc15', fg: '#111111' },
};
export const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
// configuração do dia: preço e promoção da semana planejados com antecedência
export function doDia(cfg, agora = new Date()){
  const d = agora.getDay();
  const itens = (cfg.itens || []).map(it => {
    const p = it.dias?.[d];
    return p > 0 ? { ...it, p } : (it.diasOcultos?.includes(d) ? null : it);
  }).filter(Boolean);
  const promo = cfg.promoDias?.[d]?.ativa ? { ...cfg.promo, ...cfg.promoDias[d] } : cfg.promo;
  return { ...cfg, itens, promo };
}

export function desenhar(alvo, cfgBase, opcoes = {}){
  porCss();
  const cfg = opcoes.dia === false ? cfgBase : doDia(cfgBase, opcoes.agora || new Date());
  const cor = coresDe(cfg), escala = (cfg.tamFonte || 100) / 100;
  const vertical = cfg.orientacao === 'retrato';
  alvo.innerHTML = '';
  const est = ESTILOS[cfg.estilo] || ESTILOS.padrao;
  const pn = document.createElement('div');
  pn.className = ['pn', opcoes.editavel && 'editavel', 'l-' + est.linha, est.textura && 't-' + est.textura, cfg.halo && 'halo', cfg.moldura && 'moldura',
    cfg.fotoLojaFundo && cfg.fotoLoja && 'comFundo', cfg.fotosItens && 'comFotos'].filter(Boolean).join(' ');
  pn.style.backgroundColor = cor.fundo; pn.style.color = cor.texto;
  pn.style.setProperty('--d', cor.destaque); pn.style.setProperty('--dt', contraste(cor.destaque, '#000000') > contraste(cor.destaque, '#ffffff') ? '#111' : '#fff'); pn.style.setProperty('--ft', `'${est.tit}'`); pn.style.setProperty('--fx', `'${est.txt}'`);
  if (cfg.fotoLojaFundo && cfg.fotoLoja){ const fl = document.createElement('div'); fl.className = 'fundoLoja'; fl.style.backgroundImage = `url('${cfg.fotoLoja}')`; pn.append(fl); }
  pn.setAttribute('role', 'img'); pn.setAttribute('aria-label', `Painel de preços de ${cfg.loja}`);
  alvo.append(pn);

  // topo: nome + relógio/horário
  const topo = document.createElement('div'); topo.className = 'topo';
  topo.innerHTML = `<div class="loja">${esc(cfg.loja)}</div>${cfg.subtitulo ? `<div class="sub">${esc(cfg.subtitulo)}</div>` : ''}`;
  pn.append(topo);
  const hora = document.createElement('div'); hora.className = 'hora';
  hora.style[cfg.logoPos?.canto?.endsWith('d') && (cfg.logoPos.canto[0] === 's') ? 'left' : 'right'] = '2.4cqw';
  pn.append(hora);
  // 26/11/2026: relógio com posição e tamanho livres (o dono arrasta na prévia)
  if (cfg.horaTam && cfg.horaTam !== 100) hora.style.fontSize = `calc(min(3.6cqh,4cqw) * ${cfg.horaTam / 100})`;
  if (cfg.horaPos){ hora.style.left = cfg.horaPos.x + '%'; hora.style.top = cfg.horaPos.y + '%'; hora.style.right = 'auto'; hora.style.textAlign = 'center'; }
  if (opcoes.editavel && (cfg.relogio || cfg.data)) arrastarLivre(pn, hora, p => { cfgBase.horaPos = cfg.horaPos = p; }, opcoes.mudou);
  const tic = () => {
    const d = new Date();
    hora.innerHTML = `${cfg.relogio ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}${cfg.data ? `<small>${d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</small>` : ''}`;
  };
  tic(); const relogio = setInterval(tic, 15000);

  // corpo: promoção + lista, conforme o arranjo
  const corpo = document.createElement('div'); corpo.className = 'corpo';
  const arr = cfg.arranjo || 'promo-esq';
  const coluna = vertical || arr === 'promo-cima' || arr === 'promo-baixo';
  if (coluna) corpo.classList.add('col');
  pn.append(corpo);
  const temPromo = (opcoes.editavel ? cfg.promo?.ativa : promoValida(cfg)) && arr !== 'so-precos';
  const temLista = arr !== 'so-promo' || !temPromo;
  let promoEl = null, listaEl = null;
  if (temPromo){
    promoEl = document.createElement('div'); promoEl.className = 'promo';
    promoEl.style.background = cor.faixa;
    const p = cfg.promo;
    promoEl.innerHTML = `${p.foto ? `<div class="foto" style="background-image:url('${p.foto}')"></div>` : `<div class="semfoto">${opcoes.editavel ? 'Toque em "Foto da promoção" para colocar a foto da semana' : ''}</div>`}
      <div class="cx"><span class="rot" style="background:${cor.destaque};color:${contraste(cor.destaque, '#000000') > contraste(cor.destaque, '#ffffff') ? '#000' : '#fff'}">${esc(p.titulo || 'Promoção')}</span>
      ${p.item ? `<div class="pit">${esc(p.item)}</div>` : ''}
      ${p.preco ? `<div class="pr">R$ ${brl(p.preco)}<small>/${esc(p.unidade || 'kg')}</small></div>` : ''}
      ${p.validade ? `<div class="val">${esc(p.validade)}</div>` : ''}</div>`;
    promoEl.style.flex = temLista ? `0 0 ${cfg.divisao || 42}%` : '1';
  }
  if (temLista){
    listaEl = document.createElement('div'); listaEl.className = 'lista';
    listaEl.style.background = cor.faixa;
  }
  const ordem = (arr === 'promo-dir' || arr === 'promo-baixo') ? [listaEl, promoEl] : [promoEl, listaEl];
  ordem.filter(Boolean).forEach(e => corpo.append(e));

  // itens
  let anim = null;
  if (listaEl){
    const lado = cfg.movimento === 'lado';
    const nCol = lado ? 1 : Math.min(3, Math.max(1, cfg.colunas || 1));
    const trilho = document.createElement('div'); trilho.className = 'trilho' + (lado ? ' lado' : '') + (nCol > 1 ? ' col' + nCol : '');
    // mais colunas (e a promoção dividindo a largura) = letra menor, para o nome do corte caber inteiro
    const fator = nCol === 1 ? 1 : temPromo && !coluna ? (nCol === 2 ? .7 : .56) : (nCol === 2 ? .86 : .74);
    const fs = (vertical ? 3.2 : 3.6) * escala * fator;
    const seloDe = it => { const k = it.selo || (it.of ? 'oferta' : ''); if (!k) return ''; const z = SELOS[k] || { txt: String(k).toUpperCase().slice(0, 22) };
      const bg = z.bg || cor.destaque, fg = z.fg || (contraste(cor.destaque, '#000000') > contraste(cor.destaque, '#ffffff') ? '#000' : '#fff');
      return `<span class="selo" style="background:${bg};color:${fg};${z.borda ? `box-shadow:0 0 0 .12em ${z.borda} inset;` : ''}">${esc(z.txt)}</span>`; };
    const linha = it => `<div class="li${it.of || it.selo ? ' of' : ''}${it.esg ? ' esg' : ''}${it.desc ? ' combo' : ''}" style="font-size:${fs}cqh;background:rgba(255,255,255,.05);outline-color:${(SELOS[it.selo]?.bg) || cor.destaque}">
        <span class="esq">${cfg.fotosItens && it.foto ? `<img class="ft" src="${it.foto}" alt="">` : ''}<span class="nmw"><span class="nm">${esc(it.n)}</span>${seloDe(it)}${it.desc ? `<span class="desc">${esc(it.desc)}</span>` : ''}</span></span><span class="dots"></span><span class="pp" style="color:${cor.preco}">${!it.esg && it.de > it.p ? `<s style="font-size:.55em;opacity:.7;margin-right:.4em">de R$ ${brl(it.de)}</s>` : ''}${it.esg ? 'esgotado' : (it.de > it.p ? 'por ' : '') + 'R$ ' + brl(it.p)}<small>/${esc(it.u || 'kg')}</small></span></div>`;
    const itens = (cfg.itens || []).filter(i => i.n);
    let html = '';
    if (cfg.agruparCategoria && !lado){
      [...CATEGORIAS, ...new Set(itens.map(i => i.c).filter(c => !CATEGORIAS.includes(c)))].forEach(c => { const g = itens.filter(i => (i.c || 'Outros') === c); if (g.length) html += `<div class="cat" style="color:${cor.destaque};font-size:${2.4 * escala}cqh">${c}</div>` + g.map(linha).join(''); });
    } else html = itens.map(linha).join('');
    trilho.innerHTML = html;
    listaEl.append(trilho);
    anim = movimentar(listaEl, trilho, cfg, opcoes);
  }

  // rodapé
  if (cfg.faixaRodape || cfg.horario || cfg.atualizado){
    const rod = document.createElement('div'); rod.className = 'rod'; rod.style.background = cor.faixa;
    const at = cfg.atualizado ? new Date(cfg.atualizado) : null;
    rod.innerHTML = [cfg.horario && `<span>${esc(cfg.horario)}</span>`, cfg.faixaRodape && `<span style="color:${cor.destaque}">${esc(cfg.faixaRodape)}</span>`,
      at && `<span style="opacity:.75;font-size:.8em">Preços atualizados em ${at.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>`].filter(Boolean).join('');
    pn.append(rod);
  }

  // logo: canto + ajuste fino arrastando
  if (cfg.logo){
    const lg = document.createElement('div'); lg.className = 'logo';
    lg.innerHTML = `<img src="${cfg.logo}" alt="Logo de ${esc(cfg.loja)}">`;
    lg.style.width = (cfg.logoTam || 14) + '%';
    posicionarLogo(lg, cfg.logoPos);
    // logo em cima fica dentro da faixa do título: nunca cobre um preço (Decreto 5.903, art. 9º)
    lg.style.setProperty('--ly', (cfg.logoPos?.y ?? 4) + 'cqh');
    lg.classList.toggle('topo-l', (cfg.logoPos?.canto || 'se')[0] === 's' && (cfg.logoPos?.y ?? 4) < 12);
    pn.append(lg);
    if (opcoes.editavel) arrastarLogo(pn, lg, cfgBase, opcoes.mudou);   // grava no cfg do dono, não na cópia do dia
  }

  // divisória arrastável entre promoção e lista
  if (opcoes.editavel && promoEl && listaEl){
    const dv = document.createElement('div'); dv.className = 'div'; dv.title = 'Arraste para mudar o tamanho da promoção';
    pn.append(dv);
    const pos = () => { const r = corpo.getBoundingClientRect(), b = pn.getBoundingClientRect(), pr = promoEl.getBoundingClientRect();
      if (coluna){ const y = (ordem[0] === promoEl ? pr.bottom : pr.top) - b.top; Object.assign(dv.style, { left: (r.left - b.left) + 'px', width: r.width + 'px', top: (y - 6) + 'px', height: '12px', cursor: 'row-resize' }); }
      else { const x = (ordem[0] === promoEl ? pr.right : pr.left) - b.left; Object.assign(dv.style, { top: (r.top - b.top) + 'px', height: r.height + 'px', left: (x - 6) + 'px', width: '12px', cursor: 'col-resize' }); } };
    requestAnimationFrame(pos);
    dv.addEventListener('pointerdown', e => {
      dv.setPointerCapture(e.pointerId);
      const r = corpo.getBoundingClientRect();
      const mover = ev => {
        let f = coluna ? (ev.clientY - r.top) / r.height : (ev.clientX - r.left) / r.width;
        if (ordem[0] !== promoEl) f = 1 - f;
        cfgBase.divisao = cfg.divisao = Math.round(Math.min(75, Math.max(20, f * 100)));
        promoEl.style.flex = `0 0 ${cfg.divisao}%`; pos();
      };
      const soltar = () => { dv.removeEventListener('pointermove', mover); opcoes.mudou?.(); };
      dv.addEventListener('pointermove', mover); dv.addEventListener('pointerup', soltar, { once: true });
    });
  }

  return { parar(){ clearInterval(relogio); anim?.parar(); } };
}

function arrastarLivre(pn, el, salvar, mudou){
  el.addEventListener('pointerdown', e => {
    e.preventDefault(); el.setPointerCapture(e.pointerId);
    const b = pn.getBoundingClientRect(), r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    const mover = ev => {
      const x = Math.min(100 - r.width / b.width * 100, Math.max(0, (ev.clientX - dx - b.left) / b.width * 100));
      const y = Math.min(100 - r.height / b.height * 100, Math.max(0, (ev.clientY - dy - b.top) / b.height * 100));
      const p = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
      el.style.left = p.x + '%'; el.style.top = p.y + '%'; el.style.right = 'auto'; salvar(p);
    };
    const soltar = () => { el.removeEventListener('pointermove', mover); mudou?.(); };
    el.addEventListener('pointermove', mover); el.addEventListener('pointerup', soltar, { once: true });
  });
}

function posicionarLogo(lg, pos = {}){
  const c = pos.canto || 'se', x = (pos.x ?? 3) + '%', y = (pos.y ?? 4) + '%';
  lg.style.left = lg.style.right = lg.style.top = lg.style.bottom = '';
  lg.style[c[1] === 'e' ? 'left' : 'right'] = x;
  lg.style[c[0] === 's' ? 'top' : 'bottom'] = y;
}

function arrastarLogo(pn, lg, cfg, mudou){
  lg.addEventListener('pointerdown', e => {
    e.preventDefault(); lg.setPointerCapture(e.pointerId); lg.style.cursor = 'grabbing';
    const b = pn.getBoundingClientRect(), l = lg.getBoundingClientRect(), dx = e.clientX - l.left, dy = e.clientY - l.top;
    const mover = ev => {
      const left = (ev.clientX - dx - b.left) / b.width * 100, top = (ev.clientY - dy - b.top) / b.height * 100;
      const w = l.width / b.width * 100, h = l.height / b.height * 100;
      const canto = (top + h / 2 < 50 ? 's' : 'i') + (left + w / 2 < 50 ? 'e' : 'd');  // o canto mais perto vira a âncora
      const x = canto[1] === 'e' ? left : 100 - left - w, y = canto[0] === 's' ? top : 100 - top - h;
      cfg.logoPos = { canto, x: Math.round(Math.max(0, x) * 10) / 10, y: Math.round(Math.max(0, y) * 10) / 10 };
      posicionarLogo(lg, cfg.logoPos);
    };
    const soltar = () => { lg.removeEventListener('pointermove', mover); lg.style.cursor = ''; mudou?.(); };
    lg.addEventListener('pointermove', mover); lg.addEventListener('pointerup', soltar, { once: true });
  });
}

// rolagem dos preços: cima, baixo, lado, páginas, parado
function movimentar(caixa, trilho, cfg, opcoes){
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mov = calmo && !opcoes.forcarMovimento ? 'paginas' : (cfg.movimento || 'cima');
  if (mov === 'parado') return null;
  const v = Math.max(10, cfg.velocidade || 40);   // px por segundo
  let raf, t0 = performance.now(), pagina = 0, ultimaTroca = t0;
  const lado = mov === 'lado';
  // duplica o conteúdo para a volta ser contínua
  const original = trilho.innerHTML;
  const precisa = () => lado ? trilho.scrollWidth > caixa.clientWidth : trilho.scrollHeight > caixa.clientHeight;
  // com colunas, cada cópia leva as próprias colunas (senão a cópia cai na 2ª coluna e a lista aparece repetida lado a lado)
  if (mov !== 'paginas' && precisa()){
    const cc = [...trilho.classList].find(c => /^col\d$/.test(c));
    const bloco = h => cc ? `<div class="${cc}">${h}</div>` : h;
    if (cc) trilho.classList.remove(cc);
    trilho.innerHTML = bloco(original) + '<div style="height:4cqh;width:4cqw"></div>' + bloco(original);
  }
  const passo = now => {
    const dt = (now - t0) / 1000;
    if (mov === 'paginas'){
      const alt = caixa.clientHeight, total = trilho.scrollHeight, nPag = Math.max(1, Math.ceil(total / alt));
      if (now - ultimaTroca > 8000){ pagina = (pagina + 1) % nPag; ultimaTroca = now; trilho.style.transition = 'transform .8s'; trilho.style.transform = `translateY(${-pagina * alt}px)`; }
    } else if (precisa() || trilho.innerHTML !== original){
      const meio = lado ? trilho.scrollWidth / 2 : trilho.scrollHeight / 2;
      const d = (dt * v) % meio;
      trilho.style.transform = lado ? `translateX(${-d}px)` : mov === 'baixo' ? `translateY(${d - meio}px)` : `translateY(${-d}px)`;
    }
    raf = requestAnimationFrame(passo);
  };
  raf = requestAnimationFrame(passo);
  return { parar(){ cancelAnimationFrame(raf); } };
}

// ---------- link da TV: a configuração inteira vai comprimida no endereço ----------
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export async function codificar(cfg){
  const dados = new TextEncoder().encode(JSON.stringify(cfg));
  if (!window.CompressionStream) return 'j' + b64url(dados);
  const s = new Blob([dados]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const buf = await new Response(s).arrayBuffer();
  let bin = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 8192) bin += String.fromCharCode(...u.subarray(i, i + 8192));
  return 'z' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export async function decodificar(txt){
  const tipo = txt[0], b = atob(txt.slice(1).replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(b, c => c.charCodeAt(0));
  if (tipo === 'j') return JSON.parse(new TextDecoder().decode(bytes));
  const s = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return JSON.parse(await new Response(s).text());
}

// imagem enviada pelo dono -> WebP pequeno (cabe no link da TV)
export function reduzirImagem(arquivo, lado = 900, qualidade = .78){
  return new Promise((ok, erro) => {
    const img = new Image(), url = URL.createObjectURL(arquivo);
    img.onload = () => {
      const k = Math.min(1, lado / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      ok(c.toDataURL('image/webp', qualidade));
    };
    img.onerror = () => erro(new Error('Não consegui abrir essa imagem.'));
    img.src = url;
  });
}
