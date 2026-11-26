/**
 * Bosco · Gestão comercial e financeira — e-mail diário de alertas
 * Instalação: veja o passo a passo enviado no chat. Rode "testar" uma vez e depois "instalar".
 * Este script só LÊ o banco de dados. Ele roda na conta financeiro@ e envia e-mails por ela.
 */
const PROJETO = 'maitre-bosco';
const SITE = 'https://maitre.boscoeventos.com.br';
const FIXO_GESTAO = 'financeiro@boscoeventos.com.br';
const BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJETO + '/databases/(default)/documents';

/* ---------- leitura do Firestore (REST, com a permissão da conta financeiro@) ---------- */
function http_(url, payload) {
  const opt = { method: payload ? 'post' : 'get', muteHttpExceptions: true, contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Goog-User-Project': PROJETO } };
  if (payload) opt.payload = JSON.stringify(payload);
  const r = UrlFetchApp.fetch(url, opt);
  if (r.getResponseCode() >= 300) throw new Error('Firestore ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 300));
  return JSON.parse(r.getContentText() || '{}');
}
function val_(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) { const o = {}; const f = v.mapValue.fields || {}; for (const k in f) o[k] = val_(f[k]); return o; }
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val_);
  return null;
}
function doc_(d) {
  const o = {}; const f = d.fields || {}; for (const k in f) o[k] = val_(f[k]);
  const partes = d.name.split('/documents/')[1].split('/');
  o.id = partes[partes.length - 1];
  if (partes[0] === 'vendas') o._o = partes[1];
  return o;
}
function grupo_(colecao) { // todas as coleções com esse nome (inclui vendas/<pasta>/<colecao>)
  const r = http_(BASE + ':runQuery', { structuredQuery: { from: [{ collectionId: colecao, allDescendants: true }] } });
  return r.filter(x => x.document).map(x => doc_(x.document));
}
function colecao_(nome) {
  let out = [], token = '';
  do { const r = http_(BASE + '/' + nome + '?pageSize=300' + (token ? '&pageToken=' + token : ''));
    out = out.concat((r.documents || []).map(doc_)); token = r.nextPageToken || ''; } while (token);
  return out;
}
function carregar_() {
  const cfg = colecao_('config').find(d => d.id === 'geral') || {};
  const ontem = new Date(Date.now() - 2 * 864e5).toISOString();
  const log = http_(BASE + ':runQuery', { structuredQuery: { from: [{ collectionId: 'log' }],
    where: { fieldFilter: { field: { fieldPath: 'em' }, op: 'GREATER_THAN_OR_EQUAL', value: { stringValue: ontem } } } } })
    .filter(x => x.document).map(x => doc_(x.document));
  return { agenda: colecao_('agenda'), receber: grupo_('receber'), contratos: grupo_('contratos'), orcamentos: grupo_('orcamentos'), clientes: grupo_('clientes'),
    pagar: colecao_('pagar'), contas: colecao_('contas'), transf: colecao_('transf'), extrato: colecao_('extrato'),
    equipe: colecao_('equipe'), usuarios: colecao_('usuarios'), pedidos: colecao_('pedidos'), log: log, config: cfg };
}

