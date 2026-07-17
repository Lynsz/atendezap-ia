# Plano da Versão 1.2 — AtendeZap IA

## Status

* Planejamento aprovado.
* Implementação ampla ainda não iniciada.
* Entrada em execução bloqueada até os critérios de intake serem atendidos.

## Objetivo

Melhorar o produto com base nos aprendizados da versão 1.1, operação real e campanha pequena pós-1.1, começando por estabilidade e medição antes de alterar a experiência.

## Problemas que motivam a versão 1.2

* Smoke autenticado de Preview/Production, RLS real, OpenAI e Stripe finais ainda não comprovados.
* Funil de aquisição, ativação e assinatura não medido com usuários da campanha.
* Custo OpenAI, volume de suporte e feedback real não medidos.
* Admin e tracking existem localmente, mas a utilidade dos agregados em operação real não foi validada.
* Gargalos de onboarding, dashboard, IA, templates, biblioteca e pricing permanecem hipóteses, não problemas confirmados.

## Escopo aprovado

* Fechar validações operacionais e de segurança pendentes.
* Garantir medição agregada e segura do funil essencial.
* Diagnosticar gargalos reais antes de ajustar UX ou produto.
* Preparar melhorias pequenas e reversíveis nas áreas de foco somente quando houver evidência.
* Manter CI, build, testes, limites mensais e integrações server-side.

## Fora do escopo

* envio automático para WhatsApp
* integração direta com WhatsApp
* CRM completo
* app mobile
* automações complexas
* campanha grande
* escala de tráfego sem novos dados

## Áreas de foco

### Ativação

* Medir cadastro → onboarding → dashboard → primeira resposta → cópia/salvamento.
* Definir baseline antes de propor meta ou alteração.

### Onboarding

* Manter campos mínimos atuais.
* Revisar labels, mensagens ou etapas somente se abandono ou dúvida forem medidos.

### Dashboard

* Validar se o checklist e os exemplos conduzem à primeira resposta.
* Ajustes de primeiro uso dependem de evidência real.

### IA

* Validar funcionamento, custo e feedback categórico no ambiente final.
* Preservar regras contra informações comerciais inventadas e chamadas apenas server-side.

### Templates

* Medir visualização, uso como base, cópia e salvamento.
* Priorizar nichos apenas depois de observar uso real.

### Biblioteca

* Medir acesso e reutilização de respostas salvas.
* Melhorar busca, filtros ou favoritos apenas se houver problema observado.

### Pricing e assinatura

* Validar página, checkout, portal, webhook e limites no ambiente final.
* Medir visualização → checkout → assinatura; não alterar preço sem evidência.

### Métricas

* Consolidar eventos essenciais, definições, disponibilidade e período.
* Registrar `não medido` quando a fonte não existir ou não estiver validada.

### Admin

* Confirmar proteção para usuário comum autenticado e utilidade dos agregados.
* Não exibir conteúdo completo de perguntas, respostas, suporte ou dados de pagamento.

### Suporte e feedback

* Medir volume, categorias, status e avaliações categóricas.
* Evitar texto sensível em analytics e não inferir recorrência sem dados.

### Segurança

* Validar RLS com dois usuários, secrets server-side, webhook assinado e checkout sem preço/user_id do client.
* Preservar sanitização de eventos, logs seguros, rate limits e limites mensais.

## Critérios de sucesso

* nenhum P0 aberto
* P1 críticos corrigidos ou documentados
* onboarding mais claro, se houver gargalo medido e melhoria validada
* primeira resposta mais fácil, se houver dificuldade medida
* IA mais útil, demonstrada por feedback agregado
* templates mais usados, somente com baseline comparável
* biblioteca mais reutilizável, somente com baseline comparável
* pricing mais claro, demonstrado por dúvidas ou funil medido
* admin com métricas úteis e seguras
* eventos seguros e fontes de dados documentadas
* CI verde
* build passando
* testes passando

Ausência de dados não conta como sucesso. Metas numéricas serão definidas somente após uma baseline real.
