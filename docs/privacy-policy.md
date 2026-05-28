# Politica de Privacidade - AtendeZap IA

Esta politica explica, em linguagem simples, como o AtendeZap IA coleta e usa dados na operacao do produto.

## Produto
O AtendeZap IA gera sugestoes de respostas para o usuario revisar, copiar, ajustar e enviar manualmente pelo WhatsApp. O produto nao envia mensagens automaticamente pelo WhatsApp e nao conecta diretamente a uma API oficial do WhatsApp nesta fase.

## Dados coletados
- dados de cadastro, como e-mail e id interno
- dados de perfil/onboarding e informacoes do negocio
- perguntas usadas para gerar respostas
- respostas geradas e historico, quando salvos
- respostas salvas pelo usuario
- feedbacks enviados pelo usuario
- leads do ebook e origem UTM
- dados locais de assinatura sincronizados com Stripe
- eventos internos e logs seguros para operacao

## Para que usamos os dados
- criar e proteger a conta
- operar o dashboard
- gerar respostas com IA
- manter historico e respostas salvas
- controlar limite mensal por plano
- processar assinatura e status de pagamento
- enviar e-mails transacionais
- prestar suporte
- acompanhar metricas operacionais e funil sem conteudo sensivel

## Supabase
Usamos Supabase para autenticacao, banco de dados e controle de acesso por RLS. Dados de usuarios devem ser isolados por `user_id`, e dados administrativos devem ser acessados apenas por rotas protegidas.

## Stripe
Usamos Stripe para checkout, assinatura, pagamentos, cancelamento e portal de cobranca. O AtendeZap IA nao armazena numero completo de cartao. Stripe e a fonte de verdade financeira; o Supabase guarda estado local sincronizado.

## OpenAI
Usamos OpenAI para gerar sugestoes de respostas. O backend envia apenas o contexto necessario para gerar a resposta. O usuario deve evitar inserir dados sensiveis desnecessarios nas perguntas e informacoes do negocio.

## Resend
Usamos Resend para envio de e-mails, como entrega de materiais ou comunicacoes transacionais. Logs de envio devem ser consultados no painel do provedor quando necessario.

## Analytics e tracking
Analytics e pixels so devem receber metadados seguros, como evento, origem, plano, categoria, tipo de negocio e UTMs. Nao enviamos e-mail, telefone, mensagem do cliente, resposta completa da IA, tokens, chaves ou dados de pagamento para analytics.

## Exportacao de dados
O usuario pode solicitar exportacao dos proprios dados pela area de privacidade do dashboard ou pelo suporte. No inicio, a exportacao pode ser tratada manualmente, com confirmacao de identidade e envio por canal seguro.

## Exclusao de dados
O usuario pode solicitar exclusao da conta e dados pela area de privacidade do dashboard ou pelo suporte. A exclusao nao e automatica nesta fase para evitar perda indevida de registros de assinatura, suporte ou obrigacoes legais/financeiras. Assinaturas ativas devem ser verificadas antes do processamento.

## Retencao
Mantemos apenas dados necessarios para operar o produto, cumprir obrigacoes basicas, prestar suporte e manter seguranca. Melhorias futuras podem incluir exportacao automatica, exclusao de conta automatizada e anonimizacao de eventos.

## Contato
Use o e-mail de suporte configurado no produto. Se o e-mail definitivo ainda nao estiver definido, use o placeholder operacional: `SUPPORT_EMAIL`.

## Observacao juridica
Este documento e uma base operacional inicial e nao substitui revisao juridica formal.
