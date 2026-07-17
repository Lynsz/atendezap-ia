# Plano Pos-1.1 - AtendeZap IA

## Objetivo

Definir o proximo ciclo apos o fechamento da versao 1.1.

## Conclusao das 72h

* A janela real de 72 horas nao foi registrada.
* Smoke tests de Preview e Producao e relatorio de deploy permanecem sem resultado preenchido.
* Metricas de produto, billing, IA, suporte, feedback, seguranca e custo OpenAI estao `nao disponivel` ou `nao medido`.
* Nenhum P0/P1 foi confirmado e nao ha registro de rollback, mas a ausencia de evidencias impede aprovar estabilidade de producao.

## Decisao pos-deploy

* Repetir validacao.
* Manter somente operacao interna/controlada enquanto a validacao real estiver pendente.
* Campanha pequena e plano detalhado da versao 1.2 nao aprovados nesta etapa.

## Proximos passos aprovados

* Confirmar CI remoto.
* Executar smoke autenticado em Preview e Producao.
* Validar migrations e RLS com dois usuarios.
* Validar Stripe, OpenAI, suporte, feedback e admin no ambiente final.
* Monitorar e registrar 72 horas completas com dados agregados seguros.

## Opcoes

* manter operacao controlada
* repetir lancamento pequeno
* preparar campanha pequena
* melhorar metricas
* planejar versao 1.2
* corrigir pendencias aceitas

## Criterios para campanha pequena

* nenhum P0 aberto
* P1 criticos controlados
* custo OpenAI sob controle
* checkout estavel
* suporte controlado
* sinais de ativacao suficientes
* produto claro para usuarios novos
* deploy controlado concluido em Preview e Producao
* smoke test de Producao aprovado
* monitoramento inicial de 72h sem P0/P1 critico
* rollback documentado e testado ao menos por checklist

## Criterios para versao 1.2

* feedback real suficiente
* backlog priorizado
* metricas minimas acompanhadas
* operacao estavel
* bugs criticos resolvidos
* decisao pos-72h registrada
* pendencias aceitas da 1.1 classificadas entre corrigir agora, monitorar ou mover para backlog

## Monitoramento pos-deploy

* Usar `docs/version-1.1-first-72h-monitoring.md` nas primeiras 72 horas apos producao.
* Preencher `docs/version-1.1-72h-daily-report-template.md` diariamente.
* Monitorar saude tecnica, cadastro, login, onboarding, geracao de IA, respostas copiadas/salvas, templates, suporte, billing, webhooks Stripe, custo OpenAI, admin e logs criticos.
* Nao inventar metricas; registrar `nao disponivel` quando a fonte ainda nao existir.

## Decisao apos 72h

* manter operacao se nao houver P0/P1 critico e o uso estiver estavel
* corrigir e continuar se houver bug controlado sem risco de dados ou receita
* pausar divulgacao se houver instabilidade em fluxo critico
* fazer rollback se qualquer criterio de rollback for atingido
* preparar campanha pequena apenas depois de smoke real aprovado e monitoramento inicial sem alerta critico

## Pendencias aceitas

* Confirmar GitHub Actions verde no GitHub.
* Aplicar migrations pendentes no Supabase real.
* Validar RLS com dois usuarios reais.
* Validar Stripe Checkout, Customer Portal e webhook assinado no ambiente final.
* Validar OpenAI e Resend no ambiente final.
* Consolidar metricas reais de ativacao, suporte, billing, feedback e custo OpenAI.

## Riscos conhecidos

* Ambiente real pode divergir do local por variaveis Vercel, migrations, RLS, Stripe, OpenAI ou Resend.
* Campanha maior antes do smoke real aumenta risco operacional.
* Falha de webhook Stripe ou checkout bloqueia monetizacao.
* Falha de IA para multiplos usuarios compromete o valor principal do produto.
* Admin exposto, secret exposto ou vazamento entre usuarios exige rollback ou pausa imediata.

## Fora do escopo imediato

* integracao com WhatsApp
* CRM completo
* app mobile
* automacao complexa
* campanha grande

## Itens fora de escopo confirmados

* integracao direta com WhatsApp
* envio automatico
* CRM completo
* app mobile
* automacoes complexas
* redesign
* feature nova sem evidencia

## Proximo passo recomendado

* Aplicar migrations no Supabase real.
* Rodar smoke autenticado em Preview/Producao com dois usuarios.
* Validar Stripe em modo teste no ambiente final.
* Confirmar GitHub Actions verde.
* Preencher checklist pre-deploy, smoke tests e relatorio de deploy da versao 1.1.
* Monitorar as primeiras 72 horas antes de qualquer campanha pequena.
* So depois decidir entre operacao controlada, campanha pequena ou planejamento da 1.2.
