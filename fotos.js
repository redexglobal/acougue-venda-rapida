// Biblioteca de fotos reais (24/11/2026; ampliada 26/11). Wikimedia Commons, Openverse e Unsplash, todas com licença livre; créditos em /fotos/creditos.html.
// Cada foto tem a versão grande (promoção, fundo) e a quadrada pequena (ao lado do corte).
export const FOTOS = [{"id": "lingua-bovina", "nome": "Língua bovina"}, {"id": "lombo-suino", "nome": "Lombo suíno"}, {"id": "coracao-bovino", "nome": "Coração bovino"}, {"id": "almondega-crua", "nome": "Almôndega"}, {"id": "file-mignon-cru", "nome": "Filé mignon"}, {"id": "contrafile-cru", "nome": "Contrafilé"}, {"id": "ancho-cru", "nome": "Bife ancho cru"}, {"id": "fraldinha-crua", "nome": "Fraldinha"}, {"id": "bovina-pecas", "nome": "Peças bovinas (coxão, patinho, alcatra)"}, {"id": "musculo-cru", "nome": "Músculo"}, {"id": "rabada-crua", "nome": "Rabada"}, {"id": "bucho", "nome": "Bucho"}, {"id": "tripa", "nome": "Tripa"}, {"id": "figado", "nome": "Fígado"}, {"id": "moida-crua", "nome": "Carne moída"}, {"id": "costelinha-suina", "nome": "Costelinha suína"}, {"id": "bisteca-suina", "nome": "Bisteca suína"}, {"id": "panceta", "nome": "Panceta / toucinho"}, {"id": "pe-suino", "nome": "Pé suíno"}, {"id": "orelha-suina", "nome": "Orelha suína"}, {"id": "bacon", "nome": "Bacon"}, {"id": "linguica-crua", "nome": "Linguiça"}, {"id": "file-frango", "nome": "Filé de frango"}, {"id": "coxa-frango", "nome": "Coxa e sobrecoxa"}, {"id": "asa-frango", "nome": "Asa de frango"}, {"id": "pe-frango", "nome": "Pé de frango"}, {"id": "moela", "nome": "Moela"}, {"id": "kibe", "nome": "Kibe"}, {"id": "picanha-grelha", "nome": "Picanha na grelha"}, {"id": "carne-crua", "nome": "Peça de carne crua"}, {"id": "bifes-marmorizados", "nome": "Bifes marmorizados"}, {"id": "costela-curta", "nome": "Costela em tiras"}, {"id": "costelinha-barbecue", "nome": "Costelinha"}, {"id": "carre-cordeiro", "nome": "Carré de cordeiro"}, {"id": "tomahawk-cru", "nome": "Tomahawk"}, {"id": "tomahawk-grelhado", "nome": "Tomahawk grelhado"}, {"id": "carne-moida", "nome": "Carne moída"}, {"id": "moida-prato", "nome": "Carne moída no prato"}, {"id": "carne-na-brasa", "nome": "Carne na brasa"}, {"id": "fogo-de-chao", "nome": "Costela fogo de chão"}, {"id": "fogo-de-chao-2", "nome": "Fogo de chão"}, {"id": "picanha-fatiada", "nome": "Picanha fatiada"}, {"id": "bife-tabua", "nome": "Bife na tábua"}, {"id": "frango-assado", "nome": "Frango assado"}, {"id": "tomahawk-tabua", "nome": "Tomahawk na tábua"}, {"id": "bife-ancho", "nome": "Bife ancho"}, {"id": "suino-cru", "nome": "Carne suína"}, {"id": "linguica", "nome": "Linguiça"}, {"id": "musculo-peca", "nome": "Peça de músculo"}];
// 26/11/2026: só estas aparecem para escolher (alta resolução, corte cru e exato). As antigas ficam só para os modelos da galeria.
export const FOTOS_HQ = ["lingua-bovina", "file-mignon-cru", "contrafile-cru", "ancho-cru", "fraldinha-crua", "bovina-pecas", "musculo-cru", "rabada-crua", "moida-crua", "almondega-crua", "coracao-bovino", "figado", "bucho", "tripa", "lombo-suino", "costelinha-suina", "bisteca-suina", "panceta", "bacon", "pe-suino", "orelha-suina", "linguica-crua", "file-frango", "coxa-frango", "asa-frango", "pe-frango", "moela", "kibe"];
export const fotoGrande = id => `/fotos/${id}.webp`;
export const fotoPequena = id => `/fotos/${id}-p.webp`;
// 26/11/2026: uma foto para cada tipo de corte (a primeira regra que bate vence; a categoria desempata "Peito")
const REGRAS = [
  [/(mignon|fil[ée]) su[íi]n|lombo su[íi]|lombo de porco|lombinho/i, 'lombo-suino'], [/fil[ée] mignon|mignon/i, 'file-mignon-cru'], 
  [/capa do contrafil|contrafil|chorizo|entrecot/i, 'contrafile-cru'], [/ancho|prime rib|t-bone|denver|flat iron|wagyu|dry aged|bombom/i, 'ancho-cru'],
  [/fraldinha|vazio|bananinha/i, 'fraldinha-crua'], [/rabada/i, 'rabada-crua'], [/bucho/i, 'bucho'], [/tripa/i, 'tripa'], [/f[íi]gado/i, 'figado'], [/l[íi]ngua/i, 'lingua-bovina'], [/cora[çc][ãa]o/i, 'coracao-bovino'], [/alm[ôo]ndega/i, 'almondega-crua'],
  [/mo[íi]d|hamb[úu]rguer/i, 'moida-crua'], [/m[úu]sculo|ossobuco|chambari/i, 'musculo-cru'],
  [/costelinha|ribs/i, 'costelinha-suina'], 
  [/bisteca/i, 'bisteca-suina'], [/panceta|toucinho|torresmo|barriga/i, 'panceta'], [/bacon/i, 'bacon'],
  [/p[ée] su[íi]no|p[ée] de porco|pezinho/i, 'pe-suino'], [/orelha/i, 'orelha-suina'],
  [/lingui[çc]|calabresa/i, 'linguica-crua'],
  [/p[ée] de frango|p[ée]s de frango/i, 'pe-frango'], [/moela/i, 'moela'], [/asa|tulipa/i, 'asa-frango'], [/coxa|sobrecoxa/i, 'coxa-frango'],
  [/frango|chester|peru|codorna/i, 'file-frango'],
  [/kibe|quibe/i, 'kibe'],
  [/lombo su[íi]|lombo de porco|lombinho/i, 'lombo-suino'],
  [/cox[ãa]o|patinho|lagarto|paloma|paleta|ac[ée]m|peixinho|lomb[ãa]o|retalho|alcatra|maminha|serenada|carne temperada|peito|cabe[çc]a de lombo/i, 'bovina-pecas'],
];
// foto mais parecida com o nome do corte (null se não tiver uma que represente bem)
export function fotoPara(nome, cat = ''){
  if (/aves|frango/i.test(cat) && /peito|fil[ée]|medalh/i.test(nome)) return fotoPequena('file-frango');
  const r = REGRAS.find(([re]) => re.test(nome)); return r ? fotoPequena(r[1]) : null;
}
