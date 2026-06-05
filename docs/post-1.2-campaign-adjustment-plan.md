# Plano de Ajustes Pos-Campanha Pos-1.2

## P0 - Corrigir imediatamente

- Corrigir falha de checkout, webhook, login, cadastro, IA, tracking, privacidade ou admin se aparecer durante a campanha.
- Pausar qualquer anuncio ativo se houver bug P0/P1 ou exposicao de dados.

## P1 - Corrigir antes de nova campanha

- Preencher validacao real de producao e checklist final da campanha.
- Validar que usuarios conseguem gerar primeira resposta.
- Validar checkout, webhook, portal Stripe, limites e suporte com dados agregados.

## P2 - Melhorar na proxima variacao

- Revisar copy da landing somente se visitantes nao clicarem.
- Revisar onboarding somente se cadastros nao gerarem primeira resposta.
- Revisar CTA para pricing somente se primeiras respostas nao virarem cliques de plano.

## P3 - Backlog futuro

- Testar outro nicho depois de dados agregados.
- Medir custo interno de IA por resposta apenas se a operacao precisar e houver fonte segura.
- Evoluir relatorios somente sem criar BI complexo.

## Ajustes de copy

- Manter promessa centrada em respostas prontas para copiar, ajustar e enviar manualmente.
- Reforcar que nao ha envio automatico pelo WhatsApp se feedback indicar confusao.

## Ajustes de pagina de destino

- Manter `/para/delivery` como destino inicial.
- Revisar mobile se houver queda de visitantes ou clique baixo.

## Ajustes de onboarding

- Nao alterar sem dados. Se houver gargalo, simplificar orientacao para primeira resposta.

## Ajustes do dashboard inicial

- Nao alterar sem dados. Se houver gargalo, destacar exemplos por nicho e CTA de primeira resposta.

## Ajustes de pricing

- Manter Pro R$ 29 no primeiro mes e recorrencia normal depois.
- Nao mudar preco sem sinais agregados de primeira resposta, pricing view e checkout.

## Ajustes de IA

- Nao alterar prompt sem feedback agregado de qualidade.
- Pausar se falhas de IA ocorrerem para multiplos usuarios.

## Ajustes de tracking

- Validar `post_12_campaign_page_view` e `post_12_campaign_cta_click` antes de ativar.
- Nao enviar e-mail, telefone, pergunta, resposta, dados de pagamento, IDs Stripe ou secrets.

## Ajustes de suporte

- Registrar somente contagem e tipo agregado.
- Priorizar bug critico, checkout, webhook, IA e confusao sobre WhatsApp automatico.
