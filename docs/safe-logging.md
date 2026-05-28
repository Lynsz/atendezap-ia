# Logs Seguros - AtendeZap IA

## Pode registrar
- nome da rota
- acao executada
- status de sucesso/falha
- timestamp
- erro generico
- codigo de status
- id parcial de usuario, se necessario

## Nao pode registrar
- chaves de API
- tokens
- senha
- conteudo completo da mensagem do cliente
- resposta completa da IA
- dados de pagamento
- dados sensiveis
- service role key

## Implementacao atual
- `src/lib/logger.ts` centraliza logs server-side.
- `src/lib/events.ts` registra eventos internos na tabela `events` com metadata sanitizada.
- IDs de usuario sao mascarados nos logs.
- E-mails e chaves sensiveis sao mascarados ou omitidos.
- Campos como prompt, resposta, conteudo, payload e mensagem sao omitidos.
- Eventos de analytics em `src/lib/tracking.ts` removem campos sensiveis como e-mail, pergunta, resposta, mensagem, token, secret e dados de pagamento.
- Notas internas de solicitacoes de dados devem registrar apenas andamento operacional, sem dados sensiveis.
- Logs de suporte registram apenas evento, rota, status, categoria/prioridade e usuario mascarado quando aplicavel; nao registram mensagem completa, e-mail completo, dados de pagamento ou secrets.

## Objetivo
Logs devem ajudar a investigar falhas sem vazar dados.
