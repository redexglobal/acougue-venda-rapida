// Catálogo de modelos do painel (23/11/2026): estilos visuais, 22 modelos por segmento e biblioteca de cortes.
// Preços da biblioteca são EXEMPLO para a demonstração; o dono troca pelos dele no editor.

// ---------- estilos visuais (forma das linhas, letra, textura do fundo) ----------
export const ESTILOS = {
  padrao:    { nome: 'Cartões',        tit: 'Archivo',          txt: 'Archivo',  linha: 'cartao' },
  rustico:   { nome: 'Rústico madeira', tit: 'Alfa Slab One',   txt: 'Archivo',  linha: 'pontilhado', textura: 'madeira' },
  brilho:    { nome: 'Brilho',         tit: 'Archivo',          txt: 'Archivo',  linha: 'brilho' },
  lousa:     { nome: 'Quadro-negro',   tit: 'Kalam',            txt: 'Kalam',    linha: 'lousa', textura: 'lousa' },
  azulejo:   { nome: 'Azulejo',        tit: 'Alfa Slab One',    txt: 'Archivo',  linha: 'tabela', textura: 'azulejo' },
  kraft:     { nome: 'Empório kraft',  tit: 'Playfair Display', txt: 'Archivo',  linha: 'pontilhado', textura: 'kraft' },
  mercado:   { nome: 'Supermercado',   tit: 'Bebas Neue',       txt: 'Archivo',  linha: 'etiqueta' },
  tabela:    { nome: 'Tabela limpa',   tit: 'Archivo',          txt: 'Archivo',  linha: 'tabela' },
  noir:      { nome: 'Gourmet noir',   tit: 'Playfair Display', txt: 'Inter',    linha: 'pontilhado' },
  dourado:   { nome: 'Boutique dourada', tit: 'Playfair Display', txt: 'Inter',  linha: 'pontilhado', textura: 'linho' },
  marmore:   { nome: 'Mármore',        tit: 'Playfair Display', txt: 'Inter',    linha: 'pontilhado', textura: 'marmore' },
  minimal:   { nome: 'Minimal',        tit: 'Inter',            txt: 'Inter',    linha: 'tabela' },
  neon:      { nome: 'Neon',           tit: 'Bebas Neue',       txt: 'Archivo',  linha: 'cartao', textura: 'grade' },
  fogo:      { nome: 'Fogo',           tit: 'Bebas Neue',       txt: 'Archivo',  linha: 'brilho', textura: 'brasa' },
  natal:     { nome: 'Natal (luzinhas e neve)', tit: 'Playfair Display', txt: 'Archivo', linha: 'natal', textura: 'natal' },
  madeiraNobre: { nome: 'Madeira nobre', tit: 'Playfair Display', txt: 'Inter',  linha: 'pontilhado', textura: 'madeira2' },
  holo:      { nome: 'Tecnológico (holograma)', tit: 'Bebas Neue', txt: 'Inter', linha: 'vidro', textura: 'holo' },
  cromo:     { nome: 'Cromo brilhante', tit: 'Bebas Neue',     txt: 'Archivo',  linha: 'cromo', textura: 'cromo' },
};
export const FONTES_URL = 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Archivo:wght@600;800;900&family=Bebas+Neue&family=Inter:wght@400;600;800&family=Kalam:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap';

// ---------- segmentos ----------
export const SEGMENTOS = {
  natal: 'Natal e fim de ano', madeira: 'Madeira nobre', tech: 'Tecnológico e brilho',
  bairro: 'Açougue de bairro', rustico: 'Rústico e empório', mercado: 'Supermercado e atacado',
  pequeno: 'Setor pequeno', gourmet: 'Gourmet, chique e premium', churrasco: 'Churrasco, moderno e natural', foto: 'Com a sua foto',
};

