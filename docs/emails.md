# E-mails do funil de ebook

O AtendeZap IA usa e-mail transacional para entregar o guia gratuito e preparar a sequência simples de nutrição de leads.

## Variáveis

```env
RESEND_API_KEY=
EMAIL_FROM=AtendeZap IA <noreply@seudominio.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `RESEND_API_KEY`: chave secreta do Resend. Deve existir apenas no servidor.
- `EMAIL_FROM`: remetente verificado no Resend.
- `NEXT_PUBLIC_APP_URL`: URL pública usada para montar links absolutos.

Se `RESEND_API_KEY` estiver vazia, o lead ainda é salvo e a página de obrigado continua funcionando. O evento de e-mail fica com status `skipped`.

## Fluxo atual

1. Lead envia o formulário em `/ebook`.
2. A API `/api/ebook-lead` valida os dados.
3. O lead é salvo ou atualizado em `ebook_leads`.
4. O servidor tenta enviar o e-mail de entrega do guia via Resend.
5. O envio é registrado em `lead_email_events`.
6. O usuário é redirecionado para `/ebook/obrigado`.
7. A página de obrigado também permite acesso imediato ao guia em `/ebook/guia`.

## Template ativo

### E-mail 1: entrega do ebook

- Evento: `ebook_delivery`
- Assunto: `Seu guia gratuito do AtendeZap IA esta aqui`
- CTA principal: `Acessar guia gratuito`
- CTA secundário: `Conhecer o AtendeZap IA`

## Templates preparados

Os próximos templates estão registrados em `src/lib/email.ts` para uso futuro:

- `manual_pain`: dor do atendimento manual.
- `value_demo`: exemplos de respostas prontas com IA.
- `pro_offer`: oferta do Plano Pro por R$ 29 no primeiro mês.

Eles ainda não são disparados automaticamente. A automação com cron ou fila pode ser adicionada depois sem mudar o formulário público.

## Banco de dados

Migration:

```text
supabase/migrations/0006_lead_email_events.sql
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
- `status`: `sent`, `skipped`, `failed` ou `pending`
- `provider`
- `provider_message_id`
- `sent_at`
- `error`
- `created_at`

A tabela usa RLS e não libera acesso para `anon` ou `authenticated`. A escrita acontece pelo backend com service role.

## Como testar localmente

Sem Resend:

1. Deixe `RESEND_API_KEY` vazia.
2. Rode `npm run dev`.
3. Acesse `/ebook`.
4. Envie o formulário.
5. Confirme o redirecionamento para `/ebook/obrigado`.
6. Acesse `/ebook/guia`.
7. No Supabase, confirme o lead em `ebook_leads` e o evento com `status = skipped` em `lead_email_events`.

Com Resend:

1. Configure `RESEND_API_KEY`.
2. Configure `EMAIL_FROM` com um remetente verificado no Resend.
3. Rode `npm run dev`.
4. Envie o formulário em `/ebook`.
5. Confirme o e-mail recebido e o registro `status = sent`.

## Cuidados

- Nunca use `RESEND_API_KEY` no client.
- Não registre senha, cartão, token ou conteúdo privado em logs.
- Não exponha listas de leads em rotas públicas.
- Falha de e-mail não deve impedir o lead de avançar para a página de obrigado.
