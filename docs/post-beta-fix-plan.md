# Plano de Correcao Pos-Beta - AtendeZap IA

## Correcoes concluidas

* Documentacao pos-beta criada para relatorio, analise, priorizacao, decisao e plano de correcao.
* Copy de telas legadas ajustada para reforcar que nao ha integracao WhatsApp, envio automatico ou CRM completo no escopo atual.
* Tracking beta seguro preparado e testado na etapa anterior.

## Correcoes pendentes

* Preencher relatorio com metricas reais do beta.
* Aplicar migration dos eventos beta no Supabase real.
* Regenerar ou atualizar `supabase/schema.sql` depois de alinhar banco real.
* Rodar smoke test autenticado completo em Preview/Producao.
* Confirmar RLS com dois usuarios reais.

## Nao sera feito agora

* Integracao direta com WhatsApp.
* Envio automatico de mensagens.
* CRM completo.
* Automacoes complexas.
* App mobile.
* Redesign grande.

## Riscos

* Lancar sem dados reais pode ocultar problema de ativacao, IA, suporte, billing ou mobile.
* Ambiente local nao substitui validacao real com secrets configurados na Vercel.
* Rotas demo/legadas podem confundir se forem divulgadas fora do roteiro.

## Validacao necessaria

* `npm run check:secrets`
* `npm run lint`
* `npm run typecheck`
* `npm run build`
* `npm test`
* `npm run validate`
* Smoke test manual reduzido em Preview/Producao:
  * landing abre
  * cadastro funciona
  * login funciona
  * onboarding funciona
  * dashboard funciona
  * IA gera resposta
  * copiar funciona
  * salvar funciona
  * biblioteca abre
  * template funciona
  * assinatura abre
  * suporte funciona
  * feedback funciona
  * admin bloqueia usuario comum
  * `/api/health` retorna ok

## Proxima etapa recomendada

* Repetir beta curto com dados reais e decidir novamente entre corrigir mais ou iniciar lancamento pequeno controlado.
