# Biblioteca e Templates Funcionais - AtendeZap IA

## Status
- funcional

## Fluxos implementados/corrigidos
- Salvar resposta gerada com IA na biblioteca.
- Copiar, editar, excluir, favoritar e desfavoritar respostas salvas.
- Reutilizar templates prontos por nicho.

## Biblioteca
- Lista respostas reais de `saved_responses`.
- Filtra por busca, categoria, origem e favoritos.
- Usa operacoes autenticadas e nunca aceita `user_id` do client.

## Templates
- Catalogo em `src/lib/templates/whatsapp-templates.ts`.
- Nichos: delivery, estetica, restaurante, loja, assistencia_tecnica, prestador_servico, autonomo e geral.
- Templates podem ser copiados ou salvos na biblioteca com `source = "template"`.

## Favoritos
- Biblioteca permite favoritar/desfavoritar.
- Dashboard mostra ate 3 respostas favoritas.

## Seguranca/RLS
- RLS ativo em `saved_responses`.
- Politicas limitam select, insert, update e delete ao usuario autenticado.
- Migration `0023_saved_responses_library_flexibility.sql` flexibiliza categoria e aceita `source = "ai"`.

## Como testar
- Gerar uma resposta no dashboard e clicar em `Salvar resposta`.
- Abrir `Biblioteca`, editar, copiar, favoritar e excluir a resposta.
- Abrir `Templates`, filtrar por nicho/categoria, copiar e salvar um template.
- Rodar `npm run lint`, `npm run typecheck`, `npm run build` e `npm run test`.

## Pendencias
- Validar manualmente em um ambiente com Supabase configurado e migrations aplicadas.
