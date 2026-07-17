# Análise de Estabilidade — Versão 1.1

## Status

* **atenção**: estabilidade local coberta por build e testes documentados; estabilidade de Preview/Production não comprovada
* estável: somente no escopo local automatizado descrito nos relatórios existentes
* instável: não confirmado
* bloqueado: aprovação pós-deploy bloqueada por ausência do smoke real e das métricas de 72 horas

## Rotas públicas

* Landing, cadastro, login, demo, termos, privacidade e suporte constam como aprovados no build/local.
* `/api/health` retorna somente `status` e nome do app por implementação e teste local.
* Disponibilidade, latência e erros em Preview/Production: não medidos.

## Rotas autenticadas

* Cadastro, login, onboarding, dashboard, biblioteca, templates, assinatura, suporte e feedback possuem cobertura local documentada.
* Checkout em ambiente final e isolamento entre dois usuários reais permanecem sem validação registrada.

## APIs críticas

* IA, respostas salvas, Stripe, suporte, feedback e admin têm testes locais citados nos relatórios finais.
* Taxa de erro, recorrência de 500 e disponibilidade no deploy real: não disponíveis.

## Supabase/RLS

* RLS permanece habilitado nas migrations críticas e os testes estáticos validam isolamento por `auth.uid()`.
* Service role permanece no backend.
* Aplicação das migrations e isolamento com dois usuários no Supabase real não foram confirmados.
* `supabase/schema.sql` está documentado como atrasado em relação às migrations incrementais.

## OpenAI

* Chamada permanece server-side, autenticada, posterior à validação do limite e do onboarding.
* Falha não incrementa uso; sucesso incrementa após salvar a resposta.
* Disponibilidade, falhas e custo no ambiente real: não disponíveis.

## Stripe

* Checkout usa plano validado e Price ID server-side; portal usa customer associado ao usuário autenticado.
* Webhook exige assinatura e salva resumo seguro do evento.
* Checkout, portal e webhook assinado no ambiente final não foram comprovados.

## Admin

* Página e APIs usam autenticação e allowlist `ADMIN_EMAILS`; teste local bloqueia usuário comum.
* Tentativas reais e validação manual em Production: não medidas.

## Suporte/feedback

* Rotas e validações possuem cobertura local e mensagens amigáveis.
* Volume, falhas e dúvidas recorrentes nas 72 horas: não disponíveis.

## Erros recorrentes

* Nenhum erro recorrente confirmado.
* Logs de Runtime, Supabase, Stripe e OpenAI do período não foram disponibilizados; portanto, ausência de registro não comprova ausência de erro.

## Riscos técnicos

* Divergência entre ambiente local e variáveis/migrations reais.
* RLS real não validado com dois usuários.
* Checkout e webhook podem falhar por configuração externa ainda não comprovada.
* Falta de métricas pode ocultar erros, gargalos e custo anormal.
* Snapshot `supabase/schema.sql` desatualizado pode induzir setup incorreto se usado no lugar das migrations.

## Correções recomendadas

* Nenhuma correção de código P0/P1 é sustentada pelas evidências atuais.
* Repetir a validação controlada em Preview e Production, preencher os smoke tests e registrar a janela real de 72 horas.
* Aplicar e conferir migrations, validar RLS com dois usuários e reconciliar o snapshot do schema depois que o banco real estiver alinhado.
* Confirmar Stripe, OpenAI, suporte, feedback, admin, logs e CI remoto antes de nova divulgação.
