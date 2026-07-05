# Smoke Test — Sprint 2 Versão 1.1

## Status

* aprovado com observações

## Fluxo de ativação

* [x] cadastro
* [x] login
* [x] onboarding
* [x] dashboard de usuário novo
* [x] checklist de primeiros passos
* [x] exemplo por nicho
* [x] primeira resposta
* [x] copiar
* [x] salvar
* [x] biblioteca
* [x] templates

## UX

* [x] loading
* [x] sucesso
* [x] erro
* [x] estados vazios
* [x] mobile básico
* [x] acessibilidade básica

## Bugs encontrados

* Eventos de ativação pedidos na Sprint 2 ainda não estavam todos na allowlist segura.
* Onboarding inicial pedia mais dados do que o necessário para primeira ativação.
* Campo de mensagem do cliente não mostrava contador alinhado ao limite de 1200 caracteres da API.

## Correções aplicadas

* Adicionados eventos seguros `activation_signup_completed`, `activation_onboarding_started`, `activation_onboarding_completed`, `activation_dashboard_viewed`, `activation_first_response_generated`, `activation_first_response_copied`, `activation_first_response_saved` e `activation_templates_viewed`.
* Criada migration `0028_activation_app_events.sql` para permitir os eventos seguros.
* Checklist de primeiros passos extraído para `src/components/dashboard/first-steps-checklist.tsx`.
* Onboarding simplificado para nome, tipo, descrição curta e tom.
* Campo de mensagem do cliente ganhou placeholder, contador, validação visual e bloqueio quando vazio ou acima do limite.
* Admin existente passou a considerar agregados de ativação.

## Pendências

* Smoke autenticado real em Preview/Produção segue pendente conforme documentos anteriores.
* RLS real com dois usuários segue pendente no ambiente final.
* Supabase Auth, OpenAI e Stripe reais dependem de configuração de ambiente.

## Decisão

* Sprint 2 pode seguir para validação local automatizada e smoke real controlado quando o ambiente estiver configurado.