/* ---------- regras dos alertas (iguais às do quadro "Avisos de hoje" do sistema) ---------- */
/* ===== Alertas: mesmo código no sistema (quadro "Avisos de hoje") e no e-mail diário (Apps Script) ===== */
function montarAlertas(D,hoje){
  const cfg=D.config||{};
  const addD=(iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
  const brlA=c=>{const n=Math.round(c||0),neg=n<0,a=Math.abs(n),r=String(Math.floor(a/100)).replace(/\B(?=(\d{3})+(?!\d))/g,".");return (neg?"-":"")+"R$ "+r+","+String(a%100).padStart(2,"0")};
  const dt=iso=>iso?iso.slice(8,10)+"/"+iso.slice(5,7):"";
  const dias=(a,b)=>Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/864e5);
  const byId=(arr,id)=>(arr||[]).find(x=>x.id===id);
  const cli=id=>{const c=byId(D.clientes,id);return c?c.nome:""};
  const resp=id=>{const e=byId(D.equipe,id);return e?e.nome:""};
  const aberto=x=>x.status!=="pago"&&x.status!=="cancelado";
  const encargosA=x=>{const mp=Number(cfg.multaPct)||0,jm=Number(cfg.jurosMesPct)||0;const n=dias(x.vencimento,hoje);if(n<=0||(!mp&&!jm))return 0;
    return Math.round((x.valor||0)*mp/100)+Math.round((x.valor||0)*jm/100/30*n)};
  const soma=a=>a.reduce((s,x)=>s+(x.valor||0),0);
  const PRI={1:"Máxima",2:"Média",3:"Baixa"};
  const contrato=id=>byId(D.contratos,id);
  const descR=x=>{const k=x.contratoId&&contrato(x.contratoId);return [cli(x.clienteId)||(k&&cli(k.clienteId)),k?k.evento:x.descricao].filter(Boolean).join(" · ")};
  const G=[];const V={};const sec=(arr,o)=>{if(o.itens.length)arr.push(o)};
  const R=(D.receber||[]).filter(aberto),P=(D.pagar||[]).filter(aberto);
  const dow=new Date(hoje+"T12:00:00").getDay();const dia=Number(hoje.slice(8,10));
  // 0. agenda de hoje e amanhã (compartilhada)
  const amanha=addD(hoje,1);
  const agL=(D.agenda||[]).filter(a=>a.status!=="cancelado"&&a.status!=="realizado"&&(a.data===hoje||a.data===amanha)).sort((a,b)=>(a.data+(a.inicio||"")).localeCompare(b.data+(b.inicio||"")));
  const agSec=()=>({id:"agenda",icone:"📅",titulo:"Agenda",nivel:agL.some(a=>a.data===hoje)?"media":"info",rota:"agenda",
    resumo:[agL.filter(a=>a.data===hoje).length&&`${agL.filter(a=>a.data===hoje).length} compromisso(s) hoje`,agL.filter(a=>a.data===amanha).length&&`${agL.filter(a=>a.data===amanha).length} amanhã`].filter(Boolean).join(" · "),
    itens:agL.map(a=>({t:`${a.data===hoje?"Hoje":"Amanhã"}${a.inicio?" "+a.inicio:""} · ${a.titulo||""}`,s:[a.local,resp(a.responsavelId),a.status==="confirmado"?"confirmado":a.data===amanha?"confirmar com o cliente":""].filter(Boolean).join(" · ")}))});
  sec(G,agSec());
  for(const o of (D.extras||[]))sec(G,o);   // conferências calculadas pelo sistema (saldos e duplicados)

  // 1. recebimentos
  const rHoje=R.filter(x=>x.vencimento===hoje),rAtr=R.filter(x=>x.vencimento&&x.vencimento<hoje).sort((a,b)=>a.vencimento.localeCompare(b.vencimento));
  sec(G,{id:"receber",icone:"💰",titulo:"Recebimentos",nivel:rAtr.length?"alta":"media",rota:"receber",
    resumo:[rHoje.length&&`${rHoje.length} vence(m) hoje (${brlA(soma(rHoje))})`,rAtr.length&&`${rAtr.length} atrasado(s) (${brlA(soma(rAtr))})`].filter(Boolean).join(" · "),
    itens:[...rHoje.map(x=>({t:`Hoje · ${descR(x)}`,v:brlA(x.valor),s:x.numero?"boleto "+x.numero:""})),
           ...rAtr.map(x=>{const e=encargosA(x);return {t:`${dias(x.vencimento,hoje)} dia(s) de atraso · ${descR(x)}`,v:brlA(x.valor),s:(e?`atualizado ${brlA((x.valor||0)+e)}`:"")+(x.numero?(e?" · ":"")+"boleto "+x.numero:""),alerta:true}})]});
  // 2. pagamentos
  const pLim=addD(hoje,3);const pList=P.filter(x=>x.vencimento&&x.vencimento<=pLim).sort((a,b)=>(a.prioridade||3)-(b.prioridade||3)||a.vencimento.localeCompare(b.vencimento));
  sec(G,{id:"pagar",icone:"💸",titulo:"Contas a pagar (atrasadas e próximos 3 dias)",nivel:pList.some(x=>x.vencimento<hoje||x.prioridade===1)?"alta":"media",rota:"pagar",
    resumo:`${pList.length} conta(s) · ${brlA(soma(pList))}`+(pList.some(x=>x.prioridade===1)?` · ${pList.filter(x=>x.prioridade===1).length} de prioridade máxima`:""),
    itens:pList.map(x=>({t:`${x.vencimento<hoje?"Atrasada desde "+dt(x.vencimento):x.vencimento===hoje?"Hoje":dt(x.vencimento)} · ${[x.fornecedor,x.descricao].filter(Boolean).join(" · ")}`,v:brlA(x.valor),s:"Prioridade "+(PRI[x.prioridade]||"Baixa"),alerta:x.prioridade===1||x.vencimento<hoje}))});
  // 3. eventos em risco: nos próximos 30 dias com parcela em aberto
  const ev=(D.contratos||[]).filter(c=>c.status!=="cancelado"&&c.dataEvento>=hoje&&c.dataEvento<=addD(hoje,30)).map(c=>({c,ab:R.filter(r=>r.contratoId===c.id)})).filter(o=>o.ab.length).sort((a,b)=>a.c.dataEvento.localeCompare(b.c.dataEvento));
  sec(G,{id:"eventos",icone:"⚠️",titulo:"Eventos nos próximos 30 dias sem quitação",nivel:"alta",rota:"contratos",resumo:`${ev.length} evento(s) · falta receber ${brlA(ev.reduce((s,o)=>s+soma(o.ab),0))}`,
    itens:ev.map(o=>({t:`${dt(o.c.dataEvento)} (em ${dias(hoje,o.c.dataEvento)} dia(s)) · ${o.c.evento} · ${cli(o.c.clienteId)}`,v:brlA(soma(o.ab)),s:o.ab.some(p=>p.vencimento<hoje)?"tem parcela atrasada":"parcela em aberto",alerta:dias(hoje,o.c.dataEvento)<=15}))});
  // 4. caixa projetado
  const saldoC=c=>{const d0=c.saldoData||"0000-00-00";let s=c.saldoInicial||0;
    for(const x of D.receber||[])if(x.status==="pago"&&x.contaId===c.id&&(x.pagoEm||"")>d0)s+=(x.valorPago!=null?x.valorPago:x.valor)||0;
    for(const x of D.pagar||[])if(x.status==="pago"&&x.contaId===c.id&&(x.pagoEm||"")>d0)s-=(x.valorPago!=null?x.valorPago:x.valor)||0;
    for(const t of D.transf||[]){if((t.data||"")<=d0)continue;if(t.de===c.id)s-=t.valor||0;if(t.para===c.id)s+=t.valor||0}return s};
  if((D.contas||[]).length){const t30=addD(hoje,30);const bancos=(D.contas||[]).filter(c=>!c.inativa).reduce((s,c)=>s+saldoC(c),0);
    const proj=bancos+soma(R.filter(x=>x.vencimento<=t30))-soma(P.filter(x=>x.vencimento<=t30));
    if(proj<0)G.push({id:"caixa",icone:"📉",titulo:"Caixa projetado negativo",nivel:"alta",rota:"painel",resumo:`Saldo previsto em 30 dias: ${brlA(proj)}`,
      itens:[{t:`Bancos hoje ${brlA(bancos)} + a receber ${brlA(soma(R.filter(x=>x.vencimento<=t30)))} − a pagar ${brlA(soma(P.filter(x=>x.vencimento<=t30)))}`,v:brlA(proj),alerta:true}]})}
  // 5. conciliação parada
  const lim7=addD(hoje,-7);const pc={};
  for(const e of D.extrato||[]){const cid=e.contaId||String(e.id||"").split("_")[0];const t=e.t||{};for(const k in t){const x=t[k];if((!x.st||x.st==="pendente")&&x.d&&x.d<lim7)pc[cid]=(pc[cid]||0)+1}}
  sec(G,{id:"conciliacao",icone:"🏦",titulo:"Conciliação pendente há mais de 7 dias",nivel:"media",rota:"conciliacao",resumo:`${Object.values(pc).reduce((a,b)=>a+b,0)} movimento(s) do banco`,
    itens:Object.keys(pc).map(cid=>({t:(byId(D.contas,cid)||{}).nome||"Banco",v:`${pc[cid]} movimento(s)`}))});
  // 6. pedidos de acesso
  const ped=(D.pedidos||[]).filter(p=>p.status==="pendente");
  sec(G,{id:"pedidos",icone:"👤",titulo:"Pedidos de acesso",nivel:"media",rota:"orcamentos",resumo:`${ped.length} aguardando aprovação`,itens:ped.map(p=>({t:`${p.nome||p.id} · ${p.id}`,s:p.funcao||""}))});
  // 6b. contratos aguardando assinatura da gestão
  const assP=(D.contratos||[]).filter(c=>c.status!=="cancelado"&&c.assinatura&&c.assinatura.status==="pendente").sort((a,b)=>(a.assinatura.pedidoEm||"").localeCompare(b.assinatura.pedidoEm||""));
  sec(G,{id:"assinar",icone:"✍️",titulo:"Contratos aguardando sua assinatura",nivel:"alta",rota:"contratos",resumo:`${assP.length} contrato(s) para assinar`,
    itens:assP.map(c=>({t:`${c.evento} · ${cli(c.clienteId)}${c.dataEvento?" · evento "+dt(c.dataEvento):""}`,s:`pedido por ${resp(c.responsavelId)||"comercial"} em ${dt((c.assinatura.pedidoEm||"").slice(0,10))}`,v:brlA(c.valorTotal),alerta:dias((c.assinatura.pedidoEm||hoje).slice(0,10),hoje)>=2}))});
  // 7. alterações sensíveis (últimas 24h)
  const desde=new Date(new Date(hoje+"T08:00:00").getTime()-864e5).toISOString();const nomeP=e=>{const u=(D.usuarios||[]).find(u=>u.id===e);return (u&&u.nome)||e||"alguém"};
  const sens=(D.log||[]).filter(l=>(l.em||"")>=desde&&((l.acao==="excluiu"&&["contratos","receber","pagar","clientes"].includes(l.col))||(l.acao==="alterou"&&l.col==="contratos"&&(l.mudancas||[]).some(m=>m.c==="valor total"))||(l.acao==="alterou"&&l.col==="config"&&(l.mudancas||[]).some(m=>m.c==="fechado até"))));
  const COLN={contratos:"contrato",receber:"parcela",pagar:"conta a pagar",clientes:"cliente",config:"fechamento"};
  sec(G,{id:"sensivel",icone:"🔐",titulo:"Alterações sensíveis nas últimas 24h",nivel:"media",rota:"controle",resumo:`${sens.length} alteração(ões) para conferir`,
    itens:sens.map(l=>({t:`${nomeP(l.por)} ${l.acao} ${COLN[l.col]||l.col} · ${l.resumo||""}`,s:(l.mudancas||[]).filter(m=>m.c==="valor total"||m.c==="fechado até").map(m=>`${m.c}: ${m.de} → ${m.para}`).join("")}))});
  // 8. mês sem fechar
  const mesAnt=addD(hoje.slice(0,7)+"-01",-1).slice(0,7);
  if(dia>=10&&(cfg.fechadoAte||"")<mesAnt)G.push({id:"fechamento",icone:"📆",titulo:"Mês anterior ainda aberto",nivel:"media",rota:"controle",resumo:`Feche ${mesAnt.slice(5,7)}/${mesAnt.slice(0,4)} em Controle → Fechamento do mês`,itens:[{t:"Conferir conciliação e pendências, depois fechar o mês"}]});
  // 9. segunda-feira: semana
  if(dow===1){const fim=addD(hoje,6);const evs=(D.contratos||[]).filter(c=>c.status!=="cancelado"&&c.dataEvento>=hoje&&c.dataEvento<=fim);
    const ent=R.filter(x=>x.vencimento>=hoje&&x.vencimento<=fim),sai=P.filter(x=>x.vencimento>=hoje&&x.vencimento<=fim);
    G.push({id:"semana",icone:"📊",titulo:"Sua semana",nivel:"info",rota:"painel",resumo:`${evs.length} evento(s) · entradas previstas ${brlA(soma(ent))} · saídas previstas ${brlA(soma(sai))}`,
      itens:evs.sort((a,b)=>a.dataEvento.localeCompare(b.dataEvento)).map(c=>({t:`${dt(c.dataEvento)} · ${c.evento} · ${cli(c.clienteId)}`,s:c.convidados?c.convidados+" convidados":""}))})}
  // 10. início do mês: comissões e resultado do mês anterior
  if(dia===1||(dia===2&&dow===1)){const mA=mesAnt;const pagos=a=>a.filter(x=>x.status==="pago"&&(x.pagoEm||"").startsWith(mA)).reduce((s,x)=>s+((x.valorPago!=null?x.valorPago:x.valor)||0),0);
    const ent=pagos(D.receber||[]),sai=pagos(D.pagar||[]);const base=cfg.comissaoBase||"fechado";const com={};
    const pct=eid=>{const e=byId(D.equipe,eid);return e&&e.comissaoPct!=null&&e.comissaoPct!==""?Number(e.comissaoPct):Number(cfg.comissaoPct)||0};
    if(base==="recebido"){for(const p of D.receber||[])if(p.status==="pago"&&(p.pagoEm||"").startsWith(mA)&&p.contratoId){const c=contrato(p.contratoId);if(c&&c.responsavelId)com[c.responsavelId]=(com[c.responsavelId]||0)+((p.valorPago!=null?p.valorPago:p.valor)||0)}}
    else for(const c of D.contratos||[])if(c.status!=="cancelado"&&(c.dataAssinatura||"").startsWith(mA)&&c.responsavelId)com[c.responsavelId]=(com[c.responsavelId]||0)+(c.valorTotal||0);
    G.push({id:"mes",icone:"🗓️",titulo:`Fechamento de ${mA.slice(5,7)}/${mA.slice(0,4)}`,nivel:"info",rota:"resultados",resumo:`Recebido ${brlA(ent)} · pago ${brlA(sai)} · resultado ${brlA(ent-sai)}`,
      itens:Object.keys(com).map(eid=>({t:`Comissão · ${resp(eid)} (${String(pct(eid)).replace(".",",")}%)`,v:brlA(Math.round(com[eid]*pct(eid)/100))}))})}

  // ---------- por vendedor ----------
  const donoDe=x=>x.responsavelId||(String(x._o||"").startsWith("eq-")?String(x._o).slice(3):"");
  for(const e of D.equipe||[]){if(e.ativo===false)continue;const L=[];
    sec(L,agSec());
    const orc=(D.orcamentos||[]).filter(o=>donoDe(o)===e.id&&["aberto","enviado","negociacao"].includes(o.status));
    const ret=orc.filter(o=>o.proximoContato&&o.proximoContato<=hoje);
    sec(L,{id:"retornos",icone:"📞",titulo:"Retornos de orçamento para hoje",nivel:"alta",rota:"orcamentos",resumo:`${ret.length} cliente(s) para contatar`,
      itens:ret.map(o=>({t:`${o.numero||""} · ${o.contatoNome||cli(o.clienteId)||""}${o.evento?" · "+o.evento:""}`,v:o.valor?brlA(o.valor):"",s:[o.contatoTelefone||(cli(o.clienteId)&&(byId(D.clientes,o.clienteId)||{}).telefone),o.proximoContato<hoje?"retorno atrasado desde "+dt(o.proximoContato):""].filter(Boolean).join(" · "),alerta:o.proximoContato<hoje}))});
    const par=orc.filter(o=>o.status==="enviado"&&!(o.proximoContato&&o.proximoContato>=hoje)&&((o.atualizadoEm||o.criadoEm||"").slice(0,10)||o.data||hoje)<=addD(hoje,-7)&&!ret.includes(o));
    sec(L,{id:"parados",icone:"💤",titulo:"Orçamentos parados há 7 dias ou mais",nivel:"media",rota:"orcamentos",resumo:`${par.length} sem novidade`,
      itens:par.map(o=>({t:`${o.numero||""} · ${o.contatoNome||cli(o.clienteId)||""}${o.evento?" · "+o.evento:""}`,v:o.valor?brlA(o.valor):""}))});
    const evv=(D.contratos||[]).filter(c=>donoDe(c)===e.id&&c.status!=="cancelado"&&c.dataEvento>=hoje&&c.dataEvento<=addD(hoje,15)).map(c=>({c,ab:R.filter(r=>r.contratoId===c.id)})).filter(o=>o.ab.length);
    sec(L,{id:"eventosv",icone:"📅",titulo:"Eventos dos seus clientes com parcela em aberto",nivel:"alta",rota:"contratos",resumo:`${evv.length} evento(s) nos próximos 15 dias`,
      itens:evv.map(o=>({t:`${dt(o.c.dataEvento)} · ${o.c.evento} · ${cli(o.c.clienteId)}`,v:brlA(soma(o.ab)),alerta:true}))});
    const ass=(D.contratos||[]).filter(c=>donoDe(c)===e.id&&c.assinatura&&c.assinatura.status==="assinado"&&(c.assinatura.assinadoEm||"").slice(0,10)>=addD(hoje,-3));
    sec(L,{id:"assinados",icone:"✅",titulo:"Contratos assinados pela gestão",nivel:"info",rota:"contratos",resumo:`${ass.length} pronto(s) para enviar ao cliente`,
      itens:ass.map(c=>({t:`${c.evento} · ${cli(c.clienteId)}`,s:"assinado em "+dt((c.assinatura.assinadoEm||"").slice(0,10))}))});
    const espera=(D.contratos||[]).filter(c=>donoDe(c)===e.id&&c.status!=="cancelado"&&c.assinatura&&c.assinatura.status==="pendente");
    sec(L,{id:"esperando",icone:"⏳",titulo:"Aguardando assinatura da gestão",nivel:"info",rota:"contratos",resumo:`${espera.length} contrato(s)`,
      itens:espera.map(c=>({t:`${c.evento} · ${cli(c.clienteId)}`,s:"pedido em "+dt((c.assinatura.pedidoEm||"").slice(0,10))}))});
    if(L.length)V[e.id]=L;
  }
  return {gestao:G,vendedores:V};
}


