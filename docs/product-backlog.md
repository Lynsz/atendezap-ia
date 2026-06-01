# Backlog de Produto - AtendeZap IA

## P0 - Crítico
-

## P1 - Alta prioridade
-

## P2 - Média prioridade
-

## P3 - Futuro
-

## Ideias descartadas por enquanto
-

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
