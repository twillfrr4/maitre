## 1. Apresentação

O sistema concentra em um só lugar o ciclo comercial e financeiro da Bosco: do primeiro orçamento ao pagamento conciliado no extrato. Ele funciona no navegador, sem instalação, em [maitre.boscoeventos.com.br](https://maitre.boscoeventos.com.br).

| Item | Detalhe |
| --- | --- |
| Endereço | maitre.boscoeventos.com.br (computador, tablet ou celular) |
| Empresas | Bosco Gastronomia e Eventos LTDA (CNPJ 42.151.989/0001-84) e Espaço de Eventos Bosco LTDA (CNPJ 45.430.983/0001-34) |
| Quem usa | Gestão (financeiro e sócios) e Comercial (vendedores) |
| Dados | Salvos na nuvem do Google (Firebase), com backup automático diário e semanal |

**Como ler este manual.** As seções seguem o menu lateral do sistema, de cima para baixo. Os nomes de botões aparecem em **negrito**, exatamente como na tela. Use a busca acima para achar um assunto. Para abrir o manual, clique em **? Ajuda** no topo de qualquer tela: ele abre direto na parte que explica aquela tela.

**Atualizações.** Quando o sistema ganhar uma função nova, aperte **Ctrl+Shift+R** (no Mac, Cmd+Shift+R) para carregar a versão mais recente.

## 2. Acesso e perfis

Todo acesso é feito com uma conta Google e precisa ser aprovado pela Gestão. Pode ser e-mail @boscoeventos.com.br ou Gmail.

**Primeiro acesso de um colaborador**

1. O colaborador abre o endereço do sistema e clica em **Entrar com Google**.
2. Sem aprovação, aparece o formulário de pedido de acesso. Ele preenche nome, telefone e função e envia.
3. A Gestão recebe um aviso no topo da tela (botão **Ver pedidos**) e em **Orçamentos** → **Equipe**.
4. A Gestão escolhe o perfil, liga a pessoa a uma equipe de vendas (se for do comercial) e aprova.
5. Na próxima vez que entrar, o colaborador já vê o sistema.

**Perfis**

| Perfil | O que vê e faz |
| --- | --- |
| Gestão | Tudo: comercial, financeiro, bancos, resultados, controle e equipe |
| Gestão, sem carteira de vendas | Igual à Gestão, mas não aparece como vendedor nos orçamentos e contratos |
| Comercial | Os próprios orçamentos, contratos, clientes e recebimentos, a Agenda e as contas a pagar que ele mesmo lançou. Não vê bancos, saldos nem resultados |
| Cozinha (só o Mise) | Apenas o Mise (etiquetas, validades e estoque), no endereço maitre.boscoeventos.com.br/mise/. Não vê nada do sistema comercial e financeiro |

**Mise (estoque e etiquetas da cozinha).** É um sistema à parte, em maitre.boscoeventos.com.br/mise/, que usa o mesmo login. Quem pede acesso pela tela do Mise aparece em **Equipe** com o perfil **Cozinha** já escolhido; basta aprovar. A Gestão também entra no Mise com a própria conta.

**Alterar ou remover um acesso.** **Orçamentos** → **Equipe** → altere o perfil da pessoa ou use **Tirar acesso**. Ela deixa de entrar na hora.

**Seus dados.** No canto inferior esquerdo, abaixo da sua foto e do seu nome, o link **Seus dados** abre o seu cadastro. Cada pessoa atualiza ali o nome que aparece no sistema, a foto (arraste para posicionar e use a barra para aproximar), telefone, data de nascimento, endereço e contato de emergência. Esses dados são vistos só pela Gestão, em **Orçamentos** → **Equipe**. Ninguém consegue mudar o próprio perfil de acesso por ali.

**Sair.** Use **Sair**, no canto inferior esquerdo, sempre que usar um computador compartilhado.

## 3. Primeiros passos e configurações

Antes de lançar o dia a dia, a Gestão configura quatro itens. Cada um leva poucos minutos e deixa saldos, cobranças e relatórios corretos desde o início.

1. **Contas bancárias.** Menu **Bancos** → **+ Conta bancária**. Informe o nome (ex.: Sicredi), a **empresa (CNPJ)** dona da conta, agência, conta e uma cor. A identificação do extrato OFX é preenchida sozinha na primeira importação.
2. **Multa, juros e comissão.** Menu **Controle** → aba **Configurações**:
    - Multa por atraso: até 2%, limite do Código de Defesa do Consumidor.
    - Juros ao mês: comum 1%, calculado proporcionalmente aos dias.
    - Comissão padrão (%) e a base de cálculo: contratos assinados no mês ou valores recebidos no mês.
    - E-mail diário de alertas para a gestão e para cada vendedor.
3. **Equipe e comissão individual.** **Orçamentos** → **Equipe**: cadastre cada vendedor. Quem tiver percentual próprio usa ele; os demais usam o padrão.
4. **Fornecedores.** Menu **Clientes** → aba **Fornecedores**: cadastre os fornecedores recorrentes com CNPJ, categoria e chave PIX. O cadastro acelera o DDA e as contas a pagar.

**Filtro de empresa.** No canto superior direito há o seletor **Todas as empresas**. Escolha uma empresa para ver só os números dela. O sistema lembra a escolha neste computador.

**Tema.** O botão **Tema**, no canto inferior esquerdo, troca as cores da tela. Não altera nenhum dado.

## 4. Painel e Avisos de hoje

O Painel é a primeira tela do dia: mostra a situação do caixa e lista, em **Avisos de hoje**, tudo o que pede ação. Cada aviso tem um link que leva direto à tela onde se resolve.

**Indicadores do Painel (Gestão).** Saldo consolidado dos bancos, valores a receber e a pagar, eventos próximos e o caixa projetado para os próximos 30 dias.

**Avisos para a Gestão**

| Aviso | Quando aparece | Onde resolver |
| --- | --- | --- |
| Agenda | Compromissos de hoje e de amanhã | Agenda |
| Conferência de saldos | Banco com pagamento marcado que não aparece no extrato | Bancos → Verificar |
| Possíveis duplicados | Lançamentos com o mesmo valor e datas próximas | A pagar / A receber → Revisar |
| Recebimentos | Parcelas vencidas ou vencendo | A receber |
| Contas a pagar | Atrasadas, vencendo em até 3 dias ou com prioridade 1 | A pagar |
| Eventos sem quitação | Evento nos próximos 30 dias com parcela em aberto | Contratos |
| Caixa projetado negativo | Saldo previsto em 30 dias abaixo de zero | Painel |
| Conciliação pendente | Banco sem extrato conciliado há mais de 7 dias | Conciliação |
| Pedidos de acesso | Alguém pediu acesso ao sistema | Orçamentos → Equipe |
| Contratos para assinar | O comercial pediu a assinatura da gestão | Contratos |
| Alterações sensíveis | Exclusões ou mudanças em valores nas últimas 24 horas | Controle |
| Mês anterior aberto | A partir do dia 10, se o mês anterior não foi fechado | Controle |

**Avisos para o Comercial**

| Aviso | Quando aparece |
| --- | --- |
| Agenda | Compromissos de hoje e de amanhã |
| Retornos de orçamento para hoje | Data de retorno marcada no orçamento |
| Orçamentos parados | 7 dias ou mais sem novidade |
| Eventos com parcela em aberto | Evento de um cliente seu ainda não quitado |
| Contratos assinados pela gestão | Prontos para enviar ao cliente |

## 5. Agenda

A Agenda reúne degustações, reuniões e visitas em um só lugar, e toda a equipe vê a mesma agenda.

**Marcar um compromisso**

1. **Agenda** → **+ Novo compromisso**, ou o botão **Agendar** direto na linha do orçamento ou do contrato.
2. Escolha o tipo: Degustação, Reunião com cliente, Visita ao espaço, Visita técnica, Prova ou ajuste de cardápio, Assinatura de contrato, Reunião interna ou Outro.
3. Em **Ligado a**, escolha o orçamento ou contrato: contato, telefone e responsável são preenchidos sozinhos.
4. Informe data, início e número de pessoas. O fim é sugerido (degustação: 2 horas; demais: 1 hora).
5. Escolha o **Responsável** (vendedores e gestão) e clique em **Salvar compromisso**.

**Em cada compromisso**

| Botão | O que faz |
| --- | --- |
| Confirmar no WhatsApp | Abre a conversa com o cliente e uma mensagem pronta de confirmação, com dia, hora e local |
| Agenda Google | Abre o compromisso já preenchido na sua agenda Google; é só clicar em Salvar |
| Editar | Muda dados ou a situação: Marcado, Confirmado, Realizado ou Cancelado |

**Visualizações:** Próximos, Hoje, Próximos 7 dias, **Mês** (calendário; clique no número do dia para marcar ali), Passados e Todos, com filtro por tipo e busca.

**Agenda Google (opcional, só e-mails @boscoeventos.com.br).** Quem quiser pode ligar a própria agenda Google ao sistema. Os compromissos de lá aparecem aqui com a etiqueta “Google”, e os marcados aqui com “Colocar também na agenda Google de” vão para lá. Alterações e exclusões seguem nos dois sentidos, a cada 10 minutos. Compromissos particulares não vêm.

1. **Agenda** → **Conectar minha agenda Google**.
2. Na agenda Google (calendar.google.com → Configurações), clique na sua agenda → **Compartilhar com pessoas ou grupos específicos** → **+ Adicionar pessoas e grupos** → financeiro@boscoeventos.com.br → permissão **Fazer alterações nos eventos** → **Enviar**.
3. No sistema, clique em **Já compartilhei, conectar**. O cartão “Minha agenda Google” mostra a última sincronização ou, em vermelho, o que precisa ser corrigido.

Para desligar, use **Desconectar** no mesmo cartão.

## 6. Clientes e fornecedores

Clientes e fornecedores ficam em cadastros separados, em duas abas do mesmo menu. O Comercial vê apenas os próprios clientes; a aba de fornecedores é só da Gestão.

**Cliente** — **Novo cliente**: nome ou razão social, CPF/CNPJ, telefone, e-mail e endereço completo (usado no contrato). O cliente também pode ser criado na hora de fechar um orçamento.

**Fornecedor** — aba **Fornecedores** → **Novo fornecedor**:

| Campo | Para que serve |
| --- | --- |
| Nome / Razão social e CPF/CNPJ | Reconhecer o fornecedor no DDA e nas contas a pagar |
| Categoria padrão | Preenchida sozinha em cada conta nova desse fornecedor |
| Contato, telefone e e-mail | Falar com o fornecedor |
| Chave PIX e dados bancários | Preencher a chave PIX nas contas a pagar e no botão **Copiar PIX** |
| Observações | Combinações de prazo, desconto ou entrega |

**Cadastrar fornecedores de uma vez.** Na aba **Fornecedores**, o botão **Trazer de A pagar** cria um cadastro para cada nome já usado em A pagar. Depois é só completar CNPJ, contato e PIX.

**Excluir.** Excluir um fornecedor não apaga as contas dele. Um cliente com contrato não pode ser excluído.

## 7. Orçamentos

O orçamento registra cada negociação do primeiro contato até o fechamento. Quando o cliente aceita, ele vira contrato com um clique, sem redigitar nada.

**Criar um orçamento** — **Novo orçamento**:

1. O número é reservado sozinho na hora de salvar.
2. Escolha um cliente já cadastrado ou deixe **novo contato** e informe nome, telefone e e-mail.
3. Preencha tipo e nome do evento, data, convidados, local e o **valor orçado**.
4. Escolha o **responsável** pela venda e **como chegou** (origem do contato).
5. Marque a **situação** e a data do **próximo contato**, que vira lembrete em Avisos de hoje.
6. Descreva a proposta ou o cardápio e anexe o orçamento em PDF ou Word.

**Situações do orçamento**

| Situação | Significado |
| --- | --- |
| Em elaboração | Ainda não enviado ao cliente |
| Enviado | Cliente recebeu a proposta |
| Em negociação | Cliente pediu ajustes ou está decidindo |
| Fechado | Virou contrato (automático, pelo botão Fechar → contrato) |
| Perdido | Não fechou; o motivo da perda é obrigatório |

**Agendar.** Abre um compromisso na Agenda (degustação, por exemplo) já ligado ao orçamento.

**Fechar → contrato.** Abre o contrato já preenchido com os dados do orçamento. Ao salvar o contrato, o orçamento fica como fechado.

**Relatório de conversão.** Quantos orçamentos viraram contrato, por período, responsável e origem, e os motivos de perda.

## 8. Contratos

Cada contrato gera sozinho as parcelas de entrada e quitação em A receber. Aditivos, cancelamentos e a assinatura da gestão ficam registrados no próprio contrato.

**Cadastrar** — **Novo contrato** (ou **Fechar → contrato** em Orçamentos):

| Campo | Observação |
| --- | --- |
| Cliente | Escolha na lista ou use **+ Cliente** |
| Evento, data, local, convidados | Aparecem nos avisos e nos resultados |
| Empresa que fatura | Bosco Gastronomia ou Espaço de Eventos |
| Valor total e Entrada (%) | Padrão de 40% de entrada |
| Vencimento da entrada e da quitação | Quitação padrão: 30 dias antes do evento |
| Banco dos boletos | Conta onde os pagamentos vão cair |
| Responsável pela venda | Base da comissão |

O botão **Salvar e gerar parcelas** cria a entrada e a quitação em A receber.

**Aditivo** — abra o contrato → **+ Aditivo**. Informe a data, o valor (negativo para redução, ex.: -1.500,00), o que mudou e, se for o caso, o novo total de convidados. Escolha se o valor soma na quitação ou gera uma parcela nova.

**Cancelamento** — mude a situação para **Cancelado** e informe o motivo. O sistema mostra quanto já foi recebido e cancela as parcelas em aberto. A Gestão registra o valor a devolver; o que não for devolvido fica como retido.

**Documentos** — o ícone de clipe em cada contrato guarda contrato, propostas e outros arquivos (PDF, Word, Excel ou imagem).

**Assinatura pela Gestão**

1. O Comercial marca **Precisa da assinatura da gestão** ao salvar o contrato com o arquivo anexado.
2. A Gestão recebe o aviso e o contrato aparece na aba **Aguardando assinatura**.
3. A Gestão baixa o arquivo, assina (à mão e digitaliza, pelo gov.br ou certificado digital), anexa a versão assinada e marca **Já assinei e anexei a versão assinada**.
4. O contrato passa a mostrar **✓ Assinado**, e o vendedor é avisado para enviar ao cliente.

Só a Gestão consegue marcar ou alterar a assinatura de um contrato.

## 9. A receber

A receber lista todas as parcelas de clientes, com vencimento, situação e valor atualizado com multa e juros quando atrasam. Os boletos são emitidos na plataforma do banco; o sistema prepara os dados e controla a baixa.

**Emitir o boleto no banco**

1. Na parcela, clique em **Dados p/ banco**.
2. O sistema mostra número do boleto, nome, CPF/CNPJ, endereço, valor e vencimento, prontos para copiar.
3. Cole os dados no internet banking e gere o boleto.

**Cobrar pelo WhatsApp** — botão **Lembrete**. A mensagem já vem com o valor atualizado; o envio é sempre feito por você.

**Dar baixa** — **Marcar pago**: informe a data, o valor pago e o banco.

- Pagamento menor que a parcela: marque a opção de gerar o restante e escolha o novo vencimento.
- Errou a baixa: **Desfazer** volta a parcela para em aberto.
- O mais prático é dar baixa pela **Conciliação**, direto do extrato.

**Cobrança avulsa** — para valores fora de contrato (ex.: locação de espaço, taxa extra).

## 10. A pagar

A pagar reúne fornecedores, equipe, contas fixas e impostos. Há três formas de lançar: uma conta por vez, o DDA do banco ou a equipe em lote.

**Comercial em A pagar.** O vendedor lança contas a pagar (**+ Conta a pagar**) e vê apenas as que ele mesmo criou. Ele pode editar ou excluir enquanto a conta estiver em aberto; banco, baixa e pagamento ficam com a Gestão, que vê todas as contas.

**Uma conta por vez** — **+ Conta a pagar**: fornecedor, empresa, descrição, categoria, valor, vencimento, prioridade, forma de pagamento, banco, chave PIX e evento (opcional, para o custo entrar no resultado do evento). Se já existir uma conta parecida, o formulário avisa na hora.

**Prioridades**

| Prioridade | Uso |
| --- | --- |
| Máxima | Impostos, folha, contas que não podem atrasar |
| Média | Padrão para a maioria das contas |
| Baixa | Pode esperar se o caixa apertar |
| Spam | Boleto falso ou indevido do DDA: fica como cancelado |

**Importar DDA** — aceita o PDF do Sicredi e do Viacredi e listas em texto ou CSV. O sistema identifica a empresa pelo CNPJ do pagador e o fornecedor pelo CNPJ ou nome. Cada boleto vira uma conta com o código de barras guardado (botão **Copiar código**).

**Equipe em lote** — para pagar garçons, cozinha e freelancers de uma vez.

1. Copie a lista da planilha (Ctrl+C) ou do WhatsApp (nome, “Chave pix:” e “Valor:”).
2. **A pagar** → **Equipe em lote** → cole (Ctrl+V).
3. Escolha o evento (opcional), a categoria, a data, a forma, o banco e, se já pagou, marque **Já foram pagos**.
4. **Conferir**: revise nome, chave PIX, descrição, data e valor de cada pessoa.
5. **Lançar**. Quem já estava lançado aparece desmarcado; se faltava a chave PIX, ela é adicionada sem duplicar.

**Copiar PIX** — a chave sai no formato que o app do banco aceita: CPF e CNPJ só com números, celular com +55, e-mail como está.

**Lotes lançados** — lista cada uso do Equipe em lote. Lotes repetidos aparecem como “parece repetido”; **Excluir lote** remove só os itens em aberto.

**Possíveis duplicados.** Quando o sistema encontra lançamentos com o mesmo valor, datas próximas e o mesmo favorecido, aparece um aviso com o botão **Revisar**: os dois ficam lado a lado, com **Excluir este** e **Não é duplicado**.

**Exportar planilha** gera a planilha com todas as contas, incluindo chave PIX, código de barras do boleto, empresa e evento.

## 11. Bancos e Conciliação

A conciliação confere o extrato do banco com o que está lançado e dá baixa nas contas pagas e recebidas.

**Como o saldo é calculado.** O saldo parte do último saldo informado pelo banco (extrato OFX importado ou **Ajustar saldo**) e soma o que foi marcado como pago ou recebido depois disso. Por isso ele muda **na hora** em que você dá baixa numa conta, e cada extrato novo acerta o saldo com o valor do banco. Um pagamento marcado à mão que depois aparece no extrato não conta duas vezes.

- **Transferência entre contas**: dinheiro de uma conta da Bosco para outra. Não conta como entrada nem saída.
- **Ajustar saldo**: grava o saldo que o app do banco mostra agora. Tudo o que já foi marcado como pago até esse momento fica considerado dentro dele.
- **Divergência e Verificar**: a coluna mostra pagamentos marcados no banco que não aparecem no extrato. **Verificar** lista cada caso, com **Abrir**, **Corrigir** (baixa gravada no banco errado) e o atalho para ajustar o saldo.

**Importar o extrato**

1. No internet banking, baixe o extrato em formato **OFX**.
2. **Conciliação** → **Importar extrato OFX**, ou arraste o arquivo para a tela.
3. Importar o mesmo período de novo não duplica nenhum movimento.

**Resolver cada movimento**

| Botão | Quando usar |
| --- | --- |
| Confirmar (sugestão) | O sistema achou o lançamento certo |
| Vincular | O lançamento existe, mas não foi sugerido |
| Lançar | Entrou ou saiu dinheiro sem nada lançado (tarifas, IOF, compras no débito) |
| É transferência entre contas | Dentro do Lançar, para dinheiro entre contas da Bosco |
| Ignorar | Movimento que não interessa |
| Desfazer | Baixa feita por engano |

**Regra rápida:** tem SUGESTÃO → **Confirmar**. Não tem, mas o lançamento existe → **Vincular**. Não existe nada → **Lançar**. Nunca use “Lançar como pagos” em linhas que já têm sugestão.

## 12. Resultados

| Aba | O que mostra |
| --- | --- |
| Por evento | Receita do contrato menos os custos ligados ao evento e a margem |
| DRE mensal | Entradas e saídas do ano por categoria, mês a mês (Realizado ou Realizado + previsto) |
| Comissões | Comissão de cada vendedor no mês, com base em contratos assinados ou valores recebidos |

Para o resultado por evento ficar certo, ligue as despesas ao evento no campo **Evento** de cada conta a pagar ou no Equipe em lote.

## 13. Controle

| Aba | Para que serve |
| --- | --- |
| Fechamento do mês | Trava pagamentos, recebimentos e transferências do mês |
| Lixeira | Tudo o que foi excluído, com quem e quando. **Restaurar** devolve o item |
| Alterações | Histórico de cada criação, edição e exclusão |
| Configurações | Multa, juros, comissão padrão e e-mails diários |

**Fechar o mês** (até o dia 10 do mês seguinte): concilie todos os bancos, confira os saldos e feche em **Controle** → **Fechamento do mês**. A Gestão pode reabrir se precisar.

**Backup.** Além do backup automático na nuvem, o link **Baixar backup completo**, no canto inferior esquerdo, gera uma cópia de todos os dados. Baixe uma vez por mês, após o fechamento.

## 14. Segurança

- Ative a **verificação em duas etapas** na sua conta Google (obrigatório para a Gestão).
- Nunca compartilhe senha, código de verificação ou o celular de confirmação.
- Use o perfil do Chrome da empresa para o sistema; contas pessoais, na janela anônima.
- Clique em **Sair** em computadores compartilhados.
- Quando alguém sai da empresa, a Gestão tira o acesso no mesmo dia.

## 15. Rotina recomendada

| Quando | Gestão | Comercial |
| --- | --- | --- |
| Todo dia | Ler **Avisos de hoje**; assinar contratos; marcar como pago o que pagou, sempre com o banco | Ler **Avisos de hoje**; fazer os retornos; atualizar as negociações e a Agenda |
| Toda semana | Importar e conciliar o OFX de cada banco; importar o DDA; lançar a equipe dos eventos | Conferir parcelas em aberto dos seus clientes |
| Todo mês (até o dia 10) | Conciliar o mês; conferir saldos; fechar o mês; revisar DRE e comissões; baixar o backup | Revisar o relatório de conversão e a comissão |

## 16. Perguntas frequentes

| Situação | O que fazer |
| --- | --- |
| Uma função nova não aparece | Aperte **Ctrl+Shift+R** |
| O colaborador entrou e não vê nada | O acesso ainda não foi aprovado: **Orçamentos** → **Equipe** |
| O saldo não bate com o banco | **Bancos** → **Verificar**; só por último use **Ajustar saldo** |
| Lancei a mesma lista da equipe duas vezes | **A pagar** → **Lotes lançados** → **Excluir lote** |
| Excluí algo por engano | **Controle** → **Lixeira** → **Restaurar** |
| Não consigo alterar um pagamento antigo | O mês está fechado; a Gestão reabre em **Controle** |
| O DDA trouxe um boleto falso | Marque a prioridade **Spam** |

**Suporte.** Dúvidas e sugestões: Thiago Ferro, financeiro@boscoeventos.com.br.
