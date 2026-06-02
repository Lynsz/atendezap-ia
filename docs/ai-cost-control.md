# Controle de Custos da IA - AtendeZap IA

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

## Revisao Sprint 1 da versao 1.2

- Regra final de limite: validar sessao, assinatura/status, ciclo e uso antes da chamada de IA.
- Quando o limite acaba, retornar mensagem amigavel e nao chamar OpenAI.
- Quando a IA falha, nao persistir resposta e nao consumir uso.
- Demo publica continua com limite separado por IP e fallback controlado.
- Pendencia futura: persistir tokens/modelo apenas se a estimativa interna de custo for necessaria e segura.

