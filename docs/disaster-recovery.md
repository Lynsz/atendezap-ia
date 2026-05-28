# Plano de Recuperacao - AtendeZap IA

## Cenarios

### Banco indisponivel
Acoes:
- verificar status Supabase
- verificar variaveis da Vercel
- verificar logs da aplicacao
- pausar anuncios, se necessario
- comunicar indisponibilidade, se houver canal
- documentar incidente

### Dados corrompidos
Acoes:
- parar alteracoes relacionadas
- identificar migration ou acao causadora
- verificar backup
- restaurar em ambiente seguro
- validar dados
- aplicar correcao com cautela

### Webhook Stripe falhou
Acoes:
- verificar eventos no painel Stripe
- reenviar evento
- reconciliar assinatura manualmente se necessario
- documentar divergencia

### Deploy quebrou producao
Acoes:
- rollback pela Vercel
- validar smoke test
- abrir incidente
- corrigir em branch separada

### Chave vazada
Acoes:
- revogar chave
- gerar nova
- atualizar Vercel
- atualizar .env.local
- rodar check:secrets
- revisar historico Git
