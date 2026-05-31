# Criterios para Pausar Anuncios - AtendeZap IA

Use este documento durante a primeira campanha pequena. A regra e preservar caixa, reputacao e confianca antes de tentar escalar.

Para go-live controlado, use tambem `docs/emergency-pause-criteria.md`.

## Pausar imediatamente

- checkout quebrado
- lead nao salva
- cadastro nao funciona
- IA nao gera resposta
- webhook nao libera assinatura
- erro 500 em pagina principal
- custo consumindo sem tracking
- admin inacessivel para acompanhar campanha
- dados de usuario expostos ou suspeita de falha de seguranca

## Ajustar antes de continuar

- muitos cliques e nenhum lead
- muitos leads e nenhum cadastro
- muitos cadastros e ninguem conclui onboarding
- usuarios reclamam que nao entenderam o produto
- mobile ruim
- pricing confuso
- pagina de obrigado nao leva para demo/cadastro
- demo gera curiosidade, mas nao leva a cadastro
- feedbacks indicam dificuldade repetida

## Continuar com cautela

- leads chegando
- usuarios testando demo
- cadastros acontecendo
- algumas primeiras respostas geradas
- feedbacks corrigiveis
- pelo menos sinal de intencao de compra
- checkout iniciado sem erro tecnico
- tracking suficiente para tomar decisao diaria

## Como decidir

- P0 tecnico ou pagamento quebrado: pausar.
- P1 de ativacao/conversao: reduzir orcamento ou pausar, corrigir e retestar.
- Dados insuficientes sem erro tecnico: manter baixo orcamento ate formar amostra minima.
- Sinais positivos com feedback corrigivel: continuar com cautela e corrigir pequenos atritos.

## Depois da primeira rodada

- Se nao houver dados suficientes, nao aumentar orcamento; preencher `docs/first-campaign-analysis.md` e rodar nova hipotese pequena.
- Se o gargalo principal estiver claro, corrigir P0/P1 em `docs/post-campaign-improvement-plan.md` antes de nova campanha.
- Se o tracking estiver incompleto, pausar ate corrigir os eventos principais e UTMs.
- Se a pausa acontecer nas primeiras 72 horas, registrar tambem em `docs/go-live-daily-report-template.md`.
