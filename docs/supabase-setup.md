# Configuração do Supabase

## 1. Criar projeto

1. Acesse o Supabase.
2. Crie um novo projeto.
3. Aguarde a criação do banco.

## 2. Rodar schema

1. Abra o SQL Editor.
2. Cole o conteúdo de `supabase/schema.sql`.
3. Execute o script.

O schema cria:

- `customers`
- `orders`
- `kits`
- `support_requests`
- `events`

Também cria índices, índices únicos para idempotência e habilita RLS.

## 3. Obter variáveis

Em Project Settings > API, copie:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use a anon key apenas como variável pública. Use a service role somente no backend.

## 4. RLS no MVP

O MVP usa o backend com `SUPABASE_SERVICE_ROLE_KEY` para ler e escrever nas tabelas. Por isso, as tabelas sensíveis ficam com RLS habilitado e sem políticas públicas para `anon` ou `authenticated`.

Estratégia segura:

- Cliente não escreve diretamente no Supabase.
- APIs do Next validam entrada e usam service role no servidor.
- `anon` e `authenticated` não têm acesso direto às tabelas.

## 5. Storage

O MVP não usa Supabase Storage para PDFs. O PDF é gerado sob demanda em:

```text
/api/download/[kitId]
```

Não é necessário criar bucket nesta versão.

## 6. Testar conexão local

1. Preencha `.env.local`.
2. Rode `npm run dev`.
3. Envie o webhook mock.
4. Confira se foram criados registros em `customers`, `orders` e `events`.

## 7. Testar kit

1. Copie `orders.access_token`.
2. Abra `/gerar/[token]`.
3. Preencha o formulário.
4. Confira `kits`.
5. Abra `/kit/[kitId]`.
6. Baixe o PDF.
