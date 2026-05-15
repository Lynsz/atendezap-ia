# Checklist de Teste Manual

Use este roteiro antes de publicar ou após mudanças relevantes.

1. Testar landing page `/`.
2. Testar página de preços `/precos`.
3. Confirmar que os botões abrem os checkouts corretos: Básico em `https://pay.kiwify.com.br/TzuyT33`, Starter em `https://pay.kiwify.com.br/YKQD0lL` e Premium em `https://pay.kiwify.com.br/kpokbPx`.
4. Testar webhook mock local.
5. Verificar `customer` no Supabase.
6. Verificar `order` no Supabase.
7. Verificar token gerado em `orders.access_token`.
8. Verificar evento `webhook_received`.
9. Verificar evento `order_approved`.
10. Verificar e-mail de acesso no Resend ou evento `access_email_failed`.
11. Abrir `/gerar/[token]`.
12. Preencher formulário com dados reais de teste.
13. Gerar kit.
14. Ver kit salvo no Supabase.
15. Verificar evento `kit_generation_succeeded`.
16. Abrir `/kit/[kitId]`.
17. Baixar PDF.
18. Verificar evento `pdf_downloaded`.
19. Tentar usar o mesmo token novamente.
20. Confirmar redirecionamento para o kit ou bloqueio de segunda geração.
21. Testar formulário de suporte.
22. Verificar `support_requests`.
23. Verificar evento `support_request_created`.
24. Rodar `npm run lint`.
25. Rodar `npm run typecheck`.
26. Rodar `npm run build`.
27. Fazer deploy na Vercel.
28. Repetir teste de webhook em produção.
29. Conferir logs da Vercel.
30. Conferir logs do Resend.
