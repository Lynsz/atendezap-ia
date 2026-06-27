# Proxima Rodada de Lancamento Pequeno - AtendeZap IA

## Objetivo

Repetir uma rodada pequena apos correcoes especificas e validacao real do ambiente.

## O que mudar

* Validar Preview/Producao antes de convidar usuarios.
* Registrar numeros reais desde o primeiro dia.
* Usar checklist de ativacao antes de divulgar.
* Monitorar admin durante a rodada.
* Classificar qualquer bug como P0/P1/P2 no mesmo ciclo.

## O que manter

* Escopo manual: copiar, ajustar e enviar pelo WhatsApp.
* Sem envio automatico.
* Sem integracao direta com WhatsApp.
* Sem CRM completo.
* Publico pequeno.
* Sem campanha grande.
* Eventos com metadata segura.
* Repositorio privado e sem secrets versionados.

## O que medir melhor

* usuarios alcancados
* visitantes
* cadastros
* onboardings concluidos
* primeiras respostas geradas
* respostas copiadas
* respostas salvas
* templates usados
* acessos a assinatura
* checkouts iniciados
* assinaturas concluidas
* feedbacks positivos
* feedbacks negativos
* suportes abertos
* erros criticos
* custo estimado da OpenAI

## Criterios de sucesso

* cadastro/login/onboarding funcionam em ambiente real
* usuarios geram pelo menos a primeira resposta
* usuarios copiam ou salvam respostas
* usuarios entendem que nao ha envio automatico pelo WhatsApp
* suporte e feedback funcionam
* checkout teste e webhook funcionam
* admin continua protegido
* nenhum P0 aberto
* P1 criticos corrigidos ou documentados

## Criterios de pausa

* cadastro quebrado
* login quebrado
* onboarding quebrado
* dashboard quebrado
* IA falhando para multiplos usuarios
* salvar resposta quebrado
* checkout quebrado
* webhook quebrado
* admin acessivel para usuario comum
* vazamento de secret ou dado sensivel
* erro 500 recorrente em rota critica
