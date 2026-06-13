# Plano de Correcoes Pos-Lancamento Pequeno - AtendeZap IA

## P0 - Corrigir imediatamente

- Nenhum P0 confirmado nos documentos revisados.
- Se cadastro/login, onboarding, dashboard, IA, checkout, webhook, RLS, admin ou vazamento de dados falhar no smoke real, pausar e corrigir antes de chamar usuarios.

## P1 - Corrigir antes de chamar mais usuarios

- Validar Supabase Auth/RLS com usuario comum e admin.
- Validar checkout Stripe teste, portal e webhook assinado.
- Validar OpenAI no backend com limite mensal e erro amigavel.
- Validar mobile em landing, cadastro, onboarding, dashboard, biblioteca, templates, assinatura e suporte.
- Preencher metricas do relatorio diario com dados agregados.

## P2 - Melhorar na proxima rodada

- Melhorar orientacao do onboarding apenas se houver abandono.
- Melhorar exemplos rapidos apenas se usuarios nao gerarem primeira resposta.
- Melhorar CTAs de copiar/salvar apenas se respostas forem geradas mas nao reutilizadas.
- Melhorar templates apenas com evidencia de uso por nicho.

## P3 - Backlog futuro

- Alertas automaticos mais completos.
- Custo estimado por tokens, se for necessario acompanhar margem internamente.
- Mais templates por nicho, somente com demanda real.

## Onboarding

- Ajustado texto que podia sugerir automacao de atendimento como objetivo.
- Manter campos simples e revisar apenas se usuarios travarem.

## Dashboard

- Manter foco em primeira resposta, copiar e salvar.
- Observar loading, erro de IA e feedback visual.

## IA

- Manter prompt atual: natural, curto, estilo WhatsApp e sem inventar preco, prazo, estoque, agenda ou disponibilidade.
- Ajustar apenas se feedback negativo real apontar resposta formal, generica ou inventada.

## Biblioteca/Templates

- Manter biblioteca atual com categorias, favoritos e templates.
- Evitar catalogo enorme sem dados.

## Assinatura/Pricing

- Manter Pro com primeiro mes por R$ 29 para novos usuarios.
- Reforcar que checkout e cancelamento usam Stripe.
- Reforcar que o produto nao envia WhatsApp automaticamente.

## Suporte

- Monitorar suporte aberto diariamente no admin.
- Nao copiar mensagem completa para backlog ou analytics.

## Mobile

- Validar fluxo ponta a ponta em 360px e 768px antes de nova rodada.

## Seguranca

- Manter repositorio privado.
- Nao commitar `.env.local`.
- Nao expor secrets no client.
- Manter eventos sem pergunta/resposta completa, dados de pagamento, tokens ou secrets.
- Manter admin protegido por `ADMIN_EMAILS`.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
