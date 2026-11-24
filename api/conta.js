// Contas dos clientes, cobrança e liberação da TV (24/11/2026).
//
// Planos (por TV): mensal R$ 150 · semestral R$ 120/mês (R$ 720) · anual R$ 100/mês (R$ 1.200).
// Situação da conta, calculada sempre na hora (nada de tarefa agendada):
//   em dia      -> antes do vencimento (aviso a partir de 7 dias antes)
//   carência    -> até 48 h depois do vencimento: a TV funciona com aviso "pague em X h"
//   suspensa    -> passou das 48 h: a TV mostra "painel suspenso" e o editor não salva até pagar
// O pagamento por enquanto é registrado à mão no painel administrativo (Pix/boleto conferido pelo dono).
//
// Segurança: senhas com scrypt + sal por conta; sessão em token assinado (HMAC com PIN_SAL);
// senha do admin só no ambiente (ADMIN_SENHA), nunca no código.
import { scryptSync, randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { redis, getJ, setJ, corpo, responder, semNuvemNaVercel } from './_kv.js';

const SAL = process.env.PIN_SAL || 'sal-de-teste-local';
const ADMIN = process.env.ADMIN_SENHA || (process.env.VERCEL ? '' : 'admin-local');
const H = 3600 * 1000, D = 24 * H;
export const PLANOS = {
  mensal:    { nome: 'Mensal',    meses: 1,  porMes: 150, dias: 30 },
  semestral: { nome: 'Semestral', meses: 6,  porMes: 120, dias: 182 },
  anual:     { nome: 'Anual',     meses: 12, porMes: 100, dias: 365 },
};
export const CARENCIA_H = 48, AVISO_DIAS = 7, LIMITE_CFG = 900 * 1024;

// ---------- utilidades ----------
const igual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
const hashSenha = (senha, sal = randomBytes(16).toString('hex')) => sal + ':' + scryptSync(String(senha), sal, 32).toString('hex');
const confere = (senha, guardado) => { const [sal] = String(guardado || '').split(':'); return !!sal && igual(hashSenha(senha, sal), guardado); };
const assinar = dados => { const p = Buffer.from(JSON.stringify(dados)).toString('base64url'); return p + '.' + createHmac('sha256', SAL).update(p).digest('base64url'); };
function lerToken(t){
  const [p, s] = String(t || '').split('.'); if (!p || !s) return null;
  if (!igual(createHmac('sha256', SAL).update(p).digest('base64url'), s)) return null;
  const d = JSON.parse(Buffer.from(p, 'base64url').toString()); return d.exp > Date.now() ? d : null;
}
const senhaNova = () => { const a = 'abcdefghjkmnpqrstuvwxyz23456789'; return Array.from(randomBytes(10), b => a[b % a.length]).join('').replace(/(.{5})/, '$1-'); };
const usuarioDe = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '').slice(0, 24);
const txt = (s, n = 60) => String(s ?? '').replace(/[<>]/g, '').trim().slice(0, n);

export function situacao(c, agora = Date.now()){
  if (c.bloqueioManual) return { codigo: 'suspensa', texto: 'Suspensa pelo administrador', horas: 0 };
  const falta = c.venc - agora;
  if (falta >= 0){
    const dias = Math.ceil(falta / D);
    return dias <= AVISO_DIAS ? { codigo: 'vencendo', texto: `Vence em ${dias} dia${dias > 1 ? 's' : ''}`, dias } : { codigo: 'em_dia', texto: 'Em dia', dias };
  }
  const resta = c.venc + CARENCIA_H * H - agora;
  if (resta > 0){ const horas = Math.ceil(resta / H); return { codigo: 'carencia', texto: `Vencida: ${horas} h para pagar antes de desligar`, horas }; }
  return { codigo: 'suspensa', texto: 'Suspensa por falta de pagamento', horas: 0 };
}
const valorPlano = (plano, tvs) => PLANOS[plano].porMes * PLANOS[plano].meses * Math.max(1, tvs);
function publica(c){
  const { senha, ...resto } = c;
  return { ...resto, situacao: situacao(c), valorPeriodo: valorPlano(c.plano, c.tvs), plano_nome: PLANOS[c.plano]?.nome };
}
async function listaIds(){ return (await getJ('contas:ids')) || []; }

