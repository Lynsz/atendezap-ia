# Plano de QA Manual - AtendeZap IA

Execute este plano em staging antes de aprovar a Release Candidate para campanha maior. Use usuarios e dados de teste, sem dados reais de clientes.

## Fluxo 1 - Visitante frio

1. acessar landing
2. abrir demo
3. gerar resposta na demo
4. clicar em criar conta
5. criar conta
6. concluir onboarding
7. gerar primeira resposta
8. salvar resposta
9. abrir templates
10. abrir planos

## Fluxo 2 - Lead do ebook

1. acessar `/ebook`
2. preencher e-mail de teste
3. abrir pagina de obrigado
4. clicar em demo
5. clicar em cadastro
6. validar tracking seguro

## Fluxo 3 - Usuario pagante

1. acessar planos
2. iniciar checkout
3. concluir checkout teste
4. processar webhook
5. abrir `/assinatura`
6. conferir plano ativo
7. conferir limite mensal

## Fluxo 4 - Usuario com limite atingido

1. simular limite mensal
2. tentar gerar resposta
3. verificar bloqueio antes da OpenAI
4. verificar mensagem amigavel
5. verificar CTA para planos

## Fluxo 5 - Suporte e privacidade

1. abrir ajuda
2. enviar solicitacao
3. abrir privacidade
4. solicitar exportacao
5. solicitar exclusao
6. validar admin
