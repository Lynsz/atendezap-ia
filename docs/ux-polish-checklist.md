# Checklist de polimento UX

Checklist final para revisar o AtendeZap IA antes de campanhas ou producao controlada. Use em staging, no dominio real e em viewport mobile.

## Mobile

- [ ] Landing, paginas de nicho, demo, ebook, precos, cadastro, login, suporte e paginas legais sem overflow horizontal.
- [ ] Dashboard, onboarding, geracao, biblioteca, templates, assinatura, ajuda e privacidade legiveis em 360px de largura.
- [ ] CTAs principais mantem area de toque confortavel e texto sem quebra ruim.
- [ ] Cards e tabelas usam empilhamento, rolagem ou grids responsivos sem cortar conteudo.
- [ ] Header e footer continuam navegaveis em telas pequenas.

## UX

- [ ] Toda tela critica tem estado de carregamento, erro ou vazio claro.
- [ ] Erros para usuario sao amigaveis e nao exibem stack trace, paths internos, payloads ou secrets.
- [ ] Biblioteca vazia orienta o proximo passo: gerar resposta, salvar template ou criar resposta manual.
- [ ] Demo deixa claro que a IA sugere, o usuario revisa e envia manualmente pelo WhatsApp.
- [ ] Paginas privadas bloqueiam usuario anonimo sem mostrar metricas ou dados internos.
- [ ] Textos de CTA sao diretos: testar demo, criar conta, ver planos, baixar guia.

## Acessibilidade

- [ ] Apenas um `h1` principal por pagina.
- [ ] Formularios tem labels visiveis e mensagens de erro proximas do campo ou acao.
- [ ] Estados dinamicos relevantes usam `role="status"` ou `role="alert"` quando aplicavel.
- [ ] Botoes somente com icone devem ter `aria-label`.
- [ ] Links e botoes sao acessiveis por teclado e possuem foco visivel.
- [ ] Contraste de textos principais e botoes permanece legivel em mobile.

## SEO

- [ ] Paginas publicas principais tem title, description, canonical e Open Graph quando aplicavel.
- [ ] Paginas de nicho usam metadata dinamica a partir de `src/config/niches.ts`.
- [ ] `sitemap.xml` lista apenas rotas publicas indexaveis.
- [ ] `robots.txt` bloqueia `/admin`, `/dashboard`, `/assinatura`, `/api` e aliases privados.
- [ ] Paginas privadas ou pos-conversao sensiveis usam `robots: noindex` quando apropriado.
- [ ] Copy publica evita promessa de WhatsApp automatico ou CRM avancado.

## Seguranca

- [ ] Nenhum segredo aparece em HTML, bundle client, logs, metadata publica, sitemap ou robots.
- [ ] APIs privadas continuam exigindo sessao ou admin.
- [ ] Mensagens de erro publicas nao retornam detalhes internos.
- [ ] Tracking nao envia perguntas completas, respostas completas, e-mail, telefone, tokens ou payloads sensiveis.
- [ ] `.env.local` continua fora do Git.
