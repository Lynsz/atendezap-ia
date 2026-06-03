# E-mails de Ativação — AtendeZap IA

## Objetivo
Ajudar o usuário novo a gerar valor rápido.

## E-mail 1 — Boas-vindas
- quando enviar: após cadastro confirmado, se houver consentimento e estrutura operacional validada
- objetivo: orientar o usuário a acessar o dashboard e configurar o atendimento
- CTA: acessar dashboard

## E-mail 2 — Primeira resposta
- quando enviar: se o usuário criou conta, mas ainda não gerou a primeira resposta após janela segura definida
- objetivo: levar o usuário a colar uma pergunta comum e gerar a primeira resposta
- CTA: gerar primeira resposta

## E-mail 3 — Templates prontos
- quando enviar: se o usuário ainda não salvou resposta/template ou precisa de atalho para começar
- objetivo: apresentar templates prontos como caminho rápido para copiar, ajustar e salvar mensagens
- CTA: ver templates prontos

## Regras de privacidade
- não incluir conteúdo de respostas do usuário
- não expor dados sensíveis
- respeitar solicitações de exclusão
- não incluir senha, token, chaves ou dados de pagamento
- não enviar conteúdo completo de pergunta, resposta ou prompt

## Sprint 2 da versao 1.2

Status atual: templates prontos e documentados, sem envio automatico novo.

## Conteudo revisado

- Boas-vindas: levar o usuario ao dashboard e reforcar que a resposta e copiada, ajustada e enviada manualmente.
- Primeira resposta: incentivar o usuario a testar uma pergunta comum como "Qual o valor?".
- Templates prontos: apresentar templates como atalho para copiar, ajustar e salvar mensagens.

## Pendencia operacional

Antes de ativar envio automatico, definir:

- consentimento e base operacional de envio
- janela segura para cada e-mail
- criterio para nao enviar se o usuario ja concluiu a etapa
- monitoramento de falha do Resend sem quebrar fluxo principal
