# Plano de Pausa — Campanha Pequena Pós-1.1

## Pausar imediatamente se

* app não abre
* cadastro quebrado
* login quebrado
* onboarding quebrado
* dashboard quebrado
* IA falhando para múltiplos usuários
* checkout quebrado
* webhook quebrado
* admin exposto
* vazamento de dado
* vazamento de secret
* custo OpenAI anormal

## Como pausar

1. Parar divulgação.

2. Pausar anúncios, se existirem.

3. Registrar motivo, horário, ambiente e impacto sem copiar dados sensíveis.

4. Corrigir bug em branch segura.

5. Rodar validações completas.

6. Fazer deploy Preview.

7. Rodar smoke test reduzido.

8. Retomar apenas se aprovado e se o critério de pausa não voltar a ocorrer.

## Comunicação

* Não prometer prazo antes de entender o incidente.
* Usar mensagem amigável e sem detalhes internos ou secrets.
* Se houver suspeita de vazamento, manter a campanha pausada e seguir o processo de incidente e rotação de credenciais.
