# Relatório — Integração WhatsApp Fase 1

## Status

Concluída com observações operacionais.

## Webhook

GET de challenge e POST de inbound implementados. A assinatura SHA-256 é obrigatória quando o App Secret existe. O payload bruto não é persistido nem logado.

## Inbound

O backend localiza a conexão pelo Phone Number ID/WABA, atualiza contato e conversa, renova a janela por 24 horas, deduplica pelo message ID e marca mídia como não suportada sem download.

## Sugestão de IA

É gerada somente por ação do usuário, usa no máximo 12 mensagens recentes e o contexto do negócio, respeita o limite mensal e é salva como rascunho. Não envia ao WhatsApp.

## Envio aprovado manualmente

A rota exige sessão, propriedade, `confirmSend: true`, texto válido, chave de idempotência, conexão ativa e chamada server-side à API oficial. O token não entra na resposta.

## Janela de 24h

Envio livre é bloqueado fora da janela e a mensagem orienta o uso futuro de template aprovado. Opt-out também bloqueia.

## Segurança

Secrets permanecem no servidor, o scanner cobre envs/tokens Meta, logs e eventos excluem conteúdo, e o admin usa somente agregados.

## RLS

As cinco tabelas têm RLS e policies de leitura por `auth.uid()`. `authenticated` não recebe INSERT, UPDATE ou DELETE; escritas críticas passam por rotas validadas com service role.

## Testes

Foram adicionados testes de parser, assinatura, challenge, inbound sem autoenvio, autenticação/isolamento, confirmação, janela, opt-out, helper server-side, scanner e contrato RLS. Em 17/07/2026, `npm run validate` passou com 69 arquivos e 304 testes; lint, typecheck e build de produção também passaram. O build gerou 73 páginas/rotas de página.

## Pendências

- aplicar a migration em cada ambiente;
- configurar credenciais reais somente na Vercel;
- validar webhook, inbound, envio e isolamento RLS com contas de teste reais;
- decidir retenção/eliminação de conteúdo conforme a política de privacidade;
- acompanhar erros e opt-outs antes de ampliar o rollout.

## Próxima fase recomendada

Somente após o smoke test real: templates aprovados para mensagens fora da janela, com seleção manual e sem campanhas em massa.
