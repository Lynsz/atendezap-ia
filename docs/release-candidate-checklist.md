# Checklist da Release Candidate - AtendeZap IA

## Seguranca

- [ ] repositorio privado
- [ ] `.env.local` fora do Git
- [ ] `check:secrets` passando
- [ ] service role apenas server-side
- [ ] OpenAI key apenas server-side
- [ ] Stripe secret apenas server-side
- [ ] Resend key apenas server-side
- [ ] logs sem dados sensiveis
- [ ] analytics sem conteudo de respostas

## Produto

- [ ] landing carrega
- [ ] paginas por nicho carregam
- [ ] demo funciona
- [ ] ebook funciona
- [ ] cadastro funciona
- [ ] login funciona
- [ ] onboarding funciona
- [ ] dashboard funciona
- [ ] geracao de resposta funciona
- [ ] salvar resposta funciona
- [ ] templates funcionam
- [ ] assinatura funciona
- [ ] suporte funciona
- [ ] privacidade funciona

## Billing

- [ ] checkout abre
- [ ] portal Stripe abre
- [ ] webhook processa eventos
- [ ] status da assinatura atualiza
- [ ] limite por plano funciona
- [ ] pagamento falho tem mensagem clara
- [ ] cancelamento tem feedback opcional

## Operacao

- [ ] admin protegido
- [ ] relatorios carregam
- [ ] campanhas internas carregam
- [ ] suporte interno carrega
- [ ] insights/backlog carregam
- [ ] health check responde
- [ ] rollback documentado

## Campanhas

- [ ] paginas por nicho prontas
- [ ] UTMs documentadas
- [ ] copys documentadas
- [ ] tracking funcionando
- [ ] criterios de pausa definidos
- [ ] criterios de escala definidos