/* ---------- e-mail ---------- */
function html_(titulo, saudacao, secoes) {
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cor = { alta: '#b42318', media: '#1f4d3a', info: '#555' };
  let h = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#1d2420">'
    + '<div style="font-family:Georgia,serif;font-style:italic;font-size:20px;color:#1f4d3a;margin:8px 0 2px">Bosco · Gestão comercial e financeira</div>'
    + '<div style="color:#667;font-size:13px;margin-bottom:14px">' + esc(titulo) + '</div>'
    + '<p style="font-size:14px">' + esc(saudacao) + '</p>';
  for (const g of secoes) {
    h += '<div style="border:1px solid #e3e7e4;border-radius:10px;padding:12px 14px;margin:10px 0">'
      + '<div style="font-size:15px;font-weight:bold;color:' + (cor[g.nivel] || '#1d2420') + '">' + g.icone + ' ' + esc(g.titulo) + '</div>'
      + '<div style="font-size:12.5px;color:#667;margin:2px 0 8px">' + esc(g.resumo || '') + '</div>';
    for (const i of g.itens.slice(0, 8)) {
      h += '<div style="display:flex;justify-content:space-between;gap:10px;font-size:13px;padding:3px 0;border-top:1px dashed #eef1ef">'
        + '<span>' + esc(i.t) + (i.s ? ' <span style="color:#889">· ' + esc(i.s) + '</span>' : '') + '</span>'
        + (i.v ? '<b style="white-space:nowrap">' + esc(i.v) + '</b>' : '') + '</div>';
    }
    if (g.itens.length > 8) h += '<div style="font-size:12px;color:#889;margin-top:4px">+ ' + (g.itens.length - 8) + ' outro(s)</div>';
    h += '<div style="margin-top:8px"><a href="' + SITE + '/#' + g.rota + '" style="font-size:12.5px;color:#1f4d3a">Abrir no sistema →</a></div></div>';
  }
  h += '<p style="font-size:11.5px;color:#99a;margin-top:18px">E-mail automático enviado de segunda a sábado. Para desligar, a gestão pode mudar em Controle → Configurações.</p></div>';
  return h;
}
function hojeSP_() { return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd'); }
function dataLonga_(iso) { const d = new Date(iso + 'T12:00:00'); const S = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado']; const M = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']; return S[d.getDay()] + ', ' + d.getDate() + ' de ' + M[d.getMonth()]; }

