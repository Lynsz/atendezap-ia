# Checklist de Pausa - Campanha Pos-1.2

## Pausar imediatamente se:

- checkout falhar
- webhook falhar
- IA falhar para multiplos usuarios
- login/cadastro falhar
- pagina de destino cair
- tracking principal quebrar
- suporte receber bug critico
- custo da IA subir de forma anormal
- dados de usuarios forem expostos
- admin ficar acessivel para usuario comum

## Depois de pausar

- [ ] registrar incidente
- [ ] registrar campanha como `paused`
- [ ] revisar logs seguros
- [ ] corrigir causa
- [ ] validar em staging
- [ ] rodar smoke test
- [ ] preencher `docs/post-1.2-campaign-live-tracking.md`
- [ ] so reativar apos validacao e nova aprovacao operacional

