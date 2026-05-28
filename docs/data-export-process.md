# Processo de Exportacao de Dados - AtendeZap IA

## Quando usar
Quando um usuario solicitar copia dos proprios dados.

## Dados possiveis
- perfil
- onboarding
- historico
- respostas salvas
- feedbacks
- assinatura local
- leads vinculados ao e-mail, se aplicavel

## Cuidados
- confirmar identidade do usuario
- exportar apenas dados do proprio usuario
- nao incluir secrets
- nao incluir dados de outros usuarios
- nao enviar por canal inseguro
- documentar conclusao

## Processo inicial
1. Conferir solicitacao em `data_requests`.
2. Confirmar usuario e e-mail no Supabase.
3. Consultar somente tabelas vinculadas ao `user_id` ou ao e-mail confirmado.
4. Remover dados de outros usuarios e qualquer secret.
5. Enviar por canal seguro.
6. Marcar solicitacao como `completed` ou `rejected` com nota interna simples.