function enviarAlertas(soTeste) {
  const hoje = hojeSP_();
  const dow = new Date(hoje + 'T12:00:00').getDay();
  if (!soTeste && dow === 0) return; // domingo: não envia
  const D = carregar_();
  const A = montarAlertas(D, hoje);
  const cfg = D.config || {};
  const enviados = [];
  // gestão
  const gestao = [...new Set([FIXO_GESTAO].concat(D.usuarios.filter(u => u.perfil === 'gestao').map(u => u.id)))];
  const destGestao = soTeste ? [Session.getActiveUser().getEmail() || FIXO_GESTAO] : gestao;
  if ((cfg.alertaGestao !== false || soTeste) && (A.gestao.length || soTeste)) {
    const titulo = 'Resumo de ' + dataLonga_(hoje);
    const resumo = A.gestao.length ? A.gestao.filter(g => g.nivel === 'alta').map(g => g.titulo).join(', ') : '';
    const corpo = A.gestao.length ? html_(titulo, 'Bom dia! Estes são os pontos de atenção de hoje' + (resumo ? ' (destaque: ' + resumo + ').' : '.'), A.gestao)
      : html_(titulo, 'Bom dia! Nada vencendo, atrasado ou pendente hoje. ✓', []);
    for (const to of destGestao) { MailApp.sendEmail({ to: to, subject: (soTeste ? '[TESTE] ' : '') + 'Bosco · Resumo do dia · ' + hoje.slice(8, 10) + '/' + hoje.slice(5, 7) + (A.gestao.some(g => g.nivel === 'alta') ? ' · atenção' : ''), htmlBody: corpo, name: 'Bosco · Gestão' }); enviados.push(to); }
  }
  // vendedores
  if (!soTeste && cfg.alertaVendedores !== false) {
    for (const u of D.usuarios.filter(u => u.perfil === 'comercial' && u.equipeId)) {
      const L = A.vendedores[u.equipeId]; if (!L || !L.length) continue;
      const nome = (u.nome || '').split(' ')[0];
      MailApp.sendEmail({ to: u.id, subject: 'Bosco · Seus retornos e eventos · ' + hoje.slice(8, 10) + '/' + hoje.slice(5, 7), name: 'Bosco · Gestão',
        htmlBody: html_('Seu dia · ' + dataLonga_(hoje), 'Bom dia' + (nome ? ', ' + nome : '') + '! Estes são os seus pontos de hoje.', L) });
      enviados.push(u.id);
    }
  }
  console.log('Enviado para: ' + (enviados.join(', ') || 'ninguém (nada a avisar)'));
  return enviados;
}

