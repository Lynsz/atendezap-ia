# Controle de Custos da IA — AtendeZap IA

## Objetivo

Evitar uso excessivo da OpenAI e proteger a operacao.

## Regras

- Verificar limite antes de chamar OpenAI.
- Nao chamar OpenAI se usuario estiver sem direito de uso.
- Nao chamar OpenAI se limite mensal acabou.
- Aplicar rate limit na demo.
- Aplicar rate limit em APIs sensiveis.
- Nao logar conteudo completo de prompts ou respostas.
- Monitorar uso semanalmente.

## Metricas

- Respostas geradas.
- Falhas de IA.
- Uso por plano.
- Usuarios perto do limite.
- Usuarios que atingiram limite.
- Uso da demo.
- Custo no painel da OpenAI.

## Acoes se custo subir

- Reduzir limite da demo.
- Revisar prompts.
- Revisar modelo.
- Ajustar limites por plano.
- Pausar campanhas.
- Bloquear abuso.

## Estimativa de custo

O app ainda nao salva tokens por resposta. Por isso, a estimativa interna fica indisponivel e o custo real deve ser conferido no painel da OpenAI.
