# QA Final - Versao 1.1 AtendeZap IA

## Status

- aprovado com observacoes

## Ambiente

- Revisao local de codigo e documentacao.
- Teste automatizado focado executado: `npm test -- src/app/api/support/route.test.ts`.
- Validacao completa pendente de execucao final: `npm run validate`.

## Checklist manual documentado

- landing: sem P0/P1 identificado na revisao documental; validar visualmente no ambiente final.
- pagina por nicho: manter `/para/delivery` como hipotese, nao como vencedor; validar mobile e UTMs.
- demo: rate limit e fallback documentados; nao promete envio automatico.
- ebook: manter lead e tracking seguros; validar envio real com Resend.
- cadastro: validar Supabase Auth em staging/producao.
- login: validar redirecionamento e rotas privadas em staging/producao.
- onboarding: monitorar queda entre cadastro, onboarding e primeira resposta.
- primeira resposta: limite verificado antes da OpenAI e uso contado apos persistencia bem-sucedida.
- salvar resposta: fluxo mantido dentro da biblioteca simples.
- templates: continuam como apoio de ativacao, sem CRM.
- assinatura: validar plano, status, uso, limite, checkout e portal com Stripe real/test mode.
- checkout teste: pendente de execucao no ambiente Stripe.
- webhook teste: pendente de execucao com assinatura Stripe.
- suporte: P1 corrigido; usuario nao recebe `admin_notes` na API/tela de ajuda.
- privacidade: manter processos de exportacao/exclusao e dados agregados.
- admin: manter acesso por `requireAdmin`; dados sensiveis nao devem aparecer em relatorios agregados.
- tracking seguro: manter eventos sem pergunta, resposta, e-mail, mensagem completa ou dados de pagamento.
- health check: validar `/api/health` no ambiente final.

## Resultado automatizado ate agora

- `npm test -- src/app/api/support/route.test.ts`: passou.

## Pendencias de QA

- Rodar `npm run validate`.
- Se existir tempo/ambiente, rodar `npm run test:e2e`.
- Fazer smoke visual em staging/producao antes de campanha.

