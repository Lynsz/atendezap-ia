# E-mails do funil de ebook

O AtendeZap IA usa e-mail transacional para entregar o guia gratuito e registrar o status operacional da entrega.

## Variaveis

```env
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_APP_URL=
```

- `RESEND_API_KEY`: chave secreta do Resend. Deve existir apenas no servidor.
- `EMAIL_FROM`: remetente verificado no Resend.
- `NEXT_PUBLIC_APP_URL`: URL publica usada para montar links absolutos do guia, demo, cadastro e planos.

Se `RESEND_API_KEY` ou `EMAIL_FROM` estiverem vazias, o lead ainda e salvo e a pagina de obrigado continua funcionando. O evento de e-mail fica com status `skipped_not_configured`.

## Fluxo atual

1. Lead envia o formulario em `/ebook`.
2. A API `/api/ebook-lead` valida os dados.
3. O lead e salvo ou atualizado em `ebook_leads`.
4. O servidor tenta enviar o e-mail de entrega do guia via Resend.
5. O envio e registrado em `lead_email_events`.
6. O usuario e redirecionado para `/ebook/obrigado`.
7. A pagina de obrigado tambem permite acesso imediato ao guia em `/ebook/guia`.

Se o Supabase falhar ao salvar o lead, a API retorna erro amigavel e nao tenta enviar e-mail. Se o Resend falhar, o lead permanece salvo e o status do envio e registrado.

## Template ativo

### E-mail 1: entrega do ebook

- Evento: `ebook_delivery`
- Assunto: `Seu guia gratuito do AtendeZap IA esta aqui`
- CTA principal: `Acessar guia gratuito`
- CTA secundario: `Testar o AtendeZap IA`

## Templates preparados

Os proximos templates estao registrados em `src/lib/email.ts` para uso futuro:

- `manual_pain`: dor do atendimento manual.
- `value_demo`: exemplos de respostas prontas com IA.
- `pro_offer`: oferta do Plano Pro por R$ 29 no primeiro mes.

Eles ainda nao sao disparados automaticamente. A automacao com cron ou fila pode ser adicionada depois sem mudar o formulario publico.

## Banco de dados

Migrations:

```text
supabase/migrations/0006_lead_email_events.sql
supabase/migrations/0010_lead_email_events_status_index.sql
```

Tabela:

```text
lead_email_events
```

Campos principais:

- `lead_id`
- `email`
- `event_type`
- `subject`
- `status`: `sent`, `failed`, `skipped_not_configured` ou `pending`
- `provider`
- `provider_message_id`
- `sent_at`
- `error`
- `created_at`

A tabela usa RLS e nao libera acesso para `anon` ou `authenticated`. A escrita acontece pelo backend com service role.

## Como testar localmente

Sem Resend:

1. Deixe `RESEND_API_KEY` ou `EMAIL_FROM` vazia.
2. Rode `npm run dev`.
3. Acesse `/ebook`.
4. Envie o formulario.
5. Confirme o redirecionamento para `/ebook/obrigado`.
6. Acesse `/ebook/guia`.
7. No Supabase, confirme o lead em `ebook_leads` e o evento com `status = skipped_not_configured` em `lead_email_events`.

Com Resend:

1. Configure `RESEND_API_KEY`.
2. Configure `EMAIL_FROM` com um remetente verificado no Resend.
3. Configure `NEXT_PUBLIC_APP_URL`.
4. Rode `npm run dev`.
5. Envie o formulario em `/ebook`.
6. Confirme o e-mail recebido e o registro `status = sent`.

## Cuidados

- Nunca use `RESEND_API_KEY` no client.
- Nao registre senha, cartao, token ou conteudo privado em logs.
- Nao exponha listas de leads em rotas publicas.
- Falha de e-mail nao deve impedir o lead de avancar para a pagina de obrigado.