/* ---------- comandos para rodar pelo editor ---------- */
function testar() { // manda agora, só para você, o resumo da gestão (mesmo vazio)
  const r = enviarAlertas(true);
  console.log('Teste enviado para ' + r.join(', ') + '. Confira sua caixa de entrada.');
}
function instalar() { // agenda o envio diário entre 8h e 9h (horário de Brasília)
  ScriptApp.requireAllScopes(ScriptApp.AuthMode.FULL);
  for (const t of ScriptApp.getProjectTriggers()) if (t.getHandlerFunction() === 'enviarAlertasDiario') ScriptApp.deleteTrigger(t);
  ScriptApp.newTrigger('enviarAlertasDiario').timeBased().everyDays(1).atHour(8).nearMinute(30).inTimezone('America/Sao_Paulo').create();
  console.log('Pronto: o resumo será enviado todo dia entre 8h e 9h (exceto domingo).');
}
function desinstalar() {
  for (const t of ScriptApp.getProjectTriggers()) ScriptApp.deleteTrigger(t);
  console.log('Envio diário desligado.');
}
function enviarAlertasDiario() { enviarAlertas(false); }

/* =====================================================================
 * Agenda Google <-> Agenda do sistema (opcional, só contas @boscoeventos.com.br)
 * Cada pessoa conecta pelo sistema (Agenda → "Conectar minha agenda Google") e compartilha a agenda dela com
 * financeiro@ com a permissão "Fazer alterações nos eventos". A cada 10 minutos este script:
 *  - traz para o sistema os compromissos da agenda Google (de 30 dias atrás até 6 meses à frente; particulares não vêm);
 *  - leva para a agenda Google o que foi marcado no sistema com "Colocar também na agenda Google de";
 *  - leva para lá as alterações e exclusões feitas no sistema, e traz as feitas lá.
 * ===================================================================== */
