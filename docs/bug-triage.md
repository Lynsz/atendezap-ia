# Triagem rapida de bugs

Use esta classificacao durante a producao controlada. O objetivo e decidir rapido o que corrigir antes de liberar mais usuarios.

## P0 - Critico

- Impede cadastro.
- Impede login.
- Impede pagamento.
- Impede geracao de resposta.
- Expoe dados.
- Quebra dashboard.

Acao: pausar novos convites e trafego pago, corrigir imediatamente, rodar validacoes e testar manualmente no ambiente real.

## P1 - Alto

- Confunde assinatura.
- Erro no onboarding.
- Erro no envio de lead.
- Webhook falhando.
- Admin nao carrega.

Acao: corrigir antes de convidar mais usuarios. Se houver workaround simples, comunicar no suporte e registrar.

## P2 - Medio

- Copy confusa.
- Layout ruim no mobile.
- Erro visual.
- Feedback de usabilidade.

Acao: agrupar por tema e corrigir em pequenos lotes sem mexer em fluxo critico.

## P3 - Baixo

- Melhorias futuras.
- Ajustes esteticos.
- Recursos novos.

Acao: registrar para backlog. Nao implementar durante a validacao dos primeiros usuarios sem pedido explicito.

## Processo recomendado

1. Revisar feedbacks novos no admin uma vez por dia.
2. Marcar como `reviewing` quando for analisar.
3. Classificar P0/P1/P2/P3.
4. Corrigir P0 imediatamente.
5. Corrigir P1 antes de novos convites.
6. Marcar como `resolved` depois de validar em staging/producao controlada.
