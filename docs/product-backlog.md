# Backlog de Produto - AtendeZap IA

## P0 - Critico

- Nenhum P0 confirmado na revisao local da versao 1.1.

## P1 - Alta prioridade

- Validar Stripe Checkout, Customer Portal, webhook, Supabase RLS, OpenAI, Resend, tracking, admin e health check em staging/producao antes de nova escala.
- Selecionado para 1.3: validar Stripe, portal, webhook, Supabase RLS, OpenAI, Resend, tracking, admin e health check em staging/producao antes de liberar nova variacao de campanha.
- Selecionado para 1.3: corrigir qualquer P0/P1 real de checkout, webhook, login, cadastro, IA, tracking, privacidade, RLS, suporte ou admin.
- Selecionado para 1.3: validar ativacao ate primeira resposta, copia, salvamento e retorno inicial com dados agregados.
- Selecionado para 1.3: revisar limites, falhas e custo de IA antes de aumentar trafego.
- Corrigido na 1.1: notas internas de suporte (`admin_notes`) nao retornam nem aparecem para usuario comum.
- Selecionado para 1.2: validar provedores reais e RLS antes de nova campanha.
- Selecionado para 1.2: medir gargalo de ativacao entre cadastro, onboarding, primeira resposta, copia/salvamento, checkout e assinatura.
- Selecionado para 1.2: reduzir suporte recorrente sobre WhatsApp automatico, onboarding, pricing e billing com ajustes simples.
- Entregue na Sprint 1 da 1.2: tracking seguro reforcado contra e-mail em campo generico, telefone e WhatsApp.
- Entregue na Sprint 1 da 1.2: testes de IA/limites e health check ampliados.

## P2 - Media prioridade

- Validar visualmente landing, paginas por nicho, demo, ebook, precos, assinatura, suporte, dashboard e admin em mobile/tablet/desktop.
- Selecionado para 1.3: validar mobile das paginas por nicho, demo, pricing, dashboard, biblioteca e templates antes de campanha.
- Selecionado para 1.3: melhorar biblioteca, favoritos e templates recomendados somente se dados mostrarem queda entre primeira resposta e reutilizacao.
- Selecionado para 1.3: ajustar CTA pos-primeira resposta para pricing somente se usuarios ativados nao avancarem para planos.
- Selecionado para 1.3: ajustar landing `/para/delivery` e testar criativo 02 somente depois de checklist verde e dados agregados.
- Acompanhar gargalos entre cadastro, onboarding, primeira resposta, salvar/copiar resposta e checkout.
- Preencher relatorios de campanha apenas com dados agregados reais.
- Selecionado para 1.2: melhorar exemplos por nicho, templates recomendados, CTA pos-demo e pricing apenas se os dados agregados mostrarem gargalo.
- Selecionado para 1.2: planejar bloco simples "Planejamento 1.2" no admin somente se couber sem criar dashboard paralelo.

## P3 - Futuro

- Avaliar alertas automaticos somente quando o volume justificar.
- Avaliar novos nichos e criativos depois de dados agregados suficientes.
- Avaliar metricas internas de custo de IA se tokens/modelo passarem a ser persistidos.
- Adiado para depois da 1.3: mudanca de pricing, mudanca grande de prompt, novo nicho prioritario, alertas automaticos e custo interno por resposta detalhado sem dados agregados suficientes.
- Adiado: planos anuais, tags avancadas, exportacao de historico, alertas automaticos e custo interno por resposta.

## Ideias descartadas por enquanto

- Escala de campanha sem dados suficientes.
- Mudanca grande de prompt sem feedback agregado recorrente.
- Novo painel complexo para substituir admin atual.
- Integracao direta com WhatsApp, CRM, automacao complexa, app mobile e BI avancado continuam fora do escopo da 1.2.

# Planejamento da versao 1.3

Use `docs/version-1.3-plan.md`, `docs/version-1.3-prioritization.md`, `docs/version-1.3-backlog.md`, `docs/version-1.3-success-metrics.md` e `docs/version-1.3-campaign-plan.md` como entrada da proxima sprint.

## Itens selecionados para 1.3

- validacao real de provedores, RLS, billing, tracking, admin e health check
- correcao de qualquer P0/P1 real antes de campanha
- ativacao ate primeira resposta, copia e salvamento
- retencao inicial por biblioteca, favoritos e templates recomendados
- conversao entre primeira resposta, pricing, checkout e assinatura
- suporte recorrente sobre WhatsApp automatico, billing, onboarding e IA
- limites, falhas e custo da IA antes de aumentar trafego
- UX mobile nas superficies criticas do funil
- nova variacao pequena de delivery apenas depois de checklist verde

## Itens adiados

