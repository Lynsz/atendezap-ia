# Checklist Pre-anuncio Final - AtendeZap IA

Use este checklist antes de liberar qualquer campanha com orcamento baixo. Se algum item critico falhar, pause anuncios e corrija antes de continuar.

## Produto

- [ ] cadastro funcionando
- [ ] login funcionando
- [ ] logout funcionando
- [ ] dashboard acessivel para usuario autenticado
- [ ] dashboard bloqueado para usuario sem login
- [ ] onboarding funcionando
- [ ] onboarding salvando no Supabase
- [ ] geracao funcionando
- [ ] historico funcionando
- [ ] limite mensal funcionando
- [ ] mensagem de limite mensal clara
- [ ] feedback visivel no dashboard

## Funil

- [ ] landing clara para trafego frio
- [ ] pagina de campanha revisada, se usada
- [ ] ebook salvando lead
- [ ] UTMs salvando no lead
- [ ] obrigado com CTA para guia, demo e cadastro
- [ ] guia abrindo sem login
- [ ] demo funcionando
- [ ] demo com CTA para cadastro
- [ ] demo sem promessa de envio automatico no WhatsApp
- [ ] pricing claro
- [ ] Pro comunica primeiro mes por R$ 29 para novos usuarios
- [ ] checkout funcionando a partir de `/precos`
- [ ] checkout funcionando a partir de `/assinatura`

## Pagamento

- [ ] Stripe checkout testado
- [ ] price IDs corretos por ambiente
- [ ] cupom Pro aplicado somente no Pro
- [ ] webhook testado
- [ ] plano ativo aparece em `/assinatura`
- [ ] dashboard reflete plano ativo
- [ ] portal testado
- [ ] cancelamento testado
- [ ] pagamento falho testado
- [ ] erro de Stripe aparece de forma amigavel

## Tracking

- [ ] UTMs persistem entre paginas
- [ ] GA4 testado no dominio final, se configurado
- [ ] Meta Pixel testado no dominio final, se configurado
- [ ] `landing_view` testado
- [ ] `ebook_view` testado
- [ ] `lead_success` testado
- [ ] `demo_view` testado
- [ ] `demo_response_success` testado
- [ ] `signup_completed` testado
- [ ] `onboarding_completed` testado
- [ ] `first_response_generated` testado
- [ ] `checkout_started` testado
- [ ] `feedback_submit` testado

## Operacao

- [ ] admin funcionando
- [ ] usuario comum bloqueado no admin
- [ ] leads aparecendo no admin
- [ ] feedbacks aparecendo no admin
- [ ] assinaturas aparecendo no admin
- [ ] metricas carregando
- [ ] relatorio de campanha carregando
- [ ] exportacao CSV funcionando, se usada
- [ ] suporte pronto
- [ ] monitoramento pronto
- [ ] rollback documentado
- [ ] logs da Vercel monitorados durante o teste
- [ ] Supabase, Stripe, Resend e OpenAI monitorados durante o teste

## Decisao

- [ ] nenhum P0 aberto
- [ ] nenhum P1 aberto sem plano de correcao
- [ ] pelo menos 3 usuarios reais conseguiram criar conta
- [ ] pelo menos 3 usuarios reais concluiram onboarding
- [ ] pelo menos 3 usuarios reais geraram primeira resposta
- [ ] pelo menos 1 usuario demonstrou intencao real de uso ou pagamento
- [ ] dados de tracking e admin sao suficientes para acompanhar a campanha

Resultado:

- [ ] Liberar anuncio pequeno
- [ ] Rodar nova rodada com usuarios
- [ ] Pausar e corrigir bloqueadores
