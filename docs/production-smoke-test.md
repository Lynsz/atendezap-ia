# Smoke Test de Producao

Status usado:

- aprovado
- aprovado com observacoes
- bloqueado

## Resultado desta rodada

Ambiente validado nesta rodada: build local em modo producao (`next build` + `next start`).

Ambiente Vercel Preview/Production: bloqueado, porque a URL do deploy e credenciais de teste reais nao foram fornecidas nesta sessao.

## Checklist

| Area | Status | Evidencia / observacao |
| --- | --- | --- |
| Landing | aprovado | `/` retornou 200 localmente. Possui CTAs para cadastro, demo e planos. Contem o texto: "O AtendeZap IA gera respostas para voce copiar, ajustar e enviar. Ele nao envia mensagens automaticamente no WhatsApp." |
| Cadastro/login | aprovado com observacoes | Build e paginas carregam. Validacao real de cadastro/login exige Supabase configurado no Preview/Production. |
| Onboarding | aprovado com observacoes | `/onboarding` usa o fluxo real do `SaasDashboardPage` e grava `businesses`/`user_profiles` com usuario autenticado. Validacao RLS real exige Supabase. |
| Dashboard | aprovado com observacoes | `/dashboard` redirecionou para `/login?redirectTo=%2Fdashboard` sem sessao. Fluxo autenticado real exige Supabase. |
| IA | aprovado com observacoes | API privada retorna 401 sem sessao. Testes cobrem limite, onboarding, falha de IA e persistencia. Geracao real exige `OPENAI_API_KEY`. |
| Biblioteca | aprovado com observacoes | `/biblioteca` redirecionou para login sem sessao. APIs exigem usuario autenticado e filtram por `user_id`. Fluxo real exige Supabase. |
| Templates | aprovado com observacoes | `/dashboard/templates` redirecionou para login sem sessao. Templates estao no dashboard autenticado. |
| Assinatura | aprovado com observacoes | `/assinatura` redirecionou para login sem sessao. Checkout real exige Stripe e Supabase configurados. |
| Checkout Stripe teste | bloqueado | Precisa de Preview/Production com `STRIPE_SECRET_KEY`, Price IDs e usuario autenticado. |
| Webhook Stripe | aprovado com observacoes | Rota publica, usa raw body e valida assinatura. Evento real bloqueado sem endpoint Vercel e signing secret real. |
| Seguranca | aprovado com observacoes | `npm run validate` passou e `check:secrets` nao encontrou secrets obvios. RLS real ainda precisa ser validado com dois usuarios no Supabase. |

## Smoke HTTP local

- `/api/health`: 200.
- `/`: 200.
- `/precos`: 200.
- `/demo`: 200.
- `/suporte`: 200.
- `/termos`: 200.
- `/privacidade`: 200.
- `/dashboard`: 307 para `/login?redirectTo=%2Fdashboard`.
- `/assinatura`: 307 para `/login?redirectTo=%2Fassinatura`.
- `/biblioteca`: 307 para `/login?redirectTo=%2Fbiblioteca`.
- `/dashboard/templates`: 307 para `/login?redirectTo=%2Fdashboard%2Ftemplates`.
- `POST /api/ai/generate-response` sem sessao: 401.
- `POST /api/stripe/create-checkout-session` sem sessao: 401.

## Criterio antes de promover producao

Nao promover se qualquer item abaixo falhar no ambiente Vercel:

- login/cadastro com Supabase real;
- onboarding salvando `user_profiles` e `businesses`;
- geracao OpenAI com limite mensal;
- biblioteca salvando/listando dados do proprio usuario;
- checkout Stripe teste;
- webhook Stripe recebendo evento assinado;
- RLS com dois usuarios reais.
