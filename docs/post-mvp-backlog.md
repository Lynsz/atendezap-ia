# Backlog Pos-MVP - AtendeZap IA

## P0

* Nenhum P0 confirmado na analise pos-MVP.
* Se surgir vazamento de dados, secret exposto, falha de RLS, checkout/webhook indisponivel, login/cadastro indisponivel ou IA indisponivel para multiplos usuarios, pausar operacao e corrigir antes de qualquer melhoria.

## P1

* Rodar smoke autenticado em Preview/Producao.
* Validar Supabase RLS com dois usuarios reais.
* Validar Stripe Checkout, Customer Portal e webhook assinado no ambiente final.
* Confirmar GitHub Actions verde no GitHub.
* Validar OpenAI e Resend no ambiente final sem expor secrets.
* Preencher metricas reais de ativacao, suporte, billing, feedback e custo OpenAI.
* Manter eventos sem pergunta completa, resposta completa, e-mail, telefone, token, secret ou dado de pagamento.
* Sprint 3: confirmar em ambiente real o fluxo cadastro -> onboarding -> dashboard -> primeira resposta -> copiar/salvar.

## P2

* Sprint 2 entregue: onboarding inicial simplificado e dashboard de usuario novo com checklist.
* Sprint 2 entregue: exemplos por nicho no dashboard sem geracao automatica.
* Melhorar onboarding novamente apenas com gargalos medidos.
* Melhorar templates por nicho novamente apenas com uso real.
* Melhorar qualidade da IA com base em feedback agregado.
* Sprint 2 entregue: admin existente considera agregados de ativacao.
* Melhorar admin e relatorios internos sem criar BI avancado apenas se dados reais exigirem.
* Melhorar FAQ/copy de suporte com base em perguntas recorrentes.
* Melhorar pricing apenas se houver duvida ou queda medida.

## Futuro

* Preparar nova campanha pequena depois de validar ambiente real.
* Planejar experimentos por nicho/canal quando houver tracking confiavel.
* Avaliar relatorios mais detalhados apenas com volume real.
* Planejar versao posterior com base nos resultados da 1.1.

## Nao fazer agora

* integracao direta com WhatsApp
* envio automatico de mensagens
* CRM completo
* automacao complexa
* multiplos atendentes
* campanha grande
* app mobile
* BI avancado
* escala sem dados
