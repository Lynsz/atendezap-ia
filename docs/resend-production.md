# Resend Producao

Nao coloque `RESEND_API_KEY` real em codigo ou documentacao. Configure a chave apenas na Vercel Production.

## Configuracao

1. Validar dominio no Resend.
2. Configurar DNS conforme instrucoes do Resend.
3. Configurar remetente final em `EMAIL_FROM`.
4. Configurar `RESEND_API_KEY` na Vercel Production.
5. Configurar `NEXT_PUBLIC_APP_URL` com o dominio final para links do guia.
6. Fazer novo deploy se necessario.

## Teste do funil do ebook

- [ ] Abrir `/ebook` no dominio final.
- [ ] Enviar lead real de teste.
- [ ] Confirmar lead salvo em `ebook_leads`.
- [ ] Confirmar UTM salva quando houver UTM na URL.
- [ ] Confirmar e-mail recebido.
- [ ] Confirmar link para `/ebook/guia`.
- [ ] Confirmar evento `sent` em `lead_email_events`.
- [ ] Confirmar admin mostrando status do envio.

## Falha controlada

- [ ] Testar comportamento quando Resend estiver indisponivel ou mal configurado em ambiente controlado.
- [ ] Confirmar que lead continua salvo.
- [ ] Confirmar `lead_email_events.status` como `failed` ou `skipped_not_configured`.
- [ ] Confirmar que o usuario chega em `/ebook/obrigado`.

## Entregabilidade

- [ ] Verificar caixa de entrada.
- [ ] Verificar spam.
- [ ] Verificar aba Promocoes, se aplicavel.
- [ ] Revisar reputacao do dominio.
- [ ] Evitar anexos pesados; usar link para o guia.

## Seguranca

- `RESEND_API_KEY` apenas no servidor.
- `EMAIL_FROM` configurado por env.
- Logs nao devem expor payload sensivel completo.
- Erros para usuario devem ser amigaveis.
