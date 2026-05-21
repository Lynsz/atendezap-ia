# Plano de rollback

Use este plano quando uma falha impedir compra, acesso, geracao de IA ou operacao basica. Em caso de duvida, pause trafego pago antes de investigar.

## Se deploy quebrar

- Voltar para o deployment anterior na Vercel.
- Conferir logs do deployment com falha.
- Corrigir build, env ausente ou erro de runtime.
- Rodar validacoes locais.
- Fazer novo deploy.

## Se Stripe quebrar

- Pausar anuncios.
- Verificar webhook.
- Conferir price IDs.
- Testar checkout.
- Conferir portal do cliente.
- Corrigir variaveis ou configuracao no Stripe.
- Reprocessar liberacao de plano apenas para pagamentos confirmados.

## Se Supabase quebrar

- Pausar alteracoes de schema.
- Revisar migrations aplicadas.
- Conferir RLS.
- Conferir uso de service role apenas no servidor.
- Validar backup.
- Corrigir policies ou schema em ambiente seguro antes de repetir em producao.

## Se OpenAI gerar custo alto

- Reduzir limites.
- Desativar demo temporariamente, se necessario.
- Aplicar ou apertar rate limit.
- Monitorar uso.
- Revisar logs para abuso ou loops de chamada.

## Se anuncios gerarem leads sem conversao

- Revisar landing.
- Revisar checkout.
- Revisar preco.
- Revisar tracking.
- Revisar publico.
- Conferir se UTMs estao sendo salvas e associadas ao checkout.