export default async function handler(req, res){
  try {
    if (semNuvemNaVercel()) return responder(res, 503, { semNuvem: true, erro: 'O banco de dados ainda não foi ligado na Vercel (Upstash). As contas funcionam assim que ele for conectado.' });
    const url = new URL(req.url, 'http://x'), q = Object.fromEntries(url.searchParams);
    const b = req.method === 'POST' ? await corpo(req) : {};
    const acao = q.acao || b.acao;
    const tok = lerToken(b.token || q.token || (req.headers.authorization || '').replace(/^Bearer /, ''));

    // ---------- TV: pública, pelo id da conta ----------
    if (acao === 'tv'){
      const c = await getJ('conta:' + txt(q.id, 40)); if (!c) return responder(res, 404, { erro: 'Painel não encontrado.' });
      const s = situacao(c);
      if (s.codigo === 'suspensa') return responder(res, 200, { situacao: s, loja: c.loja });
      return responder(res, 200, { situacao: s, loja: c.loja, cfg: await getJ('cfg:' + c.id), cfgEm: c.cfgEm || 0 });
    }

    // ---------- admin ----------
    if (acao === 'admin-entrar'){
      if (!ADMIN) return responder(res, 503, { erro: 'Senha do administrador não configurada.' });
      const tent = await redis('INCR', 'admin:tentativas'); if (tent === 1) await redis('EXPIRE', 'admin:tentativas', '900');
      if (tent > 8) return responder(res, 429, { erro: 'Muitas tentativas. Espere 15 minutos.' });
      if (!igual(b.senha || '', ADMIN)) return responder(res, 403, { erro: 'Senha incorreta.' });
      await redis('DEL', 'admin:tentativas');
      return responder(res, 200, { token: assinar({ papel: 'admin', exp: Date.now() + 12 * H }) });
    }
    if (acao?.startsWith('admin-')){
      if (tok?.papel !== 'admin') return responder(res, 401, { erro: 'Entre de novo no painel administrativo.' });
      if (acao === 'admin-listar'){
        const ids = await listaIds(); const contas = (await Promise.all(ids.map(id => getJ('conta:' + id)))).filter(Boolean).map(publica);
        const ativas = contas.filter(c => c.situacao.codigo !== 'suspensa');
        return responder(res, 200, { contas, planos: PLANOS, resumo: {
          total: contas.length, ativas: ativas.length, tvs: ativas.reduce((s, c) => s + (c.tvs || 1), 0),
          mrr: ativas.reduce((s, c) => s + PLANOS[c.plano].porMes * (c.tvs || 1), 0),
          atrasadas: contas.filter(c => ['carencia', 'suspensa'].includes(c.situacao.codigo)).length } });
      }
      if (acao === 'admin-criar'){
        const plano = PLANOS[b.plano] ? b.plano : 'mensal', tvs = Math.min(50, Math.max(1, parseInt(b.tvs, 10) || 1));
        const nome = txt(b.nome), loja = txt(b.loja) || nome; if (!loja) return responder(res, 400, { erro: 'Informe o nome da loja.' });
        let usuario = usuarioDe(b.usuario || loja) || 'loja';
        if (await redis('GET', 'usuario:' + usuario)) usuario += '.' + randomBytes(2).toString('hex');
        const senha = senhaNova(), id = randomBytes(6).toString('base64url');
        const teste = Math.min(30, Math.max(0, parseInt(b.diasTeste, 10) || 0));
        const c = { id, nome, loja, contato: txt(b.contato, 40), usuario, senha: hashSenha(senha), plano, tvs,
          venc: Date.now() + (teste ? teste * D : 0), criada: Date.now(), pagamentos: [], instalacao: { quer: !!b.instalacao, data: txt(b.dataInstalacao, 20), obs: '' }, obs: txt(b.obs, 300) };
        await setJ('conta:' + id, c); await redis('SET', 'usuario:' + usuario, id);
        await setJ('contas:ids', [...await listaIds(), id]);
        return responder(res, 200, { conta: publica(c), usuario, senha });   // a senha aparece UMA vez
      }
      const c = await getJ('conta:' + txt(b.id, 40)); if (!c) return responder(res, 404, { erro: 'Cliente não encontrado.' });
      if (acao === 'admin-pagamento'){
        const plano = PLANOS[b.plano] ? b.plano : c.plano; const p = PLANOS[plano];
        const base = Math.max(c.venc, Date.now());   // pagou adiantado soma; pagou atrasado conta de hoje
        c.plano = plano; c.venc = base + p.dias * D; c.bloqueioManual = false;
        c.pagamentos = [...(c.pagamentos || []), { ts: Date.now(), valor: Number(b.valor) || valorPlano(plano, c.tvs), plano, forma: txt(b.forma, 20) || 'Pix', obs: txt(b.obs, 120) }].slice(-60);
      } else if (acao === 'admin-editar'){
        if (b.loja !== undefined) c.loja = txt(b.loja); if (b.nome !== undefined) c.nome = txt(b.nome);
        if (b.contato !== undefined) c.contato = txt(b.contato, 40); if (b.obs !== undefined) c.obs = txt(b.obs, 300);
        if (b.tvs !== undefined) c.tvs = Math.min(50, Math.max(1, parseInt(b.tvs, 10) || 1));
        if (PLANOS[b.plano]) c.plano = b.plano;
        if (b.venc) { const t = Date.parse(b.venc + 'T23:59:00-03:00'); if (t) c.venc = t; }
        if (b.instalacao) c.instalacao = { quer: !!b.instalacao.quer, data: txt(b.instalacao.data, 20), obs: txt(b.instalacao.obs, 200) };
      } else if (acao === 'admin-bloquear'){
        c.bloqueioManual = !!b.bloquear;
      } else if (acao === 'admin-nova-senha'){
        const senha = senhaNova(); c.senha = hashSenha(senha); await setJ('conta:' + c.id, c);
        return responder(res, 200, { conta: publica(c), usuario: c.usuario, senha });
      } else if (acao === 'admin-arquivar'){
        c.arquivada = true; c.bloqueioManual = true;   // nunca apaga: só tira da operação
      } else return responder(res, 400, { erro: 'Ação desconhecida.' });
      await setJ('conta:' + c.id, c);
      return responder(res, 200, { conta: publica(c) });
    }

    // ---------- dono do açougue ----------
    if (acao === 'entrar'){
      const usuario = usuarioDe(b.usuario), chave = 'login:' + usuario;
      const tent = await redis('INCR', chave); if (tent === 1) await redis('EXPIRE', chave, '900');
      if (tent > 10) return responder(res, 429, { erro: 'Muitas tentativas. Espere 15 minutos.' });
      const id = await redis('GET', 'usuario:' + usuario); const c = id && await getJ('conta:' + id);
      if (!c || !confere(b.senha || '', c.senha) || c.arquivada) return responder(res, 403, { erro: 'Usuário ou senha incorretos.' });
      await redis('DEL', chave);
      return responder(res, 200, { token: assinar({ papel: 'dono', id: c.id, exp: Date.now() + 30 * D }), conta: publica(c), cfg: await getJ('cfg:' + c.id) });
    }
    if (tok?.papel !== 'dono') return responder(res, 401, { erro: 'Entre de novo com seu usuário e senha.' });
    const c = await getJ('conta:' + tok.id); if (!c) return responder(res, 404, { erro: 'Conta não encontrada.' });
    if (acao === 'minha') return responder(res, 200, { conta: publica(c), planos: PLANOS });
    if (acao === 'salvar'){
      if (situacao(c).codigo === 'suspensa') return responder(res, 402, { erro: 'Painel suspenso por falta de pagamento. Fale com a Kairós para reativar.' });
      if (!b.cfg || !Array.isArray(b.cfg.itens) || !b.cfg.itens.length) return responder(res, 400, { erro: 'O painel precisa de pelo menos um corte com preço.' });
      const json = JSON.stringify(b.cfg); if (json.length > LIMITE_CFG) return responder(res, 413, { erro: 'O painel ficou grande demais (fotos). Use fotos menores ou menos fotos.' });
      await redis('SET', 'cfg:' + c.id, json); c.cfgEm = Date.now(); await setJ('conta:' + c.id, c);
      return responder(res, 200, { ok: true, salvoEm: c.cfgEm });
    }
    if (acao === 'agendar'){
      c.instalacao = { quer: true, data: txt(b.data, 20), obs: txt(b.obs, 200), pedidoEm: Date.now() }; await setJ('conta:' + c.id, c);
      return responder(res, 200, { ok: true });
    }
    return responder(res, 400, { erro: 'Ação desconhecida.' });
  } catch (e){
    return responder(res, 500, { erro: 'O sistema não respondeu agora. Tente de novo em instantes.', detalhe: String(e.message || e).slice(0, 120) });
  }
}