- mudanca de pricing sem dados de pricing, checkout e assinatura
- mudanca grande de prompt sem feedback agregado recorrente
- troca de nicho sem campanha com dados suficientes
- alertas automaticos sem volume operacional
- relatorios profundos de custo de IA sem necessidade comprovada

## Itens fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
- marketplace de templates
- BI avancado

## Itens dependentes de mais dados

- melhor nicho
- melhor criativo
- melhor CTA
- alteracao de pricing
- alteracao de prompt
- custo interno por resposta
- retencao em 7 dias
- suporte recorrente por categoria

## Funcionalidades fora do escopo atual

- CRM completo
- integração direta com WhatsApp
- automações avançadas
- múltiplos atendentes
- app mobile

# Intake pos-go-live

Use `docs/post-go-live-learnings.md` e `docs/post-go-live-fix-plan.md` como entrada para novos insights de produto. Classifique cada item por area de impacto antes de priorizar:

- activation
- conversion
- billing
- ai_quality
- support
- campaign
- usability

Status atual: Sem dados suficientes. Nao criar conclusoes de produto sem evidencias agregadas do go-live.

# Intake da campanha otimizada

Use `docs/optimized-campaign-analysis.md`, `docs/optimized-campaign-funnel-diagnosis.md` e `docs/campaign-comparison-report.md` como entrada para insights simples.

## Insights potenciais

- campaign: Sem dados suficientes para definir criativo, nicho ou CTA vencedor.
- activation: acompanhar se cadastros da campanha concluem onboarding e geram primeira resposta.
- conversion: acompanhar se primeira resposta leva a checkout antes de alterar pricing.
- billing: pausar qualquer escala se checkout ou webhook falhar.
- ai_quality: revisar feedback agregado das primeiras respostas antes de alterar prompt.
- usability: validar mobile da pagina por nicho e demo antes de nova variacao.

Nao transformar esses itens em desenvolvimento enquanto nao houver dados agregados reais ou gargalo claro.

# Intake da escala cautelosa

Use `docs/cautious-scale-report.md`, `docs/daily-scale-checklist.md` e `docs/scale-contingency-plan.md` para criar insights simples antes de nova sprint.

## Areas de impacto

- activation: cadastros sem onboarding ou sem primeira resposta.
- conversion: uso sem checkout ou checkout sem assinatura.
- billing: falha de checkout, webhook, portal ou liberacao de plano.
- ai_cost: custo de IA subindo sem ativacao ou conversao.
- support: aumento de duvidas ou bugs durante campanha.
- campaign: criativo, nicho, CTA ou destino com baixo sinal.

## Regra

- Criar insight apenas com evidencia agregada.
- Nao criar automacao, CRM ou integracao externa para resolver falta de dados.
- Se o impacto `ai_cost` precisar ir para o admin atual, registrar como `campaign` ou `ai_quality` e mencionar custo de IA nas notas seguras.

# Pendencias pos-escala e versao 1.1

Use `docs/cautious-scale-analysis.md`, `docs/scale-health-diagnosis.md`, `docs/post-scale-adjustment-plan.md` e `docs/operational-stability-report.md` como entrada da versao 1.1.

## P0/P1 possiveis

- checkout, webhook, login/cadastro, IA ou tracking falhando durante campanha
- custo de IA subindo sem ativacao
- suporte com bug critico recorrente
- usuarios cadastrados sem primeira resposta por gargalo de onboarding

## P2/P3 possiveis

- melhorar copy da pagina por nicho se visitantes nao virarem leads
- melhorar onboarding se cadastros nao gerarem primeira resposta
- melhorar relatorios internos se a decisao diaria depender de campos manuais repetidos
- testar novo nicho ou novo criativo somente depois de dados agregados suficientes

## Fora do escopo atual

- CRM
- integracao direta com WhatsApp
- automacao de mensagens
- app mobile
- BI avancado

# Planejamento da versao 1.2

Use `docs/post-1.1-release-report.md`, `docs/version-1.1-diagnosis.md`, `docs/version-1.2-plan.md`, `docs/version-1.2-backlog.md` e `docs/version-1.2-success-metrics.md` como entrada da proxima sprint.

## Itens selecionados para 1.2

- validacao real de provedores, RLS, tracking, admin e health check
- ativacao e primeira resposta
- retencao inicial e uso de respostas salvas/favoritas
- conversao para plano pago
- suporte recorrente
- billing e webhook
- campanhas pequenas por nicho
- UX mobile validada em ambiente final

## Sprint 1 da versao 1.2

