# Backlog da Versao 1.3 - AtendeZap IA

## Correcoes

- Corrigir qualquer P0/P1 real de checkout, webhook, login, cadastro, IA, tracking, privacidade, RLS, suporte ou admin.
- Validar provedores reais e RLS em staging/producao antes de campanha.
- Revisar health check, logs e analytics para manter dados sensiveis fora dos eventos.

## Ativacao

- Medir cadastro -> onboarding -> primeira resposta com dados agregados.
- Melhorar orientacao inicial apenas se usuarios nao chegarem a primeira resposta.
- Validar mobile do onboarding e dashboard inicial.

## Retencao

- Acompanhar resposta copiada, resposta salva, favoritos, templates reutilizados e retorno em 7 dias.
- Melhorar biblioteca e favoritos se houver queda entre primeira resposta e reutilizacao.
- Revisar mensagens de retorno sem criar automacao complexa.

## Conversao

- Acompanhar primeira resposta -> pricing -> checkout -> assinatura.
- Ajustar CTA pos-primeira resposta apenas com gargalo comprovado.
- Manter pricing sem mudanca grande ate haver dados de checkout e assinatura.

## IA e qualidade

- Revisar feedback agregado de respostas antes de alterar prompt.
- Pausar campanha se IA falhar para multiplos usuarios.
- Acompanhar custo de IA e limites antes de qualquer aumento de trafego.

## Templates

- Melhorar templates por nicho se usuarios chegam aos templates mas nao copiam/salvam.
- Priorizar delivery enquanto a hipotese atual nao tiver dados suficientes para trocar de nicho.
- Evitar marketplace, tags avancadas ou estruturas de equipe.

## Billing

- Validar checkout, portal, webhook, status de assinatura e limite mensal em staging/producao.
- Pausar campanha diante de falha de pagamento, webhook ou liberacao de plano.
- Revisar cancelamento e feedback apenas com dados agregados de churn.

## Suporte

- Monitorar duvidas sobre WhatsApp automatico, billing, onboarding e IA.
- Ajustar FAQ e macros simples se houver suporte repetitivo.
- Nao criar central complexa ou CRM.

## Campanhas

- Manter campanha pos-1.2 bloqueada ate validacao real.
- Rodar nova variacao pequena apenas com checklist verde.
- Usar `/para/delivery` e UTM segura como base inicial.
- Nao escalar antes de 72h de dados agregados, primeira resposta e sinais de compra.

## Admin/relatorios

- Reusar admin atual com agregados.
- Preencher relatorios com dados reais ou `Sem dados suficientes`.
- Evitar listas de usuarios, respostas completas, pagamentos ou IDs externos.

## Seguranca

- Manter repositorio privado.
- Nao commitar `.env.local` ou secrets reais.
- Manter OpenAI, Supabase service role, Stripe e Resend no backend.
- Revisar RLS com usuarios reais de teste.

## Documentacao

- Manter plano, roadmap, backlog, metricas, checklist, release notes e campanha 1.3 sincronizados.
- Atualizar auditoria, prontidao, CHANGELOG e roadmaps sem marcar 1.3 como entregue.
- Registrar pendencias externas de staging/producao.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
