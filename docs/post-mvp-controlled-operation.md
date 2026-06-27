# Operacao Controlada Pos-MVP - AtendeZap IA

## Objetivo

Manter o AtendeZap IA rodando com usuarios reais em volume pequeno, monitorando estabilidade, uso, custo, suporte, feedback e billing antes de qualquer campanha maior.

## Escopo

* operacao com poucos usuarios
* monitoramento diario
* correcao de bugs P0/P1
* analise de uso real
* suporte manual
* acompanhamento de custo OpenAI
* acompanhamento de Stripe
* acompanhamento de feedback da IA

## Fora do escopo

* campanha grande
* escala de trafego
* integracao com WhatsApp
* envio automatico de mensagens
* CRM completo
* app mobile
* automacoes complexas

## Criterios para continuar

* app estavel
* CI verde
* nenhum P0 aberto
* IA funcionando
* suporte controlado
* custos sob controle
* checkout sem erro critico
* admin protegido
* nenhum vazamento de dados

## Criterios para pausar

* cadastro quebrado
* login quebrado
* onboarding quebrado
* dashboard quebrado
* IA falhando para multiplos usuarios
* salvar resposta quebrado
* checkout quebrado
* webhook quebrado
* admin acessivel para usuario comum
* vazamento de dado ou secret
* custo OpenAI fora de controle
* erro 500 recorrente em rota critica

## Status inicial

* Nenhum P0 confirmado nos relatorios finais.
* Operacao controlada depende de smoke autenticado em Preview/Producao, RLS real com dois usuarios e Stripe checkout/webhook em modo teste.
