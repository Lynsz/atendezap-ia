# Release Notes - AtendeZap IA 1.1

## Resumo

A versao 1.1 melhora estabilidade, ativacao, qualidade da IA, templates, biblioteca, billing, suporte, admin e operacao.

## Principais melhorias

* Onboarding inicial mais curto.
* Dashboard com checklist de primeiros passos.
* Exemplos por nicho sem geracao automatica.
* Resposta gerada editavel antes de copiar ou salvar.
* Biblioteca de respostas reforcada.
* Pagina de assinatura mais clara.
* Eventos operacionais mais seguros.

## Correcoes importantes

* Tracking passou a bloquear campos livres sensiveis.
* Templates foram revisados para evitar promessas de preco, prazo, estoque, agenda, garantia ou envio automatico.
* Admin deixou de priorizar comentario livre de feedback da IA.
* Admin overview deixou de exibir texto livre completo de suporte e feedback.

## Seguranca

* Secrets permanecem fora do client.
* `check:secrets` permanece ativo.
* Service role fica restrita ao backend.
* Eventos e logs seguem sanitizados.
* Admin continua protegido por login e `ADMIN_EMAILS`.

## Billing

* Planos Starter, Pro e Premium revisados.
* Plano Pro mantem oferta de primeiro mes por R$ 29 para novos usuarios.
* Checkout usa `planId` e Price ID server-side.
* Portal usa customer buscado no servidor.
* Webhook Stripe valida assinatura e salva apenas resumo seguro.

## IA

* Prompt server-side revisado para respostas curtas e naturais.
* Contexto do negocio e tom escolhido sao usados.
* Prompt evita inventar preco, desconto, estoque, prazo, entrega, endereco, horario, agenda, link, garantia e pagamento.
* Limite mensal e verificado antes da OpenAI.

## Templates e biblioteca

* Templates por nicho revisados.
* Templates recomendados podem ser usados como base editavel.
* Biblioteca mantem criar, listar, buscar, filtrar, editar, copiar, favoritar e excluir.

## Suporte e feedback

* Suporte valida categoria e limita mensagem.
* Feedback da IA aceita util/nao util e motivo negativo.
* Comentario opcional segue limitado e nao entra em analytics.

## Admin e operacao

* Admin mostra metricas e agregados seguros.
* Eventos novos cobrem checkout finalizado/cancelado, portal, admin, aviso de uso OpenAI e webhook Stripe.
* Monitoramento de custo OpenAI foi documentado.

## O que continua fora do escopo

* envio automatico para WhatsApp
* integracao direta com WhatsApp
* CRM completo
* app mobile
* automacoes complexas

## Pendencias conhecidas

* Smoke autenticado em Preview/Producao.
* RLS real com dois usuarios.
* Stripe checkout, portal e webhook assinado no ambiente final.
* Aplicar migrations pendentes no Supabase real.
* Confirmar GitHub Actions verde.
* Consolidar metricas reais de operacao.
