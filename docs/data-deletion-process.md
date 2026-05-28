# Processo de Exclusao de Dados - AtendeZap IA

## Quando usar
Quando um usuario solicitar exclusao da conta e dados.

## Antes de excluir
- verificar assinatura ativa
- orientar cancelamento, se necessario
- conferir usuario no Supabase
- conferir dados vinculados
- verificar obrigacoes legais/financeiras
- documentar solicitacao

## Dados a excluir ou anonimizar
- perfil
- historico
- respostas salvas
- feedbacks
- eventos internos
- leads, se aplicavel

## Dados que podem precisar ser mantidos
- registros financeiros minimos
- registros de assinatura na Stripe
- logs necessarios para seguranca, se houver

## Processo inicial
1. Conferir solicitacao em `data_requests`.
2. Confirmar identidade do usuario.
3. Verificar assinatura na Stripe e no Supabase.
4. Definir o que sera excluido, anonimizado ou mantido por obrigacao.
5. Executar exclusao com cuidado em ambiente correto.
6. Registrar conclusao e marcar solicitacao como `completed` ou `rejected`.
