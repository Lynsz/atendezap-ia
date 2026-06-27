# Priorizacao da Versao 1.1 - AtendeZap IA

## Decisao

- status: planejada
- tipo: consolidacao operacional
- regra: nenhuma melhoria deve depender de dados inventados; onde nao houver dado real, registrar `nao disponivel` ou `nao medido`.

## P0

- Nenhum P0 confirmado na analise pos-MVP.

Se surgir P0, a 1.1 deve pausar qualquer melhoria e corrigir imediatamente:

- login/cadastro indisponivel
- vazamento de dados ou acesso indevido
- checkout/webhook quebrado para todos
- IA indisponivel para multiplos usuarios
- secrets expostos

## P1

1. Validar ambiente real
   - smoke autenticado em Preview/Producao
   - RLS com dois usuarios reais
   - Stripe Checkout, Customer Portal e webhook assinado
   - OpenAI e Resend em ambiente final
   - GitHub Actions verde

2. Medir funil de ativacao
   - cadastro concluido
   - onboarding concluido
   - primeira resposta gerada
   - resposta copiada
   - resposta salva
   - template usado

3. Consolidar billing operacional
   - status de assinatura
   - limite mensal por plano
   - falhas de webhook
   - casos de pagamento aprovado sem acesso liberado

4. Consolidar suporte
   - categorias agregadas
   - tempo de resposta
   - topicos repetidos
   - ajustes simples de FAQ/copy

5. Monitorar custo OpenAI
   - custo total no painel
   - volume aproximado por periodo
   - alertas operacionais
   - limites conservadores por plano

## P2

- Melhorar onboarding com base nos gargalos medidos.
- Melhorar templates por nicho com base em uso real.
- Ajustar prompt e formatos de resposta com base em feedback agregado.
- Melhorar relatorios internos sem criar BI avancado.
- Melhorar copy de pricing e suporte sem prometer automacao do WhatsApp.

## Futuro

- Campanha pequena adicional somente apos ambiente real validado.
- Testes por nicho/canal quando houver tracking confiavel.
- Relatorios mais detalhados se houver volume real.
- Melhorias de retencao depois de medir retorno e uso recorrente.

## Nao fazer agora

- Integracao direta com WhatsApp.
- Envio automatico de mensagens.
- CRM completo.
- Automacoes avancadas.
- Multiplos atendentes.
- App mobile.
- BI avancado.
- Campanha grande.
- Escala sem dados reais.

