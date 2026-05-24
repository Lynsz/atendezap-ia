# Go-live Controlado — AtendeZap IA

## Status geral

- Não iniciado

Classificações possíveis:

- Não iniciado
- Em validação
- Validado com pendências
- Pronto para anúncios pequenos
- Pausado por bugs críticos

## Data da validação

- Preencher manualmente depois.

## URL de produção

- Preencher manualmente depois.

## Fluxos validados

- [ ] landing
- [ ] ebook
- [ ] lead
- [ ] e-mail do ebook
- [ ] demo
- [ ] cadastro
- [ ] login
- [ ] onboarding
- [ ] geração de resposta
- [ ] histórico
- [ ] limite mensal
- [ ] assinatura
- [ ] checkout
- [ ] webhook
- [ ] portal Stripe
- [ ] admin
- [ ] feedback
- [ ] tracking
- [ ] mobile

## Bugs encontrados

- Nenhum bug registrado ainda.

## Bugs corrigidos

- Nenhuma correção registrada ainda.

## Pendências externas

- Confirmar URL de produção.
- Confirmar variáveis de produção na Vercel.
- Confirmar Supabase produção com migrations e RLS.
- Confirmar Stripe produção, webhook e portal.
- Confirmar Resend produção.
- Confirmar OpenAI produção e limite de custo.
- Confirmar tracking no domínio final, se configurado.
- Confirmar admin com usuário autorizado e usuário comum bloqueado.

## Recomendação final

- Liberar para mais usuários? Pendente de validação real.
- Rodar anúncios pequenos? Não antes de validar os fluxos críticos e revisar feedback dos primeiros usuários.
- Corrigir antes? Corrigir qualquer P0/P1 antes de convidar mais pessoas.

## Rodada pos-go-live - 2026-05-24

- Status: correcao preventiva e preparacao pre-anuncio, sem bugs reais P0/P1 registrados nos documentos atuais.
- Bugs P0 encontrados: nenhum registrado.
- Bugs P1 encontrados: nenhum registrado.
- Bugs corrigidos: nenhum bug real confirmado; foram aplicadas melhorias pequenas na demo e no dashboard para reduzir friccao.
- Melhorias aplicadas: CTA da demo mais claro para criar conta e salvar respostas; dashboard mostra CTA de feedback apos resposta gerada; copy reforca que a IA gera sugestoes para copiar, ajustar e enviar manualmente.
- Documentacao criada: `docs/post-go-live-fixes.md` e `docs/pre-ads-final-checklist.md`.
- Recomendacao atual: executar uma nova rodada com 3 a 5 usuarios reais antes de ligar anuncios pequenos. Anuncios pequenos devem depender do checklist pre-anuncio final, ausencia de P0/P1 e validacao real de checkout, webhook, e-mail, IA, tracking, admin e mobile.
