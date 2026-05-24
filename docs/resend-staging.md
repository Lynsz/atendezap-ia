# Resend em staging

Use Resend em staging para validar entrega do ebook antes de producao. Se `RESEND_API_KEY` ou `EMAIL_FROM` estiverem vazias, o app deve continuar salvando o lead e registrar envio como `skipped_not_configured`.

## Variaveis

```env
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_APP_URL=
```

1. Configure `RESEND_API_KEY` apenas no servidor.
2. Configure `EMAIL_FROM` com remetente verificado no Resend.
3. Configure `NEXT_PUBLIC_APP_URL` com a URL de staging.
4. Envie o formulario em `/ebook`.
5. Confirme recebimento do e-mail.
6. Confira `lead_email_events` com status `sent`, `failed` ou `skipped_not_configured`.

## Teste sem Resend

1. Remova `RESEND_API_KEY` ou `EMAIL_FROM` do staging.
2. Envie o formulario em `/ebook`.
3. Confirme que o usuario chega em `/ebook/obrigado`.
4. Confirme que `/ebook/guia` abre.
5. Confirme evento `skipped_not_configured`.

## Seguranca

- Nunca use `RESEND_API_KEY` no client.
- Nao colocar valores reais em docs ou codigo.
- Nao retornar stack trace para o navegador.
