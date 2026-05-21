# Resend staging

Use Resend em staging para validar entrega do ebook antes de producao. Se `RESEND_API_KEY` estiver vazia, o app deve continuar salvando o lead e registrar envio como `skipped`.

## Configuracao

1. Crie conta no Resend.
2. Configure um dominio de teste ou use um remetente permitido pelo Resend.
3. Crie uma API key de staging.
4. Configure na Vercel:

```text
RESEND_API_KEY=
EMAIL_FROM=
```

5. `EMAIL_FROM` deve usar remetente verificado, por exemplo no formato `Nome <email@dominio>`.
6. Rode novo deploy.

## Teste do ebook

1. Acesse `/ebook` no staging.
2. Envie lead com e-mail real de teste.
3. Confirme redirecionamento para `/ebook/obrigado`.
4. Confirme e-mail recebido.
5. Confirme registro em `lead_email_events`:
   - `event_type = ebook_delivery`
   - `status = sent`, `failed` ou `skipped`
   - `provider = resend`
6. Confira no admin se o status do lead aparece de forma esperada.

## Teste sem Resend

1. Remova `RESEND_API_KEY` do staging ou use um deploy sem a variavel.
2. Envie lead.
3. Confirme que o usuario ainda chega em `/ebook/obrigado`.
4. Confirme evento `skipped`.

## Cuidados

- Nunca use `RESEND_API_KEY` no client.
- Nao registre corpo completo de e-mails ou dados sensiveis em logs.
- Falha de e-mail nao deve bloquear o funil do ebook.
- Antes de producao, valide dominio/remetente real para reduzir spam/bounce.
