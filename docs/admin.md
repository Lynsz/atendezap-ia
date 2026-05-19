# Admin interno

O painel admin fica em:

```text
/admin
```

Ele serve para acompanhar leads, campanhas, entregas do ebook, assinaturas e conversão aproximada sem abrir o Supabase manualmente.

## Proteção

A proteção usa a variável de ambiente:

```env
ADMIN_EMAILS=
```

Para múltiplos admins, separe por vírgula:

```env
ADMIN_EMAILS=admin1@seudominio.com,admin2@seudominio.com
```

O usuário precisa estar logado no Supabase e o e-mail da sessão precisa existir em `ADMIN_EMAILS`.

Os dados administrativos são carregados por `/api/admin/overview`, que valida:

1. Token Supabase no header `Authorization`.
2. Usuário válido via `supabase.auth.getUser()`.
3. E-mail presente em `ADMIN_EMAILS`.
4. Consulta com service role apenas no servidor.

Usuários comuns podem até abrir a rota visual `/admin`, mas não recebem dados. A API retorna `401` ou `403`.

## Métricas exibidas

- Total de leads.
- Leads dos últimos 7 dias.
- Leads dos últimos 30 dias.
- Total de usuários cadastrados.
- Total de assinaturas ativas.
- Total de assinaturas canceladas.
- Plano mais usado.
- Ebooks enviados com sucesso.
- Falhas no envio do ebook.
- Taxa aproximada lead -> cadastro.
- Taxa aproximada cadastro -> assinatura.
- Taxa aproximada lead -> assinatura.

## Leads

A tabela mostra nome, e-mail, WhatsApp, tipo de atuação, source, UTM source, UTM campaign, data de cadastro e status do envio do ebook.

Filtros:

- Busca por nome ou e-mail.
- Tipo de atuação.
- `utm_source`.
- `utm_campaign`.
- Período: hoje, últimos 7 dias, últimos 30 dias ou todos.

## Exportação CSV

O botão `Exportar CSV` exporta os leads já carregados no painel e respeita os filtros aplicados.

Campos exportados:

```text
name,email,whatsapp,business_type,source,utm_source,utm_medium,utm_campaign,utm_content,utm_term,created_at
```

## Assinaturas

A seção de assinaturas mostra e-mail do usuário, plano, status, limite mensal, uso atual do mês, Stripe customer id, Stripe subscription id, renovação/fim do período e datas de criação/atualização.

Não há edição manual de assinatura nesta etapa.

## Conversão aproximada

A conversão lead -> cadastro usa e-mail como chave aproximada entre `ebook_leads.email` e `profiles.email`.

Limitações:

- Se o lead usar um e-mail e criar conta com outro, a conversão não será associada.
- Se houver registros antigos sem e-mail normalizado, a taxa pode ficar menor que a real.
- A taxa lead -> assinatura usa assinaturas ativas sobre leads totais, não uma atribuição perfeita por campanha.

## Banco de dados

Esta etapa não cria tabela nova para admin. Ela lê dados já existentes:

- `ebook_leads`
- `lead_email_events`
- `profiles`
- `subscriptions`
- `generated_responses`

## Como testar

1. Configure `ADMIN_EMAILS` com o e-mail de um usuário cadastrado.
2. Rode `npm run dev`.
3. Faça login com esse usuário.
4. Acesse `/admin`.
5. Verifique cards, leads, filtros, CSV e assinaturas.
6. Faça login com outro usuário que não esteja em `ADMIN_EMAILS`.
7. Acesse `/admin` e confirme o bloqueio.
8. Tente chamar `/api/admin/overview` sem token ou com usuário comum e confirme `401/403`.
