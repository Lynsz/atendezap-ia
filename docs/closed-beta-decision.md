# Decisao Pos-Beta - AtendeZap IA

## Status

* repetir beta

## Motivos da decisao

* Nao ha metricas reais suficientes no repositorio para confirmar que 3 a 10 usuarios completaram o fluxo.
* Nenhum P0 foi confirmado, mas a ausencia de dados reais impede aprovar lancamento pequeno com seguranca.
* O MVP passou por validacoes tecnicas locais, mas ainda precisa de smoke test real autenticado com Supabase, OpenAI, Stripe, suporte, feedback e admin.

## Bloqueadores

* Consolidar usuarios convidados, contas criadas, onboardings, respostas geradas, copias, salvamentos, acessos a assinatura, feedbacks e suporte.
* Aplicar migrations no Supabase real, incluindo eventos beta.
* Confirmar RLS em staging/producao com dois usuarios.
* Confirmar checkout e webhook Stripe em modo teste no ambiente real.
* Confirmar que `/api/health` retorna ok em Preview/Producao.

## Bugs corrigidos

* Copy de tela legada de WhatsApp ajustada para explicitar modo demo, fora do beta e sem integracao direta.
* Copy de tela legada de leads ajustada para nao apresentar CRM completo.
* Copy de tela legada de automacoes ajustada para nao sugerir envio automatico.
* Tracking beta seguro preparado na etapa anterior.

## Bugs pendentes

* Nenhum P0/P1 confirmado.
* Validacao real de ambiente ainda pendente.

## Riscos conhecidos

* Sem metricas reais, a decisao de lancamento pequeno seria especulativa.
* `supabase/schema.sql` esta desatualizado em relacao as migrations.
* Rotas legadas fora do fluxo principal devem continuar fora do roteiro do beta e do lancamento pequeno.
* Secrets reais devem permanecer apenas na Vercel e em `.env.local` local nao versionado.

## Proximo passo

* Completar novo ciclo curto de beta com 3 a 10 usuarios reais.
* Rodar smoke test em Preview/Producao.
* Atualizar `docs/closed-beta-report.md` com metricas reais.
* Reavaliar aprovacao para lancamento pequeno quando os criterios estiverem comprovados.
