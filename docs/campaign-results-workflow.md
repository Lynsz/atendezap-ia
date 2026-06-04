# Registro de Campanhas - AtendeZap IA

## Objetivo

Registrar campanhas pequenas, criativos, UTMs e resultados para aprender quais nichos e mensagens funcionam melhor.

## O que registrar

- nome da campanha
- nicho
- canal
- objetivo
- URL com UTM
- criativo
- CTA
- orçamento
- período
- visitantes
- leads
- cadastros
- onboardings
- primeiras respostas
- checkouts
- assinaturas
- observações
- decisão final

## O que não registrar

- dados sensíveis
- dados de pagamento
- conteúdo completo de respostas dos usuários
- chaves de API
- dumps de plataformas de anúncio

## Como usar

1. Crie a campanha em `/admin`, na seção "Campanhas".
2. Preencha canal, nicho, UTMs, orçamento e objetivo.
3. Registre resultados agregados manualmente enquanto a campanha roda.
4. Compare nicho, canal, criativo e página de destino usando apenas métricas agregadas.
5. Marque a decisão final como manter, pausar, ajustar, escalar com cautela ou inconclusivo.
6. Para a campanha otimizada, registre a leitura em `docs/optimized-campaign-analysis.md` e use `docs/optimized-campaign-decision-matrix.md` antes de repetir ou pausar.

## Segurança

O registro é interno, admin-only e manual. Não integra diretamente com Meta Ads, TikTok Ads ou Google Ads nesta etapa.

## Campanha otimizada

- Use `utm_campaign=campanha_otimizada_01`.
- Guarde apenas numeros agregados.
- Use as notas internas para hipotese validada, principal gargalo e proxima acao.
- Se nao houver dados suficientes, marque a decisao como `inconclusive` e nao escale.

## Escala cautelosa

- Marque a campanha como `scale_cautiously` somente quando os pre-requisitos estiverem verdes.
- Registre resultados diarios em `campaign_results`.
- Use a decisao diaria nas observacoes: maintain, increase_slightly, reduce, pause ou fix_before_continue.
- Nao integre Meta, TikTok ou Google Ads diretamente; gasto e visitantes continuam sendo entrada manual agregada.
- Se houver bug P0/P1, custo de IA anormal, suporte critico ou tracking quebrado, pause e registre em `docs/cautious-scale-report.md`.
# Atualizacao Sprint 3 da 1.2

Na leitura pos-Sprint 3, incluir o bloco Conversao do admin:

- visitas ao pricing
- cliques em planos
- checkouts iniciados
- assinaturas ativas
- cadastros com primeira resposta
- pricing apos primeira resposta
- usuarios que salvaram resposta antes do checkout
- taxa aproximada primeira resposta -> checkout
- taxa aproximada checkout -> assinatura

Se algum dado estiver indisponivel, registrar `Sem dados suficientes` e nao extrapolar conclusao.

## Execucao da campanha pos-1.2

- Usar `utm_campaign=post_12_campaign_01`.
- Criar o registro no admin somente apos liberacao operacional, com status `planned` e decisao `inconclusive`.
- Registrar resultados diarios agregados e usar `docs/post-1.2-campaign-live-tracking.md`.
- Aplicar o diagnostico deterministico do admin e o checklist de pausa; nao usar IA para recomendar decisoes.
- Consolidar a decisao em `docs/post-1.2-campaign-analysis-template.md`.
