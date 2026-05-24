# Setup Resend

Este guia documenta a configuracao do Resend para entregar o guia gratuito do AtendeZap IA.

## Variaveis

```env
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_APP_URL=
```

- `RESEND_API_KEY`: chave secreta do Resend, usada apenas no servidor.
- `EMAIL_FROM`: remetente validado no Resend, por exemplo `AtendeZap IA <noreply@seudominio.com>`.
- `NEXT_PUBLIC_APP_URL`: URL publica do app, usada para montar links como `/ebook/guia` e `/demo`.

Nao coloque valores reais em documentacao, codigo ou arquivos versionados.

## Configuracao local

1. Criar conta no Resend.
2. Configurar e validar um remetente ou dominio de envio.
3. Copiar `.env.example` para `.env.local`.
4. Preencher `RESEND_API_KEY`, `EMAIL_FROM` e `NEXT_PUBLIC_APP_URL`.
5. Rodar `npm run dev`.
6. Abrir `/ebook` e enviar um lead de teste.
7. Conferir o e-mail recebido.
8. Conferir `ebook_leads` e `lead_email_events` no Supabase local/staging.

## Configuracao Vercel

1. Abrir Project Settings.
2. Abrir Environment Variables.
3. Adicionar `RESEND_API_KEY` como variavel server-side.
4. Adicionar `EMAIL_FROM`.
5. Confirmar `NEXT_PUBLIC_APP_URL` com a URL do ambiente.
6. Repetir em Preview e Production quando necessario.
7. Testar o formulario do ebook em staging antes de producao.

## Fluxo do ebook

1. Visitante envia o formulario em `/ebook`.
2. API valida nome, e-mail, WhatsApp opcional, tipo de atuacao e UTMs.
3. Lead e salvo em `ebook_leads`.
4. Servidor tenta enviar e-mail via Resend.
5. Envio e registrado em `lead_email_events`.
6. Usuario segue para `/ebook/obrigado`.
7. A pagina de obrigado mostra acesso imediato a `/ebook/guia`.

## Falhas esperadas

- Resend nao configurado: registrar `skipped_not_configured`.
- `EMAIL_FROM` ausente: registrar `skipped_not_configured`.
- Dominio/remetente nao verificado: registrar `failed`.
- E-mail invalido: API retorna 400 antes de salvar.
- Erro temporario do Resend: registrar `failed`.
- Falha ao salvar lead no Supabase: retornar erro amigavel e nao tentar envio.

## Seguranca

- `RESEND_API_KEY` nunca deve ir para o client.
- `EMAIL_FROM` e usado apenas no servidor.
- Nao retornar stack trace para o navegador.
- Nao logar payloads completos com dados pessoais quando uma mensagem resumida for suficiente.
- O admin acessa leads e status apenas por API protegida.

## Reenvio

O reenvio manual do e-mail ainda nao foi implementado. Se for necessario, criar uma rota admin protegida que aplique rate limit, reenvie apenas para um lead existente e registre um novo evento em `lead_email_events`.
