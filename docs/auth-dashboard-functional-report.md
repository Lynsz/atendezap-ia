# Auth, Onboarding e Dashboard Funcional — AtendeZap IA

## Status
- funcional

## Fluxos corrigidos
- Login e cadastro redirecionam conforme `user_profiles`.
- Dashboard redireciona usuário sem onboarding para `/onboarding`.
- `/onboarding` redireciona usuário já configurado para `/dashboard`.
- Geração de IA recebe payload mínimo e busca contexto no servidor.
- `/biblioteca` foi adicionada como alias protegido da biblioteca.
- Logout encerra sessão e volta para `/`.

## Fluxos funcionando
- Cadastro/login com Supabase Auth.
- Onboarding salva `businesses` e `user_profiles`.
- Dashboard gera resposta, copia, salva e lista biblioteca.
- Templates locais podem ser copiados e salvos.
- Assinatura carrega estado real e não quebra sem Stripe local.

## Fluxos pendentes
- Validar manualmente em staging com Supabase, OpenAI e Stripe reais.

## Como testar manualmente
- Criar conta em `/cadastro`.
- Preencher onboarding em `/onboarding`.
- Gerar resposta em `/dashboard`.
- Copiar e salvar a resposta.
- Abrir `/dashboard/biblioteca` ou `/biblioteca`.
- Abrir `/assinatura`.

## Variáveis necessárias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `STRIPE_SECRET_KEY` e prices Stripe para checkout real.

## Próximo passo recomendado
- Fazer smoke test autenticado em staging com um usuário novo.
