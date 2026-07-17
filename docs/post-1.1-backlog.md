# Backlog Pos-1.1 - AtendeZap IA

## P0

* Nenhum P0 confirmado no fechamento local ou na analise documental pos-deploy da versao 1.1.
* Se surgir vazamento de dados, secret exposto, falha de RLS, checkout/webhook indisponivel, login/cadastro indisponivel ou IA indisponivel para multiplos usuarios, pausar operacao e corrigir antes de qualquer melhoria.

## P1

* Rodar smoke autenticado em Preview/Producao.
* Validar Supabase RLS com dois usuarios reais.
* Aplicar migrations pendentes no Supabase real.
* Validar Stripe Checkout, Customer Portal e webhook assinado no ambiente final.
* Confirmar GitHub Actions verde no GitHub.
* Validar OpenAI e Resend no ambiente final sem expor secrets.
* Preencher metricas reais de ativacao, suporte, billing, feedback e custo OpenAI.
* Registrar o periodo real de 72 horas e preencher os tres relatorios diarios.
* Repetir a decisao pos-deploy depois de concluir as validacoes acima.

## P2

* Melhorar onboarding apenas com gargalos medidos.
* Melhorar templates por nicho apenas com uso real.
* Melhorar qualidade da IA com base em feedback agregado.
* Melhorar suporte/FAQ com base em perguntas recorrentes.
* Melhorar pricing apenas se houver duvida ou queda medida.
* Alinhar `supabase/schema.sql` com as migrations somente depois de confirmar o banco real.
* Melhorar relatorios internos sem virar BI avancado e apenas se a operacao exigir.

## Proxima campanha pequena

* Nao aprovada nesta analise.
* Reavaliar somente apos smoke de Production aprovado, 72 horas completas, nenhum P0, P1 criticos controlados, checkout estavel, suporte controlado e custo OpenAI medido.

## Candidatos para versao 1.2

* Nenhum candidato aprovado por dados pos-deploy nesta etapa.
* Manter como hipoteses, sem iniciar implementacao: metricas, onboarding, templates, qualidade da IA, admin, suporte, billing e reducao de custo OpenAI.
* Priorizar somente depois de feedback e metricas agregadas reais.

## Nao fazer ainda

* integracao com WhatsApp
* envio automatico
* CRM completo
* app mobile
* automacoes complexas
* campanha grande sem dados suficientes

## Analise da campanha pequena pos-1.1

### Bugs identificados

* Nenhum P0, P1 ou P2 confirmado por dados da campanha.
* Pendencias de ambiente real permanecem operacionais e nao foram classificadas como bugs.

### Melhorias recomendadas

* Concluir CI remoto, smoke autenticado, migrations/RLS, OpenAI, Stripe e medicao de custo.
* Garantir agregados seguros por etapa e canal antes de qualquer nova analise de conversao.
* Nao alterar onboarding, IA, pricing, suporte ou copy sem feedback ou gargalo medido.

### Candidatos a versao 1.2

* Nenhum aprovado nesta analise.
* Ativacao, onboarding, IA por nicho, templates, biblioteca, pricing, metricas, admin, suporte e custo permanecem hipoteses condicionadas a dados reais.

### Itens para proxima campanha

* Comecar por convite manual somente apos aprovacao operacional.
* Usar `post_1_1_small_campaign` apenas se a rodada original ainda for formalmente ativada; uma rodada diferente deve usar identificador novo.
* Medir funil, suporte, feedback, erros e custo desde o primeiro dia.

### Itens fora de escopo

* integracao com WhatsApp
* envio automatico
* CRM completo
* app mobile
* automacoes complexas
* campanha grande sem dados
