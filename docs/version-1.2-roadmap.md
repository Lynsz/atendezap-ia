# Roadmap da Versão 1.2 — AtendeZap IA

## Regra do roadmap

* A Sprint 1 é gate de entrada para as demais.
* Sprints 2 a 4 refinam o produto somente com gargalos e feedbacks medidos.

## Sprint 1 — Correções, métricas e estabilidade

Foco:

* corrigir P0/P1 reais, se encontrados
* validar CI remoto, Preview/Production e `/api/health`
* validar migrations, RLS, OpenAI, Stripe e admin no ambiente final
* melhorar definições e disponibilidade das métricas essenciais
* revisar eventos seguros e tracking de campanha
* medir custo OpenAI na mesma janela do volume de respostas
* manter CI verde

Saída: ambiente real aprovado e baseline mínima, ou versão mantida bloqueada.

## Sprint 2 — Ativação, onboarding e dashboard

Foco condicional:

* diagnosticar cadastro, onboarding, dashboard e primeira resposta
* melhorar onboarding somente se houver abandono ou confusão medidos
* melhorar exemplos por nicho e dashboard de usuário novo somente com evidência
* validar os eventos após cada ajuste

## Sprint 3 — IA, templates e biblioteca

Foco condicional:

* analisar feedback agregado e custo da IA
* melhorar respostas por nicho sem aumentar o prompt desnecessariamente
* melhorar templates utilizados ou problemáticos
* melhorar biblioteca e feedback de qualidade com base em uso real

## Sprint 4 — Pricing, conversão e operação

Foco condicional:

* analisar assinatura, checkout e conversão com dados comparáveis
* melhorar clareza de pricing se houver dúvida medida
* melhorar admin, suporte e relatórios essenciais
* preparar próxima campanha pequena, sem ativá-la

## Fechamento da 1.2

Foco:

* smoke test final autenticado
* validação de segurança, RLS, OpenAI e Stripe
* release notes e changelog
* decisão final e deploy controlado
* nenhuma campanha antes da estabilidade pós-deploy
