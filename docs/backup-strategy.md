# Estrategia de Backup - AtendeZap IA

## Objetivo
Proteger dados importantes do produto e permitir recuperacao em caso de falha.

## Dados criticos
- usuarios
- perfis/onboarding
- assinaturas
- limites de uso
- historico de respostas
- respostas salvas
- leads
- feedbacks
- eventos internos
- configuracoes administrativas

## Dados que nao devem ir para o Git
- dumps do banco
- dados reais de usuarios
- arquivos .env
- secrets
- logs com dados sensiveis

## Supabase
- usar backups automaticos do Supabase quando disponiveis
- revisar plano atual
- validar retencao de backup
- documentar frequencia de backup
- testar restauracao em ambiente seguro antes de depender em producao

## Stripe
- Stripe e fonte de verdade para pagamentos
- Supabase armazena estado sincronizado
- em caso de divergencia, usar eventos Stripe e painel Stripe para reconciliacao

## Resend
- logs de envio devem ser consultados no painel
- nao salvar conteudo sensivel desnecessario

## OpenAI
- nao salvar prompts sensiveis em logs
- nao salvar resposta completa em eventos internos globais
