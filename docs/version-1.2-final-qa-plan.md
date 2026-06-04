# Plano de QA Final - Versao 1.2

## Fluxo publico

- landing principal
- paginas por nicho
- demo publica
- ebook
- obrigado
- precos
- suporte
- termos
- privacidade

## Fluxo de autenticacao

- cadastro
- login
- logout
- bloqueio de rotas privadas
- sessao expirada

## Fluxo de onboarding

- concluir onboarding
- alterar contexto, se existir
- validar exemplos por nicho
- validar dashboard apos onboarding

## Fluxo de IA

- gerar primeira resposta
- copiar resposta
- salvar resposta
- favoritar resposta
- atingir limite mensal
- falha da IA com mensagem amigavel
- demo publica com rate limit

## Fluxo de biblioteca/templates

- listar respostas salvas
- criar resposta manual
- editar resposta
- duplicar resposta
- excluir resposta
- copiar resposta
- salvar template
- copiar template
- filtrar favoritos

## Fluxo de billing

- abrir pagina de assinatura
- visualizar plano atual
- visualizar uso mensal
- iniciar checkout teste
- abrir portal Stripe
- processar webhook teste
- pagamento falho
- cancelamento
- feedback de cancelamento

## Fluxo de suporte/privacidade

- criar solicitacao de suporte
- ver solicitacoes proprias
- solicitar exportacao de dados
- solicitar exclusao de dados
- usuario comum nao acessa admin

## Fluxo admin

- relatorios
- campanhas
- suporte
- insights
- assinaturas
- uso da IA
- conversao
- ativacao

## Regras de QA

- Nao usar dados reais de usuarios.
- Nao salvar respostas completas em evidencias.
- Nao chamar Stripe live ou OpenAI real em teste automatizado.
- Registrar apenas resultados agregados e observacoes operacionais.

