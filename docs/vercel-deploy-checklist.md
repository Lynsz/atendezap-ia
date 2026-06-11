# Checklist de Deploy na Vercel

## Antes do deploy

- [ ] Rodar `npm run validate`.
- [ ] Confirmar que `.env.example` nao tem valores reais.
- [ ] Confirmar que `.env.local`, `.env` e `.vercel` nao estao versionados.
- [ ] Configurar variaveis de Supabase, Stripe e OpenAI na Vercel.
- [ ] Definir `NEXT_PUBLIC_APP_URL` com a URL publica correta.
- [ ] Revisar RLS no Supabase.
- [ ] Configurar webhook Stripe apontando para o dominio do ambiente.

## Depois do deploy

- [ ] Abrir `/api/health`.
- [ ] Testar landing, cadastro, login, dashboard e assinatura.
- [ ] Testar geracao de resposta com IA.
- [ ] Testar checkout Stripe em modo teste.
- [ ] Testar Customer Portal com usuario que tem customer Stripe.
- [ ] Verificar logs sem segredos, tokens ou payloads sensiveis completos.

## Criterio minimo

Nao promover para producao se checkout, webhook, login, geracao de IA, limite mensal ou health check falharem.
