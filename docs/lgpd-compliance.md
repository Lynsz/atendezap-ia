# LGPD - AtendeZap IA

## Objetivo
Documentar praticas basicas de privacidade e protecao de dados.

## Principios
- coletar apenas dados necessarios
- proteger dados por autenticacao/RLS
- nao expor dados entre usuarios
- permitir solicitacao de exclusao
- permitir solicitacao de exportacao
- evitar dados sensiveis
- nao enviar secrets para client
- nao enviar conteudo sensivel para analytics

## Direitos do usuario
- acesso
- correcao
- exclusao
- portabilidade/exportacao
- informacao sobre uso dos dados

## Implementacao inicial
- pagina protegida `/dashboard/privacidade`
- tabela `data_requests` para solicitacoes de exportacao e exclusao
- RLS para usuario ver apenas as proprias solicitacoes
- admin protegido para acompanhar e atualizar status
- processos manuais documentados para exportacao e exclusao

## Pendencias futuras
- fluxo automatico de exclusao de conta
- exportacao completa de dados
- anonimizacao de eventos
- central de privacidade dentro do dashboard
