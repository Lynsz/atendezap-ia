# Release Notes - AtendeZap IA 1.1

## Tipo

Minor release de estabilidade.

## Resumo

Versao focada em estabilizacao pos-go-live, pos-campanha pequena e pos-escala cautelosa. A 1.1 fecha documentacao, criterios operacionais, revisoes de billing, IA, ativacao, suporte, campanhas e uma correcao P1 de privacidade operacional no suporte.

## Melhorias entregues

- Plano de execucao da 1.1 criado.
- Criterios de escala cautelosa consolidados.
- Backlog, roadmap, auditoria e prontidao atualizados para a release estavel.
- QA final da 1.1 documentado com pendencias externas separadas.

## Correcoes entregues

- Suporte do usuario nao retorna nem exibe mais `admin_notes`; notas internas permanecem no admin protegido.

## Seguranca

- Repositorio permanece privado.
- Sem instrucao para tornar o repositorio publico.
- Sem secrets reais adicionados.
- Sem `.env.local` versionado.
- Suporte corrigido para nao expor notas internas ao usuario.
- Tracking e logs continuam sem conteudo completo de perguntas, respostas, mensagens, e-mails ou dados de pagamento.

## Billing

- Checkout, portal, webhook, status de assinatura, pagamentos falhos, cancelamento e feedback de churn permanecem documentados.
- Validacao real de Stripe segue como pendencia antes de nova escala.
- Nao ha cobranca fora da Stripe nem armazenamento de dados de cartao.

## IA

- Geracao autenticada continua server-side.
- Limite mensal e status de assinatura sao verificados antes da chamada OpenAI.
- Falhas antes da persistencia nao contam como uso.
- Demo publica segue com rate limit e fallback quando OpenAI nao esta configurada.

## Ativacao

- Checklist de primeiros passos, primeira resposta, copiar, salvar, templates, favoritos e planos permanecem como fluxo de ativacao leve.
- Produto continua deixando claro que a resposta deve ser revisada e enviada manualmente.

## Campanhas

- Escala cautelosa segue com dados insuficientes para aumento.
- Proxima decisao deve depender de visitantes, leads, cadastros, onboarding, primeira resposta, checkout, assinatura, suporte, webhook e custo de IA agregados.

## Documentacao

- `docs/version-1.1-execution-plan.md`
- `docs/version-1.1-final-report.md`
- `docs/version-1.1-qa-report.md`
- `docs/version-1.1-release-checklist.md`
- `docs/project-audit.md`
- `docs/final-readiness-report.md`
- `docs/roadmap-post-1.0.md`
- `docs/roadmap-management.md`
- `docs/product-backlog.md`
- `CHANGELOG.md`

## Pendencias

- Rodar validacao completa final.
- Validar staging/producao com Supabase, Stripe, OpenAI, Resend, tracking, admin e health check.
- Preencher relatorios de campanha apenas com dados agregados reais.
- Validar RLS com dois usuarios reais.

