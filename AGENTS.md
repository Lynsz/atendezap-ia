# AGENTS.md

Instruções para agentes de código trabalhando no projeto AtendeZap IA.

## 1. Descrição do Projeto

AtendeZap IA é um micro-SaaS/produto digital automatizado para pequenos negócios que atendem pelo WhatsApp Business.

O fluxo principal do MVP é:

1. Cliente compra pela Kiwify.
2. Webhook de compra aprovada chega no app.
3. O app cria cliente, pedido e token mágico no Supabase.
4. O app envia e-mail com link de acesso via Resend.
5. Cliente acessa `/gerar/[token]`.
6. Cliente preenche o formulário do negócio.
7. Backend chama a OpenAI para gerar o kit.
8. Kit é salvo no Supabase.
9. Cliente acessa `/kit/[kitId]` e baixa o PDF.

O objetivo é manter o MVP simples, funcional, vendável e pronto para deploy na Vercel.

## 2. Stack Usada

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI SDK
- Resend
- `@react-pdf/renderer` para geração de PDF
- Zod para validação
- Vitest para testes mínimos
- Deploy compatível com Vercel

## 3. Comandos Obrigatórios Antes de Finalizar

Antes de considerar qualquer tarefa concluída, execute:

```bash
npm run lint
npm run typecheck
npm run build
```

Quando a mudança tocar validação, normalização de webhook, prompt, geração de kit ou lógica crítica, também execute:

```bash
npm run test
```

Se algum comando falhar, corrija antes de finalizar ou registre claramente o motivo do bloqueio.

## 4. Regras de Segurança

- Nunca exponha variáveis secretas no client.
- Nunca use `OPENAI_API_KEY` fora do backend.
- Toda chamada OpenAI deve ficar em rota API, server action segura ou lib chamada apenas pelo servidor.
- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ir para o navegador.
- Use a service role apenas em código backend.
- Não coloque chaves reais em arquivos versionados.
- Não registre payloads sensíveis completos em logs.
- O webhook da Kiwify deve validar segredo quando `KIWIFY_WEBHOOK_SECRET` existir.
- O token mágico deve ser validado antes de permitir geração de kit.
- Cada token deve gerar apenas um kit no MVP.
- Preserve tratamento de erro amigável para o usuário.

## 5. Padrões de Código

- Use TypeScript estrito.
- Prefira componentes reutilizáveis em `src/components`.
- Use validação com Zod em entradas de API e formulários.
- Centralize integrações em `src/lib`.
- Mantenha tratamento de erro claro, com mensagens úteis e sem vazamento de detalhes internos.
- Não duplique lógica de negócio entre páginas e APIs.
- Preserve nomes em português na interface do usuário.
- Evite abstrações grandes sem necessidade.
- Mantenha o código compatível com Vercel.

## 6. Estrutura de Pastas Esperada

```text
src/
  app/
    page.tsx
    precos/page.tsx
    obrigado/page.tsx
    gerar/[token]/page.tsx
    kit/[kitId]/page.tsx
    suporte/page.tsx
    termos/page.tsx
    privacidade/page.tsx
    api/
      kiwify/webhook/route.ts
      generate-kit/route.ts
      download/[kitId]/route.ts
      support/route.ts
  components/
  lib/
    supabase/
    openai.ts
    resend.ts
    pdf.tsx
    kiwify.ts
    tokens.ts
    validators.ts
    errors.ts
  styles/

supabase/
  schema.sql

docs/
  mock-kiwify-webhook.json
```

## 7. Critérios Para Aceitar Mudanças

Uma mudança só deve ser considerada pronta quando:

- `npm run lint` passa.
- `npm run typecheck` passa.
- `npm run build` passa.
- Rotas existentes continuam funcionando.
- Não há segredos hardcoded.
- A lógica sensível continua no backend.
- Validações de entrada continuam ativas.
- O token mágico continua impedindo geração duplicada.
- Erros para usuários continuam claros.
- O README ou documentação é atualizado quando a mudança altera setup, variáveis, comandos ou fluxo.
- Testes são adicionados ou atualizados quando a mudança toca lógica crítica.

## 8. Escopo do MVP

Mantenha o MVP simples.

Não adicione funcionalidades fora do escopo sem pedido explícito do usuário. Em especial, não implementar por conta própria:

- Chatbot conectado ao WhatsApp.
- Integração direta com WhatsApp API.
- Assinatura recorrente.
- Dashboard administrativo complexo.
- Área de membros avançada.
- App mobile.
- Múltiplos idiomas.
- Afiliados.
- Recuperação de carrinho.

Quando houver dúvida, prefira a solução mais simples que preserve o fluxo principal de compra, token mágico, geração do kit e download do PDF.
