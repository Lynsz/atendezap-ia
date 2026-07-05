# Relatório da Sprint 2 — Versão 1.1 AtendeZap IA

## Status

* concluída com observações

## Objetivo

Melhorar ativação, onboarding e primeira experiência.

## Melhorias no cadastro/login

* `/cadastro` recebeu placeholders úteis, feedback com `role` sem erro bruto e evento seguro de ativação.
* `/login` mantém formulário simples, loading, erro amigável e também registra cadastro feito pelo modo alternativo.

## Melhorias no onboarding

* Onboarding inicial ficou mais curto: nome do negócio, tipo, descrição curta e tom.
* Salvamento continua usando usuário da sessão e `upsert` em `user_profiles` por `user_id`.
* Cliente não define `user_id` como autoridade fora da sessão.

## Melhorias no dashboard

* Checklist de primeiros passos virou componente dedicado.
* Estado de usuário novo destaca começar por aqui sem bloquear o uso.
* Campo da mensagem do cliente recebeu placeholder, contador e limite alinhado à API.

## Primeiros passos

* Itens mantidos com dados reais ou sinais já existentes: onboarding, primeira resposta, cópia, salvamento, templates, biblioteca e planos.

## Exemplos por nicho

* Exemplos rápidos usam `business_type` e apenas preenchem o campo para revisão do usuário.
* Nenhum exemplo gera resposta automaticamente.

## Estados de UX

* Loading de dashboard, geração e salvamento preservado.
* Biblioteca vazia e favoritos vazios têm mensagens úteis.
* Erros seguem amigáveis e sem stack trace, SQL ou payload bruto.

## Mobile

* Layouts principais mantêm grids responsivos e botões em fluxo vertical quando necessário.
* Não foi feito redesign completo.

## Acessibilidade

* Inputs principais têm labels.
* Mensagens de cadastro usam `role="alert"` e `role="status"`.
* Campo de mensagem do cliente usa `aria-describedby` para ajuda e contador.

## Tracking

* Eventos adicionados: `activation_signup_completed`, `activation_onboarding_started`, `activation_onboarding_completed`, `activation_dashboard_viewed`, `activation_first_response_generated`, `activation_first_response_copied`, `activation_first_response_saved` e `activation_templates_viewed`.
* Metadata segue sanitizada e não inclui pergunta completa, resposta completa, e-mail, telefone, tokens, secrets ou dados de pagamento.
* Falha de tracking continua sem quebrar o fluxo principal.

## Testes

* Testes de tracking e dashboard foram atualizados para os eventos novos, checklist e limite do campo.
* Validações finais devem ser usadas como evidência corrente desta sprint.

## Pendências

* Validar ambiente real com Supabase Auth, OpenAI, Stripe e RLS com dois usuários.
* Confirmar smoke autenticado em Preview/Produção.
* Coletar métricas reais antes de decidir novas mudanças de produto.

## Próximo passo recomendado

* Rodar smoke real controlado do fluxo cadastro -> onboarding -> dashboard -> primeira resposta -> copiar/salvar com dois usuários e registrar resultados agregados.