// ---------- biblioteca de cortes (exemplo de preço) ----------
const L = (c, lista) => lista.map(([n, p, u = 'kg']) => ({ n, c, p, u, of: false, esg: false }));
export const BIBLIOTECA = [
  ...L('Bovinos', [['Picanha', 79.9], ['Alcatra', 49.9], ['Contrafilé', 52.9], ['Filé mignon', 89.9], ['Maminha', 54.9], ['Fraldinha', 46.9], ['Cupim', 42.9], ['Costela', 29.9], ['Costela janela', 32.9], ['Acém', 34.9], ['Músculo', 32.9], ['Paleta', 33.9], ['Patinho', 42.9], ['Patinho moído', 39.9], ['Coxão mole', 44.9], ['Coxão duro', 39.9], ['Lagarto', 41.9], ['Peito', 31.9], ['Cupim recheado', 49.9], ['Rabada', 29.9], ['Fígado', 19.9], ['Dobradinha', 18.9], ['Ossobuco', 27.9], ['Capa de filé', 36.9]]),
  ...L('Premium', [['Ancho', 99.9], ['Chorizo', 94.9], ['Tomahawk', 129.9], ['Prime rib', 109.9], ['T-bone', 89.9], ['Bife de chorizo dry aged', 189.9], ['Picanha Angus', 119.9], ['Wagyu ribeye', 449.9], ['Denver steak', 84.9], ['Flat iron', 79.9], ['Short rib', 69.9], ['Bombom de alcatra', 64.9]]),
  ...L('Suínos', [['Lombo suíno', 26.9], ['Bisteca suína', 22.9], ['Pernil', 21.9], ['Costelinha suína', 28.9], ['Barriga suína', 27.9], ['Panceta', 34.9], ['Copa lombo', 29.9], ['Picanha suína', 32.9], ['Joelho (eisbein)', 19.9], ['Pé e orelha', 14.9], ['Toucinho', 16.9], ['Pancetta pururuca', 39.9]]),
  ...L('Aves', [['Coxa e sobrecoxa', 14.9], ['Peito de frango', 19.9], ['Filé de peito', 24.9], ['Asa', 17.9], ['Meio da asa (tulipa)', 26.9], ['Frango inteiro', 12.9], ['Coração de frango', 34.9], ['Moela', 15.9], ['Fígado de frango', 9.9], ['Pé de frango', 8.9], ['Peru (peito)', 39.9], ['Chester', 29.9]]),
  ...L('Cordeiro', [['Pernil de cordeiro', 69.9], ['Paleta de cordeiro', 59.9], ['Carré de cordeiro', 129.9], ['Costela de cordeiro', 54.9], ['Lombo de cordeiro', 89.9]]),
  ...L('Linguiças', [['Linguiça toscana', 24.9], ['Linguiça de frango', 19.9], ['Linguiça apimentada', 26.9], ['Linguiça cuiabana', 29.9], ['Linguiça de pernil', 27.9], ['Linguiça com queijo', 29.9], ['Chouriço', 31.9], ['Salsichão', 21.9]]),
  ...L('Embutidos e defumados', [['Bacon', 39.9], ['Bacon em cubos', 44.9], ['Calabresa', 29.9], ['Paio', 34.9], ['Costela defumada', 49.9], ['Carne de sol', 54.9], ['Charque', 44.9], ['Lombo canadense', 59.9]]),
  ...L('Peixes', [['Tilápia (filé)', 49.9], ['Salmão (filé)', 119.9], ['Pintado (posta)', 59.9], ['Tambaqui (costela)', 44.9], ['Camarão limpo', 89.9], ['Merluza (filé)', 39.9]]),
  ...L('Exóticos', [['Javali', 79.9], ['Jacaré (filé)', 99.9], ['Cabrito', 64.9], ['Codorna', 49.9]]),
  ...L('Kits e combos', [['Kit churrasco 2 kg', 109.9, 'un'], ['Kit churrasco família 4 kg', 199.9, 'un'], ['Kit semana (5 kg variado)', 149.9, 'un'], ['Kit feijoada', 59.9, 'un'], ['Kit premium (ancho + chorizo)', 179.9, 'un'], ['Espetinho misto', 6.9, 'un'], ['Hambúrguer artesanal 180 g', 9.9, 'un']]),
  ...L('Kits e combos', [['Kit ceia (pernil + tender + farofa)', 189.9, 'un'], ['Kit Natal família (peru + pernil)', 249.9, 'un'], ['Combo churrasco Réveillon 5 kg', 239.9, 'un']]),
  ...L('Outros', [['Tender', 69.9], ['Lombo para ceia', 39.9], ['Peru temperado', 34.9], ['Bacalhau (posta)', 129.9], ['Chester temperado', 32.9]]),
  ...L('Outros', [['Carvão 5 kg', 29.9, 'un'], ['Sal grosso', 6.9, 'un'], ['Pão de alho', 14.9, 'un'], ['Queijo coalho (espeto)', 4.9, 'un']]),
];
export const CATEGORIAS_TODAS = [...new Set(BIBLIOTECA.map(i => i.c))];
const pega = (...nomes) => nomes.map(n => ({ ...BIBLIOTECA.find(i => i.n === n) })).filter(i => i.n);

