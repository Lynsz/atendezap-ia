# AtendeZap IA

Micro-SaaS para gerar kits de atendimento para WhatsApp Business com IA.

O cliente compra pela Kiwify, recebe um link mágico por e-mail, preenche um formulário sobre o negócio e baixa um PDF com mensagens prontas, respostas rápidas, follow-ups, etiquetas e fluxo de atendimento.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI SDK
- Resend
- PDF com `@react-pdf/renderer`
- Zod
- Vitest
- Deploy compatível com Vercel

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=
EMAIL_FROM="AtendeZap IA <noreply@seudominio.com>"
KIWIFY_WEBHOOK_SECRET=
SUPPORT_EMAIL=suporte@seudominio.com
```

Observações:

- `NEXT_PUBLIC_APP_URL`: URL pública do app. Usada para gerar links absolutos em e-mails.
- Checkout Kiwify: os links oficiais dos planos Básico (`R$29,00`), Starter (`R$49,00`) e Premium (`R$79,00`) ficam centralizados em `src/config/checkout.ts`.
- `SUPABASE_SERVICE_ROLE_KEY`: segredo de backend. Nunca usar no client.
- `OPENAI_API_KEY`: segredo de backend. Toda geração de IA fica nas APIs.
- `RESEND_API_KEY`: se não estiver configurada, o fluxo não quebra, mas o e-mail não é enviado.
- `KIWIFY_WEBHOOK_SECRET`: opcional, mas recomendado em produção.

## Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test
```

Antes de finalizar qualquer mudança, rode:

```bash
npm run lint
npm run typecheck
npm run build
```

## Setup de produção

Leia os guias operacionais:

- [Configuração do Supabase](docs/supabase-setup.md)
- [Integração Kiwify](docs/kiwify-setup.md)
- [Deploy na Vercel](docs/deploy-vercel.md)
- [Checklist de teste manual](docs/manual-test-checklist.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Release notes do MVP](docs/release-notes-mvp.md)

Configure a URL de obrigado na Kiwify como `/obrigado` quando publicar o projeto.

## Testar webhook localmente

Com o servidor rodando:

```bash
curl -X POST http://localhost:3000/api/kiwify/webhook \
  -H "Content-Type: application/json" \
  -d @docs/mock-kiwify-webhook.json
```

Com segredo:

```bash
curl -X POST http://localhost:3000/api/kiwify/webhook \
  -H "Content-Type: application/json" \
  -H "x-kiwify-webhook-secret: seu-segredo" \
  -d @docs/mock-kiwify-webhook.json
```

Depois confira `customers`, `orders` e `events` no Supabase.

## Testar geração de kit

1. Crie um pedido via webhook.
2. Copie `orders.access_token`.
3. Abra `http://localhost:3000/gerar/SEU_ACCESS_TOKEN`.
4. Preencha o formulário.
5. O backend chama a OpenAI, salva em `kits`, marca `access_token_used = true` e redireciona para `/kit/[kitId]`.
6. Clique em “Baixar PDF”.

Se a OpenAI falhar, o token não é marcado como usado e o cliente pode tentar novamente.

## Rotas

- `/` landing page
- `/precos` planos
- `/obrigado` pós-compra
- `/gerar/[token]` formulário protegido por token mágico
- `/kit/[kitId]` preview e download do kit
- `/suporte` suporte simples
- `/termos` termos de uso
- `/privacidade` política de privacidade
- `/api/kiwify/webhook` webhook de compra aprovada
- `/api/generate-kit` geração do kit
- `/api/download/[kitId]` PDF sob demanda
- `/api/support` suporte

## Eventos registrados

- `webhook_received`
- `order_approved`
- `access_email_sent`
- `access_email_failed`
- `kit_generation_started`
- `kit_generation_succeeded`
- `kit_generation_failed`
- `pdf_downloaded`
- `support_request_created`

## Segurança do MVP

- OpenAI roda apenas no backend.
- Service role do Supabase roda apenas no backend.
- Token mágico é imprevisível e único.
- Cada token gera apenas um kit.
- Webhook valida segredo quando configurado.
- Entradas são validadas com Zod.
- RLS fica habilitado no Supabase e sem políticas públicas para tabelas sensíveis.
- Logs em `events` evitam salvar payloads sensíveis completos.

## Limitações do MVP

- Não há chatbot conectado ao WhatsApp.
- Não há integração com WhatsApp API.
- Não há assinatura recorrente.
- Não há dashboard administrativo.
- Não há área de membros avançada.
- O PDF é gerado sob demanda, sem Supabase Storage.
- O rate limit em memória não é compartilhado entre instâncias serverless.
- O conteúdo gerado por IA deve ser revisado pelo usuário.

## Próximos passos

- Configurar checkouts reais na Kiwify.
- Adicionar assinatura HMAC do webhook se disponível.
- Salvar PDFs em Supabase Storage se necessário.
- Criar painel mínimo de pedidos e kits.
- Melhorar monitoramento e alertas.
