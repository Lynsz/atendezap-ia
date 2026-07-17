# Kickoff da Versão 1.2 — AtendeZap IA

## Status

* planejada: sim
* aprovada para iniciar: não
* **bloqueada: sim**

## Motivo da versão

* Transformar a ausência de medição confiável em um plano de estabilidade, instrumentação e decisão baseada em evidência.
* Preparar melhorias pequenas de produto somente depois de identificar gargalos reais.

## Evidências usadas

* Relatórios finais da versão 1.1 e das 72 horas.
* Análises de produto, billing/custo e campanha pós-1.1.
* Testes e auditorias locais documentados.

## Principais problemas vindos da 1.1

* Validações de Production, RLS, OpenAI e Stripe pendentes.
* Funil, suporte, feedback e custo não medidos em janela real.
* Nenhum P0/P1/P2 confirmado; não há correção de produto comprovadamente necessária.

## Principais aprendizados da campanha

* A campanha foi bloqueada antes da divulgação.
* Nenhum canal, UTM ou resultado real ficou disponível.
* Tracking local não substitui persistência e análise do ambiente final.
* Ausência de dados não pode aprovar produto, canal ou versão.

## Escopo aprovado

* Planejamento detalhado da 1.2.
* Sprint 1 de estabilidade, segurança e medição após atender a autorização operacional.
* Sprints de produto condicionadas aos achados da Sprint 1.

## Fora do escopo

* WhatsApp automático ou integração direta
* CRM completo
* app mobile
* automações complexas
* campanha grande ou escala de orçamento

## Riscos

* Iniciar implementação de produto antes de resolver os bloqueadores.
* Confundir hipóteses com feedback real.
* Criar métricas duplicadas ou armazenar metadados sensíveis.
* Aumentar custo ou suporte sem observabilidade suficiente.

## Próximo passo recomendado

* Fechar os critérios de intake.
* Executar a Sprint 1 somente após CI remoto, Production, RLS, OpenAI, Stripe e custo estarem verificáveis.
* Repriorizar Sprints 2 a 4 usando a baseline coletada.
