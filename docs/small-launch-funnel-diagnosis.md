# Diagnostico do Funil - Lancamento Pequeno AtendeZap IA

## Etapas do funil

1. Visitou landing
2. Clicou em cadastro
3. Criou conta
4. Concluiu onboarding
5. Gerou primeira resposta
6. Copiou resposta
7. Salvou resposta
8. Usou template
9. Acessou assinatura
10. Iniciou checkout
11. Concluiu assinatura

## Gargalos encontrados

* Gargalo principal: falta de dados reais no funil.
* Nao ha conversoes registradas para medir abandono entre landing, cadastro, onboarding, primeira resposta, copia, salvamento e checkout.
* Checkout e webhook Stripe ainda dependem de validacao real em modo teste.
* Supabase Auth/RLS, OpenAI e fluxo autenticado completo ainda precisam de smoke real em Preview/Producao.

## Hipoteses

* O principal risco nao e de produto neste momento, mas de ambiente real nao validado.
* Sem dados de usuarios, qualquer mudanca em prompt, templates ou pricing seria especulativa.
* Se usuarios travarem na proxima rodada, os primeiros pontos a observar serao cadastro/login, onboarding e primeira resposta.
* Se usuarios gerarem resposta mas nao copiarem/salvarem, revisar qualidade da resposta, clareza dos botoes e utilidade dos templates.

## Correcoes recomendadas

* Manter campanha bloqueada ate smoke autenticado em Preview/Producao.
* Corrigir imediatamente qualquer P0/P1 encontrado no smoke real.
* Preencher acompanhamento diario com numeros reais, mesmo que pequenos.
* Manter copy de WhatsApp manual em landing, demo, onboarding, dashboard, templates, assinatura, suporte e feedback.
* Nao alterar prompt ou templates sem feedback real recorrente.

## O que medir melhor na proxima rodada

* usuarios alcancados
* visitantes por canal
* cliques em cadastro
* contas criadas
* onboardings concluidos
* primeiras respostas geradas
* respostas copiadas
* respostas salvas
* templates copiados ou salvos
* acessos a assinatura
* checkouts iniciados
* assinaturas concluidas
* feedback util/nao util
* suportes abertos
* erros criticos por rota
* custo real ou estimado da OpenAI

Nao inventar conversoes se nao houver dados.
