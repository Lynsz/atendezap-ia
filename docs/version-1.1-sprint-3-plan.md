# Sprint 3 - IA, Templates e Biblioteca

## Objetivo

Melhorar a qualidade das respostas geradas e facilitar a reutilizacao de respostas e templates.

## Escopo

* prompt da IA
* contexto por nicho
* regras contra informacoes inventadas
* tamanho e estilo das respostas
* templates por nicho
* biblioteca de respostas
* edicao, copia e favoritos
* feedback de qualidade
* testes

## Fora do escopo

* envio automatico para WhatsApp
* integracao com WhatsApp
* CRM
* automacoes complexas
* app mobile
* redesign completo
* treinamento de modelo proprio

## Criterios de sucesso

* respostas curtas e naturais
* IA nao inventa informacoes comerciais
* contexto do negocio e utilizado
* templates sao uteis
* biblioteca funciona sem erros
* usuario consegue copiar, editar, salvar e favoritar
* feedback funciona
* testes e build passam

## Evidencia de entrada

* Documentos da 1.1 indicam metricas reais ainda insuficientes.
* `docs/version-1.1-sprint-1-report.md` nao foi encontrado no workspace durante a leitura.
* Relatorio da Sprint 2 moveu smoke real, RLS real e metricas reais para a etapa seguinte.
* Relatorio de uso OpenAI ja confirmava rota autenticada, prompt server-side, limite mensal antes da chamada, incremento apenas apos sucesso e logs/eventos sem conteudo sensivel.
* Analise pos-MVP registrava risco de resposta ruim ou incompleta, mas sem volume real de feedback para ranquear motivos.

## Decisoes

* Melhorar prompt e templates com regras conservadoras, sem depender de metricas inexistentes.
* Coletar feedback negativo por motivo categorizado para orientar ajustes futuros.
* Mostrar no admin apenas agregados seguros de qualidade, sem pergunta completa, resposta completa ou comentario livre.
* Manter biblioteca simples: busca, filtros, edicao, copia, favoritos e exclusao nos fluxos existentes.

## Pendencias esperadas

* Smoke autenticado em Preview/Producao.
* Validacao RLS real com dois usuarios.
* Consolidacao de metricas reais de qualidade por nicho, plano e template.