const DOMINIO_AG = '@boscoeventos.com.br';
const TZ = 'America/Sao_Paulo';

function req_(method, url, payload) {
  const opt = { method: method, muteHttpExceptions: true, contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Goog-User-Project': PROJETO } };
  if (payload) opt.payload = JSON.stringify(payload);
  const r = UrlFetchApp.fetch(url, opt);
  if (r.getResponseCode() >= 300 && r.getResponseCode() !== 404) throw new Error('Firestore ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 300));
  return JSON.parse(r.getContentText() || '{}');
}
function fsv_(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(fsv_) } };
  if (typeof v === 'object') { const f = {}; for (const k in v) if (v[k] !== undefined) f[k] = fsv_(v[k]); return { mapValue: { fields: f } }; }
  return { stringValue: String(v) };
}
function salvarDoc_(caminho, obj) { // grava o documento inteiro
  const f = {}; for (const k in obj) if (k !== 'id' && k !== '_o' && obj[k] !== undefined) f[k] = fsv_(obj[k]);
  req_('patch', BASE + '/' + caminho, { fields: f });
}
function apagarDoc_(caminho) { req_('delete', BASE + '/' + caminho); }

function tipoDe_(t) {
  t = (t || '').toLowerCase();
  if (/degust/.test(t)) return 'degustacao';
  if (/visita t[eé]cnica|t[eé]cnica/.test(t)) return 'tecnica';
  if (/visita/.test(t)) return 'visita';
  if (/prova|card[aá]pio/.test(t)) return 'cardapio';
  if (/assinatura|assinar/.test(t)) return 'assinatura';
  if (/interna|equipe|alinhamento/.test(t)) return 'interna';
  if (/reuni/.test(t)) return 'reuniao';
  return 'outro';
}
function idDe_(cal, evId) {
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, cal + '|' + evId);
  return 'g_' + b.map(x => ((x + 256) % 256).toString(16).padStart(2, '0')).join('').slice(0, 20);
}
function dadosDoEvento_(ev) {
  const ini = ev.getStartTime(), fim = ev.getEndTime(), dia = ev.isAllDayEvent();
  return { titulo: ev.getTitle() || '(sem título)', data: Utilities.formatDate(ini, TZ, 'yyyy-MM-dd'),
    inicio: dia ? '' : Utilities.formatDate(ini, TZ, 'HH:mm'), fim: dia ? '' : Utilities.formatDate(fim, TZ, 'HH:mm'),
    local: ev.getLocation() || '', obs: (ev.getDescription() || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1000) };
}
function aplicarNoEvento_(ev, a) {
  ev.setTitle(a.titulo || 'Compromisso');
  if (a.inicio) {
    const ini = new Date(a.data + 'T' + a.inicio + ':00-03:00');
    const fim = a.fim && a.fim > a.inicio ? new Date(a.data + 'T' + a.fim + ':00-03:00') : new Date(ini.getTime() + 3600e3);
    ev.setTime(ini, fim);
  } else ev.setAllDayDate(new Date(a.data + 'T12:00:00-03:00'));
  ev.setLocation(a.local || '');
  ev.setDescription(descricao_(a));
}
function descricao_(a) {
  return [a.contatoNome && 'Contato: ' + a.contatoNome, a.telefone && 'Telefone: ' + a.telefone, a.pessoas && 'Pessoas: ' + a.pessoas, a.obs, 'Marcado no sistema Bosco · ' + SITE + '/#agenda'].filter(Boolean).join('\n');
}
function criarEvento_(cal, a) {
  let ev;
  if (a.inicio) {
    const ini = new Date(a.data + 'T' + a.inicio + ':00-03:00');
    const fim = a.fim && a.fim > a.inicio ? new Date(a.data + 'T' + a.fim + ':00-03:00') : new Date(ini.getTime() + 3600e3);
    ev = cal.createEvent(a.titulo || 'Compromisso', ini, fim, { location: a.local || '', description: descricao_(a) });
  } else ev = cal.createAllDayEvent(a.titulo || 'Compromisso', new Date(a.data + 'T12:00:00-03:00'), { location: a.local || '', description: descricao_(a) });
  return ev;
}
function iso_(d) { return d ? new Date(d).toISOString() : ''; }

