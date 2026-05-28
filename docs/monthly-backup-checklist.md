# Checklist Mensal de Backup - AtendeZap IA

## Supabase
- verificar se backups estao ativos
- verificar retencao
- confirmar plano atual
- revisar migrations recentes
- revisar tabelas criticas
- testar exportacao segura, se necessario
- nunca salvar dump no Git

## Stripe
- revisar assinaturas
- revisar pagamentos falhos
- revisar webhooks
- revisar divergencias com Supabase

## Vercel
- revisar variaveis
- revisar deploys recentes
- revisar logs criticos

## Seguranca
- rodar npm run check:secrets
- revisar permissoes do GitHub
- revisar permissoes da Vercel
- revisar chaves antigas
- rotacionar chaves se necessario
