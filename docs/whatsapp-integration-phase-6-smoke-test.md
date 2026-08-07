# Smoke Test — Integração WhatsApp Fase 6

## Status

- [ ] aprovado
- [ ] aprovado com observações
- [x] bloqueado até migration, configuração Meta e teste com dois usuários reais

## Embedded Signup

- [ ] botão de conectar aparece
- [ ] config pública carrega
- [ ] secret não aparece no client
- [ ] fluxo retorna para o app
- [ ] backend processa code server-side
- [ ] conexão é salva para o usuário correto
- [ ] token não aparece no response

## Conexão

- [ ] status conectado aparece
- [ ] phone number aparece mascarado
- [ ] WABA aparece mascarada
- [ ] desconexão funciona
- [ ] reautorização é indicada quando necessário

## Multiempresa

- [ ] usuário A não vê conexão do usuário B
- [ ] webhook roteia pelo phone_number_id
- [ ] envio usa conexão correta
- [ ] templates sincronizam pela conexão correta
- [ ] mídia usa token da conexão correta

## Segurança

- [ ] token criptografado confirmado no banco
- [ ] logs sem payload OAuth bruto
- [ ] admin sem tokens
- [ ] RLS preservado
- [ ] service role apenas server-side

## Bugs encontrados

- Nenhum bug de código conhecido após a validação automatizada; ambiente real pendente.

## Correções aplicadas

- A preencher durante o smoke real.

## Decisão

- Não habilitar Embedded Signup em produção antes de aplicar a migration e aprovar este roteiro com dois tenants.
