// Biblioteca de fotos reais (24/11/2026). Todas do Wikimedia Commons com licença livre; créditos em /fotos/creditos.html.
// Cada foto tem a versão grande (promoção, fundo) e a quadrada pequena (ao lado do corte).
export const FOTOS = [{"id": "picanha-grelha", "nome": "Picanha na grelha"}, {"id": "carne-crua", "nome": "Peça de carne crua"}, {"id": "bifes-marmorizados", "nome": "Bifes marmorizados"}, {"id": "costela-curta", "nome": "Costela em tiras"}, {"id": "costelinha-barbecue", "nome": "Costelinha"}, {"id": "carre-cordeiro", "nome": "Carré de cordeiro"}, {"id": "tomahawk-cru", "nome": "Tomahawk"}, {"id": "tomahawk-grelhado", "nome": "Tomahawk grelhado"}, {"id": "carne-moida", "nome": "Carne moída"}, {"id": "moida-prato", "nome": "Carne moída no prato"}, {"id": "carne-na-brasa", "nome": "Carne na brasa"}, {"id": "fogo-de-chao", "nome": "Costela fogo de chão"}, {"id": "fogo-de-chao-2", "nome": "Fogo de chão"}, {"id": "picanha-fatiada", "nome": "Picanha fatiada"}, {"id": "bife-tabua", "nome": "Bife na tábua"}, {"id": "frango-assado", "nome": "Frango assado"}, {"id": "tomahawk-tabua", "nome": "Tomahawk na tábua"}, {"id": "bife-ancho", "nome": "Bife ancho"}];
export const fotoGrande = id => `/fotos/${id}.webp`;
export const fotoPequena = id => `/fotos/${id}-p.webp`;
const REGRAS = [
  [/picanha/i, 'picanha-fatiada'], [/tomahawk/i, 'tomahawk-cru'], [/costelinha|ribs/i, 'costelinha-barbecue'], [/costela|short rib/i, 'costela-curta'],
  [/cordeiro|carr[ée]|cabrito/i, 'carre-cordeiro'], [/mo[ií]d|hamb[úu]rguer/i, 'carne-moida'], [/frango|coxa|peito de|asa|chester|peru|codorna|tulipa/i, 'frango-assado'],
  [/ancho|chorizo|prime|t-bone|denver|flat iron|wagyu|dry aged|bombom/i, 'bife-ancho'], [/contrafil|fil[ée]|maminha|alcatra|fraldinha|bife/i, 'bifes-marmorizados'],
  [/kit|churrasco|espetinho|cupim/i, 'carne-na-brasa'],
];
// foto mais parecida com o nome do corte (null se não tiver uma que represente bem)
export function fotoPara(nome){ const r = REGRAS.find(([re]) => re.test(nome)); return r ? fotoPequena(r[1]) : null; }
