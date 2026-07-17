# Backlog Pos-1.1 - AtendeZap IA

## P0

* Nenhum P0 confirmado no fechamento local ou na analise documental pos-deploy da versao 1.1.
* Se surgir vazamento de dados, secret exposto, falha de RLS, checkout/webhook indisponivel, login/cadastro indisponivel ou IA indisponivel para multiplos usuarios, pausar operacao e corrigir antes de qualquer melhoria.

## P1

* Itens operacionais aprovados foram movidos para `docs/version-1.2-backlog.md` como gate da Sprint 1.
* Nenhum bug P1 de produto permanece confirmado no backlog pos-1.1.

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

* Aprovados para planejamento: estabilidade, validacao do ambiente final, metricas essenciais, seguranca e diagnostico do funil.
* Movidos para `docs/version-1.2-backlog.md`: CI remoto, smoke autenticado, RLS real, OpenAI, Stripe, admin, custo e baseline.
* Onboarding, dashboard, IA, templates, biblioteca, pricing, suporte e UX permanecem hipoteses condicionadas a dados reais.

## Adiados ou sem evidencia suficiente

* Melhorias de produto que dependem de abandono, feedback, uso ou conversao medidos.
* Mudancas de copy, prompt, pricing, filtros ou relatorios sem problema confirmado.
* Nova campanha antes do fechamento da 1.2 e de uma janela estavel em Production.

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
