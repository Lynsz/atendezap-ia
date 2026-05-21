# Deploy staging na Vercel

Este guia prepara um ambiente de teste real antes de qualquer trafego pago ou usuario real. Nao coloque chaves reais neste arquivo; configure os valores no painel da Vercel.

## Ambientes

| Ambiente | Uso | URL | Dados |
| --- | --- | --- | --- |
| local | Desenvolvimento em maquina local. | `http://localhost:3000` | Pode usar Supabase/Stripe test ou mocks/fallbacks. |
| staging | Validacao real em Vercel Preview/ambiente de teste. | Dominio temporario da Vercel ou subdominio de teste. | Use Supabase staging, Stripe test mode, Resend/OpenAI de teste. |
| production | Produto real para usuarios e anuncios. | Dominio final. | Use chaves live e banco de producao somente depois do checklist verde. |

Defina `NEXT_PUBLIC_APP_ENV` conforme o ambiente:

```text
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_APP_ENV=production
```

## Passo a passo

1. Crie um projeto na Vercel.
2. Conecte o repositorio GitHub do AtendeZap IA.
3. Confirme que o framework detectado e Next.js.
4. Use os comandos padrao:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: vazio
5. Crie um deploy de Preview ou branch de staging.
6. Copie a URL temporaria gerada pela Vercel.
7. Configure `NEXT_PUBLIC_APP_URL` com essa URL, sem barra final.
8. Configure as variaveis de ambiente da tabela abaixo no ambiente Preview/Staging.
9. Rode novo deploy depois de configurar envs.
10. Abra `/api/health` e confirme `status: "ok"`.
11. Teste paginas publicas: `/`, `/ebook`, `/ebook/obrigado`, `/ebook/guia`, `/demo`, `/login`, `/cadastro`, `/termos`, `/privacidade`.
12. Teste cadastro, login, dashboard e logout com usuario descartavel.
13. Teste Stripe em modo test seguindo `docs/stripe-staging.md`.
14. Teste webhook Stripe apontando para `https://SEU-STAGING.vercel.app/api/stripe/webhook`.
15. Teste Resend seguindo `docs/resend-staging.md`.
16. Teste OpenAI seguindo `docs/openai-staging.md`.
17. Teste admin com `ADMIN_EMAILS` de staging.
18. Teste tracking com GA4 DebugView e Meta Events Manager se os IDs estiverem configurados.
19. Execute `docs/post-deploy-checklist.md` inteiro antes de promover para producao.

## Variaveis na Vercel

| Variavel | Ambiente | Obrigatoria? | Uso |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | Publica | Recomendado | Identifica `local`, `staging` ou `production` em clientes e monitoramento. |
| `NEXT_PUBLIC_APP_URL` | Publica | Deploy basico | Monta links absolutos, redirects Stripe, e-mails e metadata. |
| `NEXT_PUBLIC_SUPABASE_URL` | Publica | Deploy basico | URL do Supabase usado pelo client e rotas de auth. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publica | Deploy basico | Chave anon publica do Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Servidor | Deploy basico | Escritas backend, admin, leads, webhooks. Nunca expor no client. |
| `OPENAI_API_KEY` | Servidor | IA | Geracao real de respostas e kits. |
| `OPENAI_MODEL` | Servidor | IA | Modelo usado nas chamadas OpenAI. Se vazio, o codigo usa fallback interno. |
| `STRIPE_SECRET_KEY` | Servidor | Pagamento | Cria Checkout, portal e consulta Stripe. Use `sk_test_` em staging. |
| `STRIPE_WEBHOOK_SECRET` | Servidor | Pagamento | Valida assinatura do webhook Stripe. Use secret do endpoint staging. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publica | Pagamento | Chave publica Stripe do mesmo modo do secret. |
| `STRIPE_PRICE_STARTER` | Servidor | Pagamento | Price recorrente Starter em Stripe test mode. |
| `STRIPE_PRICE_PRO` | Servidor | Pagamento | Price recorrente Pro em Stripe test mode. |
| `STRIPE_PRICE_PREMIUM` | Servidor | Pagamento | Price recorrente Premium em Stripe test mode. |
| `STRIPE_PRICE_PRO_FIRST_MONTH_29` | Servidor | Pagamento | Price promocional legado/compatibilidade para mapear Pro. |
| `STRIPE_COUPON_PRO_FIRST_MONTH_29` | Servidor | Pagamento | Cupom recomendado para cobrar R$ 29 apenas no primeiro mes do Pro. |
| `RESEND_API_KEY` | Servidor | E-mail | Envio do ebook e e-mails transacionais. |
| `EMAIL_FROM` | Servidor | E-mail | Remetente verificado no Resend. |
| `SUPPORT_EMAIL` | Servidor | Opcional | E-mail exibido em suporte/termos/privacidade. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Publica | Opcional | GA4. Vazio desativa script. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Publica | Opcional | Meta Pixel. Vazio desativa script. |
| `ADMIN_EMAILS` | Servidor | Admin | E-mails autorizados separados por virgula. |
| `UPSTASH_REDIS_REST_URL` | Servidor | Opcional | Rate limit distribuido. Sem isso, usa fallback local/memoria. |
| `UPSTASH_REDIS_REST_TOKEN` | Servidor | Opcional | Token Upstash. |
| `NEXT_PUBLIC_SENTRY_DSN` | Publica | Opcional | Captura client-side do Sentry. |
| `SENTRY_AUTH_TOKEN` | Servidor/build | Opcional | Upload/integração Sentry no build, se configurado. |
| `KIWIFY_WEBHOOK_SECRET` | Servidor | Opcional/legado | Valida webhook Kiwify quando usado. |

## Validacao local antes do push

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
```

## Criterios para promover staging

- Health check verde.
- Fluxo publico completo verde.
- Cadastro/login/dashboard testados com Supabase staging.
- Stripe test mode processa checkout, webhook, portal e cancelamento.
- Resend envia ou registra status controlado.
- OpenAI gera resposta no dashboard e demo nao quebra sem chave.
- Admin bloqueia usuario comum e libera apenas `ADMIN_EMAILS`.
- UTMs aparecem no lead e no checkout.
- Mobile sem overflow nas rotas principais.
