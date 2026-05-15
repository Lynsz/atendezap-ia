# Checklist de Teste Manual

Use este roteiro antes de publicar ou após mudanças relevantes.

1. Testar landing page `/`.
2. Testar página de preços `/precos`.
3. Confirmar que os botões abrem os checkouts mensais corretos: Básico em `https://pay.kiwify.com.br/SoDyO2k`, Starter em `https://pay.kiwify.com.br/KfYbZzC` e Premium em `https://pay.kiwify.com.br/n6jZUdh`.
4. Confirmar que os preços aparecem como `R$29,00/mês`, `R$49,00/mês` e `R$79,00/mês`.
5. Testar webhook mock local.
6. Verificar `customer` no Supabase.
7. Verificar `order` no Supabase.
8. Verificar token gerado em `orders.access_token`.
9. Verificar evento `webhook_received`.
10. Verificar evento `order_approved`.
11. Verificar e-mail de acesso no Resend ou evento `access_email_failed`.
12. Abrir `/gerar/[token]`.
13. Preencher formulário com dados reais de teste.
14. Gerar kit.
15. Ver kit salvo no Supabase.
16. Verificar evento `kit_generation_succeeded`.
17. Abrir `/kit/[kitId]`.
18. Baixar PDF.
19. Verificar evento `pdf_downloaded`.
20. Tentar usar o mesmo token novamente.
21. Confirmar redirecionamento para o kit ou bloqueio de segunda geração.
22. Testar formulário de suporte.
23. Verificar `support_requests`.
24. Verificar evento `support_request_created`.
25. Rodar `npm run lint`.
26. Rodar `npm run typecheck`.
27. Rodar `npm run build`.
28. Fazer deploy na Vercel.
29. Repetir teste de webhook em produção.
30. Conferir logs da Vercel.
31. Conferir logs do Resend.
