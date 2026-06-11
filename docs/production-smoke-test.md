# Smoke Test de Producao

Execute apos cada deploy em Production.

## Publico

- [ ] `/` abre sem erro.
- [ ] `/precos` abre sem erro.
- [ ] `/demo` abre sem erro.
- [ ] `/suporte` abre sem erro.
- [ ] `/termos` e `/privacidade` abrem sem erro.
- [ ] `/api/health` retorna `status: "ok"` e `app: "AtendeZap IA"`.

## Autenticado

- [ ] Cadastro cria usuario ou mostra erro amigavel.
- [ ] Login funciona.
- [ ] `/dashboard` exige sessao e carrega para usuario autenticado.
- [ ] Onboarding salva dados do negocio.
- [ ] Geracao de resposta funciona e respeita limite mensal.
- [ ] Historico e biblioteca de respostas carregam.

## Billing

- [ ] Checkout abre para Starter, Pro e Premium.
- [ ] Webhook recebe evento de teste e atualiza assinatura.
- [ ] Portal Stripe abre para usuario com customer salvo.

## Observabilidade

- [ ] Logs nao mostram secrets.
- [ ] Erros ao usuario nao mostram stack trace.
- [ ] Nenhuma chamada OpenAI ou Stripe e feita pelo navegador.
