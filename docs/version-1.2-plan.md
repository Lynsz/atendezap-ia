# Plano da Versao 1.2 - AtendeZap IA

## Objetivo

Melhorar crescimento controlado, retencao, conversao e operacao com base nos aprendizados da versao 1.1.

## Foco da versao 1.2

- melhorar ativacao
- melhorar retencao
- melhorar conversao para plano pago
- melhorar qualidade das respostas
- melhorar templates
- melhorar campanhas por nicho
- melhorar suporte
- melhorar relatorios internos
- melhorar billing
- reduzir custo da IA
- melhorar UX mobile

## Fora do escopo da versao 1.2

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
- BI avancado
- marketplace de templates

## P0 - Critico

- Corrigir imediatamente qualquer falha de login/cadastro, admin indevido, vazamento de dados, checkout/webhook quebrado, IA indisponivel para multiplos usuarios ou tracking sensivel.

## P1 - Alta prioridade

- Validar Stripe Checkout, Customer Portal, webhook e status de assinatura em staging/producao.
- Validar Supabase RLS com dois usuarios reais.
- Validar OpenAI, Resend, tracking, admin e health check no ambiente final.
- Medir gargalo entre cadastro, onboarding, primeira resposta, copia/salvamento, checkout e assinatura.
- Reduzir suporte recorrente sobre WhatsApp automatico, onboarding, pricing e billing com copy/FAQ simples.

## P2 - Media prioridade

- Melhorar exemplos por nicho se houver queda ate primeira resposta.
- Melhorar CTA pos-demo se houver uso da demo sem cadastro ou checkout.
- Melhorar pricing se houver primeira resposta positiva sem checkout.
- Melhorar templates recomendados se houver baixa ativacao inicial.
- Melhorar mobile de paginas publicas e dashboard se smoke real indicar problema.
- Registrar custo OpenAI agregado se houver volume suficiente.

## P3 - Futuro

- Alertas automaticos apenas se o volume operacional justificar.
- Novos nichos ou criativos depois de dados agregados suficientes.
- Planos anuais depois de conversao mensal validada.
- Metricas internas de custo por resposta se tokens/modelo passarem a ser persistidos.

