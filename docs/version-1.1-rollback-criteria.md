# Criterios de Rollback - Versao 1.1

## Rollback imediato

* app nao abre
* login/cadastro quebrado
* onboarding quebrado
* dashboard quebrado
* IA indisponivel para multiplos usuarios
* salvar resposta quebrado
* checkout quebrado
* webhook quebrado
* admin acessivel para usuario comum
* vazamento de secret
* vazamento de dados
* erro 500 recorrente em rota critica

## Corrigir sem rollback, se controlado

* texto confuso
* bug visual menor
* feedback quebrado sem afetar IA
* suporte com erro nao critico
* template especifico ruim
* filtro da biblioteca com bug nao critico

## Processo de rollback

1. Abrir Vercel.
2. Ir em Deployments.
3. Selecionar ultimo deploy estavel.
4. Promover deploy anterior.
5. Validar `/api/health`.
6. Rodar smoke test reduzido.
7. Registrar incidente.
8. Corrigir em branch segura.

## Smoke reduzido pos-rollback

* [ ] `/api/health` retorna ok
* [ ] landing abre
* [ ] login abre
* [ ] dashboard bloqueia deslogado
* [ ] usuario autenticado acessa dashboard
* [ ] admin bloqueia usuario comum
* [ ] IA nao retorna erro recorrente
* [ ] checkout nao retorna erro recorrente

