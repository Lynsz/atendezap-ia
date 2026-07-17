# Análise de Billing e Custo — Versão 1.1

## Stripe

* Integração permanece server-side e depende de variáveis de ambiente.
* Uso real, receita, falhas e conciliação nas 72 horas: não disponíveis.

## Checkout

* Exige sessão autenticada.
* O corpo aceita `planId` e metadados categóricos/UTM limitados; campos desconhecidos são rejeitados.
* O plano é validado contra `starter`, `pro` e `premium`; o Price ID vem da configuração server-side.
* Não aceita preço, Price ID ou `user_id` do client como autoridade.

## Portal

* Exige sessão autenticada e busca o customer Stripe associado ao usuário no servidor.
* Funcionamento no ambiente final: não disponível.

## Webhook

* Lê o corpo bruto e valida `stripe-signature` com `STRIPE_WEBHOOK_SECRET`.
* Eventos duplicados são identificados pelo ID do evento.
* Persiste apenas resumo do evento (`id`, `type`, `created` e `livemode`), não o payload completo.
* Recebimentos, falhas e atualização real de assinaturas: não disponíveis.

## Planos

* Free: 20 respostas/mês.
* Starter: 100 respostas/mês.
* Pro: 500 respostas/mês.
* Premium: 1.500 respostas/mês.
* Os IDs reais de preço não estão hardcoded; são lidos de variáveis `STRIPE_PRICE_*`.

## Limites mensais

* O limite é verificado antes da chamada OpenAI.
* Somente assinaturas `active` ou `trialing` recebem limite pago; estados inseguros usam o limite Free.
* Falha da OpenAI não consome uso; sucesso incrementa após a resposta ser salva.
* Limites atingidos nas 72 horas: não disponível.

## Uso OpenAI

* Respostas geradas, tokens e custo do painel no período: não disponíveis.
* Não há base para estimar custo médio por resposta.

## Custo estimado

* **não calculável** sem custo do projeto OpenAI e número de respostas geradas na mesma janela.
* Nenhum valor foi inferido ou inventado.

## Riscos

* Configuração incorreta de Price IDs, coupon, webhook secret ou URL pública no ambiente final.
* Falta de dados pode ocultar falhas de monetização e custo anormal.
* Concorrência no incremento de uso deve continuar monitorada em carga real; não há incidente confirmado.

## Recomendações

* Executar checkout em modo teste, abrir o portal e validar webhook assinado em Preview/Production.
* Reconciliar eventos Stripe com assinaturas no Supabase sem armazenar dados de cartão ou payload completo.
* Registrar custo OpenAI e volume agregado na mesma janela antes de avaliar margem ou liberar campanha.
* Manter `check:secrets`, limites mensais e testes de billing ativos.

## Confirmações de segurança

* Dados de cartão não são salvos pelo fluxo revisado.
* Price ID real não está no código; apenas nomes de variáveis de ambiente estão versionados.
* Checkout não aceita preço vindo do client.
* Webhook valida assinatura antes de processar o evento.
* Limites mensais continuam implementados e cobertos por testes locais.
