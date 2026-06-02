# Backlog de Produto - AtendeZap IA

## P0 - Critico

- Nenhum P0 confirmado na revisao local da versao 1.1.

## P1 - Alta prioridade

- Validar Stripe Checkout, Customer Portal, webhook, Supabase RLS, OpenAI, Resend, tracking, admin e health check em staging/producao antes de nova escala.
- Corrigido na 1.1: notas internas de suporte (`admin_notes`) nao retornam nem aparecem para usuario comum.

## P2 - Media prioridade

- Validar visualmente landing, paginas por nicho, demo, ebook, precos, assinatura, suporte, dashboard e admin em mobile/tablet/desktop.
- Acompanhar gargalos entre cadastro, onboarding, primeira resposta, salvar/copiar resposta e checkout.
- Preencher relatorios de campanha apenas com dados agregados reais.

## P3 - Futuro

- Avaliar alertas automaticos somente quando o volume justificar.
- Avaliar novos nichos e criativos depois de dados agregados suficientes.
- Avaliar metricas internas de custo de IA se tokens/modelo passarem a ser persistidos.

## Ideias descartadas por enquanto

- Escala de campanha sem dados suficientes.
- Mudanca grande de prompt sem feedback agregado recorrente.
- Novo painel complexo para substituir admin atual.

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
