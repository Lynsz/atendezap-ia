# Smoke Test — Integração WhatsApp Fase 1

## Status

- [ ] aprovado
- [ ] aprovado com observações
- [x] bloqueado até teste com credenciais e conta Meta reais em ambiente controlado

## Configuração

- [ ] migration aplicada no Supabase do ambiente
- [ ] envs configuradas na Vercel
- [ ] webhook URL pública disponível
- [ ] verify token funcionando na Meta
- [x] tokens não aparecem no código client

## Webhook

- [x] GET verifica/rejeita token em teste automatizado
- [x] POST aceita payload mockado
- [x] assinatura inválida é rejeitada quando App Secret existe
- [x] texto e mídia são parseados sem salvar payload bruto
- [ ] mensagem inbound real é salva
- [x] resposta automática não é disparada

## Dashboard

- [x] menu é condicionado ao status habilitado
- [ ] conversas reais aparecem
- [ ] mensagens reais aparecem
- [ ] sugestão real de IA é gerada
- [x] sugestão pode ser editada na interface
- [x] envio exige `confirmSend: true`
- [x] janela de 24 horas e opt-out são validados em teste automatizado

## Segurança

- [x] policies usam `auth.uid()` e client tem somente SELECT
- [x] admin mostra somente métricas agregadas
- [x] logger omite conteúdo e secrets
- [x] tracking aceita somente metadata segura
- [ ] isolamento RLS confirmado contra o Supabase do ambiente

## Bugs encontrados

- Nenhum bug crítico conhecido nos testes locais.

## Correções aplicadas

- Contrato de envio exige confirmação literal e idempotência.
- Nomes das colunas foram alinhados ao contrato da Fase 1.

## Decisão

Base de código pronta para validação operacional controlada. Não habilitar em produção antes de concluir todos os itens não marcados.
