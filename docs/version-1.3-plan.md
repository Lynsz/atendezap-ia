# Plano da Versao 1.3 - AtendeZap IA

## Objetivo

Melhorar retencao, conversao e qualidade da experiencia com base nos aprendizados da versao 1.2 e da campanha pos-1.2.

## Foco principal

- retencao inicial
- conversao para plano pago
- qualidade das respostas da IA
- templates por nicho
- onboarding
- campanha por nicho
- controle de custo da IA
- UX mobile

Pricing e suporte entram como ajustes pontuais, nao como mudancas grandes, porque ainda nao ha dados agregados reais que justifiquem alterar preco, plano ou fluxo operacional.

## Problema principal identificado

- A campanha pos-1.2 esta preparada, mas segue bloqueada por falta de validacao real de producao, dados agregados de funil e evidencia de que usuarios chegam a primeira resposta, pricing, checkout e assinatura.

## Hipotese da versao 1.3

- Se a Sprint 1 corrigir qualquer P0/P1 real, validar provedores/RLS/billing/tracking e a Sprint 2 reduzir atrito ate primeira resposta, copia, salvamento e retorno, entao a proxima variacao pequena de campanha tera dados suficientes para decidir entre manter, pausar, ajustar ou continuar sem escalar prematuramente.

## Metrica principal

- Usuarios da campanha que chegam a primeira resposta gerada com tracking confiavel e sem bug P0/P1.

## Metricas secundarias

- onboardings concluidos
- respostas copiadas
- respostas salvas
- uso de favoritos
- reutilizacao de templates
- pricing views apos ativacao
- checkouts iniciados
- assinaturas concluidas
- falhas de IA
- falhas de checkout/webhook/portal
- suporte aberto por bug critico ou confusao sobre WhatsApp automatico
- custo de IA sob controle
- campanha com visitantes, leads, cadastros, primeiras respostas e checkouts preenchidos de forma agregada

## Diagnostico usado

- Maior gargalo atual: falta de dados agregados reais e validacao final de producao.
- Melhor sinal de campanha: delivery tem hipotese, destino `/para/delivery`, CTA, UTM e tracking especifico preparados sem dados sensiveis.
- Pior gargalo de campanha: nenhum resultado real de visitantes, leads, cadastros, onboardings, primeiras respostas, checkouts ou assinaturas foi preenchido.
- Bugs P0/P1 restantes: nenhum P0/P1 confirmado nos documentos revisados; a validacao real de Stripe, Supabase RLS, OpenAI, Resend, tracking, admin, health check e suporte segue como P1 operacional.
- Pontos que precisam de mais dados: pricing, prompt, novo nicho, novo criativo vencedor, custo interno de IA por resposta, retencao em 7 dias e suporte recorrente.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
- marketplace de templates
- BI avancado

## P0 - Critico

- Corrigir imediatamente qualquer falha real de checkout, webhook, login, cadastro, IA, tracking, privacidade, RLS ou admin encontrada antes ou durante a campanha.
- Pausar campanha se houver bug P0/P1, exposicao de dados, IA instavel, checkout/webhook instavel ou custo de IA anormal sem ativacao.

## P1 - Alta prioridade

- Validar Stripe Checkout, Customer Portal, webhook, Supabase RLS, OpenAI, Resend, tracking, admin e health check em staging/producao.
- Validar que usuarios conseguem concluir onboarding, gerar primeira resposta, copiar e salvar resposta sem enviar dados sensiveis para analytics.
- Revisar limites, rate limit e custos de IA antes de liberar nova variacao.
- Revisar suporte e FAQ para reduzir confusao sobre ausencia de envio automatico pelo WhatsApp.
- Revisar mobile das paginas por nicho, demo, pricing, dashboard, biblioteca e templates antes de campanha.

## P2 - Media prioridade

- Melhorar orientacao do dashboard e onboarding se cadastros nao chegarem a primeira resposta.
- Melhorar templates recomendados e favoritos se usuarios gerarem resposta mas nao salvarem, copiarem ou retornarem.
- Ajustar CTA pos-primeira resposta para pricing se usuarios ativados nao visitarem planos.
- Ajustar copy da landing `/para/delivery` somente se visitantes nao clicarem ou leads nao avancarem.
- Preparar criativo 02 de delivery com dor objetiva sobre perguntas repetidas.

## P3 - Futuro

- Testar outro nicho depois de dados agregados suficientes.
- Alterar pricing apenas com evidencia de ativacao, pricing view, checkout e assinatura.
- Alterar prompt apenas com feedback agregado recorrente de qualidade.
- Persistir tokens/modelo por resposta se custo interno de IA virar decisao operacional.
- Avaliar relatorios mais profundos sem criar BI complexo.
