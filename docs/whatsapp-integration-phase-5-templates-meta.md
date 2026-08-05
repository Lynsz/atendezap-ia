# Integração WhatsApp — Fase 5 Templates Meta

## Objetivo

Sincronizar templates com a Meta e manter governança segura.

## Sincronização

- `POST /api/whatsapp/templates/sync` exige login, conexão ativa, rate limit e flag de sync.
- `POST /api/internal/whatsapp/sync-templates` exige `INTERNAL_JOB_SECRET`.
- A consulta usa o WABA server-side, cursor da Meta e limite configurável entre 1 e 200.
- O retorno contém somente contagens e categorias de erro; token e payload bruto nunca retornam.

## Status

- `remote_status` vem da Meta e não pode ser alterado pelo client.
- `local_status` governa rascunho, ativo, oculto, incompatível ou desativado.
- Toda transição remota é registrada em `whatsapp_template_status_history`.
- `pending`, `rejected`, `paused`, `disabled`, `deleted`, `flagged` e status desconhecido bloqueiam envio.

## Categorias

- A sincronização reconhece `utility`, `marketing` e `authentication`.
- Rascunhos locais também aceitam `service` e `other` para organização, mas precisam ser ajustados para uma categoria aceita pela Meta antes de submissão externa.

## Idiomas

- Idiomas seguem formato como `pt_BR` ou `en_US`.
- Nome e idioma identificam a variante do template para o usuário.

## Variáveis

- O banco guarda apenas componente, posição, nome e tipo.
- Valores reais existem somente durante prévia/envio e não entram em auditoria, analytics ou tentativas.
- Valores são strings de até 200 caracteres; objetos, campos extras, HTML e scripts são bloqueados.

## Envio

- O backend resolve conversa, contato, telefone, conexão e template.
- O envio exige opt-in, template remoto aprovado, estado local ativo, variáveis válidas, rate limit, idempotência e `confirmSend: true`.
- A prévia é apenas visual e não vira mensagem livre fora da janela.

## Bloqueios

- template de outro usuário;
- template de outra conexão;
- status remoto não aprovado;
- rascunho, oculto, desativado ou componente incompatível;
- schema de variáveis inconsistente;
- opt-out ou ausência de opt-in;
- excesso de chamadas ou duplicidade recente.

## Auditoria

- Sync, transição, rascunho, edição, ocultação, prévia e bloqueio têm ações categóricas.
- Não são gravados texto completo, valores de variável, telefone, token, payload ou erro bruto.

## Admin

- O painel mostra contagens de templates sincronizados, aprovados, pendentes, rejeitados, desativados, enviados, bloqueados e syncs concluídos/falhos.
- Nenhum conteúdo de template ou dado de contato aparece no agregado.

## Segurança

- Credenciais ficam server-only.
- RLS permite ao usuário somente leitura dos próprios templates e histórico.
- Escritas passam por rotas autenticadas com service role.
- Flags começam desativadas e exigem migration e smoke antes da liberação.

## Submissão à Meta

Não implementada nesta fase. `WHATSAPP_TEMPLATE_CREATE_ENABLED` deve permanecer desativada. Crie e aprove o template no WhatsApp Manager; depois sincronize. A rota de submissão só deve ser considerada após smoke real, modelo de credenciais por conexão e revisão de permissões/limites da Meta.

## Fora do escopo

- disparo em massa;
- campanha automática;
- bot autônomo;
- spam;
- edição insegura de status;
- envio sem confirmação.
