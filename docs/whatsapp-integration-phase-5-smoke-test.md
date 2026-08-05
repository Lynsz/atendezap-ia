# Smoke Test — Integração WhatsApp Fase 5

## Status

- [ ] aprovado
- [ ] aprovado com observações
- [x] bloqueado até migration e teste com WABA real controlada

## Sincronização

- [ ] sync exige configuração correta
- [ ] sync não expõe token
- [ ] templates são criados/atualizados localmente
- [ ] status remoto é atualizado
- [ ] histórico de status é salvo
- [ ] payload bruto não é salvo

## Dashboard

- [ ] botão sincronizar aparece
- [ ] lista templates
- [ ] filtra por status
- [ ] filtra por categoria
- [ ] mostra última sincronização
- [ ] mostra erro amigável

## Envio

- [ ] template aprovado pode ser selecionado
- [ ] template pendente é bloqueado
- [ ] template rejeitado é bloqueado
- [ ] template desativado é bloqueado
- [ ] variáveis obrigatórias são validadas
- [ ] envio exige confirmação
- [ ] opt-out bloqueia envio
- [ ] rate limit continua funcionando

## Segurança

- [ ] usuário não vê template de outro usuário
- [ ] admin mostra apenas agregados
- [ ] logs não mostram payload bruto
- [ ] eventos não salvam texto completo
- [ ] token não aparece no client

## Bugs encontrados

- Nenhum bug de ambiente real pode ser descartado sem aplicar a migration e executar o smoke com conta Meta de teste.

## Correções aplicadas

- Validação estrita, bloqueio por status remoto/local, paginação limitada, prévia segura, RLS e tracking categórico foram cobertos por testes automatizados.

## Decisão

- Manter `WHATSAPP_TEMPLATE_SYNC_ENABLED=false` e `WHATSAPP_TEMPLATE_CREATE_ENABLED=false` até concluir este checklist.
