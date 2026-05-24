# Validação Staging — AtendeZap IA

## URL testada

- Pendente: preencher manualmente com a URL da Vercel.
- Tentativa de descoberta: a URL não foi encontrada no repositório, em `.vercel/project.json` ou na lista de projetos disponível pelo conector da Vercel nesta sessão.

## Status geral

- Não validado

Observação: esta etapa não confirmou bugs reais do ambiente publicado porque não havia URL de staging acessível para teste remoto. A validação feita nesta sessão ficou limitada à revisão dos documentos de deploy, busca por URLs hardcoded, verificação local de build/testes e registro das pendências externas.

## Testes executados

- páginas públicas: não executado em staging; coberto por testes locais/e2e.
- autenticação: não executado em staging; depende de Supabase Auth e Redirect URLs do ambiente.
- dashboard: não executado em staging; depende de login e Supabase staging.
- onboarding: não executado em staging; depende de login e Supabase staging.
- IA: não executado em staging; depende de `OPENAI_API_KEY` e `OPENAI_MODEL` na Vercel.
- assinatura: não executado em staging; depende de Stripe test mode e envs da Vercel.
- Stripe checkout: não executado em staging; depende de price IDs e domínio real.
- webhook: não executado em staging; depende de endpoint Stripe apontando para a URL Vercel.
- portal Stripe: não executado em staging; depende de `stripe_customer_id` real no Supabase staging.
- Supabase: não executado contra projeto staging; depende de migrations, RLS e Auth URLs aplicadas.
- Resend: não executado em staging; depende de `RESEND_API_KEY`, `EMAIL_FROM` e domínio/remetente.
- tracking: não executado em staging; depende de GA4/Meta configurados ou validação sem scripts.
- admin: não executado em staging; depende de `ADMIN_EMAILS` e usuário admin real.
- mobile: não executado em staging; depende de URL remota.

## Bugs encontrados

- Nenhum bug real de staging foi confirmado nesta sessão.
- Bloqueador de validação: a URL/projeto Vercel do AtendeZap IA não foi encontrado no repositório nem entre os projetos listados pelo conector disponível.

## Bugs corrigidos

- Nenhum bug de runtime de staging foi corrigido, porque não houve acesso ao ambiente publicado para reproduzir falhas reais.

## Pendências externas

- Informar a URL do deploy Vercel staging ou vincular o projeto Vercel correto ao conector.
- Confirmar `NEXT_PUBLIC_APP_URL` com a URL staging sem barra final.
- Configurar variáveis da Vercel para Supabase, Stripe, Resend, OpenAI, admin e tracking conforme `docs/vercel-deploy.md`.
- Aplicar migrations no Supabase staging e confirmar RLS.
- Configurar Supabase Auth Site URL e Redirect URLs com o domínio staging.
- Configurar endpoint Stripe `https://DOMINIO-STAGING/api/stripe/webhook` com os eventos obrigatórios.
- Copiar `STRIPE_WEBHOOK_SECRET` do endpoint staging para a Vercel.
- Validar Resend com remetente/domínio autorizado.
- Validar OpenAI com limite de custo configurado.
- Executar `docs/staging-vercel-checklist.md` no ambiente publicado.

## Validações locais executadas

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm test`: passou, 20 arquivos e 83 testes.
- `npm run test:e2e`: passou, 26 testes.
- `npm run check:secrets`: passou, nenhum padrão de segredo real encontrado em arquivos versionados.

## Recomendação

- Pode liberar para primeiros usuários? Não nesta etapa.
- Precisa corrigir algo antes? Antes de liberar usuários, é necessário executar a validação real com URL de staging, logs da Vercel e provedores configurados.
- Recomendação atual: ainda não liberar. Liberar apenas para staging avançado depois que a URL for informada e o checklist pós-deploy for executado de ponta a ponta.