function sincronizarAgendas() {
  const lock = LockService.getScriptLock(); if (!lock.tryLock(5000)) return;
  try {
    const conectados = colecao_('agendaGoogle').filter(g => g.ativo && String(g.id).endsWith(DOMINIO_AG));
    const usuarios = colecao_('usuarios');
    let agenda = colecao_('agenda');
    const agora = new Date(), de = new Date(agora.getTime() - 30 * 864e5), ate = new Date(agora.getTime() + 180 * 864e5);
    const deIso = Utilities.formatDate(de, TZ, 'yyyy-MM-dd'), ateIso = Utilities.formatDate(ate, TZ, 'yyyy-MM-dd');
    for (const g of conectados) {
      const email = g.id; let erro = '';
      try {
        const cal = CalendarApp.getCalendarById(email);
        if (!cal) throw new Error('a agenda ainda não foi compartilhada com financeiro@ (permissão "Fazer alterações nos eventos")');
        const u = usuarios.find(x => x.id === email) || {};
        const eventos = cal.getEvents(de, ate);
        const vistos = new Set();
        // 1) Google -> sistema (e alterações do sistema -> Google)
        for (const ev of eventos) {
          if (ev.getVisibility && String(ev.getVisibility()) === 'PRIVATE') continue;
          const rec = ev.isRecurringEvent(); // repetições: uma linha por dia, só leitura
          const evId = rec ? ev.getId() + '@' + Utilities.formatDate(ev.getStartTime(), TZ, 'yyyy-MM-dd') : ev.getId(); vistos.add(evId);
          const docId = idDe_(email, evId);
          const atual = agenda.find(a => a.id === docId) || agenda.find(a => a.gcalId === evId && a.gcalCal === email);
          const upd = iso_(ev.getLastUpdated());
          if (!atual) {
            const d = dadosDoEvento_(ev);
            salvarDoc_('agenda/' + docId, Object.assign({ tipo: tipoDe_(d.titulo), status: 'marcado', pessoas: 0, contatoNome: '', telefone: '', responsavelId: u.equipeId || '',
              origem: 'google', recorrente: rec, gcalId: evId, gcalCal: email, gcalUpd: upd, gcalSync: new Date().toISOString(), criadoEm: new Date().toISOString(), criadoPor: email }, d));
            continue;
          }
          if (atual.excluido) continue; // tratado abaixo
          const mexeuAqui = (atual.atualizadoEm || '') > (atual.gcalSync || '');
          const mexeuLa = upd > (atual.gcalUpd || '');
          if (mexeuAqui && rec) {
            salvarDoc_('agenda/' + atual.id, Object.assign({}, atual, { gcalSync: new Date(Date.now() + 1000).toISOString() })); // não altera a série no Google
          } else if (mexeuAqui) {
            aplicarNoEvento_(ev, atual);
            const caminho = 'agenda/' + atual.id;
            salvarDoc_(caminho, Object.assign({}, atual, { gcalUpd: iso_(ev.getLastUpdated()), gcalSync: new Date(Date.now() + 1000).toISOString() }));
          } else if (mexeuLa) {
            salvarDoc_('agenda/' + atual.id, Object.assign({}, atual, dadosDoEvento_(ev), { gcalUpd: upd, gcalSync: new Date(Date.now() + 1000).toISOString(), atualizadoEm: new Date().toISOString() }));
          }
        }
        // 2) apagados no Google -> apaga no sistema
        for (const a of agenda.filter(a => a.gcalCal === email && a.gcalId && !a.excluido && a.data >= deIso && a.data <= ateIso))
          if (!vistos.has(a.gcalId)) apagarDoc_('agenda/' + a.id);
        // 3) marcados no sistema para ir para esta agenda -> cria no Google
        for (const a of agenda.filter(a => a.agendaDe === email && !a.gcalId && !a.excluido && a.data)) {
          const ev = criarEvento_(cal, a);
          salvarDoc_('agenda/' + a.id, Object.assign({}, a, { gcalId: ev.getId(), gcalCal: email, gcalUpd: iso_(ev.getLastUpdated()), gcalSync: new Date(Date.now() + 1000).toISOString() }));
        }
        // 4) excluídos no sistema -> apaga no Google
        for (const a of agenda.filter(a => a.excluido && a.gcalCal === email)) {
          if (!a.recorrente) try { const ev = cal.getEventById(a.gcalId); if (ev) ev.deleteEvent(); } catch (e) {}
          apagarDoc_('agenda/' + a.id);
        }
      } catch (e) { erro = String(e && e.message || e).slice(0, 200); }
      salvarDoc_('agendaGoogle/' + email, Object.assign({}, g, { sincEm: new Date().toISOString(), erro: erro }));
    }
    // excluídos no sistema que nunca foram para o Google
    agenda = colecao_('agenda');
    for (const a of agenda.filter(a => a.excluido && !a.gcalId)) apagarDoc_('agenda/' + a.id);
  } finally { lock.releaseLock(); }
}
function instalarAgenda() { // sincroniza a cada 10 minutos
  ScriptApp.requireAllScopes(ScriptApp.AuthMode.FULL); // pede de novo qualquer permissão que tenha ficado desmarcada
  for (const t of ScriptApp.getProjectTriggers()) if (t.getHandlerFunction() === 'sincronizarAgendas') ScriptApp.deleteTrigger(t);
  ScriptApp.newTrigger('sincronizarAgendas').timeBased().everyMinutes(10).create();
  sincronizarAgendas();
  console.log('Pronto: as agendas Google conectadas serão sincronizadas a cada 10 minutos.');
}
function desinstalarAgenda() {
  for (const t of ScriptApp.getProjectTriggers()) if (t.getHandlerFunction() === 'sincronizarAgendas') ScriptApp.deleteTrigger(t);
  console.log('Sincronização das agendas desligada.');
}