const SORTIDO_BAIRRO = pega('Picanha', 'Alcatra', 'Contrafilé', 'Fraldinha', 'Costela', 'Acém', 'Patinho moído', 'Músculo', 'Lombo suíno', 'Bisteca suína', 'Coxa e sobrecoxa', 'Peito de frango', 'Linguiça toscana', 'Kit churrasco 2 kg');
const SORTIDO_MERCADO = pega('Picanha', 'Alcatra', 'Contrafilé', 'Maminha', 'Fraldinha', 'Cupim', 'Costela', 'Acém', 'Músculo', 'Paleta', 'Patinho', 'Patinho moído', 'Coxão mole', 'Coxão duro', 'Lagarto', 'Fígado', 'Lombo suíno', 'Bisteca suína', 'Pernil', 'Costelinha suína', 'Coxa e sobrecoxa', 'Peito de frango', 'Frango inteiro', 'Asa', 'Linguiça toscana', 'Linguiça de frango', 'Bacon', 'Calabresa', 'Tilápia (filé)', 'Kit semana (5 kg variado)');
const SORTIDO_GOURMET = pega('Ancho', 'Chorizo', 'Tomahawk', 'Prime rib', 'Picanha Angus', 'Bife de chorizo dry aged', 'Wagyu ribeye', 'Denver steak', 'Flat iron', 'Short rib', 'Carré de cordeiro', 'Pancetta pururuca', 'Linguiça cuiabana', 'Kit premium (ancho + chorizo)');
const SORTIDO_CHURRASCO = pega('Picanha', 'Maminha', 'Fraldinha', 'Cupim', 'Costela janela', 'Ancho', 'Chorizo', 'Linguiça toscana', 'Linguiça apimentada', 'Coração de frango', 'Meio da asa (tulipa)', 'Pão de alho', 'Queijo coalho (espeto)', 'Carvão 5 kg', 'Kit churrasco família 4 kg');
const SORTIDO_PEQUENO = pega('Picanha', 'Alcatra', 'Contrafilé', 'Costela', 'Patinho moído', 'Coxa e sobrecoxa', 'Linguiça toscana');
const SORTIDO_NATURAL = pega('Picanha', 'Filé mignon', 'Patinho', 'Peito de frango', 'Filé de peito', 'Frango inteiro', 'Lombo suíno', 'Pernil de cordeiro', 'Tilápia (filé)', 'Salmão (filé)', 'Linguiça de frango');
const SORTIDO_NATAL = pega('Peru temperado', 'Chester temperado', 'Tender', 'Lombo para ceia', 'Pernil', 'Bacalhau (posta)', 'Carré de cordeiro', 'Picanha', 'Kit ceia (pernil + tender + farofa)', 'Kit Natal família (peru + pernil)', 'Combo churrasco Réveillon 5 kg');
SORTIDO_NATAL.forEach((it, i) => { if (i === 0) it.selo = 'natal'; if (i === 8) { it.selo = 'ceia'; it.desc = 'Pernil 2 kg · tender 1 kg · farofa da casa'; } if (i === 9) { it.selo = 'combo'; it.desc = 'Peru 3 kg · pernil 2 kg · temperados'; } if (i === 10) { it.selo = 'combo'; it.desc = 'Picanha · fraldinha · linguiça · coração · carvão'; } });
const SORTIDO_RUSTICO = pega('Picanha', 'Costela', 'Cupim', 'Carne de sol', 'Charque', 'Costela defumada', 'Linguiça cuiabana', 'Linguiça de pernil', 'Panceta', 'Barriga suína', 'Bacon', 'Paio', 'Javali', 'Cabrito');

