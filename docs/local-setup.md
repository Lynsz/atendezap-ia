# Setup local rapido

## 1. Clonar e instalar

```bash
git clone <url-do-repositorio-privado>
cd atendezap-ia
npm install
```

No PowerShell do Windows, se `npm` for bloqueado por politica de execucao, use:

```bash
npm.cmd install
npm.cmd run dev
```

## 2. Variaveis locais

Copie `.env.example` para `.env.local` e preencha apenas com valores de teste/desenvolvimento.

Nunca commite `.env.local` ou secrets reais.

Variaveis principais:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
```

## 3. Supabase

Crie ou abra o projeto Supabase, configure Auth por e-mail/senha e aplique `supabase/schema.sql` ou as migrations de `supabase/migrations/`.

Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` no client. Use `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor.

## 4. Stripe em teste

Use chaves de teste da Stripe em `.env.local`.

Configure os Price IDs dos planos nas variaveis `STRIPE_PRICE_*`. Para webhook local, use o Stripe CLI e preencha `STRIPE_WEBHOOK_SECRET`.

## 5. OpenAI e Resend

Preencha `OPENAI_API_KEY` para gerar respostas reais com IA.

Preencha `RESEND_API_KEY` e `EMAIL_FROM` para fluxos de e-mail. Sem Resend configurado, rotas devem retornar erro claro.

## 6. Rodar localmente

```bash
npm run dev
```

Abra `http://localhost:3000`.

Se o `next dev` falhar carregando um hook antigo de instrumentation, limpe o cache local e rode de novo:

```bash
Remove-Item -Recurse -Force .next
npm.cmd run dev
```

## 7. Validar antes de continuar

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run validate
```

O produto gera respostas para copiar, ajustar e enviar manualmente pelo WhatsApp. Ele nao envia mensagens automaticamente e nao integra diretamente com a API do WhatsApp.