- Status: concluida com pendencias externas.
- Entregue: revisao local de billing, webhook, status de assinatura, IA/limites, tracking seguro, logs, health check e admin.
- Entregue: correcao de tracking seguro para remover e-mail em valor generico, telefone e WhatsApp.
- Entregue: testes focados para tracking, health check e IA/limites.
- Pendencia P1: validacao real de Stripe, Supabase RLS, OpenAI, Resend, tracking, admin e health check em staging/producao.
- Proxima etapa: Sprint 2 de ativacao e retencao.

## Sprint 2 da versao 1.2

- Status: concluida com pendencias externas.
- Entregue: dashboard inicial, checklist de ativacao, exemplos por nicho, templates recomendados, favoritas e admin de ativacao.
- Entregue: CTAs pos-primeira resposta para copiar, salvar, testar outro exemplo, ver templates, favoritar e conhecer planos.
- Entregue: eventos e testes de ativacao mantidos sem conteudo sensivel.
- Sprint 3/P1: validar ativacao real, mobile, provedores e RLS antes de nova campanha.
- Sprint 3/P2: revisar conversao/pricing apenas se usuarios ativados nao iniciarem checkout.
- P3: avaliar e-mails automaticos de ativacao somente depois de regra operacional e consentimento.

## Itens que dependem de mais dados

- mudancas de pricing
- alteracoes de prompt
- novos nichos ou criativos
- envio automatico de e-mails de ativacao
- relatorios internos mais detalhados
- custo interno de IA por resposta
# Atualizacao Sprint 3 da 1.2

- Conversion: acompanhar pricing visits, plan clicks, checkout started/failed, first response -> pricing e checkout -> subscription no admin.
- Campaign: rodar apenas campanha pequena pos-Sprint 3 com `Sem dados suficientes` como conclusao inicial.
- Copy: manter explicacao de copiar, ajustar e enviar manualmente; nao prometer automacao no WhatsApp.
- Billing: validar Stripe checkout, portal e webhook em ambiente real/test mode antes de escala.

## Atualizacao Sprint 4 da 1.2

- Shipped 1.2: estabilidade local, ativacao inicial, conversao, tracking seguro, admin agregado, QA final e documentacao de release.
- P1 1.3: validar provedores reais e RLS em staging/producao.
- P1 1.3: corrigir qualquer falha real de checkout, webhook, portal, IA, tracking, suporte ou admin.
- P2 1.3: iterar ativacao, templates, pricing, nichos e campanhas com dados agregados reais.
- P3 futuro: planos anuais, novos nichos, custo por resposta detalhado e automacoes operacionais leves se houver volume.
- Fora do escopo: WhatsApp API, CRM completo, automacao complexa, multiplos atendentes e app mobile.

## Intake pos-deploy 1.2

Use `docs/version-1.2-post-deploy-analysis.md`, `docs/version-1.2-stability-diagnosis.md` e `docs/version-1.2-post-deploy-fix-plan.md` para criar insights simples depois de dados reais.

Areas:

- activation: cadastro, onboarding e primeira resposta.
- conversion: pricing, checkout e assinatura.
- billing: checkout, portal, webhook, pagamento falho e limite.
- ai_quality: falhas de IA, limite e custo.
- support: bugs criticos, duvidas recorrentes e prioridade.
- campaign: liberacao, pausa, UTMs e decisao diaria.
- security: admin, RLS, logs, analytics e privacidade.
- tracking: eventos principais, UTMs e ausencia de dados sensiveis.

Status atual: Sem dados suficientes. Nao abrir campanha nem criar tarefas de produto conclusivas ate os checklists de producao e monitoramento estarem preenchidos.

## Intake de execucao da campanha pos-1.2

Criar insight manual somente quando houver evidencia agregada:

- activation: cadastro sem onboarding ou onboarding sem primeira resposta
- conversion: primeira resposta sem pricing/checkout ou checkout sem assinatura
- campaign: pagina, headline, CTA, criativo ou UTM com gargalo comprovado
- billing: checkout, webhook, portal ou status de assinatura instavel
- ai_cost: custo anormal ou uso sem ativacao
- support: bug critico ou duvida recorrente

Status atual: Sem dados suficientes. Riscos previstos nao devem virar conclusoes ou funcionalidades grandes antes da execucao real.

## Intake da analise da campanha pos-1.2

Use `docs/post-1.2-campaign-analysis.md`, `docs/post-1.2-campaign-funnel-diagnosis.md`, `docs/post-1.2-campaign-adjustment-plan.md` e `docs/post-1.2-scale-decision.md` como entrada para insights manuais.

Categorias permitidas:

- activation
- conversion
- campaign
- billing
- ai_quality
- ai_cost
- support
- usability

Status atual: Sem dados suficientes. Nao criar tarefas de produto conclusivas, automacao, CRM ou WhatsApp API antes de dados agregados reais.
