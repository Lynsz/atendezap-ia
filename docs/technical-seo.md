# SEO tecnico

## Fonte de URL publica

O app usa `NEXT_PUBLIC_APP_URL` como URL canonical. Em preview/deploy da Vercel, `VERCEL_URL` e usado como fallback. Localmente, o fallback e `http://localhost:3000`.

## Sitemap

Arquivo: `src/app/sitemap.ts`

Inclui:

- `/`
- `/atendimento-whatsapp-ia`
- `/demo`
- `/ebook`
- `/ebook/guia`
- `/precos`
- `/cadastro`
- `/login`
- `/feedback`
- `/suporte`
- `/termos`
- `/privacidade`
- paginas publicas em `/para/[slug]`

Nao inclui:

- `/dashboard`
- `/dashboard/*`
- `/admin`
- `/assinatura`
- `/api/*`
- aliases privados como `/app`

## Robots

Arquivo: `src/app/robots.ts`

Bloqueios principais:

- `/admin`
- `/dashboard`
- `/assinatura`
- `/api`
- `/app`

O `robots.txt` aponta para `/sitemap.xml`.

## Metadata

- `src/app/layout.tsx` define metadata base, title template, description, Open Graph, Twitter e robots padrao.
- Paginas publicas principais definem title/description/canonical local.
- Paginas por nicho usam `generateMetadata` com dados de `src/config/niches.ts`.
- Paginas privadas e de pos-conversao sensivel usam `robots: { index: false, follow: false }` quando aplicavel.

## Regras de seguranca para SEO

- Nao colocar tokens, e-mails, telefone, prompts, respostas completas ou dados de cliente em metadata.
- Nao adicionar rotas privadas ao sitemap.
- Nao transformar pagina privada em indexavel para tentar aumentar SEO.
- Nao prometer envio automatico pelo WhatsApp, integracao direta ou CRM se a funcionalidade nao existe.

## Validacao

Automatizado:

```bash
npm run validate
npm run test:e2e
```

Manual apos deploy:

- Abrir `/sitemap.xml` e confirmar apenas rotas publicas.
- Abrir `/robots.txt` e confirmar bloqueio das areas privadas.
- Conferir title/description de `/`, `/demo`, `/precos`, `/ebook` e paginas de nicho.
- Conferir que `/dashboard`, `/admin` e `/assinatura` nao aparecem no sitemap.
