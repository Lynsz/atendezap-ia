# Resposta a Incidentes - AtendeZap IA

## P0 - Incidente critico

Exemplos:

- Login quebrado.
- Checkout quebrado.
- Webhook Stripe nao libera plano.
- IA nao gera respostas para ninguem.
- Dados de usuarios expostos.
- Admin acessivel para usuario comum.
- Build/deploy quebrado em producao.

Acao:

- Pausar anuncios.
- Verificar logs.
- Identificar causa.
- Aplicar rollback se necessario.
- Corrigir.
- Validar.
- Documentar.

## P1 - Incidente alto

Exemplos:

- Alguns usuarios nao conseguem concluir onboarding.
- E-mail do ebook falhando.
- Portal Stripe falhando.
- Erro mobile importante.
- Feedback nao salva.

Acao:

- Registrar em `docs/incident-log.md`.
- Verificar logs e provedor externo envolvido.
- Corrigir antes de convidar novos usuarios ou aumentar campanha.
- Validar no ambiente real.

## P2 - Incidente medio

Exemplos:

- Copy confusa.
- Layout quebrado em telas especificas.
- FAQ incompleta.
- Metrica admin incorreta.

Acao:

- Registrar no backlog ou log se afetar operacao.
- Priorizar junto com feedbacks repetidos.
- Corrigir sem interromper operacao se nao houver risco de seguranca, pagamento ou acesso.

## P3 - Baixo

Exemplos:

- Melhoria visual.
- Ajuste de texto.
- Ideia futura.

Acao:

- Registrar no roadmap ou backlog.
- Nao interromper rotina operacional.

## Quando fazer rollback

- Deploy de producao quebra rotas principais.
- Checkout ou webhook param de funcionar apos deploy.
- Nova mudanca gera erro de login, dashboard ou IA.
- Ha risco de vazamento de dados.

Use `docs/rollback-plan.md` como guia principal para rollback.
