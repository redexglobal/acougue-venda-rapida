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
export const HORA_FORMATOS = {
  'padrao':   '14:30 · qui., 26/11',
  'segundos': '14:30:05 (com segundos)',
  'extenso':  '14:30 · quinta-feira, 26 de novembro',
  'texto':    '14h30',
  'so-hora':  'Só a hora',
  'digital':  'Letreiro digital',
  'caixa':    'Hora numa caixa colorida',
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
.pn .topo{position:absolute;left:0;right:0;top:0;height:var(--ta,13cqh);display:flex;align-items:center;justify-content:center;flex-direction:column;z-index:2}
.pn .loja{font-weight:900;font-size:calc(min(6cqh,6.2cqw) * var(--tt,1));max-width:70cqw;text-align:center;text-transform:uppercase;letter-spacing:.06em;line-height:1}
.pn .sub{font-size:calc(min(2.3cqh,3.4cqw) * var(--tt,1));opacity:.85;margin-top:.6cqh}
.pn .hora{position:absolute;top:3cqh;font-weight:800;font-size:min(3.6cqh,4cqw);text-align:right;line-height:1.1}
.pn .hora small{display:block;font-size:.56em;font-weight:600;opacity:.85}
.pn .hora{z-index:4}
.pn .hora .frase{font-size:1.9cqh;font-weight:600;font-style:italic;max-width:30cqw;margin-top:.8cqh;line-height:1.25;opacity:.95;transition:opacity .6s;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 .2cqh .6cqh rgba(0,0,0,.6)}
.pn .hora.hf-digital .hh{font-family:'Courier New',ui-monospace,monospace;font-weight:900;letter-spacing:.08em;color:#ff4a3d;text-shadow:0 0 .8cqh #ff4a3d,0 0 2cqh rgba(255,74,61,.6);background:rgba(0,0,0,.55);padding:.2em .4em;border-radius:.25em;display:inline-block}
.pn .hora.hf-caixa .hh{background:var(--d);color:var(--dt);padding:.15em .45em;border-radius:.3em;display:inline-block}
.pn .hora.hf-extenso small{text-transform:capitalize}
.pn .li-logo{display:flex;justify-content:center;align-items:center;padding:1.2cqh 0;margin:.5cqh 0}
.pn .li-logo img{height:12cqh;width:auto;max-width:80%;object-fit:contain;filter:drop-shadow(0 .6cqh 1.4cqh rgba(0,0,0,.45))}
.pn .trilho.lado .li-logo{padding:0 2cqw}
.pn .nv-neve{position:absolute;inset:0;pointer-events:none;z-index:5;overflow:hidden}
.pn .nv-neve i{position:absolute;left:0;right:0;top:-100cqh;height:200cqh;background-image:radial-gradient(rgba(255,255,255,.9) .22cqh,transparent .3cqh),radial-gradient(rgba(255,255,255,.6) .15cqh,transparent .2cqh);background-size:11cqh 11cqh,6cqh 7cqh;background-position:0 0,3cqh 2cqh;animation:nvCai 22s linear infinite}
.pn .nv-neve i+i{background-size:17cqh 15cqh,9cqh 10cqh;opacity:.7;animation-duration:34s}
@keyframes nvCai{to{transform:translateY(100cqh)}}
.pn .nv-luzes{position:absolute;left:0;right:0;top:0;height:3cqh;display:flex;justify-content:space-around;align-items:flex-start;pointer-events:none;z-index:5;border-top:.3cqh solid #1e4d2b}
.pn .nv-luzes b{width:1.1cqh;height:1.7cqh;border-radius:50% 50% 45% 45%;background:var(--c);box-shadow:0 0 1.2cqh var(--c);margin-top:.5cqh;animation:nvPisca 1.6s ease-in-out infinite}
@keyframes nvPisca{50%{opacity:.35;box-shadow:none}}
.pn.nv-borda::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;border:1.1cqh solid transparent;border-image:repeating-linear-gradient(45deg,#c81e1e 0 2cqh,#fff 2cqh 4cqh,#1f7a3a 4cqh 6cqh,#fff 6cqh 8cqh) 12}
.pn .nv-estrelas{position:absolute;inset:0;pointer-events:none;z-index:1}
.pn .nv-estrelas b{position:absolute;width:1.2cqh;height:1.2cqh;background:#ffe08a;clip-path:polygon(50% 0,61% 38%,100% 50%,61% 62%,50% 100%,39% 62%,0 50%,39% 38%);animation:nvPisca 2.4s ease-in-out infinite}
.pn .nv-bolas{position:absolute;left:0;right:0;top:0;height:0;pointer-events:none;z-index:5}
.pn .nv-bolas b{position:absolute;top:0;width:.25cqh;height:var(--h);background:rgba(255,255,255,.6)}
.pn .nv-bolas b::after{content:'';position:absolute;left:50%;bottom:-3.4cqh;transform:translateX(-50%);width:3cqh;height:3cqh;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.85) 0 .5cqh,var(--c) 1.4cqh);box-shadow:0 .4cqh 1cqh rgba(0,0,0,.4)}
.pn .nv-faixa{position:absolute;left:0;right:0;height:6cqh;display:flex;align-items:center;justify-content:center;z-index:3;color:#fff8e6;font-weight:900;font-size:calc(min(3cqh,3.2cqw) * var(--rt,1));text-align:center;padding:0 3cqw;border-top:.4cqh solid #e8c35a;border-bottom:.4cqh solid #e8c35a;text-shadow:0 .2cqh .5cqh rgba(0,0,0,.5)}
.pn .nv-faixa span{transition:opacity .6s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media (prefers-reduced-motion:reduce){.pn .nv-neve i,.pn .nv-luzes b,.pn .nv-estrelas b{animation:none}}
.pn .corpo{position:absolute;left:2cqw;right:2cqw;top:calc(var(--ta,13cqh) + 1cqh);bottom:calc(var(--ra,7cqh) + 1cqh);display:flex;gap:1.6cqw}
.pn .corpo.col{flex-direction:column;gap:1.6cqh}
.pn .promo{position:relative;border-radius:2cqh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;min-width:0;min-height:0}
.pn .promo .foto{position:absolute;inset:0;background-size:cover;background-position:center}
.pn .promo .semfoto{position:absolute;inset:0;display:grid;place-items:center;font-size:2.4cqh;opacity:.6;text-align:center;padding:4cqh}
.pn .promo .cx{position:relative;padding:2.6cqh 2.4cqh;background:linear-gradient(0deg,rgba(0,0,0,.82),rgba(0,0,0,.35) 70%,transparent);color:#fff}
.pn .promo .rot{display:inline-block;font-weight:900;font-size:calc(2.4cqh * var(--pt,1));text-transform:uppercase;letter-spacing:.08em;padding:.5cqh 1.4cqh;border-radius:1cqh}
.pn .promo .pit{font-weight:900;font-size:calc(min(6cqh,9cqw) * var(--pt,1));line-height:1;margin-top:1cqh}
.pn .promo .pr{font-weight:900;font-size:calc(min(9cqh,13cqw) * var(--pt,1));line-height:1}
.pn .promo .pr small{font-size:calc(3cqh * var(--pt,1))}
.pn .promo .val{font-size:calc(2.3cqh * var(--pt,1));opacity:.9;margin-top:.6cqh}
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
.pn .rod{position:absolute;left:0;right:0;bottom:0;height:var(--ra,7cqh);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:calc(min(2.8cqh,2.9cqw) * var(--rt,1));gap:3cqw;flex-wrap:wrap;text-align:center;padding:0 2cqw;line-height:1.2}
.pn .logo{position:absolute;z-index:3;cursor:default;touch-action:none}
.pn .logo.topo-l img{max-height:min(9cqh,calc(var(--ta,13cqh) - var(--ly,4cqh) - .4cqh))}
.pn.topoAuto .logo.topo-l img{max-height:calc(var(--ta,13cqh) - var(--ly,4cqh) - .4cqh);width:auto;max-width:100%}
.pn .logo img{width:100%;height:auto;display:block;filter:drop-shadow(0 .6cqh 1.4cqh rgba(0,0,0,.35))}
.pn.editavel .li,.pn.editavel .promo,.pn.editavel .topo .loja,.pn.editavel .rod,.pn.editavel .nv-faixa{cursor:pointer}.pn.editavel .li:hover{outline:.3cqh solid #f2b630!important}
.pn.editavel .hora{cursor:grab;outline:.3cqh dashed rgba(255,255,255,.45);outline-offset:.4cqh;border-radius:.6cqh}
.pn.editavel .logo{cursor:grab;outline:.3cqh dashed rgba(255,255,255,.55);outline-offset:.4cqh}
.pn .div{position:absolute;z-index:4;background:rgba(255,255,255,.0)}
.pn.editavel .div{background:rgba(255,255,255,.25);border-radius:1cqh}
.pn.editavel .div:hover{background:rgba(255,255,255,.55)}

/* 26/11/2026: bordas arrastáveis do topo e do rodapé (só no editor) */
.pn .borda{position:absolute;left:0;right:0;height:1.6cqh;z-index:7;cursor:row-resize;touch-action:none;display:flex;justify-content:center;align-items:center}
.pn .borda::before{content:'';width:12cqw;height:.7cqh;border-radius:1cqh;background:#f2b630;box-shadow:0 0 0 .25cqh rgba(0,0,0,.5);opacity:.85}
.pn .borda:hover::before{opacity:1;background:#fff}
.pn .borda .vl{position:absolute;left:calc(50% + 7cqw);background:#111;color:#fff;font:700 1.7cqh system-ui,sans-serif;padding:.2cqh .7cqh;border-radius:.6cqh;opacity:0;pointer-events:none;white-space:nowrap}
.pn .borda:hover .vl,.pn .borda.ativa .vl{opacity:1}
/* 26/11/2026: seta de tamanho de cada bloco (só no editor) */
.pn .alca-tam{position:absolute;z-index:6;width:4.2cqh;height:4.2cqh;min-width:22px;min-height:22px;padding:0;border-radius:50%;border:.25cqh solid #fff;background:#f2b630;color:#111;font:900 2.6cqh/1 system-ui,sans-serif;display:grid;place-items:center;cursor:nwse-resize;touch-action:none;box-shadow:0 .4cqh 1.2cqh rgba(0,0,0,.5);transform:translate(-50%,-50%)}
.pn .alca-tam:hover,.pn .alca-tam:focus-visible{background:#fff;outline:.3cqh solid #f2b630}
.pn .alca-tam .vl{position:absolute;top:110%;left:50%;transform:translateX(-50%);background:#111;color:#fff;font-size:1.8cqh;padding:.3cqh .8cqh;border-radius:.6cqh;white-space:nowrap;pointer-events:none;opacity:0}
.pn .alca-tam.ativa .vl,.pn .alca-tam:hover .vl{opacity:1}

/* ---- 23/11/2026: estilos, halo, moldura, colunas, fotos ---- */
.pn{--d:#ff6a3d;--ft:Archivo;--fx:Archivo}
.pn .loja{font-family:var(--ft)}
.pn .li,.pn .cat,.pn .rod,.pn .hora,.pn .promo .cx{font-family:var(--fx)}
.pn .promo .pit,.pn .promo .pr{font-family:var(--ft)}
.pn .li .dots{display:none;flex:1;border-bottom:.35cqh dotted currentColor;opacity:.45;margin:0 .4em .25em;min-width:.4em}
.pn .li .ft{width:calc(1.9em * var(--fz,1));height:calc(1.9em * var(--fz,1));border-radius:.4em;object-fit:cover;flex:none;margin-right:.5em;align-self:center}
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
  if (cfg.topoAlt) pn.style.setProperty('--ta', cfg.topoAlt + 'cqh'); if (cfg.rodAlt) pn.style.setProperty('--ra', cfg.rodAlt + 'cqh');
  [['--tt', 'tituloTam'], ['--pt', 'promoTam'], ['--rt', 'rodTam'], ['--fz', 'fotoTam']].forEach(([v, k]) => { if (cfg[k] && cfg[k] !== 100) pn.style.setProperty(v, cfg[k] / 100); });
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
  // 26/11/2026: jeitos de escrever a hora + frase (bíblica ou da loja) passando embaixo do relógio
  const fmt = HORA_FORMATOS[cfg.horaFormato] ? cfg.horaFormato : 'padrao';
  if (fmt !== 'padrao') hora.classList.add('hf-' + fmt);
  hora.innerHTML = '<div class="hr"></div>';
  const hr = hora.firstChild;
  const tic = () => {
    const d = new Date();
    const h = fmt === 'segundos' ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : fmt === 'texto' ? `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`
      : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dt = fmt === 'extenso' ? d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
      : fmt === 'so-hora' ? '' : d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
    hr.innerHTML = `${cfg.relogio ? `<span class="hh">${h}</span>` : ''}${cfg.data && dt ? `<small>${dt}</small>` : ''}`;
  };
  tic(); const relogio = setInterval(tic, fmt === 'segundos' ? 1000 : 15000);
  let trocaFrase = null;
  const frases = cfg.frases?.ativa ? (cfg.frases.lista || []).map(f => String(f || '').trim()).filter(Boolean) : [];
  if (frases.length){
    const fr = document.createElement('div'); fr.className = 'frase'; hora.append(fr);
    let k = Math.floor(Date.now() / 1000 / Math.max(5, cfg.frases.tempo || 12)) % frases.length;
    fr.textContent = frases[k];
    if (frases.length > 1) trocaFrase = setInterval(() => { fr.style.opacity = 0; setTimeout(() => { k = (k + 1) % frases.length; fr.textContent = frases[k]; fr.style.opacity = 1; }, 600); }, Math.max(5, cfg.frases.tempo || 12) * 1000);
  }

  // corpo: promoção + lista, conforme o arranjo
  const corpo = document.createElement('div'); corpo.className = 'corpo';
  const arr = cfg.arranjo || 'promo-esq';
  const coluna = vertical || arr === 'promo-cima' || arr === 'promo-baixo';
  if (coluna) corpo.classList.add('col');
  pn.append(corpo);
  // 26/11/2026: Natal por cima de qualquer modelo (o dono escolhe os enfeites) + faixa de mensagem
  const nt = cfg.natal?.ativo ? cfg.natal : null;
  const temRod = !!(cfg.faixaRodape || cfg.horario || cfg.atualizado);
  const msgs = nt && nt.faixa !== false ? String(nt.mensagem || 'Feliz Natal! Obrigado pela confiança de todo o ano.').split('|').map(x => x.trim()).filter(Boolean) : [];
  let trocaMsg = null;
  if (nt){
    pn.classList.add('natal-on');
    if (nt.neve !== false){ const n = document.createElement('div'); n.className = 'nv-neve'; n.innerHTML = '<i></i><i></i>'; pn.append(n); }
    if (nt.luzes !== false){ const l = document.createElement('div'); l.className = 'nv-luzes'; l.innerHTML = Array.from({ length: 28 }, (_, k) => `<b style="--c:${['#ff3b3b', '#ffd34d', '#3bff7a', '#4db8ff'][k % 4]};animation-delay:${(k % 3) * .5}s"></b>`).join(''); pn.append(l); }
    if (nt.borda) pn.classList.add('nv-borda');
    if (nt.estrelas){ const e = document.createElement('div'); e.className = 'nv-estrelas'; e.innerHTML = Array.from({ length: 14 }, (_, k) => `<b style="left:${(k * 37) % 97}%;top:${(k * 53) % 90 + 3}%;animation-delay:${(k % 5) * .7}s"></b>`).join(''); pn.append(e); }
    if (nt.enfeites !== false){ const o = document.createElement('div'); o.className = 'nv-bolas'; o.innerHTML = '<b style="left:1.2%;--c:#d92b2b;--h:6cqh"></b><b style="right:1.2%;--c:#e8c35a;--h:6cqh"></b>'; pn.append(o); }
  }
  if (msgs.length){
    corpo.style.bottom = temRod ? 'calc(var(--ra,7cqh) + 7.4cqh)' : '7.4cqh';
    const fx = document.createElement('div'); fx.className = 'nv-faixa'; fx.style.bottom = temRod ? 'var(--ra,7cqh)' : '0';
    fx.style.background = nt.corFaixa || '#b3261e'; fx.innerHTML = `<span>${esc(msgs[0])}</span>`;
    pn.append(fx);
    if (msgs.length > 1){ let k = 0; trocaMsg = setInterval(() => { const sp = fx.firstChild; sp.style.opacity = 0; setTimeout(() => { k = (k + 1) % msgs.length; sp.textContent = msgs[k]; sp.style.opacity = 1; }, 600); }, 9000); }
  }
  const temPromo = (opcoes.editavel ? cfg.promo?.ativa : promoValida(cfg)) && arr !== 'so-precos';
  const temLista = arr !== 'so-promo' || !temPromo;
  let promoEl = null, listaEl = null;
  if (temPromo){
    promoEl = document.createElement('div'); promoEl.className = 'promo';
    promoEl.style.background = cor.faixa;
    const p = cfg.promo;
    promoEl.innerHTML = `${p.foto ? `<div class="foto" style="background-image:url('${p.foto}')"></div>` : `<div class="semfoto">${opcoes.editavel ? 'Toque aqui para colocar a foto da semana' : ''}</div>`}
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
    const linha = it => `<div${opcoes.editavel ? ` data-n="${esc(it.n)}" title="Toque para editar ${esc(it.n)}"` : ''} class="li${it.of || it.selo ? ' of' : ''}${it.esg ? ' esg' : ''}${it.desc ? ' combo' : ''}" style="font-size:calc(${fs}cqh * var(--lf,1));background:rgba(255,255,255,.05);outline-color:${(SELOS[it.selo]?.bg) || cor.destaque}">
        <span class="esq">${cfg.fotosItens && it.foto ? `<img class="ft" src="${it.foto}" alt="">` : ''}<span class="nmw"><span class="nm">${esc(it.n)}</span>${seloDe(it)}${it.desc ? `<span class="desc">${esc(it.desc)}</span>` : ''}</span></span><span class="dots"></span><span class="pp" style="color:${cor.preco}">${!it.esg && it.de > it.p ? `<s style="font-size:.55em;opacity:.7;margin-right:.4em">de R$ ${brl(it.de)}</s>` : ''}${it.esg ? 'esgotado' : (it.de > it.p ? 'por ' : '') + 'R$ ' + brl(it.p)}<small>/${esc(it.u || 'kg')}</small></span></div>`;
    const itens = (cfg.itens || []).filter(i => i.n && !i.oculto);   // oculto = o dono tirou da TV sem apagar
    // 26/11/2026: logo da loja passando no meio das carnes
    const logoL = cfg.logoNaLista && (cfg.logoLista || cfg.logo);
    const cada = Math.max(3, cfg.logoListaCada || 6);
    const logoHtml = logoL ? `<div class="li-logo"><img src="${logoL}" alt=""></div>` : '';
    let html = '';
    if (cfg.agruparCategoria && !lado){
      [...CATEGORIAS, ...new Set(itens.map(i => i.c).filter(c => !CATEGORIAS.includes(c)))].forEach(c => { const g = itens.filter(i => (i.c || 'Outros') === c); if (g.length) html += `<div class="cat" style="color:${cor.destaque};font-size:${2.4 * escala}cqh">${c}</div>` + g.map(linha).join('') + logoHtml; });
    } else html = itens.map((it, n) => linha(it) + (logoHtml && (n + 1) % cada === 0 ? logoHtml : '')).join('');
    if (logoHtml && !html.includes('li-logo')) html += logoHtml;
    if (!itens.length) html = `<div class="li" style="font-size:${fs}cqh;justify-content:center;opacity:.6">${opcoes.editavel ? 'Nenhuma carne marcada para passar na TV' : ''}</div>`;
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

  // 26/11/2026: a faixa de cima cresce sozinha quando a logo ou o relógio ficam maiores (os quadros de baixo encolhem)
  if (cfg.topoAuto) pn.classList.add('topoAuto');
  // quanto a faixa de cima precisa para caber logo e relógio (em cqh)
  const precisa = () => {
    const H = pn.clientHeight; if (!H) return null; let need = 0, logo = 0, hora = 0;
    const lgEl = pn.querySelector('.logo.topo-l'), im = lgEl?.querySelector('img');
    if (im?.naturalWidth){ logo = lgEl.clientWidth * im.naturalHeight / im.naturalWidth / H * 100; need = Math.max(need, (cfg.logoPos?.y ?? 4) + logo + .6); }
    const hr = pn.querySelector('.hora');
    if (hr && (!cfg.horaPos || cfg.horaPos.y < 15)){ hora = (hr.offsetTop + hr.offsetHeight) / H * 100; need = Math.max(need, hora + .8); }
    return { need, logo, hora };
  };
  // só no editor e só depois que o dono mexeu no tamanho: a faixa cresce e o novo tamanho fica gravado (a TV usa o gravado)
  const encaixar = () => {
    if (!opcoes.editavel || !cfgBase.topoAuto) return; const m = precisa(); if (!m) return;
    if (globalThis.__topoManual && Date.now() - globalThis.__topoManual < 2000){   // o dono acabou de mudar a altura da faixa pelo controle: logo e relógio se ajustam a ela
      globalThis.__topoManual = 0; pn._manual = true; const v = cfgBase.topoAlt || 13, ly = cfg.logoPos?.y ?? 4; let mudou = false;
      if (m.logo && ly + m.logo + .6 > v + .3){ cfgBase.logoTam = Math.max(6, Math.floor((cfgBase.logoTam || 14) * Math.max(.2, (v - ly - .6) / m.logo))); mudou = true; }
      if (m.hora && m.hora + .8 > v + .3){ cfgBase.horaTam = Math.max(60, Math.floor((cfgBase.horaTam || 100) * Math.max(.3, (v - 3.8) / (m.hora - 3)))); mudou = true; }
      if (mudou) setTimeout(() => opcoes.mudou?.(), 50); return;
    }
    if (pn._manual) return;
    const atual = cfgBase.topoAlt || 13;
    if (m.need > atual + .4){ const v = Math.min(40, Math.ceil(m.need)); cfgBase.topoAlt = cfg.topoAlt = v; pn.style.setProperty('--ta', v + 'cqh'); clearTimeout(pn._salvaTopo); pn._salvaTopo = setTimeout(() => opcoes.mudou?.(), 250); }
  };
  requestAnimationFrame(encaixar); pn.querySelector('.logo img')?.addEventListener('load', encaixar);
  document.fonts?.ready?.then(encaixar);
  if (opcoes.editavel){
    const borda = (qual) => {
      const el = document.createElement('div'); el.className = 'borda'; el.innerHTML = '<span class="vl"></span>';
      const ch = qual === 'topo' ? 'topoAlt' : 'rodAlt', min = qual === 'topo' ? 8 : 4, max = qual === 'topo' ? 40 : 16, pad = qual === 'topo' ? 13 : 7;
      el.title = qual === 'topo' ? 'Arraste para aumentar ou diminuir a faixa de cima (logo, nome e relógio)' : 'Arraste para aumentar ou diminuir o rodapé';
      const pos = () => { const H = pn.clientHeight; const v = qual === 'topo' ? (cfgBase.topoAlt || pad) : (cfgBase.rodAlt || pad);
        el.style.top = qual === 'topo' ? `calc(${v}cqh - .8cqh)` : ''; el.style.bottom = qual === 'rod' ? `calc(${v}cqh - .8cqh)` : '';
        el.querySelector('.vl').textContent = (qual === 'topo' ? 'Faixa de cima ' : 'Rodapé ') + Math.round(v) + '%'; };
      el.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation(); el.setPointerCapture(e.pointerId); el.classList.add('ativa');
        const b = pn.getBoundingClientRect();
        const mover = ev => { let v = qual === 'topo' ? (ev.clientY - b.top) / b.height * 100 : (b.bottom - ev.clientY) / b.height * 100;
          v = Math.round(Math.min(max, Math.max(min, v))); cfgBase[ch] = cfg[ch] = v; if (qual === 'topo'){ cfgBase.topoAuto = cfg.topoAuto = true; pn.classList.add('topoAuto'); } pn.style.setProperty(qual === 'topo' ? '--ta' : '--ra', v + 'cqh'); pos(); };
        const soltar = () => { el.removeEventListener('pointermove', mover); el.classList.remove('ativa');
          if (qual === 'topo'){ const v = cfgBase.topoAlt, m = precisa(), ly = cfg.logoPos?.y ?? 4;
            if (m?.logo && ly + m.logo + .6 > v) cfgBase.logoTam = Math.max(6, Math.floor((cfgBase.logoTam || 14) * Math.max(.2, (v - ly - .6) / m.logo)));
            if (m?.hora && m.hora + .8 > v) cfgBase.horaTam = Math.max(60, Math.floor((cfgBase.horaTam || 100) * Math.max(.3, (v - 3.8) / (m.hora - 3)))); }
          opcoes.mudou?.(); };
        el.addEventListener('pointermove', mover); el.addEventListener('pointerup', soltar, { once: true });
      });
      pn.append(el); requestAnimationFrame(pos); setTimeout(pos, 400); return el;
    };
    borda('topo'); if (pn.querySelector('.rod')) borda('rod');
  }
  let reposAlcas = null;
  if (opcoes.editavel) reposAlcas = alcasDeTamanho(pn, cfgBase, cfg, opcoes.mudou, {
    titulo: pn.querySelector('.topo .loja'), hora: pn.querySelector('.hora'), logo: pn.querySelector('.logo'),
    promo: promoEl, lista: listaEl, rod: pn.querySelector('.rod') }, encaixar);

  return { parar(){ clearInterval(relogio); clearInterval(trocaFrase); clearInterval(trocaMsg); anim?.parar(); reposAlcas?.parar(); } };
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
      if (now - ultimaTroca > Math.max(3, cfg.pausa || 8) * 1000){ pagina = (pagina + 1) % nPag; ultimaTroca = now; trilho.style.transition = 'transform .8s'; trilho.style.transform = `translateY(${-pagina * alt}px)`; }
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

// ---- 26/11/2026: setas de tamanho. O dono arrasta a seta (ou usa as setas do teclado) e o bloco cresce ou diminui na hora ----
const TAMANHOS = {
  titulo: { chave: 'tituloTam', base: 100, min: 50, max: 200, nome: 'Tamanho do nome da loja' },
  hora:   { chave: 'horaTam',   base: 100, min: 60, max: 300, nome: 'Tamanho do relógio' },
  logo:   { chave: 'logoTam',   base: 14,  min: 6,  max: 35,  nome: 'Tamanho da logo', unid: '%' },
  promo:  { chave: 'promoTam',  base: 100, min: 50, max: 170, nome: 'Tamanho do texto da promoção' },
  lista:  { chave: 'tamFonte',  base: 100, min: 50, max: 170, nome: 'Tamanho da letra dos preços' },
  rod:    { chave: 'rodTam',    base: 100, min: 50, max: 170, nome: 'Tamanho do rodapé' },
};
export const CHAVES_TAMANHO = Object.values(TAMANHOS).map(t => t.chave).concat('fotoTam');

function alcasDeTamanho(pn, cfgBase, cfg, mudou, alvos, encaixarTopo){
  const alcas = [];
  const aplicar = {
    titulo: v => pn.style.setProperty('--tt', v / 100),
    hora: v => { alvos.hora.style.fontSize = `calc(min(3.6cqh,4cqw) * ${v / 100})`; cfgBase.topoAuto = cfg.topoAuto = true; pn.classList.add('topoAuto'); encaixarTopo?.(); },
    logo: v => { alvos.logo.style.width = v + '%'; cfgBase.topoAuto = cfg.topoAuto = true; pn.classList.add('topoAuto'); encaixarTopo?.(); },
    promo: v => pn.style.setProperty('--pt', v / 100),
    lista: (v, v0) => alvos.lista.style.setProperty('--lf', v / v0),   // ao soltar, redesenha com o tamanho certo
    rod: v => pn.style.setProperty('--rt', v / 100),
  };
  Object.entries(alvos).forEach(([k, el]) => {
    if (!el) return;
    const t = TAMANHOS[k], a = document.createElement('button');
    a.type = 'button'; a.className = 'alca-tam'; a.innerHTML = '⤡<span class="vl"></span>';
    a.title = t.nome + ': arraste a seta ou use as setas do teclado';
    a.setAttribute('aria-label', t.nome);
    const ler = () => cfgBase[t.chave] ?? t.base;
    const rotulo = v => { a.querySelector('.vl').textContent = t.unid ? `${v}${t.unid}` : `${v}%`; };
    const gravar = (v, v0) => { v = Math.round(Math.min(t.max, Math.max(t.min, v))); cfgBase[t.chave] = cfg[t.chave] = v; aplicar[k](v, v0); rotulo(v); pos(); return v; };
    const pos = () => { const b = pn.getBoundingClientRect(), r = el.getBoundingClientRect(); if (!b.width) return;
      const x = Math.min(b.width - 8, Math.max(8, r.right - b.left)), y = Math.min(b.height - 8, Math.max(8, r.bottom - b.top));
      a.style.left = (x / b.width * 100) + '%'; a.style.top = (y / b.height * 100) + '%'; };
    a.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); a.setPointerCapture(e.pointerId); a.classList.add('ativa');
      const b = pn.getBoundingClientRect(), v0 = ler(), x0 = e.clientX, y0 = e.clientY;
      const mover = ev => gravar(v0 + ((ev.clientX - x0) + (ev.clientY - y0)) / b.height * (t.max - t.min) * 1.2, v0);
      const soltar = () => { a.removeEventListener('pointermove', mover); a.classList.remove('ativa'); mudou?.(); };
      a.addEventListener('pointermove', mover); a.addEventListener('pointerup', soltar, { once: true });
    });
    a.addEventListener('keydown', e => {
      const d = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
      e.preventDefault(); const v0 = ler(); gravar(v0 + d * Math.max(1, Math.round((t.max - t.min) / 40)), v0);
      clearTimeout(a._t); a._t = setTimeout(() => mudou?.(), 500);
    });
    rotulo(ler()); pn.append(a); alcas.push(pos);
  });
  const todas = () => alcas.forEach(p => p());
  requestAnimationFrame(todas); const t1 = setTimeout(todas, 300);
  pn.addEventListener('pointermove', todas);   // a seta acompanha a logo e o relógio quando são arrastados
  const img = alvos.logo?.querySelector('img'); img?.addEventListener('load', todas);
  return { parar(){ clearTimeout(t1); } };
}
