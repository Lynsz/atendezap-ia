# Plano de Correção Pós-Deploy — Versão 1.1

## Correções obrigatórias

* Nenhuma correção obrigatória identificada.

## Correções recomendadas

* Nenhuma mudança de código recomendada sem reprodução de bug real.
* Tratar o preenchimento de deploy, smoke tests e métricas como validação operacional obrigatória, não como correção de produto.

## Correções adiadas

* Atualizar `supabase/schema.sql` depois de confirmar e aplicar todas as migrations no banco real.
* Melhorias de onboarding, IA, templates, biblioteca, pricing, suporte ou admin somente após dados reais apontarem um problema.

## Não será feito agora

* Integração com WhatsApp.
* Envio automático.
* CRM completo.
* App mobile.
* Automações complexas.
* Redesign ou feature nova.
* Campanha grande.

## Riscos

* Corrigir sem reprodução pode introduzir regressão e mascarar a falta de dados.
* A ausência de logs e métricas reais pode esconder um P0/P1 ainda não observado.

## Validação necessária

* `npm run check:secrets`, lint, typecheck, build, testes e `npm run validate`.
* Smoke real de `/api/health`, landing, cadastro, login, onboarding, dashboard, IA, copiar, salvar, biblioteca, templates, assinatura, checkout teste, suporte, feedback e admin.
* RLS com dois usuários e revisão dos eventos reais sem conteúdo sensível.

## Próximo passo

* Repetir a validação controlada e abrir correção somente para falha reproduzida e classificada.
