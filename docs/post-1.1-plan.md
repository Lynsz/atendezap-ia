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

## Campanha pequena preparada

* Plano, canais, copies, UTMs, relatorio diario, criterios de decisao, plano de pausa e relatorio de prontidao foram preparados.
* Preparacao nao significa execucao: a campanha permanece bloqueada ate os criterios de inicio serem comprovados.

## Criterios de inicio da campanha

* CI remoto verde e smoke autenticado de Production aprovado.
* Nenhum P0, P1 criticos controlados, admin protegido e RLS real validado.
* OpenAI, Stripe, suporte, feedback e tracking funcionando no ambiente final.
* Custo OpenAI medido e sob controle.

## Criterios de pausa da campanha

* Pausar por falha recorrente de rota critica, IA, cadastro/login, checkout/webhook, admin exposto, vazamento ou custo anormal.

## Canais iniciais

* Convite manual primeiro.
* LinkedIn e Instagram organicos depois da aprovacao operacional.
* Trafego pago baixo somente apos primeira revisao sem alerta critico.

## Decisao atual da campanha

* Preparacao concluida localmente.
* Campanha nao iniciada e bloqueada; manter operacao controlada.

## Execucao da campanha pequena

* Status: bloqueada; nenhuma divulgacao iniciada.
* Canais usados: nenhum.
* Canais planejados: convite manual primeiro; LinkedIn e Instagram organicos depois da aprovacao; trafego pago baixo somente apos revisao operacional.
* Criterios de pausa ativos: P0, P1 critico sem controle, falha recorrente de rota critica, cadastro/login/IA/checkout/webhook quebrados, admin exposto, vazamento, tracking que quebre fluxo ou consumo OpenAI anormal.
* Decisao atual: pausar antes da ativacao e manter operacao controlada.
* Proxima analise recomendada: apos CI remoto verde, smoke autenticado de Preview/Production, RLS com dois usuarios, OpenAI/Stripe reais e custo medido.

## Proximos passos da campanha

* Aplicar a migration de eventos no ambiente de validacao.
* Repetir smoke de Preview/Production e confirmar CI remoto.
* Validar custo, billing, suporte e tracking antes de usar qualquer copy ou UTM externamente.

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

## Resultado da analise da campanha

* A campanha foi bloqueada antes da divulgacao e nao produziu resultados de aquisicao, ativacao, billing, suporte, feedback ou custo.
* Nenhum canal ou UTM foi usado externamente.
* Nenhum P0, P1 ou incidente foi confirmado.
* Ausencia de dados nao foi tratada como sucesso nem como falha do produto.

## Decisao final

* Manter operacao controlada e pausar divulgacao.
* Na analise da campanha, nao havia evidencia para repetir campanha ou aprovar implementacao da versao 1.2.

## Proximos passos apos a analise

* Confirmar CI remoto e smoke autenticado de Preview/Production.
* Aplicar migrations e validar RLS com dois usuarios reais.
* Validar OpenAI, Stripe, suporte, feedback, admin e custo no ambiente final.
* Reavaliar campanha pequena somente com ambiente aprovado e medicao agregada pronta.

## Riscos e pendencias aceitas

* Divergencia de configuracao, migration ou RLS no ambiente real.
* Falha de IA, billing ou tracking aparecer apenas em Production.
* Custo e demanda de suporte permanecerem invisiveis sem dados reais.

## O que nao sera feito agora

* nova campanha
* implementacao ampla da versao 1.2 antes dos criterios de entrada
* integracao com WhatsApp ou envio automatico
* CRM, app mobile, automacoes complexas ou redesign
* campanha grande ou escala de orcamento

## Decisao de planejar a versao 1.2

* O planejamento detalhado da 1.2 foi autorizado como etapa documental.
* Planejar nao significa iniciar implementacao: o kickoff permanece bloqueado pelos criterios de entrada.

## Motivos

* Consolidar estabilidade, seguranca e medicao antes de novas decisoes de produto.
* Transformar gargalos nao medidos em perguntas verificaveis, sem inventar feedback ou conversao.
* Preparar um backlog condicional para ativacao, IA, templates, biblioteca, pricing, metricas e operacao.

## Escopo inicial da 1.2

* Sprint 1: ambiente final, RLS, OpenAI, Stripe, admin, metricas e custo.
* Sprints 2 a 4: melhorias pequenas somente se a baseline revelar gargalos reais.
* Nenhum P0/P1/P2 de produto foi confirmado na campanha.

## Criterios de entrada e proximos passos

* Atender `docs/version-1.2-intake-criteria.md` antes de iniciar execucao.
* Confirmar CI remoto, smoke autenticado, migrations/RLS, OpenAI, Stripe e custo.
* Coletar baseline segura e repriorizar o backlog antes das sprints de produto.

## Fora do escopo da 1.2

* integracao ou envio automatico pelo WhatsApp
* CRM completo
* app mobile
* automacoes complexas
* campanha grande ou escala sem dados
