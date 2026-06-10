# Correção Funcional do MVP — AtendeZap IA

## Status

- funcional

## Fluxos testados

- Landing `/` via HTTP local.
- Rotas privadas por código: `/dashboard`, `/dashboard/biblioteca`, `/assinatura` usam `ProtectedRoute`.
- Onboarding `/onboarding` abre a aba de configuração do dashboard e salva em `businesses` no Supabase.
- IA por código: `/api/ai/generate-response` autentica usuário, busca contexto, valida limite e chama OpenAI apenas no servidor.
- Biblioteca por código: `/api/saved-responses` lista/salva por `user_id`; `/api/saved-responses/[id]` atualiza/exclui por `user_id`.
- Stripe por código: checkout, portal e webhook ficam server-side; webhook valida assinatura e trata eventos principais.

## Correções feitas

- Adicionado aviso obrigatório na landing: o produto gera respostas para copiar, ajustar e enviar, sem envio automático no WhatsApp.
- Ajustada mensagem de Stripe sem configuração para: “Stripe ainda não configurado no ambiente local.”

## Fluxos funcionando

- Landing carrega localmente com status 200.
- CTA para cadastro, demo e planos existe na landing.
- Login/cadastro usam Supabase Auth.
- Dashboard, biblioteca e assinatura ficam protegidos para usuário logado.
- Dashboard permite configurar negócio, gerar resposta, copiar, salvar e acessar biblioteca/assinatura.
- Templates locais existem para delivery, estética, restaurante, loja, assistência técnica, prestador de serviço e autônomo.
- Assinatura carrega sem depender de Stripe configurado.

## Fluxos pendentes

- Teste manual com usuário real depende de `.env.local` preenchido com Supabase, OpenAI e Stripe de teste.
- `npm.cmd install` travou por timeout nesta rodada, mas o projeto já estava instalado e as validações passaram.
- O navegador interno não pôde ser controlado pelo runtime local nesta rodada; a landing foi validada por HTTP.

## Variáveis necessárias

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_PREMIUM`
- `RESEND_API_KEY`
- `EMAIL_FROM`

## Como testar

```bash
npm.cmd run dev
```

Abra `http://localhost:3000`, crie conta, configure o negócio em `/onboarding`, gere uma resposta no dashboard, copie, salve na biblioteca e abra `/assinatura`.

## Próximo passo recomendado

- Preencher `.env.local` com ambiente de teste e executar um teste manual completo com um usuário novo.