// ---------- 22 modelos ----------
// Cada modelo é um pedaço de configuração: o que não está aqui vem do padrão do painel.
const M = (id, nome, segmento, sobre, cfg) => ({ id, nome, segmento, sobre, cfg });
export const MODELOS = [
  M('brasa-classico', 'Brasa Clássico', 'bairro', 'O painel que todo açougue entende: cartões, ofertas e promoção com foto.',
    { estilo: 'padrao', tema: 'brasa', halo: true, moldura: false, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', itens: SORTIDO_BAIRRO }),
  M('azulejo', 'Azulejo Tradicional', 'bairro', 'Cara de açougue de família, com azulejo branco e letra de placa.',
    { estilo: 'azulejo', cores: { fundo: '#f4f1ea', texto: '#1d2a44', destaque: '#b3261e', preco: '#b3261e', faixa: '#ffffff' }, halo: false, moldura: true, arranjo: 'promo-dir', colunas: 1, movimento: 'paginas', itens: SORTIDO_BAIRRO }),
  M('quadro-mestre', 'Quadro-Negro do Mestre', 'bairro', 'Como o quadro escrito a giz, só que você muda pelo celular.',
    { estilo: 'lousa', tema: 'quadro', halo: false, moldura: true, arranjo: 'so-precos', colunas: 2, movimento: 'parado', itens: SORTIDO_BAIRRO }),
  M('rustico-madeira', 'Rústico Madeira', 'rustico', 'Madeira escura, letra de faroeste e preço pontilhado como cardápio de fazenda.',
    { estilo: 'rustico', cores: { fundo: '#2a1a10', texto: '#f6e7cf', destaque: '#e0a040', preco: '#ffd98a', faixa: '#3a2516' }, halo: false, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', itens: SORTIDO_RUSTICO }),
  M('rustico-brilho', 'Rústico Brilho', 'rustico', 'A madeira do rústico com brilho nos preços e na oferta: chama o olho de longe.',
    { estilo: 'rustico', cores: { fundo: '#24140c', texto: '#fff0d6', destaque: '#ff9a3c', preco: '#ffd166', faixa: '#33200f' }, halo: true, moldura: true, arranjo: 'promo-dir', colunas: 1, movimento: 'cima', itens: SORTIDO_RUSTICO }),
  M('emporio-kraft', 'Empório Kraft', 'rustico', 'Papel kraft e letra de empório: charcutaria, defumados e cortes da casa.',
    { estilo: 'kraft', cores: { fundo: '#c9a77c', texto: '#2b1a0e', destaque: '#7a2e12', preco: '#4a1a08', faixa: '#d8bb92' }, halo: false, moldura: true, arranjo: 'promo-cima', colunas: 2, movimento: 'parado', itens: SORTIDO_RUSTICO }),
  M('supermercado-ofertao', 'Supermercado Ofertão', 'mercado', 'Etiqueta amarela de oferta, letra grande e muitos itens: o padrão de supermercado.',
    { estilo: 'mercado', cores: { fundo: '#c8102e', texto: '#ffffff', destaque: '#ffd400', preco: '#1a1a1a', faixa: '#a00d25' }, halo: false, moldura: false, arranjo: 'promo-esq', colunas: 2, movimento: 'cima', tamFonte: 90, itens: SORTIDO_MERCADO }),
  M('setor-carnes', 'Setor de Carnes', 'mercado', 'Para o balcão de carnes do supermercado grande: 3 colunas por categoria, sem promoção.',
    { estilo: 'tabela', cores: { fundo: '#0e2a47', texto: '#ffffff', destaque: '#ffcc00', preco: '#ffffff', faixa: '#123659' }, halo: false, moldura: false, arranjo: 'so-precos', colunas: 3, movimento: 'paginas', tamFonte: 85, itens: SORTIDO_MERCADO }),
  M('atacado', 'Atacado Preço Baixo', 'mercado', 'Visual de atacarejo: preço em etiqueta enorme, rolando para o lado.',
    { estilo: 'mercado', cores: { fundo: '#ffd400', texto: '#1a1a1a', destaque: '#d00000', preco: '#d00000', faixa: '#ffe25a' }, halo: false, moldura: false, arranjo: 'promo-cima', colunas: 1, movimento: 'lado', itens: SORTIDO_MERCADO }),
  M('balcao-compacto', 'Balcão Compacto', 'pequeno', 'Poucos itens, letra grande: para TV pequena atrás do balcão.',
    { estilo: 'padrao', tema: 'noite', halo: false, moldura: false, arranjo: 'so-precos', colunas: 1, movimento: 'parado', tamFonte: 130, itens: SORTIDO_PEQUENO }),
  M('totem-em-pe', 'Totem em Pé', 'pequeno', 'TV em pé na entrada ou na vitrine: promoção em cima e preços embaixo.',
    { estilo: 'brilho', tema: 'brasa', halo: true, moldura: false, arranjo: 'promo-cima', colunas: 1, movimento: 'cima', orientacao: 'retrato', itens: SORTIDO_PEQUENO }),
  M('gourmet-noir', 'Gourmet Noir', 'gourmet', 'Preto, serifa elegante e preço pontilhado: cara de restaurante de carnes.',
    { estilo: 'noir', cores: { fundo: '#0c0c0c', texto: '#f2ede4', destaque: '#c8a96a', preco: '#f2ede4', faixa: '#151515' }, halo: false, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'paginas', itens: SORTIDO_GOURMET }),
  M('boutique-dourada', 'Boutique Dourada', 'gourmet', 'Dourado com brilho suave e moldura fina: boutique de carnes nobres.',
    { estilo: 'dourado', cores: { fundo: '#14100a', texto: '#f7efe0', destaque: '#d9b25f', preco: '#f0d08a', faixa: '#1d170e' }, halo: true, moldura: true, arranjo: 'promo-dir', colunas: 1, movimento: 'paginas', itens: SORTIDO_GOURMET }),
  M('marmore-branco', 'Mármore Branco', 'gourmet', 'Claro, mármore e serifa: limpo e chique para loja de shopping.',
    { estilo: 'marmore', cores: { fundo: '#f5f3ef', texto: '#1f1b16', destaque: '#8a6a2f', preco: '#1f1b16', faixa: '#ffffff' }, halo: false, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'parado', itens: SORTIDO_GOURMET }),
  M('dry-aged', 'Dry Aged Cave', 'gourmet', 'Escuro com brilho vermelho de câmara de maturação: para quem vende dry aged.',
    { estilo: 'noir', cores: { fundo: '#100607', texto: '#f4e6e6', destaque: '#e0353d', preco: '#ff8a8f', faixa: '#1b0a0c' }, halo: true, moldura: false, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', itens: SORTIDO_GOURMET }),
  M('wagyu', 'Wagyu Premium', 'gourmet', 'Ônix e champanhe com halo: corte caro pede vitrine à altura.',
    { estilo: 'dourado', cores: { fundo: '#0b0b10', texto: '#eceaf3', destaque: '#e8d3a3', preco: '#ffffff', faixa: '#14141c' }, halo: true, moldura: true, arranjo: 'so-promo', colunas: 1, movimento: 'parado', itens: SORTIDO_GOURMET }),
  M('minimal-nordico', 'Minimal Nórdico', 'gourmet', 'Branco, cinza e muito espaço. Sem halo, sem moldura: só o essencial.',
    { estilo: 'minimal', cores: { fundo: '#fafafa', texto: '#111111', destaque: '#111111', preco: '#111111', faixa: '#f0f0f0' }, halo: false, moldura: false, arranjo: 'promo-dir', colunas: 2, movimento: 'parado', itens: SORTIDO_NATURAL }),
  M('churrascaria-fogo', 'Churrascaria Fogo', 'churrasco', 'Brasa no fundo, letra de impacto e kit churrasco em destaque.',
    { estilo: 'fogo', cores: { fundo: '#120604', texto: '#fff4ea', destaque: '#ff5a1f', preco: '#ffc24a', faixa: '#1f0b06' }, halo: true, moldura: false, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', itens: SORTIDO_CHURRASCO }),
  M('neon-noturno', 'Neon Noturno', 'churrasco', 'Neon e grade de luz para loja que abre à noite e espetaria.',
    { estilo: 'neon', cores: { fundo: '#07070f', texto: '#e9f6ff', destaque: '#ff2bd6', preco: '#4dfcff', faixa: '#10101d' }, halo: true, moldura: true, arranjo: 'promo-dir', colunas: 1, movimento: 'cima', itens: SORTIDO_CHURRASCO }),
  M('campo-organico', 'Campo Orgânico', 'churrasco', 'Verde e claro para carne de produtor, frango caipira e linha natural.',
    { estilo: 'tabela', tema: 'campo', halo: false, moldura: false, arranjo: 'promo-esq', colunas: 1, movimento: 'paginas', itens: SORTIDO_NATURAL }),
  M('vitrine-foto', 'Vitrine com Foto', 'foto', 'Cada corte com a foto dele ao lado do preço: o cliente vê o que compra.',
    { estilo: 'padrao', tema: 'brasa', halo: true, moldura: false, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', fotosItens: true, itens: SORTIDO_BAIRRO }),
  M('fachada-fundo', 'Fachada no Fundo', 'foto', 'A foto da sua loja vira o fundo da tela, escurecida para o preço ler bem.',
    { estilo: 'padrao', tema: 'noite', halo: true, moldura: false, arranjo: 'so-precos', colunas: 2, movimento: 'parado', fotoLojaFundo: true, itens: SORTIDO_BAIRRO }),
  // ---- 24/11/2026: Natal, madeira nobre, tecnológico e brilho ----
  M('natal-vermelho-ouro', 'Natal Vermelho e Ouro', 'natal', 'Vermelho, dourado e luzinhas no topo: as ofertas da ceia em destaque.',
    { estilo: 'natal', cores: { fundo: '#7a0d12', texto: '#fff6e6', destaque: '#e8c35a', preco: '#ffe08a', faixa: '#5e080c' }, halo: true, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', itens: SORTIDO_NATAL }),
  M('natal-neve', 'Natal Neve', 'natal', 'Verde-pinheiro com neve caindo devagar e preço em dourado.',
    { estilo: 'natal', cores: { fundo: '#0f2a1d', texto: '#f3fff7', destaque: '#d94141', preco: '#ffe08a', faixa: '#123423' }, halo: false, moldura: true, arranjo: 'promo-dir', colunas: 1, movimento: 'paginas', itens: SORTIDO_NATAL }),
  M('ceia-gourmet', 'Ceia Gourmet', 'natal', 'Preto e dourado para a ceia de quem vende cortes nobres e kits prontos.',
    { estilo: 'dourado', cores: { fundo: '#0d0b08', texto: '#f7efe0', destaque: '#d9b25f', preco: '#f0d08a', faixa: '#17130c' }, halo: true, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'paginas', itens: SORTIDO_NATAL }),
  M('natal-rustico', 'Natal Rústico', 'natal', 'Madeira escura com luzinhas: o Natal da casa de carnes do interior.',
    { estilo: 'rustico', cores: { fundo: '#2a1a10', texto: '#fff0d6', destaque: '#d94141', preco: '#ffd166', faixa: '#3a2516' }, halo: true, moldura: true, arranjo: 'promo-cima', colunas: 2, movimento: 'parado', itens: SORTIDO_NATAL }),
  M('reveillon-brilho', 'Réveillon Brilho', 'natal', 'Preto e prata com brilho passando nos preços: churrasco da virada.',
    { estilo: 'cromo', cores: { fundo: '#08080c', texto: '#f4f6f8', destaque: '#c9d1da', preco: '#ffffff', faixa: '#121218' }, halo: true, moldura: false, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', itens: SORTIDO_CHURRASCO }),
  M('madeira-nobre', 'Madeira Nobre', 'madeira', 'Madeira clara, serifa elegante e pontilhado: empório fino de carnes.',
    { estilo: 'madeiraNobre', cores: { fundo: '#5a3a22', texto: '#fff7ec', destaque: '#f0c27a', preco: '#ffe2b0', faixa: '#4a2f1b' }, halo: false, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'paginas', itens: SORTIDO_GOURMET }),
  M('madeira-carvao', 'Madeira e Carvão', 'madeira', 'Madeira queimada e brasa no fundo: para casa de churrasco de verdade.',
    { estilo: 'rustico', cores: { fundo: '#1c120c', texto: '#f6e7cf', destaque: '#ff7a2f', preco: '#ffcf7a', faixa: '#2a1a10' }, halo: true, moldura: false, arranjo: 'promo-dir', colunas: 1, movimento: 'cima', itens: SORTIDO_CHURRASCO }),
  M('madeira-tabua', 'Tábua de Corte', 'madeira', 'Cor de tábua de carne e letra de placa: simples, quente e legível.',
    { estilo: 'madeiraNobre', cores: { fundo: '#8a5a32', texto: '#1f120a', destaque: '#7a1c0c', preco: '#2a0f05', faixa: '#a06a3c' }, halo: false, moldura: false, arranjo: 'so-precos', colunas: 2, movimento: 'parado', itens: SORTIDO_BAIRRO }),
  M('tech-holograma', 'Tecnológico Holograma', 'tech', 'Vidro, luz azul e violeta: açougue moderno que quer parecer do futuro.',
    { estilo: 'holo', cores: { fundo: '#060a18', texto: '#e8f1ff', destaque: '#6ea8ff', preco: '#a8e1ff', faixa: '#0c1328' }, halo: true, moldura: false, arranjo: 'promo-dir', colunas: 1, movimento: 'cima', itens: SORTIDO_GOURMET }),
  M('tech-led', 'Painel LED', 'tech', 'Preto absoluto com números em verde-LED: leitura de longe e cara de balança digital.',
    { estilo: 'holo', cores: { fundo: '#020403', texto: '#d7ffe6', destaque: '#28ff7a', preco: '#28ff7a', faixa: '#06100a' }, halo: true, moldura: false, arranjo: 'so-precos', colunas: 2, movimento: 'parado', itens: SORTIDO_MERCADO }),
  M('cromo-premium', 'Cromo Premium', 'tech', 'Preços em metal escovado com brilho: vitrine de carne cara.',
    { estilo: 'cromo', cores: { fundo: '#101216', texto: '#eef1f5', destaque: '#9fb3c8', preco: '#ffffff', faixa: '#181b21' }, halo: false, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'paginas', itens: SORTIDO_GOURMET }),
  M('brilho-ouro', 'Brilho Ouro', 'tech', 'Cartões com reflexo passando e destaque dourado: chama atenção sem perder a classe.',
    { estilo: 'brilho', cores: { fundo: '#120d05', texto: '#fff6e0', destaque: '#f2c14e', preco: '#ffe08a', faixa: '#1e160a' }, halo: true, moldura: true, arranjo: 'promo-esq', colunas: 1, movimento: 'cima', itens: SORTIDO_BAIRRO }),
];

// aplica um modelo mantendo o que é do dono (nome, logo, fotos, promoção, horário e, se pedir, os preços)
export function aplicarModelo(cfgAtual, modelo, { manterItens = true } = {}){
  const visual = { ...modelo.cfg }; delete visual.itens;
  const novo = { ...cfgAtual, ...visual, modelo: modelo.id };
  if (!modelo.cfg.cores) novo.cores = null;
  if (!manterItens || !cfgAtual.itens?.length) novo.itens = modelo.cfg.itens.map(i => ({ ...i }));
  return novo;
}
